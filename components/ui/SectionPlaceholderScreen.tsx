import { useLocalSearchParams } from 'expo-router';

import { spiritualSectionIcons } from '@/constants/pillars';
import { quickReview, spiritualSections } from '@/data/spiritual';

import { PlaceholderDetail } from './PlaceholderDetail';

/**
 * Placeholder destination for a tapped Spiritual tile (or Quick Review).
 * Salah is the exception — it has a static route and a real screen.
 */
export function SectionPlaceholderScreen() {
  const { section: sectionId } = useLocalSearchParams<{ section: string }>();

  const section =
    sectionId === quickReview.id
      ? quickReview
      : spiritualSections.find((item) => item.id === sectionId);

  return (
    <PlaceholderDetail
      title={section?.title}
      icon={sectionId ? spiritualSectionIcons[sectionId] : undefined}
    />
  );
}
