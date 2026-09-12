import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ChevronLeft, MoonStar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { colors, radii, spacing } from '@/constants/theme';
import {
  dailyPrayers,
  initialPrayerRecords,
  initialSecondaryState,
  nawafilPrayers,
  nightPrayers,
  sunnahPrayers,
  type PrayerRecord,
} from '@/data/salah';

import { PrayerDetailSheet } from './PrayerDetailSheet';
import { PrayerRow } from './PrayerRow';
import { SalahHeader } from './SalahHeader';
import { SecondarySection } from './SecondarySection';
import { SectionLabel } from './SectionLabel';
import { WeeklyOverview } from './WeeklyOverview';

/**
 * The Salah screen. All state is local and in-memory — marking a prayer
 * does nothing beyond this session (see CLAUDE.md "Phase plan").
 *
 * Hierarchy is deliberate: the five daily prayers get the most weight,
 * with the overview compact above them and the supporting sections lighter
 * below.
 */
export function SalahScreen() {
  const router = useRouter();
  const navClearance = usePillarNavClearance();

  const [records, setRecords] = useState<Record<string, PrayerRecord>>(initialPrayerRecords);
  const [secondary, setSecondary] = useState<Record<string, boolean>>(initialSecondaryState);
  // The id is kept after closing so the sheet still has content to render
  // while it animates out; `sheetVisible` is what drives the animation.
  const [openPrayerId, setOpenPrayerId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const togglePrayer = useCallback((id: string, prayed: boolean) => {
    setRecords((previous) => ({
      ...previous,
      [id]: { ...previous[id], status: prayed ? 'prayed' : 'not-prayed' },
    }));
  }, []);

  const updateRecord = useCallback((id: string, record: PrayerRecord) => {
    setRecords((previous) => ({ ...previous, [id]: record }));
  }, []);

  const toggleSecondary = useCallback((id: string) => {
    setSecondary((previous) => ({ ...previous, [id]: !previous[id] }));
  }, []);

  const openPrayer = openPrayerId ? dailyPrayers.find((p) => p.id === openPrayerId) : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: navClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textSecondary} size={22} />
        </Pressable>

        <SalahHeader />

        <WeeklyOverview />

        <View style={styles.section}>
          <SectionLabel title="Daily prayers" emphasis="primary" />
          <View style={styles.prayerList}>
            {dailyPrayers.map((prayer) => (
              <PrayerRow
                key={prayer.id}
                name={prayer.name}
                record={records[prayer.id]}
                onToggle={(prayed) => togglePrayer(prayer.id, prayed)}
                onOpenDetails={() => {
                  setOpenPrayerId(prayer.id);
                  setSheetVisible(true);
                }}
              />
            ))}
          </View>
        </View>

        <SecondarySection
          title="Sunnah"
          items={sunnahPrayers}
          state={secondary}
          onToggle={toggleSecondary}
        />

        <SecondarySection
          title="Nawafil"
          items={nawafilPrayers}
          state={secondary}
          onToggle={toggleSecondary}
        />

        <SecondarySection
          title="Night prayer"
          items={nightPrayers}
          state={secondary}
          onToggle={toggleSecondary}
          icon={MoonStar}
          variant="night"
        />
      </ScrollView>

      {openPrayer ? (
        <PrayerDetailSheet
          visible={sheetVisible}
          name={openPrayer.name}
          record={records[openPrayer.id]}
          onChange={(record) => updateRecord(openPrayer.id, record)}
          onClose={() => setSheetVisible(false)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Sits above the header's glow without pushing it down.
    marginBottom: -spacing.xl,
    zIndex: 1,
  },
  section: {
    gap: spacing.md,
  },
  prayerList: {
    gap: spacing.md,
  },
});
