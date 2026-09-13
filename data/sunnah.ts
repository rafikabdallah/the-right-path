/**
 * Static definitions for the Sunnah screen.
 *
 * This is structure, not history: which Rawatib exist and how many rak'ahs
 * each carries. What was actually prayed lives in SQLite.
 */

export interface RawatibEntry {
  id: string;
  name: string;
  rakahs: number;
}

export const rawatibHero = {
  title: '12 Rawatib',
  subtitle: 'House in Jannah',
  body: 'Whoever keeps to twelve voluntary rak‘ahs through the day and night has a house built for them in Paradise.',
  source: 'Reported by Muslim',
};

/** The five confirmed Sunnah prayers of the day. These sum to 12 rak'ahs. */
export const rawatib: RawatibEntry[] = [
  { id: 'fajr-before', name: 'Sunnah of Fajr', rakahs: 2 },
  { id: 'dhuhr-before', name: 'Before Dhuhr', rakahs: 4 },
  { id: 'dhuhr-after', name: 'After Dhuhr', rakahs: 2 },
  { id: 'maghrib-after', name: 'After Maghrib', rakahs: 2 },
  { id: 'isha-after', name: 'After Isha', rakahs: 2 },
];

export const rawatibTotal = rawatib.reduce((sum, entry) => sum + entry.rakahs, 0);

/**
 * Which Rawatib the screen highlights as current. Still a fixed choice:
 * tying it to live prayer windows is a later refinement.
 */
export const currentRawatibId = 'dhuhr-after';

/** Rak'ah counts offered in the "add prayer" sheet. */
export const rakahOptions = [2, 4, 6, 8];
