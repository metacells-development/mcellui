/**
 * Theme System
 *
 * Complete design token system for nativeui components.
 * Inspired by shadcn/ui - change a few tokens to transform the entire UI.
 */

// Colors
export {
  palette,
  lightColors,
  darkColors,
  type ThemeColors,
  type ColorKey,
} from './colors';

// Spacing
export {
  spacing,
  type SpacingKey,
  type SpacingValue,
} from './spacing';

// Border Radius
export {
  radius,
  componentRadius,
  createRadius,
  createComponentRadius,
  radiusPresetBase,
  defaultRadiusPreset,
  type RadiusKey,
  type RadiusValue,
  type RadiusTokens,
  type RadiusPreset,
  type ComponentRadiusKey,
  type ComponentRadiusTokens,
} from './radius';

// Typography
export {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  geistFontFamily,
  typography,
  systemFonts,
  defaultFonts,
  createTypography,
  type Fonts,
  type Typography,
  type FontSizeKey,
  type FontWeightKey,
  type LineHeightKey,
  type LetterSpacingKey,
  type FontFamilyKey,
  type GeistFontFamilyKey,
  type TypographyKey,
} from './typography';

// Shadows
export {
  getShadow,
  getPlatformShadow,
  shadows,
  type ShadowStyle,
  type ShadowSize,
} from './shadows';

// Animations
export {
  springs,
  timing,
  pressScale,
  durations,
  type SpringPreset,
  type TimingPreset,
  type PressScalePreset,
} from './animations';

// Component Tokens
export {
  components,
  componentHeight,
  iconSize,
  buttonTokens,
  inputTokens,
  checkboxTokens,
  switchTokens,
  badgeTokens,
  avatarTokens,
  cardTokens,
  type ComponentSize,
} from './components';

// Theme Presets
export {
  themePresets,
  defaultThemePreset,
  getPresetColors,
  getPresetColorsForMode,
  type ThemePreset,
  type PresetColors,
} from './presets';

// Provider & Hooks
export {
  ThemeProvider,
  useTheme,
  useColorSchemeValue,
  useIsDark,
  type Theme,
  type ThemeProviderProps,
  type ColorScheme,
  type ColorSchemePreference,
} from './ThemeProvider';
