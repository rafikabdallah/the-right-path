import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, shadows, spacing, textStyles } from '@/constants/theme';

interface QuickReviewButtonProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

/**
 * The Spiritual screen's primary entry point — the daily spiritual
 * overview. A placeholder for now: it looks and responds like the real
 * thing, but the review itself isn't built yet (see CLAUDE.md "Phase
 * plan").
 *
 * This is the one element carrying a visible purple fill, which is what
 * makes it read as the screen's primary action.
 */
export function QuickReviewButton({ title, subtitle, onPress }: QuickReviewButtonProps) {
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
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressed.value = 1;
        }}
        onPressOut={() => {
          pressed.value = 0;
        }}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${subtitle}`}
      >
        <View style={styles.iconWrap}>
          <Sparkles color={colors.primary} size={22} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surfacePurple,
    borderWidth: 1,
    borderColor: colors.primaryHaloInner,
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primaryHaloInner,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
  },
  title: {
    ...textStyles.subheading,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
});
