import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { tokens } from '../../theme/tokens';
import { createLogger } from '../../../lib/log';

const log = createLogger('SwipeCard');

export type SwipeCardProps = {
  imageUrl: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  onSwipeLove: () => void;
  onSwipePass: () => void;
  /**
   * Optional style passed by parent (e.g. SwipeDeck for stack positioning).
   * MUST NOT include `transform` — SwipeCard's animated transform is reserved.
   * Use `top`, `left`, `marginTop`, etc. for stack offsets.
   */
  style?: ViewStyle;
};

function SwipeCardImpl({
  imageUrl,
  accessibilityLabel,
  accessibilityHint = "Swipe right if you like this style, swipe left if you don't",
  onSwipeLove,
  onSwipePass,
  style,
}: SwipeCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    log.debug('mounted', { id: accessibilityLabel });
  }, [accessibilityLabel]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const triggerCommitHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  const triggerSpringBackHaptic = () => {
    Haptics.selectionAsync();
  };

  const VELOCITY_THRESHOLD = 1200;
  const DISPLACEMENT_THRESHOLD = screenWidth * 0.38;
  const OVERLAY_FULL_AT = screenWidth * 0.25;
  const THROW_DURATION = reduceMotion ? 0 : 250;
  const SPRING_CONFIG = { stiffness: 200, damping: 20 };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationX * 0.1;
    })
    .onEnd((event) => {
      'worklet';
      const shouldThrowRight =
        event.velocityX > VELOCITY_THRESHOLD || translateX.value > DISPLACEMENT_THRESHOLD;
      const shouldThrowLeft =
        event.velocityX < -VELOCITY_THRESHOLD || translateX.value < -DISPLACEMENT_THRESHOLD;

      if (shouldThrowRight) {
        runOnJS(triggerCommitHaptic)();
        translateX.value = withTiming(
          screenWidth * 1.2,
          { duration: THROW_DURATION },
          (finished) => {
            if (finished) runOnJS(onSwipeLove)();
          }
        );
      } else if (shouldThrowLeft) {
        runOnJS(triggerCommitHaptic)();
        translateX.value = withTiming(
          -screenWidth * 1.2,
          { duration: THROW_DURATION },
          (finished) => {
            if (finished) runOnJS(onSwipePass)();
          }
        );
      } else {
        runOnJS(triggerSpringBackHaptic)();
        if (reduceMotion) {
          translateX.value = withTiming(0, { duration: 0 });
          translateY.value = withTiming(0, { duration: 0 });
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
          translateY.value = withSpring(0, SPRING_CONFIG);
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const loveOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, OVERLAY_FULL_AT],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const passOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-OVERLAY_FULL_AT, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.card, style, animatedStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        <Animated.View style={[styles.overlay, styles.loveOverlay, loveOverlayStyle]}>
          <Text style={styles.overlayText}>✓ LOVE IT</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.passOverlay, passOverlayStyle]}>
          <Text style={styles.overlayText}>✗ NOT FOR ME</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export const SwipeCard = memo(SwipeCardImpl);

const styles = StyleSheet.create({
  card: {
    aspectRatio: 3 / 4,
    width: '100%',
    borderRadius: tokens.radius.swipe,
    backgroundColor: tokens.colors.warm100,
    overflow: 'hidden',
    transformOrigin: 'bottom center',
    ...tokens.shadow.swipe,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loveOverlay: {
    backgroundColor: tokens.colors.swipeOverlayLove,
  },
  passOverlay: {
    backgroundColor: tokens.colors.swipeOverlayPass,
  },
  overlayText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 22,
    color: tokens.colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
