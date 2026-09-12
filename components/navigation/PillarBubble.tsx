import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii } from '@/constants/theme';
import type { PillarConfig } from '@/constants/pillars';

const SIZE_ACTIVE = 58;
const SIZE_INACTIVE = 48;

/** Diameter of the active bubble — the travelling indicator matches it. */
export const PILLAR_BUBBLE_SIZE = SIZE_ACTIVE;
/** Full footprint including the indicator's halo — used to size nav clearance. */
export const PILLAR_BUBBLE_AREA = SIZE_ACTIVE + 30;

interface PillarBubbleProps {
  pillar: PillarConfig;
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * One floating pillar node — a fixed position in the nav.
 *
 * The bubble itself only ever draws its dark chip and icon. The purple
 * fill and halo belong to a single indicator that travels between
 * positions (see PillarNavigation), so while a bubble is active it clears
 * its own background and border and lets that indicator show through.
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

  const bubbleStyle = useAnimatedStyle(() => {
    const size = withTiming(active ? SIZE_ACTIVE : SIZE_INACTIVE, {
      duration: animation.durationBase,
    });

    return {
      width: size,
      height: size,
      // Cleared while active so the travelling indicator reads through.
      // Fast, so the bubble being left behind re-darkens as the purple slides off it.
      backgroundColor: withTiming(active ? colors.transparent : colors.surface, {
        duration: animation.durationFast,
      }),
      borderColor: withTiming(active ? colors.transparent : colors.border, {
        duration: animation.durationFast,
      }),
    };
  });

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
        <Animated.View style={[styles.bubble, bubbleStyle]}>
          <Icon
            color={active ? colors.primary : colors.textMuted}
            size={active ? 24 : 21}
            strokeWidth={active ? 2.2 : 1.9}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /**
   * Each pillar gets an equal flex slot rather than a fixed width, so four
   * bubbles always fit — at a fixed 88pt each they would overflow a 360dp
   * phone. The wide slot also makes an easier tap target than the circle.
   */
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: PILLAR_BUBBLE_AREA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.full,
  },
});
