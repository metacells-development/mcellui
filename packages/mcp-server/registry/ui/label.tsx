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
import { useTheme, fontWeight } from '@metacells/mcellui-core';

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


export function Label({
  children,
  size = 'md',
  required = false,
  disabled = false,
  error = false,
  style,
  ...props
}: LabelProps) {
  const { colors, components } = useTheme();
  const tokens = components.label[size];

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
          fontWeight: tokens.fontWeight,
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
  label: {},
  required: {
    fontWeight: fontWeight.normal,
  },
});
