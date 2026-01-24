/**
 * NativeUI Configuration Types
 *
 * Define your app's design system in a single config file.
 * Similar to tailwind.config.js but for React Native.
 *
 * @example
 * ```ts
 * // mcellui.config.ts
 * import { defineConfig } from '@metacells/mcellui-core';
 *
 * export default defineConfig({
 *   theme: 'blue',
 *   radius: 'lg',
 *   colors: {
 *     primary: '#6366F1',
 *   },
 * });
 * ```
 */

import type { ThemePreset } from '../theme/presets';
import type { RadiusPreset } from '../theme/radius';
import type { ThemeColors } from '../theme/colors';
import type { Fonts } from '../theme/typography';
import type { AnimationPreset } from '../theme/animations';

/**
 * NativeUI configuration object.
 * Place in `mcellui.config.ts` at your project root.
 */
export interface NativeUIConfig {
  // ============================================
  // Runtime Configuration (used by ConfigProvider)
  // ============================================

  /**
   * Color theme preset.
   * @default 'zinc'
   */
  theme?: ThemePreset;

  /**
   * Border radius preset.
   * Controls roundness of all components.
   * @default 'md'
   */
  radius?: RadiusPreset;

  /**
   * Default color scheme preference.
   * @default 'system'
   */
  colorScheme?: 'light' | 'dark' | 'system';

  /**
   * Color overrides (applied to both light and dark modes).
   */
  colors?: Partial<ThemeColors>;

  /**
   * Light mode specific color overrides.
   */
  lightColors?: Partial<ThemeColors>;

  /**
   * Dark mode specific color overrides.
   */
  darkColors?: Partial<ThemeColors>;

  /**
   * Font configuration.
   */
  fonts?: Partial<Fonts>;

  /**
   * Enable or disable haptic feedback globally.
   * @default true
   */
  haptics?: boolean;

  /**
   * Animation preset.
   * Controls the overall feel of animations throughout the app.
   * - `subtle`: Professional, smooth animations with minimal overshoot
   * - `playful`: Bouncy, energetic animations with more personality
   * @default 'subtle'
   */
  animationPreset?: AnimationPreset;

  /**
   * Component-specific overrides.
   * Override default sizes, padding, etc.
   */
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

  // ============================================
  // CLI Configuration (used by `npx mcellui add`)
  // ============================================

  /**
   * Path where components will be installed.
   * @default './components/ui'
   */
  componentsPath?: string;

  /**
   * Path where utilities (cn, etc.) will be installed.
   * @default './lib/utils'
   */
  utilsPath?: string;

  /**
   * Style preset for components.
   * @default 'default'
   */
  style?: 'default' | 'ios' | 'material';

  /**
   * Path aliases for imports.
   */
  aliases?: {
    /** Alias for components directory */
    components?: string;
    /** Alias for utils directory */
    utils?: string;
  };
}

/**
 * Resolved configuration with all defaults applied.
 */
export interface ResolvedNativeUIConfig extends Required<Omit<NativeUIConfig, 'colors' | 'lightColors' | 'darkColors' | 'fonts' | 'components' | 'aliases' | 'haptics' | 'animationPreset'>> {
  colors: Partial<ThemeColors>;
  lightColors: Partial<ThemeColors>;
  darkColors: Partial<ThemeColors>;
  fonts: Partial<Fonts>;
  haptics: boolean;
  animationPreset: AnimationPreset;
  components: NonNullable<NativeUIConfig['components']>;
  aliases: NonNullable<NativeUIConfig['aliases']>;
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
