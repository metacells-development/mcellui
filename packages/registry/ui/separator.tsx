/**
 * Separator
 *
 * A visual divider component for separating content.
 * Supports horizontal and vertical orientations.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator decorative={false} />
 * <Separator style={{ marginVertical: 16 }} />
 * ```
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { useTheme } from '@nativeui/core';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Omit<ViewProps, 'style'> {
  /** Direction of the separator */
  orientation?: SeparatorOrientation;
  /** Whether the separator is purely decorative (affects accessibility) */
  decorative?: boolean;
  /** Additional styles */
  style?: ViewStyle;
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  style,
  ...props
}: SeparatorProps) {
  const { colors } = useTheme();

  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        styles.base,
        isHorizontal ? styles.horizontal : styles.vertical,
        { backgroundColor: colors.border },
        style,
      ]}
      accessibilityRole={decorative ? 'none' : undefined}
      accessible={!decorative}
      accessibilityLabel={decorative ? undefined : 'Separator'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});
