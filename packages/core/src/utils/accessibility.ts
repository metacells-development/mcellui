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
 * Creates accessibility props for a button
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
 * Creates accessibility props for a checkbox/switch
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
 * Creates accessibility props for a link
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
 * Creates accessibility props for an image
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
 * Creates accessibility props for a heading
 */
export function headingA11y(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
  };
}
