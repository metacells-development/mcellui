/**
 * Theme System
 *
 * Complete design token system for mcellui components.
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
  subtleAnimations,
  playfulAnimations,
  getAnimationPreset,
  defaultAnimationPreset,
  type SpringConfig,
  type TimingConfig,
  type SpringTokens,
  type TimingTokens,
  type PressScaleTokens,
  type DurationTokens,
  type AnimationTokens,
  type SpringPreset,
  type TimingPreset,
  type PressScalePreset,
  type AnimationPreset,
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
  overlayTypography,
  spinnerTokens,
  skeletonTokens,
  progressTokens,
  circularProgressTokens,
  LIST_CONSTANTS,
  listTokens,
  tabsTokens,
  TABS_CONSTANTS,
  accordionTokens,
  ACCORDION_CONSTANTS,
  collapsibleTokens,
  COLLAPSIBLE_CONSTANTS,
  carouselTokens,
  CAROUSEL_CONSTANTS,
  swipeableRowTokens,
  SWIPEABLE_ROW_CONSTANTS,
  authBlockTokens,
  stateBlockTokens,
  profileBlockTokens,
  settingsBlockTokens,
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
