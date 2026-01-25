/**
 * Typography Tokens
 *
 * Consistent typography scale for all text elements.
 * Based on iOS Human Interface Guidelines with
 * consideration for React Native defaults.
 *
 * Supports Geist font family when loaded, falls back to system fonts.
 *
 * Usage:
 * ```tsx
 * const { typography, fontFamily } = useTheme();
 * <Text style={typography.body} />
 * <Text style={{ fontFamily: fontFamily.sans, fontSize: fontSize.lg }} />
 * ```
 */

import { TextStyle, Platform } from 'react-native';

// =============================================================================
// Font Sizes
// =============================================================================

export const fontSize = {
  /** 10px - fine print */
  '2xs': 10,
  /** 11px - captions, labels */
  xs: 11,
  /** 12px - small text, badges */
  sm: 12,
  /** 14px - secondary text */
  base: 14,
  /** 16px - body text (default) */
  md: 16,
  /** 18px - emphasized body */
  lg: 18,
  /** 20px - small headings */
  xl: 20,
  /** 24px - section headings */
  '2xl': 24,
  /** 30px - page headings */
  '3xl': 30,
  /** 36px - large headings */
  '4xl': 36,
  /** 48px - display */
  '5xl': 48,
} as const;

export type FontSizeKey = keyof typeof fontSize;

// =============================================================================
// Font Weights
// =============================================================================

export const fontWeight = {
  /** 100 */
  thin: '100' as const,
  /** 200 */
  extralight: '200' as const,
  /** 300 */
  light: '300' as const,
  /** 400 - body text */
  normal: '400' as const,
  /** 500 - slightly emphasized */
  medium: '500' as const,
  /** 600 - buttons, labels */
  semibold: '600' as const,
  /** 700 - headings */
  bold: '700' as const,
  /** 800 */
  extrabold: '800' as const,
  /** 900 */
  black: '900' as const,
} as const;

export type FontWeightKey = keyof typeof fontWeight;

// =============================================================================
// Line Heights
// =============================================================================

export const lineHeight = {
  /** Tight: 1.0 */
  none: 1,
  /** Tight: 1.25 */
  tight: 1.25,
  /** Snug: 1.375 */
  snug: 1.375,
  /** Normal: 1.5 (default) */
  normal: 1.5,
  /** Relaxed: 1.625 */
  relaxed: 1.625,
  /** Loose: 2.0 */
  loose: 2,
} as const;

export type LineHeightKey = keyof typeof lineHeight;

// =============================================================================
// Letter Spacing
// =============================================================================

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

export type LetterSpacingKey = keyof typeof letterSpacing;

// =============================================================================
// Font Family
// =============================================================================

/**
 * System font fallbacks for when custom fonts aren't loaded.
 */
export const systemFonts = {
  /** Sans-serif system font */
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  /** Monospace system font */
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
} as const;

/**
 * Semantic font tokens.
 *
 * Three fonts cover all use cases:
 * - `sans`: Body text, UI elements (default)
 * - `heading`: Headlines h1-h4 (can be display/serif font)
 * - `mono`: Code blocks, monospace text
 *
 * @example
 * ```tsx
 * // Use defaults (Geist)
 * <ThemeProvider>
 *
 * // Custom fonts
 * <ThemeProvider fonts={{
 *   sans: 'Inter_400Regular',
 *   heading: 'PlayfairDisplay_700Bold',
 *   mono: 'FiraCode_400Regular',
 * }}>
 * ```
 */
export interface Fonts {
  /** Body text, UI elements */
  sans: string;
  /** Headlines (h1-h4) - defaults to bold variant of sans */
  heading: string;
  /** Code, monospace text */
  mono: string;
}

/**
 * Default fonts using Geist font family.
 * Used when no custom fonts are provided to ThemeProvider.
 */
export const defaultFonts: Fonts = {
  sans: 'Geist_400Regular',
  heading: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
};

/**
 * Legacy fontFamily export for backwards compatibility.
 * @deprecated Use `fonts` from useTheme() instead
 */
export const fontFamily = {
  /** Sans-serif: Geist or system default */
  sans: systemFonts.sans,
  /** Monospace: Geist Mono or system default */
  mono: systemFonts.mono,
  /** System font - always available */
  system: systemFonts.sans,
} as const;

/**
 * Font family with weight suffix for Geist.
 * Use these when Geist fonts are loaded.
 */
