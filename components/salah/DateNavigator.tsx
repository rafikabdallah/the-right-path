import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { animation, colors, radii, spacing, textStyles } from '@/constants/theme';
import { formatDateLong } from '@/services/dates';

interface DateNavigatorProps {
  dateKey: string;
  timeZone: string;
  /** Blocks forward navigation — future days are not editable. */
  isToday: boolean;
  /** e.g. "Messina · Local prayer times". Never coordinates. */
  locationLabel?: string | null;
  onPrevious: () => void;
  onNext: () => void;
  /** Reserved for the calendar picker; the control is already pressable. */
  onPressDate?: () => void;
}

/**
 * Day switcher sitting under the Ayah card.
 *
 * The selected date is the single source for everything on the screen, so
 * this is the only control that changes what is displayed. Forward travel
 * stops at today: there is nothing to show and nothing to edit beyond it.
 */
export function DateNavigator({
  dateKey,
  timeZone,
  isToday,
  locationLabel,
  onPrevious,
  onNext,
  onPressDate,
}: DateNavigatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          onPress={onPrevious}
          hitSlop={12}
          style={styles.arrow}
          accessibilityRole="button"
          accessibilityLabel="Previous day"
        >
          <ChevronLeft color={colors.textSecondary} size={18} strokeWidth={2} />
        </Pressable>

        <Pressable
          onPress={onPressDate}
          style={styles.dateButton}
          accessibilityRole="button"
          accessibilityLabel={formatDateLong(dateKey, timeZone)}
        >
          {/* Keyed so the label cross-fades as the day changes. */}
          <Animated.Text
            key={dateKey}
            entering={FadeIn.duration(animation.durationBase)}
            style={styles.date}
            numberOfLines={1}
          >
            {formatDateLong(dateKey, timeZone)}
          </Animated.Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={isToday}
          hitSlop={12}
          style={[styles.arrow, isToday && styles.arrowDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: isToday }}
          accessibilityLabel="Next day"
        >
          <ChevronRight color={colors.textSecondary} size={18} strokeWidth={2} />
        </Pressable>
      </View>

      {locationLabel ? <Text style={styles.location}>{locationLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  dateButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  date: {
    ...textStyles.bodyMd,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  location: {
    ...textStyles.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textMuted,
  },
});
