/**
 * Spinner
 *
 * A loading indicator component with consistent styling.
 * Wraps ActivityIndicator with theme-aware colors and size presets.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" />
 * <Spinner color="primary" />
 * <Spinner size="sm" color="secondary" />
 * ```
 */

import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  ActivityIndicatorProps,
} from 'react-native';
import { useTheme } from '@nativeui/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'default' | 'primary' | 'secondary' | 'muted';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  /** Size preset */
  size?: SpinnerSize;
  /** Color variant */
  color?: SpinnerColor;
  /** Container style */
  style?: ViewStyle;
}

const sizeMap: Record<SpinnerSize, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
};

const containerSizes: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({
  size = 'md',
  color = 'default',
  style,
  ...props
}: SpinnerProps) {
  const { colors } = useTheme();

  const getColor = (): string => {
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'muted':
        return colors.foregroundMuted;
      case 'default':
      default:
        return colors.foreground;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSizes[size],
          height: containerSizes[size],
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator
        size={sizeMap[size]}
        color={getColor()}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
