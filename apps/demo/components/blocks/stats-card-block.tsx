/**
 * StatsCardBlock
 *
 * A card displaying a metric with label and optional trend indicator.
 * Perfect for dashboards, analytics, and key metrics displays.
 *
 * @example
 * ```tsx
 * <StatsCardBlock
 *   value="$12,450"
 *   label="Revenue"
 *   trend={12.5}
 *   trendLabel="vs last month"
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Card, CardContent } from '@/components/ui/card';

// ============================================================================
// Types
// ============================================================================

export interface StatsCardBlockProps {
  /** The main value/number to display */
  value: string | number;
  /** Label describing the metric */
  label: string;
  /** Trend percentage (positive = up, negative = down) */
  trend?: number;
  /** Additional context for the trend */
  trendLabel?: string;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Called when card is pressed */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function StatsCardBlock({
  value,
  label,
  trend,
  trendLabel,
  icon,
  onPress,
  style,
}: StatsCardBlockProps) {
  const { colors, spacing, radius } = useTheme();

  const isPositive = trend !== undefined && trend >= 0;
  const trendColor = trend !== undefined
    ? isPositive
      ? colors.success
      : colors.destructive
    : colors.foregroundMuted;

  return (
    <Card onPress={onPress} style={style}>
      <CardContent style={{ paddingTop: spacing[4] }}>
        {/* Header with icon */}
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.foregroundMuted }]}>
            {label}
          </Text>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.secondary,
                  borderRadius: radius.sm,
                  padding: spacing[2],
                },
              ]}
            >
              {icon}
            </View>
          )}
        </View>

        {/* Value */}
        <Text
          style={[
            styles.value,
            { color: colors.foreground, marginTop: spacing[2] },
          ]}
        >
          {value}
        </Text>

        {/* Trend */}
        {trend !== undefined && (
          <View style={[styles.trendContainer, { marginTop: spacing[2] }]}>
            <Text style={[styles.trend, { color: trendColor }]}>
              {isPositive ? '+' : ''}{trend.toFixed(1)}%
            </Text>
            {trendLabel && (
              <Text
                style={[
                  styles.trendLabel,
                  { color: colors.foregroundMuted, marginLeft: spacing[1] },
                ]}
              >
                {trendLabel}
              </Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {},
  value: {
    fontSize: 32,
    fontWeight: '700',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trend: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: 13,
  },
});
