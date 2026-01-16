/**
 * nativeui Token Definitions
 *
 * Diese Datei enthält alle Token-Werte aus @nativeui/core
 * für den Import nach Figma.
 */

// =============================================================================
// Color Tokens
// =============================================================================

export const lightColors = {
  // Backgrounds
  background: '#ffffff',
  backgroundSubtle: '#fafafa',
  backgroundMuted: '#f5f5f5',
  backgroundElevated: '#ffffff',

  // Foreground/Text
  foreground: '#171717',
  foregroundMuted: '#737373',
  foregroundSubtle: '#a3a3a3',

  // Borders
  border: '#e5e5e5',
  borderMuted: '#f5f5f5',
  borderFocused: '#3b82f6',

  // Primary
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  primaryMuted: '#dbeafe',

  // Secondary
  secondary: '#f5f5f5',
  secondaryForeground: '#171717',

  // Destructive
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  // Success
  success: '#22c55e',
  successForeground: '#ffffff',
  successMuted: '#dcfce7',

  // Warning
  warning: '#f59e0b',
  warningForeground: '#171717',
  warningMuted: '#fef3c7',

  // Error
  error: '#ef4444',
  errorForeground: '#ffffff',
  errorMuted: '#fee2e2',

  // Card
  card: '#ffffff',
  cardForeground: '#171717',

  // Input
  input: '#ffffff',
  inputBorder: '#e5e5e5',
  inputPlaceholder: '#a3a3a3',
};

export const darkColors = {
  // Backgrounds
  background: '#0a0a0a',
  backgroundSubtle: '#171717',
  backgroundMuted: '#262626',
  backgroundElevated: '#171717',

  // Foreground/Text
  foreground: '#fafafa',
  foregroundMuted: '#a3a3a3',
  foregroundSubtle: '#737373',

  // Borders
  border: '#262626',
  borderMuted: '#171717',
  borderFocused: '#60a5fa',

  // Primary
  primary: '#60a5fa',
  primaryForeground: '#171717',
  primaryMuted: '#1e3a8a',

  // Secondary
  secondary: '#262626',
  secondaryForeground: '#fafafa',

  // Destructive
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  // Success
  success: '#4ade80',
  successForeground: '#171717',
  successMuted: '#14532d',

  // Warning
  warning: '#fbbf24',
  warningForeground: '#171717',
  warningMuted: '#78350f',

  // Error
  error: '#f87171',
  errorForeground: '#ffffff',
  errorMuted: '#7f1d1d',

  // Card
  card: '#171717',
  cardForeground: '#fafafa',

  // Input
  input: '#262626',
  inputBorder: '#404040',
  inputPlaceholder: '#737373',
};

// =============================================================================
// Spacing Tokens
// =============================================================================

export const spacing: Record<string, number> = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
};

// =============================================================================
// Radius Tokens
// =============================================================================

export const radius: Record<string, number> = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// =============================================================================
// Color Groups (for organized display in Figma)
// =============================================================================

export const colorGroups = {
  background: ['background', 'backgroundSubtle', 'backgroundMuted', 'backgroundElevated'],
  foreground: ['foreground', 'foregroundMuted', 'foregroundSubtle'],
  border: ['border', 'borderMuted', 'borderFocused'],
  primary: ['primary', 'primaryForeground', 'primaryMuted'],
  secondary: ['secondary', 'secondaryForeground'],
  destructive: ['destructive', 'destructiveForeground'],
  success: ['success', 'successForeground', 'successMuted'],
  warning: ['warning', 'warningForeground', 'warningMuted'],
  error: ['error', 'errorForeground', 'errorMuted'],
  card: ['card', 'cardForeground'],
  input: ['input', 'inputBorder', 'inputPlaceholder'],
};
