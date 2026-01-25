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
import { useTheme, spinnerTokens } from '@metacells/mcellui-core';

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

export function Spinner({
  size = 'md',
  color = 'default',
  style,
  ...props
}: SpinnerProps) {
  const { colors } = useTheme();
  const tokens = spinnerTokens[size];

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
          width: tokens.containerSize,
          height: tokens.containerSize,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator
        size={tokens.indicatorSize}
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
