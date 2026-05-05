// useMotionPreference — the canonical reduced-motion hook.
//
// Returns the three motion registers (considered/gentle/immediate) plus
// a `reduceMotion` boolean. When the OS Reduce Motion setting is on, all
// three register slots collapse to `motion.immediate` (duration 0, linear)
// so consumers can read `gentle.duration` without branching.
//
// Why not reanimated's `useReducedMotion`: that hook captures the OS
// setting at module-load time and is NOT reactive (verified in
// react-native-reanimated v4.1 source). AccessibilityInfo is the only
// path that re-renders when the user toggles Reduce Motion mid-session.
//
// The `reduceMotion` boolean is exposed for surfaces that can't consume
// a register: LayoutAnimation calls (skip entirely), comprehension gates
// (use a different numeric value, not a motion duration).

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { motion, type MotionRegister } from '../theme/motion';

export type MotionPreference = {
  considered: MotionRegister;
  gentle: MotionRegister;
  immediate: MotionRegister;
  reduceMotion: boolean;
};

export function useMotionPreference(): MotionPreference {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  if (reduceMotion) {
    return {
      considered: motion.immediate,
      gentle: motion.immediate,
      immediate: motion.immediate,
      reduceMotion: true,
    };
  }

  return {
    considered: motion.considered,
    gentle: motion.gentle,
    immediate: motion.immediate,
    reduceMotion: false,
  };
}
