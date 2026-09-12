import { useCallback, useEffect, useRef, useState } from 'react';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import {
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { animation, colors, radii, spacing } from '@/constants/theme';
import { pillarById } from '@/constants/pillars';
import type { PillarId } from '@/data/types';

import { PILLAR_BUBBLE_AREA, PILLAR_BUBBLE_SIZE, PillarBubble } from './PillarBubble';

const HALO_INNER = PILLAR_BUBBLE_SIZE + 14;

interface Center {
  x: number;
  y: number;
}

/**
 * Four floating pillar bubbles near the bottom of the screen — not a
 * rectangular tab bar. The root is absolutely positioned and has no
 * background of its own, so screen content scrolls underneath it; each
 * bubble carries its own surface so it stays readable over that content.
 *
 * Switching pillars is communicated by movement, not by a screen-wide
 * effect: a single purple indicator (fill + halo) slides horizontally from
 * the old bubble's position to the new one. The bubbles themselves stay
 * put. Positions are measured rather than computed, so the indicator lands
 * correctly at any screen width.
 *
 * Screens reserve room for the bubbles via `usePillarNavClearance()`.
 */
export function PillarNavigation({ state, navigation, insets }: BottomTabBarProps) {
  const [centers, setCenters] = useState<(Center | undefined)[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorY = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(0);
  const placed = useRef(false);

  const activeCenter = centers[state.index];

  const handleLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const next = { x: x + width / 2, y: y + height / 2 };

    setCenters((previous) => {
      const current = previous[index];
      if (
        current &&
        Math.abs(current.x - next.x) < 0.5 &&
        Math.abs(current.y - next.y) < 0.5
      ) {
        return previous;
      }
      const updated = [...previous];
      updated[index] = next;
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!activeCenter) return;

    indicatorY.value = activeCenter.y;

    if (!placed.current) {
      // First measurement: appear in place rather than sliding in from 0.
      placed.current = true;
      indicatorX.value = activeCenter.x;
      indicatorOpacity.value = withTiming(1, { duration: animation.durationBase });
      return;
    }

    indicatorX.value = withSpring(activeCenter.x, animation.indicatorSpring);
    indicatorScale.value = withSequence(
      withTiming(animation.indicatorPulseScale, { duration: animation.durationFast }),
      withSpring(1, animation.indicatorSpring)
    );
  }, [activeCenter, indicatorOpacity, indicatorScale, indicatorX, indicatorY]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [
      { translateX: indicatorX.value - PILLAR_BUBBLE_AREA / 2 },
      { translateY: indicatorY.value - PILLAR_BUBBLE_AREA / 2 },
      { scale: indicatorScale.value },
    ],
  }));

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom + spacing.md }]}
      pointerEvents="box-none"
    >
      {/* Rendered before the bubbles so it paints behind their icons. */}
      <Animated.View pointerEvents="none" style={[styles.indicator, indicatorStyle]}>
        <View style={styles.haloOuter} />
        <View style={styles.haloInner} />
        <View style={styles.core} />
      </Animated.View>

      {state.routes.map((route, index) => {
        const pillar = pillarById[route.name as PillarId];
        if (!pillar) return null;

        const isActive = state.index === index;

        const handlePress = (event: GestureResponderEvent) => {
          if (isActive) return;

          const tabPressEvent = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (tabPressEvent.defaultPrevented) return;

          navigation.navigate(route.name);
        };

        return (
          <PillarBubble
            key={route.key}
            pillar={pillar}
            active={isActive}
            onPress={handlePress}
            onLayout={(event) => handleLayout(index, event)}
          />
        );
      })}
    </View>
  );
}

/**
 * Vertical space a screen should leave free at the bottom so its last row
 * of content can scroll clear of the floating bubbles. Depends on the
 * device's bottom inset, so it's a hook rather than a constant.
 */
export function usePillarNavClearance() {
  const insets = useSafeAreaInsets();
  return PILLAR_BUBBLE_AREA + insets.bottom + spacing.xl;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // Deliberately no horizontal padding: the bubbles' measured `x` values
    // and the absolutely-positioned indicator must share one coordinate
    // origin, and padding offsets them differently. Equal flex slots give
    // the edge spacing instead.
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PILLAR_BUBBLE_AREA,
    height: PILLAR_BUBBLE_AREA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloOuter: {
    position: 'absolute',
    width: PILLAR_BUBBLE_AREA,
    height: PILLAR_BUBBLE_AREA,
    borderRadius: radii.full,
    backgroundColor: colors.primaryHaloOuter,
  },
  haloInner: {
    position: 'absolute',
    width: HALO_INNER,
    height: HALO_INNER,
    borderRadius: radii.full,
    backgroundColor: colors.primaryHaloInner,
  },
  core: {
    position: 'absolute',
    width: PILLAR_BUBBLE_SIZE,
    height: PILLAR_BUBBLE_SIZE,
    borderRadius: radii.full,
    backgroundColor: colors.surfacePurple,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
