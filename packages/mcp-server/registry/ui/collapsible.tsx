/**
 * Collapsible
 *
 * Simple single-item expand/collapse component.
 * Simpler alternative to Accordion for one-off collapsible sections.
 *
 * @example
 * ```tsx
 * // Uncontrolled (internal state)
 * <Collapsible defaultOpen>
 *   <CollapsibleTrigger>
 *     <Text>Click to toggle</Text>
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     <Text>Hidden content that expands</Text>
 *   </CollapsibleContent>
 * </Collapsible>
 *
 * // Controlled
 * const [open, setOpen] = useState(false);
 * <Collapsible open={open} onOpenChange={setOpen}>
 *   ...
 * </Collapsible>
 * ```
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
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
import { useTheme, areAnimationsDisabled } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Smooth spring config for natural feel
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

// Context
interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible provider');
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

// Collapsible Root
export interface CollapsibleProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disable the collapsible */
  disabled?: boolean;
  /** Children (CollapsibleTrigger and CollapsibleContent) */
  children: React.ReactNode;
  /** Additional container styles */
  style?: ViewStyle;
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  style,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange, disabled }}>
      <View style={style}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

// CollapsibleTrigger
export interface CollapsibleTriggerProps {
  /** Trigger content - can be custom or use default styling */
  children: React.ReactNode;
  /** Show chevron icon */
  showChevron?: boolean;
  /** Additional trigger styles */
  style?: ViewStyle;
  /** Render as child (for custom trigger components) */
  asChild?: boolean;
}

export function CollapsibleTrigger({
  children,
  showChevron = true,
  style,
  asChild = false,
}: CollapsibleTriggerProps) {
  const { colors, spacing } = useTheme();
  const { open, onOpenChange, disabled } = useCollapsibleContext();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const progress = useSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    if (animationsEnabled) {
      progress.value = withSpring(open ? 1 : 0, SPRING_CONFIG);
    } else {
      progress.value = open ? 1 : 0;
    }
  }, [open, animationsEnabled]);

  const handlePress = () => {
    if (disabled) return;
    haptic('selection');
    onOpenChange(!open);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  // If asChild, clone the child element with onClick handler
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: handlePress,
      disabled,
      accessibilityRole: 'button',
      accessibilityState: { expanded: open, disabled },
    });
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.trigger,
        {
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          backgroundColor: pressed ? colors.secondary : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
    >
      <View style={styles.triggerContent}>{children}</View>
      {showChevron && (
        <Animated.View style={chevronStyle}>
          <ChevronIcon color={colors.foregroundMuted} />
        </Animated.View>
      )}
    </Pressable>
  );
}

// CollapsibleContent
export interface CollapsibleContentProps {
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Force content to remain in DOM when closed (for forms) */
  forceMount?: boolean;
  /** Additional content styles */
  style?: ViewStyle;
}

export function CollapsibleContent({
  children,
  forceMount = false,
  style,
}: CollapsibleContentProps) {
  const { open } = useCollapsibleContext();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  // Track if we've ever been opened (for initial render optimization)
  const hasBeenOpened = React.useRef(open);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const heightValue = useSharedValue(0);
  const progress = useSharedValue(open ? 1 : 0);

  // Update ref synchronously before render logic
  if (open && !hasBeenOpened.current) {
    hasBeenOpened.current = true;
  }

  // Keep a ref to open for use in callbacks
  const isOpenRef = React.useRef(open);
  isOpenRef.current = open;

  // Sync measured height to shared value
  React.useEffect(() => {
    if (measuredHeight > 0) {
      heightValue.value = measuredHeight;
    }
  }, [measuredHeight]);

  // Animate open/close
  React.useEffect(() => {
    if (animationsEnabled) {
      progress.value = withSpring(open ? 1 : 0, SPRING_CONFIG);
    } else {
      progress.value = open ? 1 : 0;
    }
  }, [open, animationsEnabled]);

  const onLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    // Only accept heights LARGER than current measurement
    if (isOpenRef.current && h > 0 && h > measuredHeight) {
      setMeasuredHeight(h);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (heightValue.value === 0) {
      return { overflow: 'hidden' as const };
    }

    return {
      height: interpolate(
        progress.value,
        [0, 1],
        [0, heightValue.value],
        Extrapolation.CLAMP
      ),
      opacity: interpolate(
        progress.value,
        [0, 0.5, 1],
        [0, 0.5, 1],
        Extrapolation.CLAMP
      ),
      overflow: 'hidden' as const,
    };
  });

  // Don't render until first opened (unless forceMount)
  if (!hasBeenOpened.current && !forceMount) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <View
        onLayout={onLayout}
        style={[
          styles.content,
          {
            height: measuredHeight > 0 ? measuredHeight : undefined,
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerContent: {
    flex: 1,
    marginRight: 8,
  },
  content: {},
});
