/**
 * Centralized color tokens.
 *
 * `palette` holds raw, named color values — never reference these directly
 * in components. `colors` maps palette values to semantic roles that
 * components should consume instead (e.g. `colors.background`, not
 * `palette.zinc950`). This indirection lets the whole app re-theme by
 * editing this file alone.
 *
 * Visual identity (see CLAUDE.md "Visual identity"): near-black background,
 * white text, purple as a *selective* shared brand accent, plus one distinct
 * accent color per pillar. The app has a single (dark) theme by design —
 * there is no light-mode variant.
 */

const palette = {
  white: '#FFFFFF',
  black: '#000000',

  // Near-black neutrals, from background up through elevated surfaces.
  zinc950: '#0A0A0D',
  zinc900: '#131317',
  zinc850: '#18181D',
  zinc800: '#1F1F26',
  zinc700: '#2A2A33',
  zinc600: '#3A3A45',
  zinc400: '#8A8A97',
  zinc300: '#B4B4BF',
  zinc100: '#E9E9ED',

  // Purple — the single shared brand accent, used selectively.
  purple400: '#A78BFA',
  purple500: '#8B5CF6',
  purple600: '#7C3AED',
  purpleSurface: '#1B1730',
  purpleGlow: 'rgba(139, 92, 246, 0.35)',

  // One distinct accent per pillar.
  emerald400: '#34D399',
  sky400: '#60A5FA',
  amber400: '#FB923C',
  rose400: '#FB7185',

  red500: '#EF4444',
} as const;

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfacePurple: string;
  border: string;
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  primary: string;
  primaryPressed: string;
  primaryGlow: string;

  danger: string;

  // Four pillar accents — each pillar's icon tint and transition-sweep color.
  pillarSpiritual: string;
  pillarMind: string;
  pillarBody: string;
  pillarCharacter: string;
}

export const colors: ColorTokens = {
  background: palette.zinc950,
  surface: palette.zinc900,
  surfaceAlt: palette.zinc850,
  surfacePurple: palette.purpleSurface,
  border: palette.zinc700,
  borderStrong: palette.zinc600,

  textPrimary: palette.white,
  textSecondary: palette.zinc300,
  textMuted: palette.zinc400,
  textInverse: palette.zinc950,

  primary: palette.purple400,
  primaryPressed: palette.purple600,
  primaryGlow: palette.purpleGlow,

  danger: palette.red500,

  pillarSpiritual: palette.emerald400,
  pillarMind: palette.sky400,
  pillarBody: palette.amber400,
  pillarCharacter: palette.rose400,
};
