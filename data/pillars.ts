import type { PillarId, Subsection } from './types';

/**
 * Mock content: the subsections listed under each pillar.
 * This is the spec from CLAUDE.md ("Pillar subsections") — don't add,
 * remove, or reorder without a product decision.
 */
export const pillarSubsections: Record<PillarId, Subsection[]> = {
  spiritual: [
    { id: 'salah', name: 'Salah' },
    { id: 'adhkar-dua', name: "Adhkar & Du'a" },
    { id: 'quran', name: 'Quran' },
    { id: 'islamic-knowledge', name: 'Islamic Knowledge' },
    { id: 'fasting', name: 'Fasting' },
    { id: 'sadaqah-charity', name: 'Sadaqah & Charity' },
    { id: 'character-sins', name: 'Character & Sins' },
    { id: 'family-people', name: 'Family & People' },
    { id: 'mosque-community', name: 'Mosque & Community' },
    { id: 'tawbah-reflection', name: 'Tawbah & Self-Reflection' },
  ],
  mind: [
    { id: 'study', name: 'Study' },
    { id: 'reading', name: 'Reading' },
    { id: 'learning', name: 'Learning' },
    { id: 'critical-thinking', name: 'Critical Thinking' },
    { id: 'skills', name: 'Skills' },
    { id: 'reflection', name: 'Reflection' },
  ],
  body: [
    { id: 'exercise', name: 'Exercise' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'recovery', name: 'Recovery' },
  ],
  character: [
    { id: 'discipline', name: 'Discipline' },
    { id: 'patience', name: 'Patience' },
    { id: 'emotions', name: 'Emotions' },
    { id: 'family', name: 'Family' },
    { id: 'relationships', name: 'Relationships' },
    { id: 'responsibility', name: 'Responsibility' },
    { id: 'self-control', name: 'Self-control' },
    { id: 'good-manners', name: 'Good manners' },
  ],
};
