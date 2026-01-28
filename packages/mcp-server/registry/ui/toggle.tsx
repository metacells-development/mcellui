/**
 * Toggle / ToggleGroup
 *
 * Button-style toggles for toolbar actions and filters.
 * Supports single and multiple selection modes.
 *
 * @example
 * ```tsx
 * // Single toggle
 * <Toggle pressed={isBold} onPressedChange={setIsBold}>
 *   <BoldIcon />
 * </Toggle>
 *
 * // Toggle group (single selection)
 * <ToggleGroup type="single" value={view} onValueChange={setView}>
 *   <ToggleGroupItem value="grid"><GridIcon /></ToggleGroupItem>
 *   <ToggleGroupItem value="list"><ListIcon /></ToggleGroupItem>
 * </ToggleGroup>
 *
 * // Toggle group (multiple selection)
 * <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
 *   <ToggleGroupItem value="bold">B</ToggleGroupItem>
 *   <ToggleGroupItem value="italic">I</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */

import React, { createContext, useContext } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, fontSize, fontWeight } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// ============================================================================
// Types
// ============================================================================

export type ToggleVariant = 'default' | 'outline';
export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps {
  /** Whether the toggle is pressed */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Called when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual variant */
  variant?: ToggleVariant;
  /** Size variant */
  size?: ToggleSize;
  /** Whether toggle is disabled */
  disabled?: boolean;
  /** Content to display */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

export interface ToggleGroupProps {
  /** Selection type */
  type: 'single' | 'multiple';
  /** Selected value(s) - string for single, string[] for multiple */
  value?: string | string[];
  /** Default value(s) for uncontrolled mode */
  defaultValue?: string | string[];
  /** Called when selection changes */
  onValueChange?: (value: string | string[]) => void;
  /** Visual variant for all items */
  variant?: ToggleVariant;
  /** Size for all items */
  size?: ToggleSize;
  /** Whether all items are disabled */
  disabled?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Children (ToggleGroupItem components) */
  children: React.ReactNode;
}

export interface ToggleGroupItemProps {
  /** Unique value for this item */
  value: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Content to display */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Size Configs
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    height: 32,
    minWidth: 32,
    paddingHorizontal: 8,
    fontSize: fontSize.xs,
    iconSize: 16,
  },
  md: {
    height: 40,
    minWidth: 40,
    paddingHorizontal: 12,
    fontSize: fontSize.sm,
    iconSize: 18,
  },
  lg: {
    height: 48,
    minWidth: 48,
    paddingHorizontal: 16,
    fontSize: fontSize.base,
    iconSize: 20,
  },
};

// ============================================================================
// Context
// ============================================================================

interface ToggleGroupContextValue {
  type: 'single' | 'multiple';
  value: string | string[];
  onItemPress: (itemValue: string) => void;
  variant: ToggleVariant;
  size: ToggleSize;
  disabled: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

// ============================================================================
// Toggle Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Toggle({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  children,
  style,
}: ToggleProps) {
  const { colors, radius } = useTheme();
  const config = SIZE_CONFIG[size];

  // Handle controlled/uncontrolled state
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
  const pressed = controlledPressed !== undefined ? controlledPressed : internalPressed;

  const scale = useSharedValue(1);

  const handlePress = () => {
    if (disabled) return;

    haptic('light');
    const newPressed = !pressed;

    if (controlledPressed === undefined) {
      setInternalPressed(newPressed);
    }
    onPressedChange?.(newPressed);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackgroundColor = () => {
    if (disabled) return colors.secondary;
    if (pressed) return colors.secondary;
    if (variant === 'outline') return 'transparent';
    return 'transparent';
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return pressed ? colors.foreground : colors.border;
    }
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.foregroundMuted;
    if (pressed) return colors.foreground;
    return colors.foregroundMuted;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ pressed, disabled }}
      style={[
        styles.toggle,
        {
          height: config.height,
          minWidth: config.minWidth,
          paddingHorizontal: config.paddingHorizontal,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { fontSize: config.fontSize, color: getTextColor() }]}>
          {children}
        </Text>
      ) : (
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              width: config.iconSize,
              height: config.iconSize,
              color: getTextColor(),
            });
          }
          return child;
        })
      )}
    </AnimatedPressable>
  );
}

// ============================================================================
// ToggleGroup Component
// ============================================================================

export function ToggleGroup({
  type,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  children,
}: ToggleGroupProps) {
  const { radius, spacing } = useTheme();

  // Handle controlled/uncontrolled state
  const defaultVal = type === 'single' ? (defaultValue as string) || '' : (defaultValue as string[]) || [];
  const [internalValue, setInternalValue] = React.useState<string | string[]>(defaultVal);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleItemPress = (itemValue: string) => {
    if (disabled) return;

    haptic('light');

    let newValue: string | string[];

    if (type === 'single') {
      // Single selection - toggle off if same value
      newValue = value === itemValue ? '' : itemValue;
    } else {
      // Multiple selection - add/remove from array
      const currentValues = value as string[];
      if (currentValues.includes(itemValue)) {
        newValue = currentValues.filter((v) => v !== itemValue);
      } else {
        newValue = [...currentValues, itemValue];
      }
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue: ToggleGroupContextValue = {
    type,
    value,
    onItemPress: handleItemPress,
    variant,
    size,
    disabled,
  };

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <View
        style={[
          styles.group,
          { borderRadius: radius.lg, gap: spacing[1] },
          style,
        ]}
        accessibilityRole="group"
      >
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

// ============================================================================
// ToggleGroupItem Component
// ============================================================================

export function ToggleGroupItem({
  value,
  disabled: itemDisabled = false,
  children,
  style,
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup');
  }

  const { type, value: groupValue, onItemPress, variant, size, disabled: groupDisabled } = context;

  // Check if this item is pressed
  const isPressed = type === 'single'
    ? groupValue === value
    : (groupValue as string[]).includes(value);

  const disabled = groupDisabled || itemDisabled;

  return (
    <Toggle
      pressed={isPressed}
      onPressedChange={() => onItemPress(value)}
      variant={variant}
      size={size}
      disabled={disabled}
      style={style}
    >
      {children}
    </Toggle>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.medium,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
