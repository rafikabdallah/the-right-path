import { Fragment, useId } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, BarChart3 } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { RadialGlow } from '@/components/ui/RadialGlow';
import { animation, colors, letterSpacings, spacing, textStyles } from '@/constants/theme';
import { usePrayerReview } from '@/hooks/usePrayerReview';

const HEIGHT = 196;
const CORNER = 22;
/** Where the straight sides give way to the taper, 0-1 of height. */
const TAPER_START = 0.86;

interface PrayerReviewCardProps {
  onPress: () => void;
}

/**
 * The Salah screen's closing entry point.
 *
 * It previews three figures so the card is useful before it is opened, and
 * is drawn as a softly pointed card rather than another rectangle so it
 * reads as a destination. Kept compact — the full picture lives behind it.
 */
export function PrayerReviewCard({ onPress }: PrayerReviewCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const pressed = useSharedValue(0);
  const gradientId = `shield${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { review } = usePrayerReview();

  const width = windowWidth - spacing.gutter * 2;
  const taperY = HEIGHT * TAPER_START;

  const path = [
    `M ${CORNER} 0`,
    `L ${width - CORNER} 0`,
    `Q ${width} 0 ${width} ${CORNER}`,
    `L ${width} ${taperY}`,
    `Q ${width} ${HEIGHT - 12} ${width / 2} ${HEIGHT}`,
    `Q 0 ${HEIGHT - 12} 0 ${taperY}`,
    `L 0 ${CORNER}`,
    `Q 0 0 ${CORNER} 0`,
    'Z',
  ].join(' ');

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
        style={[styles.container, { width, height: HEIGHT }]}
        accessibilityRole="button"
        accessibilityLabel="Prayer Review. View full review"
      >
        <RadialGlow
          width={width * 1.2}
          height={HEIGHT * 1.3}
          color={colors.primary}
          intensity={0.24}
          style={{ top: -HEIGHT * 0.15, left: -width * 0.1 }}
        />

        <Svg width={width} height={HEIGHT} style={styles.shape} pointerEvents="none">
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0" stopColor={colors.primaryStrong} stopOpacity={1} />
              <Stop offset="1" stopColor={colors.primaryContainer} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Path
            d={path}
            fill={`url(#${gradientId})`}
            stroke={colors.borderAccent}
            strokeWidth={1}
          />
        </Svg>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <BarChart3 color={colors.textOnAccent} size={15} strokeWidth={2.4} />
            <Text style={styles.title}>PRAYER REVIEW</Text>
          </View>

          <View style={styles.stats}>
            {review.preview.map((stat, index) => (
              <Fragment key={stat.id}>
                {index > 0 ? <View style={styles.separator} /> : null}
                <View style={styles.statCell}>
                  <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>
                    {stat.label}
                  </Text>
                  <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                    {stat.delta ? `${stat.value} ${stat.delta}` : stat.value}
                  </Text>
                </View>
              </Fragment>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerLabel}>View full review</Text>
            <ArrowRight color={colors.textOnAccent} size={14} strokeWidth={2.4} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  shape: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...textStyles.labelMd,
    fontWeight: '700',
    color: colors.textOnAccent,
    letterSpacing: letterSpacings.wide,
  },
  stats: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  // Equal flex so the three columns are exactly the same width, each
  // centring its own label and value on the same baselines.
  statCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.borderAccent,
    opacity: 0.6,
  },
  statLabel: {
    ...textStyles.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textOnAccentMuted,
  },
  statValue: {
    ...textStyles.bodyMd,
    fontWeight: '700',
    color: colors.textOnAccent,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerLabel: {
    ...textStyles.bodySm,
    fontWeight: '600',
    color: colors.textOnAccent,
  },
});
