/**
 * defineConfig
 *
 * Helper function to define NativeUI configuration with type safety.
 * Use this in your `mcellui.config.ts` file.
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
 *     secondary: '#F3F4F6',
 *   },
 *   fonts: {
 *     heading: 'PlayfairDisplay_700Bold',
 *   },
 *   components: {
 *     button: {
 *       defaultVariant: 'default',
 *       defaultSize: 'md',
 *     },
 *   },
 * });
 * ```
 */

import { NativeUIConfig, ResolvedNativeUIConfig, defaultConfig } from './types';

/**
 * Define your NativeUI configuration with full type safety and autocomplete.
 *
 * @param config - Your configuration options
 * @returns The same config object (for type inference)
 */
export function defineConfig(config: NativeUIConfig): NativeUIConfig {
  return config;
}

/**
 * Resolve a partial config into a full config with defaults.
 *
 * @param config - Partial configuration
 * @returns Fully resolved configuration with defaults applied
 */
export function resolveConfig(config: NativeUIConfig = {}): ResolvedNativeUIConfig {
  return {
    // Runtime configuration
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
    // CLI configuration
    componentsPath: config.componentsPath ?? defaultConfig.componentsPath,
    utilsPath: config.utilsPath ?? defaultConfig.utilsPath,
    style: config.style ?? defaultConfig.style,
    aliases: {
      ...defaultConfig.aliases,
      ...config.aliases,
    },
  };
}
