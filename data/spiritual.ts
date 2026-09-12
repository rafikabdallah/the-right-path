/**
 * Mock content for the Spiritual home screen. Static only — no tracking,
 * no persistence (see CLAUDE.md "Phase plan").
 */

export interface SpiritualSection {
  id: string;
  title: string;
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
  { id: 'salah', title: 'Salah' },
  { id: 'adhkar-dua', title: "Adhkar & Du'a" },
  { id: 'quran', title: 'Quran' },
  { id: 'islamic-knowledge', title: 'Islamic Knowledge' },
  { id: 'fasting', title: 'Fasting' },
  { id: 'sadaqah-charity', title: 'Sadaqah & Charity' },
];

/** Copy for the Quick Review entry point — a placeholder button for now. */
export const quickReview = {
  id: 'quick-review',
  title: 'Quick Review',
  subtitle: 'Review your spiritual day',
};
