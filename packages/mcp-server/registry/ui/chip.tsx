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
 * // Dismissible chip (tag input style)
 * <Chip onRemove={() => removeTag(tag)}>
 *   {tag.name}
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
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

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
  /** Remove handler - shows close button when provided */
  onRemove?: () => void;
  /** Container style */
  style?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
}

// Close/X icon for dismissible chips
function CloseIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
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
  onRemove,
  style,
  labelStyle,
}: ChipProps) {
  const { colors, fontWeight, components, componentRadius, spacing, radius } = useTheme();
  const tokens = components.chip[size];

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

  const handleRemove = () => {
    haptic('light');
    onRemove?.();
  };

  // Adjust padding when there's a close button
  const rightPadding = onRemove
    ? tokens.paddingHorizontal - spacing[1] // Less padding since close button has its own
    : tokens.paddingHorizontal;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || (!onPress && !onRemove)}
      style={[
        styles.chip,
        {
          paddingLeft: tokens.paddingHorizontal,
          paddingRight: rightPadding,
          paddingVertical: tokens.paddingVertical,
          borderRadius: componentRadius.chip,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      {icon && (
        <View style={{ marginRight: spacing[1.5] }}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ width?: number; height?: number; color?: string }>, {
                width: tokens.iconSize,
                height: tokens.iconSize,
                color: textColor,
              })
            : icon}
        </View>
      )}
      <Text
        style={[
          styles.label,
          {
            fontSize: tokens.fontSize,
            fontWeight: fontWeight.medium,
            color: textColor,
          },
          labelStyle,
        ]}
      >
        {children}
      </Text>
      {onRemove && (
        <Pressable
          onPress={handleRemove}
          disabled={disabled}
          style={({ pressed }) => [
            styles.closeButton,
            {
              marginLeft: spacing[1],
              padding: spacing[0.5],
              borderRadius: radius.sm,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${children}`}
          hitSlop={8}
        >
          <CloseIcon
            color={textColor}
            size={tokens.iconSize - spacing[0.5]}
          />
        </Pressable>
      )}
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
  closeButton: {
    // Dynamic padding and borderRadius applied inline via tokens
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
