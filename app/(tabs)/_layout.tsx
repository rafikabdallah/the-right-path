import { View } from 'react-native';
import { Tabs } from 'expo-router';

import { PillarNavigation } from '@/components/navigation/PillarNavigation';
import { pillars } from '@/constants/pillars';
import { colors } from '@/constants/theme';

// Spiritual is the default/opening tab (see CLAUDE.md "Navigation & transition").
export const unstable_settings = {
  initialRouteName: 'spiritual',
};

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
          // Subtle content crossfade only. Switching pillars is communicated
          // by the nav indicator travelling, never by a full-screen effect.
          animation: 'fade',
        }}
        tabBar={(props) => <PillarNavigation {...props} />}
      >
        {pillars.map((pillar) => (
          <Tabs.Screen key={pillar.id} name={pillar.id} options={{ title: pillar.label }} />
        ))}
      </Tabs>
    </View>
  );
}
