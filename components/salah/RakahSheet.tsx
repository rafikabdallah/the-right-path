import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionGroup, type Option } from '@/components/ui/OptionGroup';
import { colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';
import { rakahOptions } from '@/data/sunnah';

type SleepAnswer = 'yes' | 'no';

const SLEEP_OPTIONS: Option<SleepAnswer>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

interface RakahSheetProps {
  visible: boolean;
  title: string;
  /** Shown when the prayer distinguishes Qiyam from Tahajjud. */
  askAfterSleeping?: boolean;
  rakahs: number;
  afterSleeping?: boolean;
  onConfirm: (rakahs: number, afterSleeping: boolean) => void;
  onClose: () => void;
}

/**
 * "How many rak'ahs?" — the one recording sheet, shared by General Nafl and
 * Qiyam al-Layl.
 *
 * Preset counts cover almost every case; Custom reveals a small field for
 * anything else. Qiyam additionally asks whether it was after sleeping,
 * which is what distinguishes Tahajjud — rather than tracking Tahajjud as a
 * separate prayer with its own duplicate controls.
 */
export function RakahSheet({
  visible,
  title,
  askAfterSleeping = false,
  rakahs,
  afterSleeping = false,
  onConfirm,
  onClose,
}: RakahSheetProps) {
  const [selected, setSelected] = useState(rakahs);
  const [custom, setCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [sleep, setSleep] = useState<SleepAnswer>(afterSleeping ? 'yes' : 'no');

  // Re-seed each time the sheet opens so it reflects what is recorded.
  useEffect(() => {
    if (!visible) return;
    setSelected(rakahs);
    setCustom(rakahs > 0 && !rakahOptions.includes(rakahs));
    setCustomText(rakahs > 0 && !rakahOptions.includes(rakahs) ? String(rakahs) : '');
    setSleep(afterSleeping ? 'yes' : 'no');
  }, [visible, rakahs, afterSleeping]);

  const handleConfirm = () => {
    const parsed = custom ? Number.parseInt(customText, 10) : selected;
    const value = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    onConfirm(value, sleep === 'yes');
  };

  return (
    <BottomSheet visible={visible} title={title} confirmLabel="Done" onConfirm={handleConfirm} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.question}>HOW MANY RAK‘AHS?</Text>

        <View style={styles.options}>
          {rakahOptions.map((option) => {
            const isSelected = !custom && selected === option;

            return (
              <Pressable
                key={option}
                onPress={() => {
                  setCustom(false);
                  setSelected(option);
                }}
                style={[styles.pill, isSelected && styles.pillSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option} rak'ahs`}
              >
                <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setCustom(true)}
            style={[styles.pill, styles.pillWide, custom && styles.pillSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected: custom }}
            accessibilityLabel="Custom amount"
          >
            <Text style={[styles.pillLabel, custom && styles.pillLabelSelected]}>Custom</Text>
          </Pressable>
        </View>

        {custom ? (
          <TextInput
            value={customText}
            onChangeText={setCustomText}
            keyboardType="number-pad"
            placeholder="Rak‘ahs"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            accessibilityLabel="Custom rak'ah count"
          />
        ) : null}

        {askAfterSleeping ? (
          <OptionGroup
            label="After sleeping?"
            options={SLEEP_OPTIONS}
            selected={sleep}
            onSelect={setSleep}
          />
        ) : null}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  question: {
    ...textStyles.labelMd,
    color: colors.textSecondary,
    letterSpacing: letterSpacings.wide,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pill: {
    minWidth: 56,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
  },
  pillWide: {
    minWidth: 96,
  },
  pillSelected: {
    borderColor: colors.borderPurple,
    backgroundColor: colors.primaryContainer,
  },
  pillLabel: {
    ...textStyles.bodyLg,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillLabelSelected: {
    color: colors.textOnAccent,
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    ...textStyles.bodyLg,
  },
});
