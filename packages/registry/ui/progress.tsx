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
import { useTheme, areAnimationsDisabled, progressTokens, PROGRESS_CONSTANTS } from '@metacells/mcellui-core';

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
          duration: progressTokens.animation.determinateDuration,
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
          withTiming(1, { duration: progressTokens.animation.indeterminateDuration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: progressTokens.animation.indeterminateDuration, easing: Easing.inOut(Easing.ease) })
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
        return colors.success ?? PROGRESS_CONSTANTS.fallbackColors.success;
      case 'warning':
        return colors.warning ?? PROGRESS_CONSTANTS.fallbackColors.warning;
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
    width: `${PROGRESS_CONSTANTS.indeterminateWidth}%`,
    left: `${indeterminateProgress.value * (100 - PROGRESS_CONSTANTS.indeterminateWidth)}%`,
  }));

  const height = progressTokens[size].height;
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
