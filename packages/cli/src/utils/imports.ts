/**
 * Import path transformation utilities
 *
 * Registry and installed components both use @metacells/mcellui-core directly.
 * This module only handles user-configured path aliases (like utils).
 */

import { ResolvedNativeUIConfig } from './project';

/**
 * Transform imports for user configuration (utils alias only)
 * Used when installing components via CLI
 */
export function transformToInstalled(code: string, config?: ResolvedNativeUIConfig): string {
  if (!config) return code;

  let result = code;

  // Handle utils alias if configured
  const utilsAlias = config.aliases?.utils || '@/lib/utils';
  if (utilsAlias !== '@/lib/utils') {
    result = result.replace(
      /from ['"]@\/lib\/utils['"]/g,
      `from '${utilsAlias}'`
    );
  }

  return result;
}

/**
 * Normalize content for comparison
 * Handles line endings and whitespace only
 */
export function normalizeForComparison(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/gm, '')  // Remove trailing whitespace per line
    .trim();
}
