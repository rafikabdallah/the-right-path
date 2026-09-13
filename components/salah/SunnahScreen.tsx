import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Info, Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { AppHeader } from '@/components/ui/AppHeader';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';
import { Divider } from '@/components/ui/Divider';
import { LineChart, type ChartPoint } from '@/components/ui/LineChart';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { SwipeCompleteRow } from '@/components/ui/SwipeCompleteRow';
import { colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';
import { useSunnahDay, useSunnahRange } from '@/hooks/usePrayerHistory';
import {
  currentRawatibId,
  rakahOptions,
  rawatib,
  rawatibHero,
  rawatibTotal,
} from '@/data/sunnah';
import { deviceTimeZone, todayKey, weekdayInitial, weekdayName } from '@/services/dates';
import { summariseSunnah } from '@/services/prayerAnalytics';

import { RakahSheet } from './RakahSheet';

const SCREEN_PADDING = spacing.gutter;
const WINDOW_DAYS = 7;

type ChartMode = 'rawatib' | 'nafl';

const CHART_SEGMENTS = [
  { value: 'rawatib' as const, label: 'Rawatib' },
  { value: 'nafl' as const, label: 'General Nafl' },
];

/**
 * Sunnah & Nafl — the voluntary counterpart to the obligatory prayers.
 *
 * Every figure here comes from SQLite: the rows reflect what was recorded
 * today, and the chart reads the last seven days of real history. There is
 * no mock data, and no flat zero-line standing in for an empty history.
 */
export function SunnahScreen() {
  const navClearance = usePillarNavClearance();
  const { width } = useWindowDimensions();
  const contentWidth = width - SCREEN_PADDING * 2;

  const [timeZone] = useState(deviceTimeZone);
  const [dateKey] = useState(() => todayKey(timeZone));

  const { rawatib: rawatibLogs, nafl, setRawatib, addNafl, removeNafl } = useSunnahDay(dateKey);
  const range = useSunnahRange(dateKey, WINDOW_DAYS);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const [mode, setMode] = useState<ChartMode>('rawatib');

  const stats = useMemo(
    () => summariseSunnah(range.data ?? [], dateKey, WINDOW_DAYS, rawatib.length),
    [range.data, dateKey]
  );

  const completedRakahs = rawatib.reduce(
    (sum, entry) => (rawatibLogs.get(entry.id)?.completed ? sum + entry.rakahs : sum),
    0
  );

  const naflToday = nafl.reduce((sum, entry) => sum + (entry.rakahCount ?? 0), 0);

  const points: ChartPoint[] = useMemo(() => {
    const series = mode === 'rawatib' ? stats.rawatibSeries : stats.naflSeries;

    return series.map((point) => ({
      label: weekdayInitial(point.dateKey, timeZone),
      value: point.value,
      tooltipTitle: weekdayName(point.dateKey, timeZone),
      tooltipLines: [
        mode === 'rawatib'
          ? `${point.value} / ${rawatibTotal} rak‘ahs`
          : `${point.value} Nafl rak‘ahs`,
      ],
    }));
  }, [mode, stats, timeZone]);

  const toggleRawatib = useCallback(
    (id: string, rakahs: number, complete: boolean) => setRawatib(id, rakahs, complete),
    [setRawatib]
  );

  const chartMax = mode === 'rawatib' ? rawatibTotal : Math.max(8, naflToday);

  return (
    <View style={styles.root}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
          showsVerticalScrollIndicator={false}
        >
          <AppHeader title="Sunnah & Nafl" leading="back" emphasis="screen" />

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroTitle}>{rawatibHero.title.toUpperCase()}</Text>
              <Pressable
                onPress={() => setHeroOpen((previous) => !previous)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="About the twelve Rawatib"
              >
                <Info color={colors.textSecondary} size={15} strokeWidth={2} />
              </Pressable>
            </View>
            <Text style={styles.heroSubtitle}>{rawatibHero.subtitle}</Text>
            {heroOpen ? (
              <>
                <Text style={styles.heroBody}>{rawatibHero.body}</Text>
                <Text style={styles.heroSource}>{rawatibHero.source}</Text>
              </>
            ) : null}
          </View>

          {/* Today's Sunnah */}
          <View style={styles.section}>
            <SectionHeading title="Today's Sunnah" />

            <View style={styles.rows}>
              {rawatib.map((entry) => {
                const complete = rawatibLogs.get(entry.id)?.completed ?? false;
                const state = complete
                  ? 'complete'
                  : entry.id === currentRawatibId
                    ? 'current'
                    : 'pending';

                return (
                  <SwipeCompleteRow
                    key={entry.id}
                    title={entry.name}
                    subtitle={`${entry.rakahs} rak‘ahs`}
                    state={state}
                    width={contentWidth}
                    showChevron={false}
                    onToggle={(value) => toggleRawatib(entry.id, entry.rakahs, value)}
                    accessibilityStatus={complete ? 'Completed' : 'Not completed'}
                    accessibilityHintText="Swipe right to mark as complete"
                  />
                );
              })}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {completedRakahs} / {rawatibTotal} Rawatib
              </Text>
            </View>
          </View>

          <Divider />

          {/* General Nafl */}
          <View style={styles.section}>
            <SectionHeading title="General Nafl" />

            {nafl.length > 0 ? (
              <View style={styles.naflList}>
                {nafl.map((entry) => (
                  <View key={entry.id} style={styles.naflEntry}>
                    <Text style={styles.naflEntryLabel}>{entry.rakahCount} rak‘ahs</Text>
                    <Pressable
                      onPress={() => removeNafl(entry.id)}
                      hitSlop={12}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${entry.rakahCount} rak'ahs`}
                    >
                      <X color={colors.textMuted} size={14} strokeWidth={2.2} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            <Pressable
              onPress={() => setSheetOpen(true)}
              style={styles.addCard}
              accessibilityRole="button"
              accessibilityLabel="Add Nafl prayer"
            >
              <Plus color={colors.textOnAccent} size={20} strokeWidth={2.5} />
              <Text style={styles.addLabel}>ADD NAFL</Text>
            </Pressable>
          </View>

          {/* This week */}
          <View style={styles.section}>
            <SectionHeading title="This week" />
            <SegmentedToggle segments={CHART_SEGMENTS} selected={mode} onSelect={setMode} />

            {stats.hasData ? (
              <LineChart points={points} maxValue={chartMax} width={contentWidth} />
            ) : (
              <ChartEmptyState message="Complete your Sunnah prayers and your progress will appear here." />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <RakahSheet
        visible={sheetOpen}
        title="General Nafl"
        rakahs={rakahOptions[0]}
        onConfirm={(value) => addNafl(value)}
        onClose={() => setSheetOpen(false)}
      />
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
    gap: spacing.lg,
  },
  hero: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroTitle: {
    ...textStyles.headlineSm,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: letterSpacings.wide,
  },
  heroSubtitle: {
    ...textStyles.bodyMd,
    color: colors.primaryLight,
  },
  heroBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  heroSource: {
    ...textStyles.labelSm,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  rows: {
    gap: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  totalLabel: {
    ...textStyles.labelMd,
    color: colors.textMuted,
    letterSpacing: letterSpacings.wide,
  },
  totalValue: {
    ...textStyles.bodyMd,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  naflList: {
    gap: spacing.sm,
  },
  // Compact glass rows, one per recorded prayer.
  naflEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  naflEntryLabel: {
    ...textStyles.bodyMd,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  // Everything centres on both axes: no directional padding, no row layout.
  addCard: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addLabel: {
    ...textStyles.labelLg,
    fontWeight: '700',
    color: colors.textOnAccent,
    letterSpacing: letterSpacings.wide,
    textAlign: 'center',
  },
});
