import { BlurView } from 'expo-blur';
import { useRouter, type Href } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Bell, BookOpen, CalendarDays, ChevronRight, House, Menu, Settings, Users, X, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from '@/components/PressableScale';
import { useDirection, useFlip } from '@/components/Screen';
import { notifications } from '@/data/mock';
import { useI18n, type StringKey } from '@/i18n';
import { useAppStore } from '@/store/AppStore';
import { duration, ease } from '@/theme/motion';
import { LangV3, T } from './kit';
import { floatShadow, GUTTER_V3, radiusV3, v3 } from './tokens';

export type NavItem = { name: string; icon: LucideIcon; label: StringKey };

export const MOTHER_ITEMS: NavItem[] = [
  { name: 'index', icon: House, label: 'tab.home' },
  { name: 'planner', icon: CalendarDays, label: 'tab.planner' },
  { name: 'library', icon: BookOpen, label: 'tab.library' },
  { name: 'consultants', icon: Users, label: 'tab.consultants' },
  { name: 'settings', icon: Settings, label: 'tab.settings' },
];

/** Width at which the header shows every link inline instead of behind a menu button. */
export const WIDE = 860;
const BAR_H = 64;

function Brand({ onPress }: { onPress: () => void }) {
  const { t } = useI18n();
  return (
    <PressableScale onPress={onPress} scaleTo={0.97} accessibilityLabel={t('brand')} style={styles.brand}>
      <View style={styles.mark}>
        <Text style={styles.markText}>ھ</Text>
      </View>
      <T size={19} weight="semibold" style={{ letterSpacing: -0.4 }}>
        {t('brand')}
      </T>
    </PressableScale>
  );
}

/**
 * The app's navigation, web-app style: a frosted header pinned to the top. Wide screens list every
 * section inline; phones get the brand, reminders and a menu button that drops down the same links.
 */
