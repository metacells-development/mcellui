/**
 * Select
 *
 * A selection component using a bottom sheet picker.
 * Native-feeling select experience for mobile.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 *
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   value={value}
 *   onValueChange={setValue}
 *   options={[
 *     { label: 'United States', value: 'us' },
 *     { label: 'Germany', value: 'de' },
 *     { label: 'Japan', value: 'jp' },
 *   ]}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './sheet';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  /** Label text above select */
  label?: string;
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Current selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Available options */
  options: SelectOption[];
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: SelectSize;
  /** Sheet title */
  sheetTitle?: string;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Trigger style */
  style?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Select({
  label,
  placeholder = 'Select an option',
  value,
  onValueChange,
  options,
  error,
  helperText,
  disabled = false,
  size = 'md',
  sheetTitle,
  containerStyle,
  style,
  labelStyle,
}: SelectProps) {
  const { colors, components, componentRadius, timing, spacing } = useTheme();
  const tokens = components.select[size];
  const [open, setOpen] = useState(false);
  const focusProgress = useSharedValue(0);

  const hasError = !!error;
  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    haptic('light');
    focusProgress.value = withTiming(1, {
      duration: timing.default.duration,
      easing: Easing.out(Easing.quad),
    });
    setOpen(true);
  }, [disabled, timing]);

  const handleClose = useCallback(() => {
    focusProgress.value = withTiming(0, {
      duration: timing.default.duration,
      easing: Easing.out(Easing.quad),
    });
    setOpen(false);
  }, [timing]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      haptic('selection');
      onValueChange?.(optionValue);
      handleClose();
    },
    [onValueChange, handleClose]
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

      <AnimatedPressable
        style={[
          styles.trigger,
          {
            minHeight: tokens.height,
            paddingHorizontal: tokens.paddingHorizontal,
            borderRadius: componentRadius.select,
            backgroundColor: disabled ? colors.backgroundMuted : colors.background,
          },
          animatedBorderStyle,
          style,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
        accessibilityLabel={label}
      >
        <Text
          style={[
            styles.triggerText,
            {
              fontSize: tokens.fontSize,
              color: selectedOption
                ? disabled
                  ? colors.foregroundMuted
                  : colors.foreground
                : colors.foregroundMuted,
            },
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={[styles.chevron, { color: colors.foregroundMuted }]}>
          ▼
        </Text>
      </AnimatedPressable>

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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent height="50%">
          <SheetHeader>
            <SheetTitle>{sheetTitle ?? label ?? 'Select'}</SheetTitle>
          </SheetHeader>
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor:
                      option.value === value
                        ? colors.primary + '15'
                        : pressed
                          ? colors.backgroundMuted
                          : 'transparent',
                    borderRadius: componentRadius.select,
                    paddingVertical: spacing[size === 'sm' ? 2 : size === 'lg' ? 4 : 3],
                    paddingHorizontal: spacing[4],
                    opacity: option.disabled ? 0.5 : 1,
                  },
                ]}
                onPress={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        option.value === value
                          ? colors.primary
                          : colors.foreground,
                      fontWeight: option.value === value ? '600' : '400',
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === value && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>
                    ✓
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </SheetContent>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    marginLeft: 8,
  },
  helperText: {},
  optionsList: {
    flex: 1,
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
  },
});
