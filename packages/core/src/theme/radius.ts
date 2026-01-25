/**
 * Border Radius Tokens
 *
 * Consistent border radius scale for all components.
 * Use the `radius` prop on ThemeProvider to change the base radius
 * and transform your entire app from sharp to rounded.
 *
 * Usage:
 * ```tsx
 * // Sharp, brutalist design
 * <ThemeProvider radius="none">
 *
 * // Soft, friendly design
 * <ThemeProvider radius="lg">
 *
 * // In components
 * const { radius } = useTheme();
 * <View style={{ borderRadius: radius.md }} />
 * ```
 */

// =============================================================================
// Radius Preset System
// =============================================================================

/**
 * Available radius presets.
 * Each preset defines a base value that scales all radii.
 */
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Base values for each radius preset.
 */
export const radiusPresetBase: Record<RadiusPreset, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

/**
 * Radius token structure.
 */
export interface RadiusTokens {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

export type RadiusKey = keyof RadiusTokens;
export type RadiusValue = number;

/**
 * Creates radius tokens from a preset or base value.
 *
 * @param preset - Radius preset name or custom base value
 * @returns Scaled radius tokens
 */
export function createRadius(preset: RadiusPreset | number = 'md'): RadiusTokens {
  const base = typeof preset === 'number' ? preset : radiusPresetBase[preset];

  // Special case: 'none' preset = all zeros except full
  if (preset === 'none' || base === 0) {
    return {
      none: 0,
      xs: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
      '2xl': 0,
      full: 0,
    };
  }

  // Special case: 'full' preset = all pill-shaped
  if (preset === 'full' || base >= 9999) {
    return {
      none: 0,
      xs: 9999,
      sm: 9999,
      md: 9999,
      lg: 9999,
      xl: 9999,
      '2xl': 9999,
      full: 9999,
    };
  }

  // Scale from base value
  return {
    none: 0,
    xs: Math.round(base * 0.25),   // 2 when base=8
    sm: Math.round(base * 0.5),    // 4 when base=8
    md: base,                       // 8 when base=8
    lg: Math.round(base * 1.5),    // 12 when base=8
    xl: Math.round(base * 2),      // 16 when base=8
    '2xl': Math.round(base * 3),   // 24 when base=8
    full: 9999,
  };
}

/**
 * Default radius tokens (md preset).
 */
export const radius = createRadius('md');

/**
 * Default radius preset.
 */
export const defaultRadiusPreset: RadiusPreset = 'md';

// =============================================================================
// Component Radius
// =============================================================================

/**
 * Component-specific radius tokens structure.
 */
export interface ComponentRadiusTokens {
  button: number;
  buttonSm: number;
  buttonLg: number;
  iconButton: number;
  iconButtonRounded: number;
  fab: number;
  segmentedControl: number;
  segmentedControlIndicator: number;
  actionSheet: number;
  actionSheetItem: number;
  input: number;
  textarea: number;
  select: number;
  slider: number;
  stepper: number;
  radio: number;
  tagInput: number;
  card: number;
  badge: number;
  avatar: number;
  checkbox: number;
  switch: number;
  modal: number;
  tooltip: number;
  chip: number;
  image: number;
}

export type ComponentRadiusKey = keyof ComponentRadiusTokens;

/**
 * Pill radius constant - always fully rounded regardless of preset.
 * Used for components that should always be pill-shaped (avatar, switch, badge).
 */
const PILL_RADIUS = 9999;

/**
 * Creates component-specific radius values from radius tokens.
 *
 * @param radiusTokens - Base radius tokens
 * @returns Component-specific radius values
 */
export function createComponentRadius(radiusTokens: RadiusTokens): ComponentRadiusTokens {
  return {
    button: radiusTokens.md,
    buttonSm: radiusTokens.sm,
    buttonLg: radiusTokens.lg,
    // IconButton: uses medium radius by default (same as button)
    iconButton: radiusTokens.md,
    iconButtonRounded: PILL_RADIUS, // for fully circular
    // FAB: always fully circular (computed from size, but PILL_RADIUS for CSS)
    fab: PILL_RADIUS,
    // SegmentedControl: container uses lg, indicator uses md
    segmentedControl: radiusTokens.lg,
    segmentedControlIndicator: radiusTokens.md,
    // ActionSheet: container uses xl for prominent modal feel, items use md
    actionSheet: radiusTokens.xl,
    actionSheetItem: radiusTokens.md,
    input: radiusTokens.md,
    textarea: radiusTokens.md,
    select: radiusTokens.md,
    slider: radiusTokens.md, // for track container, thumb is always pill
    stepper: radiusTokens.md,
    radio: PILL_RADIUS, // always circular
    tagInput: radiusTokens.md,
    card: radiusTokens.lg,
    // Always pill-shaped regardless of preset
    badge: PILL_RADIUS,
    avatar: PILL_RADIUS,
    checkbox: radiusTokens.sm,
    switch: PILL_RADIUS,
    modal: radiusTokens.xl,
    tooltip: radiusTokens.md,
    // Chip: uses lg radius for pill-like but not full circular
    chip: radiusTokens.lg,
    // Image: uses md radius for default image corners
    image: radiusTokens.md,
  };
}

/**
 * Default component radius values.
 */
export const componentRadius = createComponentRadius(radius);
