import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  LinearTransition,
  ZoomIn,
} from 'react-native-reanimated';

/**
 * One motion language for the whole app: quick, decisive ease-outs with no overshoot.
 * Each screen picks a different entrance so the app never feels copy-pasted.
 */
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.4, 0, 1, 1);
export const duration = { tap: 90, fast: 160, base: 240, slow: 320 } as const;

const STAGGER = 35;
const at = (i: number) => Math.min(i, 10) * STAGGER;

export const enter = {
  /** Content rises into place: cards and headlines. */
  rise: (i = 0) => FadeInDown.duration(duration.base).delay(at(i)).easing(ease),
  /** Slides in from the trailing edge: list rows. */
  slide: (i = 0) => FadeInRight.duration(duration.base).delay(at(i)).easing(ease),
  /** Slides in from the leading edge: timelines. */
  slideStart: (i = 0) => FadeInLeft.duration(duration.base).delay(at(i)).easing(ease),
  /** Drops down: chat bubbles and toasts. */
  drop: (i = 0) => FadeInUp.duration(duration.fast).delay(at(i)).easing(ease),
  /** Plain fade: backgrounds and large surfaces. */
  fade: (i = 0) => FadeIn.duration(duration.base).delay(at(i)).easing(ease),
  /** Small pop: checkmarks, badges, success icons. */
  pop: (i = 0) => ZoomIn.duration(duration.fast).delay(at(i)).easing(ease),
};

export const exit = {
  fade: FadeOut.duration(duration.fast).easing(easeIn),
  slide: FadeOutLeft.duration(duration.fast).easing(easeIn),
};

export const layout = LinearTransition.duration(duration.base).easing(ease);
