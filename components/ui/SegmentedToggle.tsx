import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, textStyles } from '@/constants/theme';

export interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  segments: Segment<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

/**
 * Two-or-three-way switch in the app's pill language — the selected
 * segment takes the violet fill, matching selected option pills elsewhere.
 */
export function SegmentedToggle<T extends string>({
  segments,
  selected,
  onSelect,
}: SegmentedToggleProps<T>) {
  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const isSelected = segment.value === selected;

        return (
          <Pressable
            key={segment.value}
            onPress={() => onSelect(segment.value)}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={segment.label}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {segment.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.full,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },
  segment: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
  },
  segmentSelected: {
    backgroundColor: colors.primaryContainer,
  },
  label: {
    ...textStyles.labelMd,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.textOnAccent,
    fontWeight: '700',
  },
});
