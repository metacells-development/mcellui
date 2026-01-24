/**
 * Component Tokens
 *
 * Size and proportion tokens for all components.
 * Change these to globally adjust component dimensions.
 *
 * Each component has sm/md/lg size variants with consistent
 * heights, padding, and typography.
 */

import { spacing } from './spacing';
import { fontSize, fontWeight } from './typography';

// =============================================================================
// Component Heights
// =============================================================================

/**
 * Standard heights for interactive components.
 * Based on touch target guidelines (minimum 44px).
 */
export const componentHeight = {
  /** Small: 32px */
  sm: 32,
  /** Medium: 44px (iOS recommended minimum) */
  md: 44,
  /** Large: 52px */
  lg: 52,
} as const;

// =============================================================================
// Icon Sizes
// =============================================================================

export const iconSize = {
  /** Extra small: 12px */
  xs: 12,
  /** Small: 16px */
  sm: 16,
  /** Medium: 20px */
  md: 20,
  /** Large: 24px */
  lg: 24,
  /** Extra large: 32px */
  xl: 32,
} as const;

// =============================================================================
// Button Component Tokens
// =============================================================================

export const buttonTokens = {
  sm: {
    height: componentHeight.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    iconSize: iconSize.sm,
    gap: spacing[1.5],
  },
  md: {
    height: componentHeight.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    iconSize: iconSize.md,
    gap: spacing[2],
  },
  lg: {
    height: componentHeight.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3.5],
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    iconSize: iconSize.lg,
    gap: spacing[2.5],
  },
} as const;

// =============================================================================
// Input Component Tokens
// =============================================================================

export const inputTokens = {
  sm: {
    height: componentHeight.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderWidth: 1,
    fontSize: fontSize.base,
    labelFontSize: fontSize.sm,
    helperFontSize: fontSize.xs,
    iconSize: iconSize.sm,
  },
  md: {
    height: componentHeight.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2.5],
    borderWidth: 1,
    fontSize: fontSize.md,
    labelFontSize: fontSize.base,
    helperFontSize: fontSize.sm,
    iconSize: iconSize.md,
  },
  lg: {
    height: componentHeight.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    fontSize: fontSize.lg,
    labelFontSize: fontSize.md,
    helperFontSize: fontSize.base,
    iconSize: iconSize.lg,
  },
} as const;

// =============================================================================
// Checkbox Component Tokens
// =============================================================================

export const checkboxTokens = {
  sm: {
    size: 18,
    borderWidth: 2,
    iconSize: 12,
    labelFontSize: fontSize.base,
    gap: spacing[2],
  },
  md: {
    size: 22,
    borderWidth: 2,
    iconSize: 14,
    labelFontSize: fontSize.md,
    gap: spacing[2.5],
  },
  lg: {
    size: 26,
    borderWidth: 2,
    iconSize: 18,
    labelFontSize: fontSize.lg,
    gap: spacing[3],
  },
} as const;

// =============================================================================
// Switch Component Tokens
// =============================================================================

export const switchTokens = {
  sm: {
    trackWidth: 40,
    trackHeight: 24,
    thumbSize: 20,
    thumbOffset: 2,
    labelFontSize: fontSize.base,
    gap: spacing[3],
  },
  md: {
    trackWidth: 50,
    trackHeight: 30,
    thumbSize: 26,
    thumbOffset: 2,
    labelFontSize: fontSize.md,
    gap: spacing[3],
  },
  lg: {
    trackWidth: 60,
    trackHeight: 36,
    thumbSize: 32,
    thumbOffset: 2,
    labelFontSize: fontSize.lg,
    gap: spacing[4],
  },
} as const;

// =============================================================================
// Badge Component Tokens
// =============================================================================

export const badgeTokens = {
  sm: {
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  md: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[0.5],
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  lg: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
} as const;

// =============================================================================
// Avatar Component Tokens
// =============================================================================

export const avatarTokens = {
  xs: {
    size: 24,
    fontSize: fontSize['2xs'],
    fontWeight: fontWeight.semibold,
  },
  sm: {
    size: 32,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  md: {
    size: 40,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  lg: {
    size: 56,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  xl: {
    size: 80,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
} as const;

// =============================================================================
// Card Component Tokens
// =============================================================================

export const cardTokens = {
  borderWidth: 1,
  padding: spacing[4],
  headerPadding: spacing[4],
  contentPadding: spacing[4],
  footerPadding: spacing[4],
  gap: spacing[2],
  titleFontSize: fontSize.lg,
  titleFontWeight: fontWeight.semibold,
  descriptionFontSize: fontSize.base,
} as const;

// =============================================================================
// Export all component tokens
// =============================================================================

export const components = {
  button: buttonTokens,
  input: inputTokens,
  checkbox: checkboxTokens,
  switch: switchTokens,
  badge: badgeTokens,
  avatar: avatarTokens,
  card: cardTokens,
  height: componentHeight,
  icon: iconSize,
} as const;

export type ComponentSize = 'sm' | 'md' | 'lg';
