/**
 * NativeUI CLI Config Types and Utilities
 *
 * Local copy of config types to avoid importing from @nativeui/core at runtime,
 * which would pull in react-native and cause bundling issues.
 */

// Theme preset names
export type ThemePreset =
  | 'zinc'
  | 'slate'
  | 'stone'
  | 'gray'
  | 'neutral'
  | 'blue'
  | 'green'
  | 'rose'
  | 'orange'
  | 'violet';

// Radius presets
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';

// Animation presets
export type AnimationPreset = 'subtle' | 'playful';

/**
 * NativeUI Configuration (simplified for CLI usage)
 */
export interface NativeUIConfig {
  // Runtime configuration
  theme?: ThemePreset;
  radius?: RadiusPreset;
  colorScheme?: 'light' | 'dark' | 'system';
  colors?: Record<string, string>;
  lightColors?: Record<string, string>;
  darkColors?: Record<string, string>;
  fonts?: {
    sans?: string;
    heading?: string;
    mono?: string;
  };
  haptics?: boolean;
  animationPreset?: AnimationPreset;
  components?: {
    button?: {
      defaultVariant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
      defaultSize?: 'sm' | 'md' | 'lg';
    };
    input?: {
      defaultSize?: 'sm' | 'md' | 'lg';
    };
    card?: {
      defaultVariant?: 'default' | 'elevated' | 'outlined';
    };
    badge?: {
      defaultVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
      defaultSize?: 'sm' | 'md' | 'lg';
    };
    avatar?: {
      defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    };
  };

  // CLI configuration
  componentsPath?: string;
  utilsPath?: string;
  style?: 'default' | 'ios' | 'material';
  aliases?: {
    components?: string;
    utils?: string;
  };
}

/**
 * Resolved configuration with all defaults applied.
 */
export interface ResolvedNativeUIConfig {
  theme: ThemePreset;
  radius: RadiusPreset;
  colorScheme: 'light' | 'dark' | 'system';
  colors: Record<string, string>;
  lightColors: Record<string, string>;
  darkColors: Record<string, string>;
  fonts: {
    sans?: string;
    heading?: string;
    mono?: string;
  };
  haptics: boolean;
  animationPreset: AnimationPreset;
  components: NonNullable<NativeUIConfig['components']>;
  componentsPath: string;
  utilsPath: string;
  style: 'default' | 'ios' | 'material';
  aliases: {
    components?: string;
    utils?: string;
  };
}

/**
 * Default configuration values.
 */
export const defaultConfig: ResolvedNativeUIConfig = {
  // Runtime defaults
  theme: 'zinc',
  radius: 'md',
  colorScheme: 'system',
  colors: {},
  lightColors: {},
  darkColors: {},
  fonts: {},
  haptics: true,
  animationPreset: 'subtle',
  components: {},
  // CLI defaults
  componentsPath: './components/ui',
  utilsPath: './lib/utils',
  style: 'default',
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
  },
};

/**
 * Resolve a partial config into a full config with defaults.
 */
export function resolveConfig(config: NativeUIConfig = {}): ResolvedNativeUIConfig {
  return {
    theme: config.theme ?? defaultConfig.theme,
    radius: config.radius ?? defaultConfig.radius,
    colorScheme: config.colorScheme ?? defaultConfig.colorScheme,
    colors: config.colors ?? defaultConfig.colors,
    lightColors: config.lightColors ?? defaultConfig.lightColors,
    darkColors: config.darkColors ?? defaultConfig.darkColors,
    fonts: config.fonts ?? defaultConfig.fonts,
    haptics: config.haptics ?? defaultConfig.haptics,
    animationPreset: config.animationPreset ?? defaultConfig.animationPreset,
    components: {
      ...defaultConfig.components,
      ...config.components,
    },
    componentsPath: config.componentsPath ?? defaultConfig.componentsPath,
    utilsPath: config.utilsPath ?? defaultConfig.utilsPath,
    style: config.style ?? defaultConfig.style,
    aliases: {
      ...defaultConfig.aliases,
      ...config.aliases,
    },
  };
}
