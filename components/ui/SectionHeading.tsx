import { StyleSheet, Text, View } from 'react-native';

import { colors, letterSpacings, spacing, textStyles } from '@/constants/theme';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

/** Centred uppercase section title, matching DAILY PRAYERS on the Salah screen. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textStyles.labelLg,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: letterSpacings.wide,
  },
  subtitle: {
    ...textStyles.labelSm,
    color: colors.primaryLight,
  },
});
