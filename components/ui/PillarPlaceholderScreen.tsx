import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { pillarById } from '@/constants/pillars';
import { animation, colors, spacing } from '@/constants/theme';
import type { PillarId } from '@/data/types';

import { ScreenHeader } from './ScreenHeader';

interface PillarPlaceholderScreenProps {
  pillarId: PillarId;
}

/**
 * Minimal placeholder for Mind, Body and Character. These pillars exist
 * only as navigation destinations in UI V1 — their content is deliberately
 * not built yet (see CLAUDE.md "Phase plan"). Their purpose here is to let
 * the pillar-switch transition be evaluated on a real device.
 */
export function PillarPlaceholderScreen({ pillarId }: PillarPlaceholderScreenProps) {
  const pillar = pillarById[pillarId];
  const navClearance = usePillarNavClearance();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.content, { paddingBottom: navClearance }]}>
        <Animated.View entering={FadeIn.duration(animation.durationEntrance)}>
          <ScreenHeader
            title={pillar.label}
            icon={pillar.icon}
            accentColor={pillar.color}
            subtitle="Coming soon"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
});
