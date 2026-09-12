import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

interface ScreenHeaderProps {
  title: string;
  icon: IconComponent;
  accentColor?: string;
  subtitle?: string;
}

/**
 * Minimal centered screen header: an icon in a soft circle above an
 * uppercase title. Used by the Spiritual home screen and the pillar
 * placeholder screens so they share one visual language.
 */
export function ScreenHeader({
  title,
  icon: Icon,
  accentColor = colors.primary,
  subtitle,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { borderColor: `${accentColor}33` }]}>
        <Icon color={accentColor} size={26} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...textStyles.heading,
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
  },
});
