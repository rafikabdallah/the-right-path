import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Zap } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';

import { RadialGlow } from './RadialGlow';

interface QuickReviewCardProps {
  label: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/**
 * The Spiritual home screen's summary of the day.
 *
 * Deliberately just three centred lines — no ring, no chart. The figure is
 * already in the sentence ("4 of 5"), so a percentage dial repeated it
 * while pulling the eye off-centre. Keeping it typographic is what makes
 * the card read calm.
 */
export function QuickReviewCard({ label, title, subtitle, onPress }: QuickReviewCardProps) {
  const pressed = useSharedValue(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((previous) =>
      previous.width === width && previous.height === height ? previous : { width, height }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 0.99 : 1, { duration: animation.durationFast }),
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
        onLayout={handleLayout}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${title}. ${subtitle}`}
      >
        {size.width > 0 ? (
          <RadialGlow
            width={size.width}
            height={size.height}
            cy="10%"
            intensity={0.22}
            color={colors.primaryContainer}
            style={styles.glow}
          />
        ) : null}

        {/* Padding on the inner view so the glow can anchor to the card's
            true origin — absolute children resolve against the padding box. */}
        <View style={styles.content}>
          <View style={styles.labelRow}>
            <Zap color={colors.primaryLight} size={14} strokeWidth={2.5} />
            <Text style={styles.label}>{label.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  glow: {
    top: 0,
    left: 0,
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...textStyles.labelMd,
    color: colors.primaryLight,
    fontWeight: '700',
    letterSpacing: letterSpacings.wide,
  },
  title: {
    ...textStyles.headlineSm,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
