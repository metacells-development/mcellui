// Theme System (primary API)
export {
  // Colors
  palette,
  lightColors,
  darkColors,
  type ThemeColors,
  type ColorKey,
  // Spacing
  spacing as themeSpacing,
  type SpacingKey as ThemeSpacingKey,
  type SpacingValue,
  // Radius
  radius as themeRadius,
  componentRadius,
  createRadius,
  createComponentRadius,
  radiusPresetBase,
  defaultRadiusPreset,
  type RadiusKey as ThemeRadiusKey,
  type RadiusValue,
  type RadiusPreset,
  type RadiusTokens,
  type ComponentRadiusKey,
  type ComponentRadiusTokens,
  // Fonts
  defaultFonts,
  systemFonts,
  createTypography,
  type Fonts,
  type Typography,
  // Typography
  fontSize as themeFontSize,
  fontWeight as themeFontWeight,
  lineHeight as themeLineHeight,
  letterSpacing as themeLetterSpacing,
  fontFamily,
  geistFontFamily,
  typography,
  type FontSizeKey,
  type FontWeightKey,
  type LineHeightKey,
  type LetterSpacingKey,
  type FontFamilyKey,
  type GeistFontFamilyKey,
  type TypographyKey,
  // Shadows
  getShadow,
  getPlatformShadow,
  shadows,
  type ShadowStyle,
  type ShadowSize,
  // Animations
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
  // Component Tokens
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
  cardBlockTokens,
  socialBlockTokens,
  productBlockTokens,
  ecommerceBlockTokens,
  infoBlockTokens,
  calendarTokens,
  dateTimePickerTokens,
  formTokens,
  imageGalleryTokens,
  paginationTokens,
  storiesTokens,
  searchInputTokens,
  type ComponentSize,
  // Theme Presets
  themePresets,
  defaultThemePreset,
  getPresetColors,
  getPresetColorsForMode,
  type ThemePreset,
  type PresetColors,
  // Provider & Hooks
  ThemeProvider,
  useTheme,
  useColorSchemeValue,
  useIsDark,
  type Theme,
  type ThemeProviderProps,
  type ColorScheme,
  type ColorSchemePreference,
} from './theme';

// Design Tokens (legacy - prefer theme)
// Export only non-conflicting tokens
export {
  colors as legacyColors,
  type Colors as LegacyColors,
} from './tokens/colors';
export { spacing, type Spacing, type SpacingKey } from './tokens/spacing';
export {
  fontFamily as legacyFontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  type FontFamily,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type LetterSpacing,
} from './tokens/typography';
export { radius, type Radius, type RadiusKey } from './tokens/radius';
export {
  shadows as legacyShadows,
  type Shadows as LegacyShadows,
  type ShadowKey,
} from './tokens/shadows';

// Configuration
export {
  defineConfig,
  resolveConfig,
  ConfigProvider,
  useConfig,
  defaultConfig,
  type NativeUIConfig,
  type ResolvedNativeUIConfig,
} from './config';

// Utilities
export * from './utils';

// Primitives
export * from './primitives';

// Components (Error Boundaries, etc.)
export * from './components';

// Constants (Magic Numbers)
export * from './constants';
