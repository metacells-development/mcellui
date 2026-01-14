/**
 * Button
 *
 * A pressable button component with multiple variants and sizes.
 * Includes haptic feedback and accessibility support.
 *
 * @example
 * ```tsx
 * <Button onPress={() => {}}>Click me</Button>
 * <Button variant="secondary" size="sm">Small</Button>
 * <Button variant="destructive" disabled>Disabled</Button>
 * ```
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  loading?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) =>
        cn(
          styles.base,
          styles[variant],
          styles[size],
          pressed && styles.pressed,
          isDisabled && styles.disabled,
          style
        )
      }
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? '#fff' : '#3b82f6'}
        />
      ) : (
        <Text
          style={cn(
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  // Variants
  default: {
    backgroundColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#f5f5f5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },

  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
  },

  // States
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },

  // Text base
  text: {
    fontWeight: '600',
  },

  // Text variants
  defaultText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#171717',
  },
  outlineText: {
    color: '#171717',
  },
  ghostText: {
    color: '#3b82f6',
  },
  destructiveText: {
    color: '#ffffff',
  },

  // Text sizes
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
});
