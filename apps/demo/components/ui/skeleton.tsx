/**
 * Skeleton
 *
 * A loading placeholder with shimmer animation.
 * Use to indicate content is loading.
 *
 * @example
 * ```tsx
 * <Skeleton width={200} height={20} />
 * <Skeleton width="100%" height={48} radius="lg" />
 * <Skeleton circle size={40} />
 * ```
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';

export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: DimensionValue;
  /** Border radius preset */
  radius?: SkeletonRadius;
  /** Render as circle (uses size for width/height) */
  circle?: boolean;
  /** Size when circle is true */
  size?: number;
  /** Disable animation */
  animate?: boolean;
  /** Additional styles */
  style?: ViewStyle;
}

const radiusMap: Record<SkeletonRadius, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

export function Skeleton({
  width = '100%',
  height = 20,
  radius = 'md',
  circle = false,
  size = 40,
  animate = true,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3]
    );

    return {
      opacity: animate ? opacity : 0.3,
    };
  });

  const dimensions = circle
    ? { width: size, height: size, borderRadius: size / 2 }
    : {
        width,
        height,
        borderRadius: radiusMap[radius],
      };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { backgroundColor: colors.foregroundMuted },
        dimensions,
        animatedStyle,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
    />
  );
}

export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Gap between lines */
  gap?: number;
  /** Last line width percentage */
  lastLineWidth?: DimensionValue;
  /** Line height */
  lineHeight?: number;
  /** Container style */
  style?: ViewStyle;
}

export function SkeletonText({
  lines = 3,
  gap = 8,
  lastLineWidth = '60%',
  lineHeight = 16,
  style,
}: SkeletonTextProps) {
  return (
    <View style={[styles.textContainer, { gap }, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          radius="sm"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  textContainer: {
    width: '100%',
  },
});
