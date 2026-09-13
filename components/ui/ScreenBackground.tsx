import { Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

/**
 * The app's night backdrop: the mosque-and-crescent artwork behind every
 * main screen.
 *
 * The image is the visual identity, so the scrim over it is a gradient
 * rather than a flat wash — nearly clear at the top where the crescent and
 * the domes sit, deepening toward the bottom where cards and the nav need
 * contrast. The artwork is never blurred or stretched: `cover` keeps its
 * aspect ratio and it is pinned, so it does not scroll with content.
 */
export function ScreenBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={require('@/assets/backgrounds/spiritual-night.png')}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="screenScrim" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={colors.scrimTop} stopOpacity={0.28} />
            <Stop offset="0.34" stopColor={colors.scrimTop} stopOpacity={0.5} />
            <Stop offset="0.66" stopColor={colors.scrimBottom} stopOpacity={0.8} />
            <Stop offset="1" stopColor={colors.scrimBottom} stopOpacity={0.92} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#screenScrim)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
