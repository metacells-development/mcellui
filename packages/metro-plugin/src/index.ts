/**
 * mcellui Metro Plugin
 *
 * Provides automatic config discovery for mcellui.
 * When wrapped around your metro config, it enables importing
 * `@mcellui/auto-config` which resolves to either your mcellui.config.ts
 * or an empty default config.
 *
 * @example
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config');
 * const { withMcellUI } = require('@metacells/mcellui-metro-plugin');
 *
 * const config = getDefaultConfig(__dirname);
 * module.exports = withMcellUI(config);
 * ```
 */

import * as path from 'path';
import { findConfigFile } from './findConfig';

// Virtual module name that components can import
const AUTO_CONFIG_MODULE = '@mcellui/auto-config';

// Path to the empty config fallback
const EMPTY_CONFIG_PATH = path.join(__dirname, 'emptyConfig.js');

interface MetroResolver {
  (context: ResolverContext, moduleName: string, platform: string | null): Resolution | null;
}

interface ResolverContext {
  originModulePath: string;
  resolveRequest: MetroResolver;
  [key: string]: unknown;
}

interface Resolution {
  filePath: string;
  type: 'sourceFile' | 'assetFile' | 'empty';
}

interface MetroConfig {
  projectRoot?: string;
  resolver?: {
    resolveRequest?: MetroResolver;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Wraps your Metro config to enable auto-config discovery.
 *
 * This allows components to import `@mcellui/auto-config` which will
 * automatically resolve to your mcellui.config.ts (if it exists)
 * or a default empty config.
 *
 * @param config - Your Metro config (from getDefaultConfig or similar)
 * @returns The enhanced Metro config
 *
 * @example
 * ```js
 * const { getDefaultConfig } = require('expo/metro-config');
 * const { withMcellUI } = require('@metacells/mcellui-metro-plugin');
 *
 * module.exports = withMcellUI(getDefaultConfig(__dirname));
 * ```
 */
export function withMcellUI(config: MetroConfig): MetroConfig {
  const projectRoot = config.projectRoot || process.cwd();
  const originalResolveRequest = config.resolver?.resolveRequest;

  // Find config once at startup
  const userConfigPath = findConfigFile(projectRoot);

  return {
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest: (
        context: ResolverContext,
        moduleName: string,
        platform: string | null
      ): Resolution | null => {
        // Intercept the virtual module
        if (moduleName === AUTO_CONFIG_MODULE) {
          return {
            filePath: userConfigPath || EMPTY_CONFIG_PATH,
            type: 'sourceFile',
          };
        }

        // Fall back to original resolver or default behavior
        if (originalResolveRequest) {
          return originalResolveRequest(context, moduleName, platform);
        }

        // Let Metro handle it normally
        return context.resolveRequest(context, moduleName, platform);
      },
    },
  };
}

// Also export as withNativeUI for backwards compatibility
export const withNativeUI = withMcellUI;

// Export utility functions
export { findConfigFile, hasConfigFile } from './findConfig';
