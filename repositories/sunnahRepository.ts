import { notifyChange } from '@/database/changes';
import { getDatabase } from '@/database/database';
import { nowIso } from '@/services/dates';

/**
 * Sunnah records.
 *
 * Two shapes share one table. Rawatib are fixed slots — one row per slot
 * per day, enforced by a partial unique index — while general Nafl is a
 * free list that can hold several entries in a day, so it deliberately has
 * no uniqueness.
 */
export type SunnahCategory = 'rawatib' | 'nafl';

export interface SunnahLog {
  id: number;
  localDate: string;
  category: SunnahCategory;
  /** Rawatib slot id, or 'nafl' for a general voluntary entry. */
  sunnahId: string;
  rakahCount: number | null;
  completed: boolean;
  completedAt: string | null;
}

interface SunnahLogRow {
  id: number;
  local_date: string;
  category: string;
  sunnah_id: string;
  rakah_count: number | null;
  completed: number;
  completed_at: string | null;
}

function toLog(row: SunnahLogRow): SunnahLog {
  return {
    id: row.id,
    localDate: row.local_date,
    category: row.category as SunnahCategory,
    sunnahId: row.sunnah_id,
    rakahCount: row.rakah_count,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
}

export async function getSunnahLogsForDate(dateKey: string): Promise<SunnahLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SunnahLogRow>(
    'SELECT * FROM sunnah_logs WHERE local_date = ? ORDER BY id ASC',
    dateKey
  );
  return rows.map(toLog);
}

export async function getSunnahLogsInRange(
  startDateKey: string,
  endDateKey: string
): Promise<SunnahLog[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SunnahLogRow>(
    'SELECT * FROM sunnah_logs WHERE local_date BETWEEN ? AND ? ORDER BY local_date ASC, id ASC',
    startDateKey,
    endDateKey
  );
  return rows.map(toLog);
}

export interface SetRawatibInput {
  dateKey: string;
  sunnahId: string;
  rakahCount: number;
  completed: boolean;
}

/** Upserts one Rawatib slot for a day. */
export async function setRawatibCompletion(input: SetRawatibInput): Promise<void> {
  const db = await getDatabase();
  const timestamp = nowIso();
  const completedAt = input.completed ? timestamp : null;

  // The partial unique index only covers category = 'rawatib', so the
  // conflict target must name the same predicate.
  await db.runAsync(
    `INSERT INTO sunnah_logs (
       local_date, category, sunnah_id, rakah_count, completed, completed_at,
       created_at, updated_at
     ) VALUES (?, 'rawatib', ?, ?, ?, ?, ?, ?)
     ON CONFLICT (local_date, sunnah_id) WHERE category = 'rawatib' DO UPDATE SET
       rakah_count = excluded.rakah_count,
       completed = excluded.completed,
       completed_at = excluded.completed_at,
       updated_at = excluded.updated_at`,
    input.dateKey,
    input.sunnahId,
    input.rakahCount,
    input.completed ? 1 : 0,
    completedAt,
    timestamp,
    timestamp
  );

  notifyChange();
}

/** Adds one general Nafl entry. These stack — several per day is normal. */
export async function addNaflEntry(dateKey: string, rakahCount: number): Promise<void> {
  if (rakahCount <= 0) return;

  const db = await getDatabase();
  const timestamp = nowIso();

  await db.runAsync(
    `INSERT INTO sunnah_logs (
       local_date, category, sunnah_id, rakah_count, completed, completed_at,
       created_at, updated_at
     ) VALUES (?, 'nafl', 'nafl', ?, 1, ?, ?, ?)`,
    dateKey,
    rakahCount,
    timestamp,
    timestamp,
    timestamp
  );

  notifyChange();
}

export async function removeNaflEntry(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM sunnah_logs WHERE id = ? AND category = 'nafl'", id);
  notifyChange();
}
