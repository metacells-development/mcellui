import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import createJiti from 'jiti';

const __filename = fileURLToPath(import.meta.url);

export type ProjectType = 'expo' | 'react-native' | 'unknown';

export type NativeUIConfig = {
  componentsPath: string;
  utilsPath: string;
  style: 'default' | 'ios' | 'material';
  aliases?: {
    components?: string;
    utils?: string;
  };
};

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
 * Get nativeui configuration from project
 */
export async function getConfig(projectRoot: string): Promise<NativeUIConfig | null> {
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
    return fs.readJson(jsonConfigPath);
  }

  return null;
}

/**
 * Load TypeScript configuration file using jiti
 */
async function loadTsConfig(configPath: string): Promise<NativeUIConfig> {
  try {
    const jiti = createJiti(__filename, {
      interopDefault: true,
    });

    const config = jiti(configPath);
    return (config.default || config) as NativeUIConfig;
  } catch (error) {
    console.error('Failed to load config:', error);
    // Return defaults on error
    return getDefaultConfig();
  }
}

/**
 * Load JavaScript configuration file
 */
async function loadJsConfig(configPath: string): Promise<NativeUIConfig> {
  try {
    const config = await import(configPath);
    return config.default || config;
  } catch (error) {
    console.error('Failed to load config:', error);
    return getDefaultConfig();
  }
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): NativeUIConfig {
  return {
    componentsPath: './components/ui',
    utilsPath: './lib/utils',
    style: 'default',
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
    },
  };
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
