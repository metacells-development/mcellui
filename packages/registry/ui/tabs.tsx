/**
 * Tabs
 *
 * A tabbed navigation component with animated indicator.
 * Supports both controlled and uncontrolled modes.
 * Two visual variants: "pill" (segmented control) and "underline" (bottom border).
 *
 * @example
 * ```tsx
 * // Pill variant (default) - segmented control style
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
 *
 * // Underline variant - bottom border style (great for profiles)
 * <Tabs defaultValue="posts">
 *   <TabsList variant="underline">
 *     <TabsTrigger value="posts">Posts</TabsTrigger>
 *     <TabsTrigger value="media">Media</TabsTrigger>
 *     <TabsTrigger value="about">About</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="posts">...</TabsContent>
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
  useMemo,
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
import {
  useTheme,
  areAnimationsDisabled,
  tabsTokens,
  TABS_CONSTANTS,
} from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

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
export type TabsVariant = 'pill' | 'underline';

interface TabsListContextValue {
  registerTab: (value: string, layout: LayoutRectangle) => void;
  tabLayouts: Map<string, LayoutRectangle>;
  variant: TabsVariant;
}

const TabsListContext = createContext<TabsListContextValue | null>(null);

// TabsList
export interface TabsListProps {
  children: React.ReactNode;
  /** Visual variant: "pill" (segmented control) or "underline" (bottom border) */
  variant?: TabsVariant;
  style?: ViewStyle;
}

export function TabsList({ children, variant = 'pill', style }: TabsListProps) {
  const { colors, componentRadius } = useTheme();
  const { value } = useTabsContext();
  const tabLayouts = useRef(new Map<string, LayoutRectangle>()).current;
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const registerTab = useCallback(
    (tabValue: string, layout: LayoutRectangle) => {
      tabLayouts.set(tabValue, layout);

      // Update indicator if this is the active tab
      if (tabValue === value) {
        if (animationsEnabled) {
          indicatorX.value = withSpring(layout.x, TABS_CONSTANTS.spring);
          indicatorWidth.value = withSpring(layout.width, TABS_CONSTANTS.spring);
        } else {
          indicatorX.value = layout.x;
          indicatorWidth.value = layout.width;
        }
      }
    },
    [value, tabLayouts, animationsEnabled]
  );

  // Update indicator when value changes
  useEffect(() => {
    const layout = tabLayouts.get(value);
    if (layout) {
      if (animationsEnabled) {
        indicatorX.value = withSpring(layout.x, TABS_CONSTANTS.spring);
        indicatorWidth.value = withSpring(layout.width, TABS_CONSTANTS.spring);
      } else {
        indicatorX.value = layout.x;
        indicatorWidth.value = layout.width;
      }
    }
  }, [value, tabLayouts, animationsEnabled]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const isPill = variant === 'pill';

  return (
    <TabsListContext.Provider value={{ registerTab, tabLayouts, variant }}>
      <View
        style={[
          styles.list,
          isPill
            ? {
                backgroundColor: colors.backgroundMuted,
                borderRadius: componentRadius.tabs,
                padding: TABS_CONSTANTS.pillPadding,
              }
            : {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
          style,
        ]}
      >
        {children}
        <Animated.View
          style={[
            isPill ? styles.indicatorPill : styles.indicatorUnderline,
            isPill
              ? {
                  backgroundColor: colors.background,
                  borderRadius: componentRadius.tabsIndicator,
                }
              : {
                  backgroundColor: colors.primary,
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
  const { colors } = useTheme();
  const { value, onValueChange } = useTabsContext();
  const listContext = useContext(TabsListContext);
  const isActive = value === tabValue;
  const variant = listContext?.variant ?? 'pill';
  const isUnderline = variant === 'underline';

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
          paddingVertical: isUnderline
            ? tabsTokens.triggerUnderline.paddingVertical
            : tabsTokens.trigger.paddingVertical,
          paddingHorizontal: isUnderline
            ? tabsTokens.triggerUnderline.paddingHorizontal
            : tabsTokens.trigger.paddingHorizontal,
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
            color: isActive
              ? isUnderline
                ? colors.primary
                : colors.foreground
              : colors.foregroundMuted,
            fontWeight: isActive
              ? tabsTokens.trigger.activeFontWeight
              : tabsTokens.trigger.fontWeight,
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

  if (value !== tabValue) {
    return null;
  }

  return (
    <View style={[styles.content, { marginTop: tabsTokens.content.marginTop }, style]}>
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
  indicatorPill: {
    position: 'absolute',
    top: tabsTokens.indicator.pillTop,
    bottom: tabsTokens.indicator.pillBottom,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  indicatorUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: TABS_CONSTANTS.indicatorHeight,
  },
  trigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  triggerText: {
    fontSize: tabsTokens.trigger.fontSize,
  },
  content: {},
});
