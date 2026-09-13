import { useId } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

interface RadialGlowProps {
  width: number;
  height: number;
  /** Peak opacity at the centre. Keep low — this is atmosphere, not paint. */
  intensity?: number;
  color?: string;
  /** Centre of the glow, as SVG percentages. */
  cx?: string;
  cy?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A soft radial glow, drawn rather than shadowed.
 *
 * Android renders elevation shadows black, so `shadowColor` can't produce a
 * colored glow there. Painting the falloff with react-native-svg (already a
 * dependency via lucide) looks identical on both platforms and avoids the
 * banding you get from stacking translucent discs.
 *
 * Always absolutely positioned behind content and non-interactive.
 */
export function RadialGlow({
  width,
  height,
  intensity = 0.22,
  color = colors.primary,
  cx = '50%',
  cy = '50%',
  style,
}: RadialGlowProps) {
  // Unique per instance: several glows on one screen would otherwise share
  // a gradient id and collide. React's useId contains punctuation that isn't
  // valid inside an SVG `url(#…)` reference, so strip it.
  const gradientId = `glow${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Svg
      width={width}
      height={height}
      style={[styles.glow, style]}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <Defs>
        <RadialGradient id={gradientId} cx={cx} cy={cy} rx="70%" ry="70%">
          <Stop offset="0" stopColor={color} stopOpacity={intensity} />
          <Stop offset="0.55" stopColor={color} stopOpacity={intensity * 0.35} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${gradientId})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
});
