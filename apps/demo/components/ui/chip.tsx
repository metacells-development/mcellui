/**
 * Chip
 *
 * Selectable filter pills for filtering content or making selections.
 * Supports single and multi-select modes with optional icons.
 *
 * @example
 * ```tsx
 * // Single chip
 * <Chip selected={isSelected} onPress={() => setSelected(!isSelected)}>
 *   Electronics
 * </Chip>
 *
 * // With icon
 * <Chip icon={<TagIcon />} selected>
 *   Sale
 * </Chip>
 *
 * // Chip group
 * <ChipGroup>
 *   {categories.map(cat => (
 *     <Chip
 *       key={cat.id}
 *       selected={selectedIds.includes(cat.id)}
 *       onPress={() => toggleSelection(cat.id)}
 *     >
 *       {cat.name}
 *     </Chip>
 *   ))}
 * </ChipGroup>
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ChipVariant = 'outline' | 'filled';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  /** Chip label */
  children: string;
  /** Whether chip is selected */
  selected?: boolean;
  /** Visual variant */
  variant?: ChipVariant;
  /** Size preset */
  size?: ChipSize;
  /** Icon element (left side) */
  icon?: React.ReactNode;
  /** Whether chip is disabled */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

export interface ChipGroupProps {
  /** Chip elements */
  children: React.ReactNode;
  /** Gap between chips */
  spacing?: number;
  /** Container style */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size configs
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    iconSize: 14,
    radiusKey: 'md' as const,
  },
  md: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 14,
    iconSize: 16,
    radiusKey: 'lg' as const,
  },
  lg: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    fontSize: 16,
    iconSize: 18,
    radiusKey: 'xl' as const,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Chip Component
// ─────────────────────────────────────────────────────────────────────────────

export function Chip({
  children,
  selected = false,
  variant = 'outline',
  size = 'md',
  icon,
  disabled = false,
  onPress,
  style,
  labelStyle,
}: ChipProps) {
  const { colors, fontWeight, radius } = useTheme();
  const config = SIZE_CONFIG[size];

  const scale = useSharedValue(1);
  const selectedAnim = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    selectedAnim.value = withSpring(selected ? 1 : 0, {
      damping: 20,
      stiffness: 300,
    });
  }, [selected, selectedAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor =
      variant === 'filled'
        ? interpolateColor(
            selectedAnim.value,
            [0, 1],
            [colors.secondary, colors.primary]
          )
        : interpolateColor(
            selectedAnim.value,
            [0, 1],
            ['transparent', colors.primary + '15']
          );

    const borderColor = interpolateColor(
      selectedAnim.value,
      [0, 1],
      [colors.border, colors.primary]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  const textColor =
    variant === 'filled'
      ? selected
        ? colors.primaryForeground
        : colors.secondaryForeground
      : selected
        ? colors.primary
        : colors.foreground;

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.chip,
        {
          paddingHorizontal: config.paddingHorizontal,
          paddingVertical: config.paddingVertical,
          borderRadius: radius[config.radiusKey],
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      {icon && (
        <View style={{ marginRight: 6 }}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ width?: number; height?: number; color?: string }>, {
                width: config.iconSize,
                height: config.iconSize,
                color: textColor,
              })
            : icon}
        </View>
      )}
      <Text
        style={[
          styles.label,
          {
            fontSize: config.fontSize,
            fontWeight: fontWeight.medium,
            color: textColor,
          },
          labelStyle,
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChipGroup Component
// ─────────────────────────────────────────────────────────────────────────────

export function ChipGroup({ children, spacing, style }: ChipGroupProps) {
  const { spacing: themeSpacing } = useTheme();
  const gap = spacing ?? themeSpacing[2];

  return (
    <View style={[styles.group, { gap }, style]}>
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    textAlign: 'center',
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
