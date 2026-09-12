/**
 * Centralized spacing scale (in density-independent pixels).
 * Use `spacing[key]` instead of hardcoded numbers in StyleSheet definitions.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingTokens = typeof spacing;
