/**
 * Accordion
 *
 * An expandable/collapsible content panel component.
 * Supports single or multiple expanded items.
 *
 * @example
 * ```tsx
 * <Accordion type="single" defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>
 *       <Text>Content for section 1</Text>
 *     </AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>
 *       <Text>Content for section 2</Text>
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
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
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.quad) };

// Accordion Context
interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string[];
  onValueChange: (itemValue: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider');
  }
  return context;
}

// Item Context
interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within an AccordionItem');
  }
  return context;
}

// Accordion Root
export interface AccordionProps {
  /** Selection mode */
  type?: 'single' | 'multiple';
  /** Controlled value */
  value?: string | string[];
  /** Default value */
  defaultValue?: string | string[];
  /** Callback when value changes */
  onValueChange?: (value: string | string[]) => void;
  /** Whether to allow collapsing all items (single mode only) */
  collapsible?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Accordion({
  type = 'single',
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = true,
  children,
  style,
}: AccordionProps) {
  const { colors, radius, spacing } = useTheme();

  // Normalize values to array
  const normalizeValue = (val: string | string[] | undefined): string[] => {
    if (val === undefined) return [];
    return Array.isArray(val) ? val : [val];
  };

  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(defaultValue)
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? normalizeValue(controlledValue) : internalValue;

  const handleValueChange = useCallback(
    (itemValue: string) => {
      let newValue: string[];

      if (type === 'single') {
        if (value.includes(itemValue)) {
          newValue = collapsible ? [] : [itemValue];
        } else {
          newValue = [itemValue];
        }
      } else {
        if (value.includes(itemValue)) {
          newValue = value.filter((v) => v !== itemValue);
        } else {
          newValue = [...value, itemValue];
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      const returnValue = type === 'single' ? newValue[0] ?? '' : newValue;
      onValueChange?.(returnValue);
    },
    [type, value, collapsible, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <View
        style={[
          styles.container,
          {
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

// AccordionItem
export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AccordionItem({
  value,
  children,
  disabled = false,
  style,
}: AccordionItemProps) {
  const { colors } = useTheme();
  const { value: selectedValues } = useAccordionContext();
  const isOpen = selectedValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <View
        style={[
          styles.item,
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
}

// AccordionTrigger
export interface AccordionTriggerProps {
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AccordionTrigger({
  children,
  disabled = false,
  style,
  textStyle,
}: AccordionTriggerProps) {
  const { colors, spacing } = useTheme();
  const { onValueChange } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  const rotation = useSharedValue(isOpen ? 180 : 0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, TIMING_CONFIG);
  }, [isOpen]);

  const handlePress = () => {
    if (disabled) return;
    haptic('selection');
    onValueChange(value);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable
      style={[
        styles.trigger,
        {
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[4],
          backgroundColor: colors.background,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen, disabled }}
    >
      <Text
        style={[
          styles.triggerText,
          { color: colors.foreground },
          textStyle,
        ]}
      >
        {children}
      </Text>
      <Animated.Text
        style={[
          styles.chevron,
          { color: colors.foregroundMuted },
          chevronStyle,
        ]}
      >
        ▼
      </Animated.Text>
    </Pressable>
  );
}

// AccordionContent
export interface AccordionContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AccordionContent({ children, style }: AccordionContentProps) {
  const { colors, spacing } = useTheme();
  const { isOpen } = useAccordionItemContext();

  const height = useSharedValue(isOpen ? 1 : 0);
  const opacity = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    height.value = withTiming(isOpen ? 1 : 0, TIMING_CONFIG);
    opacity.value = withTiming(isOpen ? 1 : 0, TIMING_CONFIG);
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value === 0 ? 0 : 'auto',
    opacity: opacity.value,
    overflow: 'hidden',
  }));

  if (!isOpen && height.value === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: spacing[4],
            paddingBottom: spacing[4],
            backgroundColor: colors.background,
          },
          style,
        ]}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
  item: {},
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    marginLeft: 8,
  },
  content: {},
});
