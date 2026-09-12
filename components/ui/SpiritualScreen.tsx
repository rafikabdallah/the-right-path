import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { pillarById, spiritualSectionIcons } from '@/constants/pillars';
import { colors, spacing } from '@/constants/theme';
import { quickReview, spiritualSections } from '@/data/spiritual';

import { QuickReviewButton } from './QuickReviewButton';
import { ScreenHeader } from './ScreenHeader';
import { SpiritualSectionCard } from './SpiritualSectionCard';

const COLUMNS = 2;
const SCREEN_PADDING = spacing.lg;
const GRID_GAP = spacing.md;
/** Keeps tiles near-square without letting them get huge on wide phones. */
const MAX_TILE_SIZE = 200;

/**
 * The Spiritual home screen — the app's opening screen and the only fully
 * designed pillar in UI V1: header, Quick Review entry point, then the six
 * primary Spiritual sections as large tiles.
 */
export function SpiritualScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const navClearance = usePillarNavClearance();
  const pillar = pillarById.spiritual;

  const available = width - SCREEN_PADDING * 2 - GRID_GAP * (COLUMNS - 1);
  const tileSize = Math.min(available / COLUMNS, MAX_TILE_SIZE);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title={pillar.label} icon={pillar.icon} />

        <QuickReviewButton
          title={quickReview.title}
          subtitle={quickReview.subtitle}
          onPress={() => router.push(`/spiritual/${quickReview.id}`)}
        />

        <View style={styles.grid}>
          {spiritualSections.map((section, index) => (
            <SpiritualSectionCard
              key={section.id}
              title={section.title}
              icon={spiritualSectionIcons[section.id]}
              size={tileSize}
              index={index}
              onPress={() => router.push(`/spiritual/${section.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: spacing.xl,
    gap: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GRID_GAP,
  },
});
