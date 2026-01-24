/**
 * Config file discovery for mcellui
 *
 * Searches for mcellui.config.ts or mcellui.config.js in the project root.
 */

import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE_NAMES = [
  'mcellui.config.ts',
  'mcellui.config.js',
  'mcellui.config.mjs',
  'nativeui.config.ts', // Legacy name
  'nativeui.config.js',
];

/**
 * Find the mcellui config file in the project root.
 * Returns the full path to the config file or null if not found.
 */
export function findConfigFile(projectRoot: string): string | null {
  for (const fileName of CONFIG_FILE_NAMES) {
    const configPath = path.join(projectRoot, fileName);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  return null;
}

/**
 * Check if a config file exists in the project.
 */
export function hasConfigFile(projectRoot: string): boolean {
  return findConfigFile(projectRoot) !== null;
}
