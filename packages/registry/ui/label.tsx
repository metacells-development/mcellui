/**
 * Label
 *
 * A text label component for form inputs with consistent styling.
 * Supports required indicator and disabled state.
 *
 * @example
 * ```tsx
 * <Label>Email</Label>
 * <Label required>Password</Label>
 * <Label disabled>Disabled Field</Label>
 * <Label size="lg" htmlFor="name">Name</Label>
 * ```
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
  TextProps,
} from 'react-native';
import { useTheme } from '@nativeui/core';

export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends Omit<TextProps, 'style'> {
  /** Label content */
  children: React.ReactNode;
  /** Size variant */
  size?: LabelSize;
  /** Show required asterisk */
  required?: boolean;
  /** Disabled state (muted color) */
  disabled?: boolean;
  /** Error state (red color) */
  error?: boolean;
  /** Associated input id (for web compatibility) */
  htmlFor?: string;
  /** Additional text styles */
  style?: TextStyle;
}

const sizeTokens: Record<LabelSize, { fontSize: number; lineHeight: number }> = {
  sm: { fontSize: 12, lineHeight: 16 },
  md: { fontSize: 14, lineHeight: 20 },
  lg: { fontSize: 16, lineHeight: 24 },
};

export function Label({
  children,
  size = 'md',
  required = false,
  disabled = false,
  error = false,
  style,
  ...props
}: LabelProps) {
  const { colors } = useTheme();
  const tokens = sizeTokens[size];

  const textColor = error
    ? colors.destructive
    : disabled
      ? colors.foregroundMuted
      : colors.foreground;

  return (
    <Text
      style={[
        styles.label,
        {
          fontSize: tokens.fontSize,
          lineHeight: tokens.lineHeight,
          color: textColor,
        },
        style,
      ]}
      accessibilityRole="text"
      {...props}
    >
      {children}
      {required && (
        <Text style={[styles.required, { color: colors.destructive }]}>
          {' *'}
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '500',
  },
  required: {
    fontWeight: '400',
  },
});
