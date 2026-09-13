import { Platform } from 'react-native';

import { colors } from './colors';

/**
 * Centralized elevation/glow tokens.
 *
 * On a near-black background a plain black drop shadow is nearly invisible,
 * so cards are lifted with a soft, low-opacity glow instead. Spread these
 * into a component's StyleSheet entry, e.g.:
 *
 *   card: { ...shadows.card, backgroundColor: colors.surface }
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

function shadow(color: string, opacity: number, radius: number, elevation: number): ShadowStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: Math.round(radius / 3) },
    shadowOpacity: Platform.OS === 'ios' ? opacity : opacity * 0.9,
    shadowRadius: radius,
    elevation,
  };
}

const black = '#000000';

/**
 * Elevation tiers from DESIGN.md. Note that only the black shadows render
 * on Android — a colored `shadowColor` is ignored there, so `glowPurple` is
 * an iOS enhancement and any glow that must appear on Android is drawn with
 * `RadialGlow` instead.
 */
export const shadows = {
  none: shadow(black, 0, 0, 0),
  /** Tier 2 — elevated cards and tiles. */
  card: shadow(black, 0.5, 20, 6),
  /** Tier 3 — floating docks and sheets. */
  raised: shadow(black, 0.6, 32, 10),
  glowPurple: shadow(colors.primaryContainer, 0.45, 20, 10),
} as const;

export type ShadowTokens = typeof shadows;
