/**
 * Popover
 *
 * Positioned popup with interactive content.
 * Different from Tooltip - meant for interactive content, not just informational.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>
 *     <Button>Open Menu</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <Text>Menu content here</Text>
 *     <PopoverClose>
 *       <Button variant="ghost">Close</Button>
 *     </PopoverClose>
 *   </PopoverContent>
 * </Popover>
 * ```
 */

import React, { createContext, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  ViewStyle,
  LayoutRectangle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme, haptic, POPOVER_CONSTANTS } from '@metacells/mcellui-core';

// ============================================================================
// Types
// ============================================================================

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverProps {
  /** Whether popover is open (controlled) */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Children (PopoverTrigger and PopoverContent) */
  children: React.ReactNode;
}

export interface PopoverTriggerProps {
  /** Trigger element */
  children: React.ReactNode;
  /** Whether to prevent default action */
  asChild?: boolean;
}

export interface PopoverContentProps {
  /** Content to display */
  children: React.ReactNode;
  /** Position relative to trigger */
  position?: PopoverPosition;
  /** Alignment along the position axis */
  align?: PopoverAlign;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Container style */
  style?: ViewStyle;
  /** Max width of popover */
  maxWidth?: number;
}

export interface PopoverCloseProps {
  /** Close button element */
  children: React.ReactNode;
}

// ============================================================================
// Context
// ============================================================================

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: LayoutRectangle | null;
  setTriggerLayout: (layout: LayoutRectangle) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover');
  }
  return context;
}

// ============================================================================
// Popover Root
// ============================================================================

export function Popover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerLayout, setTriggerLayout }}>
      {children}
    </PopoverContext.Provider>
  );
}

// ============================================================================
// PopoverTrigger
// ============================================================================

export function PopoverTrigger({ children, asChild = true }: PopoverTriggerProps) {
  const { open, setOpen, setTriggerLayout } = usePopoverContext();
  const triggerRef = useRef<View>(null);

  const handlePress = () => {
    // Measure trigger position
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      haptic('light');
      setOpen(!open);
    });
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <View ref={triggerRef} collapsable={false}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onPress: handlePress,
        })}
      </View>
    );
  }

  return (
    <Pressable ref={triggerRef} onPress={handlePress}>
      {children}
    </Pressable>
  );
}

// ============================================================================
// PopoverContent
// ============================================================================

export function PopoverContent({
  children,
  position = 'bottom',
  align = 'center',
  offset = POPOVER_CONSTANTS.defaultOffset,
  style,
  maxWidth = POPOVER_CONSTANTS.defaultMaxWidth,
}: PopoverContentProps) {
  const { colors, radius, spacing } = useTheme();
  const { open, setOpen, triggerLayout } = usePopoverContext();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    if (open) {
      opacity.value = withTiming(1, { duration: POPOVER_CONSTANTS.animationInDuration });
      scale.value = withSpring(1, { damping: POPOVER_CONSTANTS.springDamping, stiffness: POPOVER_CONSTANTS.springStiffness });
    } else {
      opacity.value = withTiming(0, { duration: POPOVER_CONSTANTS.animationOutDuration });
      scale.value = withTiming(0.95, { duration: POPOVER_CONSTANTS.animationOutDuration });
    }
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleClose = () => {
    setOpen(false);
  };

  // Calculate position
  const getContentPosition = (): ViewStyle => {
    if (!triggerLayout) return {};

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const { x, y, width, height } = triggerLayout;

    let top: number | undefined;
    let left: number | undefined;

    // Calculate base position
    switch (position) {
      case 'top':
        top = y - offset;
        break;
      case 'bottom':
        top = y + height + offset;
        break;
      case 'left':
        left = x - offset;
        top = y;
        break;
      case 'right':
        left = x + width + offset;
        top = y;
        break;
    }

    // Calculate alignment for top/bottom
    if (position === 'top' || position === 'bottom') {
      switch (align) {
        case 'start':
          left = x;
          break;
        case 'center':
          left = x + width / 2 - maxWidth / 2;
          break;
        case 'end':
          left = x + width - maxWidth;
          break;
      }

      // Clamp to screen bounds
      if (left !== undefined) {
        left = Math.max(8, Math.min(left, screenWidth - maxWidth - 8));
      }
    }

    // Calculate alignment for left/right
    if (position === 'left' || position === 'right') {
      switch (align) {
        case 'start':
          top = y;
          break;
        case 'center':
          top = y + height / 2 - 50; // Approximate center
          break;
        case 'end':
          top = y + height - 100;
          break;
      }
    }

    return {
      position: 'absolute',
      top,
      left,
    };
  };

  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Animated.View
          style={[
            styles.content,
            {
              backgroundColor: colors.background,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[3],
              maxWidth,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
            getContentPosition(),
            animatedStyle,
            style,
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ============================================================================
// PopoverClose
// ============================================================================

export function PopoverClose({ children }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();

  const handlePress = () => {
    haptic('light');
    setOpen(false);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: handlePress,
    });
  }

  return (
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  content: {
    minWidth: POPOVER_CONSTANTS.minWidth,
  },
});
