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
// Textarea Component Tokens
// =============================================================================

export const textareaTokens = {
  sm: {
    minHeight: componentHeight.sm * 3,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
    fontSize: fontSize.base,
    lineHeight: 20,
    labelFontSize: fontSize.sm,
    helperFontSize: fontSize.xs,
  },
  md: {
    minHeight: componentHeight.md * 3,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2.5],
    borderWidth: 1,
    fontSize: fontSize.md,
    lineHeight: 22,
    labelFontSize: fontSize.base,
    helperFontSize: fontSize.sm,
  },
  lg: {
    minHeight: componentHeight.lg * 3,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    fontSize: fontSize.lg,
    lineHeight: 24,
    labelFontSize: fontSize.md,
    helperFontSize: fontSize.base,
  },
} as const;

// =============================================================================
// Select Component Tokens
// =============================================================================

export const selectTokens = {
  sm: {
    height: componentHeight.sm,
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    fontSize: fontSize.base,
    labelFontSize: fontSize.sm,
    helperFontSize: fontSize.xs,
    iconSize: iconSize.sm,
  },
  md: {
    height: componentHeight.md,
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    fontSize: fontSize.md,
    labelFontSize: fontSize.base,
    helperFontSize: fontSize.sm,
    iconSize: iconSize.md,
  },
  lg: {
    height: componentHeight.lg,
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    fontSize: fontSize.lg,
    labelFontSize: fontSize.md,
    helperFontSize: fontSize.base,
    iconSize: iconSize.lg,
  },
} as const;

// =============================================================================
// Slider Component Tokens
// =============================================================================

export const sliderTokens = {
  sm: {
    trackHeight: 4,
    thumbSize: 16,
    labelFontSize: fontSize.base,
    valueFontSize: fontSize.base,
  },
  md: {
    trackHeight: 6,
    thumbSize: 20,
    labelFontSize: fontSize.md,
    valueFontSize: fontSize.md,
  },
  lg: {
    trackHeight: 8,
    thumbSize: 24,
    labelFontSize: fontSize.lg,
    valueFontSize: fontSize.lg,
  },
} as const;

// =============================================================================
// Stepper Component Tokens
// =============================================================================

export const stepperTokens = {
  sm: {
    height: componentHeight.sm,
    buttonWidth: 32,
    valueWidth: 40,
    fontSize: fontSize.base,
    iconSize: iconSize.sm,
    labelFontSize: fontSize.base,
  },
  md: {
    height: componentHeight.md,
    buttonWidth: 40,
    valueWidth: 48,
    fontSize: fontSize.md,
    iconSize: iconSize.md,
    labelFontSize: fontSize.md,
  },
  lg: {
    height: componentHeight.lg,
    buttonWidth: 48,
    valueWidth: 56,
    fontSize: fontSize.lg,
    iconSize: iconSize.lg,
    labelFontSize: fontSize.lg,
  },
} as const;

// =============================================================================
// Radio Component Tokens
// =============================================================================

export const radioTokens = {
  sm: {
    outerSize: 16,
    innerSize: 8,
    borderWidth: 2,
    labelFontSize: fontSize.base,
    descriptionFontSize: fontSize.sm,
    gap: spacing[2],
  },
  md: {
    outerSize: 20,
    innerSize: 10,
    borderWidth: 2,
    labelFontSize: fontSize.md,
    descriptionFontSize: fontSize.base,
    gap: spacing[2.5],
  },
  lg: {
    outerSize: 24,
    innerSize: 12,
    borderWidth: 2,
    labelFontSize: fontSize.lg,
    descriptionFontSize: fontSize.md,
    gap: spacing[3],
  },
} as const;

// =============================================================================
// TagInput Component Tokens
// =============================================================================

export const tagInputTokens = {
  sm: {
    minHeight: componentHeight.sm,
    padding: spacing[2],
    tagHeight: 24,
    tagFontSize: fontSize.xs,
    inputFontSize: fontSize.base,
    labelFontSize: fontSize.sm,
    helperFontSize: fontSize.xs,
    gap: spacing[1],
  },
  md: {
    minHeight: componentHeight.md,
    padding: spacing[3],
    tagHeight: 28,
    tagFontSize: fontSize.sm,
    inputFontSize: fontSize.md,
    labelFontSize: fontSize.base,
    helperFontSize: fontSize.sm,
    gap: spacing[1.5],
  },
  lg: {
    minHeight: componentHeight.lg,
    padding: spacing[4],
    tagHeight: 32,
    tagFontSize: fontSize.base,
    inputFontSize: fontSize.lg,
    labelFontSize: fontSize.md,
    helperFontSize: fontSize.base,
    gap: spacing[2],
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
// Overlay Typography Tokens (Dialog, AlertDialog, Sheet)
// =============================================================================

export const overlayTypography = {
  title: {
    fontSize: fontSize.lg,     // 18
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
  },
  description: {
    fontSize: fontSize.base,   // 14
    fontWeight: fontWeight.normal,
    lineHeight: 20,
  },
} as const;

// =============================================================================
// Export all component tokens
// =============================================================================

export const components = {
  button: buttonTokens,
  input: inputTokens,
  textarea: textareaTokens,
  select: selectTokens,
  slider: sliderTokens,
  stepper: stepperTokens,
  checkbox: checkboxTokens,
  switch: switchTokens,
  radio: radioTokens,
  tagInput: tagInputTokens,
  badge: badgeTokens,
  avatar: avatarTokens,
  card: cardTokens,
  overlayTypography,
  height: componentHeight,
  icon: iconSize,
} as const;

export type ComponentSize = 'sm' | 'md' | 'lg';
