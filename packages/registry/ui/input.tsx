/**
 * Input
 *
 * Text input with label, placeholder, and error states.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   keyboardType="email-address"
 * />
 *
 * <Input
 *   label="Password"
 *   secureTextEntry
 *   error="Password must be at least 8 characters"
 * />
 * ```
 */

import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label text above input */
  label?: string;
  /** Error message below input */
  error?: string;
  /** Helper text below input (hidden when error is present) */
  helperText?: string;
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
      containerStyle,
      style,
      labelStyle,
      editable = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;
    const isDisabled = editable === false;

    return (
      <View style={cn(styles.container, containerStyle)}>
        {label && (
          <Text
            style={cn(
              styles.label,
              hasError && styles.labelError,
              labelStyle
            )}
          >
            {label}
          </Text>
        )}

        <TextInput
          ref={ref}
          style={cn(
            styles.input,
            isFocused && styles.inputFocused,
            hasError && styles.inputError,
            isDisabled && styles.inputDisabled,
            style
          )}
          placeholderTextColor="#a3a3a3"
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          accessibilityLabel={label}
          accessibilityState={{ disabled: isDisabled }}
          {...props}
        />

        {(error || helperText) && (
          <Text style={cn(styles.helperText, hasError && styles.errorText)}>
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
    marginBottom: 6,
  },
  labelError: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#171717',
    minHeight: 44,
  },
  inputFocused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#a3a3a3',
  },
  helperText: {
    fontSize: 12,
    color: '#737373',
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444',
  },
});
