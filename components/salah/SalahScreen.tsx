import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MoonStar, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { AppHeader } from '@/components/ui/AppHeader';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { Divider } from '@/components/ui/Divider';
import { SectionTile } from '@/components/ui/SectionTile';
import { colors, radii, spacing, textStyles } from '@/constants/theme';
import { usePrayerDay } from '@/hooks/usePrayerHistory';
import { usePrayerTimes, type LocationStatus } from '@/hooks/usePrayerTimes';
import { salahBlocks } from '@/data/salah';
import { deviceTimeZone, shiftDateKey, todayKey } from '@/services/dates';
import { currentPrayerName, type PrayerName } from '@/services/prayerTimes';

import { DateNavigator } from './DateNavigator';
import { PrayerDetailSheet } from './PrayerDetailSheet';
import { PrayerReviewCard } from './PrayerReviewCard';
import { PrayerRow } from './PrayerRow';
import { SalahHeader } from './SalahHeader';
import { SectionLabel } from './SectionLabel';

const COLUMNS = 2;
// Matches the Spiritual home screen's canvas margin, and the width the
// Prayer Review shield draws itself at.
const SCREEN_PADDING = spacing.gutter;
const GRID_GAP = spacing.md;

/** Icons for the two blocks below the daily prayers. */
const BLOCK_ICONS = {
  sunnah: Sparkles,
  'night-prayer': MoonStar,
} as const;

/**
 * The Salah screen.
 *
 * Prayer times are calculated locally from the device's location, and every
 * completion is persisted to SQLite — the selected date, not component
 * state, is the source of truth for what is shown. Moving to another day
 * re-reads that day's records; returning to today re-reads today's.
 */
