import type { ComponentType } from 'react';
import {
  Anchor,
  Apple,
  Activity,
  Book,
  BookOpen,
  Brain,
  Clock,
  Compass,
  Drama,
  Dumbbell,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Hourglass,
  Landmark,
  Lightbulb,
  MessageCircleHeart,
  Moon,
  Puzzle,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react-native';

import { colors } from '@/constants/theme';
import type { PillarId } from '@/data/types';

/**
 * UI-layer config for pillars and subsections: icon component + accent
 * color per id. Kept separate from `data/` (pure content) so the content
 * shapes stay swappable for real data without pulling React along.
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
  color: string;
}

export const pillars: PillarConfig[] = [
  { id: 'spiritual', label: 'Spiritual', icon: Compass, color: colors.pillarSpiritual },
  { id: 'mind', label: 'Mind', icon: Brain, color: colors.pillarMind },
  { id: 'body', label: 'Body', icon: Dumbbell, color: colors.pillarBody },
  { id: 'character', label: 'Character', icon: HeartHandshake, color: colors.pillarCharacter },
];

export const pillarById: Record<PillarId, PillarConfig> = {
  spiritual: pillars[0],
  mind: pillars[1],
  body: pillars[2],
  character: pillars[3],
};

export const subsectionIcons: Record<PillarId, Record<string, IconComponent>> = {
  spiritual: {
    salah: Clock,
    'adhkar-dua': MessageCircleHeart,
    quran: BookOpen,
    'islamic-knowledge': GraduationCap,
    fasting: Moon,
    'sadaqah-charity': HandHeart,
    'character-sins': Scale,
    'family-people': Users,
    'mosque-community': Landmark,
    'tawbah-reflection': RotateCcw,
  },
  mind: {
    study: BookOpen,
    reading: Book,
    learning: Lightbulb,
    'critical-thinking': Puzzle,
    skills: Wrench,
    reflection: RotateCcw,
  },
  body: {
    exercise: Dumbbell,
    sleep: Moon,
    nutrition: Apple,
    fitness: Activity,
    recovery: HeartPulse,
  },
  character: {
    discipline: Target,
    patience: Hourglass,
    emotions: Drama,
    family: Users,
    relationships: Handshake,
    responsibility: ShieldCheck,
    'self-control': Anchor,
    'good-manners': Sparkles,
  },
};
