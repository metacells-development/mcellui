/**
 * Utilities for working with installed components
 */

import fs from 'fs-extra';
import path from 'path';
import { RegistryItem, fetchComponent } from './registry';
import { ResolvedNativeUIConfig } from './project';
import { normalizeForComparison } from './imports';

export type ComponentStatus = 'identical' | 'modified' | 'local-only';

export interface InstalledComponent {
  name: string;
  fileName: string;
  status: ComponentStatus;
  localPath: string;
}

/**
 * Get list of installed component files
 */
export async function getInstalledFiles(componentsDir: string): Promise<string[]> {
  if (!await fs.pathExists(componentsDir)) {
    return [];
  }

  const files = await fs.readdir(componentsDir);
  const componentFiles: string[] = [];

  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Skip index files
      if (file === 'index.ts' || file === 'index.tsx') {
        continue;
      }
      componentFiles.push(path.join(componentsDir, file));
    }
  }

  return componentFiles.sort();
}

// Re-export from imports.ts for backwards compatibility
export { normalizeForComparison, transformToInstalled } from './imports';

/**
 * Get install status for a list of installed files
 */
export async function getInstallStatus(
  installedFiles: string[],
  registry: RegistryItem[],
  config: ResolvedNativeUIConfig
): Promise<InstalledComponent[]> {
  const results: InstalledComponent[] = [];

  // Create registry map
  const registryMap = new Map<string, RegistryItem>();
  for (const item of registry) {
    for (const file of item.files) {
      const fileName = path.basename(file);
      registryMap.set(fileName, item);
    }
  }

  for (const localFile of installedFiles) {
    const fileName = path.basename(localFile);
    const componentName = fileName.replace(/\.tsx?$/, '');
    const registryItem = registryMap.get(fileName);

    if (!registryItem) {
      // Local-only component (not in registry)
      results.push({
        name: componentName,
        fileName,
        status: 'local-only',
        localPath: localFile,
      });
      continue;
    }

    try {
      // Fetch registry component
      const component = await fetchComponent(registryItem.name);

      if (!component) {
        results.push({
          name: registryItem.name,
          fileName,
          status: 'modified', // Assume modified if we can't verify
          localPath: localFile,
        });
        continue;
      }

      // Find matching file
      const registryFile = component.files.find(f => f.name === fileName);

      if (!registryFile) {
        results.push({
          name: registryItem.name,
          fileName,
          status: 'modified',
          localPath: localFile,
        });
        continue;
      }

      // Read local file
      const localContent = await fs.readFile(localFile, 'utf-8');

      // Normalize both contents for comparison (handles whitespace + import paths)
      const normalizedLocal = normalizeForComparison(localContent);
      const normalizedRegistry = normalizeForComparison(registryFile.content);

      results.push({
        name: registryItem.name,
        fileName,
        status: normalizedLocal === normalizedRegistry ? 'identical' : 'modified',
        localPath: localFile,
      });
    } catch {
      results.push({
        name: registryItem.name,
        fileName,
        status: 'modified', // Assume modified on error
        localPath: localFile,
      });
    }
  }

  return results;
}

/**
 * Get names of installed components
 */
export function getInstalledNames(installedFiles: string[]): string[] {
  return installedFiles.map(file => {
    const fileName = path.basename(file);
    return fileName.replace(/\.tsx?$/, '');
  });
}
