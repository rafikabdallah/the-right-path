import { useCallback } from 'react';

import {
  getNightLogsForDate,
  getNightLogsInRange,
  setQiyam,
  setWitr,
  type NightPrayerLog,
} from '@/repositories/nightPrayerRepository';
import {
  getPrayerLogsForDate,
  getPrayerLogsInRange,
  savePrayerLog,
  setPrayerCompletion,
  type PrayerLog,
  type SavePrayerLogInput,
} from '@/repositories/prayerRepository';
import {
  addNaflEntry,
  getSunnahLogsForDate,
  getSunnahLogsInRange,
  removeNaflEntry,
  setRawatibCompletion,
  type SunnahLog,
} from '@/repositories/sunnahRepository';
import { dateKeyRange } from '@/services/dates';
import type { PrayerName } from '@/services/prayerTimes';

import { useDatabaseQuery } from './useDatabaseQuery';

/** One day's obligatory prayer records, keyed by prayer name. */
export function usePrayerDay(dateKey: string) {
  const query = useDatabaseQuery<PrayerLog[]>(() => getPrayerLogsForDate(dateKey), [dateKey]);

  const byName = new Map<PrayerName, PrayerLog>();
  for (const log of query.data ?? []) byName.set(log.prayerName, log);

  const toggle = useCallback(
    (prayerName: PrayerName, completed: boolean, scheduledTime: string | null) =>
      setPrayerCompletion({ dateKey, prayerName, scheduledTime, completed }),
    [dateKey]
  );

  /** The detail-sheet path: writes status, timing, place and congregation. */
  const saveDetails = useCallback(
    (input: Omit<SavePrayerLogInput, 'dateKey'>) => savePrayerLog({ ...input, dateKey }),
    [dateKey]
  );

  return { logs: query.data ?? [], byName, loading: query.loading, toggle, saveDetails };
}

/** Obligatory prayer history over a window ending at `endKey`. */
export function usePrayerRange(endKey: string, days: number) {
  const keys = dateKeyRange(endKey, days);
  const startKey = keys[0];

  return useDatabaseQuery<PrayerLog[]>(
    () => getPrayerLogsInRange(startKey, endKey),
    [startKey, endKey]
  );
}

/** One day's Sunnah records, split into fixed Rawatib slots and free Nafl. */
export function useSunnahDay(dateKey: string) {
  const query = useDatabaseQuery<SunnahLog[]>(() => getSunnahLogsForDate(dateKey), [dateKey]);
  const logs = query.data ?? [];

  const rawatib = new Map<string, SunnahLog>();
  const nafl: SunnahLog[] = [];
  for (const log of logs) {
    if (log.category === 'rawatib') rawatib.set(log.sunnahId, log);
    else nafl.push(log);
  }

  const setRawatib = useCallback(
    (sunnahId: string, rakahCount: number, completed: boolean) =>
      setRawatibCompletion({ dateKey, sunnahId, rakahCount, completed }),
    [dateKey]
  );

  const addNafl = useCallback(
    (rakahCount: number) => addNaflEntry(dateKey, rakahCount),
    [dateKey]
  );

  return {
    rawatib,
    nafl,
    loading: query.loading,
    setRawatib,
    addNafl,
    removeNafl: removeNaflEntry,
  };
}

export function useSunnahRange(endKey: string, days: number) {
  const keys = dateKeyRange(endKey, days);
  const startKey = keys[0];

  return useDatabaseQuery<SunnahLog[]>(
    () => getSunnahLogsInRange(startKey, endKey),
    [startKey, endKey]
  );
}

/** One night's Qiyam and Witr records. */
export function useNightDay(dateKey: string) {
  const query = useDatabaseQuery<NightPrayerLog[]>(
    () => getNightLogsForDate(dateKey),
    [dateKey]
  );
  const logs = query.data ?? [];

  const qiyam = logs.find((log) => log.slot === 'qiyam') ?? null;
  const witr = logs.find((log) => log.slot === 'witr') ?? null;

  const recordQiyam = useCallback(
    (rakahCount: number, afterSleeping: boolean) =>
      setQiyam({ dateKey, rakahCount, afterSleeping }),
    [dateKey]
  );

  const recordWitr = useCallback(
    (completed: boolean) => setWitr(dateKey, completed),
    [dateKey]
  );

  return { qiyam, witr, loading: query.loading, recordQiyam, recordWitr };
}

export function useNightRange(endKey: string, days: number) {
  const keys = dateKeyRange(endKey, days);
  const startKey = keys[0];

  return useDatabaseQuery<NightPrayerLog[]>(
    () => getNightLogsInRange(startKey, endKey),
    [startKey, endKey]
  );
}
