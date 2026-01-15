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
  input: number;
  card: number;
  badge: number;
  avatar: number;
  checkbox: number;
  switch: number;
  modal: number;
  tooltip: number;
}

export type ComponentRadiusKey = keyof ComponentRadiusTokens;

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
    input: radiusTokens.md,
    card: radiusTokens.lg,
    badge: radiusTokens.full,
    avatar: radiusTokens.full,
    checkbox: radiusTokens.sm,
    switch: radiusTokens.full,
    modal: radiusTokens.xl,
    tooltip: radiusTokens.md,
  };
}

/**
 * Default component radius values.
 */
export const componentRadius = createComponentRadius(radius);