export function AppHeaderV3({ state, navigateToTab, items = MOTHER_ITEMS, base = '', showBell = true }: BottomTabBarProps & { items?: NavItem[]; base?: string; showBell?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dir = useDirection();
  const flip = useFlip();
  const { readNotifications } = useAppStore();
  const [open, setOpen] = useState(false);
  const wide = width >= WIDE;
  const current = state.routes[state.index]?.name ?? 'index';
  const unread = notifications.some((n) => !readNotifications.includes(n.id));

  const go = (item: NavItem) => {
    setOpen(false);
    const route = state.routes.find((r) => r.name === item.name);
    if (!route) return;
    // Tapping the section you're in returns to its first page, like a web app's top-level link.
    if (item.name === current) router.navigate((item.name === 'index' ? base || '/' : `${base}/${item.name}`) as Href);
    else navigateToTab(route.key);
  };

  const bell = showBell && (
    <PressableScale onPress={() => router.push('/notifications')} accessibilityLabel={t('notif.title')} style={styles.iconBtn}>
      <Bell size={19} color={v3.black} strokeWidth={1.6} />
      {unread && <View style={styles.dot} />}
    </PressableScale>
  );

  return (
    <View style={[styles.bar, { paddingTop: insets.top }, Platform.OS !== 'android' && styles.barShadow]}>
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.barGlass]} />

      <View style={[styles.inner, dir]}>
        <Brand onPress={() => go(items[0])} />

        {wide ? (
          <>
            <View accessibilityRole="tablist" style={styles.links}>
              {items.map((item) => {
                const active = item.name === current;
                const Icon = item.icon;
                return (
                  <PressableScale
                    key={item.name}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    scaleTo={0.95}
                    onPress={() => go(item)}
                    style={[styles.link, active && styles.linkActive]}
                  >
                    <Icon size={17} strokeWidth={1.6} color={active ? v3.white : v3.black} />
                    <T size={14} weight={active ? 'medium' : 'regular'} color={active ? v3.white : v3.black}>
                      {t(item.label)}
                    </T>
                  </PressableScale>
                );
              })}
            </View>
            <View style={styles.actions}>
              <LangV3 />
              {bell}
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            {bell}
            <PressableScale onPress={() => setOpen(true)} accessibilityLabel={t('header.menu')} accessibilityState={{ expanded: open }} style={[styles.iconBtn, styles.menuBtn]}>
              <Menu size={19} color={v3.white} strokeWidth={1.8} />
            </PressableScale>
          </View>
        )}
      </View>

      {/* Phone menu: a panel that drops from the header over a dimmed page. */}
      <Modal visible={open && !wide} transparent animationType="none" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Animated.View entering={FadeIn.duration(duration.fast)} style={StyleSheet.absoluteFill}>
          <Pressable accessibilityLabel={t('header.close')} onPress={() => setOpen(false)} style={[StyleSheet.absoluteFill, styles.scrim]} />
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(duration.base).easing(ease)} style={[styles.sheet, { paddingTop: insets.top }, dir]}>
          <View style={styles.inner}>
            <Brand onPress={() => go(items[0])} />
            <PressableScale onPress={() => setOpen(false)} accessibilityLabel={t('header.close')} style={styles.iconBtn}>
              <X size={19} color={v3.black} strokeWidth={1.8} />
            </PressableScale>
          </View>
          <View style={styles.menuList}>
            {items.map((item) => {
              const active = item.name === current;
              const Icon = item.icon;
              return (
                <PressableScale key={item.name} accessibilityState={{ selected: active }} scaleTo={0.98} onPress={() => go(item)} style={[styles.menuRow, active && styles.linkActive]}>
                  <Icon size={20} strokeWidth={1.6} color={active ? v3.white : v3.black} />
                  <T size={17} weight={active ? 'medium' : 'light'} color={active ? v3.white : v3.black} style={{ flex: 1 }}>
                    {t(item.label)}
                  </T>
                  <ChevronRight size={18} strokeWidth={1.5} color={active ? v3.white : v3.muted} style={flip} />
                </PressableScale>
              );
            })}
          </View>
          <View style={styles.menuFoot}>
            <T size={13} color={v3.muted}>
              {t('header.language')}
            </T>
            <LangV3 />
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { zIndex: 10 },
  barShadow: { shadowColor: '#3A2E2A', shadowOpacity: 0.06, shadowRadius: 18, shadowOffset: { width: 0, height: 6 } },
  barGlass: { backgroundColor: 'rgba(244, 243, 240, 0.72)', borderBottomWidth: 1, borderBottomColor: v3.hairline },
  inner: { height: BAR_H, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: GUTTER_V3, width: '100%', maxWidth: 1240, alignSelf: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 36, height: 36, borderRadius: 12, backgroundColor: v3.sage, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: v3.edge },
  markText: { fontFamily: 'NotoNastaliqUrdu_500Medium', fontSize: 24, lineHeight: 40, color: v3.black, marginTop: -4 },
  links: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingHorizontal: 16, borderRadius: radiusV3.pill },
  linkActive: { backgroundColor: v3.black },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginStart: 'auto' },
  iconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: v3.glassStrong, borderWidth: 1, borderColor: v3.edge },
  menuBtn: { backgroundColor: v3.black, borderColor: v3.black },
  dot: { position: 'absolute', top: 9, end: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: v3.black, borderWidth: 1.5, borderColor: v3.white },
  scrim: { backgroundColor: 'rgba(20, 16, 14, 0.28)' },
  sheet: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: v3.bone, borderBottomLeftRadius: radiusV3.card, borderBottomRightRadius: radiusV3.card, paddingBottom: 18, ...floatShadow },
  menuList: { paddingHorizontal: GUTTER_V3 - 8, paddingTop: 6, gap: 4 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54, paddingHorizontal: 16, borderRadius: radiusV3.inner },
  menuFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginHorizontal: GUTTER_V3, paddingTop: 14, borderTopWidth: 1, borderTopColor: v3.hairline },
});