export function SalahScreen() {
  const router = useRouter();
  const navClearance = usePillarNavClearance();
  const { width } = useWindowDimensions();

  const rowWidth = width - SCREEN_PADDING * 2;
  const available = width - SCREEN_PADDING * 2 - GRID_GAP * (COLUMNS - 1);
  // Square tiles, matching the Spiritual home grid.
  const tileSize = available / COLUMNS;
  // The two blocks are wider than they are tall, so the pair stays compact.
  const tileHeight = Math.round(tileSize * 0.78);

  const [fallbackZone] = useState(deviceTimeZone);
  const [dateKey, setDateKey] = useState(() => todayKey(fallbackZone));

  const { settings, status, times, requestLocation } = usePrayerTimes(dateKey);
  const timeZone = settings?.timeZone ?? fallbackZone;
  const isToday = dateKey === todayKey(timeZone);

  const { byName, toggle, saveDetails } = usePrayerDay(dateKey);

  // The violet row: only meaningful today, and only once its time has come in.
  const currentPrayer: PrayerName | null = useMemo(
    () => (isToday && times ? currentPrayerName(times) : null),
    [isToday, times]
  );

  // The id is kept after closing so the sheet still has content to render
  // while it animates out; `sheetVisible` is what drives the animation.
  const [openPrayerId, setOpenPrayerId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const goPrevious = useCallback(() => setDateKey((key) => shiftDateKey(key, -1)), []);
  const goNext = useCallback(
    () => setDateKey((key) => (key === todayKey(timeZone) ? key : shiftDateKey(key, 1))),
    [timeZone]
  );

  const openPrayer = times?.prayers.find((entry) => entry.name === openPrayerId);
  const openLog = openPrayerId ? byName.get(openPrayerId as PrayerName) : undefined;

  const locationLabel = settings?.city
    ? `${settings.city} · Local prayer times`
    : status === 'ready'
      ? 'Local prayer times'
      : null;

  return (
    <View style={styles.root}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
          showsVerticalScrollIndicator={false}
        >
          <AppHeader
            title="Salah"
            subtitle="Connect with your Creator"
            leading="back"
            emphasis="screen"
          />

          <SalahHeader />

          <DateNavigator
            dateKey={dateKey}
            timeZone={timeZone}
            isToday={isToday}
            locationLabel={locationLabel}
            onPrevious={goPrevious}
            onNext={goNext}
          />

          <View style={styles.section}>
            <SectionLabel title="Daily prayers" emphasis="primary" align="center" />

            {times ? (
              <>
                <View style={styles.prayerList}>
                  {times.prayers.map((entry) => {
                    const log = byName.get(entry.name as PrayerName);

                    return (
                      <PrayerRow
                        key={entry.name}
                        name={entry.label}
                        time={entry.display}
                        completed={log?.completed ?? false}
                        timing={log?.timing ?? null}
                        place={log?.place ?? null}
                        congregation={log?.congregation ?? null}
                        isCurrent={entry.name === currentPrayer}
                        width={rowWidth}
                        onToggle={(completed) =>
                          toggle(entry.name as PrayerName, completed, entry.iso)
                        }
                        onOpenDetails={() => {
                          setOpenPrayerId(entry.name);
                          setSheetVisible(true);
                        }}
                      />
                    );
                  })}
                </View>

                <Text style={styles.sunrise}>Sunrise {times.sunrise.display}</Text>
              </>
            ) : (
              <LocationFallback status={status} onRequest={requestLocation} />
            )}
          </View>

          <Divider />

          <View style={styles.grid}>
            {salahBlocks.map((block, index) => (
              <SectionTile
                key={block.id}
                title={block.title}
                icon={BLOCK_ICONS[block.id as keyof typeof BLOCK_ICONS]}
                size={tileSize}
                height={tileHeight}
                index={index}
                onPress={() => router.push(`/spiritual/salah/${block.id}`)}
              />
            ))}
          </View>

          <Divider />

          <PrayerReviewCard onPress={() => router.push('/spiritual/salah/review')} />
        </ScrollView>
      </SafeAreaView>

      {openPrayer ? (
        <PrayerDetailSheet
          visible={sheetVisible}
          name={openPrayer.label}
          scheduledTime={openPrayer.display}
          completedAt={openLog?.completedAt ?? null}
          timeZone={timeZone}
          value={{
            status: openLog?.completed ? 'prayed' : 'pending',
            timing: openLog?.timing ?? null,
            place: openLog?.place ?? null,
            congregation: openLog?.congregation ?? null,
          }}
          onChange={(value) =>
            saveDetails({
              prayerName: openPrayer.name as PrayerName,
              scheduledTime: openPrayer.iso,
              status: value.status,
              timing: value.timing,
              place: value.place,
              congregation: value.congregation,
            })
          }
          onClose={() => setSheetVisible(false)}
        />
      ) : null}
    </View>
  );
}

/**
 * Stands in for the prayer list when there is no usable location. The screen
 * stays intact — this is a prompt, not a broken state.
 */
function LocationFallback({
  status,
  onRequest,
}: {
  status: LocationStatus;
  onRequest: () => void;
}) {
  const blocked = status === 'denied' || status === 'unavailable';

  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackTitle}>
        {blocked ? 'Location permission needed' : 'Finding your location…'}
      </Text>
      <Text style={styles.fallbackBody}>
        {blocked
          ? 'Prayer times are calculated on your device and never leave it. Allow location once, or choose your city in Settings later.'
          : 'Calculating your local prayer times.'}
      </Text>
      {blocked ? (
        <Pressable
          onPress={onRequest}
          style={styles.fallbackButton}
          accessibilityRole="button"
          accessibilityLabel="Allow location"
        >
          <Text style={styles.fallbackButtonLabel}>Allow location</Text>
        </Pressable>
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
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  prayerList: {
    gap: spacing.sm,
  },
  sunrise: {
    ...textStyles.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textMuted,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fallback: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  fallbackTitle: {
    ...textStyles.bodyLg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  fallbackBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fallbackButton: {
    marginTop: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
  },
  fallbackButtonLabel: {
    ...textStyles.bodyMd,
    fontWeight: '700',
    color: colors.textOnAccent,
  },
});
