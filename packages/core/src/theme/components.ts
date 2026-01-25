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
// IconButton Component Tokens
// =============================================================================

export const iconButtonTokens = {
  sm: {
    size: 32,
    iconSize: iconSize.sm,
  },
  md: {
    size: 40,
    iconSize: iconSize.md,
  },
  lg: {
    size: 48,
    iconSize: iconSize.lg,
  },
  xl: {
    size: 56,
    iconSize: 28,
  },
} as const;

// =============================================================================
// FAB Component Tokens
// =============================================================================

export const fabTokens = {
  sm: {
    size: 40,
    iconSize: 18,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing[3],
    fontWeight: fontWeight.semibold,
  },
  md: {
    size: 56,
    iconSize: iconSize.lg,
    fontSize: fontSize.base,
    paddingHorizontal: spacing[4],
    fontWeight: fontWeight.semibold,
  },
  lg: {
    size: 72,
    iconSize: iconSize.xl,
    fontSize: fontSize.md,
    paddingHorizontal: spacing[5],
    fontWeight: fontWeight.semibold,
  },
} as const;

// =============================================================================
// SegmentedControl Component Tokens
// =============================================================================

export const segmentedControlTokens = {
  sm: {
    height: componentHeight.sm,
    fontSize: fontSize.sm,
    padding: 4,
    fontWeight: fontWeight.medium,
    activeFontWeight: fontWeight.semibold,
  },
  md: {
    height: 40,
    fontSize: fontSize.base,
    padding: 4,
    fontWeight: fontWeight.medium,
    activeFontWeight: fontWeight.semibold,
  },
  lg: {
    height: 48,
    fontSize: fontSize.md,
    padding: 4,
    fontWeight: fontWeight.medium,
    activeFontWeight: fontWeight.semibold,
  },
} as const;

// =============================================================================
// ActionSheet Component Tokens
// =============================================================================

export const actionSheetTokens = {
  item: {
    height: componentHeight.lg,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    iconSize: iconSize.md,
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  header: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  cancel: {
    height: componentHeight.lg,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
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
// Chip Component Tokens
// =============================================================================

export const chipTokens = {
  sm: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    fontSize: fontSize.sm,
    iconSize: iconSize.sm,
  },
  md: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[1.5],
    fontSize: fontSize.base,
    iconSize: iconSize.sm,
  },
  lg: {
    paddingHorizontal: spacing[5],  // closest to 18 (was 4.5)
    paddingVertical: spacing[2],
    fontSize: fontSize.md,
    iconSize: iconSize.md,
  },
} as const;

// =============================================================================
// Label Component Tokens
// =============================================================================

export const labelTokens = {
  sm: {
    fontSize: fontSize.sm,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
  },
  md: {
    fontSize: fontSize.base,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
  },
  lg: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontWeight: fontWeight.medium,
  },
} as const;

// =============================================================================
// Rating Component Tokens
// =============================================================================

export const ratingTokens = {
  sm: {
    starSize: 18,
    gap: spacing[0.5],
  },
  md: {
    starSize: 26,
    gap: spacing[1],
  },
  lg: {
    starSize: 34,
    gap: spacing[1.5],
  },
} as const;

// =============================================================================
// AvatarStack Component Tokens
// =============================================================================

