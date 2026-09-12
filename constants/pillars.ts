import type { ComponentType } from 'react';
import {
  BookOpen,
  Brain,
  Compass,
  Dumbbell,
  GraduationCap,
  HandCoins,
  HandHeart,
  Heart,
  Moon,
  MoonStar,
  Sparkles,
} from 'lucide-react-native';

import { colors } from '@/constants/theme';
import type { PillarId } from '@/data/types';

/**
 * UI-layer config: which icon and accent color represents each pillar and
 * each Spiritual section. Kept out of `data/` so the content files stay
 * pure and swappable for real data later.
 */
export type IconComponent = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

export interface PillarConfig {
  id: PillarId;
  label: string;
  icon: IconComponent;
  /** Quiet identity tint for this pillar's own screen. Nav/transition use purple. */
  color: string;
}

export const pillars: PillarConfig[] = [
  { id: 'spiritual', label: 'Spiritual', icon: MoonStar, color: colors.pillarSpiritual },
  { id: 'mind', label: 'Mind', icon: Brain, color: colors.pillarMind },
  { id: 'body', label: 'Body', icon: Dumbbell, color: colors.pillarBody },
  { id: 'character', label: 'Character', icon: Heart, color: colors.pillarCharacter },
];

export const pillarById: Record<PillarId, PillarConfig> = {
  spiritual: pillars[0],
  mind: pillars[1],
  body: pillars[2],
  character: pillars[3],
};

/** Icons for the six Spiritual sections shown in UI V1. */
export const spiritualSectionIcons: Record<string, IconComponent> = {
  salah: Compass,
  'adhkar-dua': HandHeart,
  quran: BookOpen,
  'islamic-knowledge': GraduationCap,
  fasting: Moon,
  'sadaqah-charity': HandCoins,
  'quick-review': Sparkles,
};
