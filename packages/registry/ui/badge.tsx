/**
 * Badge
 *
 * Small status indicator for labels and counts.
 * Uses design tokens for consistent styling.
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="secondary">12</Badge>
 * <Badge variant="destructive" size="lg">Error</Badge>
 * <Badge variant="outline">Draft</Badge>
 * <Badge count={5} /> // Notification count badge
 * <Badge count={100} max={99} /> // Shows "99+"
 * <Badge dot /> // Small dot indicator
 * <Badge dot pulse /> // Animated attention dot
 * ```
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme, ThemeColors, areAnimationsDisabled } from '@metacells/mcellui-core';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content (ignored if count or dot is used) */
  children?: React.ReactNode;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Display as notification count badge */
  count?: number;
  /** Maximum count to display (shows "max+" if exceeded) */
  max?: number;
  /** Show count even when it's 0 */
  showZero?: boolean;
  /** Display as a small dot indicator */
  dot?: boolean;
  /** Animate the dot with a pulse effect (requires dot prop) */
  pulse?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  count,
  max = 99,
  showZero = false,
  dot = false,
  pulse = false,
  style,
  textStyle,
}: BadgeProps) {
  const { colors, components, componentRadius, platformShadow } = useTheme();
  const tokens = components.badge[size];
  const variantStyles = getVariantStyles(variant, colors);
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  // Pulse animation
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (pulse && dot && animationsEnabled) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1, // Repeat infinitely
        true
      );
    }
  }, [pulse, dot, animationsEnabled]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Add subtle shadow for solid badges
  const shadowStyle = variant !== 'outline' ? platformShadow('sm') : {};

  // Dot mode - render as a small circular indicator
  if (dot) {
    const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;

    const DotView = pulse && animationsEnabled ? Animated.View : View;

    return (
      <DotView
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
          },
          variantStyles.container,
          shadowStyle,
          pulse && animationsEnabled ? pulseAnimatedStyle : undefined,
          style,
        ]}
      />
    );
  }

  // Count mode - render as a notification count badge
  if (count !== undefined) {
    // Hide if count is 0 and showZero is false
    if (count === 0 && !showZero) {
      return null;
    }

    const displayCount = count > max ? `${max}+` : String(count);
    const isCircular = count <= 9 && count >= 0;

    // Calculate circular size based on badge size
    const circleSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

    return (
      <View
        style={[
          styles.base,
          styles.countBadge,
          {
            minWidth: isCircular ? circleSize : undefined,
            height: isCircular ? circleSize : undefined,
            paddingHorizontal: isCircular ? 0 : tokens.paddingHorizontal,
            paddingVertical: isCircular ? 0 : tokens.paddingVertical,
            borderRadius: isCircular ? circleSize / 2 : componentRadius.badge,
          },
          variantStyles.container,
          shadowStyle,
          style,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: size === 'sm' ? 10 : size === 'lg' ? 14 : 12,
              fontWeight: tokens.fontWeight,
            },
            variantStyles.text,
            textStyle,
          ]}
        >
          {displayCount}
        </Text>
      </View>
    );
  }

  // Standard badge with children
  return (
    <View
      style={[
        styles.base,
        {
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          borderRadius: componentRadius.badge,
        },
        variantStyles.container,
        shadowStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: tokens.fontSize,
            fontWeight: tokens.fontWeight,
          },
          variantStyles.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function getVariantStyles(
  variant: BadgeVariant,
  colors: ThemeColors
) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary } as ViewStyle,
        text: { color: colors.secondaryForeground } as TextStyle,
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive } as ViewStyle,
        text: { color: colors.destructiveForeground } as TextStyle,
      };
    case 'success':
      return {
        container: { backgroundColor: colors.success } as ViewStyle,
        text: { color: colors.successForeground } as TextStyle,
      };
    case 'warning':
      return {
        container: { backgroundColor: colors.warning } as ViewStyle,
        text: { color: colors.warningForeground } as TextStyle,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        text: { color: colors.foreground } as TextStyle,
      };
    default:
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.primaryForeground } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
  dot: {},
  countBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
