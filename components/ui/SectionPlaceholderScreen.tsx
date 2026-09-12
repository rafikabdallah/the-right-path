import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { spiritualSectionIcons } from '@/constants/pillars';
import { colors, radii, spacing, textStyles } from '@/constants/theme';
import { quickReview, spiritualSections } from '@/data/spiritual';

import { ScreenHeader } from './ScreenHeader';

/**
 * Placeholder destination for a tapped Spiritual tile (or Quick Review) —
 * it names the section and says the real thing is still to come. Each
 * section's actual functionality is out of scope for UI V1.
 */
export function SectionPlaceholderScreen() {
  const router = useRouter();
  const navClearance = usePillarNavClearance();
  const { section: sectionId } = useLocalSearchParams<{ section: string }>();

  const section =
    sectionId === quickReview.id
      ? quickReview
      : spiritualSections.find((item) => item.id === sectionId);
  const icon = sectionId ? spiritualSectionIcons[sectionId] : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textSecondary} size={22} />
        </Pressable>

        <View style={[styles.body, { paddingBottom: navClearance }]}>
          {icon ? (
            <ScreenHeader
              title={section?.title ?? 'Not found'}
              icon={icon}
              subtitle="Coming soon"
            />
          ) : (
            <Text style={styles.fallback}>Not found</Text>
          )}
        </View>
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
    padding: spacing.lg,
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
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    ...textStyles.body,
    color: colors.textMuted,
  },
});
