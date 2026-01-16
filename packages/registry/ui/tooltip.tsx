/**
 * Tooltip
 *
 * Small popup that appears on long-press to show additional information.
 * Automatically positions itself above or below the trigger element.
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip content="This is helpful information">
 *   <Button>Long press me</Button>
 * </Tooltip>
 *
 * // With custom delay
 * <Tooltip content="Appears after 500ms" delayMs={500}>
 *   <IconButton icon={<InfoIcon />} />
 * </Tooltip>
 *
 * // Positioned below
 * <Tooltip content="I appear below" position="bottom">
 *   <Text>Long press me</Text>
 * </Tooltip>
 * ```
 */

import React, { useState, useRef, useCallback, Children, isValidElement, cloneElement } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, haptic } from '@nativeui/core';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TooltipPosition = 'top' | 'bottom';

export interface TooltipProps {
  /** Tooltip content text */
  content: string;
  /** Trigger element */
  children: React.ReactNode;
  /** Preferred position (auto-adjusts if not enough space) */
  position?: TooltipPosition;
  /** Delay before showing tooltip (ms) */
  delayMs?: number;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Maximum width of tooltip */
  maxWidth?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TOOLTIP_PADDING = 12;
const TOOLTIP_MARGIN = 8;
const ARROW_SIZE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// Tooltip Component
// ─────────────────────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  position = 'top',
  delayMs = 500,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  maxWidth = 250,
}: TooltipProps) {
  const { colors, radius, fontSize } = useTheme();

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }

      if (value) {
        opacity.value = withTiming(1, { duration: 150 });
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      } else {
        opacity.value = withTiming(0, { duration: 100 });
        scale.value = withTiming(0.9, { duration: 100 });
      }
    },
    [isControlled, onOpenChange, opacity, scale]
  );

  const showTooltip = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setTriggerLayout({ x, y, width, height });
        haptic('light');
        setOpen(true);
      });
    }
  }, [setOpen]);

  // Timer-based approach for showing tooltip after delay
  // Works consistently for both pressable and non-pressable components
  const startDelayTimer = useCallback((customDelay?: number) => {
    if (disabled) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const delay = customDelay ?? delayMs;
    timerRef.current = setTimeout(() => {
      showTooltip();
    }, delay);
  }, [disabled, delayMs, showTooltip]);

  const cancelDelayTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Calculate tooltip position
  const calculatePosition = useCallback((): {
    top: number;
    left: number;
    actualPosition: TooltipPosition;
  } => {
    if (!triggerLayout) {
      return { top: 0, left: 0, actualPosition: position };
    }

    const { x: triggerX, y: triggerY, width: triggerWidth, height: triggerHeight } = triggerLayout;

    // Center horizontally
    let left = triggerX + triggerWidth / 2 - tooltipSize.width / 2;

    // Clamp to screen bounds
    left = Math.max(TOOLTIP_MARGIN, Math.min(left, SCREEN_WIDTH - tooltipSize.width - TOOLTIP_MARGIN));

    // Calculate vertical position
    let actualPosition = position;
    let top: number;

    if (position === 'top') {
      top = triggerY - tooltipSize.height - ARROW_SIZE - 4;
      // If not enough space above, show below
      if (top < TOOLTIP_MARGIN) {
        actualPosition = 'bottom';
        top = triggerY + triggerHeight + ARROW_SIZE + 4;
      }
    } else {
      top = triggerY + triggerHeight + ARROW_SIZE + 4;
      // If not enough space below, show above
      if (top + tooltipSize.height > SCREEN_HEIGHT - TOOLTIP_MARGIN) {
        actualPosition = 'top';
        top = triggerY - tooltipSize.height - ARROW_SIZE - 4;
      }
    }

    return { top, left, actualPosition };
  }, [triggerLayout, tooltipSize, position]);

  const { top, left, actualPosition } = calculatePosition();

  // Calculate arrow position
  const arrowLeft = triggerLayout
    ? triggerLayout.x + triggerLayout.width / 2 - left - ARROW_SIZE
    : 0;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleTooltipLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = event.nativeEvent.layout;
      if (width !== tooltipSize.width || height !== tooltipSize.height) {
        setTooltipSize({ width, height });
      }
    },
    [tooltipSize]
  );

  // Render the trigger element
  const renderTrigger = () => {
    const child = Children.only(children);

    if (isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;

      // Check if child is a pressable component (has onPress or similar)
      const componentName = typeof child.type === 'function'
        ? ((child.type as any).displayName || child.type.name || '')
        : '';
      const isPressable =
        'onPress' in childProps ||
        'onLongPress' in childProps ||
        'onPressIn' in childProps ||
        child.type === Pressable ||
        ['Button', 'IconButton', 'Pressable', 'TouchableOpacity', 'TouchableHighlight'].includes(componentName);

      // IconButtons should show tooltip immediately (no delay) for better UX
      const isIconButton = componentName === 'IconButton';
      const effectiveDelay = isIconButton ? 0 : delayMs;

      if (isPressable) {
        // Clone and inject onPressIn/onPressOut for pressable components
        // Use timer-based approach for consistent delay behavior
        const existingOnPressIn = childProps.onPressIn as ((e: any) => void) | undefined;
        const existingOnPressOut = childProps.onPressOut as ((e: any) => void) | undefined;

        return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          onPressIn: (e: any) => {
            startDelayTimer(effectiveDelay);
            existingOnPressIn?.(e);
          },
          onPressOut: (e: any) => {
            cancelDelayTimer();
            existingOnPressOut?.(e);
          },
        });
      }
    }

    // For non-pressable elements, wrap in a View with touch handlers
    return (
      <View
        ref={triggerRef}
        collapsable={false}
        onTouchStart={() => startDelayTimer()}
        onTouchEnd={cancelDelayTimer}
        onTouchCancel={cancelDelayTimer}
      >
        {children}
      </View>
    );
  };

  return (
    <>
      {renderTrigger()}

      <Modal visible={isOpen} transparent animationType="none" statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Animated.View
            style={[
              styles.tooltip,
              {
                backgroundColor: colors.foreground,
                borderRadius: radius.md,
                maxWidth,
                top,
                left,
              },
              animatedStyle,
            ]}
            onLayout={handleTooltipLayout}
          >
            {/* Arrow */}
            <View
              style={[
                styles.arrow,
                actualPosition === 'top' ? styles.arrowBottom : styles.arrowTop,
                {
                  borderTopColor: actualPosition === 'top' ? colors.foreground : 'transparent',
                  borderBottomColor: actualPosition === 'bottom' ? colors.foreground : 'transparent',
                  left: Math.max(ARROW_SIZE, Math.min(arrowLeft, maxWidth - ARROW_SIZE * 3)),
                },
              ]}
            />

            {/* Content */}
            <Text
              style={[
                styles.content,
                {
                  color: colors.background,
                  fontSize: fontSize.sm,
                  paddingHorizontal: TOOLTIP_PADDING,
                  paddingVertical: TOOLTIP_PADDING - 4,
                },
              ]}
            >
              {content}
            </Text>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowTop: {
    top: -ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
  },
  arrowBottom: {
    bottom: -ARROW_SIZE,
    borderTopWidth: ARROW_SIZE,
  },
  content: {
    textAlign: 'center',
  },
});
