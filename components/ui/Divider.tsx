import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

/**
 * Subtle centered section divider: a thin violet rule either side of a
 * small diamond. Deliberately plain — it separates, it doesn't decorate.
 */
export function Divider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  line: {
    flex: 1,
    maxWidth: 96,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderPurpleSoft,
  },
  diamond: {
    width: 5,
    height: 5,
    backgroundColor: colors.primary,
    opacity: 0.65,
    transform: [{ rotate: '45deg' }],
  },
});
