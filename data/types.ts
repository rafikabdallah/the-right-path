/**
 * Shared content types for mock data. Keep this file free of anything
 * React/UI-related — it describes content shape only, so the same shapes
 * can later be filled from a real backend without touching presentation
 * components.
 */

export type PillarId = 'spiritual' | 'mind' | 'body' | 'character';

export interface Subsection {
  id: string;
  name: string;
}

export type QuickReviewStatus = 'complete' | 'partial' | 'pending';

export interface QuickReviewItem {
  id: string;
  label: string;
  value: string;
  status: QuickReviewStatus;
}
