import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, ease } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
};

export function tap() {
  Haptics.selectionAsync().catch(() => {});
}

/** Pressable with a crisp press-in (no spring wobble), the app's single source of tactile feedback. */
export function PressableScale({ style, scaleTo = 0.96, haptic = true, onPressIn, onPressOut, onPress, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...rest}
      onPressIn={(e) => {
        scale.set(withTiming(scaleTo, { duration: duration.tap, easing: ease }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: duration.fast, easing: ease }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) tap();
        onPress?.(e);
      }}
      style={[style, animated]}
    />
  );
}
