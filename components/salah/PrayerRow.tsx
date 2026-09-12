import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, Undo2 } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, spacing, textStyles } from '@/constants/theme';
import type { PrayerRecord } from '@/data/salah';

const SWIPE_THRESHOLD = 84;
const MAX_DRAG = 116;
const ROW_HEIGHT = 78;

const PLACE_LABELS = { masjid: 'Masjid', home: 'Home', other: 'Other' } as const;
const TIMING_LABELS = { 'on-time': 'On time', late: 'Late' } as const;
const COMPANY_LABELS = { congregation: 'Congregation', alone: 'Alone' } as const;

interface PrayerRowProps {
  name: string;
  record: PrayerRecord;
  onToggle: (prayed: boolean) => void;
  onOpenDetails: () => void;
}

/**
 * One of the five daily prayers — the screen's primary element.
 *
 * Two interactions, per CLAUDE.md: swipe right to mark prayed (swipe left
 * to undo) for the quick action, tap to open the detail sheet. The pan
 * gesture only activates past a horizontal threshold and fails on vertical
 * movement, so it never steals the page's scroll.
 */
export function PrayerRow({ name, record, onToggle, onOpenDetails }: PrayerRowProps) {
  const prayed = record.status === 'prayed';

  const translateX = useSharedValue(0);
  const pressed = useSharedValue(0);
  // Mirrored into a shared value so the gesture worklets always read the
  // current state rather than whatever was captured when they were built.
  const isPrayed = useSharedValue(prayed);

  useEffect(() => {
    isPrayed.value = prayed;
  }, [prayed, isPrayed]);

  const pan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      const limited = Math.min(Math.max(event.translationX, -MAX_DRAG), MAX_DRAG);
      // Only allow the direction that would actually change something.
      translateX.value = isPrayed.value ? Math.min(limited, 0) : Math.max(limited, 0);
    })
    .onEnd(() => {
      if (!isPrayed.value && translateX.value >= SWIPE_THRESHOLD) {
        runOnJS(onToggle)(true);
      } else if (isPrayed.value && translateX.value <= -SWIPE_THRESHOLD) {
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
      if (success) runOnJS(onOpenDetails)();
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      {
        scale: withTiming(pressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
    borderColor: withTiming(prayed ? colors.primaryHaloInner : colors.border, {
      duration: animation.durationBase,
    }),
  }));

  const completeHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const undoHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: withTiming(prayed ? 1 : 0, { duration: animation.durationFast }),
    transform: [{ scale: withTiming(prayed ? 1 : 0.6, { duration: animation.durationFast }) }],
  }));

  const statusStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(prayed ? colors.surfacePurple : colors.transparent, {
      duration: animation.durationBase,
    }),
    borderColor: withTiming(prayed ? colors.primary : colors.borderStrong, {
      duration: animation.durationBase,
    }),
  }));

  const meta = prayed
    ? `${TIMING_LABELS[record.timing]} · ${PLACE_LABELS[record.place]} · ${COMPANY_LABELS[record.company]}`
    : undefined;

  return (
    <View style={styles.wrapper}>
      <View style={styles.track} pointerEvents="none">
        <Animated.View style={completeHintStyle}>
          <Check color={colors.primary} size={20} strokeWidth={2.4} />
        </Animated.View>
        <Animated.View style={undoHintStyle}>
          <Undo2 color={colors.textMuted} size={18} strokeWidth={2} />
        </Animated.View>
      </View>

      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <Animated.View
          style={[styles.row, rowStyle]}
          accessibilityRole="button"
          accessibilityLabel={`${name}. ${prayed ? 'Prayed' : 'Not prayed'}`}
          accessibilityHint="Swipe right to mark as prayed, or tap for details"
        >
          <View style={styles.textColumn}>
            <Text style={styles.name}>{name}</Text>
            {meta ? (
              <Text style={styles.meta} numberOfLines={1}>
                {meta}
              </Text>
            ) : null}
          </View>

          <Animated.View style={[styles.status, statusStyle]}>
            <Animated.View style={checkStyle}>
              <Check color={colors.primary} size={16} strokeWidth={3} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
  },
  track: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.surfacePurple,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  row: {
    minHeight: ROW_HEIGHT,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    ...textStyles.subheading,
    color: colors.textPrimary,
  },
  meta: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
  status: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
