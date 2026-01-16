/**
 * FAB (Floating Action Button)
 *
 * A prominent button for primary actions, typically positioned
 * at the bottom-right of the screen.
 *
 * @example
 * ```tsx
 * // Basic FAB
 * <FAB icon={<PlusIcon />} onPress={handleCreate} />
 *
 * // Extended FAB with label
 * <FAB icon={<PlusIcon />} label="Create" onPress={handleCreate} />
 *
 * // Different sizes
 * <FAB icon={<PlusIcon />} size="sm" />
 * <FAB icon={<PlusIcon />} size="lg" />
 *
 * // With absolute positioning (typical usage)
 * <View style={{ flex: 1 }}>
 *   <Content />
 *   <FAB
 *     icon={<PlusIcon />}
 *     onPress={handleCreate}
 *     style={{ position: 'absolute', bottom: 24, right: 24 }}
 *   />
 * </View>
 * ```
 */

import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, haptic } from '@nativeui/core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type FABSize = 'sm' | 'md' | 'lg';
export type FABVariant = 'primary' | 'secondary' | 'surface';

export interface FABProps {
  /** Icon element */
  icon: React.ReactNode;
  /** Optional label for extended FAB */
  label?: string;
  /** Size preset */
  size?: FABSize;
  /** Visual variant */
  variant?: FABVariant;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size configs
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    size: 40,
    iconSize: 18,
    fontSize: 13,
    paddingHorizontal: 12,
  },
  md: {
    size: 56,
    iconSize: 24,
    fontSize: 14,
    paddingHorizontal: 16,
  },
  lg: {
    size: 72,
    iconSize: 32,
    fontSize: 16,
    paddingHorizontal: 20,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function FAB({
  icon,
  label,
  size = 'md',
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  style,
}: FABProps) {
  const { colors, fontWeight, platformShadow } = useTheme();
  const config = SIZE_CONFIG[size];

  const scale = useSharedValue(1);

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      iconColor: colors.primaryForeground,
    },
    secondary: {
      backgroundColor: colors.secondary,
      iconColor: colors.secondaryForeground,
    },
    surface: {
      backgroundColor: colors.card,
      iconColor: colors.foreground,
    },
  }[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const isExtended = !!label;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.fab,
        {
          backgroundColor: variantStyles.backgroundColor,
          width: isExtended ? 'auto' : config.size,
          height: config.size,
          borderRadius: config.size / 2,
          paddingHorizontal: isExtended ? config.paddingHorizontal : 0,
          opacity: disabled ? 0.5 : 1,
        },
        platformShadow('lg'),
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label || 'Floating action button'}
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={variantStyles.iconColor}
        />
      ) : (
        <>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ width?: number; height?: number; color?: string }>, {
                width: config.iconSize,
                height: config.iconSize,
                color: variantStyles.iconColor,
              })
            : icon}
          {label && (
            <Text
              style={[
                styles.label,
                {
                  fontSize: config.fontSize,
                  fontWeight: fontWeight.semibold,
                  color: variantStyles.iconColor,
                  marginLeft: 8,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </AnimatedPressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
