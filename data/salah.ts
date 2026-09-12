/**
 * Mock content and initial state for the Salah screen.
 *
 * Everything here is local and static — no prayer-time calculation, no
 * persistence, no backend (see CLAUDE.md "Phase plan"). Swapping these for
 * real data later shouldn't require touching the components.
 */

export type PrayerStatus = 'prayed' | 'not-prayed';
export type PrayerTiming = 'on-time' | 'late';
export type PrayerPlace = 'masjid' | 'home' | 'other';
export type PrayerCompany = 'congregation' | 'alone';

export interface PrayerRecord {
  status: PrayerStatus;
  timing: PrayerTiming;
  place: PrayerPlace;
  company: PrayerCompany;
}

export interface Prayer {
  id: string;
  name: string;
}

export const salahAyah = {
  arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا',
  translation: 'Indeed, prayer has been prescribed upon the believers at specified times.',
  reference: "Qur'an 4:103",
};

/**
 * Weekly overview. Framed around growth — "Biggest improvement", never
 * "most missed". When real data arrives, a metric without enough history
 * should say so rather than invent a number.
 */
export interface OverviewStat {
  id: string;
  label: string;
  value: string;
}

export const weeklyOverview: OverviewStat[] = [
  { id: 'fajr-consistency', label: 'Fajr consistency', value: '78%' },
  { id: 'biggest-improvement', label: 'Biggest improvement', value: 'Maghrib +22%' },
  { id: 'on-time', label: 'On time', value: '27 / 35' },
  { id: 'extra-prayers', label: 'Extra prayers', value: '9' },
];

export const dailyPrayers: Prayer[] = [
  { id: 'fajr', name: 'Fajr' },
  { id: 'dhuhr', name: 'Dhuhr' },
  { id: 'asr', name: 'Asr' },
  { id: 'maghrib', name: 'Maghrib' },
  { id: 'isha', name: 'Isha' },
];

export const initialPrayerRecords: Record<string, PrayerRecord> = {
  fajr: { status: 'not-prayed', timing: 'on-time', place: 'home', company: 'alone' },
  dhuhr: { status: 'prayed', timing: 'on-time', place: 'masjid', company: 'congregation' },
  asr: { status: 'prayed', timing: 'late', place: 'home', company: 'alone' },
  maghrib: { status: 'prayed', timing: 'on-time', place: 'masjid', company: 'congregation' },
  isha: { status: 'not-prayed', timing: 'on-time', place: 'home', company: 'alone' },
};

export const sunnahPrayers: Prayer[] = [
  { id: 'rawatib', name: 'Rawatib' },
  { id: 'witr', name: 'Witr' },
  { id: 'other-sunnah', name: 'Other regular Sunnah' },
];

export const nawafilPrayers: Prayer[] = [
  { id: 'duha', name: 'Duha' },
  { id: 'voluntary', name: 'General voluntary prayer' },
  { id: 'other-nawafil', name: 'Other voluntary prayers' },
];

/**
 * Witr intentionally reuses the `witr` id from the Sunnah list — the two
 * entries are the same prayer, so they share one piece of state rather
 * than tracking it twice.
 */
export const nightPrayers: Prayer[] = [
  { id: 'qiyam', name: 'Qiyam al-Layl' },
  { id: 'tahajjud', name: 'Tahajjud' },
  { id: 'witr', name: 'Witr' },
];

/** Flat map keyed by prayer id, so shared ids stay in sync. */
export const initialSecondaryState: Record<string, boolean> = {
  rawatib: true,
  witr: false,
  'other-sunnah': false,
  duha: true,
  voluntary: false,
  'other-nawafil': false,
  qiyam: false,
  tahajjud: false,
};
