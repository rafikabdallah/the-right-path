import { Compass } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, spacing, textStyles } from '@/constants/theme';

/**
 * Temporary foundation screen.
 *
 * This confirms Expo Router, Reanimated, Lucide, StyleSheet, and the
 * centralized design tokens are wired together correctly. It is not part
 * of the actual The Right Path product UI and will be replaced once
 * feature work begins.
 */
export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View
        entering={FadeInUp.duration(500)}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Compass color={colors.primary} size={32} />
        </View>
        <Text style={styles.title}>The Right Path</Text>
        <Text style={styles.titleArabic}>الطريق المستقيم</Text>
        <Text style={styles.subtitle}>Foundation build — ready for feature work</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.heading,
    color: colors.textPrimary,
  },
  titleArabic: {
    ...textStyles.subheading,
    color: colors.textSecondary,
  },
  subtitle: {
    ...textStyles.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
