import { Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors, radii } from '@/constants/theme';

/** The circular back control used by every pushed screen. */
export function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={12}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <ChevronLeft color={colors.textSecondary} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
