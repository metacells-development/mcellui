import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import createJiti from 'jiti';

const __filename = fileURLToPath(import.meta.url);

export type ProjectType = 'expo' | 'react-native' | 'unknown';

// Re-export config type from @nativeui/core for CLI usage
// The config is unified - same type for runtime and CLI
export type { NativeUIConfig, ResolvedNativeUIConfig } from '@nativeui/core';
import type { NativeUIConfig, ResolvedNativeUIConfig } from '@nativeui/core';
import { resolveConfig } from '@nativeui/core';

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
 * Get nativeui configuration from project.
 * Returns resolved config with all defaults applied.
 */
export async function getConfig(projectRoot: string): Promise<ResolvedNativeUIConfig | null> {
  // Try TypeScript config first
  const tsConfigPath = path.join(projectRoot, 'nativeui.config.ts');
  if (await fs.pathExists(tsConfigPath)) {
    return loadTsConfig(tsConfigPath);
  }

  // Try JavaScript config
  const jsConfigPath = path.join(projectRoot, 'nativeui.config.js');
  if (await fs.pathExists(jsConfigPath)) {
    return loadJsConfig(jsConfigPath);
  }

  // Try JSON config
  const jsonConfigPath = path.join(projectRoot, 'nativeui.config.json');
  if (await fs.pathExists(jsonConfigPath)) {
    const rawConfig = await fs.readJson(jsonConfigPath);
    return resolveConfig(rawConfig);
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
    const config = (rawConfig.default || rawConfig) as NativeUIConfig;
    return resolveConfig(config);
  } catch (error) {
    console.error('Failed to load config:', error);
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
    return resolveConfig(config);
  } catch (error) {
    console.error('Failed to load config:', error);
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
 * Check if a project has nativeui initialized
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
