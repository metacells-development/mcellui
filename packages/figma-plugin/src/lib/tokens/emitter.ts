/**
 * nativeui Figma Plugin - Config Emitter
 *
 * Generiert die nativeui.config.ts Datei aus transformierten Tokens.
 */

import type { NativeUIThemeConfig } from '../types';

// ============================================================================
// Main Emit Function
// ============================================================================

export function generateConfigFile(config: NativeUIThemeConfig): string {
  const configContent = formatConfigObject(config, 2);

  return `import { defineConfig } from '@nativeui/core';

export default defineConfig({
  theme: ${configContent},
});
`;
}

// ============================================================================
// Formatting Functions
// ============================================================================

function formatConfigObject(obj: unknown, indent: number): string {
  if (obj === null || obj === undefined) {
    return 'undefined';
  }

  if (typeof obj === 'string') {
    return `'${obj}'`;
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    const items = obj.map((item) => formatConfigObject(item, indent + 2));
    return `[\n${' '.repeat(indent + 2)}${items.join(`,\n${' '.repeat(indent + 2)}`)}\n${' '.repeat(indent)}]`;
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);

    if (entries.length === 0) {
      return '{}';
    }

    const lines = entries.map(([key, value]) => {
      const formattedKey = isValidIdentifier(key) ? key : `'${key}'`;
      const formattedValue = formatConfigObject(value, indent + 2);
      return `${' '.repeat(indent + 2)}${formattedKey}: ${formattedValue}`;
    });

    return `{\n${lines.join(',\n')},\n${' '.repeat(indent)}}`;
  }

  return String(obj);
}

function isValidIdentifier(key: string): boolean {
  // Prüft ob der Key ein gültiger JavaScript Identifier ist
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

// ============================================================================
// Alternative Output Formats
// ============================================================================

/**
 * Generiert nur die Theme-Overrides (ohne defineConfig Wrapper)
 */
export function generateThemeOverrides(config: NativeUIThemeConfig): string {
  return formatConfigObject(config, 0);
}

/**
 * Generiert JSON-Format (für andere Tools)
 */
export function generateJSON(config: NativeUIThemeConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Generiert CSS Custom Properties (für Referenz)
 */
export function generateCSSVariables(config: NativeUIThemeConfig): string {
  const lines: string[] = [':root {'];

  // Colors
  if (config.colors?.light) {
    lines.push('  /* Light Mode Colors */');
    for (const [key, value] of Object.entries(config.colors.light)) {
      lines.push(`  --color-${toKebabCase(key)}: ${value};`);
    }
  }

  // Spacing
  if (config.spacing) {
    lines.push('');
    lines.push('  /* Spacing */');
    for (const [key, value] of Object.entries(config.spacing)) {
      lines.push(`  --spacing-${key}: ${value}px;`);
    }
  }

  // Radius
  if (config.radius) {
    lines.push('');
    lines.push('  /* Border Radius */');
    for (const [key, value] of Object.entries(config.radius)) {
      lines.push(`  --radius-${key}: ${value}px;`);
    }
  }

  lines.push('}');

  // Dark Mode
  if (config.colors?.dark) {
    lines.push('');
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push('  :root {');
    lines.push('    /* Dark Mode Colors */');
    for (const [key, value] of Object.entries(config.colors.dark)) {
      lines.push(`    --color-${toKebabCase(key)}: ${value};`);
    }
    lines.push('  }');
    lines.push('}');
  }

  return lines.join('\n');
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
