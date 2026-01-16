/**
 * Button
 *
 * A pressable button component with multiple variants and sizes.
 * Uses design tokens for consistent styling across the app.
 *
 * @example
 * ```tsx
 * <Button onPress={() => {}}>Click me</Button>
 * <Button variant="secondary" size="sm">Small</Button>
 * <Button variant="destructive" disabled>Disabled</Button>
 * <Button variant="outline" icon={<Icon name="plus" />}>With Icon</Button>
 * ```
 */

import React, { useCallback, forwardRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  PressableProps,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, BUTTON_CONSTANTS } from '@nativeui/core';
import { haptic } from '@nativeui/core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon element (left side) */
  icon?: React.ReactNode;
  /** Icon element (right side) */
  iconRight?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'default',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    disabled,
    style,
    textStyle,
    onPressIn,
    onPressOut,
    onPress,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<View>
) {
  const { colors, components, platformShadow, springs } = useTheme();
  const tokens = components.button[size];
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: any) => {
      scale.value = withSpring(BUTTON_CONSTANTS.pressScale, springs.snappy);
      onPressIn?.(e);
    },
    [onPressIn, springs.snappy]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      scale.value = withSpring(1, springs.snappy);
      onPressOut?.(e);
    },
    [onPressOut, springs.snappy]
  );

  const handlePress = useCallback(
    (e: any) => {
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
          minHeight: tokens.height,
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          borderRadius: tokens.borderRadius,
          gap: tokens.gap,
        },
        variantStyles.container,
        shadowStyle,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.spinnerColor} />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
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
          {iconRight && <View style={styles.icon}>{iconRight}</View>}
        </>
      )}
    </AnimatedPressable>
  );
});

function getVariantStyles(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors']
) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
        spinnerColor: colors.primaryForeground,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary } as ViewStyle,
        text: { color: colors.secondaryForeground } as TextStyle,
        spinnerColor: colors.secondaryForeground,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        text: { color: colors.foreground } as TextStyle,
        spinnerColor: colors.foreground,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' } as ViewStyle,
        text: { color: colors.foreground } as TextStyle,
        spinnerColor: colors.foreground,
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive } as ViewStyle,
        text: { color: colors.destructiveForeground } as TextStyle,
        spinnerColor: colors.destructiveForeground,
      };
    default:
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
        spinnerColor: colors.primaryForeground,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: BUTTON_CONSTANTS.disabledOpacity,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    flexShrink: 0,
  },
});
