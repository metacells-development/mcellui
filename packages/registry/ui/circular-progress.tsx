/**
 * CircularProgress
 *
 * Ring/donut style progress indicator with animated fill.
 * Supports determinate and indeterminate states.
 *
 * @example
 * ```tsx
 * // Determinate with label
 * <CircularProgress value={75} showLabel />
 *
 * // Indeterminate loading
 * <CircularProgress indeterminate />
 *
 * // Custom size and colors
 * <CircularProgress
 *   value={50}
 *   size={120}
 *   strokeWidth={12}
 *   color="#10b981"
 * />
 * ```
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

// ============================================================================
// Types
// ============================================================================

export type CircularProgressSize = 'sm' | 'md' | 'lg' | number;

export interface CircularProgressProps {
  /** Progress value (0-100) */
  value?: number;
  /** Whether in indeterminate/loading state */
  indeterminate?: boolean;
  /** Size of the progress ring */
  size?: CircularProgressSize;
  /** Stroke width of the ring */
  strokeWidth?: number;
  /** Track color (background ring) */
  trackColor?: string;
  /** Progress color (fill ring) */
  color?: string;
  /** Whether to show percentage label */
  showLabel?: boolean;
  /** Custom label content */
  label?: React.ReactNode;
  /** Label font size (auto-calculated if not provided) */
  labelSize?: number;
  /** Rotation start angle in degrees (default: -90, top) */
  startAngle?: number;
  /** Whether the progress fills clockwise */
  clockwise?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Size Configs
// ============================================================================

const SIZE_CONFIG = {
  sm: { size: 40, strokeWidth: 4, labelSize: 10 },
  md: { size: 64, strokeWidth: 6, labelSize: 14 },
  lg: { size: 96, strokeWidth: 8, labelSize: 20 },
};

// ============================================================================
// Animated Components
// ============================================================================

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

// ============================================================================
// Component
// ============================================================================

export function CircularProgress({
  value = 0,
  indeterminate = false,
  size = 'md',
  strokeWidth: customStrokeWidth,
  trackColor,
  color,
  showLabel = false,
  label,
  labelSize: customLabelSize,
  startAngle = -90,
  clockwise = true,
  animationDuration = 300,
  style,
}: CircularProgressProps) {
  const { colors } = useTheme();

  // Resolve size config
  const config = typeof size === 'number'
    ? { size, strokeWidth: customStrokeWidth ?? Math.max(4, size / 10), labelSize: Math.max(10, size / 5) }
    : SIZE_CONFIG[size];

  const resolvedSize = typeof size === 'number' ? size : config.size;
  const resolvedStrokeWidth = customStrokeWidth ?? config.strokeWidth;
  const resolvedLabelSize = customLabelSize ?? config.labelSize;

  const radius = (resolvedSize - resolvedStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = resolvedSize / 2;

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Animated values
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const indeterminateProgress = useSharedValue(0.25);

  // Update progress animation
  useEffect(() => {
    if (!indeterminate) {
      progress.value = withSpring(clampedValue / 100, {
        damping: 20,
        stiffness: 100,
      });
    }
  }, [clampedValue, indeterminate]);

  // Indeterminate rotation animation
  useEffect(() => {
    if (indeterminate) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.linear }),
        -1,
        false
      );
      indeterminateProgress.value = withRepeat(
        withTiming(0.75, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [indeterminate]);

  // Animated stroke dashoffset for determinate
  const animatedProps = useAnimatedProps(() => {
    const progressValue = indeterminate ? indeterminateProgress.value : progress.value;
    const strokeDashoffset = circumference * (1 - progressValue);
    return {
      strokeDashoffset: clockwise ? strokeDashoffset : -strokeDashoffset,
    };
  });

  // Animated rotation for indeterminate
  const animatedGroupStyle = useAnimatedProps(() => ({
    rotation: rotation.value,
    originX: center,
    originY: center,
  }));

  // Display value for label
  const displayValue = useDerivedValue(() => {
    return Math.round(progress.value * 100);
  });

  const resolvedTrackColor = trackColor ?? colors.border;
  const resolvedColor = color ?? colors.primary;

  return (
    <View style={[styles.container, { width: resolvedSize, height: resolvedSize }, style]}>
      <Svg width={resolvedSize} height={resolvedSize}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={resolvedTrackColor}
          strokeWidth={resolvedStrokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <AnimatedG animatedProps={animatedGroupStyle}>
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={resolvedColor}
            strokeWidth={resolvedStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            rotation={startAngle}
            originX={center}
            originY={center}
          />
        </AnimatedG>
      </Svg>

      {/* Label */}
      {(showLabel || label) && !indeterminate && (
        <View style={styles.labelContainer}>
          {label ?? (
            <Text
              style={[
                styles.label,
                {
                  fontSize: resolvedLabelSize,
                  color: colors.foreground,
                },
              ]}
            >
              {clampedValue}%
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
