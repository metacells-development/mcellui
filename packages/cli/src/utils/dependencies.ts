/**
 * Dependency resolution for components
 */

import { RegistryItem } from './registry';

interface DependencyResult {
  /** Components in dependency order (dependencies first) */
  resolved: string[];
  /** Circular dependency chain if detected */
  circular: string[] | null;
}

/**
 * Resolve all dependencies for a list of components.
 * Returns components in dependency order (dependencies first).
 *
 * @param components - Component names to resolve
 * @param registry - Full registry of available components
 */
export function resolveDependencies(
  components: string[],
  registry: RegistryItem[]
): DependencyResult {
  // Build a map for quick lookup
  const registryMap = new Map<string, RegistryItem>();
  for (const item of registry) {
    registryMap.set(item.name, item);
  }

  // Track resolved and currently processing
  const resolved = new Set<string>();
  const resolving = new Set<string>();
  const resolvedOrder: string[] = [];

  function resolve(name: string, path: string[]): string[] | null {
    // Already resolved
    if (resolved.has(name)) {
      return null;
    }

    // Circular dependency detected
    if (resolving.has(name)) {
      return [...path, name];
    }

    const item = registryMap.get(name);
    if (!item) {
      // Component not found in registry, skip
      return null;
    }

    resolving.add(name);

    // Resolve dependencies first
    const deps = item.registryDependencies || [];
    for (const dep of deps) {
      const circular = resolve(dep, [...path, name]);
      if (circular) {
        return circular;
      }
    }

    resolving.delete(name);
    resolved.add(name);
    resolvedOrder.push(name);

    return null;
  }

  // Resolve all requested components
  for (const name of components) {
    const circular = resolve(name, []);
    if (circular) {
      return {
        resolved: [],
        circular,
      };
    }
  }

  return {
    resolved: resolvedOrder,
    circular: null,
  };
}

/**
 * Get only the additional dependencies that need to be installed
 * (excludes already installed components)
 */
export function getNewDependencies(
  components: string[],
  registry: RegistryItem[],
  installedNames: Set<string>
): DependencyResult {
  const result = resolveDependencies(components, registry);

  if (result.circular) {
    return result;
  }

  // Filter out already installed
  const newComponents = result.resolved.filter(name => !installedNames.has(name));

  return {
    resolved: newComponents,
    circular: null,
  };
}

/**
 * Format circular dependency error for display
 */
export function formatCircularError(chain: string[]): string {
  return chain.join(' → ');
}
