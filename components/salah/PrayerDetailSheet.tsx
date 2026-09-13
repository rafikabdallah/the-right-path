import { StyleSheet, Text, View } from 'react-native';
import { Check, Clock, House, Landmark, MapPin, User, Users, X } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionGroup, type Option } from '@/components/ui/OptionGroup';
import { colors, spacing, textStyles } from '@/constants/theme';
import type {
  PrayerCongregation,
  PrayerPlace,
  PrayerStatus,
  PrayerTiming,
} from '@/repositories/prayerRepository';
import { formatTime } from '@/services/dates';

/** The sheet only offers the two states a person can assert about today. */
type SheetStatus = Extract<PrayerStatus, 'prayed' | 'pending'>;

const STATUS_OPTIONS: Option<SheetStatus>[] = [
  { value: 'prayed', label: 'Prayed', icon: Check },
  { value: 'pending', label: 'Not prayed', icon: X },
];

const TIMING_OPTIONS: Option<PrayerTiming>[] = [
  { value: 'on_time', label: 'On time', icon: Check },
  { value: 'late', label: 'Late', icon: Clock },
];

const PLACE_OPTIONS: Option<PrayerPlace>[] = [
  { value: 'masjid', label: 'Masjid', icon: Landmark },
  { value: 'home', label: 'Home', icon: House },
  { value: 'other', label: 'Other', icon: MapPin },
];

const CONGREGATION_OPTIONS: Option<PrayerCongregation>[] = [
  { value: 'congregation', label: 'Congregation', icon: Users },
  { value: 'alone', label: 'Alone', icon: User },
];

export interface PrayerDetailValue {
  status: SheetStatus;
  timing: PrayerTiming | null;
  place: PrayerPlace | null;
  congregation: PrayerCongregation | null;
}

interface PrayerDetailSheetProps {
  visible: boolean;
  name: string;
  /** Calculated time, shown for context. */
  scheduledTime?: string;
  /** ISO instant the prayer was actually marked, if it was. */
  completedAt: string | null;
  timeZone: string;
  value: PrayerDetailValue;
  onChange: (value: PrayerDetailValue) => void;
  onClose: () => void;
}

/**
 * Tap-a-prayer detail sheet: the considered counterpart to the row's swipe.
 *
 * Every answer is persisted against the prayer's record and later feeds
 * Prayer Review, so this is data entry, not decoration. The app does not
 * infer any of it — "late" is stored because the user said so.
 */
export function PrayerDetailSheet({
  visible,
  name,
  scheduledTime,
  completedAt,
  timeZone,
  value,
  onChange,
  onClose,
}: PrayerDetailSheetProps) {
  const marked = completedAt ? formatTime(new Date(completedAt), timeZone) : null;

  return (
    <BottomSheet visible={visible} title={name} onClose={onClose}>
      <View style={styles.groups}>
        {scheduledTime ? (
          <Text style={styles.context}>
            {marked ? `Due ${scheduledTime} · Marked ${marked}` : `Due ${scheduledTime}`}
          </Text>
        ) : null}

        <OptionGroup
          label="Status"
          options={STATUS_OPTIONS}
          selected={value.status}
          onSelect={(status) => onChange({ ...value, status })}
        />
        <OptionGroup
          label="Timing"
          options={TIMING_OPTIONS}
          selected={value.timing ?? 'on_time'}
          onSelect={(timing) => onChange({ ...value, timing })}
        />
        <OptionGroup
          label="Place"
          options={PLACE_OPTIONS}
          selected={value.place ?? 'masjid'}
          onSelect={(place) => onChange({ ...value, place })}
        />
        <OptionGroup
          label="Congregation"
          options={CONGREGATION_OPTIONS}
          selected={value.congregation ?? 'congregation'}
          onSelect={(congregation) => onChange({ ...value, congregation })}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: spacing.xl,
  },
  context: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
