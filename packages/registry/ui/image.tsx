/**
 * Image
 *
 * An enhanced image component with loading skeleton, error fallback,
 * and optional blur-up placeholder effect.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Image
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   style={{ width: 200, height: 200 }}
 * />
 *
 * // With blur-up placeholder
 * <Image
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   placeholder={{ uri: 'https://example.com/image-blur.jpg' }}
 *   style={{ width: '100%', aspectRatio: 16 / 9 }}
 * />
 *
 * // With error fallback
 * <Image
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   fallback={<Text>Failed to load</Text>}
 *   style={{ width: 100, height: 100, borderRadius: 8 }}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageSourcePropType,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  NativeSyntheticEvent,
  ImageLoadEventData,
  ImageErrorEventData,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

const AnimatedImage = Animated.createAnimatedComponent(RNImage);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ImageProps extends Omit<RNImageProps, 'source' | 'style'> {
  /** Image source */
  source: ImageSourcePropType;
  /** Low-res placeholder for blur-up effect */
  placeholder?: ImageSourcePropType;
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode;
  /** Show skeleton while loading */
  showSkeleton?: boolean;
  /** Container/image style */
  style?: ImageStyle | ViewStyle;
  /** Fade-in duration in ms */
  fadeDuration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Fallback Icon
// ─────────────────────────────────────────────────────────────────────────────

function ImageFallbackIcon({ color, size = 48 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M3 16l5-5 4 4 4-4 5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill={color}
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Component
// ─────────────────────────────────────────────────────────────────────────────

function ImageSkeleton({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withTiming(1, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });

    const interval = setInterval(() => {
      shimmer.value = 0;
      shimmer.value = withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colors.backgroundMuted },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function Image({
  source,
  placeholder,
  fallback,
  showSkeleton = true,
  style,
  fadeDuration = 300,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const { colors, radius } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const opacity = useSharedValue(0);

  const handleLoad = useCallback(
    (e: NativeSyntheticEvent<ImageLoadEventData>) => {
      setIsLoading(false);
      opacity.value = withTiming(1, {
        duration: fadeDuration,
        easing: Easing.out(Easing.ease),
      });
      onLoad?.(e);
    },
    [fadeDuration, onLoad]
  );

  const handleError = useCallback(
    (e: NativeSyntheticEvent<ImageErrorEventData>) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(e);
    },
    [onError]
  );

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Extract dimensions from style
  const flatStyle = StyleSheet.flatten(style) || {};
  const { width, height, aspectRatio, borderRadius, ...containerStyle } = flatStyle as ImageStyle & ViewStyle;

  const imageStyle: ImageStyle = {
    width: width || '100%',
    height: height || '100%',
    aspectRatio,
    borderRadius: borderRadius ?? radius.md,
  };

  // Error state
  if (hasError) {
    return (
      <View
        style={[
          styles.container,
          {
            width,
            height,
            aspectRatio,
            borderRadius: borderRadius ?? radius.md,
            backgroundColor: colors.backgroundMuted,
          },
          containerStyle,
        ]}
        accessibilityRole="image"
        accessibilityLabel="Image failed to load"
      >
        {fallback || (
          <View style={styles.fallbackContent}>
            <ImageFallbackIcon color={colors.foregroundMuted} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          aspectRatio,
          borderRadius: borderRadius ?? radius.md,
          overflow: 'hidden',
        },
        containerStyle,
      ]}
    >
      {/* Skeleton/Placeholder */}
      {isLoading && (
        <>
          {placeholder ? (
            <RNImage
              source={placeholder}
              style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
              blurRadius={10}
            />
          ) : showSkeleton ? (
            <ImageSkeleton />
          ) : null}
        </>
      )}

      {/* Main Image */}
      <AnimatedImage
        source={source}
        style={[imageStyle, imageAnimatedStyle]}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityRole="image"
        {...props}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
