/**
 * Carousel
 *
 * Auto-playing image/content slideshow with animated pagination indicators.
 * Supports swipe gestures, autoplay, parallax effects, and custom indicators.
 *
 * @example
 * ```tsx
 * // Basic carousel with children
 * <Carousel>
 *   <CarouselItem>
 *     <Image source={{ uri: 'https://...' }} style={{ width: '100%', height: 200 }} />
 *   </CarouselItem>
 *   <CarouselItem>
 *     <View style={{ backgroundColor: 'blue', height: 200 }} />
 *   </CarouselItem>
 * </Carousel>
 *
 * // With data + renderItem (for parallax support)
 * <Carousel
 *   data={slides}
 *   renderItem={({ item, index, scrollX, width }) => (
 *     <OnboardingSlide item={item} index={index} scrollX={scrollX} width={width} />
 *   )}
 * />
 *
 * // With autoplay
 * <Carousel autoplay autoplayInterval={5000}>
 *   {items}
 * </Carousel>
 * ```
 */

import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Pressable,
  FlatList,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CarouselRenderItemInfo<T> {
  item: T;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

export interface CarouselProps<T = any> {
  /** Carousel slides (alternative to data + renderItem) */
  children?: React.ReactNode;
  /** Data array for renderItem pattern */
  data?: T[];
  /** Render function for data items - receives scrollX for parallax effects */
  renderItem?: (info: CarouselRenderItemInfo<T>) => React.ReactElement;
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
  /** Indicator style variant */
  indicatorStyle?: 'dot' | 'line';
}

export interface CarouselItemProps {
  /** Slide content */
  children: React.ReactNode;
  /** Item style */
  style?: ViewStyle;
}

export interface CarouselRef {
  /** Scroll to a specific slide index */
  scrollToIndex: (index: number, animated?: boolean) => void;
  /** Get the current active index */
  getActiveIndex: () => number;
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
// Animated Pagination Dot Component
// ─────────────────────────────────────────────────────────────────────────────

interface AnimatedDotProps {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
  variant: 'dot' | 'line';
}

function AnimatedDot({
  index,
  scrollX,
  width,
  activeColor,
  inactiveColor,
  onPress,
  variant,
}: AnimatedDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      variant === 'line' ? [8, 24, 8] : [8, 12, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
      transform: [{ scale }],
      backgroundColor: activeColor,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.dot, dotStyle]} />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Carousel Component
// ─────────────────────────────────────────────────────────────────────────────

function CarouselInner<T = any>(
  {
    children,
    data,
    renderItem,
    autoplay = false,
    autoplayInterval = 4000,
    showIndicators = true,
    indicatorPosition = 'bottom',
    onSlideChange,
    initialIndex = 0,
    style,
    height,
    indicatorStyle = 'line',
  }: CarouselProps<T>,
  ref: React.ForwardedRef<CarouselRef>
) {
  const { colors, spacing } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollX = useSharedValue(0);

  // Determine slide count from children or data
  const childArray = children ? React.Children.toArray(children) : [];
  const slideCount = data ? data.length : childArray.length;

  // Handle container layout to get accurate width
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Scroll to specific slide
  const scrollToSlide = useCallback((index: number, animated = true) => {
    const clampedIndex = Math.max(0, Math.min(index, slideCount - 1));
    flatListRef.current?.scrollToIndex({ index: clampedIndex, animated });
  }, [slideCount]);

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number, animated = true) => {
      scrollToSlide(index, animated);
      setActiveIndex(index);
      onSlideChange?.(index);
    },
    getActiveIndex: () => activeIndex,
  }), [scrollToSlide, activeIndex, onSlideChange]);

  // Handle scroll to update scrollX shared value
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
    },
    []
  );

  // Handle scroll end to determine active slide
  const handleMomentumScrollEnd = useCallback(
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

  const handleDotPress = (index: number) => {
    scrollToSlide(index);
    setActiveIndex(index);
    onSlideChange?.(index);
  };

  // Render indicators
  const indicators = showIndicators && slideCount > 1 && (
    <View
      style={[
        styles.indicators,
        indicatorPosition === 'top' ? styles.indicatorsTop : styles.indicatorsBottom,
      ]}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <AnimatedDot
          key={index}
          index={index}
          scrollX={scrollX}
          width={containerWidth}
          activeColor={colors.primary}
          inactiveColor={colors.border}
          onPress={() => handleDotPress(index)}
          variant={indicatorStyle}
        />
      ))}
    </View>
  );

  // Render slide content
  const renderSlide = useCallback(
    ({ item, index }: { item: T | React.ReactNode; index: number }) => {
      if (data && renderItem) {
        return (
          <View style={{ width: containerWidth, flex: 1 }}>
            {renderItem({ item: item as T, index, scrollX, width: containerWidth })}
          </View>
        );
      }
      return (
        <View style={{ width: containerWidth, flex: 1 }}>
          {item as React.ReactNode}
        </View>
      );
    },
    [containerWidth, data, renderItem, scrollX]
  );

  const listData = data || childArray;

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={handleLayout}
    >
      {indicatorPosition === 'top' && indicators}

      <FlatList
        ref={flatListRef}
        data={listData as any[]}
        renderItem={renderSlide}
        keyExtractor={(_, index) => `carousel-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        bounces={false}
        decelerationRate="fast"
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: 0,
          max: slideCount - 1,
          now: activeIndex,
          text: `Slide ${activeIndex + 1} of ${slideCount}`,
        }}
      />

      {indicatorPosition === 'bottom' && indicators}
    </View>
  );
}

// Export with forwardRef while preserving generic type
export const Carousel = forwardRef(CarouselInner) as <T = any>(
  props: CarouselProps<T> & { ref?: React.ForwardedRef<CarouselRef> }
) => React.ReactElement;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
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
