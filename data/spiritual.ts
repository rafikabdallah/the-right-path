/**
 * Mock content for the Spiritual home screen. Static only — no tracking,
 * no persistence (see CLAUDE.md "Phase plan"). Copy and values follow the
 * approved `design-reference/spiritual-home.png`.
 */

export interface SpiritualSection {
  id: string;
  title: string;
  /** Micro-label under the title. Static placeholder content. */
  subtitle: string;
}

/**
 * The six sections shown in UI V1.
 *
 * The full Spiritual architecture has ten (see CLAUDE.md "Pillar
 * subsections"); Character & Sins, Family & People, Mosque & Community and
 * Tawbah & Self-Reflection are deliberately postponed so this first screen
 * stays clean. Don't add them back without a product decision.
 */
export const spiritualSections: SpiritualSection[] = [
  { id: 'salah', title: 'Salah', subtitle: 'Asr 16:28' },
  { id: 'adhkar-dua', title: "Adhkar & Du'a", subtitle: 'Morning & Evening' },
  { id: 'quran', title: 'Quran', subtitle: 'Surah Al-Kahf' },
  { id: 'islamic-knowledge', title: 'Islamic Knowledge', subtitle: 'Tafsir & Seerah' },
  { id: 'fasting', title: 'Fasting', subtitle: 'Mon & Thu Sunnah' },
  { id: 'sadaqah-charity', title: 'Sadaqah & Charity', subtitle: 'Daily Water Well' },
];

/** Heading above the grid. */
export const gatewaysHeading = {
  title: 'Spiritual Gateways',
  subtitle: `${spiritualSections.length} Sanctuaries`,
};

export const spiritualIntro = {
  title: 'The Right Path',
  arabic: 'الطريق المستقيم',
};

/** Opening verse, set over the night artwork rather than in a card. */
export const openingVerse = {
  text: '"And whoever strives strives only for himself."',
  reference: "Qur'an 29:6",
};

/** The Quick Review summary. Stated in words — no dial, by design. */
export const quickReview = {
  id: 'quick-review',
  label: 'Quick Review',
  title: '4 of 5 Prayers Completed',
  subtitle: 'Daily Wird active • 1 Juz remaining',
};

/** Closing contemplation card. Presentational only — nothing is tracked. */
export const ayahOfPresence = {
  label: 'Reminder of the day',
  reference: "Qur'an 13:28",
  text: '"Verily, in the remembrance of Allah do hearts find rest."',
};
