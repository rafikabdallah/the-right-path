import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/constants/theme';

interface ProgressBarProps {
  /** 0-1. */
  progress: number;
  /** 'complete' uses the completion green; everything else stays purple. */
  tone?: 'default' | 'complete';
}

/**
 * A thin track with a filled bar. Purple by default; green only where the
 * metric represents something completed.
 */
export function ProgressBar({ progress, tone = 'default' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const fill = tone === 'complete' ? colors.success : colors.primary;

  return (
    <View style={styles.track}>
      <View
        style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: fill }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
