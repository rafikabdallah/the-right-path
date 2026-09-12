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
  // purple400 is deliberately luminous: it should read as a glowing object
  // against the near-black background, not as a flat tint.
  purple400: '#B292FF',
  purple500: '#8B5CF6',
  purple600: '#7C3AED',
  purpleSurface: '#1B1730',
  purpleGlow: 'rgba(178, 146, 255, 0.35)',
  // Translucent discs layered behind the active nav bubble. Android can't
  // render colored shadows, so the glow is drawn, not shadowed.
  purpleHaloInner: 'rgba(178, 146, 255, 0.22)',
  purpleHaloOuter: 'rgba(178, 146, 255, 0.10)',

  // One distinct accent per pillar.
  emerald400: '#34D399',
  sky400: '#60A5FA',
  amber400: '#FB923C',
  rose400: '#FB7185',

  red500: '#EF4444',

  /** A cooler, deeper surface for the night-prayer section. */
  night900: '#10111C',
  night700: '#242640',

  /** Dim behind a modal sheet. */
  scrim: 'rgba(0, 0, 0, 0.6)',
} as const;

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfacePurple: string;
  /** Cooler, deeper surface used only by the night-prayer section. */
  surfaceNight: string;
  border: string;
  borderStrong: string;
  borderNight: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  primary: string;
  primaryPressed: string;
  primaryGlow: string;
  primaryHaloInner: string;
  primaryHaloOuter: string;
  /** For a surface that should read through to whatever is behind it. */
  transparent: string;
  /** Dim behind a modal sheet. */
  backdrop: string;

  danger: string;

  // Four pillar accents — a quiet identity tint per pillar (placeholder
  // screen headers today). Nav active state and the transition sweep use
  // the shared purple accent, not these.
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
  surfaceNight: palette.night900,
  border: palette.zinc700,
  borderStrong: palette.zinc600,
  borderNight: palette.night700,

  textPrimary: palette.white,
  textSecondary: palette.zinc300,
  textMuted: palette.zinc400,
  textInverse: palette.zinc950,

  primary: palette.purple400,
  primaryPressed: palette.purple600,
  primaryGlow: palette.purpleGlow,
  primaryHaloInner: palette.purpleHaloInner,
  primaryHaloOuter: palette.purpleHaloOuter,
  transparent: 'transparent',
  backdrop: palette.scrim,

  danger: palette.red500,

  pillarSpiritual: palette.emerald400,
  pillarMind: palette.sky400,
  pillarBody: palette.amber400,
  pillarCharacter: palette.rose400,
};
