/**
 * ConfigProvider
 *
 * Wraps ThemeProvider and automatically applies configuration from mcellui.config.ts.
 * This is the recommended way to set up NativeUI in your app.
 *
 * @example
 * ```tsx
 * // App.tsx - with auto-config (requires metro-plugin)
 * import { ConfigProvider } from '@metacells/mcellui-core';
 *
 * export default function App() {
 *   return (
 *     <ConfigProvider>
 *       <YourApp />
 *     </ConfigProvider>
 *   );
 * }
 *
 * // App.tsx - with explicit config
 * import { ConfigProvider } from '@metacells/mcellui-core';
 * import config from './mcellui.config';
 *
 * export default function App() {
 *   return (
 *     <ConfigProvider config={config}>
 *       <YourApp />
 *     </ConfigProvider>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ThemeProvider, ThemeProviderProps } from '../theme/ThemeProvider';
import { NativeUIConfig, ResolvedNativeUIConfig } from './types';
import { resolveConfig } from './defineConfig';

// Lazy-loaded auto-config to avoid circular dependency
// The config is loaded on first access, not at module initialization
let autoConfig: NativeUIConfig | null = null;

function getAutoConfig(): NativeUIConfig {
  if (autoConfig === null) {
    try {
      // This module is resolved by @metacells/mcellui-metro-plugin
      // to either the user's config file or an empty default
      autoConfig = require('@mcellui/auto-config').default ?? {};
    } catch {
      // Metro plugin not configured, use empty default
      autoConfig = {};
    }
  }
  return autoConfig;
}

// Config context for accessing raw config values
const ConfigContext = createContext<ResolvedNativeUIConfig | null>(null);

export interface ConfigProviderProps {
  /**
   * NativeUI configuration object.
   * Import from your mcellui.config.ts file.
   */
  config?: NativeUIConfig;

  /**
   * Override the color scheme preference.
   * Takes precedence over config.colorScheme.
   */
  colorScheme?: 'light' | 'dark' | 'system';

  /**
   * Override the theme preset.
   * Takes precedence over config.theme.
   */
  theme?: ThemeProviderProps['theme'];

  /**
   * Override the radius preset.
   * Takes precedence over config.radius.
   */
  radius?: ThemeProviderProps['radius'];

  /**
   * Children components.
   */
  children: ReactNode;
}

/**
 * ConfigProvider combines your mcellui.config.ts with ThemeProvider.
 * Use this as the root of your app for the easiest setup.
 *
 * If no config is provided and @metacells/mcellui-metro-plugin is set up,
 * it will automatically load your mcellui.config.ts file.
 */
export function ConfigProvider({
  config,
  colorScheme,
  theme,
  radius,
  children,
}: ConfigProviderProps) {
  // Use provided config, or fall back to auto-discovered config
  const effectiveConfig = config ?? getAutoConfig();

  // Resolve config with defaults
  const resolvedConfig = useMemo(() => resolveConfig(effectiveConfig), [effectiveConfig]);

  // Props can override config values
  const finalTheme = theme ?? resolvedConfig.theme;
  const finalRadius = radius ?? resolvedConfig.radius;
  const finalColorScheme = colorScheme ?? resolvedConfig.colorScheme;

  return (
    <ConfigContext.Provider value={resolvedConfig}>
      <ThemeProvider
        defaultColorScheme={finalColorScheme}
        theme={finalTheme}
        radius={finalRadius}
        colors={resolvedConfig.colors}
        lightColors={resolvedConfig.lightColors}
        darkColors={resolvedConfig.darkColors}
        fonts={resolvedConfig.fonts}
      >
        {children}
      </ThemeProvider>
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access the raw NativeUI configuration.
 * Useful for accessing component defaults and other config values.
 *
 * @example
 * ```tsx
 * const config = useConfig();
 * const defaultButtonSize = config.components.button?.defaultSize ?? 'md';
 * ```
 */
export function useConfig(): ResolvedNativeUIConfig {
  const config = useContext(ConfigContext);

  if (!config) {
    // Return default config if no provider
    return resolveConfig({});
  }

  return config;
}
