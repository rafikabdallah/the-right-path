import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { animation, colors, radii, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';
import type { Prayer } from '@/data/salah';

import { SectionLabel } from './SectionLabel';

interface SecondarySectionProps {
  title: string;
  items: Prayer[];
  state: Record<string, boolean>;
  onToggle: (id: string) => void;
  icon?: IconComponent;
  /** 'night' gives the section its own quieter, deeper container. */
  variant?: 'plain' | 'night';
}

/**
 * Sunnah, Nawafil and Night Prayer. Deliberately lighter than the five
 * daily prayers: smaller rows, no swipe, a simple tap to toggle — so they
 * read as supporting practice, not five more obligations.
 */
export function SecondarySection({
  title,
  items,
  state,
  onToggle,
  icon,
  variant = 'plain',
}: SecondarySectionProps) {
  return (
    <View style={styles.container}>
      <SectionLabel title={title} icon={icon} />
      <View style={[styles.list, variant === 'night' && styles.listNight]}>
        {items.map((item, index) => (
          <SecondaryRow
            key={item.id}
            name={item.name}
            done={state[item.id] ?? false}
            onToggle={() => onToggle(item.id)}
            first={index === 0}
          />
        ))}
      </View>
    </View>
  );
}

interface SecondaryRowProps {
  name: string;
  done: boolean;
  onToggle: () => void;
  first: boolean;
}

function SecondaryRow({ name, done, onToggle, first }: SecondaryRowProps) {
  const markStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(done ? colors.surfacePurple : colors.transparent, {
      duration: animation.durationFast,
    }),
    borderColor: withTiming(done ? colors.primary : colors.border, {
      duration: animation.durationFast,
    }),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: withTiming(done ? 1 : 0, { duration: animation.durationFast }),
  }));

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.row, !first && styles.rowDivided]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={name}
    >
      <Text style={[styles.name, done && styles.nameDone]}>{name}</Text>
      <Animated.View style={[styles.mark, markStyle]}>
        <Animated.View style={checkStyle}>
          <Check color={colors.primary} size={13} strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  list: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  listNight: {
    backgroundColor: colors.surfaceNight,
    borderColor: colors.borderNight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  name: {
    ...textStyles.body,
    color: colors.textSecondary,
    flex: 1,
  },
  nameDone: {
    color: colors.textPrimary,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
