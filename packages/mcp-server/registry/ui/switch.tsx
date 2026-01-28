/**
 * Switch
 *
 * An iOS-style toggle switch with animated thumb.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch checked={enabled} onCheckedChange={setEnabled} label="Notifications" />
 * <Switch label="Dark Mode" description="Enable dark theme" />
 * <Switch disabled />
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
import { useTheme, areAnimationsDisabled, fontWeight, fontSize } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /** Whether the switch is on */
  checked?: boolean;
  /** Callback when switch state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Disable the switch */
  disabled?: boolean;
  /** Label text shown next to switch */
  label?: string;
  /** Description text below label */
  description?: string;
  /** Additional accessibility label */
  accessibilityLabel?: string;
  /** Size variant */
  size?: SwitchSize;
  /** Additional container styles */
  style?: ViewStyle;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  description,
  accessibilityLabel,
  size = 'md',
  style,
}: SwitchProps) {
  const { colors, components, componentRadius, platformShadow, springs, spacing } = useTheme();
  const tokens = components.switch[size];
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Calculate thumb travel distance from tokens
  const thumbTravel = tokens.trackWidth - tokens.thumbSize - (tokens.thumbOffset * 2);

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
    const target = checked ? 1 : 0;
    if (reduceMotion || !animationsEnabled) {
      progress.value = target;
    } else {
      progress.value = withSpring(target, springs.snappy);
    }
  }, [checked, reduceMotion, springs.snappy, animationsEnabled]);

  const handlePressIn = useCallback(() => {
    if (!disabled && animationsEnabled) {
      scale.value = withSpring(0.95, springs.snappy);
    }
  }, [disabled, springs.snappy, animationsEnabled]);

  const handlePressOut = useCallback(() => {
    if (animationsEnabled) {
      scale.value = withSpring(1, springs.snappy);
    }
  }, [springs.snappy, animationsEnabled]);

  const handlePress = useCallback(() => {
    if (disabled || !onCheckedChange) return;
    haptic('medium');
    onCheckedChange(!checked);
  }, [disabled, onCheckedChange, checked]);

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.backgroundMuted, colors.primary]
    ),
    transform: [{ scale: scale.value }],
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, thumbTravel],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          progress.value,
          [0, 0.5, 1],
          [1, 0.9, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

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
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        checked,
        disabled,
      }}
    >
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

      <Animated.View
        style={[
          styles.track,
          {
            width: tokens.trackWidth,
            height: tokens.trackHeight,
            borderRadius: componentRadius.switch,
            paddingHorizontal: tokens.thumbOffset,
          },
          trackAnimatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: tokens.thumbSize,
              height: tokens.thumbSize,
              borderRadius: componentRadius.switch,
              backgroundColor: colors.background,
            },
            platformShadow('sm'),
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  track: {
    justifyContent: 'center',
  },
  thumb: {
    // Shadow applied via platformShadow
  },
  disabled: {
    opacity: 0.5,
  },
});
