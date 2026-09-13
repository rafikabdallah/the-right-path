import { useMemo, useState } from 'react';

import { getNightLogsInRange } from '@/repositories/nightPrayerRepository';
import { getPrayerLogsInRange } from '@/repositories/prayerRepository';
import { getSunnahLogsInRange } from '@/repositories/sunnahRepository';
import { dateKeyRange, deviceTimeZone, todayKey } from '@/services/dates';
import { summarisePrayerReview, type PrayerReview } from '@/services/prayerAnalytics';

import { useDatabaseQuery } from './useDatabaseQuery';

/**
 * The Prayer Review, derived from two weeks of stored rows — the second week
 * only so "biggest improvement" can be a real comparison.
 */
export function usePrayerReview(): { review: PrayerReview; loading: boolean } {
  const [timeZone] = useState(deviceTimeZone);
  const [endKey] = useState(() => todayKey(timeZone));
  const startKey = dateKeyRange(endKey, 14)[0];

  const query = useDatabaseQuery(
    async () => {
      const [prayers, sunnah, night] = await Promise.all([
        getPrayerLogsInRange(startKey, endKey),
        getSunnahLogsInRange(startKey, endKey),
        getNightLogsInRange(startKey, endKey),
      ]);
      return { prayers, sunnah, night };
    },
    [startKey, endKey]
  );

  const review = useMemo(
    () =>
      summarisePrayerReview(
        query.data?.prayers ?? [],
        query.data?.sunnah ?? [],
        query.data?.night ?? [],
        endKey
      ),
    [query.data, endKey]
  );

  return { review, loading: query.loading };
}
