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
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, haptic, TOOLTIP_CONSTANTS } from '@metacells/mcellui-core';

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

// Moved to TOOLTIP_CONSTANTS in @metacells/mcellui-core

// ─────────────────────────────────────────────────────────────────────────────
// Tooltip Component
// ─────────────────────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  position = 'top',
  delayMs = TOOLTIP_CONSTANTS.defaultDelay,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  maxWidth = TOOLTIP_CONSTANTS.defaultMaxWidth,
}: TooltipProps) {
  const { colors, radius, fontSize, platformShadow } = useTheme();

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
        opacity.value = withTiming(1, { duration: TOOLTIP_CONSTANTS.animationInDuration });
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      } else {
        opacity.value = withTiming(0, { duration: TOOLTIP_CONSTANTS.animationOutDuration });
        scale.value = withTiming(0.9, { duration: TOOLTIP_CONSTANTS.animationOutDuration });
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
    left = Math.max(TOOLTIP_CONSTANTS.margin, Math.min(left, SCREEN_WIDTH - tooltipSize.width - TOOLTIP_CONSTANTS.margin));

    // Calculate vertical position
    let actualPosition = position;
    let top: number;

    if (position === 'top') {
      top = triggerY - tooltipSize.height - TOOLTIP_CONSTANTS.arrowSize - 4;
      // If not enough space above, show below
      if (top < TOOLTIP_CONSTANTS.margin) {
        actualPosition = 'bottom';
        top = triggerY + triggerHeight + TOOLTIP_CONSTANTS.arrowSize + 4;
      }
    } else {
      top = triggerY + triggerHeight + TOOLTIP_CONSTANTS.arrowSize + 4;
      // If not enough space below, show above
      if (top + tooltipSize.height > SCREEN_HEIGHT - TOOLTIP_CONSTANTS.margin) {
        actualPosition = 'top';
        top = triggerY - tooltipSize.height - TOOLTIP_CONSTANTS.arrowSize - 4;
      }
    }

    return { top, left, actualPosition };
  }, [triggerLayout, tooltipSize, position]);

  const { top, left, actualPosition } = calculatePosition();

  // Calculate arrow position
  const arrowLeft = triggerLayout
    ? triggerLayout.x + triggerLayout.width / 2 - left - TOOLTIP_CONSTANTS.arrowSize
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
        const existingOnPressIn = childProps.onPressIn as ((e: GestureResponderEvent) => void) | undefined;
        const existingOnPressOut = childProps.onPressOut as ((e: GestureResponderEvent) => void) | undefined;

        return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          onPressIn: (e: GestureResponderEvent) => {
            startDelayTimer(effectiveDelay);
            existingOnPressIn?.(e);
          },
          onPressOut: (e: GestureResponderEvent) => {
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
                ...platformShadow('sm'),
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
                  left: Math.max(TOOLTIP_CONSTANTS.arrowSize, Math.min(arrowLeft, maxWidth - TOOLTIP_CONSTANTS.arrowSize * 3)),
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
                  paddingHorizontal: TOOLTIP_CONSTANTS.padding,
                  paddingVertical: TOOLTIP_CONSTANTS.padding - 4,
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
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: TOOLTIP_CONSTANTS.arrowSize,
    borderRightWidth: TOOLTIP_CONSTANTS.arrowSize,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowTop: {
    top: -TOOLTIP_CONSTANTS.arrowSize,
    borderBottomWidth: TOOLTIP_CONSTANTS.arrowSize,
  },
  arrowBottom: {
    bottom: -TOOLTIP_CONSTANTS.arrowSize,
    borderTopWidth: TOOLTIP_CONSTANTS.arrowSize,
  },
  content: {
    textAlign: 'center',
  },
});
