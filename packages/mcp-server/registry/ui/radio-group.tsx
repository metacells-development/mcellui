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
import { useTheme, ThemeColors, springs as themeSpringPresets } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Context for sharing state between RadioGroup and RadioGroupItem
interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  colors: ThemeColors;
  springs: typeof themeSpringPresets;
  components: typeof import('@metacells/mcellui-core').components;
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
  const { colors, components, springs, spacing } = useTheme();

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange, disabled, size, colors, springs, components }}
    >
      <View
        style={[styles.group, { gap: spacing[3] }, style]}
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
  const { spacing } = useTheme();
  const isSelected = context.value === value;
  const disabled = context.disabled || itemDisabled;
  const { colors, springs, components } = context;
  const tokens = components.radio[context.size];

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
        { gap: spacing[2.5] },
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
          {
            width: tokens.outerSize,
            height: tokens.outerSize,
            borderRadius: tokens.outerSize / 2,
            borderWidth: tokens.borderWidth,
            marginTop: spacing[0.5],
          },
          outerAnimatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              width: tokens.innerSize,
              height: tokens.innerSize,
              borderRadius: tokens.innerSize / 2,
              backgroundColor: colors.primary,
            },
            innerAnimatedStyle,
          ]}
        />
      </Animated.View>

      <View style={[styles.textContainer, { gap: tokens.gap }]}>
        <Text
          style={[
            styles.label,
            {
              fontSize: tokens.labelFontSize,
              color: disabled ? colors.foregroundMuted : colors.foreground,
            },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                fontSize: tokens.descriptionFontSize,
                color: colors.foregroundMuted,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    // Dynamic gap applied inline via spacing tokens
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // Dynamic gap applied inline via spacing tokens
  },
  pressed: {
    opacity: 0.7,
  },
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
    // Dynamic marginTop applied inline via spacing tokens
  },
  inner: {},
  disabled: {
    opacity: 0.5,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
  },
  description: {
    fontWeight: '400',
  },
});
