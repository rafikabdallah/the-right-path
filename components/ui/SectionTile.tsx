import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, shadows, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

import { LinearGlow } from './LinearGlow';
import { RadialGlow } from './RadialGlow';

const ICON_CIRCLE = 40;

interface SectionTileProps {
  title: string;
  subtitle?: string;
  icon: IconComponent;
  size: number;
  /** Defaults to `size` (square). Salah's two blocks use a shorter card. */
  height?: number;
  /** Index in the grid, used to stagger the entrance animation. */
  index: number;
  onPress: () => void;
}

/**
 * A square interactive destination tile — the app's primary "enter a
 * section" affordance, used for the six Spiritual sections and for Salah's
 * Sunnah / Night Prayer blocks.
 *
 * The surface is genuinely purple — a strong-violet to brand-violet
 * gradient with a light specular highlight, a thin light-purple border and
 * white content. It is never a dark card with a violet tint.
 *
 * Every wash, including the outer bloom, is drawn with SVG: Android renders
 * elevation shadows black, so a colored glow cannot come from a shadow. The
 * bloom sits outside the card's clipped bounds.
 */
export function SectionTile({
  title,
  subtitle,
  icon: Icon,
  size,
  height = size,
  index,
  onPress,
}: SectionTileProps) {
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
        {/* Outer bloom, drawn outside the card's overflow clip. */}
        <RadialGlow
          width={size * 1.6}
          height={height * 1.6}
          color={colors.primary}
          intensity={0.3}
          style={{ top: -height * 0.3, left: -size * 0.3 }}
        />
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            pressed.value = 1;
          }}
          onPressOut={() => {
            pressed.value = 0;
          }}
          style={[styles.card, { height }]}
          accessibilityRole="button"
          accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
        >
          <LinearGlow
            width={size}
            height={height}
            style={styles.fill}
            // A real purple surface: strong violet into brand violet. The
            // card must read as purple instantly, never as a tinted black card.
            stops={[
              { offset: 0, color: colors.primaryStrong, opacity: 1 },
              { offset: 1, color: colors.primaryContainer, opacity: 1 },
            ]}
          />
          <RadialGlow
            width={size}
            height={height}
            cx="82%"
            cy="12%"
            intensity={0.5}
            color={colors.primaryLight}
            style={styles.fill}
          />

          {/* Padding lives on the inner view so the washes above can anchor
              to the card's true origin — absolute children resolve against
              the padding box, so padding here would shift them off-centre. */}
          <View style={styles.cardContent}>
            <View style={styles.iconWrap}>
              <Icon color={colors.textOnAccent} size={20} strokeWidth={2} />
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.primaryStrong,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  fill: {
    top: 0,
    left: 0,
  },
  cardContent: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceOnAccent,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...textStyles.bodyMd,
    fontWeight: '700',
    color: colors.textOnAccent,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textOnAccentMuted,
    textAlign: 'center',
  },
});
