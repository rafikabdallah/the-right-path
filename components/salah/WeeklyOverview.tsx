import { StyleSheet, Text, View } from 'react-native';

import { colors, letterSpacings, spacing, textStyles } from '@/constants/theme';
import { weeklyOverview } from '@/data/salah';

/**
 * Compact weekly summary. Plain text on the background with hairline rules
 * instead of stat cards — it should inform without competing with the five
 * daily prayers below it.
 *
 * Framed around growth: "Biggest improvement", never "most missed".
 */
export function WeeklyOverview() {
  return (
    <View style={styles.container}>
      {weeklyOverview.map((stat) => (
        <View key={stat.id} style={styles.cell}>
          <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
          <Text style={styles.value} numberOfLines={1}>
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    rowGap: spacing.lg,
  },
  // Two per row, so a value like "Maghrib +22%" is never truncated.
  cell: {
    width: '50%',
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  label: {
    ...textStyles.label,
    color: colors.textMuted,
    letterSpacing: letterSpacings.tight,
  },
  value: {
    ...textStyles.subheading,
    color: colors.textPrimary,
  },
});
