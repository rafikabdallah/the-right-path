import type { QuickReviewItem } from './types';

/**
 * Mock content for the Spiritual page's Quick Review section.
 * Replace with real tracked data in Phase 4 — nothing else should need to
 * change when that happens, since components read this shape, not this
 * specific data.
 */
export const spiritualQuickReview: QuickReviewItem[] = [
  { id: 'salah', label: 'Salah', value: '4/5', status: 'partial' },
  { id: 'quran', label: 'Quran', value: '12 verses', status: 'complete' },
  { id: 'adhkar-morning', label: 'Adhkar — Morning', value: 'Done', status: 'complete' },
  { id: 'adhkar-evening', label: 'Adhkar — Evening', value: 'Pending', status: 'pending' },
  { id: 'knowledge', label: 'Islamic Knowledge', value: '25 min', status: 'complete' },
  { id: 'charity', label: 'Charity', value: 'Completed', status: 'complete' },
];
