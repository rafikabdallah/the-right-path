import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

/**
 * The in-tab stack shared by every pillar folder (list screen +
 * `[subsection]` detail screen). Re-exported as the default from each
 * `app/(tabs)/<pillar>/_layout.tsx` so the four pillars don't each define
 * their own near-identical layout file.
 */
export default function PillarStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
