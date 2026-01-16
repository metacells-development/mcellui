/**
 * Accordion
 *
 * An expandable/collapsible content panel component.
 * Supports single or multiple expanded items with smooth height animations.
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
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

// Smooth spring config for natural feel
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

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
  isLast: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within an AccordionItem');
  }
  return context;
}

// Animated SVG Chevron
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function ChevronIcon({ color, style }: { color: string; style?: any }) {
  return (
    <AnimatedSvg width={16} height={16} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </AnimatedSvg>
  );
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
  const { colors, radius } = useTheme();

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

  // Count children to determine last item
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

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
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              __isLast: index === childCount - 1,
            });
          }
          return child;
        })}
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
  /** @internal */
  __isLast?: boolean;
}

export function AccordionItem({
  value,
  children,
  disabled = false,
  style,
  __isLast = false,
}: AccordionItemProps) {
  const { colors } = useTheme();
  const { value: selectedValues } = useAccordionContext();
  const isOpen = selectedValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, isLast: __isLast }}>
      <View
        style={[
          styles.item,
          {
            borderBottomWidth: __isLast ? 0 : 1,
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

  const progress = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, SPRING_CONFIG);
  }, [isOpen]);

  const handlePress = () => {
    if (disabled) return;
    haptic('selection');
    onValueChange(value);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <Pressable
      style={({ pressed }) => [
        styles.trigger,
        {
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[4],
          backgroundColor: pressed ? colors.secondary : colors.background,
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
      <Animated.View style={chevronStyle}>
        <ChevronIcon color={colors.foregroundMuted} />
      </Animated.View>
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

  // Track if we've ever been opened (for initial render optimization)
  const hasBeenOpened = React.useRef(isOpen);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const heightValue = useSharedValue(0);
  const progress = useSharedValue(isOpen ? 1 : 0);

  // Update ref synchronously before render logic
  if (isOpen && !hasBeenOpened.current) {
    hasBeenOpened.current = true;
  }

  // Keep a ref to isOpen for use in callbacks
  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  // Sync measured height to shared value
  React.useEffect(() => {
    if (measuredHeight > 0) {
      heightValue.value = measuredHeight;
    }
  }, [measuredHeight]);

  // Animate open/close
  React.useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, SPRING_CONFIG);
  }, [isOpen]);

  const onLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    // Only accept heights LARGER than current measurement
    // This prevents accepting small heights from lingering collapse animation
    if (isOpenRef.current && h > 0 && h > measuredHeight) {
      setMeasuredHeight(h);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (heightValue.value === 0) {
      // Not measured yet - show full height so onLayout can measure
      return { overflow: 'hidden' as const };
    }

    return {
      height: interpolate(
        progress.value,
        [0, 1],
        [0, heightValue.value],
        Extrapolation.CLAMP
      ),
      overflow: 'hidden' as const,
    };
  });

  // Don't render until first opened
  if (!hasBeenOpened.current) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <View
        onLayout={onLayout}
        style={[
          styles.content,
          {
            // Fix height after measurement to prevent text reflow during animation
            height: measuredHeight > 0 ? measuredHeight : undefined,
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
    marginRight: 8,
  },
  content: {},
});
