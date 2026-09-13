/**
 * Centralized typography tokens, taken from `design-reference/DESIGN.md`.
 *
 * DESIGN.md specifies Plus Jakarta Sans. That font is NOT installed — doing
 * so needs `@expo-google-fonts/plus-jakarta-sans` plus font loading in the
 * root layout, which is a dependency decision. Everything else from the
 * scale (sizes, weights, line heights, tracking) is applied here, so adding
 * the family later is a one-line `fontFamily` addition per style.
 *
 * DESIGN.md expresses tracking in `em`; React Native's `letterSpacing` is in
 * points, so each value below is `fontSize × em`.
 */
export const fontSizes = {
  headlineXl: 40,
  headlineXlMobile: 30,
  headlineLg: 26,
  headlineMd: 20,
  headlineSm: 17,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
  labelLg: 13,
  labelMd: 11,
  labelSm: 9,
  /** Arabic script needs more size than Latin to stay legible. */
  arabic: 25,
} as const;

export const lineHeights = {
  headlineXl: 48,
  headlineXlMobile: 38,
  headlineLg: 34,
  headlineMd: 28,
  headlineSm: 24,
  bodyLg: 26,
  bodyMd: 22,
  bodySm: 18,
  labelLg: 18,
  labelMd: 16,
  labelSm: 12,
  /** Generous, so Arabic diacritics are never clipped (DESIGN.md: min 1.8x). */
  arabic: 48,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Tracking in points, converted from DESIGN.md's em values. */
export const letterSpacings = {
  headlineXl: -1.2,
  headlineXlMobile: -0.75,
  headlineLg: -0.52,
  headlineMd: -0.3,
  headlineSm: -0.17,
  bodyLg: -0.08,
  bodyMd: 0,
  bodySm: 0.12,
  labelLg: 0.52,
  labelMd: 0.88,
  labelSm: 1.08,
  /** Positive tracking for the uppercase screen title. */
  title: 1.5,
  tight: 0.5,
  wide: 2,
  widest: 4,
} as const;

export const textStyles = {
  // --- DESIGN.md scale ---
  headlineXl: {
    fontSize: fontSizes.headlineXl,
    lineHeight: lineHeights.headlineXl,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.headlineXl,
  },
  headlineXlMobile: {
    fontSize: fontSizes.headlineXlMobile,
    lineHeight: lineHeights.headlineXlMobile,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.headlineXlMobile,
  },
  headlineLg: {
    fontSize: fontSizes.headlineLg,
    lineHeight: lineHeights.headlineLg,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.headlineLg,
  },
  headlineMd: {
    fontSize: fontSizes.headlineMd,
    lineHeight: lineHeights.headlineMd,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.headlineMd,
  },
  headlineSm: {
    fontSize: fontSizes.headlineSm,
    lineHeight: lineHeights.headlineSm,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.headlineSm,
  },
  bodyLg: {
    fontSize: fontSizes.bodyLg,
    lineHeight: lineHeights.bodyLg,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.bodyLg,
  },
  bodyMd: {
    fontSize: fontSizes.bodyMd,
    lineHeight: lineHeights.bodyMd,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.bodyMd,
  },
  bodySm: {
    fontSize: fontSizes.bodySm,
    lineHeight: lineHeights.bodySm,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.bodySm,
  },
  labelLg: {
    fontSize: fontSizes.labelLg,
    lineHeight: lineHeights.labelLg,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.labelLg,
  },
  labelMd: {
    fontSize: fontSizes.labelMd,
    lineHeight: lineHeights.labelMd,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.labelMd,
  },
  labelSm: {
    fontSize: fontSizes.labelSm,
    lineHeight: lineHeights.labelSm,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.labelSm,
  },

  /** Uppercase screen title — the headline scale with positive tracking. */
  screenTitle: {
    fontSize: fontSizes.headlineXlMobile,
    lineHeight: lineHeights.headlineXlMobile,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.title,
  },

  /** Qur'anic text. Pair with `writingDirection: 'rtl'`. */
  ayah: {
    fontSize: fontSizes.arabic,
    lineHeight: lineHeights.arabic,
    fontWeight: fontWeights.regular,
  },

  // --- Semantic aliases kept so existing screens keep working ---
  title: {
    fontSize: fontSizes.headlineXl,
    lineHeight: lineHeights.headlineXl,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.headlineXl,
  },
  heading: {
    fontSize: fontSizes.headlineLg,
    lineHeight: lineHeights.headlineLg,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.headlineLg,
  },
  subheading: {
    fontSize: fontSizes.headlineSm,
    lineHeight: lineHeights.headlineSm,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.headlineSm,
  },
  body: {
    fontSize: fontSizes.bodyLg,
    lineHeight: lineHeights.bodyLg,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.bodyLg,
  },
  bodyStrong: {
    fontSize: fontSizes.bodyLg,
    lineHeight: lineHeights.bodyLg,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.bodyLg,
  },
  caption: {
    fontSize: fontSizes.bodyMd,
    lineHeight: lineHeights.bodyMd,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.bodyMd,
  },
  label: {
    fontSize: fontSizes.labelMd,
    lineHeight: lineHeights.labelMd,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.labelMd,
  },
} as const;

export type TextStyleTokens = typeof textStyles;
