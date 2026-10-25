import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { CalendarDays, House, MessageCircle, Settings, Users, type LucideIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PressableScale } from '@/components/PressableScale';
import { layoutDirection } from '@/components/Screen';
import { useI18n, type StringKey } from '@/i18n';
import { duration, ease } from '@/theme/motion';
import { floatShadow, radiusV3, v3 } from './tokens';

const ITEMS: { name: string; icon: LucideIcon; label: StringKey }[] = [
  { name: 'index', icon: House, label: 'nav.home' },
  { name: 'planner', icon: CalendarDays, label: 'planner.title' },
  { name: 'chat', icon: MessageCircle, label: 'chat.accent' },
  { name: 'consultants', icon: Users, label: 'consult.title' },
  { name: 'settings', icon: Settings, label: 'settings.accent' },
];

const SLOT = 60;
const PILL_W = 52;
const PILL_H = 40;

/** Design 3 tab bar: a translucent glass capsule; a solid black pill glides behind the active icon. */
export function NavCapsuleV3({ state, navigateToTab, insets }: BottomTabBarProps) {
  const { t, isRTL } = useI18n();
  const router = useRouter();
  const current = state.routes[state.index]?.name ?? 'index';
  const activeIndex = Math.max(0, ITEMS.findIndex((i) => i.name === current));
  const visualIndex = isRTL ? ITEMS.length - 1 - activeIndex : activeIndex;
  const x = useSharedValue(visualIndex * SLOT);
  const hidden = useSharedValue(0);

  useEffect(() => {
    // translateX only: the pill animates on the UI thread without re-laying out the bar.
    x.value = withTiming(visualIndex * SLOT, { duration: duration.base, easing: ease });
  }, [visualIndex, x]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => (hidden.value = withTiming(1, { duration: duration.fast })));
    const hide = Keyboard.addListener('keyboardDidHide', () => (hidden.value = withTiming(0, { duration: duration.fast })));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [hidden]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const wrap = useAnimatedStyle(() => ({ opacity: 1 - hidden.value, transform: [{ translateY: hidden.value * 140 }] }));

  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) }, wrap]}>
      <View style={[styles.capsule, Platform.OS !== 'android' && floatShadow]}>
        <BlurView intensity={50} tint="light" style={[StyleSheet.absoluteFill, styles.round]} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.round, styles.glass]} />
        <View style={[styles.row, layoutDirection('ltr')]}>
          <Animated.View pointerEvents="none" style={[styles.pill, pill]} />
          {(isRTL ? [...ITEMS].reverse() : ITEMS).map((item) => {
            const route = state.routes.find((r) => r.name === item.name);
            const active = item.name === current;
            const Icon = item.icon;
            return (
              <PressableScale
                key={item.name}
                accessibilityRole="tab"
                accessibilityLabel={t(item.label)}
                accessibilityState={{ selected: active }}
                scaleTo={0.88}
                style={styles.item}
                onPress={() => {
                  if (!route) return;
                  if (active) router.navigate(item.name === 'index' ? '/' : `/${item.name}`);
                  else navigateToTab(route.key);
                }}
              >
                <Icon size={21} strokeWidth={1.5} color={active ? v3.white : v3.black} />
              </PressableScale>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  capsule: { borderRadius: radiusV3.pill },
  round: { borderRadius: radiusV3.pill, overflow: 'hidden' },
  glass: { backgroundColor: v3.glass, borderWidth: 1, borderColor: v3.edge },
  row: { flexDirection: 'row', padding: 7 },
  pill: { position: 'absolute', top: 7 + (SLOT - 8 - PILL_H) / 2, left: 7 + (SLOT - PILL_W) / 2, width: PILL_W, height: PILL_H, borderRadius: radiusV3.pill, backgroundColor: v3.black },
  item: { width: SLOT, height: SLOT - 8, alignItems: 'center', justifyContent: 'center' },
});
