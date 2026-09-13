import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  animation,
  colors,
  letterSpacings,
  radii,
  shadows,
  spacing,
  textStyles,
} from '@/constants/theme';

import { RadialGlow } from './RadialGlow';

const HIDDEN_OFFSET = 480;
const GLOW_HEIGHT = 220;

interface BottomSheetProps {
  visible: boolean;
  title: string;
  /** Label for the confirm button pinned to the bottom. */
  confirmLabel?: string;
  /** Runs before closing when the confirm button is pressed. */
  onConfirm?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Bottom sheet built on RN's Modal — no new dependency, and Modal renders
 * above the floating pillar navigation, which an in-tree overlay could not.
 *
 * Layout is centred throughout, with a purple glow behind the header and a
 * single emphasised confirm button pinned at the bottom, so the sheet reads
 * as a deliberate surface rather than a default modal.
 */
export function BottomSheet({
  visible,
  title,
  confirmLabel = 'Done',
  onConfirm,
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const confirmPressed = useSharedValue(0);
  // Modal hides instantly, so it's kept mounted until the exit animation
  // has actually finished playing.
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: animation.durationBase });
      return;
    }

    progress.value = withTiming(0, { duration: animation.durationBase }, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
  }, [visible, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * HIDDEN_OFFSET }],
  }));

  const confirmStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(confirmPressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
    opacity: withTiming(confirmPressed.value ? 0.9 : 1, {
      duration: animation.durationFast,
    }),
  }));

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, sheetStyle, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          <RadialGlow
            width={width}
            height={GLOW_HEIGHT}
            cy="0%"
            intensity={0.22}
            style={styles.glow}
          />

          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <View style={styles.body}>{children}</View>

          <Animated.View style={[styles.confirmWrap, confirmStyle]}>
            {/* Underglow beneath the button, drawn so it shows on Android. */}
            <RadialGlow
              width={width}
              height={90}
              intensity={0.4}
              color={colors.primary}
              style={styles.confirmGlow}
            />
            <Pressable
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
              onPressIn={() => {
                confirmPressed.value = 1;
              }}
              onPressOut={() => {
                confirmPressed.value = 0;
              }}
              style={styles.confirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
            >
              <Text style={styles.confirmLabel}>{confirmLabel.toUpperCase()}</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderTopWidth: 1,
    borderColor: colors.borderPurpleSoft,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
    gap: spacing.xl,
    overflow: 'hidden',
  },
  glow: {
    top: 0,
    // Spans the sheet's full width, including its horizontal padding.
    left: -spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.borderStrong,
  },
  title: {
    ...textStyles.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    alignSelf: 'stretch',
  },
  confirmWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  confirmGlow: {
    bottom: -18,
  },
  confirm: {
    ...shadows.glowPurple,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    ...textStyles.headlineSm,
    fontWeight: '700',
    color: colors.textOnAccent,
    letterSpacing: letterSpacings.wide,
  },
});
