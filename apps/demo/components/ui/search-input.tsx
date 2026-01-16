/**
 * SearchInput
 *
 * A search input with icon, clear button, and loading state.
 * Commonly used in list headers and search screens.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SearchInput
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search..."
 * />
 *
 * // With loading state
 * <SearchInput
 *   value={query}
 *   onChangeText={setQuery}
 *   loading={isSearching}
 * />
 *
 * // Uncontrolled
 * <SearchInput
 *   defaultValue=""
 *   onChangeText={(text) => debouncedSearch(text)}
 * />
 * ```
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Callback when text changes */
  onChangeText?: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Show loading spinner */
  loading?: boolean;
  /** Show clear button when there's text */
  showClearButton?: boolean;
  /** Called when clear button is pressed */
  onClear?: () => void;
  /** Called when search is submitted */
  onSubmit?: (text: string) => void;
  /** Container style */
  style?: ViewStyle;
  /** Input style */
  inputStyle?: TextStyle;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function SearchIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path
        d="M21 21l-4.35-4.35"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ClearIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} fillOpacity={0.1} />
      <Path
        d="M15 9l-6 6M9 9l6 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SearchInput({
  value: controlledValue,
  defaultValue = '',
  onChangeText,
  placeholder = 'Search...',
  loading = false,
  showClearButton = true,
  onClear,
  onSubmit,
  style,
  inputStyle,
  autoFocus = false,
  ...props
}: SearchInputProps) {
  const { colors, spacing, radius, springs } = useTheme();
  const inputRef = useRef<TextInput>(null);

  // Controlled/uncontrolled state
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Focus animation
  const isFocused = useSharedValue(0);

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) {
        setInternalValue(text);
      }
      onChangeText?.(text);
    },
    [isControlled, onChangeText]
  );

  const handleClear = useCallback(() => {
    haptic('light');
    handleChangeText('');
    onClear?.();
    inputRef.current?.focus();
  }, [handleChangeText, onClear]);

  const handleSubmit = useCallback(() => {
    haptic('light');
    onSubmit?.(value);
  }, [onSubmit, value]);

  const handleFocus = useCallback(() => {
    isFocused.value = withSpring(1, springs.snappy);
  }, [springs.snappy]);

  const handleBlur = useCallback(() => {
    isFocused.value = withSpring(0, springs.snappy);
  }, [springs.snappy]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolate(
      isFocused.value,
      [0, 1],
      [0, 1]
    ) === 1
      ? colors.primary
      : colors.border,
    transform: [
      {
        scale: interpolate(isFocused.value, [0, 1], [1, 1.01]),
      },
    ],
  }));

  const showClear = showClearButton && value.length > 0 && !loading;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundMuted,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing[3],
          height: 44,
        },
        containerAnimatedStyle,
        style,
      ]}
    >
      {/* Search Icon */}
      <View style={[styles.iconContainer, { marginRight: spacing[2] }]}>
        <SearchIcon color={colors.foregroundMuted} />
      </View>

      {/* Input */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: colors.foreground,
            fontSize: 16,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.foregroundMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        {...props}
      />

      {/* Loading / Clear Button */}
      <View style={[styles.rightContainer, { marginLeft: spacing[2] }]}>
        {loading && (
          <ActivityIndicator size="small" color={colors.foregroundMuted} />
        )}
        {showClear && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <ClearIcon color={colors.foregroundMuted} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  rightContainer: {
    flexShrink: 0,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
