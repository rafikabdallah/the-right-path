import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors, letterSpacings, spacing, textStyles } from '@/constants/theme';
import { salahAyah } from '@/data/salah';

const GLOW_HEIGHT = 340;
/** How far the glow runs past each screen edge, so it has no visible end. */
const GLOW_BLEED = spacing.xxxl;

/**
 * Screen title and ayah, sitting directly on the background — deliberately
 * not in a card.
 *
 * The purple behind it is atmosphere, not a panel: a radial gradient that
 * fades to fully transparent well before the edges, so it reads as light in
 * the dark rather than a surface. react-native-svg is already a dependency
 * (lucide uses it), so this needs no new library and gives a true smooth
 * falloff instead of stacked translucent discs.
 */
export function SalahHeader() {
  const { width } = useWindowDimensions();
  // Explicit pixel dimensions rather than percentages, so the gradient's
  // viewport never depends on how the SVG happens to be measured.
  const glowWidth = width + GLOW_BLEED * 2;
  const glowLeft = (width - spacing.lg * 2 - glowWidth) / 2;

  return (
    <View style={styles.container}>
      <Svg
        width={glowWidth}
        height={GLOW_HEIGHT}
        style={[styles.glow, { left: glowLeft }]}
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="salahGlow" cx="50%" cy="30%" rx="72%" ry="62%">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.20" />
            <Stop offset="0.5" stopColor={colors.primary} stopOpacity="0.07" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={glowWidth} height={GLOW_HEIGHT} fill="url(#salahGlow)" />
      </Svg>

      <Text style={styles.title}>SALAH</Text>

      <Text style={styles.ayah}>{salahAyah.arabic}</Text>

      <View style={styles.attribution}>
        <Text style={styles.translation}>{salahAyah.translation}</Text>
        <Text style={styles.reference}>{salahAyah.reference}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  glow: {
    position: 'absolute',
    top: -spacing.xxl,
  },
  title: {
    ...textStyles.heading,
    color: colors.textPrimary,
    letterSpacing: letterSpacings.widest,
  },
  ayah: {
    ...textStyles.ayah,
    color: colors.textPrimary,
    textAlign: 'center',
    writingDirection: 'rtl',
    paddingHorizontal: spacing.sm,
  },
  attribution: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  translation: {
    ...textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  reference: {
    ...textStyles.label,
    color: colors.textMuted,
    letterSpacing: letterSpacings.tight,
  },
});
