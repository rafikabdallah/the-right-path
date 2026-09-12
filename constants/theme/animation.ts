/**
 * Centralized animation timing tokens (durations in ms).
 * Easing curves are chosen where they're used (usually
 * `Easing.out(Easing.cubic)` from react-native-reanimated) since easing
 * functions aren't plain serializable values — keep duration/scale here.
 */
export const animation = {
  pressScale: 0.97,
  durationFast: 120,
  durationBase: 220,
  durationPillarTransition: 380,
} as const;

export type AnimationTokens = typeof animation;
