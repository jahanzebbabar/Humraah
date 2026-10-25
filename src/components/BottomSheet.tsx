import { useEffect, useState, type ReactNode } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n';
import { colors, palette } from '@/theme';
import { duration, ease, easeIn } from '@/theme/motion';
import { useDirection } from './Screen';

const { height: SCREEN_H } = Dimensions.get('window');

/** Slide-up sheet (Figma "Planner - Add Task"). Animates both in and out. */
export function BottomSheet({
  visible,
  onClose,
  color = palette.mint,
  radius = 34,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  color?: string;
  radius?: number;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const dir = useDirection();
  const { t } = useI18n();

  // Mount as soon as we're asked to show; unmount only after the exit animation.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: duration.slow, easing: ease });
    } else {
      progress.value = withTiming(0, { duration: duration.fast, easing: easeIn });
      const t = setTimeout(() => setMounted(false), duration.fast + 20);
      return () => clearTimeout(t);
    }
  }, [visible, progress]);

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [SCREEN_H * 0.6, 0]) }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent onRequestClose={onClose} animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }, backdrop]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('common.close')} />
      </Animated.View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrap} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, dir, { backgroundColor: color, borderTopLeftRadius: radius, borderTopRightRadius: radius, paddingBottom: insets.bottom + 20 }, sheet]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 16, paddingTop: 12, maxHeight: '92%' },
  handle: { alignSelf: 'center', width: 56, height: 6, borderRadius: 3, backgroundColor: palette.graphite, opacity: 0.85, marginBottom: 24 },
});
