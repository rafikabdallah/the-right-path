import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';

import {
  getSettings,
  locationChangedMeaningfully,
  updateSettings,
  type AppSettings,
} from '@/repositories/settingsRepository';
import { deviceTimeZone } from '@/services/dates';
import {
  calculatePrayerTimes,
  type DayPrayerTimes,
  type PrayerCalculationSettings,
} from '@/services/prayerTimes';

export type LocationStatus =
  | 'loading'
  | 'ready'
  | 'denied'
  | 'unavailable'
  | 'needs-location';

export interface PrayerTimesState {
  settings: AppSettings | null;
  status: LocationStatus;
  /** Null until a location is known — the UI shows a fallback instead. */
  times: DayPrayerTimes | null;
  /** Re-asks for permission after the user was previously denied. */
  requestLocation: () => Promise<void>;
  reload: () => void;
}

/**
 * Resolves settings and location once, then derives prayer times for the
 * requested day.
 *
 * Location is read, not watched: a last-known fix gives an instant first
 * paint, a single fresh read refines it, and the coordinates are only
 * written back when they have moved far enough to change the calculation.
 * Nothing here subscribes to GPS.
 */
export function usePrayerTimes(dateKey: string): PrayerTimesState {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [status, setStatus] = useState<LocationStatus>('loading');
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  const resolveLocation = useCallback(async (current: AppSettings, ask: boolean) => {
    const permission = ask
      ? await Location.requestForegroundPermissionsAsync()
      : await Location.getForegroundPermissionsAsync();

    if (!permission.granted) {
      // Denied is not a failure state: stored coordinates (or a city chosen
      // later in Settings) still produce times.
      setStatus(current.latitude !== null ? 'ready' : 'denied');
      return;
    }

    // Fast path first so the screen can render immediately.
    const known = await Location.getLastKnownPositionAsync({ maxAge: 1000 * 60 * 60 * 6 });
    if (known && locationChangedMeaningfully(current, known.coords)) {
      const saved = await updateSettings({
        latitude: known.coords.latitude,
        longitude: known.coords.longitude,
        timeZone: deviceTimeZone(),
        locationMode: 'device',
      });
      setSettings(saved);
      current = saved;
    }
    setStatus('ready');

    // Then refine once, in the background.
    try {
      const fresh = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (locationChangedMeaningfully(current, fresh.coords)) {
        const saved = await updateSettings({
          latitude: fresh.coords.latitude,
          longitude: fresh.coords.longitude,
          timeZone: deviceTimeZone(),
          locationMode: 'device',
        });
        setSettings(saved);
      }
    } catch {
      // A failed refresh is harmless — the last known fix still stands.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const loaded = await getSettings();
      if (cancelled) return;

      // A timezone change (travel, DST) must reach the stored settings, since
      // every date key and displayed time depends on it.
      const timeZone = deviceTimeZone();
      const current =
        loaded.timeZone === timeZone ? loaded : await updateSettings({ timeZone });

      if (cancelled) return;
      setSettings(current);
      setStatus(current.latitude !== null ? 'ready' : 'loading');

      await resolveLocation(current, false);
    })().catch(() => {
      if (!cancelled) setStatus('unavailable');
    });

    return () => {
      cancelled = true;
    };
  }, [resolveLocation, nonce]);

  const requestLocation = useCallback(async () => {
    const current = settings ?? (await getSettings());
    setStatus('loading');
    await resolveLocation(current, true);
  }, [settings, resolveLocation]);

  const times = useMemo(() => {
    if (!settings || settings.latitude === null || settings.longitude === null) return null;

    const calculation: PrayerCalculationSettings = {
      method: settings.method,
      madhhab: settings.madhhab,
      adjustments: settings.adjustments,
    };

    return calculatePrayerTimes({
      latitude: settings.latitude,
      longitude: settings.longitude,
      dateKey,
      timeZone: settings.timeZone,
      settings: calculation,
    });
    // Recalculates when the date, the stored location, the timezone, or any
    // calculation setting changes — and at no other time.
  }, [settings, dateKey]);

  return { settings, status, times, requestLocation, reload };
}
