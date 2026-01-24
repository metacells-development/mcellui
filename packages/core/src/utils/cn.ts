/**
 * cn() - Class Name / Style Merger
 *
 * The core utility for merging styles in mcellui.
 * Inspired by shadcn/ui's cn() but adapted for React Native StyleSheet.
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;
type StyleInput = Style | Style[] | null | undefined | false;

/**
 * Merges multiple style objects into a single flattened style.
 * Handles undefined, null, false, and nested arrays.
 *
 * @example
 * ```tsx
 * const styles = cn(
 *   baseStyles.container,
 *   isActive && activeStyles,
 *   { padding: 16 }
 * );
 * ```
 */
export function cn(...inputs: StyleInput[]): Style {
  const styles: Style[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (Array.isArray(input)) {
      const flattened = StyleSheet.flatten(input);
      if (flattened) styles.push(flattened);
    } else {
      styles.push(input);
    }
  }

  return StyleSheet.flatten(styles);
}

/**
 * Creates a style object from conditional styles.
 * More explicit alternative to cn() for complex conditions.
 *
 * @example
 * ```tsx
 * const styles = mergeStyles({
 *   base: baseStyle,
 *   active: isActive && activeStyle,
 *   disabled: isDisabled && disabledStyle,
 * });
 * ```
 */
export function mergeStyles(styles: Record<string, StyleInput>): Style {
  return cn(...Object.values(styles));
}
