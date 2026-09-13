import { CalculationMethod, Coordinates, Madhab, PrayerTimes, SunnahTimes } from 'adhan';

import { dateKeyToDate, formatTime } from './dates';

/**
 * Prayer-time calculation, isolated from any screen.
 *
 * Everything the calculation depends on arrives as an argument — location,
 * date, timezone, method, madhhab, per-prayer adjustments — so the same
 * function serves today, a historical day, and (later) a Settings preview
 * without touching React at all.
 */

/** The five obligatory prayers. Sunrise is deliberately not one of them. */
export const OBLIGATORY_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerName = (typeof OBLIGATORY_PRAYERS)[number];

/** Sunrise is tracked for information only — never logged as a prayer. */
export type TimedEventName = PrayerName | 'sunrise';

export type CalculationMethodId = keyof typeof CalculationMethod;
export type MadhhabId = 'shafi' | 'hanafi';

/** Per-prayer offsets in minutes, applied after calculation. */
export type PrayerAdjustments = Partial<Record<TimedEventName, number>>;

export interface PrayerCalculationSettings {
  method: CalculationMethodId;
  madhhab: MadhhabId;
  adjustments: PrayerAdjustments;
}

export interface PrayerTimeEntry {
  name: TimedEventName;
  /** Display label, e.g. "Fajr". */
  label: string;
  time: Date;
  /** ISO instant, what gets stored as `scheduled_time`. */
  iso: string;
  /** Clock time in the target zone, e.g. "05:12". */
  display: string;
  /** False for sunrise, which is informational. */
  obligatory: boolean;
}

/** Derived night boundaries — real calculation, not an assumed clock time. */
export interface NightTimes {
  middleOfNight: Date;
  lastThird: Date;
  middleOfNightDisplay: string;
  lastThirdDisplay: string;
}

export interface DayPrayerTimes {
  dateKey: string;
  timeZone: string;
  entries: PrayerTimeEntry[];
  /** Just the five obligatory prayers, in order. */
  prayers: PrayerTimeEntry[];
  sunrise: PrayerTimeEntry;
  night: NightTimes;
}

export interface PrayerTimesInput {
  latitude: number;
  longitude: number;
  /** `YYYY-MM-DD` in the user's timezone. */
  dateKey: string;
  timeZone: string;
  settings: PrayerCalculationSettings;
  locale?: string;
}

const LABELS: Record<TimedEventName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const ORDER: TimedEventName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

/** Methods offered to Settings later. Kept here so the UI never hard-codes them. */
export const CALCULATION_METHOD_OPTIONS: { id: CalculationMethodId; label: string }[] = [
  { id: 'MuslimWorldLeague', label: 'Muslim World League' },
  { id: 'Egyptian', label: 'Egyptian General Authority' },
  { id: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { id: 'UmmAlQura', label: 'Umm al-Qura, Makkah' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { id: 'NorthAmerica', label: 'ISNA, North America' },
  { id: 'Kuwait', label: 'Kuwait' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'Singapore', label: 'Singapore' },
  { id: 'Tehran', label: 'Tehran' },
  { id: 'Turkey', label: 'Turkey' },
];

export const DEFAULT_CALCULATION_SETTINGS: PrayerCalculationSettings = {
  method: 'MuslimWorldLeague',
  madhhab: 'shafi',
  adjustments: {},
};

/**
 * Calculates one day's times. Pure: same inputs, same output.
 */
export function calculatePrayerTimes(input: PrayerTimesInput): DayPrayerTimes {
  const { latitude, longitude, dateKey, timeZone, settings, locale } = input;

  const coordinates = new Coordinates(latitude, longitude);
  const factory = CalculationMethod[settings.method] ?? CalculationMethod.MuslimWorldLeague;
  const parameters = factory();
  parameters.madhab = settings.madhhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  // adhan applies these itself, in minutes.
  parameters.adjustments = {
    ...parameters.adjustments,
    fajr: settings.adjustments.fajr ?? 0,
    sunrise: settings.adjustments.sunrise ?? 0,
    dhuhr: settings.adjustments.dhuhr ?? 0,
    asr: settings.adjustments.asr ?? 0,
    maghrib: settings.adjustments.maghrib ?? 0,
    isha: settings.adjustments.isha ?? 0,
  };

  const times = new PrayerTimes(coordinates, dateKeyToDate(dateKey), parameters);

  const entries: PrayerTimeEntry[] = ORDER.map((name) => {
    const time = times[name];
    return {
      name,
      label: LABELS[name],
      time,
      iso: time.toISOString(),
      display: formatTime(time, timeZone, locale),
      obligatory: name !== 'sunrise',
    };
  });

  const sunrise = entries.find((entry) => entry.name === 'sunrise');

  // adhan derives these from this night's Maghrib and tomorrow's Fajr, so the
  // last third is a real boundary rather than a fixed hour.
  const sunnahTimes = new SunnahTimes(times);

  return {
    dateKey,
    timeZone,
    entries,
    prayers: entries.filter((entry) => entry.obligatory),
    // ORDER always contains sunrise, so this branch is unreachable in practice.
    sunrise: sunrise ?? entries[0],
    night: {
      middleOfNight: sunnahTimes.middleOfTheNight,
      lastThird: sunnahTimes.lastThirdOfTheNight,
      middleOfNightDisplay: formatTime(sunnahTimes.middleOfTheNight, timeZone, locale),
      lastThirdDisplay: formatTime(sunnahTimes.lastThirdOfTheNight, timeZone, locale),
    },
  };
}

/** Which prayer window the given instant falls in, or null outside them. */
export function currentPrayerName(day: DayPrayerTimes, at: Date = new Date()): PrayerName | null {
  let current: PrayerName | null = null;
  for (const entry of day.prayers) {
    if (at.getTime() >= entry.time.getTime()) {
      current = entry.name as PrayerName;
    }
  }
  return current;
}
