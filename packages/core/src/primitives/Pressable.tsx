/**
 * Pressable Primitive
 *
 * Enhanced Pressable with:
 * - Built-in haptic feedback
 * - Reduce motion support
 * - Configurable press states
 */

import React, { useCallback } from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  ViewStyle,
  AccessibilityInfo,
} from 'react-native';
import { haptic } from '../utils/haptics';

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  /**
   * Style or style function receiving pressed state
   */
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle);

  /**
   * Haptic feedback style on press
   * @default 'light'
   */
  hapticStyle?: 'none' | 'light' | 'medium' | 'heavy' | 'selection';

  /**
   * Opacity when pressed
   * @default 0.7
   */
  pressedOpacity?: number;

  /**
   * Scale when pressed (respects reduce motion)
   * @default 1
   */
  pressedScale?: number;
}

export const Pressable = React.forwardRef<
  React.ElementRef<typeof RNPressable>,
  PressableProps
>(
  (
    {
      style,
      hapticStyle = 'light',
      pressedOpacity = 0.7,
      pressedScale = 1,
      onPressIn,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [reduceMotion, setReduceMotion] = React.useState(false);

    React.useEffect(() => {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotion
      );
      return () => subscription.remove();
    }, []);

    const handlePressIn = useCallback(
      (event: Parameters<NonNullable<RNPressableProps['onPressIn']>>[0]) => {
        if (hapticStyle !== 'none') {
          haptic(hapticStyle === 'selection' ? 'selection' : hapticStyle);
        }
        onPressIn?.(event);
      },
      [hapticStyle, onPressIn]
    );

    const getStyle = useCallback(
      ({ pressed }: { pressed: boolean }): ViewStyle => {
        const baseStyle = typeof style === 'function' ? style({ pressed }) : style;
        const pressedStyle: ViewStyle = pressed
          ? {
              opacity: pressedOpacity,
              transform: reduceMotion ? undefined : [{ scale: pressedScale }],
            }
          : {};

        return {
          ...baseStyle,
          ...pressedStyle,
        };
      },
      [style, pressedOpacity, pressedScale, reduceMotion]
    );

    return (
      <RNPressable
        ref={ref}
        style={getStyle}
        onPressIn={handlePressIn}
        disabled={disabled}
        {...props}
      >
        {children}
      </RNPressable>
    );
  }
);

Pressable.displayName = 'Pressable';
