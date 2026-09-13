import { notifyChange } from '@/database/changes';
import { getDatabase } from '@/database/database';
import { nowIso } from '@/services/dates';
import type { PrayerName } from '@/services/prayerTimes';

/**
 * Obligatory prayer records.
 *
 * Rows are written only when the user actually does something — there is no
 * pre-seeding of empty days — and the `(local_date, prayer_name)` unique
 * constraint means repeated taps update one row instead of stacking
 * duplicates. Un-completing keeps the row and clears the timestamp, so the
 * record of the action survives.
 *
 * Only objective facts are stored: when the prayer was due, and when it was
 * marked. No judgement about lateness or validity is made here.
 */
/** What the user declared about the prayer. 'unknown' is for imported data. */
export type PrayerStatus = 'pending' | 'prayed' | 'missed' | 'unknown';
export type PrayerTiming = 'on_time' | 'late';
export type PrayerPlace = 'masjid' | 'home' | 'other';
export type PrayerCongregation = 'congregation' | 'alone';

export interface PrayerLog {
  id: number;
  localDate: string;
  prayerName: PrayerName;
  /** ISO instant the prayer was due, captured at the time of logging. */
  scheduledTime: string | null;
  status: PrayerStatus;
  /** Declared by the user in the detail sheet, not inferred. */
  timing: PrayerTiming | null;
  place: PrayerPlace | null;
  congregation: PrayerCongregation | null;
  completed: boolean;
  completedAt: string | null;
}

interface PrayerLogRow {
  id: number;
  local_date: string;
  prayer_name: string;
  scheduled_time: string | null;
  status: string | null;
  timing: string | null;
  place: string | null;
  congregation: string | null;
  completed: number;
  completed_at: string | null;
}

function toLog(row: PrayerLogRow): PrayerLog {
  return {
    id: row.id,
    localDate: row.local_date,
    prayerName: row.prayer_name as PrayerName,
    scheduledTime: row.scheduled_time,
    status: (row.status as PrayerStatus | null) ?? (row.completed === 1 ? 'prayed' : 'pending'),
    timing: row.timing as PrayerTiming | null,
    place: row.place as PrayerPlace | null,
    congregation: row.congregation as PrayerCongregation | null,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
}

export async function getPrayerLogsForDate(dateKey: string): Promise<PrayerLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PrayerLogRow>(
    'SELECT * FROM prayer_logs WHERE local_date = ?',
    dateKey
  );
  return rows.map(toLog);
}

export async function getPrayerLogsInRange(
  startDateKey: string,
  endDateKey: string
): Promise<PrayerLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PrayerLogRow>(
    'SELECT * FROM prayer_logs WHERE local_date BETWEEN ? AND ? ORDER BY local_date ASC',
    startDateKey,
    endDateKey
  );
  return rows.map(toLog);
}

export interface SavePrayerLogInput {
  dateKey: string;
  prayerName: PrayerName;
  /** The calculated time for that prayer on that day. */
  scheduledTime: string | null;
  status: PrayerStatus;
  timing?: PrayerTiming | null;
  place?: PrayerPlace | null;
  congregation?: PrayerCongregation | null;
  /** Defaults to now when the status is 'prayed'. */
  completedAt?: string | null;
}

/**
 * Writes one prayer's record, upserting on (local_date, prayer_name).
 *
 * Everything the user declared is preserved — status, timing, place,
 * congregation, and the actual completion timestamp. Nothing is judged
 * here: 'late' is stored because the user said so, not because the app
 * compared two clocks.
 *
 * Un-completing keeps the row and clears the timestamp, so the history of
 * the action survives rather than vanishing.
 */
export async function savePrayerLog(input: SavePrayerLogInput): Promise<void> {
  const db = await getDatabase();
  const timestamp = nowIso();
  const completed = input.status === 'prayed';
  const completedAt = completed ? (input.completedAt ?? timestamp) : null;

  await db.runAsync(
    `INSERT INTO prayer_logs (
       local_date, prayer_name, scheduled_time, status, timing, place,
       congregation, completed, completed_at, created_at, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (local_date, prayer_name) DO UPDATE SET
       scheduled_time = COALESCE(excluded.scheduled_time, prayer_logs.scheduled_time),
       status = excluded.status,
       timing = excluded.timing,
       place = excluded.place,
       congregation = excluded.congregation,
       completed = excluded.completed,
       completed_at = excluded.completed_at,
       updated_at = excluded.updated_at`,
    input.dateKey,
    input.prayerName,
    input.scheduledTime,
    input.status,
    input.timing ?? null,
    input.place ?? null,
    input.congregation ?? null,
    completed ? 1 : 0,
    completedAt,
    timestamp,
    timestamp
  );

  notifyChange();
}

/**
 * The swipe path: flips completion while preserving whatever detail the
 * user had already recorded for that prayer.
 */
export async function setPrayerCompletion(input: {
  dateKey: string;
  prayerName: PrayerName;
  scheduledTime: string | null;
  completed: boolean;
}): Promise<void> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<PrayerLogRow>(
    'SELECT * FROM prayer_logs WHERE local_date = ? AND prayer_name = ?',
    input.dateKey,
    input.prayerName
  );

  await savePrayerLog({
    dateKey: input.dateKey,
    prayerName: input.prayerName,
    scheduledTime: input.scheduledTime,
    status: input.completed ? 'prayed' : 'pending',
    timing: existing?.timing as PrayerTiming | null,
    place: existing?.place as PrayerPlace | null,
    congregation: existing?.congregation as PrayerCongregation | null,
  });
}

/** Days that have at least one completed prayer — used for streaks. */
export async function getCompletedPrayerCountsByDate(
  startDateKey: string,
  endDateKey: string
): Promise<Map<string, number>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ local_date: string; total: number }>(
    `SELECT local_date, COUNT(*) AS total
       FROM prayer_logs
      WHERE completed = 1 AND local_date BETWEEN ? AND ?
      GROUP BY local_date`,
    startDateKey,
    endDateKey
  );

  return new Map(rows.map((row) => [row.local_date, row.total]));
}
