/**
 * ConfigProvider
 *
 * Wraps ThemeProvider and automatically applies configuration from nativeui.config.ts.
 * This is the recommended way to set up NativeUI in your app.
 *
 * @example
 * ```tsx
 * // App.tsx
 * import { ConfigProvider } from '@nativeui/core';
 * import config from './nativeui.config';
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

// Config context for accessing raw config values
const ConfigContext = createContext<ResolvedNativeUIConfig | null>(null);

export interface ConfigProviderProps {
  /**
   * NativeUI configuration object.
   * Import from your nativeui.config.ts file.
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
 * ConfigProvider combines your nativeui.config.ts with ThemeProvider.
 * Use this as the root of your app for the easiest setup.
 */
export function ConfigProvider({
  config,
  colorScheme,
  theme,
  radius,
  children,
}: ConfigProviderProps) {
  // Resolve config with defaults
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);

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
