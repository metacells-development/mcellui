/**
 * Pagination
 *
 * Page navigation for paged content with multiple visual variants.
 * Supports dots, numbers, and simple previous/next styles.
 *
 * @example
 * ```tsx
 * // Dots variant (default)
 * <Pagination
 *   total={5}
 *   page={currentPage}
 *   onPageChange={setCurrentPage}
 * />
 *
 * // Numbers variant
 * <Pagination
 *   total={10}
 *   page={currentPage}
 *   onPageChange={setCurrentPage}
 *   variant="numbers"
 * />
 *
 * // Simple prev/next
 * <Pagination
 *   total={10}
 *   page={currentPage}
 *   onPageChange={setCurrentPage}
 *   variant="simple"
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, paginationTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type PaginationVariant = 'dots' | 'numbers' | 'simple';
export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps {
  /** Total number of pages */
  total: number;
  /** Current page (1-indexed) */
  page: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Visual variant */
  variant?: PaginationVariant;
  /** Size variant */
  size?: PaginationSize;
  /** Maximum visible page numbers (for numbers variant) */
  maxVisible?: number;
  /** Whether to show prev/next buttons */
  showButtons?: boolean;
  /** Whether navigation wraps around */
  loop?: boolean;
  /** Container style */
  style?: ViewStyle;
}


// ============================================================================
// Animated Dot
// ============================================================================

