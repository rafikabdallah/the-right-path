import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { pillarById } from '@/constants/pillars';
import type { PillarId } from '@/data/types';

import { PillarCard } from './PillarCard';

interface BottomNavProps extends BottomTabBarProps {
  /**
   * Called on a tab press (before navigating) with the tap's window
   * coordinates and the target pillar's accent color, plus a callback that
   * performs the actual route switch once the transition is ready for it.
   */
  onTransitionRequest: (x: number, y: number, color: string, navigate: () => void) => void;
}

/**
 * Custom bottom tab bar: one PillarCard per pillar. Replaces the default
 * tab bar so pressing a tab can drive the pillar-switch color transition
 * (see PillarTransitionOverlay) instead of an instant swap.
 */
export function BottomNav({ state, navigation, insets, onTransitionRequest }: BottomNavProps) {
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}
    >
      {state.routes.map((route, index) => {
        const pillar = pillarById[route.name as PillarId];
        if (!pillar) return null;

        const isFocused = state.index === index;

        const handlePress = (event: GestureResponderEvent) => {
          if (isFocused) return;

          const tabPressEvent = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (tabPressEvent.defaultPrevented) return;

          const { pageX, pageY } = event.nativeEvent;
          onTransitionRequest(pageX, pageY, pillar.color, () => navigation.navigate(route.name));
        };

        return (
          <PillarCard key={route.key} pillar={pillar} focused={isFocused} onPress={handlePress} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
});
