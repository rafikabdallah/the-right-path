import { getDatabase } from '@/database/database';
import { notifyChange } from '@/database/changes';
import { deviceTimeZone, nowIso } from '@/services/dates';
import {
  DEFAULT_CALCULATION_SETTINGS,
  type CalculationMethodId,
  type MadhhabId,
  type PrayerAdjustments,
} from '@/services/prayerTimes';

export type LocationMode = 'device' | 'manual' | 'none';

export interface AppSettings {
  method: CalculationMethodId;
  madhhab: MadhhabId;
  adjustments: PrayerAdjustments;
  latitude: number | null;
  longitude: number | null;
  timeZone: string;
  /** Display name only — coordinates are never shown to the user. */
  city: string | null;
  locationMode: LocationMode;
}

interface SettingsRow {
  calculation_method: string;
  madhhab: string;
  adjustments: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  city: string | null;
  location_mode: string;
}

function parseAdjustments(raw: string): PrayerAdjustments {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as PrayerAdjustments) : {};
  } catch {
    return {};
  }
}

function toSettings(row: SettingsRow): AppSettings {
  return {
    method: row.calculation_method as CalculationMethodId,
    madhhab: row.madhhab as MadhhabId,
    adjustments: parseAdjustments(row.adjustments),
    latitude: row.latitude,
    longitude: row.longitude,
    timeZone: row.timezone ?? deviceTimeZone(),
    city: row.city,
    locationMode: row.location_mode as LocationMode,
  };
}

/**
 * Reads the single settings row, creating it with defaults on first run.
 * Calculation preferences live here so Settings can change them later
 * without touching the calculation service.
 */
export async function getSettings(): Promise<AppSettings> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<SettingsRow>('SELECT * FROM settings WHERE id = 1');
  if (existing) return toSettings(existing);

  const timestamp = nowIso();
  await db.runAsync(
    `INSERT INTO settings (
       id, calculation_method, madhhab, adjustments, timezone, location_mode,
       created_at, updated_at
     ) VALUES (1, ?, ?, ?, ?, 'none', ?, ?)`,
    DEFAULT_CALCULATION_SETTINGS.method,
    DEFAULT_CALCULATION_SETTINGS.madhhab,
    JSON.stringify(DEFAULT_CALCULATION_SETTINGS.adjustments),
    deviceTimeZone(),
    timestamp,
    timestamp
  );

  const created = await db.getFirstAsync<SettingsRow>('SELECT * FROM settings WHERE id = 1');
  // The insert above guarantees this row exists.
  return created ? toSettings(created) : {
    ...DEFAULT_CALCULATION_SETTINGS,
    latitude: null,
    longitude: null,
    timeZone: deviceTimeZone(),
    city: null,
    locationMode: 'none',
  };
}

export interface SettingsPatch {
  method?: CalculationMethodId;
  madhhab?: MadhhabId;
  adjustments?: PrayerAdjustments;
  latitude?: number | null;
  longitude?: number | null;
  timeZone?: string;
  city?: string | null;
  locationMode?: LocationMode;
}

export async function updateSettings(patch: SettingsPatch): Promise<AppSettings> {
  await getSettings(); // ensures the row exists
  const db = await getDatabase();

  const assignments: string[] = [];
  const values: (string | number | null)[] = [];

  const push = (column: string, value: string | number | null) => {
    assignments.push(`${column} = ?`);
    values.push(value);
  };

  if (patch.method !== undefined) push('calculation_method', patch.method);
  if (patch.madhhab !== undefined) push('madhhab', patch.madhhab);
  if (patch.adjustments !== undefined) push('adjustments', JSON.stringify(patch.adjustments));
  if (patch.latitude !== undefined) push('latitude', patch.latitude);
  if (patch.longitude !== undefined) push('longitude', patch.longitude);
  if (patch.timeZone !== undefined) push('timezone', patch.timeZone);
  if (patch.city !== undefined) push('city', patch.city);
  if (patch.locationMode !== undefined) push('location_mode', patch.locationMode);

  if (assignments.length > 0) {
    push('updated_at', nowIso());
    await db.runAsync(`UPDATE settings SET ${assignments.join(', ')} WHERE id = 1`, ...values);
    notifyChange();
  }

  return getSettings();
}

/**
 * Coordinates are only worth rewriting when they move enough to change the
 * calculation — roughly a kilometre. This is also why the app never needs
 * to watch position continuously.
 */
export function locationChangedMeaningfully(
  previous: { latitude: number | null; longitude: number | null },
  next: { latitude: number; longitude: number }
): boolean {
  if (previous.latitude === null || previous.longitude === null) return true;
  const latDelta = Math.abs(previous.latitude - next.latitude);
  const lngDelta = Math.abs(previous.longitude - next.longitude);
  return latDelta > 0.01 || lngDelta > 0.01;
}