function AnimatedDot({
  isActive,
  size,
  activeColor,
  inactiveColor,
}: {
  isActive: boolean;
  size: number;
  activeColor: string;
  inactiveColor: string;
}) {
  const scale = useSharedValue(isActive ? 1.2 : 1);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  React.useEffect(() => {
    scale.value = withSpring(isActive ? 1.2 : 1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 200 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: isActive ? activeColor : inactiveColor,
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

// ============================================================================
// Component
// ============================================================================

export function Pagination({
  total,
  page,
  onPageChange,
  variant = 'dots',
  size = 'md',
  maxVisible = 5,
  showButtons = false,
  loop = false,
  style,
}: PaginationProps) {
  const { colors, radius, spacing } = useTheme();
  const tokens = paginationTokens;
  const config = tokens[size];

  if (total <= 0) return null;

  const handlePrev = () => {
    haptic('light');
    if (page > 1) {
      onPageChange(page - 1);
    } else if (loop) {
      onPageChange(total);
    }
  };

  const handleNext = () => {
    haptic('light');
    if (page < total) {
      onPageChange(page + 1);
    } else if (loop) {
      onPageChange(1);
    }
  };

  const handlePagePress = (targetPage: number) => {
    haptic('light');
    if (targetPage !== page) {
      onPageChange(targetPage);
    }
  };

  const canGoPrev = loop || page > 1;
  const canGoNext = loop || page < total;

  // Dots variant
  if (variant === 'dots') {
    return (
      <View style={[styles.container, { gap: config.dotGap }, style]}>
        {showButtons && (
          <Pressable
            onPress={handlePrev}
            disabled={!canGoPrev}
            style={[
              styles.button,
              {
                width: config.buttonSize,
                height: config.buttonSize,
                borderRadius: radius.md,
                opacity: canGoPrev ? 1 : 0.3,
              },
            ]}
          >
            <ChevronLeftIcon size={config.buttonSize * 0.5} color={colors.foreground} />
          </Pressable>
        )}

        <View style={[styles.dotsContainer, { gap: config.dotGap }]}>
          {Array.from({ length: total }, (_, i) => (
            <Pressable key={i} onPress={() => handlePagePress(i + 1)}>
              <AnimatedDot
                isActive={page === i + 1}
                size={config.dotSize}
                activeColor={colors.primary}
                inactiveColor={colors.border}
              />
            </Pressable>
          ))}
        </View>

        {showButtons && (
          <Pressable
            onPress={handleNext}
            disabled={!canGoNext}
            style={[
              styles.button,
              {
                width: config.buttonSize,
                height: config.buttonSize,
                borderRadius: radius.md,
                opacity: canGoNext ? 1 : 0.3,
              },
            ]}
          >
            <ChevronRightIcon size={config.buttonSize * 0.5} color={colors.foreground} />
          </Pressable>
        )}
      </View>
    );
  }

  // Numbers variant
  if (variant === 'numbers') {
    // Calculate visible page range
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(total, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    // Add first page if not visible
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page if not visible
    if (endPage < total) {
      if (endPage < total - 1) {
        pages.push('ellipsis');
      }
      pages.push(total);
    }

    return (
      <View style={[styles.container, { gap: spacing[1] }, style]}>
        <Pressable
          onPress={handlePrev}
          disabled={!canGoPrev}
          style={[
            styles.button,
            {
              width: config.buttonSize,
              height: config.buttonSize,
              borderRadius: radius.md,
              backgroundColor: colors.secondary,
              opacity: canGoPrev ? 1 : 0.3,
            },
          ]}
        >
          <ChevronLeftIcon size={config.buttonSize * 0.5} color={colors.foreground} />
        </Pressable>

        {pages.map((p, index) => {
          if (p === 'ellipsis') {
            return (
              <View
                key={`ellipsis-${index}`}
                style={[
                  styles.numberButton,
                  { width: config.numberSize, height: config.numberSize },
                ]}
              >
                <Text style={[styles.ellipsis, { fontSize: config.fontSize, color: colors.foregroundMuted }]}>
                  ...
                </Text>
              </View>
            );
          }

          const isActive = p === page;

          return (
            <Pressable
              key={p}
              onPress={() => handlePagePress(p)}
              style={[
                styles.numberButton,
                {
                  width: config.numberSize,
                  height: config.numberSize,
                  borderRadius: radius.md,
                  backgroundColor: isActive ? colors.primary : colors.secondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.numberText,
                  {
                    fontSize: config.fontSize,
                    color: isActive ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                {p}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={handleNext}
          disabled={!canGoNext}
          style={[
            styles.button,
            {
              width: config.buttonSize,
              height: config.buttonSize,
              borderRadius: radius.md,
              backgroundColor: colors.secondary,
              opacity: canGoNext ? 1 : 0.3,
            },
          ]}
        >
          <ChevronRightIcon size={config.buttonSize * 0.5} color={colors.foreground} />
        </Pressable>
      </View>
    );
  }

  // Simple variant
  return (
    <View style={[styles.container, { gap: spacing[3] }, style]}>
      <Pressable
        onPress={handlePrev}
        disabled={!canGoPrev}
        style={[
          styles.simpleButton,
          {
            gap: tokens.simple.gap,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: radius.md,
            backgroundColor: colors.secondary,
            opacity: canGoPrev ? 1 : 0.3,
          },
        ]}
      >
        <ChevronLeftIcon size={config.buttonSize * 0.5} color={colors.foreground} />
        <Text style={[styles.simpleText, { fontSize: config.fontSize, color: colors.foreground }]}>
          Previous
        </Text>
      </Pressable>

      <Text style={[styles.pageInfo, { fontSize: config.fontSize, color: colors.foregroundMuted }]}>
        {page} of {total}
      </Text>

      <Pressable
        onPress={handleNext}
        disabled={!canGoNext}
        style={[
          styles.simpleButton,
          {
            gap: tokens.simple.gap,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: radius.md,
            backgroundColor: colors.secondary,
            opacity: canGoNext ? 1 : 0.3,
          },
        ]}
      >
        <Text style={[styles.simpleText, { fontSize: config.fontSize, color: colors.foreground }]}>
          Next
        </Text>
        <ChevronRightIcon size={config.buttonSize * 0.5} color={colors.foreground} />
      </Pressable>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontWeight: '600',
  },
  ellipsis: {
    fontWeight: '500',
  },
  simpleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simpleText: {
    fontWeight: '500',
  },
  pageInfo: {
    minWidth: 60,
    textAlign: 'center',
  },
});
