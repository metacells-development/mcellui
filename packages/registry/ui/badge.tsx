/**
 * Badge
 *
 * Small status indicator for labels and counts.
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="secondary">12</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Draft</Badge>
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View style={cn(styles.base, styles[variant], style)}>
      <Text style={cn(styles.text, styles[`${variant}Text`], textStyle)}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },

  // Variants
  default: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#f5f5f5',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  // Text
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  defaultText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#171717',
  },
  destructiveText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#171717',
  },
});
