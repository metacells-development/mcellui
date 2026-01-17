/**
 * Registry utilities
 *
 * Fetches component data from the registry.
 * Supports local development (file system) and production (CDN).
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types ---

export interface RegistryItem {
  name: string;
  type: 'ui' | 'primitive' | 'hook' | 'block';
  description: string;
  category: string;
  status: 'stable' | 'beta' | 'experimental';
  files: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
}

export interface Registry {
  $schema?: string;
  name: string;
  version: string;
  components: RegistryItem[];
}

export interface ComponentData {
  name: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
}

// --- Configuration ---

/**
 * Base URL for production registry
 * Can be overridden with MCELLUI_REGISTRY_URL environment variable
 */
const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/metacells-development/mcellui/main/packages/registry';
const REGISTRY_URL = process.env.MCELLUI_REGISTRY_URL || process.env.NATIVEUI_REGISTRY_URL || DEFAULT_REGISTRY_URL;

/**
 * Path to local registry (for development)
 */
function getLocalRegistryPath(): string {
  // In development, registry is sibling package
  // packages/cli/dist -> packages/registry
  return path.resolve(__dirname, '..', '..', 'registry');
}

// --- Registry Functions ---

/**
 * Check if we should use local registry (development mode)
 */
function isLocalMode(): boolean {
  // Use local if no registry URL configured or in development
  if (REGISTRY_URL) return false;

  const localPath = getLocalRegistryPath();
  return fs.pathExistsSync(path.join(localPath, 'registry.json'));
}

/**
 * Get all available components in the registry
 */
export async function getRegistry(): Promise<RegistryItem[]> {
  if (isLocalMode()) {
    return getLocalRegistry();
  }
  return getRemoteRegistry();
}

/**
 * Load registry from local file system
 */
async function getLocalRegistry(): Promise<RegistryItem[]> {
  const registryPath = path.join(getLocalRegistryPath(), 'registry.json');

  try {
    const registry: Registry = await fs.readJson(registryPath);
    return registry.components;
  } catch (error) {
    console.error('Failed to load local registry:', error);
    return [];
  }
}

/**
 * Fetch registry from remote CDN
 */
async function getRemoteRegistry(): Promise<RegistryItem[]> {
  try {
    const response = await fetch(`${REGISTRY_URL}/registry.json`);
    const registry = (await response.json()) as Registry;
    return registry.components;
  } catch (error) {
    console.error('Failed to fetch remote registry:', error);
    return [];
  }
}

/**
 * Fetch a single component's code and metadata
 */
export async function fetchComponent(name: string): Promise<ComponentData | null> {
  const registry = await getRegistry();
  const item = registry.find((i) => i.name === name);

  if (!item) {
    return null;
  }

  if (isLocalMode()) {
    return fetchLocalComponent(item);
  }
  return fetchRemoteComponent(item);
}

/**
 * Fetch component from local file system
 */
async function fetchLocalComponent(item: RegistryItem): Promise<ComponentData> {
  const registryPath = getLocalRegistryPath();

  const files = await Promise.all(
    item.files.map(async (filePath) => {
      const fullPath = path.join(registryPath, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const name = path.basename(filePath);

      return { name, content };
    })
  );

  return {
    name: item.name,
    files,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
  };
}

/**
 * Fetch component from remote CDN
 */
async function fetchRemoteComponent(item: RegistryItem): Promise<ComponentData> {
  const files = await Promise.all(
    item.files.map(async (filePath) => {
      const response = await fetch(`${REGISTRY_URL}/${filePath}`);
      const content = await response.text();
      const name = path.basename(filePath);

      return { name, content };
    })
  );

  return {
    name: item.name,
    files,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
  };
}

/**
 * Get components by category
 */
export async function getComponentsByCategory(): Promise<Map<string, RegistryItem[]>> {
  const registry = await getRegistry();
  const byCategory = new Map<string, RegistryItem[]>();

  for (const item of registry) {
    const category = item.category || 'Other';
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(item);
  }

  return byCategory;
}

/**
 * Search components by name or description
 */
export async function searchComponents(query: string): Promise<RegistryItem[]> {
  const registry = await getRegistry();
  const lowerQuery = query.toLowerCase();

  return registry.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}
