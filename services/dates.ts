/**
 * Date helpers, all timezone-aware.
 *
 * A "local date key" (`YYYY-MM-DD`) is the app's primary key for a day. It
 * is always computed in the user's timezone, never from a UTC instant, so a
 * prayer logged at 23:00 belongs to that evening and not to the next day.
 */

/** The device's IANA timezone, e.g. `Europe/Rome`. */
export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * `YYYY-MM-DD` for the given instant in the given zone. `en-CA` is used
 * because its short date format is already ISO-ordered.
 */
export function localDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Today's key in the given zone. */
export function todayKey(timeZone: string): string {
  return localDateKey(new Date(), timeZone);
}

/** Shifts a `YYYY-MM-DD` key by whole days without crossing into UTC math. */
export function shiftDateKey(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number);
  // Noon UTC keeps the arithmetic clear of DST edges in every zone.
  const anchor = new Date(Date.UTC(year, month - 1, day, 12));
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return anchor.toISOString().slice(0, 10);
}

/**
 * A Date positioned at local noon of the given key, suitable for handing to
 * adhan (which reads the calendar day, not the time of day).
 */
export function dateKeyToDate(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function compareDateKeys(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isFutureDateKey(key: string, timeZone: string): boolean {
  return compareDateKeys(key, todayKey(timeZone)) > 0;
}

/** Inclusive list of keys ending at `endKey`, oldest first. */
export function dateKeyRange(endKey: string, days: number): string[] {
  const keys: string[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    keys.push(shiftDateKey(endKey, -offset));
  }
  return keys;
}

/** e.g. "Sunday, 13 September". Localized — never hard-coded English. */
export function formatDateLong(key: string, timeZone: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(dateKeyToDate(key));
}

/** Single-letter weekday label for chart axes. */
export function weekdayInitial(key: string, timeZone: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone, weekday: 'narrow' }).format(
    dateKeyToDate(key)
  );
}

/** Full weekday name, used in chart tooltips. */
export function weekdayName(key: string, timeZone: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone, weekday: 'long' }).format(
    dateKeyToDate(key)
  );
}

/** Clock time for an instant, e.g. "05:12". */
export function formatTime(date: Date, timeZone: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function nowIso(): string {
  return new Date().toISOString();
}
