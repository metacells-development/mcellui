/**
 * ThemeProvider
 *
 * Provides theme context to all nativeui components.
 * Automatically detects system color scheme and provides all design tokens.
 *
 * Like shadcn/ui - change tokens here to transform the entire UI.
 *
 * @example
 * ```tsx
 * // Full customization
 * <ThemeProvider
 *   theme="violet"
 *   radius="lg"
 *   fonts={{ heading: 'PlayfairDisplay_700Bold' }}
 *   colors={{ primary: '#7C3AED' }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, ReactNode } from 'react';
import { useColorScheme, ViewStyle } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { setHapticsEnabled } from '../utils/haptics';
import { spacing } from './spacing';
import {
  createRadius,
  createComponentRadius,
  defaultRadiusPreset,
  type RadiusPreset,
  type RadiusTokens,
  type ComponentRadiusTokens,
} from './radius';
import {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  geistFontFamily,
  defaultFonts,
  createTypography,
  type Fonts,
  type Typography,
} from './typography';
import { getShadow, getPlatformShadow, ShadowSize, ShadowStyle } from './shadows';
import {
  springs,
  timing,
  pressScale,
  durations,
  getAnimationPreset,
  defaultAnimationPreset,
  type AnimationPreset,
  type SpringTokens,
  type TimingTokens,
  type PressScaleTokens,
  type DurationTokens,
} from './animations';
import { components } from './components';
import {
  themePresets,
  defaultThemePreset,
  type ThemePreset,
} from './presets';

export type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = 'light' | 'dark' | 'system';

export interface Theme {
  // ─────────────────────────────────────────────────────────────────────────────
  // Color Scheme
  // ─────────────────────────────────────────────────────────────────────────────
  /** Current color scheme */
  colorScheme: ColorScheme;
  /** User's preference: 'light', 'dark', or 'system' */
  colorSchemePreference: ColorSchemePreference;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Set color scheme preference */
  setColorScheme: (preference: ColorSchemePreference) => void;

  // ─────────────────────────────────────────────────────────────────────────────
  // Theme Preset
  // ─────────────────────────────────────────────────────────────────────────────
  /** Current theme preset (if using a preset) */
  themePreset?: ThemePreset;
  /** Current radius preset */
  radiusPreset: RadiusPreset;
  /** Current animation preset */
  animationPreset: AnimationPreset;

  // ─────────────────────────────────────────────────────────────────────────────
  // Design Tokens
  // ─────────────────────────────────────────────────────────────────────────────
  /** Semantic color tokens */
  colors: ThemeColors;
  /** Spacing scale (0-32) */
  spacing: typeof spacing;
  /** Border radius tokens */
  radius: RadiusTokens;
  /** Component-specific radius presets */
  componentRadius: ComponentRadiusTokens;

  // ─────────────────────────────────────────────────────────────────────────────
  // Fonts & Typography
  // ─────────────────────────────────────────────────────────────────────────────
  /** Semantic font tokens (sans, heading, mono) */
  fonts: Fonts;
  /** Font size scale */
  fontSize: typeof fontSize;
  /** Font weight scale */
  fontWeight: typeof fontWeight;
  /** Line height scale */
  lineHeight: typeof lineHeight;
  /** Letter spacing scale */
  letterSpacing: typeof letterSpacing;
  /** Font family tokens (sans, mono, system) @deprecated use fonts instead */
  fontFamily: typeof fontFamily;
  /** Geist font family with weight variants */
  geistFontFamily: typeof geistFontFamily;
  /** Pre-composed typography styles (uses fonts tokens) */
  typography: Typography;

  // ─────────────────────────────────────────────────────────────────────────────
  // Shadows
  // ─────────────────────────────────────────────────────────────────────────────
  /** Get shadow style for a size */
  shadow: (size: ShadowSize) => ShadowStyle;
  /** Get platform-optimized shadow style (iOS: shadow*, Android: elevation) */
  platformShadow: (size: ShadowSize) => ViewStyle;

  // ─────────────────────────────────────────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────────────────────────────────────────
  /** Spring animation presets */
  springs: SpringTokens;
  /** Timing animation presets */
  timing: TimingTokens;
  /** Press scale presets */
  pressScale: PressScaleTokens;
  /** Duration presets */
  durations: DurationTokens;

  // ─────────────────────────────────────────────────────────────────────────────
  // Component Tokens
  // ─────────────────────────────────────────────────────────────────────────────
  /** Component-specific size/style tokens */
  components: typeof components;
}

