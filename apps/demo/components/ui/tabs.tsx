/**
 * Tabs
 *
 * A tabbed navigation component with animated indicator.
 * Supports both controlled and uncontrolled modes.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Account</TabsTrigger>
 *     <TabsTrigger value="tab2">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">
 *     <Text>Account content</Text>
 *   </TabsContent>
 *   <TabsContent value="tab2">
 *     <Text>Settings content</Text>
 *   </TabsContent>
 * </Tabs>
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@nativeui/core';
import { haptic } from '@nativeui/core';

// Context
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Tabs Root
export interface TabsProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Children */
  children: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
}

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={[styles.container, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

// TabsList Context for indicator
interface TabsListContextValue {
  registerTab: (value: string, layout: LayoutRectangle) => void;
  tabLayouts: Map<string, LayoutRectangle>;
}

const TabsListContext = createContext<TabsListContextValue | null>(null);

// TabsList
export interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsList({ children, style }: TabsListProps) {
  const { colors, radius } = useTheme();
  const { value } = useTabsContext();
  const tabLayouts = useRef(new Map<string, LayoutRectangle>()).current;

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const registerTab = useCallback(
    (tabValue: string, layout: LayoutRectangle) => {
      tabLayouts.set(tabValue, layout);

      // Update indicator if this is the active tab
      if (tabValue === value) {
        indicatorX.value = withSpring(layout.x, { damping: 20, stiffness: 200 });
        indicatorWidth.value = withSpring(layout.width, {
          damping: 20,
          stiffness: 200,
        });
      }
    },
    [value, tabLayouts]
  );

  // Update indicator when value changes
  useEffect(() => {
    const layout = tabLayouts.get(value);
    if (layout) {
      indicatorX.value = withSpring(layout.x, { damping: 20, stiffness: 200 });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [value, tabLayouts]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <TabsListContext.Provider value={{ registerTab, tabLayouts }}>
      <View
        style={[
          styles.list,
          {
            backgroundColor: colors.backgroundMuted,
            borderRadius: radius.lg,
            padding: 4,
          },
          style,
        ]}
      >
        {children}
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: colors.background,
              borderRadius: radius.md,
              height: '100%',
            },
            indicatorStyle,
          ]}
        />
      </View>
    </TabsListContext.Provider>
  );
}

// TabsTrigger
export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TabsTrigger({
  value: tabValue,
  children,
  disabled = false,
  style,
  textStyle,
}: TabsTriggerProps) {
  const { colors, spacing } = useTheme();
  const { value, onValueChange } = useTabsContext();
  const listContext = useContext(TabsListContext);
  const isActive = value === tabValue;

  const handleLayout = (event: LayoutChangeEvent) => {
    listContext?.registerTab(tabValue, event.nativeEvent.layout);
  };

  const handlePress = () => {
    if (disabled) return;
    haptic('selection');
    onValueChange(tabValue);
  };

  return (
    <Pressable
      style={[
        styles.trigger,
        {
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[3],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onLayout={handleLayout}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
    >
      <Text
        style={[
          styles.triggerText,
          {
            color: isActive ? colors.foreground : colors.foregroundMuted,
            fontWeight: isActive ? '600' : '500',
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

// TabsContent
export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsContent({ value: tabValue, children, style }: TabsContentProps) {
  const { value } = useTabsContext();
  const { spacing } = useTheme();

  if (value !== tabValue) {
    return null;
  }

  return (
    <View style={[styles.content, { marginTop: spacing[4] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  list: {
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  triggerText: {
    fontSize: 14,
  },
  content: {},
});
