/**
 * Slot Primitive
 *
 * Merges its props with its immediate child, similar to Radix UI's Slot.
 * Enables flexible composition patterns where a component can either
 * render its default element or forward props to a custom child.
 *
 * Usage:
 * <Slot style={slotStyle} onPress={handlePress}>
 *   <Pressable style={childStyle}>Content</Pressable>
 * </Slot>
 *
 * Result: Pressable receives merged style and both onPress handlers
 */

import React, { Children, isValidElement, cloneElement } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

// --- Types ---

type AnyProps = Record<string, unknown>;

export interface SlotProps {
  children: React.ReactNode;
  /**
   * Additional props to merge with the child
   */
  [key: string]: unknown;
}

export interface SlottableProps {
  /**
   * When true, renders as Slot (forwarding props to child)
   * When false/undefined, renders as the component's default element
   */
  asChild?: boolean;
  children?: React.ReactNode;
}

// --- Utilities ---

/**
 * Merges multiple style props into one
 */
function mergeStyles(
  ...styles: (StyleProp<ViewStyle | TextStyle> | undefined)[]
): StyleProp<ViewStyle | TextStyle> {
  return styles.filter(Boolean) as StyleProp<ViewStyle | TextStyle>;
}

/**
 * Merges multiple event handlers into one that calls all of them
 */
function mergeHandlers<T extends (...args: unknown[]) => void>(
  ...handlers: (T | undefined)[]
): T | undefined {
  const validHandlers = handlers.filter(Boolean) as T[];
  if (validHandlers.length === 0) return undefined;
  if (validHandlers.length === 1) return validHandlers[0];

  return ((...args: unknown[]) => {
    validHandlers.forEach((handler) => handler(...args));
  }) as T;
}

/**
 * Checks if a prop is an event handler (starts with 'on' + capital letter)
 */
function isEventHandler(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

/**
 * Merges slot props with child props
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === 'style') {
      // Merge styles
      merged[key] = mergeStyles(
        slotValue as StyleProp<ViewStyle>,
        childValue as StyleProp<ViewStyle>
      );
    } else if (key === 'className') {
      // Merge classNames (for NativeWind)
      merged[key] = [childValue, slotValue].filter(Boolean).join(' ');
    } else if (isEventHandler(key)) {
      // Merge event handlers
      merged[key] = mergeHandlers(
        slotValue as (() => void) | undefined,
        childValue as (() => void) | undefined
      );
    } else if (childValue === undefined) {
      // Only use slot value if child doesn't define it
      merged[key] = slotValue;
    }
    // Otherwise, child props take precedence
  }

  return merged;
}

// --- Components ---

/**
 * Slot component that forwards props to its single child.
 * The child receives merged props (styles combined, handlers chained).
 */
export const Slot = React.forwardRef<unknown, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      console.warn('Slot: Expected a single valid React element as child');
      return null;
    }

    const childProps = child.props as AnyProps;
    const mergedProps = mergeProps(slotProps, childProps);

    // Handle ref forwarding
    const childRef = (child as { ref?: React.Ref<unknown> }).ref;
    const ref = forwardedRef
      ? composeRefs(forwardedRef, childRef)
      : childRef;

    return cloneElement(child, {
      ...mergedProps,
      ref,
    } as AnyProps);
  }
);

Slot.displayName = 'Slot';

/**
 * Helper component for conditional slot rendering.
 * Use with asChild prop pattern.
 */
export function Slottable({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

Slottable.displayName = 'Slottable';

// --- Ref Utilities ---

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Composes multiple refs into a single ref callback
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

/**
 * Hook to compose refs
 */
export function useComposedRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  return React.useCallback(composeRefs(...refs), refs);
}
