// Motion in Cornr is considered, not theatrical.
// A premium app has things moving smoothly — never popping.
// These three registers are the only animation timings in production code.
//
// Reduced-motion users (iOS Settings → Accessibility → Motion → Reduce
// Motion) get zero-duration fallbacks — see useMotionPreference.
//
// Direct use of reanimated primitives (withSpring, etc.) is permitted
// in worklet-heavy contexts (SwipeCard). Non-worklet surfaces should
// consume motion registers via useMotionPreference.
//
// Note on reanimated: react-native-reanimated's `useReducedMotion` is
// captures-once-at-module-load (not reactive). Use the project
// `useMotionPreference` hook for new surfaces. Direct reanimated usage
// remains acceptable only in worklet-heavy contexts that re-render
// frequently (SwipeCard).

import { Easing } from 'react-native-reanimated';

// EasingFunction = (t: number) => number — compatible with both
// reanimated's withTiming and RN core Animated.timing. Easing.bezierFn
// returns this shape directly (Easing.bezier returns a factory).
export type EasingFn = (t: number) => number;

export type MotionRegister = {
  duration: number;
  easing: EasingFn;
};

export const motion = {
  considered: {
    duration: 600,
    easing: Easing.bezierFn(0.16, 1, 0.3, 1), // premium ease-out — weight at the end
  },
  gentle: {
    duration: 300,
    easing: Easing.bezierFn(0.4, 0, 0.2, 1), // standard smooth, low-drama
  },
  immediate: {
    duration: 0,
    easing: Easing.linear,
  },
} as const;

export type MotionRegisterId = keyof typeof motion;
