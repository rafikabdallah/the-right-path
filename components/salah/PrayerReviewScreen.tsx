import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { AppHeader } from '@/components/ui/AppHeader';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, radii, spacing, textStyles } from '@/constants/theme';
import { usePrayerReview } from '@/hooks/usePrayerReview';
import type { ReviewMetric } from '@/services/prayerAnalytics';

import { ChartEmptyState } from '@/components/ui/ChartEmptyState';

/**
 * The full prayer review.
 *
 * This is about growth, not grading: figures are stated plainly, framed as
 * progress ("Biggest improvement"), and nothing is scored, ranked, or
 * compared against other people. Bars appear only where a ratio is
 * meaningful; green appears only where something is complete.
 */
export function PrayerReviewScreen() {
  const navClearance = usePillarNavClearance();
  const { review } = usePrayerReview();

  return (
    <View style={styles.root}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
          showsVerticalScrollIndicator={false}
        >
          <AppHeader
            title="Prayer Review"
            subtitle="This week"
            leading="back"
            emphasis="screen"
          />

          {review.hasData ? (
            <View style={styles.list}>
              {review.metrics.map((metric) => (
                <MetricRow key={metric.id} metric={metric} />
              ))}
            </View>
          ) : (
            <ChartEmptyState message="Record your prayers and your review will appear here." />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MetricRow({ metric }: { metric: ReviewMetric }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={2}>
          {metric.label}
        </Text>
        <View style={styles.valueGroup}>
          <Text
            style={[
              styles.value,
              metric.tone === 'complete' && styles.valueComplete,
            ]}
          >
            {metric.value}
          </Text>
          {metric.delta ? <Text style={styles.delta}>{metric.delta}</Text> : null}
        </View>
      </View>

      {metric.progress !== undefined ? (
        <ProgressBar progress={metric.progress} tone={metric.tone} />
      ) : null}
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
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    padding: spacing.gutter,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    ...textStyles.bodyLg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  valueComplete: {
    color: colors.success,
  },
  delta: {
    ...textStyles.labelMd,
    color: colors.primaryLight,
  },
});
