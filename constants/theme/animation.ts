/**
 * Centralized animation timing tokens (durations in ms).
 * Easing curves are chosen where they're used (usually
 * `Easing.out(Easing.cubic)` from react-native-reanimated) since easing
 * functions aren't plain serializable values — keep duration/scale here.
 */
export const animation = {
  /** Scale a card/bubble shrinks to while pressed. */
  pressScale: 0.97,
  durationFast: 120,
  durationBase: 220,
  /**
   * Travel of the active nav indicator between bubble positions. Gentle
   * spring, minimal overshoot, settles in roughly 350–400ms.
   */
  indicatorSpring: { damping: 20, stiffness: 170, mass: 1 },
  /** Subtle swell while the indicator travels. Keep close to 1. */
  indicatorPulseScale: 1.04,
  /** Card entrance fade-in, plus the per-card stagger. */
  durationEntrance: 320,
  entranceStagger: 45,
} as const;

export type AnimationTokens = typeof animation;
