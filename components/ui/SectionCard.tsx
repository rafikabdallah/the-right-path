import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { animation, colors, radii, shadows, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

interface SectionCardProps {
  label: string;
  icon: IconComponent;
  accentColor: string;
  onPress: () => void;
  /** Card width — pass a fixed number to lay these out in a responsive grid. */
  width?: number;
}

/**
 * A single subsection card: icon badge, label, chevron, with a subtle
 * press-scale response. Used on every pillar's list screen — tapping opens
 * that subsection's placeholder detail screen.
 */
export function SectionCard({ label, icon: Icon, accentColor, onPress, width }: SectionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[width ? { width } : styles.flexItem, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(animation.pressScale, { duration: animation.durationFast });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: animation.durationFast });
        }}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}26` }]}>
          <Icon color={accentColor} size={20} strokeWidth={2} />
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
        <ChevronRight color={colors.textMuted} size={16} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flexItem: {
    flexGrow: 1,
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 104,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...textStyles.bodyStrong,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
});
