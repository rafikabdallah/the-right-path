import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { colors, radii, spacing, textStyles } from '@/constants/theme';
import type { IconComponent } from '@/constants/pillars';

interface HeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  icon?: IconComponent;
  onBack?: () => void;
}

/**
 * Shared screen header: optional back button, an accent-tinted icon badge,
 * a title, and an optional subtitle. Used at the top of every pillar list
 * screen and every subsection detail screen.
 */
export function Header({ title, subtitle, accentColor = colors.primary, icon: Icon, onBack }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textSecondary} size={22} />
        </Pressable>
      ) : null}

      <View style={styles.row}>
        {Icon ? (
          <View style={[styles.iconWrap, { backgroundColor: `${accentColor}26` }]}>
            <Icon color={accentColor} size={24} strokeWidth={2} />
          </View>
        ) : null}
        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...textStyles.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
});
