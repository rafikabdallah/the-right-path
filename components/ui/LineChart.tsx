import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { colors, radii, spacing, textStyles } from '@/constants/theme';

const CHART_HEIGHT = 140;
const PADDING_X = spacing.lg;
const PADDING_TOP = spacing.lg;
const PADDING_BOTTOM = spacing.xl;

export interface ChartPoint {
  /** Short axis label, e.g. 'M'. */
  label: string;
  value: number;
  /** Shown in the tooltip when the point is tapped. */
  tooltipTitle: string;
  tooltipLines: string[];
  /** Tiny dot under the label — used for Witr status, never a second chart. */
  status?: 'done' | 'none';
}

interface LineChartProps {
  points: ChartPoint[];
  /** Top of the scale, e.g. 12 for Rawatib. */
  maxValue: number;
  /** Index of today, drawn slightly larger and brighter. */
  todayIndex?: number;
  width: number;
}

/**
 * A week at a glance: one point per day, joined by a smooth luminous line.
 *
 * Deliberately not an analytics chart — no axes, no gridline labels, no
 * y-scale printed anywhere. The shape of the week is the message; exact
 * numbers appear only when a point is tapped. Built on react-native-svg,
 * which the project already has, rather than pulling in a charting library.
 */
export function LineChart({ points, maxValue, todayIndex, width }: LineChartProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const plotWidth = width - PADDING_X * 2;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const step = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const safeMax = maxValue > 0 ? maxValue : 1;

  const coords = points.map((point, index) => {
    const ratio = Math.min(Math.max(point.value / safeMax, 0), 1);
    return {
      x: PADDING_X + step * index,
      y: PADDING_TOP + plotHeight - ratio * plotHeight,
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ width, height: CHART_HEIGHT }}>
        <Svg width={width} height={CHART_HEIGHT}>
          {/* Two faint rules for depth. No values printed against them. */}
          {[0, 0.5, 1].map((fraction) => (
            <Line
              key={fraction}
              x1={PADDING_X}
              x2={PADDING_X + plotWidth}
              y1={PADDING_TOP + plotHeight * fraction}
              y2={PADDING_TOP + plotHeight * fraction}
              stroke={colors.borderPurpleSoft}
              strokeWidth={StyleSheet.hairlineWidth}
              opacity={0.5}
            />
          ))}

          {/* The glow is a wider, softer copy of the same path beneath it. */}
          <Path
            d={buildSmoothPath(coords)}
            fill="none"
            stroke={colors.primary}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.18}
          />
          <Path
            d={buildSmoothPath(coords)}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2}
            strokeLinecap="round"
          />

          {coords.map((coord, index) => {
            const isToday = index === todayIndex;
            const isSelected = index === selected;
            const radius = isToday || isSelected ? 6 : 4.5;

            return (
              <Circle
                key={points[index].label + index}
                cx={coord.x}
                cy={coord.y}
                r={radius}
                fill={isToday || isSelected ? colors.primaryLight : colors.primary}
                stroke={colors.background}
                strokeWidth={2}
              />
            );
          })}
        </Svg>

        {/* Touch targets sit above the SVG: one generous column per day. */}
        <View style={styles.hitRow}>
          {points.map((point, index) => (
            <Pressable
              key={point.label + index}
              style={styles.hitCell}
              onPress={() => setSelected((previous) => (previous === index ? null : index))}
              accessibilityRole="button"
              accessibilityLabel={`${point.tooltipTitle}. ${point.tooltipLines.join('. ')}`}
            />
          ))}
        </View>

        {selected !== null ? (
          <View
            style={[
              styles.tooltip,
              {
                // Clamped so the tooltip never runs off either edge.
                left: Math.min(Math.max(coords[selected].x - 64, 0), Math.max(width - 128, 0)),
                top: Math.max(coords[selected].y - 74, 0),
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.tooltipTitle}>{points[selected].tooltipTitle}</Text>
            {points[selected].tooltipLines.map((line) => (
              <Text key={line} style={styles.tooltipLine}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.labels}>
        {points.map((point, index) => (
          <View key={point.label + index} style={styles.labelCell}>
            <Text
              style={[styles.label, index === todayIndex && styles.labelToday]}
            >
              {point.label}
            </Text>
            {point.status ? (
              <View
                style={[
                  styles.statusDot,
                  point.status === 'done' ? styles.statusDone : styles.statusNone,
                ]}
              />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * A Catmull-Rom spline expressed as cubic beziers, so the week reads as one
 * flowing shape instead of a zig-zag. Tension is kept low to avoid the
 * overshoot that would imply values a day never had.
 */
function buildSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  const segments = [`M ${coords[0].x} ${coords[0].y}`];

  for (let i = 0; i < coords.length - 1; i += 1) {
    const previous = coords[i - 1] ?? coords[i];
    const current = coords[i];
    const next = coords[i + 1];
    const after = coords[i + 2] ?? next;

    const control1X = current.x + (next.x - previous.x) / 6;
    const control1Y = current.y + (next.y - previous.y) / 6;
    const control2X = next.x - (after.x - current.x) / 6;
    const control2Y = next.y - (after.y - current.y) / 6;

    segments.push(
      `C ${control1X} ${control1Y} ${control2X} ${control2Y} ${next.x} ${next.y}`
    );
  }

  return segments.join(' ');
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderPurpleSoft,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  hitRow: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  hitCell: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    width: 128,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderPurple,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  tooltipTitle: {
    ...textStyles.labelMd,
    color: colors.primaryLight,
  },
  tooltipLine: {
    ...textStyles.bodySm,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  labels: {
    flexDirection: 'row',
    paddingHorizontal: PADDING_X - spacing.md,
  },
  labelCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...textStyles.labelSm,
    color: colors.textMuted,
  },
  labelToday: {
    color: colors.primaryLight,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: radii.full,
  },
  statusDone: {
    backgroundColor: colors.success,
  },
  statusNone: {
    backgroundColor: colors.borderStrong,
  },
});
