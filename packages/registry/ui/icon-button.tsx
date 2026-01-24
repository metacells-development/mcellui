/**
 * IconButton
 *
 * A pressable button that displays only an icon.
 * Square or circular shape with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <IconButton icon={<PlusIcon />} onPress={handleAdd} />
 *
 * // Variants
 * <IconButton icon={<HeartIcon />} variant="ghost" />
 * <IconButton icon={<TrashIcon />} variant="destructive" />
 *
 * // Sizes
 * <IconButton icon={<MenuIcon />} size="sm" />
 * <IconButton icon={<MenuIcon />} size="lg" rounded />
 * ```
 */

import React, { useCallback, forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  PressableProps,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Size preset */
  size?: IconButtonSize;
  /** Circular shape instead of rounded square */
  rounded?: boolean;
  /** Show loading spinner instead of icon */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
  /** Accessibility label (required for icon-only buttons) */
  accessibilityLabel: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size Configuration
// ─────────────────────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { size: 32, iconSize: 16 },
  md: { size: 40, iconSize: 20 },
  lg: { size: 48, iconSize: 24 },
  xl: { size: 56, iconSize: 28 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const IconButton = forwardRef(function IconButton(
  {
    icon,
    variant = 'default',
    size = 'md',
    rounded = false,
    loading = false,
    disabled,
    style,
    accessibilityLabel,
    onPressIn,
    onPressOut,
    onPress,
    ...props
  }: IconButtonProps,
  ref: React.ForwardedRef<View>
) {
  const { colors, radius, springs, platformShadow } = useTheme();
  const config = sizeConfig[size];
  const isDisabled = disabled || loading;

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withSpring(0.9, springs.snappy);
      onPressIn?.(e);
    },
    [onPressIn, springs.snappy]
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withSpring(1, springs.snappy);
      onPressOut?.(e);
    },
    [onPressOut, springs.snappy]
  );

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      haptic('light');
      onPress?.(e);
    },
    [onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, colors);

  // Determine border radius
  const borderRadiusValue = rounded ? config.size / 2 : radius.md;

  // Add shadow for solid buttons
  const shadowStyle =
    variant !== 'ghost' && variant !== 'outline' && !isDisabled
      ? platformShadow('sm')
      : {};

  return (
    <AnimatedPressable
      ref={ref}
      style={[
        styles.base,
        {
          width: config.size,
          height: config.size,
          borderRadius: borderRadiusValue,
        },
        variantStyles.container,
        shadowStyle,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={variantStyles.iconColor}
        />
      ) : (
        React.cloneElement(icon as React.ReactElement<{ width?: number; height?: number; color?: string }>, {
          width: config.iconSize,
          height: config.iconSize,
          color: variantStyles.iconColor,
        })
      )}
    </AnimatedPressable>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getVariantStyles(
  variant: IconButtonVariant,
  colors: ReturnType<typeof useTheme>['colors']
) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        iconColor: colors.primaryForeground,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary } as ViewStyle,
        iconColor: colors.secondaryForeground,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        iconColor: colors.foreground,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' } as ViewStyle,
        iconColor: colors.foreground,
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive } as ViewStyle,
        iconColor: colors.destructiveForeground,
      };
    default:
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        iconColor: colors.primaryForeground,
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
