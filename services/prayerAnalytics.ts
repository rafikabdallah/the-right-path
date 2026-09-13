import type { PrayerLog } from '@/repositories/prayerRepository';
import type { SunnahLog } from '@/repositories/sunnahRepository';
import type { NightPrayerLog } from '@/repositories/nightPrayerRepository';

import { dateKeyRange, shiftDateKey } from './dates';
import { OBLIGATORY_PRAYERS } from './prayerTimes';

/**
 * Derived statistics.
 *
 * Everything here is computed from stored rows — there is no mock data and
 * no fallback that invents a number. When there is nothing recorded the
 * result says so (`hasData: false`) and the UI shows an empty state rather
 * than a flat line at zero pretending to be history.
 *
 * These are objective counts only. No judgement about lateness or validity
 * is made yet; the definitions below are the seam where that will go.
 */

export interface DailySeriesPoint {
  dateKey: string;
  value: number;
  /** Extra flags a chart may show as a small status dot. */
  flags?: Record<string, boolean>;
}

export interface StreakSummary {
  current: number;
  longest: number;
}

/** Counts consecutive days ending at `endKey` that satisfy `isActive`. */
export function calculateStreaks(
  activeDates: Set<string>,
  endKey: string,
  lookbackDays: number
): StreakSummary {
  const keys = dateKeyRange(endKey, lookbackDays);

  let longest = 0;
  let running = 0;
  for (const key of keys) {
    if (activeDates.has(key)) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  // The current streak may legitimately end yesterday if today is still in
  // progress, so an inactive today does not immediately zero it.
  let current = 0;
  let cursor = endKey;
  if (!activeDates.has(cursor)) {
    cursor = shiftDateKey(cursor, -1);
  }
  while (activeDates.has(cursor)) {
    current += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return { current, longest };
}

// --- Obligatory prayers ---

export interface PrayerStats {
  hasData: boolean;
  /** Completed prayers over the window. */
  completed: number;
  /** Prayers the window could have held (5 per elapsed day). */
  possible: number;
  completionRate: number;
  /** Completed with a recorded timestamp at or before the scheduled time. */
  onTime: number;
  onTimeRate: number;
  /** Possible minus completed, for elapsed days only. */
  missed: number;
  streaks: StreakSummary;
  series: DailySeriesPoint[];
}

export function summarisePrayers(
  logs: PrayerLog[],
  endKey: string,
  days: number
): PrayerStats {
  const keys = dateKeyRange(endKey, days);
  const byDate = new Map<string, PrayerLog[]>();
  for (const log of logs) {
    const bucket = byDate.get(log.localDate) ?? [];
    bucket.push(log);
    byDate.set(log.localDate, bucket);
  }

  let completed = 0;
  let onTime = 0;
  const activeDates = new Set<string>();
  const series: DailySeriesPoint[] = [];

  for (const key of keys) {
    const dayLogs = byDate.get(key) ?? [];
    const dayCompleted = dayLogs.filter((log) => log.completed);

    completed += dayCompleted.length;
    for (const log of dayCompleted) {
      // On-time is whatever the user declared in the detail sheet. The app
      // deliberately does not infer it by comparing clocks — that would be a
      // judgement, and timestamps alone cannot see the prayer's window.
      if (log.timing === 'on_time') onTime += 1;
    }

    if (dayCompleted.length > 0) activeDates.add(key);
    series.push({ dateKey: key, value: dayCompleted.length });
  }

  const possible = keys.length * OBLIGATORY_PRAYERS.length;

  return {
    hasData: completed > 0,
    completed,
    possible,
    completionRate: possible > 0 ? completed / possible : 0,
    onTime,
    onTimeRate: completed > 0 ? onTime / completed : 0,
    missed: Math.max(possible - completed, 0),
    streaks: calculateStreaks(activeDates, endKey, days),
    series,
  };
}

// --- Sunnah ---

export interface SunnahStats {
  hasData: boolean;
  /** Rawatib slots completed today. */
  rawatibToday: number;
  rawatibRakahsToday: number;
  naflRakahsToday: number;
  rawatibThisWeek: number;
  consistency7: number;
  consistency30: number;
  streaks: StreakSummary;
  rawatibSeries: DailySeriesPoint[];
  naflSeries: DailySeriesPoint[];
}

export function summariseSunnah(
  logs: SunnahLog[],
  endKey: string,
  days: number,
  rawatibSlotsPerDay: number
): SunnahStats {
  const keys = dateKeyRange(endKey, days);

  const rawatibRakahsByDate = new Map<string, number>();
  const rawatibCountByDate = new Map<string, number>();
  const naflByDate = new Map<string, number>();

  for (const log of logs) {
    if (log.category === 'rawatib') {
      if (!log.completed) continue;
      rawatibCountByDate.set(log.localDate, (rawatibCountByDate.get(log.localDate) ?? 0) + 1);
      rawatibRakahsByDate.set(
        log.localDate,
        (rawatibRakahsByDate.get(log.localDate) ?? 0) + (log.rakahCount ?? 0)
      );
    } else {
      naflByDate.set(log.localDate, (naflByDate.get(log.localDate) ?? 0) + (log.rakahCount ?? 0));
    }
  }

  const activeDates = new Set<string>();
  const rawatibSeries: DailySeriesPoint[] = [];
  const naflSeries: DailySeriesPoint[] = [];
  let rawatibThisWeek = 0;

  const weekKeys = new Set(dateKeyRange(endKey, Math.min(7, days)));

  for (const key of keys) {
    const rawatibRakahs = rawatibRakahsByDate.get(key) ?? 0;
    const nafl = naflByDate.get(key) ?? 0;

    if (rawatibRakahs > 0 || nafl > 0) activeDates.add(key);
    if (weekKeys.has(key)) rawatibThisWeek += rawatibCountByDate.get(key) ?? 0;

    rawatibSeries.push({ dateKey: key, value: rawatibRakahs });
    naflSeries.push({ dateKey: key, value: nafl });
  }

  const daysWithRawatib = (window: number) =>
    dateKeyRange(endKey, Math.min(window, days)).filter(
      (key) => (rawatibCountByDate.get(key) ?? 0) > 0
    ).length;

  return {
    hasData: logs.length > 0,
    rawatibToday: rawatibCountByDate.get(endKey) ?? 0,
    rawatibRakahsToday: rawatibRakahsByDate.get(endKey) ?? 0,
    naflRakahsToday: naflByDate.get(endKey) ?? 0,
    rawatibThisWeek,
    consistency7: daysWithRawatib(7) / Math.min(7, days),
    consistency30: daysWithRawatib(30) / Math.min(30, days),
    streaks: calculateStreaks(activeDates, endKey, days),
    rawatibSeries,
    naflSeries,
  };
}

/** Total Rawatib rak'ahs a full day would hold — used as the chart's ceiling. */
export function rawatibDailyTotal(slots: { rakahs: number }[]): number {
  return slots.reduce((sum, slot) => sum + slot.rakahs, 0);
}

// --- Night prayer ---

export interface NightStats {
  hasData: boolean;
  nightsWithQiyam: number;
  nightsWithTahajjud: number;
  nightsWithWitr: number;
  totalRakahs: number;
  consistency7: number;
  consistency30: number;
  streaks: StreakSummary;
  series: DailySeriesPoint[];
  witrDays: number;
  totalDays: number;
}

export function summariseNight(
  logs: NightPrayerLog[],
  endKey: string,
  days: number
): NightStats {
  const keys = dateKeyRange(endKey, days);

  const qiyamByDate = new Map<string, NightPrayerLog>();
  const witrByDate = new Map<string, NightPrayerLog>();

  for (const log of logs) {
    if (log.slot === 'qiyam') qiyamByDate.set(log.localDate, log);
    else witrByDate.set(log.localDate, log);
  }

  const activeDates = new Set<string>();
  const series: DailySeriesPoint[] = [];
  let nightsWithQiyam = 0;
  let nightsWithTahajjud = 0;
  let nightsWithWitr = 0;
  let totalRakahs = 0;

  for (const key of keys) {
    const qiyam = qiyamByDate.get(key);
    const witr = witrByDate.get(key);
    const rakahs = qiyam?.completed ? (qiyam.rakahCount ?? 0) : 0;

    if (qiyam?.completed) {
      nightsWithQiyam += 1;
      if (qiyam.afterSleeping) nightsWithTahajjud += 1;
      activeDates.add(key);
    }
    if (witr?.completed) {
      nightsWithWitr += 1;
      activeDates.add(key);
    }

    totalRakahs += rakahs;
    series.push({
      dateKey: key,
      value: rakahs,
      flags: {
        witr: witr?.completed ?? false,
        lastThird: qiyam?.lastThird ?? false,
        tahajjud: qiyam?.afterSleeping ?? false,
      },
    });
  }

  const nightsIn = (window: number) =>
    dateKeyRange(endKey, Math.min(window, days)).filter((key) =>
      Boolean(qiyamByDate.get(key)?.completed)
    ).length;

  return {
    hasData: logs.length > 0,
    nightsWithQiyam,
    nightsWithTahajjud,
    nightsWithWitr,
    totalRakahs,
    consistency7: nightsIn(7) / Math.min(7, days),
    consistency30: nightsIn(30) / Math.min(30, days),
    streaks: calculateStreaks(activeDates, endKey, days),
    series,
    witrDays: nightsWithWitr,
    totalDays: keys.length,
  };
}

// --- Prayer review ---

export interface ReviewMetric {
  id: string;
  label: string;
  value: string;
  /** 0-1, where a ratio is meaningful. Drives a progress bar. */
  progress?: number;
  /** Week-over-week change, e.g. '+22%'. */
  delta?: string;
  tone?: 'default' | 'complete';
}

export interface PrayerReview {
  hasData: boolean;
  preview: ReviewMetric[];
  metrics: ReviewMetric[];
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function countFor(logs: PrayerLog[], keys: Set<string>, name: string): number {
  return logs.filter((log) => keys.has(log.localDate) && log.prayerName === name && log.completed)
    .length;
}

/**
 * Builds the Prayer Review from stored rows.
 *
 * `thisWeek` and `lastWeek` are separate windows so improvement is a real
 * comparison rather than an assumed trend. Every figure is a count of
 * something the user recorded — nothing is scored or graded.
 */
export function summarisePrayerReview(
  logs: PrayerLog[],
  sunnahLogs: SunnahLog[],
  nightLogs: NightPrayerLog[],
  endKey: string
): PrayerReview {
  const weekKeys = new Set(dateKeyRange(endKey, 7));
  const previousKeys = new Set(dateKeyRange(shiftDateKey(endKey, -7), 7));

  const week = summarisePrayers(logs, endKey, 7);
  const possible = week.possible;

  // Per-prayer consistency this week, and the largest gain over last week.
  let mostConsistent = { name: '—', rate: 0 };
  let biggestImprovement = { name: '—', delta: 0 };

  for (const name of OBLIGATORY_PRAYERS) {
    const current = countFor(logs, weekKeys, name);
    const previous = countFor(logs, previousKeys, name);
    const rate = current / 7;
    const label = name.charAt(0).toUpperCase() + name.slice(1);

    if (rate > mostConsistent.rate) mostConsistent = { name: label, rate };
    const delta = (current - previous) / 7;
    if (delta > biggestImprovement.delta) biggestImprovement = { name: label, delta };
  }

  const fajrRate = countFor(logs, weekKeys, 'fajr') / 7;
  const masjid = logs.filter(
    (log) => weekKeys.has(log.localDate) && log.completed && log.place === 'masjid'
  ).length;
  const congregation = logs.filter(
    (log) => weekKeys.has(log.localDate) && log.completed && log.congregation === 'congregation'
  ).length;

  const sunnahRakahs = sunnahLogs
    .filter((log) => weekKeys.has(log.localDate) && log.completed)
    .reduce((sum, log) => sum + (log.rakahCount ?? 0), 0);

  const qiyamNights = nightLogs.filter(
    (log) => weekKeys.has(log.localDate) && log.slot === 'qiyam' && log.completed
  ).length;

  const improvementDelta =
    biggestImprovement.delta > 0 ? `+${percent(biggestImprovement.delta)}` : undefined;

  const preview: ReviewMetric[] = [
    {
      id: 'on-time',
      label: 'On time',
      value: `${week.onTime} / ${week.completed}`,
      progress: week.onTimeRate,
    },
    { id: 'fajr', label: 'Fajr consistency', value: percent(fajrRate), progress: fajrRate },
    {
      id: 'improvement',
      label: 'Biggest improvement',
      value: biggestImprovement.name,
      delta: improvementDelta,
    },
  ];

  const metrics: ReviewMetric[] = [
    {
      id: 'completed',
      label: 'Prayers completed this week',
      value: `${week.completed} / ${possible}`,
      progress: week.completionRate,
      tone: week.completionRate >= 1 ? 'complete' : 'default',
    },
    {
      id: 'on-time',
      label: 'On-time prayers',
      value: `${week.onTime} / ${week.completed}`,
      progress: week.onTimeRate,
    },
    { id: 'fajr', label: 'Fajr consistency', value: percent(fajrRate), progress: fajrRate },
    {
      id: 'most-consistent',
      label: 'Most consistent prayer',
      value: `${mostConsistent.name} — ${percent(mostConsistent.rate)}`,
      progress: mostConsistent.rate,
      tone: mostConsistent.rate >= 1 ? 'complete' : 'default',
    },
    {
      id: 'improvement',
      label: 'Biggest improvement',
      value: biggestImprovement.name,
      delta: improvementDelta,
    },
    { id: 'streak', label: 'Current streak', value: `${week.streaks.current} days` },
    { id: 'masjid', label: 'Mosque prayers', value: `${masjid} this week` },
    { id: 'congregation', label: 'Congregation prayers', value: `${congregation} this week` },
    { id: 'sunnah', label: 'Sunnah / Nawafil', value: `${sunnahRakahs} rak'ahs` },
    { id: 'night', label: 'Night Prayer', value: `${qiyamNights} nights this week` },
  ];

  return { hasData: week.hasData, preview, metrics };
}
