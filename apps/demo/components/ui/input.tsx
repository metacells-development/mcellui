import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helperText, containerStyle, style, editable = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    return (
      <View style={cn(styles.container, containerStyle)}>
        {label && <Text style={cn(styles.label, hasError && styles.labelError)}>{label}</Text>}
        <TextInput
          ref={ref}
          style={cn(styles.input, isFocused && styles.inputFocused, hasError && styles.inputError, style)}
          placeholderTextColor="#a3a3a3"
          editable={editable}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          {...props}
        />
        {(error || helperText) && (
          <Text style={cn(styles.helperText, hasError && styles.errorText)}>{error || helperText}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 14, fontWeight: '500', color: '#171717', marginBottom: 6 },
  labelError: { color: '#ef4444' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#171717', minHeight: 44 },
  inputFocused: { borderColor: '#3b82f6', borderWidth: 2 },
  inputError: { borderColor: '#ef4444' },
  helperText: { fontSize: 12, color: '#737373', marginTop: 4 },
  errorText: { color: '#ef4444' },
});