export const geistFontFamily = {
  // Sans variants
  'sans-thin': 'Geist_100Thin',
  'sans-extralight': 'Geist_200ExtraLight',
  'sans-light': 'Geist_300Light',
  'sans-regular': 'Geist_400Regular',
  'sans-medium': 'Geist_500Medium',
  'sans-semibold': 'Geist_600SemiBold',
  'sans-bold': 'Geist_700Bold',
  'sans-extrabold': 'Geist_800ExtraBold',
  'sans-black': 'Geist_900Black',
  // Mono variants
  'mono-thin': 'GeistMono_100Thin',
  'mono-extralight': 'GeistMono_200ExtraLight',
  'mono-light': 'GeistMono_300Light',
  'mono-regular': 'GeistMono_400Regular',
  'mono-medium': 'GeistMono_500Medium',
  'mono-semibold': 'GeistMono_600SemiBold',
  'mono-bold': 'GeistMono_700Bold',
  'mono-extrabold': 'GeistMono_800ExtraBold',
  'mono-black': 'GeistMono_900Black',
} as const;

export type FontFamilyKey = keyof typeof fontFamily;
export type GeistFontFamilyKey = keyof typeof geistFontFamily;

// =============================================================================
// Typography Presets
// =============================================================================

/**
 * Typography preset styles type.
 */
export interface Typography {
  display: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  bodyLg: TextStyle;
  body: TextStyle;
  bodySm: TextStyle;
  label: TextStyle;
  labelSm: TextStyle;
  button: TextStyle;
  buttonSm: TextStyle;
  buttonLg: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
  badge: TextStyle;
  code: TextStyle;
}

export type TypographyKey = keyof Typography;

/**
 * Creates typography presets with the given fonts.
 * Used internally by ThemeProvider to generate typography styles.
 */
export function createTypography(fonts: Fonts): Typography {
  return {
    // Display/Hero
    display: {
      fontFamily: fonts.heading,
      fontSize: fontSize['5xl'],
      fontWeight: fontWeight.bold,
      lineHeight: fontSize['5xl'] * lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },

    // Headings - use heading font
    h1: {
      fontFamily: fonts.heading,
      fontSize: fontSize['3xl'],
      fontWeight: fontWeight.bold,
      lineHeight: fontSize['3xl'] * lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },

    h2: {
      fontFamily: fonts.heading,
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      lineHeight: fontSize['2xl'] * lineHeight.tight,
    },

    h3: {
      fontFamily: fonts.heading,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.xl * lineHeight.snug,
    },

    h4: {
      fontFamily: fonts.heading,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.lg * lineHeight.snug,
    },

    h5: {
      fontFamily: fonts.heading,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.md * lineHeight.snug,
    },

    h6: {
      fontFamily: fonts.heading,
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.base * lineHeight.snug,
    },

    // Body - use sans font
    bodyLg: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.normal,
      lineHeight: fontSize.lg * lineHeight.normal,
    },

    body: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      fontWeight: fontWeight.normal,
      lineHeight: fontSize.md * lineHeight.normal,
    },

    bodySm: {
      fontFamily: fonts.sans,
      fontSize: fontSize.base,
      fontWeight: fontWeight.normal,
      lineHeight: fontSize.base * lineHeight.normal,
    },

    // UI Text - use sans font
    label: {
      fontFamily: fonts.sans,
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      lineHeight: fontSize.base * lineHeight.snug,
    },

    labelSm: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: fontSize.sm * lineHeight.snug,
    },

    button: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.md * lineHeight.none,
    },

    buttonSm: {
      fontFamily: fonts.sans,
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.base * lineHeight.none,
    },

    buttonLg: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.lg * lineHeight.none,
    },

    // Small text - use sans font
    caption: {
      fontFamily: fonts.sans,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.normal,
      lineHeight: fontSize.xs * lineHeight.normal,
    },

    overline: {
      fontFamily: fonts.sans,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      lineHeight: fontSize.xs * lineHeight.normal,
      letterSpacing: letterSpacing.wider,
      textTransform: 'uppercase',
    },

    badge: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: fontSize.sm * lineHeight.none,
    },

    // Code - use mono font
    code: {
      fontFamily: fonts.mono,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: fontSize.sm * lineHeight.normal,
    },
  };
}

/**
 * Default typography presets using default fonts.
 * @deprecated Use typography from useTheme() for font customization support
 */
export const typography = createTypography(defaultFonts);
