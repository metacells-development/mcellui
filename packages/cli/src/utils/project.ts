import fs from 'fs-extra';
import path from 'path';

export type ProjectType = 'expo' | 'react-native' | 'unknown';

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
  const configPath = path.join(projectRoot, 'nativeui.config.ts');

  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  // For now, return defaults since we can't easily import TS config
  // In production, we'd use jiti or similar to load the config
  return {
    componentsPath: './components/ui',
    utilsPath: './lib/utils',
    style: 'default',
  };
}

export type NativeUIConfig = {
  componentsPath: string;
  utilsPath: string;
  style: 'default' | 'ios' | 'material';
  aliases?: {
    components?: string;
    utils?: string;
  };
};
