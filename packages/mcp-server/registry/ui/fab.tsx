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

import React, { useMemo } from 'react';
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
import { useTheme, haptic, areAnimationsDisabled } from '@metacells/mcellui-core';

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
  const { colors, components, componentRadius, fontWeight, platformShadow, springs, spacing } = useTheme();
  const tokens = components.fab[size];

  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
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
    transform: [{ scale: animationsEnabled ? scale.value : 1 }],
  }));

  const handlePressIn = () => {
    if (animationsEnabled) {
      scale.value = withSpring(0.92, springs.snappy);
    }
  };

  const handlePressOut = () => {
    if (animationsEnabled) {
      scale.value = withSpring(1, springs.snappy);
    }
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
          width: isExtended ? 'auto' : tokens.size,
          height: tokens.size,
          borderRadius: tokens.size / 2,
          paddingHorizontal: isExtended ? tokens.paddingHorizontal : 0,
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
                width: tokens.iconSize,
                height: tokens.iconSize,
                color: variantStyles.iconColor,
              })
            : icon}
          {label && (
            <Text
              style={[
                styles.label,
                {
                  fontSize: tokens.fontSize,
                  fontWeight: tokens.fontWeight,
                  color: variantStyles.iconColor,
                  marginLeft: spacing[2],
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
