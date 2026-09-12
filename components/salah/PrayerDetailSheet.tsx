import { StyleSheet, View } from 'react-native';
import { Check, Clock, House, Landmark, MapPin, User, Users, X } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionGroup, type Option } from '@/components/ui/OptionGroup';
import { spacing } from '@/constants/theme';
import type {
  PrayerCompany,
  PrayerPlace,
  PrayerRecord,
  PrayerStatus,
  PrayerTiming,
} from '@/data/salah';

const STATUS_OPTIONS: Option<PrayerStatus>[] = [
  { value: 'prayed', label: 'Prayed', icon: Check },
  { value: 'not-prayed', label: 'Not prayed', icon: X },
];

const TIMING_OPTIONS: Option<PrayerTiming>[] = [
  { value: 'on-time', label: 'On time', icon: Check },
  { value: 'late', label: 'Late', icon: Clock },
];

const PLACE_OPTIONS: Option<PrayerPlace>[] = [
  { value: 'masjid', label: 'Masjid', icon: Landmark },
  { value: 'home', label: 'Home', icon: House },
  { value: 'other', label: 'Other', icon: MapPin },
];

const COMPANY_OPTIONS: Option<PrayerCompany>[] = [
  { value: 'congregation', label: 'Congregation', icon: Users },
  { value: 'alone', label: 'Alone', icon: User },
];

interface PrayerDetailSheetProps {
  visible: boolean;
  name: string;
  record: PrayerRecord;
  onChange: (record: PrayerRecord) => void;
  onClose: () => void;
}

/**
 * Tap-a-prayer detail sheet: the considered counterpart to the row's swipe.
 * One choice per line, nothing else — the same component serves all five
 * prayers.
 */
export function PrayerDetailSheet({
  visible,
  name,
  record,
  onChange,
  onClose,
}: PrayerDetailSheetProps) {
  return (
    <BottomSheet visible={visible} title={name} onClose={onClose}>
      <View style={styles.groups}>
        <OptionGroup
          label="Status"
          options={STATUS_OPTIONS}
          selected={record.status}
          onSelect={(status) => onChange({ ...record, status })}
        />
        <OptionGroup
          label="Timing"
          options={TIMING_OPTIONS}
          selected={record.timing}
          onSelect={(timing) => onChange({ ...record, timing })}
        />
        <OptionGroup
          label="Place"
          options={PLACE_OPTIONS}
          selected={record.place}
          onSelect={(place) => onChange({ ...record, place })}
        />
        <OptionGroup
          label="Congregation"
          options={COMPANY_OPTIONS}
          selected={record.company}
          onSelect={(company) => onChange({ ...record, company })}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: spacing.xl,
  },
});
