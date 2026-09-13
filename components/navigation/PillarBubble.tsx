import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, spacing, textStyles } from '@/constants/theme';
import type { PillarConfig } from '@/constants/pillars';

const CIRCLE = 50;

/** Diameter of the active indicator — the travelling capsule matches it. */
export const PILLAR_BUBBLE_SIZE = CIRCLE;
/** Height of the circle row including halo room, used to place the indicator. */
export const PILLAR_BUBBLE_AREA = CIRCLE + 22;

interface PillarBubbleProps {
  pillar: PillarConfig;
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * One floating pillar node — a fixed position in the nav.
 *
 * The bubble draws only its icon and label. The luminous violet fill and
 * halo belong to a single indicator that travels between positions (see
 * PillarNavigation), so nothing here is filled: the active item simply sits
 * on top of that indicator, its icon flipping to specular white.
 */
export function PillarBubble({ pillar, active, onPress, onLayout }: PillarBubbleProps) {
  const pressed = useSharedValue(0);
  const Icon = pillar.icon;

  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: withTiming(active ? colors.textPrimary : colors.textMuted, {
      duration: animation.durationBase,
    }),
  }));

  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={styles.slot}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={pillar.label}
    >
      <Animated.View style={[styles.container, pressStyle]}>
        <Animated.View style={styles.circle}>
          <Icon
            color={active ? colors.textOnAccent : colors.textMuted}
            size={active ? 23 : 21}
            strokeWidth={active ? 2.2 : 1.9}
          />
        </Animated.View>

        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {pillar.label.toUpperCase()}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /**
   * Each pillar gets an equal flex slot rather than a fixed width, so four
   * bubbles always fit — at a fixed 86pt each they would overflow a 360dp
   * phone. The wide slot also makes an easier tap target than the circle.
   */
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
  },
  circle: {
    width: PILLAR_BUBBLE_AREA,
    height: PILLAR_BUBBLE_AREA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...textStyles.labelSm,
    marginTop: -spacing.xs,
  },
});
