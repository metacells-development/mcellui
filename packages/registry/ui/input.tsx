/**
 * Input
 *
 * Text input with label, placeholder, error states, and animated focus.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="you@example.com" />
 * <Input label="Password" secureTextEntry error="Invalid password" />
 * <Input size="lg" label="Name" icon={<Icon name="user" />} />
 * ```
 */

import React, { forwardRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label text above input */
  label?: string;
  /** Error message below input */
  error?: string;
  /** Helper text below input (hidden when error is present) */
  helperText?: string;
  /** Size variant */
  size?: InputSize;
  /** Icon element (left side) */
  icon?: React.ReactNode;
  /** Icon element (right side) */
  iconRight?: React.ReactNode;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Input field style */
  style?: TextStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      icon,
      iconRight,
      containerStyle,
      style,
      labelStyle,
      editable = true,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { colors, components, componentRadius, timing, spacing } = useTheme();
    const tokens = components.input[size];
    const focusProgress = useSharedValue(0);

    const hasError = !!error;
    const isDisabled = editable === false;

    const handleFocus: NonNullable<TextInputProps['onFocus']> = useCallback(
      (e) => {
        focusProgress.value = withTiming(1, timing.default);
        haptic('selection');
        onFocus?.(e);
      },
      [onFocus, timing.default]
    );

    const handleBlur: NonNullable<TextInputProps['onBlur']> = useCallback(
      (e) => {
        focusProgress.value = withTiming(0, timing.default);
        onBlur?.(e);
      },
      [onBlur, timing.default]
    );

    const animatedBorderStyle = useAnimatedStyle(() => {
      // Error state takes priority
      if (hasError) {
        return {
          borderColor: colors.destructive,
          borderWidth: 2,
        };
      }

      return {
        borderColor: interpolateColor(
          focusProgress.value,
          [0, 1],
          [colors.border, colors.primary]
        ),
        borderWidth: focusProgress.value > 0.5 ? 2 : tokens.borderWidth,
      };
    }, [hasError, colors, tokens.borderWidth]);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                fontSize: tokens.labelFontSize,
                marginBottom: spacing[1.5],
                color: hasError ? colors.destructive : colors.foreground,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}

        <View style={styles.inputWrapper}>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                styles.iconLeft,
                { marginLeft: tokens.paddingHorizontal },
              ]}
            >
              {icon}
            </View>
          )}

          <AnimatedTextInput
            ref={ref}
            style={[
              styles.input,
              {
                minHeight: tokens.height,
                paddingHorizontal: tokens.paddingHorizontal,
                paddingVertical: tokens.paddingVertical,
                borderRadius: componentRadius.input,
                fontSize: tokens.fontSize,
                backgroundColor: isDisabled ? colors.backgroundMuted : colors.background,
                color: isDisabled ? colors.foregroundMuted : colors.foreground,
                paddingLeft: icon ? tokens.paddingHorizontal + tokens.iconSize + spacing[2] : tokens.paddingHorizontal,
                paddingRight: iconRight ? tokens.paddingHorizontal + tokens.iconSize + spacing[2] : tokens.paddingHorizontal,
              },
              animatedBorderStyle,
              style,
            ]}
            placeholderTextColor={colors.foregroundMuted}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityState={{ disabled: isDisabled }}
            {...props}
          />

          {iconRight && (
            <View
              style={[
                styles.iconContainer,
                styles.iconRight,
                { marginRight: tokens.paddingHorizontal },
              ]}
            >
              {iconRight}
            </View>
          )}
        </View>

        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              {
                fontSize: tokens.helperFontSize,
                marginTop: spacing[1],
                color: hasError ? colors.destructive : colors.foregroundMuted,
              },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
  },
  input: {
    // Dynamic styles applied inline
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    left: 0,
  },
  iconRight: {
    right: 0,
  },
  helperText: {
    // Dynamic styles applied inline
  },
});
