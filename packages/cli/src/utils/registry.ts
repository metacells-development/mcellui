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
  displayName?: string;
  type: 'ui' | 'primitive' | 'hook' | 'block' | 'screen';
  description: string;
  category: string;
  status: 'stable' | 'beta' | 'experimental';
  files: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  expoGo?: boolean;
  /** Main props for this component (for CLI display) */
  props?: string[];
  /** Additional exports beyond the main component (e.g., CardHeader, useToast) */
  exports?: string[];
  /** Setup instructions for providers/hooks (e.g., "Wrap app in <ToastProvider>") */
  setup?: string;
}

export interface Registry {
  $schema?: string;
  schemaVersion?: string;
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
 * Set to empty string to force local mode
 */
const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/metacells-development/mcellui/main/packages/registry';

// Check if env var is explicitly set (even to empty string)
const hasEnvOverride = 'MCELLUI_REGISTRY_URL' in process.env || 'NATIVEUI_REGISTRY_URL' in process.env;
const REGISTRY_URL = hasEnvOverride
  ? (process.env.MCELLUI_REGISTRY_URL || process.env.NATIVEUI_REGISTRY_URL || '')
  : DEFAULT_REGISTRY_URL;

/**
 * Path to local registry (for development)
 */
function getLocalRegistryPath(): string {
  // In development, registry is sibling package
  // packages/cli/dist -> packages/cli -> packages/registry
  return path.resolve(__dirname, '..', '..', 'registry');
}

// --- Registry Functions ---

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is a transient network error that should be retried
 */
function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  // Check for DOMException (AbortError from timeout)
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  // For Node.js errors, check error codes and causes
  const err = error as any;
  const errorCodes = ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNABORTED'];

  // Check error.code directly
  if (err.code && errorCodes.includes(err.code)) {
    return true;
  }

  // Check error.message for error codes
  if (err.message && typeof err.message === 'string') {
    const message = err.message.toLowerCase();
    if (errorCodes.some((code) => message.includes(code.toLowerCase()))) {
      return true;
    }
  }

  // Check error.cause recursively
  if (err.cause) {
    return isNetworkError(err.cause);
  }

  return false;
}

/**
 * Fetch with retry logic and timeout
 * Retries transient network errors with exponential backoff
 */
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 30-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a network error or if we're out of attempts
      if (!isNetworkError(error) || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s (max 5s) + random jitter (0-200ms)
      const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      const jitter = Math.random() * 200;
      const delay = baseDelay + jitter;

      await sleep(delay);
    }
  }

  throw lastError;
}

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
    throw new Error(
      'Failed to load local registry: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Fetch registry from remote CDN
 */
async function getRemoteRegistry(): Promise<RegistryItem[]> {
  try {
    const response = await fetchWithRetry(`${REGISTRY_URL}/registry.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const registry = (await response.json()) as Registry;
    return registry.components;
  } catch (error) {
    throw new Error(
      'Failed to fetch registry: ' +
        (error instanceof Error ? error.message : String(error))
    );
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
      const response = await fetchWithRetry(`${REGISTRY_URL}/${filePath}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${filePath}: HTTP ${response.status} ${response.statusText}`
        );
      }

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
