/**
 * Checkbox
 *
 * An accessible checkbox component with animated checkmark.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 * <Checkbox checked={checked} onCheckedChange={setChecked} label="Accept terms" />
 * <Checkbox indeterminate />
 * ```
 */

import React, { useEffect, useCallback, useMemo } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import { useTheme, areAnimationsDisabled, fontSize, fontWeight } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Show indeterminate state (overrides checked) */
  indeterminate?: boolean;
  /** Disable the checkbox */
  disabled?: boolean;
  /** Label text shown next to checkbox */
  label?: string;
  /** Description text below label */
  description?: string;
  /** Additional accessibility label */
  accessibilityLabel?: string;
  /** Size variant */
  size?: CheckboxSize;
  /** Additional container styles */
  style?: ViewStyle;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  indeterminate = false,
  disabled = false,
  label,
  description,
  accessibilityLabel,
  size = 'md',
  style,
}: CheckboxProps) {
  const { colors, components, componentRadius, platformShadow, springs, spacing } = useTheme();
  const tokens = components.checkbox[size];
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
  const progress = useSharedValue(checked || indeterminate ? 1 : 0);
  const scale = useSharedValue(1);
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

  // Animate on state change
  useEffect(() => {
    const target = checked || indeterminate ? 1 : 0;
    if (reduceMotion || !animationsEnabled) {
      progress.value = target;
    } else {
      progress.value = withSpring(target, springs.snappy);
    }
  }, [checked, indeterminate, reduceMotion, springs.snappy, animationsEnabled]);

  const handlePressIn = useCallback(() => {
    if (!disabled && animationsEnabled) {
      scale.value = withSpring(0.92, springs.snappy);
    }
  }, [disabled, springs.snappy, animationsEnabled]);

  const handlePressOut = useCallback(() => {
    if (animationsEnabled) {
      scale.value = withSpring(1, springs.snappy);
    }
  }, [springs.snappy, animationsEnabled]);

  const handlePress = useCallback(() => {
    if (disabled || !onCheckedChange) return;
    haptic('light');
    onCheckedChange(!checked);
  }, [disabled, onCheckedChange, checked]);

  const boxAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.primary]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary]
    ),
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.5, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Checkmark SVG path
  const checkPath = "M4 12l5 5L20 6";
  // Indeterminate line path
  const indeterminatePath = "M6 12h12";

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.container,
        { gap: tokens.gap },
        style,
      ]}
      accessible
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        checked: indeterminate ? 'mixed' : checked,
        disabled,
      }}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: tokens.size,
            height: tokens.size,
            borderRadius: componentRadius.checkbox,
            borderWidth: tokens.borderWidth,
          },
          boxAnimatedStyle,
          (checked || indeterminate) && platformShadow('sm'),
          disabled && styles.disabled,
        ]}
      >
        <AnimatedSvg
          width={tokens.iconSize}
          height={tokens.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          style={iconAnimatedStyle}
        >
          <Path
            d={indeterminate ? indeterminatePath : checkPath}
            stroke={colors.primaryForeground}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AnimatedSvg>
      </Animated.View>

      {(label || description) && (
        <View style={[styles.labelContainer, { gap: spacing[0.5] }]}>
          {label && (
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
          )}
          {description && (
            <Text
              style={[
                styles.description,
                { color: colors.foregroundMuted },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flex: 1,
    // Dynamic gap applied inline via spacing tokens
  },
  label: {
    fontWeight: fontWeight.medium,
  },
  description: {
    fontSize: fontSize.sm,
  },
});
