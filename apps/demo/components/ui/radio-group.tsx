/**
 * Radio Group
 *
 * A set of radio buttons where only one can be selected.
 * Features animated selection indicator, haptic feedback,
 * dark mode support, and accessibility.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <RadioGroupItem value="option1" label="Option 1" />
 *   <RadioGroupItem value="option2" label="Option 2" />
 *   <RadioGroupItem value="option3" label="Option 3" />
 * </RadioGroup>
 * ```
 */

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme, ThemeColors, springs as themeSpringPresets } from '@nativeui/core';
import { haptic } from '@nativeui/core';

// Context for sharing state between RadioGroup and RadioGroupItem
interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  colors: ThemeColors;
  springs: typeof themeSpringPresets;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }
  return context;
}

export interface RadioGroupProps {
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onValueChange: (value: string) => void;
  /** Disable all items */
  disabled?: boolean;
  /** Size variant for all items */
  size?: 'sm' | 'md' | 'lg';
  /** Radio items */
  children: React.ReactNode;
  /** Additional container styles */
  style?: ViewStyle;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  children,
  style,
}: RadioGroupProps) {
  const { colors, springs } = useTheme();

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange, disabled, size, colors, springs }}
    >
      <View
        style={[styles.group, style]}
        accessibilityRole="radiogroup"
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps {
  /** Value for this radio option */
  value: string;
  /** Label text */
  label: string;
  /** Description text (optional) */
  description?: string;
  /** Disable this specific item */
  disabled?: boolean;
  /** Additional accessibility label */
  accessibilityLabel?: string;
  /** Additional container styles */
  style?: ViewStyle;
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled: itemDisabled = false,
  accessibilityLabel,
  style,
}: RadioGroupItemProps) {
  const context = useRadioGroup();
  const isSelected = context.value === value;
  const disabled = context.disabled || itemDisabled;
  const { colors, springs } = context;

  const progress = useSharedValue(isSelected ? 1 : 0);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Check for reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => subscription.remove();
  }, []);

  // Animate on selection change
  useEffect(() => {
    const target = isSelected ? 1 : 0;
    if (reduceMotion) {
      progress.value = target;
    } else {
      progress.value = withSpring(target, springs.snappy);
    }
  }, [isSelected, reduceMotion, springs.snappy]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    haptic('selection');
    context.onValueChange(value);
  }, [disabled, context.onValueChange, value]);

  const sizeStyles = sizes[context.size];

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary]
    ),
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [0, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.item,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessible
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        checked: isSelected,
        disabled,
      }}
    >
      <Animated.View
        style={[
          styles.outer,
          sizeStyles.outer,
          outerAnimatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.inner,
            sizeStyles.inner,
            { backgroundColor: colors.primary },
            innerAnimatedStyle,
          ]}
        />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            sizeStyles.label,
            { color: disabled ? colors.foregroundMuted : colors.foreground },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              sizeStyles.description,
              { color: disabled ? colors.foregroundMuted : colors.foregroundMuted },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// Size-specific styles using StyleSheet
const sizes = {
  sm: StyleSheet.create({
    outer: { width: 16, height: 16, borderRadius: 8 },
    inner: { width: 8, height: 8, borderRadius: 4 },
    label: { fontSize: 14 },
    description: { fontSize: 12 },
  }),
  md: StyleSheet.create({
    outer: { width: 20, height: 20, borderRadius: 10 },
    inner: { width: 10, height: 10, borderRadius: 5 },
    label: { fontSize: 16 },
    description: { fontSize: 14 },
  }),
  lg: StyleSheet.create({
    outer: { width: 24, height: 24, borderRadius: 12 },
    inner: { width: 12, height: 12, borderRadius: 6 },
    label: { fontSize: 18 },
    description: { fontSize: 16 },
  }),
};

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  outer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  inner: {},
  disabled: {
    opacity: 0.5,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontWeight: '500',
  },
  description: {
    fontWeight: '400',
  },
});
