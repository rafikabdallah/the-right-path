import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, ChevronRight, Undo2 } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, spacing, textStyles } from '@/constants/theme';

import { RadialGlow } from './RadialGlow';

const SWIPE_THRESHOLD = 84;
const MAX_DRAG = 116;
const ROW_HEIGHT = 64;
const GLOW_HEIGHT = 112;
const MARK = 26;

export type CompletionState = 'pending' | 'current' | 'complete';

interface SwipeCompleteRowProps {
  title: string;
  subtitle?: string;
  /** Right-hand value: a prayer time, a rak'ah count. */
  trailingLabel?: string;
  showChevron?: boolean;
  state: CompletionState;
  /** Row width, used to size the drawn glow behind a current row. */
  width: number;
  onToggle: (complete: boolean) => void;
  onPress?: () => void;
  accessibilityStatus?: string;
  accessibilityHintText?: string;
}

/**
 * The app's one completion row: swipe right to complete, left to undo, tap
 * for detail. Used by the obligatory prayers and by the Sunnah rows, so
 * both behave and read identically.
 *
 * State is carried by the surface, never by a tappable control:
 *
 *   pending  -> near-black glass (waiting)
 *   current  -> bright violet with a slow breathing glow
 *   complete -> dark emerald glass
 *
 * The pan only activates past a horizontal threshold and fails on vertical
 * movement, so it never steals the page's scroll.
 */
export function SwipeCompleteRow({
  title,
  subtitle,
  trailingLabel,
  showChevron = true,
  state,
  width,
  onToggle,
  onPress,
  accessibilityStatus,
  accessibilityHintText = 'Swipe right to mark as complete, or tap for details',
}: SwipeCompleteRowProps) {
  const complete = state === 'complete';

  const translateX = useSharedValue(0);
  const pressed = useSharedValue(0);
  // Mirrored into shared values so gesture/style worklets always read the
  // current state rather than whatever was captured when they were built.
  const isComplete = useSharedValue(complete);
  const completion = useSharedValue(complete ? 1 : 0);
  const currentness = useSharedValue(state === 'current' ? 1 : 0);
  const breath = useSharedValue<number>(animation.breathOpacityTo);

  useEffect(() => {
    isComplete.value = complete;
    completion.value = withTiming(complete ? 1 : 0, { duration: animation.durationBase });
    currentness.value = withTiming(state === 'current' ? 1 : 0, {
      duration: animation.durationBase,
    });
  }, [complete, state, isComplete, completion, currentness]);

  useEffect(() => {
    if (state !== 'current') {
      // Settle and stop — nothing breathes except the current row.
      breath.value = withTiming(animation.breathOpacityTo, {
        duration: animation.durationBase,
      });
      return;
    }

    breath.value = withRepeat(
      withTiming(animation.breathOpacityFrom, {
        duration: animation.breathDuration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [state, breath]);

  const pan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      const limited = Math.min(Math.max(event.translationX, -MAX_DRAG), MAX_DRAG);
      // Only allow the direction that would actually change something.
      translateX.value = isComplete.value ? Math.min(limited, 0) : Math.max(limited, 0);
    })
    .onEnd(() => {
      if (!isComplete.value && translateX.value >= SWIPE_THRESHOLD) {
        runOnJS(onToggle)(true);
      } else if (isComplete.value && translateX.value <= -SWIPE_THRESHOLD) {
        runOnJS(onToggle)(false);
      }
      translateX.value = withSpring(0, animation.indicatorSpring);
    });

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = 1;
    })
    .onFinalize(() => {
      pressed.value = 0;
    })
    .onEnd((_event, success) => {
      if (success && onPress) runOnJS(onPress)();
    });

  // The surface interpolates pending -> current on `currentness`, then the
  // whole thing crossfades to green on `completion`, so a swipe reads as the
  // row settling into its completed state from wherever it was.
  const surface = useDerivedValue(() => {
    const base = interpolateColor(
      currentness.value,
      [0, 1],
      [colors.statePendingSurface, colors.stateCurrentSurface]
    );
    return interpolateColor(completion.value, [0, 1], [base, colors.stateCompleteSurface]);
  });

  const edge = useDerivedValue(() => {
    const base = interpolateColor(
      currentness.value,
      [0, 1],
      [colors.statePendingBorder, colors.stateCurrentBorder]
    );
    return interpolateColor(completion.value, [0, 1], [base, colors.stateCompleteBorder]);
  });

  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: surface.value,
    borderColor: edge.value,
    transform: [
      { translateX: translateX.value },
      {
        scale: withTiming(pressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
  }));

  /** The breathing bloom behind the current row; absent in other states. */
  const glowStyle = useAnimatedStyle(() => ({
    opacity: currentness.value * (1 - completion.value) * breath.value,
  }));

  const markStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completion.value,
      [0, 1],
      [colors.transparent, colors.success]
    ),
    borderColor: interpolateColor(
      completion.value,
      [0, 1],
      [
        interpolateColor(
          currentness.value,
          [0, 1],
          [colors.borderStrong, colors.textOnAccent]
        ),
        colors.success,
      ]
    ),
  }));

  const markDotStyle = useAnimatedStyle(() => ({
    opacity: currentness.value * (1 - completion.value),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: completion.value,
  }));

  const completeHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const undoHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  // Pending rows are dark, so their secondary text stays slate; filled rows
  // carry white-on-accent text instead.
  const secondaryText =
    state === 'pending' ? colors.textSecondary : colors.textOnAccentMuted;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none">
        <RadialGlow
          width={width}
          height={GLOW_HEIGHT}
          color={colors.primary}
          intensity={0.5}
        />
      </Animated.View>

      <View style={styles.track} pointerEvents="none">
        <Animated.View style={completeHintStyle}>
          <Check color={colors.success} size={20} strokeWidth={2.6} />
        </Animated.View>
        <Animated.View style={undoHintStyle}>
          <Undo2 color={colors.textMuted} size={18} strokeWidth={2} />
        </Animated.View>
      </View>

      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <Animated.View
          style={[styles.row, rowStyle]}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityStatus ? title + '. ' + accessibilityStatus : title
          }
          accessibilityHint={accessibilityHintText}
        >
          <Animated.View style={[styles.mark, markStyle]}>
            <Animated.View style={[styles.markDot, markDotStyle]} />
            <Animated.View style={[styles.markCheck, checkStyle]}>
              <Check color={colors.textOnAccent} size={15} strokeWidth={3} />
            </Animated.View>
          </Animated.View>

          <View style={styles.textColumn}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: secondaryText }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {trailingLabel ? <Text style={styles.trailing}>{trailingLabel}</Text> : null}
          {showChevron ? (
            <ChevronRight color={secondaryText} size={16} strokeWidth={2} />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ROW_HEIGHT - GLOW_HEIGHT) / 2,
    alignItems: 'center',
  },
  track: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.successGlow,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  row: {
    minHeight: ROW_HEIGHT,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    width: MARK,
    height: MARK,
    borderRadius: radii.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markDot: {
    width: 9,
    height: 9,
    borderRadius: radii.full,
    backgroundColor: colors.textOnAccent,
  },
  markCheck: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...textStyles.bodyLg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    ...textStyles.bodySm,
  },
  trailing: {
    ...textStyles.bodyLg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
