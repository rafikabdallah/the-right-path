/**
 * Centralized color tokens.
 *
 * Color carries meaning in this app, and the roles below are fixed (see
 * CLAUDE.md "Color logic"):
 *
 *   dark/black  → background, inactive, waiting
 *   purple      → brand, current, selected, navigation, destinations
 *   green       → completed, and nothing else
 *   white       → primary text
 *   light purple / slate → secondary information
 *
 * Purple surfaces are *actually purple* — solid `#7C3AED` or a
 * `#7C3AED → #A855F7` gradient — never a near-black card with a faint
 * violet tint. Depth comes from glow and border, not from mixing the
 * accent down into the background.
 *
 * `palette` holds raw values — never reference these directly in
 * components. `colors` maps them to semantic roles, so the whole app
 * re-themes by editing this file alone.
 */

const palette = {
  white: '#FFFFFF',
  whiteSoft: '#F8FAFC',

  // Brand violet — saturated, used at full strength on surfaces.
  purple: '#A855F7',
  purpleStrong: '#7C3AED',
  purpleBright: '#C084FC',
  purpleLight: '#D8B4FE',
  purpleDeep: '#6D28D9',
  purpleMid: '#8B5CF6',
  purpleVivid: '#9333EA',

  // Canvas.
  backgroundDeep: '#0F0D14',
  backgroundRaised: '#151219',

  // Neutral card surfaces — the "waiting / inactive" family.
  surface1: '#1D1A21',
  surface2: '#27242C',
  surfacePending: '#16131C',
  /** Dark violet ground for text surfaces that should read purple-ish. */
  surfaceVioletMuted: '#1C1430',

  // Translucent glass. These sit over the night background, so they must
  // stay see-through — an opaque panel would erase the mosque behind it.
  glass: 'rgba(24, 17, 40, 0.62)',
  glassStrong: 'rgba(18, 13, 30, 0.78)',
  glassPending: 'rgba(10, 8, 16, 0.66)',
  /** Readability wash over the background image, top to bottom. */
  scrimTop: 'rgba(10, 8, 16, 0.30)',
  scrimBottom: 'rgba(10, 8, 16, 0.92)',
  /** Base for the navigation isolation zone. */
  scrimNav: '#0A0810',
  /** The dock strip itself — near-opaque so nothing reads through it. */
  scrimNavSolid: 'rgba(10, 8, 16, 0.97)',

  // Glows are drawn, not shadowed — Android renders elevation shadows black.
  glowStrong: 'rgba(168, 85, 247, 0.55)',
  haloInner: 'rgba(168, 85, 247, 0.34)',
  haloOuter: 'rgba(124, 58, 237, 0.18)',

  // Borders.
  hairline: 'rgba(255, 255, 255, 0.08)',
  borderViolet: 'rgba(168, 85, 247, 0.45)',
  borderVioletSoft: 'rgba(168, 85, 247, 0.25)',
  /** Thin light-purple edge that catches light on a purple surface. */
  borderVioletLight: 'rgba(216, 180, 254, 0.55)',
  outlineVariant: '#3A3545',

  // Text.
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  /** Secondary text sitting on a saturated purple surface. */
  onAccentMuted: 'rgba(255, 255, 255, 0.78)',
  /** Translucent white inset on a saturated purple surface. */
  onAccentSurface: 'rgba(255, 255, 255, 0.16)',

  // Emerald means one thing only: completion. Never decorative.
  green: '#10B981',
  greenDeep: '#059669',
  greenBorder: 'rgba(167, 243, 208, 0.55)',
  greenGlow: 'rgba(16, 185, 129, 0.30)',
  greenSurfaceSoft: '#0B2A22',
  /** Completed prayer row — dark emerald glass, not a flat green fill. */
  greenGlass: 'rgba(6, 60, 45, 0.72)',

  error: '#FFB4AB',

  /** A cooler, deeper surface for the night-prayer section. */
  night900: '#12101C',
  night700: '#2A2740',

  /** Cinematic dimming scrim behind a modal sheet. */
  scrim: 'rgba(4, 2, 8, 0.75)',
} as const;

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  /** Highest neutral step — chips and inset controls. */
  surfaceHigh: string;
  /** Saturated purple card surface — destinations and active controls. */
  surfacePurple: string;
  /** Lifted violet surface. */
  surfacePurpleRaised: string;
  /** Dark violet ground for text-led cards (never a destination). */
  surfaceVioletMuted: string;
  /** Translucent panel over the night background. */
  glass: string;
  glassStrong: string;
  /** Readability wash over the background image. */
  scrimTop: string;
  scrimBottom: string;
  /** Base color of the fade that isolates the dock from scrolling content. */
  navScrim: string;
  /** Fill behind the dock row. */
  navSurface: string;
  /** Cooler, deeper surface used only by the night-prayer section. */
  surfaceNight: string;
  border: string;
  borderStrong: string;
  borderNight: string;
  borderPurple: string;
  borderPurpleSoft: string;
  /** Thin light-purple edge for saturated purple surfaces. */
  borderAccent: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  /** Text sitting on a filled primary surface. */
  textInverse: string;
  /** Icons/labels on the luminous accent fill. */
  textOnAccent: string;
  /** Secondary text on the accent fill. */
  textOnAccentMuted: string;
  /** Inset surface (icon circles) on a saturated purple card. */
  surfaceOnAccent: string;

  primary: string;
  /** Saturated surface fill — the base of every purple card. */
  primaryStrong: string;
  /** Light violet for titles and accents on dark surfaces. */
  primaryLight: string;
  primaryBright: string;
  primaryDeep: string;
  /** Saturated fill for the active nav indicator and primary buttons. */
  primaryContainer: string;
  primaryPressed: string;
  primaryGlow: string;
  primaryHaloInner: string;
  primaryHaloOuter: string;
  /** For a surface that should read through to whatever is behind it. */
  transparent: string;
  /** Dim behind a modal sheet. */
  backdrop: string;

  danger: string;

  // --- Prayer state roles. Exactly three, never mixed. ---
  /** Waiting: a dark card, no purple fill. */
  statePendingSurface: string;
  statePendingBorder: string;
  /** Current: the only daily prayer that is purple by default. */
  stateCurrentSurface: string;
  stateCurrentBorder: string;
  /** Completed. */
  stateCompleteSurface: string;
  stateCompleteBorder: string;

  /** Completion accent — also used for the drawn green glow. */
  success: string;
  surfaceSuccess: string;
  borderSuccess: string;
  successGlow: string;

  // Four pillar accents — a quiet identity tint per pillar (placeholder
  // screen headers today). Nav active state and glows use the shared violet.
  pillarSpiritual: string;
  pillarMind: string;
  pillarBody: string;
  pillarCharacter: string;
}

