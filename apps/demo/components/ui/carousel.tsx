/**
 * Carousel
 *
 * Auto-playing image/content slideshow with pagination indicators.
 * Supports swipe gestures, autoplay, and custom indicators.
 *
 * @example
 * ```tsx
 * // Basic carousel
 * <Carousel>
 *   <CarouselItem>
 *     <Image source={{ uri: 'https://...' }} style={{ width: '100%', height: 200 }} />
 *   </CarouselItem>
 *   <CarouselItem>
 *     <View style={{ backgroundColor: 'blue', height: 200 }} />
 *   </CarouselItem>
 * </Carousel>
 *
 * // With autoplay
 * <Carousel autoplay autoplayInterval={5000}>
 *   {images.map((img, i) => (
 *     <CarouselItem key={i}>
 *       <Image source={{ uri: img }} style={styles.image} />
 *     </CarouselItem>
 *   ))}
 * </Carousel>
 *
 * // Hide indicators
 * <Carousel showIndicators={false}>
 *   {items}
 * </Carousel>
 * ```
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CarouselProps {
  /** Carousel slides */
  children: React.ReactNode;
  /** Enable autoplay */
  autoplay?: boolean;
  /** Autoplay interval in ms */
  autoplayInterval?: number;
  /** Show pagination indicators */
  showIndicators?: boolean;
  /** Indicator position */
  indicatorPosition?: 'bottom' | 'top';
  /** Called when active slide changes */
  onSlideChange?: (index: number) => void;
  /** Initial slide index */
  initialIndex?: number;
  /** Container style */
  style?: ViewStyle;
  /** Content height (defaults to auto) */
  height?: number;
}

export interface CarouselItemProps {
  /** Slide content */
  children: React.ReactNode;
  /** Item style */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// CarouselItem Component
// ─────────────────────────────────────────────────────────────────────────────

export function CarouselItem({ children, style }: CarouselItemProps) {
  return (
    <View style={[styles.item, style]}>
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination Dot Component
// ─────────────────────────────────────────────────────────────────────────────

interface DotProps {
  index: number;
  activeIndex: number;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
}

function Dot({ index, activeIndex, activeColor, inactiveColor, onPress }: DotProps) {
  const isActive = index === activeIndex;
  const scale = useSharedValue(isActive ? 1 : 0.8);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.8, { damping: 20, stiffness: 300 });
  }, [isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: isActive ? activeColor : inactiveColor,
            width: isActive ? 20 : 8,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Carousel Component
// ─────────────────────────────────────────────────────────────────────────────

export function Carousel({
  children,
  autoplay = false,
  autoplayInterval = 4000,
  showIndicators = true,
  indicatorPosition = 'bottom',
  onSlideChange,
  initialIndex = 0,
  style,
  height,
}: CarouselProps) {
  const { colors, spacing, radius } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const childArray = React.Children.toArray(children);
  const slideCount = childArray.length;

  // Handle container layout to get accurate width
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Scroll to specific slide
  const scrollToSlide = useCallback((index: number, animated = true) => {
    const clampedIndex = Math.max(0, Math.min(index, slideCount - 1));
    scrollRef.current?.scrollTo({
      x: clampedIndex * containerWidth,
      animated,
    });
  }, [containerWidth, slideCount]);

  // Handle scroll end to determine active slide
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / containerWidth);
      const clampedIndex = Math.max(0, Math.min(newIndex, slideCount - 1));

      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex);
        onSlideChange?.(clampedIndex);
      }
    },
    [containerWidth, slideCount, activeIndex, onSlideChange]
  );

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || slideCount <= 1) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((current) => {
          const nextIndex = (current + 1) % slideCount;
          scrollToSlide(nextIndex);
          return nextIndex;
        });
      }, autoplayInterval);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, slideCount, scrollToSlide]);

  // Stop autoplay on user interaction
  const handleScrollBeginDrag = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // Restart autoplay after user interaction
  const handleScrollEndDrag = useCallback(() => {
    if (autoplay && slideCount > 1 && !autoplayRef.current) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((current) => {
          const nextIndex = (current + 1) % slideCount;
          scrollToSlide(nextIndex);
          return nextIndex;
        });
      }, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, slideCount, scrollToSlide]);

  // Scroll to initial index on mount
  useEffect(() => {
    if (initialIndex > 0) {
      setTimeout(() => {
        scrollToSlide(initialIndex, false);
      }, 100);
    }
  }, [initialIndex, scrollToSlide]);

  const handleDotPress = (index: number) => {
    scrollToSlide(index);
    setActiveIndex(index);
    onSlideChange?.(index);
  };

  const indicators = showIndicators && slideCount > 1 && (
    <View
      style={[
        styles.indicators,
        indicatorPosition === 'top' ? styles.indicatorsTop : styles.indicatorsBottom,
      ]}
    >
      {childArray.map((_, index) => (
        <Dot
          key={index}
          index={index}
          activeIndex={activeIndex}
          activeColor={colors.primary}
          inactiveColor={colors.border}
          onPress={() => handleDotPress(index)}
        />
      ))}
    </View>
  );

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={handleLayout}
    >
      {indicatorPosition === 'top' && indicators}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: 0,
          max: slideCount - 1,
          now: activeIndex,
          text: `Slide ${activeIndex + 1} of ${slideCount}`,
        }}
      >
        {childArray.map((child, index) => (
          <View
            key={index}
            style={[
              styles.slideWrapper,
              { width: containerWidth },
            ]}
          >
            {child}
          </View>
        ))}
      </ScrollView>

      {indicatorPosition === 'bottom' && indicators}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  slideWrapper: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  indicatorsTop: {},
  indicatorsBottom: {},
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
