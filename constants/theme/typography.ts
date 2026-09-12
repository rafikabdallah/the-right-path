/**
 * Centralized typography tokens.
 * `fontSizes` / `lineHeights` / `fontWeights` are raw scales; `textStyles`
 * are the semantic combinations components should actually use.
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** Arabic script needs more size than Latin to stay legible. */
  arabic: 25,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  /** Generous, so Arabic diacritics are never clipped. */
  arabic: 48,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const textStyles = {
  title: {
    fontSize: fontSizes.xxxl,
    lineHeight: lineHeights.xxxl,
    fontWeight: fontWeights.bold,
  },
  heading: {
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
    fontWeight: fontWeights.semibold,
  },
  subheading: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
  },
  bodyStrong: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.medium,
  },
  caption: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
  },
  label: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
  },
  /** Qur'anic text. Pair with `writingDirection: 'rtl'`. */
  ayah: {
    fontSize: fontSizes.arabic,
    lineHeight: lineHeights.arabic,
    fontWeight: fontWeights.regular,
  },
} as const;

/** Wide tracking for the small uppercase section labels. */
export const letterSpacings = {
  tight: 0.5,
  wide: 2,
  widest: 4,
} as const;

export type TextStyleTokens = typeof textStyles;
