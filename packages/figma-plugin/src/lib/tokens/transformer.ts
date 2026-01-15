/**
 * nativeui Figma Plugin - Token Transformer
 *
 * Transformiert extrahierte Figma Tokens in das nativeui Config-Format.
 */

import type { TokenCollection, NativeUIThemeConfig } from '../types';

// ============================================================================
// Main Transform Function
// ============================================================================

export function transformToNativeUIConfig(tokens: TokenCollection): NativeUIThemeConfig {
  const config: NativeUIThemeConfig = {};

  // Colors transformieren
  if (hasValues(tokens.colors.light) || hasValues(tokens.colors.dark)) {
    config.colors = {};

    if (hasValues(tokens.colors.light)) {
      config.colors.light = transformColors(tokens.colors.light);
    }

    if (hasValues(tokens.colors.dark)) {
      config.colors.dark = transformColors(tokens.colors.dark);
    }
  }

  // Spacing transformieren
  if (hasValues(tokens.spacing)) {
    config.spacing = transformSpacing(tokens.spacing);
  }

  // Radius transformieren
  if (hasValues(tokens.radius)) {
    config.radius = transformRadius(tokens.radius);
  }

  return config;
}

// ============================================================================
// Color Transformation
// ============================================================================

/**
 * nativeui erwartet folgende Color Token Namen:
 * - background, foreground
 * - card, cardForeground
 * - primary, primaryForeground
 * - secondary, secondaryForeground
 * - muted, mutedForeground
 * - accent, accentForeground
 * - destructive, destructiveForeground
 * - border, input, ring
 */

const COLOR_TOKEN_MAPPINGS: Record<string, string> = {
  // Direct mappings
  background: 'background',
  bg: 'background',
  foreground: 'foreground',
  fg: 'foreground',
  text: 'foreground',

  // Card
  card: 'card',
  cardforeground: 'cardForeground',
  cardfg: 'cardForeground',

  // Primary
  primary: 'primary',
  primaryforeground: 'primaryForeground',
  primaryfg: 'primaryForeground',

  // Secondary
  secondary: 'secondary',
  secondaryforeground: 'secondaryForeground',
  secondaryfg: 'secondaryForeground',

  // Muted
  muted: 'muted',
  mutedforeground: 'mutedForeground',
  mutedfg: 'mutedForeground',

  // Accent
  accent: 'accent',
  accentforeground: 'accentForeground',
  accentfg: 'accentForeground',

  // Destructive
  destructive: 'destructive',
  destructiveforeground: 'destructiveForeground',
  destructivefg: 'destructiveForeground',
  error: 'destructive',
  danger: 'destructive',

  // Border & Input
  border: 'border',
  input: 'input',
  inputborder: 'input',
  ring: 'ring',
  focus: 'ring',
};

function transformColors(colors: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    // Normalisieren für Mapping-Lookup
    const normalizedKey = key.toLowerCase().replace(/[-_\s]/g, '');

    // Versuche Mapping zu finden
    const mappedKey = COLOR_TOKEN_MAPPINGS[normalizedKey];

    if (mappedKey) {
      result[mappedKey] = value;
    } else {
      // Behalte Original-Key bei (in camelCase)
      result[key] = value;
    }
  }

  return result;
}

// ============================================================================
// Spacing Transformation
// ============================================================================

/**
 * nativeui Spacing Scale:
 * 0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 3.5: 14, 4: 16,
 * 5: 20, 6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 11: 44, 12: 48,
 * 14: 56, 16: 64, 20: 80, 24: 96, 28: 112, 32: 128
 */

const STANDARD_SPACING_SCALE: Record<number, string> = {
  2: '0.5',
  4: '1',
  6: '1.5',
  8: '2',
  10: '2.5',
  12: '3',
  14: '3.5',
  16: '4',
  20: '5',
  24: '6',
  28: '7',
  32: '8',
  36: '9',
  40: '10',
  44: '11',
  48: '12',
  56: '14',
  64: '16',
  80: '20',
  96: '24',
  112: '28',
  128: '32',
};

function transformSpacing(spacing: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(spacing)) {
    // Versuche Standard-Scale Key zu finden
    const standardKey = STANDARD_SPACING_SCALE[value];

    if (standardKey) {
      result[standardKey] = value;
    } else {
      // Versuche numerischen Key zu extrahieren (z.B. "spacing4" -> "4")
      const numericMatch = key.match(/(\d+(?:\.\d+)?)/);
      if (numericMatch) {
        result[numericMatch[1]] = value;
      } else {
        // Behalte Original-Key
        result[key] = value;
      }
    }
  }

  return result;
}

// ============================================================================
// Radius Transformation
// ============================================================================

/**
 * nativeui Radius Scale:
 * none: 0, sm: 4, md: 8, lg: 12, xl: 16, 2xl: 24, full: 9999
 */

const RADIUS_VALUE_TO_KEY: Record<number, string> = {
  0: 'none',
  2: 'sm',
  4: 'sm',
  6: 'md',
  8: 'md',
  12: 'lg',
  16: 'xl',
  24: '2xl',
  9999: 'full',
};

const RADIUS_NAME_MAPPINGS: Record<string, string> = {
  none: 'none',
  small: 'sm',
  sm: 'sm',
  medium: 'md',
  md: 'md',
  large: 'lg',
  lg: 'lg',
  xlarge: 'xl',
  xl: 'xl',
  '2xlarge': '2xl',
  '2xl': '2xl',
  full: 'full',
  round: 'full',
  pill: 'full',
};

function transformRadius(radius: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(radius)) {
    // Versuche Name-Mapping
    const normalizedKey = key.toLowerCase().replace(/[-_\s]/g, '');
    const mappedKey = RADIUS_NAME_MAPPINGS[normalizedKey];

    if (mappedKey) {
      result[mappedKey] = value;
    } else {
      // Versuche Value-Mapping
      const valueKey = RADIUS_VALUE_TO_KEY[value];
      if (valueKey && !result[valueKey]) {
        result[valueKey] = value;
      } else {
        // Behalte Original
        result[key] = value;
      }
    }
  }

  return result;
}

// ============================================================================
// Utility Functions
// ============================================================================

function hasValues(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length > 0;
}
