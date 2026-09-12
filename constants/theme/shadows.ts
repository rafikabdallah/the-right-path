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

export const shadows = {
  none: shadow(black, 0, 0, 0),
  card: shadow(black, 0.35, 10, 4),
  raised: shadow(black, 0.45, 16, 8),
  glowPurple: shadow(colors.primary, 0.45, 18, 10),
} as const;

export type ShadowTokens = typeof shadows;