export const colors: ColorTokens = {
  background: palette.backgroundDeep,
  surface: palette.surface1,
  surfaceAlt: palette.backgroundRaised,
  surfaceHigh: palette.surface2,
  surfacePurple: palette.purpleStrong,
  surfacePurpleRaised: palette.purple,
  surfaceVioletMuted: palette.surfaceVioletMuted,
  glass: palette.glass,
  glassStrong: palette.glassStrong,
  scrimTop: palette.scrimTop,
  scrimBottom: palette.scrimBottom,
  navScrim: palette.scrimNav,
  navSurface: palette.scrimNavSolid,
  surfaceNight: palette.night900,
  border: palette.hairline,
  borderStrong: palette.outlineVariant,
  borderNight: palette.night700,
  borderPurple: palette.borderViolet,
  borderPurpleSoft: palette.borderVioletSoft,
  borderAccent: palette.borderVioletLight,

  textPrimary: palette.white,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,
  textInverse: palette.white,
  textOnAccent: palette.white,
  textOnAccentMuted: palette.onAccentMuted,
  surfaceOnAccent: palette.onAccentSurface,

  primary: palette.purple,
  primaryStrong: palette.purpleStrong,
  primaryLight: palette.purpleLight,
  primaryBright: palette.purpleBright,
  primaryDeep: palette.purpleDeep,
  primaryContainer: palette.purple,
  primaryPressed: palette.purpleDeep,
  primaryGlow: palette.glowStrong,
  primaryHaloInner: palette.haloInner,
  primaryHaloOuter: palette.haloOuter,
  transparent: 'transparent',
  backdrop: palette.scrim,

  danger: palette.error,

  statePendingSurface: palette.glassPending,
  statePendingBorder: palette.borderVioletSoft,
  stateCurrentSurface: palette.purpleMid,
  stateCurrentBorder: palette.borderVioletLight,
  stateCompleteSurface: palette.greenGlass,
  stateCompleteBorder: palette.greenBorder,

  success: palette.green,
  surfaceSuccess: palette.greenSurfaceSoft,
  borderSuccess: palette.greenBorder,
  successGlow: palette.greenGlow,

  // Spiritual takes the house violet — emerald is reserved for completion.
  pillarSpiritual: palette.purpleBright,
  pillarMind: '#60A5FA',
  pillarBody: '#FB923C',
  pillarCharacter: '#FB7185',
};
