import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

const CIRCLE_SIZE = 40;

interface PillarTransitionOverlayProps {
  /** 0 -> 1 drives the whole expand-then-reveal sequence. */
  progress: SharedValue<number>;
  /** Tap origin, in window coordinates. */
  originX: SharedValue<number>;
  originY: SharedValue<number>;
  /** Current pillar accent color for this transition. */
  color: SharedValue<string>;
}

/**
 * The pillar-switch transition: a circle of the target pillar's accent
 * color grows from the tapped nav item until it covers the screen, then
 * fades out to reveal the new screen underneath (see CLAUDE.md
 * "Navigation & transition"). Purely presentational — the caller drives
 * `progress` and swaps the underlying route while the circle is opaque.
 */
export function PillarTransitionOverlay({
  progress,
  originX,
  originY,
  color,
}: PillarTransitionOverlayProps) {
  const { width, height } = useWindowDimensions();
  const maxRadius = Math.sqrt(width * width + height * height);
  const maxScale = (maxRadius * 2) / CIRCLE_SIZE;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [0, maxScale, maxScale], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [1, 1, 0], Extrapolation.CLAMP);

    return {
      backgroundColor: color.value,
      opacity,
      transform: [
        { translateX: originX.value - CIRCLE_SIZE / 2 },
        { translateY: originY.value - CIRCLE_SIZE / 2 },
        { scale },
      ],
    };
  });

  return <Animated.View pointerEvents="none" style={[styles.circle, animatedStyle]} />;
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
