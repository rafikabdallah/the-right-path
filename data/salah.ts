/**
 * Static content for the Salah screen.
 *
 * Prayer times, completions and statistics are no longer here — they come
 * from the prayer-time service and SQLite. What remains is genuine content:
 * the ayah, and the definition of the two subsection blocks.
 */

export const salahAyah = {
  arabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا',
  translation: 'Indeed, prayer has been prescribed upon the believers at specified times.',
  reference: "Qur'an 4:103",
};

/**
 * The two blocks below the daily prayers, each with its own screen.
 */
export interface SalahBlock {
  id: string;
  title: string;
  /** What the block covers — kept as the spec of record. */
  covers: string[];
}

export const salahBlocks: SalahBlock[] = [
  {
    id: 'sunnah',
    title: 'Sunnah',
    covers: ['Rawatib', 'Witr', 'Other regular Sunnah'],
  },
  {
    id: 'night-prayer',
    title: 'Night Prayer',
    covers: ['Qiyam al-Layl', 'Tahajjud', 'Witr'],
  },
];
