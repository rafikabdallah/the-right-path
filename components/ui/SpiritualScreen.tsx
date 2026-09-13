import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { spiritualSectionIcons } from '@/constants/pillars';
import { colors, letterSpacings, spacing, textStyles } from '@/constants/theme';
import {
  ayahOfPresence,
  gatewaysHeading,
  openingVerse,
  quickReview,
  spiritualIntro,
  spiritualSections,
} from '@/data/spiritual';

import { AppHeader } from './AppHeader';
import { AyahCard } from './AyahCard';
import { QuickReviewCard } from './QuickReviewCard';
import { ScreenBackground } from './ScreenBackground';
import { SectionTile } from './SectionTile';

const SCREEN_PADDING = spacing.gutter;
const GRID_GAP = spacing.md;
/** Below this width three tiles would crush their labels, so drop to two. */
const THREE_COLUMN_MIN_WIDTH = 340;

/**
 * The Spiritual home screen — the app's opening screen.
 *
 * The night artwork is the identity here, so the screen opens on it: the
 * header and the verse sit directly on the sky, and only below them do
 * translucent panels start. Nothing is opaque enough to hide the mosque.
 */
export function SpiritualScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const navClearance = usePillarNavClearance();

  const columns = width >= THREE_COLUMN_MIN_WIDTH ? 3 : 2;
  const available = width - SCREEN_PADDING * 2 - GRID_GAP * (columns - 1);
  const tileSize = available / columns;

  return (
    <View style={styles.root}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
          showsVerticalScrollIndicator={false}
        >
          <AppHeader title={spiritualIntro.title} arabic={spiritualIntro.arabic} />

          <View style={styles.verse}>
            <Text style={styles.verseText}>{openingVerse.text}</Text>
            <Text style={styles.verseReference}>{openingVerse.reference}</Text>
          </View>

          <QuickReviewCard
            label={quickReview.label}
            title={quickReview.title}
            subtitle={quickReview.subtitle}
            onPress={() => router.push(`/spiritual/${quickReview.id}`)}
          />

          <View style={styles.gatewaysHeading}>
            <Text style={styles.gatewaysTitle}>{gatewaysHeading.title.toUpperCase()}</Text>
            <Text style={styles.gatewaysSubtitle}>
              {gatewaysHeading.subtitle.toUpperCase()}
            </Text>
          </View>

          <View style={[styles.grid, { gap: GRID_GAP }]}>
            {spiritualSections.map((section, index) => (
              <SectionTile
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                icon={spiritualSectionIcons[section.id]}
                size={tileSize}
                index={index}
                onPress={() => router.push(`/spiritual/${section.id}`)}
              />
            ))}
          </View>

          <AyahCard
            label={ayahOfPresence.label}
            reference={ayahOfPresence.reference}
            text={ayahOfPresence.text}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  // Set on the sky itself, with no panel behind it.
  verse: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  verseText: {
    ...textStyles.bodyLg,
    fontStyle: 'italic',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  verseReference: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gatewaysHeading: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  gatewaysTitle: {
    ...textStyles.labelLg,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: letterSpacings.wide,
  },
  gatewaysSubtitle: {
    ...textStyles.labelSm,
    color: colors.primaryLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
