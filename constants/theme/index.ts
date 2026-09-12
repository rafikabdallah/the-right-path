/**
 * Single entry point for design tokens.
 *
 * Import tokens from this module (`import { colors, spacing } from
 * '@/constants/theme'`) rather than reaching into the individual token
 * files directly, so the public surface stays stable as tokens evolve.
 */
export { colors, type ColorTokens } from './colors';
export { spacing, type SpacingTokens } from './spacing';
export { radii, type RadiusTokens } from './radii';
export {
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacings,
  textStyles,
  type TextStyleTokens,
} from './typography';
export { shadows, type ShadowTokens } from './shadows';
export { animation, type AnimationTokens } from './animation';
