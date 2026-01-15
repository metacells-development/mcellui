/**
 * Theme Presets
 *
 * Pre-designed color schemes for instant brand alignment.
 * Each preset defines primary colors and derives a full semantic palette.
 *
 * Usage:
 * ```tsx
 * <ThemeProvider theme="rose">
 * <ThemeProvider theme="violet">
 * ```
 */

import { ThemeColors } from './colors';

// =============================================================================
// Color Palettes (Tailwind-inspired)
// =============================================================================

const palettes = {
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
} as const;

// Neutral palette (used for backgrounds, text, borders)
const neutral = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0a0a0a',
} as const;

// =============================================================================
// Theme Preset Types
// =============================================================================

export type ThemePreset = 'zinc' | 'slate' | 'stone' | 'blue' | 'green' | 'rose' | 'orange' | 'violet';

export interface PresetColors {
  light: ThemeColors;
  dark: ThemeColors;
}

// =============================================================================
// Preset Generation
// =============================================================================

type ColorPalette = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

/**
 * Creates a complete color scheme from a primary color palette.
 */
function createPresetColors(
  primaryPalette: ColorPalette,
  neutralPalette: ColorPalette = palettes.zinc
): PresetColors {
  return {
    light: {
      // Backgrounds
      background: neutral[0],
      backgroundSubtle: neutralPalette[50],
      backgroundMuted: neutralPalette[100],
      backgroundElevated: neutral[0],

      // Foreground/Text
      foreground: neutralPalette[900],
      foregroundMuted: neutralPalette[500],
      foregroundSubtle: neutralPalette[400],

      // Borders
      border: neutralPalette[200],
      borderMuted: neutralPalette[100],
      borderFocused: primaryPalette[500],

      // Primary
      primary: primaryPalette[500],
      primaryForeground: neutral[0],
      primaryMuted: primaryPalette[100],

      // Secondary
      secondary: neutralPalette[100],
      secondaryForeground: neutralPalette[900],

      // Destructive (always red)
      destructive: '#ef4444',
      destructiveForeground: neutral[0],

      // Success (always green)
      success: '#22c55e',
      successForeground: neutral[0],
      successMuted: '#dcfce7',

      // Warning (always amber)
      warning: '#f59e0b',
      warningForeground: neutral[900],
      warningMuted: '#fef3c7',

      // Error (always red)
      error: '#ef4444',
      errorForeground: neutral[0],
      errorMuted: '#fee2e2',

      // Card
      card: neutral[0],
      cardForeground: neutralPalette[900],

      // Input
      input: neutral[0],
      inputBorder: neutralPalette[200],
      inputPlaceholder: neutralPalette[400],

      // Overlay
      overlay: 'rgba(0, 0, 0, 0.5)',
      scrim: 'rgba(0, 0, 0, 0.3)',
    },
    dark: {
      // Backgrounds
      background: neutralPalette[950],
      backgroundSubtle: neutralPalette[900],
      backgroundMuted: neutralPalette[800],
      backgroundElevated: neutralPalette[900],

      // Foreground/Text
      foreground: neutralPalette[50],
      foregroundMuted: neutralPalette[400],
      foregroundSubtle: neutralPalette[500],

      // Borders
      border: neutralPalette[800],
      borderMuted: neutralPalette[900],
      borderFocused: primaryPalette[400],

      // Primary
      primary: primaryPalette[400],
      primaryForeground: neutralPalette[900],
      primaryMuted: primaryPalette[900],

      // Secondary
      secondary: neutralPalette[800],
      secondaryForeground: neutralPalette[50],

      // Destructive
      destructive: '#ef4444',
      destructiveForeground: neutral[0],

      // Success
      success: '#4ade80',
      successForeground: neutral[900],
      successMuted: '#14532d',

      // Warning
      warning: '#fbbf24',
      warningForeground: neutral[900],
      warningMuted: '#78350f',

      // Error
      error: '#f87171',
      errorForeground: neutral[0],
      errorMuted: '#7f1d1d',

      // Card
      card: neutralPalette[900],
      cardForeground: neutralPalette[50],

      // Input
      input: neutralPalette[800],
      inputBorder: neutralPalette[700],
      inputPlaceholder: neutralPalette[500],

      // Overlay
      overlay: 'rgba(0, 0, 0, 0.7)',
      scrim: 'rgba(0, 0, 0, 0.5)',
    },
  };
}

// =============================================================================
// Theme Presets
// =============================================================================

/**
 * All available theme presets.
 */
export const themePresets: Record<ThemePreset, PresetColors> = {
  // Neutral presets (use their own palette as neutral base)
  zinc: createPresetColors(palettes.zinc, palettes.zinc),
  slate: createPresetColors(palettes.slate, palettes.slate),
  stone: createPresetColors(palettes.stone, palettes.stone),

  // Color presets (use zinc as neutral base)
  blue: createPresetColors(palettes.blue, palettes.zinc),
  green: createPresetColors(palettes.green, palettes.zinc),
  rose: createPresetColors(palettes.rose, palettes.zinc),
  orange: createPresetColors(palettes.orange, palettes.zinc),
  violet: createPresetColors(palettes.violet, palettes.zinc),
};

/**
 * Default theme preset.
 */
export const defaultThemePreset: ThemePreset = 'zinc';

/**
 * Gets colors for a theme preset.
 */
export function getPresetColors(preset: ThemePreset): PresetColors {
  return themePresets[preset];
}

/**
 * Gets light or dark colors for a theme preset.
 */
export function getPresetColorsForMode(
  preset: ThemePreset,
  isDark: boolean
): ThemeColors {
  const presetColors = themePresets[preset];
  return isDark ? presetColors.dark : presetColors.light;
}
