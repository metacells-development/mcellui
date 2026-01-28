/**
 * Textarea
 *
 * A multiline text input component with auto-grow support.
 * Extends Input with multiline-specific features.
 *
 * @example
 * ```tsx
 * <Textarea label="Bio" placeholder="Tell us about yourself" />
 * <Textarea label="Description" rows={5} maxLength={500} showCount />
 * <Textarea autoGrow minRows={2} maxRows={6} />
 * ```
 */

import React, { forwardRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useTheme, fontWeight } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  /** Label text above input */
  label?: string;
  /** Error message below input */
  error?: string;
  /** Helper text below input (hidden when error is present) */
  helperText?: string;
  /** Size variant */
  size?: TextareaSize;
  /** Number of visible rows (default: 4) */
  rows?: number;
  /** Auto-grow based on content */
  autoGrow?: boolean;
  /** Minimum rows when autoGrow is true */
  minRows?: number;
  /** Maximum rows when autoGrow is true */
  maxRows?: number;
  /** Show character count */
  showCount?: boolean;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Input field style */
  style?: TextStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      rows = 4,
      autoGrow = false,
      minRows = 2,
      maxRows = 8,
      showCount = false,
      maxLength,
      containerStyle,
      style,
      labelStyle,
      editable = true,
      onFocus,
      onBlur,
      onChangeText,
      value,
      ...props
    },
    ref
  ) => {
    const { colors, components, componentRadius, timing, spacing } = useTheme();
    const tokens = components.textarea[size];
    const focusProgress = useSharedValue(0);
    const [textLength, setTextLength] = useState(value?.length ?? 0);
    const [height, setHeight] = useState(rows * tokens.lineHeight + tokens.paddingVertical * 2);

    const hasError = !!error;
    const isDisabled = editable === false;

    const handleFocus: NonNullable<TextInputProps['onFocus']> = useCallback(
      (e) => {
        focusProgress.value = withTiming(1, {
          duration: timing.default.duration,
          easing: Easing.out(Easing.quad),
        });
        haptic('selection');
        onFocus?.(e);
      },
      [onFocus, timing]
    );

    const handleBlur: NonNullable<TextInputProps['onBlur']> = useCallback(
      (e) => {
        focusProgress.value = withTiming(0, {
          duration: timing.default.duration,
          easing: Easing.out(Easing.quad),
        });
        onBlur?.(e);
      },
      [onBlur, timing]
    );

    const handleChangeText = useCallback(
      (text: string) => {
        setTextLength(text.length);
        onChangeText?.(text);
      },
      [onChangeText]
    );

    const handleContentSizeChange = useCallback(
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        if (!autoGrow) return;

        const contentHeight = e.nativeEvent.contentSize.height;
        const minHeight = minRows * tokens.lineHeight + tokens.paddingVertical * 2;
        const maxHeight = maxRows * tokens.lineHeight + tokens.paddingVertical * 2;

        const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
        setHeight(newHeight);
      },
      [autoGrow, minRows, maxRows, tokens]
    );

    const animatedBorderStyle = useAnimatedStyle(() => {
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
        borderWidth: focusProgress.value > 0.5 ? 2 : 1,
      };
    }, [hasError, colors]);

    const baseHeight = autoGrow ? height : rows * tokens.lineHeight + tokens.paddingVertical * 2;

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

        <AnimatedTextInput
          ref={ref}
          style={[
            styles.input,
            {
              height: baseHeight,
              paddingHorizontal: tokens.paddingHorizontal,
              paddingVertical: tokens.paddingVertical,
              borderRadius: componentRadius.textarea,
              fontSize: tokens.fontSize,
              lineHeight: tokens.lineHeight,
              backgroundColor: isDisabled ? colors.backgroundMuted : colors.background,
              color: isDisabled ? colors.foregroundMuted : colors.foreground,
              textAlignVertical: 'top',
            },
            animatedBorderStyle,
            style,
          ]}
          multiline
          placeholderTextColor={colors.foregroundMuted}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          onContentSizeChange={handleContentSizeChange}
          maxLength={maxLength}
          value={value}
          accessibilityLabel={label}
          accessibilityState={{ disabled: isDisabled }}
          {...props}
        />

        <View style={styles.footer}>
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
          {showCount && maxLength && (
            <Text
              style={[
                styles.count,
                {
                  fontSize: tokens.helperFontSize,
                  marginTop: spacing[1],
                  color: textLength >= maxLength ? colors.destructive : colors.foregroundMuted,
                },
              ]}
            >
              {textLength}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: fontWeight.medium,
  },
  input: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperText: {
    flex: 1,
  },
  count: {
    marginLeft: 8,
  },
});
