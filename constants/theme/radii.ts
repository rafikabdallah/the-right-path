/**
 * Centralized border-radius scale, from `design-reference/DESIGN.md`
 * (sm 0.5rem, DEFAULT 1rem, md 1.5rem, lg 2rem, xl 3rem, full).
 *
 * DESIGN.md prohibits sharp corners: pills are full capsules, cards use
 * 24–32, interactive tiles 20–24.
 */
export const radii = {
  none: 0,
  sm: 8,
  md: 16,
  /** Interactive tiles. */
  lg: 24,
  /** Cards, sheets and hero surfaces. */
  xl: 32,
  xxl: 48,
  full: 9999,
} as const;

export type RadiusTokens = typeof radii;
