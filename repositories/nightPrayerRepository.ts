import { notifyChange } from '@/database/changes';
import { getDatabase } from '@/database/database';
import { nowIso } from '@/services/dates';

/**
 * Night prayer records.
 *
 * Each night has at most two rows: the Qiyam slot and the Witr slot,
 * enforced by `(local_date, slot)`. Qiyam and Tahajjud share the Qiyam slot
 * — `after_sleeping` is what names it Tahajjud — so the same prayer is
 * never counted twice.
 */
export type NightSlot = 'qiyam' | 'witr';
export type NightType = 'qiyam' | 'tahajjud' | 'witr';

export interface NightPrayerLog {
  id: number;
  localDate: string;
  slot: NightSlot;
  type: NightType;
  rakahCount: number | null;
  afterSleeping: boolean;
  lastThird: boolean;
  completed: boolean;
  completedAt: string | null;
}

interface NightPrayerLogRow {
  id: number;
  local_date: string;
  slot: string;
  type: string;
  rakah_count: number | null;
  after_sleeping: number;
  last_third: number;
  completed: number;
  completed_at: string | null;
}

function toLog(row: NightPrayerLogRow): NightPrayerLog {
  return {
    id: row.id,
    localDate: row.local_date,
    slot: row.slot as NightSlot,
    type: row.type as NightType,
    rakahCount: row.rakah_count,
    afterSleeping: row.after_sleeping === 1,
    lastThird: row.last_third === 1,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
}

export async function getNightLogsForDate(dateKey: string): Promise<NightPrayerLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<NightPrayerLogRow>(
    'SELECT * FROM night_prayer_logs WHERE local_date = ?',
    dateKey
  );
  return rows.map(toLog);
}

export async function getNightLogsInRange(
  startDateKey: string,
  endDateKey: string
): Promise<NightPrayerLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<NightPrayerLogRow>(
    'SELECT * FROM night_prayer_logs WHERE local_date BETWEEN ? AND ? ORDER BY local_date ASC',
    startDateKey,
    endDateKey
  );
  return rows.map(toLog);
}

export interface SetQiyamInput {
  dateKey: string;
  rakahCount: number;
  afterSleeping: boolean;
  /** Whether it fell in the last third of the night. */
  lastThird?: boolean;
}

/**
 * Records the night's Qiyam. A count of zero clears it rather than storing
 * a completed prayer of no rak'ahs.
 */
export async function setQiyam(input: SetQiyamInput): Promise<void> {
  const db = await getDatabase();
  const timestamp = nowIso();
  const completed = input.rakahCount > 0;

  await db.runAsync(
    `INSERT INTO night_prayer_logs (
       local_date, slot, type, rakah_count, after_sleeping, last_third,
       completed, completed_at, created_at, updated_at
     ) VALUES (?, 'qiyam', ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (local_date, slot) DO UPDATE SET
       type = excluded.type,
       rakah_count = excluded.rakah_count,
       after_sleeping = excluded.after_sleeping,
       last_third = excluded.last_third,
       completed = excluded.completed,
       completed_at = excluded.completed_at,
       updated_at = excluded.updated_at`,
    input.dateKey,
    input.afterSleeping ? 'tahajjud' : 'qiyam',
    input.rakahCount,
    input.afterSleeping ? 1 : 0,
    input.lastThird ? 1 : 0,
    completed ? 1 : 0,
    completed ? timestamp : null,
    timestamp,
    timestamp
  );

  notifyChange();
}

export async function setWitr(dateKey: string, completed: boolean): Promise<void> {
  const db = await getDatabase();
  const timestamp = nowIso();

  await db.runAsync(
    `INSERT INTO night_prayer_logs (
       local_date, slot, type, rakah_count, after_sleeping, last_third,
       completed, completed_at, created_at, updated_at
     ) VALUES (?, 'witr', 'witr', NULL, 0, 0, ?, ?, ?, ?)
     ON CONFLICT (local_date, slot) DO UPDATE SET
       completed = excluded.completed,
       completed_at = excluded.completed_at,
       updated_at = excluded.updated_at`,
    dateKey,
    completed ? 1 : 0,
    completed ? timestamp : null,
    timestamp,
    timestamp
  );

  notifyChange();
}
