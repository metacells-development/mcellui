/**
 * Stepper
 *
 * A quantity input component with increment/decrement buttons.
 * Perfect for cart quantities, counters, and numeric inputs.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState(1);
 *
 * <Stepper value={value} onValueChange={setValue} />
 * <Stepper value={value} onValueChange={setValue} min={0} max={10} />
 * <Stepper value={value} onValueChange={setValue} size="lg" />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, areAnimationsDisabled, fontWeight } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type StepperSize = 'sm' | 'md' | 'lg';
export type StepperVariant = 'default' | 'outline' | 'ghost';

export interface StepperProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Size preset */
  size?: StepperSize;
  /** Visual variant */
  variant?: StepperVariant;
  /** Label text */
  label?: string;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Container style */
  style?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export function Stepper({
  value,
  onValueChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  formatValue,
  style,
  labelStyle,
}: StepperProps) {
  const { colors, components, componentRadius, spacing } = useTheme();
  const tokens = components.stepper[size];
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const decrementScale = useSharedValue(1);
  const incrementScale = useSharedValue(1);

  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = useCallback(() => {
    if (!canDecrement || disabled) return;
    haptic('light');
    const newValue = Math.max(min, value - step);
    onValueChange?.(newValue);
  }, [canDecrement, disabled, min, value, step, onValueChange]);

  const handleIncrement = useCallback(() => {
    if (!canIncrement || disabled) return;
    haptic('light');
    const newValue = Math.min(max, value + step);
    onValueChange?.(newValue);
  }, [canIncrement, disabled, max, value, step, onValueChange]);

  const handleDecrementPressIn = () => {
    if (animationsEnabled) {
      decrementScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  };

  const handleDecrementPressOut = () => {
    if (animationsEnabled) {
      decrementScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handleIncrementPressIn = () => {
    if (animationsEnabled) {
      incrementScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  };

  const handleIncrementPressOut = () => {
    if (animationsEnabled) {
      incrementScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const decrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationsEnabled ? decrementScale.value : 1 }],
  }));

  const incrementAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationsEnabled ? incrementScale.value : 1 }],
  }));

  const getButtonStyle = (isDisabled: boolean): ViewStyle => {
    const base: ViewStyle = {
      width: tokens.buttonWidth,
      height: tokens.height,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDisabled ? colors.border : colors.border,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...base,
          backgroundColor: isDisabled ? colors.backgroundMuted : colors.secondary,
        };
    }
  };

  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: tokens.labelFontSize,
              marginBottom: spacing[2],
              color: disabled ? colors.foregroundMuted : colors.foreground,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.container,
          {
            borderRadius: componentRadius.stepper,
            overflow: 'hidden',
            opacity: disabled ? 0.5 : 1,
          },
          variant === 'outline' && {
            borderWidth: 1,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Decrement Button */}
        <AnimatedPressable
          style={[
            getButtonStyle(!canDecrement),
            { borderTopLeftRadius: componentRadius.stepper, borderBottomLeftRadius: componentRadius.stepper },
            decrementAnimatedStyle,
          ]}
          onPress={handleDecrement}
          onPressIn={handleDecrementPressIn}
          onPressOut={handleDecrementPressOut}
          disabled={disabled || !canDecrement}
          accessibilityRole="button"
          accessibilityLabel="Decrease value"
          accessibilityState={{ disabled: disabled || !canDecrement }}
        >
          <Text
            style={[
              styles.icon,
              {
                fontSize: tokens.iconSize,
                color: !canDecrement || disabled
                  ? colors.foregroundMuted
                  : colors.foreground,
              },
            ]}
          >
            −
          </Text>
        </AnimatedPressable>

        {/* Value Display */}
        <View
          style={[
            styles.valueContainer,
            {
              width: tokens.valueWidth,
              height: tokens.height,
              backgroundColor: variant === 'default' ? colors.background : 'transparent',
              borderLeftWidth: variant !== 'ghost' ? 1 : 0,
              borderRightWidth: variant !== 'ghost' ? 1 : 0,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.value,
              {
                fontSize: tokens.fontSize,
                color: disabled ? colors.foregroundMuted : colors.foreground,
              },
            ]}
          >
            {displayValue}
          </Text>
        </View>

        {/* Increment Button */}
        <AnimatedPressable
          style={[
            getButtonStyle(!canIncrement),
            { borderTopRightRadius: componentRadius.stepper, borderBottomRightRadius: componentRadius.stepper },
            incrementAnimatedStyle,
          ]}
          onPress={handleIncrement}
          onPressIn={handleIncrementPressIn}
          onPressOut={handleIncrementPressOut}
          disabled={disabled || !canIncrement}
          accessibilityRole="button"
          accessibilityLabel="Increase value"
          accessibilityState={{ disabled: disabled || !canIncrement }}
        >
          <Text
            style={[
              styles.icon,
              {
                fontSize: tokens.iconSize,
                color: !canIncrement || disabled
                  ? colors.foregroundMuted
                  : colors.foreground,
              },
            ]}
          >
            +
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  label: {
    fontWeight: fontWeight.medium,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: fontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  icon: {
    fontWeight: fontWeight.normal,
  },
});
