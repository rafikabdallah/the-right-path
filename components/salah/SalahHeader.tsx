import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { RadialGlow } from '@/components/ui/RadialGlow';
import { colors, letterSpacings, radii, spacing, textStyles } from '@/constants/theme';
import { salahAyah } from '@/data/salah';

/**
 * The ayah card. The screen title is owned by AppHeader.
 *
 * The ayah sits on a featured purple surface — the same visual weight as
 * the Quick Review card on the Spiritual home screen — so it reads as the
 * screen's opening statement rather than as loose text. Depth comes from a
 * drawn radial glow inside the card, not from a gradient fill.
 */
export function SalahHeader() {
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCardSize((previous) =>
      previous.width === width && previous.height === height ? previous : { width, height }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card} onLayout={handleLayout}>
        {cardSize.width > 0 ? (
          <RadialGlow
            width={cardSize.width}
            height={cardSize.height}
            cy="18%"
            intensity={0.12}
            style={styles.glow}
          />
        ) : null}

        {/* Padding lives on the inner view so the glow anchors to the card's
            true origin — absolute children resolve against the padding box. */}
        <View style={styles.cardContent}>
          <Text style={styles.ayah}>{salahAyah.arabic}</Text>

            <Text style={styles.translation}>{salahAyah.translation}</Text>
          <Text style={styles.reference}>{salahAyah.reference}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  glow: {
    top: 0,
    left: 0,
  },
  cardContent: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  ayah: {
    fontSize: 21,
    lineHeight: 40,
    color: colors.textPrimary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  translation: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reference: {
    ...textStyles.labelSm,
    color: colors.primaryLight,
    letterSpacing: letterSpacings.tight,
  },
});
