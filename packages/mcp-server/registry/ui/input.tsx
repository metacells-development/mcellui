/**
 * Input
 *
 * Text input with label, placeholder, error states, and animated focus.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="you@example.com" />
 * <Input label="Password" secureTextEntry showPasswordToggle />
 * <Input label="Search" clearable value={search} onChangeText={setSearch} />
 * <Input label="Bio" showCount maxLength={200} />
 * <Input size="lg" label="Name" icon={<Icon name="user" />} />
 * ```
 */

import React, { forwardRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
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
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export type InputSize = 'sm' | 'md' | 'lg';

// Eye icon for password visibility toggle
function EyeIcon({ color, size, visible }: { color: string; size: number; visible: boolean }) {
  if (visible) {
    // Eye open
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
      </Svg>
    );
  }
  // Eye closed (with slash)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M1 1l22 22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// X icon for clear button
function ClearIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill={color} fillOpacity={0.2} />
      <Path
        d="M15 9l-6 6M9 9l6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
  /** Icon element (right side) - overridden by showPasswordToggle or clearable */
  iconRight?: React.ReactNode;
  /** Show password visibility toggle (for secureTextEntry inputs) */
  showPasswordToggle?: boolean;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Show character count (requires maxLength) */
  showCount?: boolean;
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
      showPasswordToggle,
      clearable,
      showCount,
      containerStyle,
      style,
      labelStyle,
      editable = true,
      secureTextEntry,
      value,
      onChangeText,
      maxLength,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { colors, components, componentRadius, timing, spacing } = useTheme();
    const tokens = components.input[size];
    const focusProgress = useSharedValue(0);

    // Password visibility state
    const [passwordVisible, setPasswordVisible] = useState(false);

    const hasError = !!error;
    const isDisabled = editable === false;
    const hasValue = !!value && value.length > 0;

    // Determine if we should use secure text entry
    const shouldHidePassword = secureTextEntry && !passwordVisible;

    // Determine which right icon to show
    const hasRightAction = showPasswordToggle || (clearable && hasValue);

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

    const handleTogglePassword = () => {
      haptic('selection');
      setPasswordVisible(!passwordVisible);
    };

    const handleClear = () => {
      haptic('selection');
      onChangeText?.('');
    };

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

    // Render right side action button
    const renderRightAction = () => {
      if (showPasswordToggle && secureTextEntry) {
        return (
          <Pressable
            onPress={handleTogglePassword}
            style={[
              styles.iconContainer,
              styles.iconRight,
              styles.iconButton,
              {
                marginRight: tokens.paddingHorizontal - spacing[1],
                padding: spacing[1],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon
              color={colors.foregroundMuted}
              size={tokens.iconSize}
              visible={passwordVisible}
            />
          </Pressable>
        );
      }

      if (clearable && hasValue) {
        return (
          <Pressable
            onPress={handleClear}
            style={[
              styles.iconContainer,
              styles.iconRight,
              styles.iconButton,
              {
                marginRight: tokens.paddingHorizontal - spacing[1],
                padding: spacing[1],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Clear input"
          >
            <ClearIcon color={colors.foregroundMuted} size={tokens.iconSize} />
          </Pressable>
        );
      }

      if (iconRight) {
        return (
          <View
            style={[
              styles.iconContainer,
              styles.iconRight,
              { marginRight: tokens.paddingHorizontal },
            ]}
          >
            {iconRight}
          </View>
        );
      }

      return null;
    };

    // Calculate character count
    const charCount = value?.length ?? 0;
    const showCharCount = showCount && maxLength !== undefined;

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
                paddingRight: hasRightAction || iconRight ? tokens.paddingHorizontal + tokens.iconSize + spacing[2] : tokens.paddingHorizontal,
              },
              animatedBorderStyle,
              style,
            ]}
            placeholderTextColor={colors.foregroundMuted}
            editable={editable}
            secureTextEntry={shouldHidePassword}
            value={value}
            onChangeText={onChangeText}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityState={{ disabled: isDisabled }}
            {...props}
          />

          {renderRightAction()}
        </View>

        <View style={styles.bottomRow}>
          {(error || helperText) && (
            <Text
              style={[
                styles.helperText,
                {
                  fontSize: tokens.helperFontSize,
                  marginTop: spacing[1],
                  color: hasError ? colors.destructive : colors.foregroundMuted,
                  flex: 1,
                },
              ]}
            >
              {error || helperText}
            </Text>
          )}

          {showCharCount && (
            <Text
              style={[
                styles.charCount,
                {
                  fontSize: tokens.helperFontSize,
                  marginTop: spacing[1],
                  color: charCount > maxLength ? colors.destructive : colors.foregroundMuted,
                },
              ]}
            >
              {charCount}/{maxLength}
            </Text>
          )}
        </View>
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
  iconButton: {
    // Dynamic padding applied inline via spacing tokens
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  helperText: {
    // Dynamic styles applied inline
  },
  charCount: {
    // Dynamic styles applied inline
  },
});
