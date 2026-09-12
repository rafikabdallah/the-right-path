import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, shadows, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

interface SpiritualSectionCardProps {
  title: string;
  icon: IconComponent;
  size: number;
  /** Index in the grid, used to stagger the entrance animation. */
  index: number;
  onPress: () => void;
}

/**
 * A large, near-square tile for one Spiritual section: icon at the top,
 * name at the bottom, nothing else. Premium and quiet — dark surface,
 * subtle border, one restrained purple accent on the icon.
 */
export function SpiritualSectionCard({
  title,
  icon: Icon,
  size,
  index,
  onPress,
}: SpiritualSectionCardProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
  }));

  return (
    // `entering` and an animated transform are kept on separate nodes —
    // sharing one node makes the layout animation and the press scale fight.
    <Animated.View
      entering={FadeInDown.duration(animation.durationEntrance).delay(
        index * animation.entranceStagger
      )}
      style={{ width: size }}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            pressed.value = 1;
          }}
          onPressOut={() => {
            pressed.value = 0;
          }}
          style={[styles.card, { height: size }]}
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          <View style={styles.iconWrap}>
            <Icon color={colors.primary} size={24} strokeWidth={1.9} />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radii.lg,
    backgroundColor: colors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...textStyles.subheading,
    color: colors.textPrimary,
  },
});
