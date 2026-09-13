import { StyleSheet, Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';

import { colors, radii, spacing, textStyles } from '@/constants/theme';

interface AyahCardProps {
  label: string;
  reference: string;
  text: string;
}

/**
 * Closing contemplation card. Presentational only — nothing here is tracked
 * or interactive.
 */
export function AyahCard({ label, reference, text }: AyahCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Quote color={colors.primary} size={14} strokeWidth={2.5} />
          <Text style={styles.label}>{label.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.text}>{text}</Text>
      <Text style={styles.reference}>{reference}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...textStyles.labelMd,
    color: colors.primaryLight,
  },
  reference: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  text: {
    ...textStyles.bodyLg,
    color: colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