export const avatarStackTokens = {
  sm: {
    size: 28,
    fontSize: fontSize['2xs'],
    borderWidth: 2,
  },
  md: {
    size: 36,
    fontSize: fontSize.sm,
    borderWidth: 2,
  },
  lg: {
    size: 44,
    fontSize: fontSize.base,
    borderWidth: 3,
  },
  xl: {
    size: 56,
    fontSize: fontSize.lg,
    borderWidth: 3,
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
// Spinner Component Tokens
// =============================================================================

export const spinnerTokens = {
  sm: {
    containerSize: 16,
    indicatorSize: 'small' as const,
  },
  md: {
    containerSize: 24,
    indicatorSize: 'small' as const,
  },
  lg: {
    containerSize: 36,
    indicatorSize: 'large' as const,
  },
} as const;

// =============================================================================
// Skeleton Component Tokens
// =============================================================================

export const skeletonTokens = {
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  animation: {
    duration: 1500,
    minOpacity: 0.3,
    maxOpacity: 0.6,
  },
  text: {
    defaultLines: 3,
    defaultGap: 8,
    defaultLineHeight: 16,
    lastLineWidth: '60%',
  },
} as const;

// =============================================================================
// Progress Component Tokens
// =============================================================================

export const progressTokens = {
  sm: {
    height: 4,
  },
  md: {
    height: 8,
  },
  lg: {
    height: 12,
  },
  animation: {
    determinateDuration: 300,
    indeterminateDuration: 1000,
  },
} as const;

// =============================================================================
// CircularProgress Component Tokens
// =============================================================================

export const circularProgressTokens = {
  sm: {
    size: 40,
    strokeWidth: 4,
    labelSize: 10,
  },
  md: {
    size: 64,
    strokeWidth: 6,
    labelSize: 14,
  },
  lg: {
    size: 96,
    strokeWidth: 8,
    labelSize: 20,
  },
  animation: {
    rotationDuration: 1200,
    springDamping: 20,
    springStiffness: 100,
  },
} as const;

// =============================================================================
// List Component Tokens
// =============================================================================

/**
 * List component constants for consistent dimensions.
 * dividerInset = iconSize (24) + leftSlot marginRight (spacing[3] = 12) + container paddingHorizontal (spacing[4] = 16) = 52
 * Using spacing[14] (56) for standard iOS list inset pattern.
 */
export const LIST_CONSTANTS = {
  /** Standard divider inset (aligns with icon + text layout) */
  dividerInset: spacing[14], // 56px - matches iOS standard
  /** Default list item min height */
  itemMinHeight: componentHeight.lg, // 52px
  /** Legacy minHeight for backwards compatibility (thumbnail variant fallback) */
  legacyMinHeight: 56,
} as const;

export const listTokens = {
  divider: {
    inset: LIST_CONSTANTS.dividerInset,
  },
  item: {
    minHeight: LIST_CONSTANTS.itemMinHeight,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    iconSize: iconSize.lg,
    iconMargin: spacing[3],
  },
} as const;

// =============================================================================
// Tabs Component Tokens
// =============================================================================

export const TABS_CONSTANTS = {
  /** Indicator animation spring config */
  spring: { damping: 20, stiffness: 200 },
  /** Indicator height for underline variant */
  indicatorHeight: 2,
  /** Container padding for pill variant */
  pillPadding: 4,
} as const;

export const tabsTokens = {
  trigger: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    activeFontWeight: fontWeight.semibold,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  triggerUnderline: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  content: {
    marginTop: spacing[4],
  },
  indicator: {
    pillTop: 4,
    pillBottom: 4,
    underlineHeight: TABS_CONSTANTS.indicatorHeight,
  },
} as const;

// =============================================================================
// Accordion Component Tokens
// =============================================================================

export const ACCORDION_CONSTANTS = {
  /** Spring animation config for smooth expand/collapse */
  spring: { damping: 20, stiffness: 200, mass: 0.5 },
  /** Chevron icon size */
  chevronSize: 16,
} as const;

export const accordionTokens = {
  trigger: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    iconMargin: spacing[2],
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  item: {
    borderWidth: 1,
  },
} as const;

// =============================================================================
// Collapsible Component Tokens
// =============================================================================

export const COLLAPSIBLE_CONSTANTS = {
  /** Spring animation config (same as accordion for consistency) */
  spring: { damping: 20, stiffness: 200, mass: 0.5 },
  /** Chevron icon size */
  chevronSize: 16,
} as const;

export const collapsibleTokens = {
  trigger: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    iconMargin: spacing[2],
  },
} as const;

// =============================================================================
// Carousel Component Tokens
// =============================================================================

export const CAROUSEL_CONSTANTS = {
  /** Default autoplay interval in ms */
  autoplayInterval: 4000,
  /** Scroll event throttle (16ms = 60fps) */
  scrollEventThrottle: 16,
} as const;

export const carouselTokens = {
  indicator: {
    dotSize: 8,
    dotActiveWidth: 24,
    dotActiveScale: 1,
    dotInactiveScale: 0.8,
    dotInactiveOpacity: 0.4,
    gap: spacing[1.5],
    paddingVertical: spacing[2],
  },
  lineIndicator: {
    activeWidth: 24,
    inactiveWidth: 8,
  },
} as const;

// =============================================================================
// SwipeableRow Component Tokens
// =============================================================================

export const SWIPEABLE_ROW_CONSTANTS = {
  /** Default action button width */
  actionWidth: 80,
  /** Spring animation config */
  spring: { damping: 20, stiffness: 200 },
  /** Velocity threshold for snap decision (px/s) */
  velocityThreshold: 500,
  /** Full swipe trigger ratio (0.5 = 50% of screen width) */
  fullSwipeRatio: 0.5,
  /** Resistance factor when overswiping */
  resistanceFactor: 0.3,
} as const;

export const swipeableRowTokens = {
  action: {
    width: SWIPEABLE_ROW_CONSTANTS.actionWidth,
    paddingHorizontal: spacing[2],
    iconMargin: spacing[1],
    labelFontSize: fontSize.xs,
    labelFontWeight: fontWeight.semibold,
  },
} as const;

// =============================================================================
// Auth Block Tokens (Login, Signup)
// =============================================================================

export const authBlockTokens = {
  header: {
    titleFontSize: fontSize['2xl'],    // 28 - matches existing
    titleFontWeight: fontWeight.bold,
    subtitleFontSize: fontSize.md,     // 16
  },
  form: {
    forgotLinkFontSize: fontSize.base, // 14
    forgotLinkFontWeight: fontWeight.medium,
    passwordHintFontSize: fontSize.xs, // 12
  },
  divider: {
    fontSize: fontSize.base,           // 14
  },
  footer: {
    textFontSize: fontSize.base,       // 14
    linkFontSize: fontSize.base,       // 14
    linkFontWeight: fontWeight.semibold,
  },
  social: {
    gap: spacing[3],
  },
} as const;

// =============================================================================
// State Block Tokens (Empty State, Error State)
// =============================================================================

export const stateBlockTokens = {
  default: {
    titleFontSize: fontSize.xl,        // 20
    descriptionFontSize: fontSize.md,  // 15
    iconContainerSize: 80,
    iconContainerRadius: 40,
  },
  compact: {
    titleFontSize: fontSize.lg,        // 18
    descriptionFontSize: fontSize.base,// 14
    iconContainerSize: 64,
    iconContainerRadius: 32,
  },
  error: {
    iconContainerSize: 88,
    iconContainerRadius: 44,
    iconContainerSizeCompact: 72,
    iconContainerRadiusCompact: 36,
    codeFontSize: fontSize.xs,         // 12
  },
  typography: {
    titleFontWeight: fontWeight.semibold,
  },
} as const;

// =============================================================================
// Profile Block Tokens
// =============================================================================

export const profileBlockTokens = {
  name: {
    fontSize: fontSize['2xl'] - 4,     // 24 (2xl is 28, so 24)
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.md,             // 15 -> closest is md (16), use 15
  },
  bio: {
    fontSize: fontSize.md,             // 15
    lineHeight: 22,
  },
  stat: {
    valueFontSize: fontSize.xl,        // 20
    valueFontWeight: fontWeight.bold,
    labelFontSize: fontSize.sm,        // 13 -> closest is sm (12)
  },
} as const;

// =============================================================================
// Settings Block Tokens
// =============================================================================

export const settingsBlockTokens = {
  group: {
    titleFontSize: fontSize.xs,        // 12
    titleFontWeight: fontWeight.semibold,
    titleLetterSpacing: 0.5,
    descriptionFontSize: fontSize.sm,  // 13
  },
  item: {
    labelFontSize: fontSize.md,        // 16
    descriptionFontSize: fontSize.sm,  // 13
    displayValueFontSize: fontSize.md, // 15
    chevronFontSize: fontSize.md,      // 16
    chevronFontWeight: fontWeight.semibold,
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[4],
  },
} as const;

// =============================================================================
// Calendar Component Tokens
// =============================================================================

export const calendarTokens = {
  sm: {
    daySize: 32,
    fontSize: fontSize.sm,
    headerFontSize: fontSize.base,
    gap: spacing[0.5],  // was hardcoded 2
    containerPadding: spacing[2],  // was hardcoded 8
    weekNumberWidth: 24,
    navButtonPadding: spacing[2],
  },
  md: {
    daySize: 40,
    fontSize: fontSize.base,
    headerFontSize: fontSize.md,
    gap: spacing[1],  // was hardcoded 4
    containerPadding: spacing[2],
    weekNumberWidth: 24,
    navButtonPadding: spacing[2],
  },
} as const;

// =============================================================================
// DateTimePicker Component Tokens
// =============================================================================

export const dateTimePickerTokens = {
  input: {
    height: componentHeight.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    iconMarginLeft: spacing[2],  // was hardcoded 8
  },
  sheet: {
    borderRadius: 20,  // iOS convention
    handlePaddingVertical: spacing[3],  // was hardcoded 12
    handleWidth: 36,
    handleHeight: 4,
    headerPaddingHorizontal: spacing[4],
    headerPaddingBottom: spacing[3],
    pickerPaddingVertical: spacing[4],  // was hardcoded 16
    pickerHeight: 200,
  },
  fallback: {
    padding: spacing[6],  // was hardcoded 24
    gap: spacing[3],  // was hardcoded 12
  },
  icon: {
    width: 20,
    height: 20,
    topWidth: 14,
    topHeight: 3,
    bodyWidth: 16,
    bodyHeight: 14,
    dotSize: 3,
    dotGap: 3,  // intentional pixel value for icon detail
  },
} as const;

// =============================================================================
// Form Component Tokens
// =============================================================================

export const formTokens = {
  item: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[1.5],
  },
  description: {
    fontSize: fontSize.sm,
    marginTop: spacing[1],
  },
  message: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginTop: spacing[1],
  },
} as const;

