import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

/** How tall the fade above the dock is. Exported so screens can reserve it. */
export const NAV_FADE_HEIGHT = 104;

/**
 * The isolation zone above the floating dock.
 *
 * Content scrolling toward the bottom passes through this gradient and is
 * fully extinguished before it reaches the navigation, so labels never
 * compete with body text. The top edge is fully transparent, which is what
 * keeps this reading as part of the screen rather than as a black bar.
 */
export function NavBackdrop() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={NAV_FADE_HEIGHT}>
        <Defs>
          <LinearGradient id="navFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={colors.navScrim} stopOpacity={0} />
            <Stop offset="0.45" stopColor={colors.navScrim} stopOpacity={0.62} />
            <Stop offset="0.78" stopColor={colors.navScrim} stopOpacity={0.9} />
            <Stop offset="1" stopColor={colors.navScrim} stopOpacity={0.97} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={NAV_FADE_HEIGHT} fill="url(#navFade)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: NAV_FADE_HEIGHT,
  },
});