const ThemeContext = createContext<Theme | null>(null);

export interface ThemeProviderProps {
  /** Initial color scheme preference */
  defaultColorScheme?: ColorSchemePreference;

  /**
   * Theme preset for colors.
   * Pre-designed color schemes: 'zinc', 'slate', 'stone', 'blue', 'green', 'rose', 'orange', 'violet'
   *
   * @example
   * ```tsx
   * <ThemeProvider theme="rose">
   * ```
   */
  theme?: ThemePreset;

  /**
   * Base radius preset.
   * Controls roundness of all components: 'none', 'sm', 'md', 'lg', 'full'
   *
   * @example
   * ```tsx
   * <ThemeProvider radius="lg">  // Soft, rounded UI
   * <ThemeProvider radius="none">  // Sharp, brutalist UI
   * ```
   */
  radius?: RadiusPreset;

  /**
   * Custom font configuration.
   * Partial overrides are merged with defaults.
   *
   * @example
   * ```tsx
   * <ThemeProvider fonts={{
   *   sans: 'Inter_400Regular',
   *   heading: 'PlayfairDisplay_700Bold',
   * }}>
   * ```
   */
  fonts?: Partial<Fonts>;

  /**
   * Color overrides (applied to both light and dark modes).
   * Merged on top of theme preset colors.
   *
   * @example
   * ```tsx
   * <ThemeProvider
   *   theme="blue"
   *   colors={{ primary: '#6366F1' }}  // Override blue's primary with indigo
   * >
   * ```
   */
  colors?: Partial<ThemeColors>;

  /**
   * Light mode specific color overrides.
   * Applied only in light mode, after theme and colors.
   */
  lightColors?: Partial<ThemeColors>;

  /**
   * Dark mode specific color overrides.
   * Applied only in dark mode, after theme and colors.
   */
  darkColors?: Partial<ThemeColors>;

  /**
   * Enable or disable haptic feedback globally.
   * When false, all `haptic()` calls become no-ops.
   * @default true
   *
   * @example
   * ```tsx
   * // Disable haptics for accessibility or user preference
   * <ThemeProvider haptics={false}>
   * ```
   */
  haptics?: boolean;

  /**
   * Animation preset.
   * Controls the overall feel of animations throughout the app.
   * - `subtle`: Professional, smooth animations with minimal overshoot
   * - `playful`: Bouncy, energetic animations with more personality
   * @default 'subtle'
   *
   * @example
   * ```tsx
   * // Professional, smooth animations
   * <ThemeProvider animationPreset="subtle">
   *
   * // Bouncy, fun animations
   * <ThemeProvider animationPreset="playful">
   * ```
   */
  animationPreset?: AnimationPreset;

  /** Children components */
  children: ReactNode;
}

