import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { AppHeader } from '@/components/ui/AppHeader';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';
import { Divider } from '@/components/ui/Divider';
import { LineChart, type ChartPoint } from '@/components/ui/LineChart';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SwipeCompleteRow } from '@/components/ui/SwipeCompleteRow';
import { colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';
import { useNightDay, useNightRange } from '@/hooks/usePrayerHistory';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { deviceTimeZone, todayKey, weekdayInitial, weekdayName } from '@/services/dates';
import { summariseNight } from '@/services/prayerAnalytics';

import { RakahSheet } from './RakahSheet';

const SCREEN_PADDING = spacing.gutter;
const WINDOW_DAYS = 7;
/** Chart ceiling when the week's own maximum is smaller. */
const MIN_CHART_MAX = 8;

/**
 * Night Prayer — Qiyam al-Layl and Witr.
 *
 * Qiyam and Tahajjud are one record: the sheet asks whether it was after
 * sleeping, and that answer names it. The tonight card uses real calculated
 * boundaries (adhan derives the last third from this night's Maghrib and
 * tomorrow's Fajr), and the chart reads recorded rak'ahs, never mock values.
 */
export function NightPrayerScreen() {
  const navClearance = usePillarNavClearance();
  const { width } = useWindowDimensions();
  const contentWidth = width - SCREEN_PADDING * 2;

  const [fallbackZone] = useState(deviceTimeZone);
  const [dateKey] = useState(() => todayKey(fallbackZone));

  const { settings, times } = usePrayerTimes(dateKey);
  const timeZone = settings?.timeZone ?? fallbackZone;

  const { qiyam, witr, recordQiyam, recordWitr } = useNightDay(dateKey);
  const range = useNightRange(dateKey, WINDOW_DAYS);

  const [sheetOpen, setSheetOpen] = useState(false);

  const stats = useMemo(
    () => summariseNight(range.data ?? [], dateKey, WINDOW_DAYS),
    [range.data, dateKey]
  );

  const points: ChartPoint[] = useMemo(
    () =>
      stats.series.map((point) => ({
        label: weekdayInitial(point.dateKey, timeZone),
        value: point.value,
        status: point.flags?.witr ? 'done' : 'none',
        tooltipTitle: weekdayName(point.dateKey, timeZone),
        tooltipLines: [
          `${point.value} rak‘ahs`,
          point.flags?.witr ? 'Witr ✓' : 'Witr —',
          point.flags?.lastThird ? 'Last third ✓' : 'Last third —',
        ],
      })),
    [stats, timeZone]
  );

  const chartMax = Math.max(MIN_CHART_MAX, ...stats.series.map((point) => point.value));

  const qiyamRakahs = qiyam?.completed ? (qiyam.rakahCount ?? 0) : 0;
  const qiyamPrayed = qiyamRakahs > 0;
  const qiyamName = qiyam?.afterSleeping ? 'Tahajjud' : 'Qiyam al-Layl';

  const timeline = times
    ? [
        { id: 'isha', label: 'Isha', time: times.prayers[4].display },
        { id: 'last-third', label: 'Last third', time: times.night.lastThirdDisplay },
        { id: 'fajr', label: 'Fajr', time: times.prayers[0].display },
      ]
    : [];

  const summary = [
    { id: 'nights', value: `${stats.nightsWithQiyam} nights`, label: 'Qiyam this week' },
    { id: 'rakahs', value: `${stats.totalRakahs} rak‘ahs`, label: 'Total Qiyam' },
    {
      id: 'witr',
      value: `${stats.nightsWithWitr} / ${stats.totalDays}`,
      label: 'Witr',
    },
  ];

  return (
    <View style={styles.root}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
          showsVerticalScrollIndicator={false}
        >
          <AppHeader title="Night Prayer" leading="back" emphasis="screen" />

          {/* Tonight */}
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>TONIGHT</Text>

            {times ? (
              <>
                <Text style={styles.heroCaption}>Last third begins at</Text>
                <Text style={styles.heroTime}>{times.night.lastThirdDisplay}</Text>

                <View style={styles.timeline}>
                  {timeline.map((stop, index) => (
                    <View key={stop.id} style={styles.timelineCell}>
                      {index > 0 ? <View style={styles.timelineLine} /> : null}
                      <View style={styles.timelineStop}>
                        <View
                          style={[
                            styles.timelineDot,
                            stop.id === 'last-third' && styles.timelineDotActive,
                          ]}
                        />
                        <Text
                          style={[
                            styles.timelineLabel,
                            stop.id === 'last-third' && styles.timelineLabelActive,
                          ]}
                        >
                          {stop.label.toUpperCase()}
                        </Text>
                        <Text style={styles.timelineTime}>{stop.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.heroCaption}>
                Allow location to see tonight&apos;s boundaries.
              </Text>
            )}
          </View>

          {/* Qiyam al-Layl */}
          <View style={styles.section}>
            <SectionHeading title="Qiyam al-Layl" />

            <Pressable
              onPress={() => setSheetOpen(true)}
              style={[styles.qiyamCard, qiyamPrayed && styles.qiyamCardDone]}
              accessibilityRole="button"
              accessibilityLabel={
                qiyamPrayed
                  ? `${qiyamName}, ${qiyamRakahs} rak'ahs tonight. Tap to change.`
                  : 'Qiyam al-Layl, not prayed tonight. Tap to record.'
              }
            >
              <Text style={styles.qiyamTitle}>{qiyamName}</Text>
              <Text style={[styles.qiyamState, qiyamPrayed && styles.qiyamStateDone]}>
                {qiyamPrayed ? `${qiyamRakahs} rak‘ahs tonight` : 'Not prayed tonight'}
              </Text>
            </Pressable>
          </View>

          {/* Witr */}
          <View style={styles.section}>
            <SectionHeading title="Witr" />
            <SwipeCompleteRow
              title="Witr"
              state={witr?.completed ? 'complete' : 'pending'}
              width={contentWidth}
              showChevron={false}
              onToggle={recordWitr}
              accessibilityStatus={witr?.completed ? 'Completed' : 'Not completed'}
              accessibilityHintText="Swipe right to mark as complete"
            />
          </View>

          <Divider />

          {/* Your nights */}
          <View style={styles.section}>
            <SectionHeading title="Your nights" />

            {stats.hasData ? (
              <>
                <LineChart points={points} maxValue={chartMax} width={contentWidth} />

                <View style={styles.summary}>
                  {summary.map((item) => (
                    <View key={item.id} style={styles.summaryCell}>
                      <Text style={styles.summaryValue}>{item.value}</Text>
                      <Text style={styles.summaryLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <ChartEmptyState message="Record a night prayer and your nights will appear here." />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <RakahSheet
        visible={sheetOpen}
        title="Qiyam al-Layl"
        askAfterSleeping
        rakahs={qiyamRakahs}
        afterSleeping={qiyam?.afterSleeping ?? false}
        onConfirm={recordQiyam}
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
    gap: spacing.xxs,
  },
  heroLabel: {
    ...textStyles.labelMd,
    color: colors.primaryLight,
    letterSpacing: letterSpacings.wide,
  },
  heroCaption: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  heroTime: {
    ...textStyles.headlineLg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeline: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  timelineCell: {
    flex: 1,
    alignItems: 'center',
  },
  // Joins this stop to the previous one, behind the dot.
  timelineLine: {
    position: 'absolute',
    top: 4,
    right: '50%',
    left: '-50%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderPurpleSoft,
  },
  timelineStop: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.borderStrong,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
  },
  timelineLabel: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  timelineLabelActive: {
    color: colors.primaryLight,
  },
  timelineTime: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.md,
  },
  qiyamCard: {
    backgroundColor: colors.statePendingSurface,
    borderWidth: 1,
    borderColor: colors.statePendingBorder,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  qiyamCardDone: {
    backgroundColor: colors.stateCompleteSurface,
    borderColor: colors.stateCompleteBorder,
  },
  qiyamTitle: {
    ...textStyles.headlineSm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  qiyamState: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
  },
  qiyamStateDone: {
    color: colors.textOnAccent,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
  summaryValue: {
    ...textStyles.bodyLg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...textStyles.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
