import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, CircleUserRound, Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  animation,
  colors,
  letterSpacings,
  radii,
  spacing,
  textStyles,
} from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

import { BottomSheet } from './BottomSheet';

type Placeholder = 'menu' | 'profile' | null;

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Rendered under the title in Arabic script, when the screen has one. */
  arabic?: string;
  /** Top-level screens show the menu; pushed screens show back instead. */
  leading?: 'menu' | 'back';
  /** Uppercase, wide-tracked title (detail screens) vs. sentence case. */
  emphasis?: 'app' | 'screen';
}

/**
 * The global top bar: a control on each side with the screen title centered
 * between them.
 *
 * Both controls are placeholders for now — they open a "coming soon" sheet
 * rather than a drawer or an account, since neither exists yet. They stay
 * deliberately quiet: small, unfilled, and outranked by the title.
 */
export function AppHeader({
  title,
  subtitle,
  arabic,
  leading = 'menu',
  emphasis = 'app',
}: AppHeaderProps) {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState<Placeholder>(null);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          {leading === 'menu' ? (
            <HeaderButton
              icon={Menu}
              label="Open menu"
              onPress={() => setPlaceholder('menu')}
            />
          ) : (
            <HeaderButton icon={ChevronLeft} label="Go back" onPress={() => router.back()} />
          )}

          <View style={styles.titleBlock}>
            <Text
              style={emphasis === 'screen' ? styles.titleScreen : styles.title}
              numberOfLines={1}
            >
              {emphasis === 'screen' ? title.toUpperCase() : title}
            </Text>
            {arabic ? <Text style={styles.arabic}>{arabic}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <HeaderButton
            icon={CircleUserRound}
            label="Open profile"
            onPress={() => setPlaceholder('profile')}
          />
        </View>
      </View>

      <BottomSheet
        visible={placeholder !== null}
        title={placeholder === 'profile' ? 'Profile' : 'Menu'}
        confirmLabel="Close"
        onClose={() => setPlaceholder(null)}
      >
        <Text style={styles.placeholderBody}>Coming soon.</Text>
      </BottomSheet>
    </>
  );
}

interface HeaderButtonProps {
  icon: IconComponent;
  label: string;
  onPress: () => void;
}

function HeaderButton({ icon: Icon, label, onPress }: HeaderButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? animation.pressScale : 1, {
          duration: animation.durationFast,
        }),
      },
    ],
    opacity: withTiming(pressed.value ? 0.7 : 1, { duration: animation.durationFast }),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressed.value = 1;
        }}
        onPressOut={() => {
          pressed.value = 0;
        }}
        hitSlop={10}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Icon color={colors.textPrimary} size={22} strokeWidth={1.8} />
      </Pressable>
    </Animated.View>
  );
}

const BUTTON = 36;

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textStyles.headlineMd,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleScreen: {
    ...textStyles.headlineMd,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: letterSpacings.wide,
  },
  arabic: {
    ...textStyles.bodyMd,
    color: colors.primaryLight,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderBody: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
