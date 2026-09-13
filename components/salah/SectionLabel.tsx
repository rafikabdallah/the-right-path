import { StyleSheet, Text, View } from 'react-native';

import { colors, letterSpacings, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

interface SectionLabelProps {
  title: string;
  icon?: IconComponent;
  /** Primary sections read brighter than the supporting ones. */
  emphasis?: 'primary' | 'secondary';
  align?: 'left' | 'center';
}

/** Small uppercase heading that separates the Salah screen's sections. */
export function SectionLabel({
  title,
  icon: Icon,
  emphasis = 'secondary',
  align = 'left',
}: SectionLabelProps) {
  const color = emphasis === 'primary' ? colors.textSecondary : colors.textMuted;

  return (
    <View style={[styles.container, align === 'center' && styles.centered]}>
      {Icon ? <Icon color={color} size={13} strokeWidth={2} /> : null}
      <Text style={[styles.title, { color }]}>{title.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  centered: {
    justifyContent: 'center',
  },
  title: {
    ...textStyles.label,
    letterSpacing: letterSpacings.wide,
  },
});
