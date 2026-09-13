import { SwipeCompleteRow, type CompletionState } from '@/components/ui/SwipeCompleteRow';
import type {
  PrayerCongregation,
  PrayerPlace,
  PrayerTiming,
} from '@/repositories/prayerRepository';

const PLACE_LABELS: Record<PrayerPlace, string> = {
  masjid: 'Masjid',
  home: 'Home',
  other: 'Other',
};

const TIMING_LABELS: Record<PrayerTiming, string> = {
  on_time: 'On time',
  late: 'Late',
};

const CONGREGATION_LABELS: Record<PrayerCongregation, string> = {
  congregation: 'Congregation',
  alone: 'Alone',
};

interface PrayerRowProps {
  name: string;
  /** Calculated prayer time, already formatted for the user's zone. */
  time?: string;
  completed: boolean;
  timing: PrayerTiming | null;
  place: PrayerPlace | null;
  congregation: PrayerCongregation | null;
  /** True for the prayer whose window is now. Only one row is ever current. */
  isCurrent: boolean;
  width: number;
  onToggle: (completed: boolean) => void;
  onOpenDetails: () => void;
}

/**
 * One of the five daily prayers.
 *
 * The interaction and the three state colors live in `SwipeCompleteRow`,
 * shared with the Sunnah rows; this only decides what a prayer puts in it —
 * whatever detail the user recorded, and its calculated time on the right.
 */
export function PrayerRow({
  name,
  time,
  completed,
  timing,
  place,
  congregation,
  isCurrent,
  width,
  onToggle,
  onOpenDetails,
}: PrayerRowProps) {
  const state: CompletionState = completed ? 'complete' : isCurrent ? 'current' : 'pending';

  // Only what was actually recorded is shown — a prayer marked by swipe
  // alone simply has less to say than one filled in from the sheet.
  const recorded = [
    timing ? TIMING_LABELS[timing] : null,
    place ? PLACE_LABELS[place] : null,
    congregation ? CONGREGATION_LABELS[congregation] : null,
  ].filter((part): part is string => part !== null);

  const meta = completed
    ? recorded.length > 0
      ? recorded.join(' · ')
      : 'Prayed'
    : isCurrent
      ? 'Current prayer · Time has entered'
      : undefined;

  const statusLabel = completed
    ? 'Prayed'
    : isCurrent
      ? 'Current prayer, not prayed'
      : 'Not prayed';

  return (
    <SwipeCompleteRow
      title={name}
      subtitle={meta}
      trailingLabel={time}
      state={state}
      width={width}
      onToggle={onToggle}
      onPress={onOpenDetails}
      accessibilityStatus={statusLabel}
      accessibilityHintText="Swipe right to mark as prayed, or tap for details"
    />
  );
}
