/**
 * HorizontalList
 *
 * A horizontal scrolling container with snap-to-item behavior,
 * commonly used for carousels, card lists, and horizontal galleries.
 *
 * @example
 * ```tsx
 * // Basic usage - edge-to-edge scroll with content inset
 * <HorizontalList contentInset={16}>
 *   {items.map(item => (
 *     <ProductCard key={item.id} style={{ width: 200 }} {...item} />
 *   ))}
 * </HorizontalList>
 *
 * // With active index tracking
 * <HorizontalList
 *   contentInset={16}
 *   onActiveIndexChange={(index) => console.log('Active:', index)}
 * >
 *   {banners.map(banner => (
 *     <BannerCard key={banner.id} style={{ width: screenWidth - 48 }} />
 *   ))}
 * </HorizontalList>
 * ```
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { useTheme } from '@nativeui/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HorizontalListProps {
  /** List items */
  children: React.ReactNode;
  /** Content inset from edges (first/last item padding) */
  contentInset?: number;
  /** Spacing between items */
  itemSpacing?: number;
  /** Enable snap scrolling */
  snapEnabled?: boolean;
  /** Deceleration rate for scrolling */
  decelerationRate?: 'normal' | 'fast';
  /** Show horizontal scroll indicator */
  showsScrollIndicator?: boolean;
  /** Called when active (centered) item changes */
  onActiveIndexChange?: (index: number) => void;
  /** Called when scroll position changes */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Container style */
  style?: ViewStyle;
  /** Content container style */
  contentContainerStyle?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function HorizontalList({
  children,
  contentInset,
  itemSpacing,
  snapEnabled = true,
  decelerationRate = 'fast',
  showsScrollIndicator = false,
  onActiveIndexChange,
  onScroll,
  style,
  contentContainerStyle,
}: HorizontalListProps) {
  const { spacing } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  // Use theme spacing as defaults
  const inset = contentInset ?? spacing[4];
  const gap = itemSpacing ?? spacing[3];

  // Track item positions for snap offsets
  const [snapOffsets, setSnapOffsets] = useState<number[]>([]);
  const itemPositions = useRef<{ x: number; width: number }[]>([]);
  const containerWidth = useRef(SCREEN_WIDTH);

  const childArray = React.Children.toArray(children);

  // Calculate snap offsets when items are laid out
  const handleItemLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      itemPositions.current[index] = { x, width };

      // Recalculate snap offsets when all items are measured
      if (itemPositions.current.filter(Boolean).length === childArray.length) {
        const offsets = itemPositions.current.map((pos, index) => {
          if (index === 0) return 0;
          // Snap so previous item is completely off-screen
          const prevItem = itemPositions.current[index - 1];
          if (!prevItem) return 0;
          return prevItem.x + prevItem.width;
        });
        setSnapOffsets(offsets);
      }
    },
    [childArray.length, inset]
  );

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    containerWidth.current = event.nativeEvent.layout.width;
  }, []);

  // Track active index on scroll end
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onActiveIndexChange) return;

      const offsetX = event.nativeEvent.contentOffset.x;

      // Find closest snap point
      let closestIndex = 0;
      let minDistance = Infinity;

      snapOffsets.forEach((offset, index) => {
        const distance = Math.abs(offsetX - offset);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      onActiveIndexChange(closestIndex);
    },
    [onActiveIndexChange, snapOffsets]
  );

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={showsScrollIndicator}
      decelerationRate={decelerationRate}
      snapToOffsets={snapEnabled ? snapOffsets : undefined}
      snapToStart={snapEnabled}
      snapToEnd={snapEnabled}
      onScroll={onScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      onLayout={handleContainerLayout}
      accessibilityRole="list"
    >
      {childArray.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;

        return (
          <View
            key={index}
            style={{
              marginLeft: isFirst ? inset : gap,
              marginRight: isLast ? inset : 0,
            }}
            onLayout={handleItemLayout(index)}
            accessible
          >
            {child}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
