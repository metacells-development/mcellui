/**
 * Progress
 *
 * A progress bar component with animated fill.
 * Supports determinate and indeterminate states.
 *
 * @example
 * ```tsx
 * <Progress value={50} />
 * <Progress value={75} size="lg" />
 * <Progress indeterminate />
 * <Progress value={100} color="success" />
 * ```
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme, areAnimationsDisabled } from '@metacells/mcellui-core';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressColor = 'default' | 'primary' | 'success' | 'warning' | 'destructive';

export interface ProgressProps {
  /** Current progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Size preset */
  size?: ProgressSize;
  /** Color variant */
  color?: ProgressColor;
  /** Show indeterminate animation */
  indeterminate?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Track style */
  trackStyle?: ViewStyle;
  /** Fill style */
  fillStyle?: ViewStyle;
}

const sizeMap: Record<ProgressSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

export function Progress({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  indeterminate = false,
  style,
  trackStyle,
  fillStyle,
}: ProgressProps) {
  const { colors } = useTheme();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
  const progress = useSharedValue(0);
  const indeterminateProgress = useSharedValue(0);

  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;

  useEffect(() => {
    if (!indeterminate) {
      if (animationsEnabled) {
        progress.value = withTiming(percentage, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        });
      } else {
        progress.value = percentage;
      }
    }
  }, [percentage, indeterminate, animationsEnabled]);

  useEffect(() => {
    if (indeterminate && animationsEnabled) {
      indeterminateProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [indeterminate, animationsEnabled]);

  const getFillColor = (): string => {
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'success':
        return colors.success ?? '#22c55e';
      case 'warning':
        return colors.warning ?? '#f59e0b';
      case 'destructive':
        return colors.destructive;
      case 'default':
      default:
        return colors.foreground;
    }
  };

  const determinateStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const indeterminateStyle = useAnimatedStyle(() => ({
    width: '30%',
    left: `${indeterminateProgress.value * 70}%`,
  }));

  const height = sizeMap[size];
  const fillColor = getFillColor();

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: colors.backgroundMuted,
        },
        trackStyle,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max,
        now: indeterminate ? undefined : normalizedValue,
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: fillColor,
          },
          indeterminate ? indeterminateStyle : determinateStyle,
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