export function ThemeProvider({
  defaultColorScheme = 'system',
  theme: themePreset,
  radius: radiusPreset = defaultRadiusPreset,
  fonts: fontOverrides,
  colors: colorOverrides,
  lightColors: lightColorOverrides,
  darkColors: darkColorOverrides,
  haptics = true,
  animationPreset = defaultAnimationPreset,
  children,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreference] = useState<ColorSchemePreference>(defaultColorScheme);

  // Set global haptics enabled state
  useEffect(() => {
    setHapticsEnabled(haptics);
  }, [haptics]);

  const setColorScheme = useCallback((newPreference: ColorSchemePreference) => {
    setPreference(newPreference);
  }, []);

  // Merge font overrides with defaults
  const fonts = useMemo<Fonts>(
    () => ({
      ...defaultFonts,
      ...fontOverrides,
    }),
    [fontOverrides]
  );

  // Generate typography with resolved fonts
  const typography = useMemo(() => createTypography(fonts), [fonts]);

  // Generate radius tokens from preset
  const radius = useMemo(() => createRadius(radiusPreset), [radiusPreset]);
  const componentRadius = useMemo(() => createComponentRadius(radius), [radius]);

  const theme = useMemo<Theme>(() => {
    // Resolve actual color scheme from preference
    let resolvedScheme: ColorScheme;
    if (preference === 'system') {
      resolvedScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      resolvedScheme = preference;
    }

    const isDark = resolvedScheme === 'dark';

    // Build colors: base -> preset -> overrides -> mode-specific overrides
    let colors: ThemeColors;

    // Start with base colors or preset colors
    if (themePreset) {
      const presetColors = themePresets[themePreset];
      colors = isDark ? { ...presetColors.dark } : { ...presetColors.light };
    } else {
      colors = isDark ? { ...darkColors } : { ...lightColors };
    }

    // Apply general color overrides
    if (colorOverrides) {
      colors = { ...colors, ...colorOverrides };
    }

    // Apply mode-specific overrides
    if (isDark && darkColorOverrides) {
      colors = { ...colors, ...darkColorOverrides };
    } else if (!isDark && lightColorOverrides) {
      colors = { ...colors, ...lightColorOverrides };
    }

    return {
      // Color Scheme
      colorScheme: resolvedScheme,
      colorSchemePreference: preference,
      isDark,
      setColorScheme,

      // Theme Preset
      themePreset,
      radiusPreset,
      animationPreset,

      // Design Tokens
      colors,
      spacing,
      radius,
      componentRadius,

      // Fonts & Typography
      fonts,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      fontFamily,
      geistFontFamily,
      typography,

      // Shadows
      shadow: (size: ShadowSize) => getShadow(size, isDark),
      platformShadow: (size: ShadowSize) => getPlatformShadow(size, isDark),

      // Animations (resolved from preset)
      ...getAnimationPreset(animationPreset),

      // Component Tokens
      components,
    };
  }, [
    preference,
    systemColorScheme,
    setColorScheme,
    themePreset,
    radiusPreset,
    animationPreset,
    fonts,
    typography,
    radius,
    componentRadius,
    colorOverrides,
    lightColorOverrides,
    darkColorOverrides,
  ]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme values
 *
 * @example
 * ```tsx
 * const { colors, spacing, radius, components } = useTheme();
 *
 * // Use design tokens
 * <View style={{
 *   backgroundColor: colors.card,
 *   padding: spacing[4],
 *   borderRadius: radius.lg,
 *   ...platformShadow('md')
 * }}>
 *   <Text style={typography.body}>Hello</Text>
 * </View>
 *
 * // Use component tokens
 * const buttonSize = components.button.md;
 * <View style={{
 *   height: buttonSize.height,
 *   paddingHorizontal: buttonSize.paddingHorizontal,
 *   borderRadius: buttonSize.borderRadius,
 * }} />
 * ```
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    // Fallback for when ThemeProvider is not present
    const isDark = false;
    const fallbackTypography = createTypography(defaultFonts);
    const fallbackRadius = createRadius(defaultRadiusPreset);
    const fallbackComponentRadius = createComponentRadius(fallbackRadius);

    return {
      colorScheme: 'light',
      colorSchemePreference: 'system',
      isDark,
      setColorScheme: () => {
        console.warn('ThemeProvider not found. setColorScheme will not work.');
      },
      themePreset: undefined,
      radiusPreset: defaultRadiusPreset,
      animationPreset: defaultAnimationPreset,
      colors: lightColors,
      spacing,
      radius: fallbackRadius,
      componentRadius: fallbackComponentRadius,
      fonts: defaultFonts,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      fontFamily,
      geistFontFamily,
      typography: fallbackTypography,
      shadow: (size: ShadowSize) => getShadow(size, isDark),
      platformShadow: (size: ShadowSize) => getPlatformShadow(size, isDark),
      ...getAnimationPreset(defaultAnimationPreset),
      components,
    };
  }

  return theme;
}

/**
 * Hook to get current color scheme
 */
export function useColorSchemeValue(): ColorScheme {
  const theme = useTheme();
  return theme.colorScheme;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDark(): boolean {
  const theme = useTheme();
  return theme.isDark;
}
