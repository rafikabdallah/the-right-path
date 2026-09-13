import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

export interface Option<T extends string> {
  value: T;
  label: string;
  icon?: IconComponent;
}

interface OptionGroupProps<T extends string> {
  label: string;
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

/**
 * A labelled row of selectable pills. Kept compact so a sheet with several
 * groups still reads as a quick choice rather than a form.
 */
export function OptionGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: OptionGroupProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          const Icon = option.icon;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.pill, isSelected && styles.pillSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
            >
              {Icon ? (
                <Icon
                  color={isSelected ? colors.textOnAccent : colors.textMuted}
                  size={15}
                  strokeWidth={2}
                />
              ) : null}
              <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    ...textStyles.label,
    color: colors.textMuted,
    letterSpacing: letterSpacings.wide,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  pillSelected: {
    borderColor: colors.borderPurple,
    backgroundColor: colors.surfacePurpleRaised,
  },
  pillLabel: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  pillLabelSelected: {
    color: colors.textOnAccent,
    fontWeight: '600',
  },
});
