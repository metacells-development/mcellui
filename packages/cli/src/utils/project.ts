import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import createJiti from 'jiti';
import chalk from 'chalk';
import { validateConfigOrThrow } from './config-schema.js';
import {
  resolveConfig,
  type NativeUIConfig,
  type ResolvedNativeUIConfig,
} from './config.js';

const __filename = fileURLToPath(import.meta.url);

export type ProjectType = 'expo' | 'react-native' | 'unknown';

// Re-export config types for CLI usage
export type { NativeUIConfig, ResolvedNativeUIConfig } from './config.js';

/**
 * Find the project root by looking for package.json
 */
export async function getProjectRoot(cwd: string): Promise<string | null> {
  let dir = cwd;

  while (dir !== path.dirname(dir)) {
    if (await fs.pathExists(path.join(dir, 'package.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }

  return null;
}

/**
 * Detect project type (Expo, React Native CLI, etc.)
 */
export async function detectProjectType(projectRoot: string): Promise<ProjectType> {
  try {
    const packageJson = await fs.readJson(path.join(projectRoot, 'package.json'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps['expo']) {
      return 'expo';
    }

    if (deps['react-native']) {
      return 'react-native';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Config file names in priority order.
 * mcellui.config.* is the new name, nativeui.config.* is legacy.
 */
const CONFIG_FILES = [
  'mcellui.config.ts',
  'mcellui.config.js',
  'mcellui.config.json',
  'nativeui.config.ts',  // Legacy
  'nativeui.config.js',  // Legacy
  'nativeui.config.json', // Legacy
];

/**
 * Get mcellui configuration from project.
 * Returns resolved config with all defaults applied.
 */
export async function getConfig(projectRoot: string): Promise<ResolvedNativeUIConfig | null> {
  for (const fileName of CONFIG_FILES) {
    const configPath = path.join(projectRoot, fileName);
    if (await fs.pathExists(configPath)) {
      if (fileName.endsWith('.ts')) {
        return loadTsConfig(configPath);
      } else if (fileName.endsWith('.js')) {
        return loadJsConfig(configPath);
      } else if (fileName.endsWith('.json')) {
        try {
          const rawConfig = await fs.readJson(configPath);
          const validatedConfig = validateConfigOrThrow(rawConfig, configPath);
          return resolveConfig(validatedConfig);
        } catch (error) {
          if (error instanceof Error && error.message.includes('Invalid configuration')) {
            console.error(chalk.red(error.message));
            throw error;
          }
          throw error;
        }
      }
    }
  }

  return null;
}

/**
 * Load TypeScript configuration file using jiti
 */
async function loadTsConfig(configPath: string): Promise<ResolvedNativeUIConfig> {
  try {
    const jiti = createJiti(__filename, {
      interopDefault: true,
    });

    const rawConfig = jiti(configPath);
    const config = rawConfig.default || rawConfig;

    // Validate config with Zod schema
    const validatedConfig = validateConfigOrThrow(config, configPath);

    return resolveConfig(validatedConfig);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid configuration')) {
      // Re-throw validation errors with full message
      console.error(chalk.red(error.message));
      throw error;
    }
    console.error(chalk.red('Failed to load config:'), error);
    // Return defaults on error
    return getDefaultConfig();
  }
}

/**
 * Load JavaScript configuration file
 */
async function loadJsConfig(configPath: string): Promise<ResolvedNativeUIConfig> {
  try {
    const rawConfig = await import(configPath);
    const config = rawConfig.default || rawConfig;

    // Validate config with Zod schema
    const validatedConfig = validateConfigOrThrow(config, configPath);

    return resolveConfig(validatedConfig);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid configuration')) {
      // Re-throw validation errors with full message
      console.error(chalk.red(error.message));
      throw error;
    }
    console.error(chalk.red('Failed to load config:'), error);
    return getDefaultConfig();
  }
}

/**
 * Get default configuration (resolved with all defaults)
 */
export function getDefaultConfig(): ResolvedNativeUIConfig {
  return resolveConfig({});
}

/**
 * Check if a project has mcellui initialized
 */
export async function isInitialized(projectRoot: string): Promise<boolean> {
  const config = await getConfig(projectRoot);
  return config !== null;
}

/**
 * Read package.json from project
 */
export async function readPackageJson(
  projectRoot: string
): Promise<Record<string, unknown> | null> {
  try {
    return await fs.readJson(path.join(projectRoot, 'package.json'));
  } catch {
    return null;
  }
}

/**
 * Detect the package manager used in the project
 */
export async function detectPackageManager(
  projectRoot: string
): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  // Check for lock files
  if (await fs.pathExists(path.join(projectRoot, 'bun.lockb'))) {
    return 'bun';
  }
  if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}
