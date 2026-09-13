import { useId } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface GradientStop {
  offset: number;
  color: string;
  opacity: number;
}

interface LinearGlowProps {
  width: number;
  height: number;
  stops: GradientStop[];
  /** Gradient direction, as SVG percentages. Defaults to a 135° diagonal. */
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A linear gradient wash, drawn with react-native-svg (already a dependency
 * via lucide) rather than adding expo-linear-gradient.
 *
 * Used for the tile surfaces in DESIGN.md, which specify a diagonal violet
 * gradient falling away to the canvas color.
 */
export function LinearGlow({
  width,
  height,
  stops,
  x1 = '0%',
  y1 = '0%',
  x2 = '100%',
  y2 = '100%',
  style,
}: LinearGlowProps) {
  // React's useId contains punctuation that isn't valid inside an SVG
  // `url(#…)` reference, so strip it. Unique per instance so several
  // gradients on one screen can't collide.
  const gradientId = `lin${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Svg
      width={width}
      height={height}
      style={[styles.gradient, style]}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <Defs>
        <LinearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
          {stops.map((stop) => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${gradientId})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
  },
});
