import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { BottomNav } from '@/components/navigation/BottomNav';
import { PillarTransitionOverlay } from '@/components/navigation/PillarTransitionOverlay';
import { pillars } from '@/constants/pillars';
import { animation, colors } from '@/constants/theme';

// Spiritual is the default/opening tab (see CLAUDE.md "Navigation & transition").
export const unstable_settings = {
  initialRouteName: 'spiritual',
};

export default function TabsLayout() {
  const progress = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const overlayColor = useSharedValue(colors.pillarSpiritual);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTransitionRequest = useCallback(
    (x: number, y: number, color: string, navigate: () => void) => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);

      overlayColor.value = color;
      originX.value = x;
      originY.value = y;
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: animation.durationPillarTransition,
        easing: Easing.out(Easing.cubic),
      });

      // Swap the route while the circle is fully opaque (~midpoint), so the
      // content change is hidden and the second half of the animation reads
      // as the new screen being revealed as the color fades away.
      navigateTimer.current = setTimeout(navigate, animation.durationPillarTransition * 0.5);
    },
    [overlayColor, originX, originY, progress]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomNav {...props} onTransitionRequest={handleTransitionRequest} />}
      >
        {pillars.map((pillar) => (
          <Tabs.Screen key={pillar.id} name={pillar.id} options={{ title: pillar.label }} />
        ))}
      </Tabs>
      <PillarTransitionOverlay
        progress={progress}
        originX={originX}
        originY={originY}
        color={overlayColor}
      />
    </View>
  );
}
