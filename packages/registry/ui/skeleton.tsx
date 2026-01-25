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

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme, areAnimationsDisabled, skeletonTokens } from '@metacells/mcellui-core';

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
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
  const shimmerProgress = useSharedValue(0);
  const shouldAnimate = animate && animationsEnabled;

  useEffect(() => {
    if (shouldAnimate) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: skeletonTokens.animation.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    }
  }, [shouldAnimate]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [skeletonTokens.animation.minOpacity, skeletonTokens.animation.maxOpacity, skeletonTokens.animation.minOpacity]
    );

    return {
      opacity: shouldAnimate ? opacity : skeletonTokens.animation.minOpacity,
    };
  });

  const dimensions = circle
    ? { width: size, height: size, borderRadius: size / 2 }
    : {
        width,
        height,
        borderRadius: skeletonTokens.radius[radius],
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
  lines = skeletonTokens.text.defaultLines,
  gap = skeletonTokens.text.defaultGap,
  lastLineWidth = skeletonTokens.text.lastLineWidth,
  lineHeight = skeletonTokens.text.defaultLineHeight,
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
