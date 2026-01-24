/**
 * Badge
 *
 * Small status indicator for labels and counts.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="secondary">12</Badge>
 * <Badge variant="destructive" size="lg">Error</Badge>
 * <Badge variant="outline">Draft</Badge>
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme, ThemeColors } from '@metacells/mcellui-core';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const { colors, components, componentRadius, platformShadow } = useTheme();
  const tokens = components.badge[size];
  const variantStyles = getVariantStyles(variant, colors);

  // Add subtle shadow for solid badges
  const shadowStyle = variant !== 'outline' ? platformShadow('sm') : {};

  return (
    <View
      style={[
        styles.base,
        {
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          borderRadius: componentRadius.badge,
        },
        variantStyles.container,
        shadowStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: tokens.fontSize,
            fontWeight: tokens.fontWeight,
          },
          variantStyles.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function getVariantStyles(
  variant: BadgeVariant,
  colors: ThemeColors
) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary } as ViewStyle,
        text: { color: colors.secondaryForeground } as TextStyle,
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive } as ViewStyle,
        text: { color: colors.destructiveForeground } as TextStyle,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        text: { color: colors.foreground } as TextStyle,
      };
    default:
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});
