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
  /**
   * Breathing glow on the current prayer. Slow and shallow on purpose —
   * it should register as 'alive', never as a pulse or a flash.
   */
  breathDuration: 2800,
  breathOpacityFrom: 0.45,
  breathOpacityTo: 1,
  /**
   * Ambient background orbs. Very slow drift (10-20s cycles) so the
   * atmosphere moves without the eye tracking it.
   */
  ambientDurations: [17000, 21000, 14000],
  ambientDrift: 42,
  ambientScaleTo: 1.12,
} as const;

export type AnimationTokens = typeof animation;
