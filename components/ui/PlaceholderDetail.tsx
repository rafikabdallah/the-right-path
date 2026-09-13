import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePillarNavClearance } from '@/components/navigation/PillarNavigation';
import { colors, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

import { BackButton } from './BackButton';
import { ScreenHeader } from './ScreenHeader';

interface PlaceholderDetailProps {
  title?: string;
  icon?: IconComponent;
  subtitle?: string;
}

/**
 * Shared "this screen isn't built yet" destination: back button, centred
 * header, nothing else. Used by the Spiritual section tiles and by Salah's
 * Sunnah / Night Prayer blocks so every unbuilt destination looks alike.
 */
export function PlaceholderDetail({
  title,
  icon,
  subtitle = 'Coming soon',
}: PlaceholderDetailProps) {
  const navClearance = usePillarNavClearance();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <BackButton />

        <View style={[styles.body, { paddingBottom: navClearance }]}>
          {icon && title ? (
            <ScreenHeader title={title} icon={icon} subtitle={subtitle} />
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
