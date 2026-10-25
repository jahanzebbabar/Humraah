import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useI18n } from '@/i18n';
import { palette } from '@/theme';

/** The Figma "Background" layer: radial #F6F6F6 (12%) → #D6CCB7 (89%). */
export function WarmBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="warm" cx="0.9" cy="0.42" r="1.35">
            <Stop offset="0.12" stopColor={palette.paper} />
            <Stop offset="0.89" stopColor={palette.sand} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#warm)" />
      </Svg>
    </View>
  );
}

/**
 * A style that pins layout direction. Native uses `direction`; react-native-web rejects that key
 * (and the dev overlay blocks the page) but maps `writingDirection` to the same CSS `direction`.
 */
export function layoutDirection(dir: 'ltr' | 'rtl'): ViewStyle {
  return (Platform.OS === 'web' ? { writingDirection: dir } : { direction: dir }) as ViewStyle;
}

/** Layout direction for the current language: flips rows, margins and start/end insets for Urdu. */
export function useDirection(): ViewStyle {
  const { isRTL } = useI18n();
  return layoutDirection(isRTL ? 'rtl' : 'ltr');
}

/** Mirror a directional icon (arrows, chevrons, send) in right-to-left layouts. */
export function useFlip(): ViewStyle {
  const { isRTL } = useI18n();
  return { transform: [{ scaleX: isRTL ? -1 : 1 }] };
}

export function Screen({ children, edges = ['top'], style }: { children: ReactNode; edges?: Edge[]; style?: ViewStyle }) {
  const dir = useDirection();
  return (
    <View style={[styles.root, dir]}>
      <WarmBackground />
      <SafeAreaView edges={edges} style={[styles.root, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: palette.paper } });