// =============================================================================
// ImageGallery Component Tokens
// =============================================================================

export const imageGalleryTokens = {
  grid: {
    defaultColumns: 3,
    defaultSpacing: 2,
    defaultAspectRatio: 1,
  },
  fullscreen: {
    backdropOpacity: 0.95,
    closeButtonTop: 50,  // iOS safe area
    closeButtonTopAndroid: 20,
    closeButtonSize: 36,
    closeLineWidth: 18,
    closeLineHeight: 2,
    pageIndicatorBottom: 50,
    dotSize: 6,
    dotGap: spacing[1.5],  // was hardcoded 6
  },
} as const;

// =============================================================================
// Pagination Component Tokens
// =============================================================================

export const paginationTokens = {
  sm: {
    dotSize: 6,
    dotGap: spacing[1.5],  // was hardcoded 6
    buttonSize: 28,
    fontSize: fontSize.sm,
    numberSize: 28,
  },
  md: {
    dotSize: 8,
    dotGap: spacing[2],  // was hardcoded 8
    buttonSize: 36,
    fontSize: fontSize.base,
    numberSize: 36,
  },
  lg: {
    dotSize: 10,
    dotGap: spacing[2.5],  // was hardcoded 10
    buttonSize: 44,
    fontSize: fontSize.md,
    numberSize: 44,
  },
  simple: {
    gap: spacing[1],  // was hardcoded 4 in simpleButton
  },
} as const;

// =============================================================================
// Export all component tokens
// =============================================================================

export const components = {
  button: buttonTokens,
  iconButton: iconButtonTokens,
  fab: fabTokens,
  segmentedControl: segmentedControlTokens,
  actionSheet: actionSheetTokens,
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
  chip: chipTokens,
  label: labelTokens,
  rating: ratingTokens,
  avatarStack: avatarStackTokens,
  card: cardTokens,
  overlayTypography,
  spinner: spinnerTokens,
  skeleton: skeletonTokens,
  progress: progressTokens,
  circularProgress: circularProgressTokens,
  list: listTokens,
  tabs: tabsTokens,
  accordion: accordionTokens,
  collapsible: collapsibleTokens,
  carousel: carouselTokens,
  swipeableRow: swipeableRowTokens,
  authBlock: authBlockTokens,
  stateBlock: stateBlockTokens,
  profileBlock: profileBlockTokens,
  settingsBlock: settingsBlockTokens,
  height: componentHeight,
  icon: iconSize,
} as const;

export type ComponentSize = 'sm' | 'md' | 'lg';
