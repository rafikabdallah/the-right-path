import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors } from '@/constants/theme';

import { RadialGlow } from './RadialGlow';

interface OrbProps {
  size: number;
  left: number;
  top: number;
  color: string;
  intensity: number;
  duration: number;
  /** Drift direction, in multiples of `animation.ambientDrift`. */
  driftX: number;
  driftY: number;
}

/**
 * One slowly drifting light. Each orb runs its own long cycle so the three
 * never move in lockstep.
 */
function Orb({ size, left, top, color, intensity, duration, driftX, driftY }: OrbProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * animation.ambientDrift * driftX },
      { translateY: progress.value * animation.ambientDrift * driftY },
      { scale: 1 + progress.value * (animation.ambientScaleTo - 1) },
    ],
    opacity: 0.75 + progress.value * 0.25,
  }));

  return (
    <Animated.View style={[styles.orb, { left, top }, animatedStyle]}>
      <RadialGlow width={size} height={size} color={color} intensity={intensity} />
    </Animated.View>
  );
}

/**
 * The app's atmospheric layer: two or three large, heavily diffused violet
 * lights drifting behind everything at 14-21s per cycle.
 *
 * Only this layer moves — content never does. Movement is deliberately
 * slower than the eye tracks, so the screen feels lit rather than animated.
 * The lights are drawn with SVG gradients because Android renders elevation
 * shadows black and cannot blur a colored shadow.
 */
export function AmbientBackdrop() {
  const { width, height } = useWindowDimensions();
  const [slow, slower, slowest] = animation.ambientDurations;

  return (
    <View style={styles.container} pointerEvents="none">
      <Orb
        size={width * 1.15}
        left={-width * 0.35}
        top={-height * 0.12}
        color={colors.primary}
        intensity={0.3}
        duration={slow}
        driftX={1}
        driftY={0.6}
      />
      <Orb
        size={width * 0.95}
        left={width * 0.4}
        top={height * 0.3}
        color={colors.primaryDeep}
        intensity={0.24}
        duration={slower}
        driftX={-0.8}
        driftY={-1}
      />
      <Orb
        size={width * 0.9}
        left={-width * 0.15}
        top={height * 0.72}
        color={colors.primaryStrong}
        intensity={0.16}
        duration={slowest}
        driftX={0.7}
        driftY={-0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
  },
});
