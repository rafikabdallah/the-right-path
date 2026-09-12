import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

import { animation, colors, radii, spacing, textStyles } from '@/constants/theme';
import type { PillarConfig } from '@/constants/pillars';

interface PillarCardProps {
  pillar: PillarConfig;
  focused: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

/**
 * A single bottom-nav tab button for one pillar: icon + label, with the
 * pillar's own accent color when active and a subtle press response.
 * Used inside BottomNav — not meant to be rendered standalone.
 */
export function PillarCard({ pillar, focused, onPress }: PillarCardProps) {
  const scale = useSharedValue(1);
  const Icon = pillar.icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(animation.pressScale, { duration: animation.durationFast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: animation.durationFast });
      }}
      style={styles.pressable}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={pillar.label}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View
          style={[
            styles.iconWrap,
            focused && { backgroundColor: `${pillar.color}26` },
          ]}
        >
          <Icon color={focused ? pillar.color : colors.textMuted} size={22} strokeWidth={2} />
        </View>
        <Text
          style={[
            styles.label,
            { color: focused ? pillar.color : colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {pillar.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...textStyles.label,
  },
});
