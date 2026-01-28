/**
 * Accessibility Utilities
 *
 * Helpers for building accessible components
 */

import { AccessibilityRole, AccessibilityState } from 'react-native';

export interface A11yProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
}

/**
 * Creates accessibility props for a button.
 *
 * @param label - Accessible label for the button
 * @param options - Optional button state (hint, disabled, selected)
 * @returns Accessibility props to spread onto component
 *
 * @example
 * ```tsx
 * <Pressable {...buttonA11y('Submit', { disabled: isLoading })} />
 * ```
 */
export function buttonA11y(
  label: string,
  options?: {
    hint?: string;
    disabled?: boolean;
    selected?: boolean;
  }
): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      disabled: options?.disabled,
      selected: options?.selected,
    },
  };
}

/**
 * Creates accessibility props for a checkbox/switch.
 *
 * @param label - Accessible label for the toggle
 * @param checked - Whether the toggle is checked
 * @param options - Optional toggle state (hint, disabled)
 * @returns Accessibility props to spread onto component
 *
 * @example
 * ```tsx
 * <Pressable {...toggleA11y('Dark Mode', isDark, { disabled: false })} />
 * ```
 */
export function toggleA11y(
  label: string,
  checked: boolean,
  options?: {
    hint?: string;
    disabled?: boolean;
  }
): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      checked,
      disabled: options?.disabled,
    },
  };
}

/**
 * Creates accessibility props for a link.
 *
 * @param label - Accessible label for the link
 * @param options - Optional hint text
 * @returns Accessibility props to spread onto component
 *
 * @example
 * ```tsx
 * <Pressable {...linkA11y('View Details', { hint: 'Opens product page' })} />
 * ```
 */
export function linkA11y(
  label: string,
  options?: {
    hint?: string;
  }
): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'link',
    accessibilityLabel: label,
    accessibilityHint: options?.hint ?? 'Double tap to open',
  };
}

/**
 * Creates accessibility props for an image.
 *
 * @param label - Accessible label describing the image
 * @param options - Optional decorative flag (hides from screen readers)
 * @returns Accessibility props to spread onto Image component
 *
 * @example
 * ```tsx
 * <Image {...imageA11y('Profile photo')} />
 * <Image {...imageA11y('', { decorative: true })} />
 * ```
 */
export function imageA11y(
  label: string,
  options?: {
    decorative?: boolean;
  }
): A11yProps {
  if (options?.decorative) {
    return {
      accessible: false,
      accessibilityLabel: undefined,
    };
  }

  return {
    accessible: true,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  };
}

/**
 * Creates accessibility props for a heading.
 *
 * @param label - Accessible label for the heading
 * @returns Accessibility props to spread onto Text component
 *
 * @example
 * ```tsx
 * <Text {...headingA11y('Dashboard')} style={typography.h1}>Dashboard</Text>
 * ```
 */
export function headingA11y(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
  };
}
