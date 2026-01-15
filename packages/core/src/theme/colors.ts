/**
 * Theme Colors
 *
 * Semantic color tokens that adapt to light/dark mode.
 * Inspired by iOS 17+ Dynamic Colors, Arc Browser, and Linear App.
 */

// Base color palette (raw values)
export const palette = {
  // Neutral scale
  neutral: {
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
  },

  // Primary blue
  primary: {
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
  },

  // Success green
  success: {
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
  },

  // Warning amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

// Semantic colors for light mode
export const lightColors = {
  // Backgrounds
  background: palette.neutral[0],
  backgroundSubtle: palette.neutral[50],
  backgroundMuted: palette.neutral[100],
  backgroundElevated: palette.neutral[0],

  // Foreground/Text
  foreground: palette.neutral[900],
  foregroundMuted: palette.neutral[500],
  foregroundSubtle: palette.neutral[400],

  // Borders
  border: palette.neutral[200],
  borderMuted: palette.neutral[100],
  borderFocused: palette.primary[500],

  // Primary
  primary: palette.primary[500],
  primaryForeground: palette.neutral[0],
  primaryMuted: palette.primary[100],

  // Secondary
  secondary: palette.neutral[100],
  secondaryForeground: palette.neutral[900],

  // Destructive
  destructive: palette.error[500],
  destructiveForeground: palette.neutral[0],

  // Success
  success: palette.success[500],
  successForeground: palette.neutral[0],
  successMuted: palette.success[100],

  // Warning
  warning: palette.warning[500],
  warningForeground: palette.neutral[900],
  warningMuted: palette.warning[100],

  // Error
  error: palette.error[500],
  errorForeground: palette.neutral[0],
  errorMuted: palette.error[100],

  // Card
  card: palette.neutral[0],
  cardForeground: palette.neutral[900],

  // Input
  input: palette.neutral[0],
  inputBorder: palette.neutral[200],
  inputPlaceholder: palette.neutral[400],

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.3)',
} as const;

// Semantic colors for dark mode
export const darkColors = {
  // Backgrounds
  background: palette.neutral[950],
  backgroundSubtle: palette.neutral[900],
  backgroundMuted: palette.neutral[800],
  backgroundElevated: palette.neutral[900],

  // Foreground/Text
  foreground: palette.neutral[50],
  foregroundMuted: palette.neutral[400],
  foregroundSubtle: palette.neutral[500],

  // Borders
  border: palette.neutral[800],
  borderMuted: palette.neutral[900],
  borderFocused: palette.primary[400],

  // Primary
  primary: palette.primary[400],
  primaryForeground: palette.neutral[900],
  primaryMuted: palette.primary[900],

  // Secondary
  secondary: palette.neutral[800],
  secondaryForeground: palette.neutral[50],

  // Destructive
  destructive: palette.error[500],
  destructiveForeground: palette.neutral[0],

  // Success
  success: palette.success[400],
  successForeground: palette.neutral[900],
  successMuted: palette.success[900],

  // Warning
  warning: palette.warning[400],
  warningForeground: palette.neutral[900],
  warningMuted: palette.warning[900],

  // Error
  error: palette.error[400],
  errorForeground: palette.neutral[0],
  errorMuted: palette.error[900],

  // Card
  card: palette.neutral[900],
  cardForeground: palette.neutral[50],

  // Input
  input: palette.neutral[800],
  inputBorder: palette.neutral[700],
  inputPlaceholder: palette.neutral[500],

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  scrim: 'rgba(0, 0, 0, 0.5)',
} as const;

/**
 * Theme colors interface.
 * Uses string type to allow color customization and presets.
 */
export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSubtle: string;
  backgroundMuted: string;
  backgroundElevated: string;

  // Foreground/Text
  foreground: string;
  foregroundMuted: string;
  foregroundSubtle: string;

  // Borders
  border: string;
  borderMuted: string;
  borderFocused: string;

  // Primary
  primary: string;
  primaryForeground: string;
  primaryMuted: string;

  // Secondary
  secondary: string;
  secondaryForeground: string;

  // Destructive
  destructive: string;
  destructiveForeground: string;

  // Success
  success: string;
  successForeground: string;
  successMuted: string;

  // Warning
  warning: string;
  warningForeground: string;
  warningMuted: string;

  // Error
  error: string;
  errorForeground: string;
  errorMuted: string;

  // Card
  card: string;
  cardForeground: string;

  // Input
  input: string;
  inputBorder: string;
  inputPlaceholder: string;

  // Overlay
  overlay: string;
  scrim: string;
}

export type ColorKey = keyof ThemeColors;
