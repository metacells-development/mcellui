/**
 * SectionHeader
 *
 * A section header with title and optional "See All" action.
 * Commonly used above horizontal lists and content sections.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SectionHeader title="Popular Items" />
 *
 * // With "See All" action
 * <SectionHeader
 *   title="Recent Orders"
 *   actionText="View All"
 *   onAction={() => navigation.navigate('Orders')}
 * />
 *
 * // With subtitle
 * <SectionHeader
 *   title="Recommendations"
 *   subtitle="Based on your preferences"
 *   onAction={handleSeeAll}
 * />
 *
 * // Custom styling
 * <SectionHeader
 *   title="Featured"
 *   size="lg"
 *   style={{ paddingHorizontal: 24 }}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SectionHeaderSize = 'sm' | 'md' | 'lg';

export interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle below title */
  subtitle?: string;
  /** Text for the action button */
  actionText?: string;
  /** Show arrow icon next to action text */
  showActionArrow?: boolean;
  /** Action button press handler */
  onAction?: () => void;
  /** Size variant */
  size?: SectionHeaderSize;
  /** Container style */
  style?: ViewStyle;
  /** Title text style */
  titleStyle?: TextStyle;
  /** Subtitle text style */
  subtitleStyle?: TextStyle;
  /** Action text style */
  actionStyle?: TextStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size Configuration
// ─────────────────────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { titleSize: 'sm' as const, subtitleSize: 'xs' as const, actionSize: 'xs' as const },
  md: { titleSize: 'lg' as const, subtitleSize: 'sm' as const, actionSize: 'sm' as const },
  lg: { titleSize: 'xl' as const, subtitleSize: 'base' as const, actionSize: 'base' as const },
};

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function ChevronRightIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  actionText = 'See All',
  showActionArrow = true,
  onAction,
  size = 'md',
  style,
  titleStyle,
  subtitleStyle,
  actionStyle,
}: SectionHeaderProps) {
  const { colors, spacing, fontSize, fontWeight, springs } = useTheme();
  const config = sizeConfig[size];
  const actionScale = useSharedValue(1);

  const handleActionPressIn = useCallback(() => {
    actionScale.value = withSpring(0.95, springs.snappy);
  }, [springs.snappy]);

  const handleActionPressOut = useCallback(() => {
    actionScale.value = withSpring(1, springs.snappy);
  }, [springs.snappy]);

  const handleAction = useCallback(() => {
    haptic('light');
    onAction?.();
  }, [onAction]);

  const actionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: actionScale.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
        },
        style,
      ]}
    >
      {/* Title & Subtitle */}
      <View style={[styles.titleContainer, { marginRight: spacing[4] }]}>
        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
              fontSize: fontSize[config.titleSize],
              fontWeight: fontWeight.semibold,
            },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.foregroundMuted,
                fontSize: fontSize[config.subtitleSize],
                marginTop: spacing[0.5],
              },
              subtitleStyle,
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Action Button */}
      {onAction && (
        <AnimatedPressable
          style={[styles.actionButton, actionAnimatedStyle]}
          onPressIn={handleActionPressIn}
          onPressOut={handleActionPressOut}
          onPress={handleAction}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text
            style={[
              styles.actionText,
              {
                color: colors.primary,
                fontSize: fontSize[config.actionSize],
                fontWeight: fontWeight.medium,
              },
              actionStyle,
            ]}
          >
            {actionText}
          </Text>
          {showActionArrow && (
            <ChevronRightIcon
              color={colors.primary}
              size={fontSize[config.actionSize]}
            />
          )}
        </AnimatedPressable>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    // marginRight moved to dynamic style (spacing[4]) for token usage
  },
  title: {
    // Dynamic styles applied inline
  },
  subtitle: {
    // Dynamic styles applied inline
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    // Dynamic styles applied inline
  },
});
