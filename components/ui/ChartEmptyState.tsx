import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, textStyles } from '@/constants/theme';

interface ChartEmptyStateProps {
  message: string;
}

/**
 * Shown in place of a chart when nothing has been recorded yet.
 *
 * A chart of zeroes would read as "you prayed nothing" rather than "there is
 * no history yet", so an empty window says so plainly instead of drawing a
 * flat line or inventing data.
 */
export function ChartEmptyState({ message }: ChartEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  message: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
