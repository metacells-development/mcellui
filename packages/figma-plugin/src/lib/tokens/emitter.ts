/**
 * nativeui Figma Plugin - Config Emitter
 *
 * Generiert die nativeui.config.ts Datei aus transformierten Tokens.
 * WICHTIG: Keine Template Literals verwenden - Figma Sandbox unterstützt diese nicht!
 */

import type { NativeUIThemeConfig } from '../types';

// ============================================================================
// Helper Functions (Template Literal Replacement)
// ============================================================================

function spaces(count: number): string {
  var result = '';
  for (var i = 0; i < count; i++) {
    result += ' ';
  }
  return result;
}

function quote(str: string): string {
  return "'" + str + "'";
}

// ============================================================================
// Main Emit Function
// ============================================================================

export function generateConfigFile(config: NativeUIThemeConfig): string {
  var configContent = formatConfigObject(config, 2);

  return "import { defineConfig } from '@nativeui/core';\n\nexport default defineConfig({\n  theme: " + configContent + ",\n});\n";
}

// ============================================================================
// Formatting Functions
// ============================================================================

function formatConfigObject(obj: unknown, indent: number): string {
  if (obj === null || obj === undefined) {
    return 'undefined';
  }

  if (typeof obj === 'string') {
    return quote(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    var items = obj.map(function(item) { return formatConfigObject(item, indent + 2); });
    return '[\n' + spaces(indent + 2) + items.join(',\n' + spaces(indent + 2)) + '\n' + spaces(indent) + ']';
  }

  if (typeof obj === 'object') {
    var entries = Object.entries(obj as Record<string, unknown>);

    if (entries.length === 0) {
      return '{}';
    }

    var lines: string[] = [];
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      var formattedKey = isValidIdentifier(key) ? key : quote(key);
      var formattedValue = formatConfigObject(value, indent + 2);
      lines.push(spaces(indent + 2) + formattedKey + ': ' + formattedValue);
    }

    return '{\n' + lines.join(',\n') + ',\n' + spaces(indent) + '}';
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
  var lines: string[] = [':root {'];

  // Colors
  if (config.colors?.light) {
    lines.push('  /* Light Mode Colors */');
    var lightColors = Object.entries(config.colors.light);
    for (var i = 0; i < lightColors.length; i++) {
      var key = lightColors[i][0];
      var value = lightColors[i][1];
      lines.push('  --color-' + toKebabCase(key) + ': ' + value + ';');
    }
  }

  // Spacing
  if (config.spacing) {
    lines.push('');
    lines.push('  /* Spacing */');
    var spacingEntries = Object.entries(config.spacing);
    for (var j = 0; j < spacingEntries.length; j++) {
      var sKey = spacingEntries[j][0];
      var sValue = spacingEntries[j][1];
      lines.push('  --spacing-' + sKey + ': ' + sValue + 'px;');
    }
  }

  // Radius
  if (config.radius) {
    lines.push('');
    lines.push('  /* Border Radius */');
    var radiusEntries = Object.entries(config.radius);
    for (var k = 0; k < radiusEntries.length; k++) {
      var rKey = radiusEntries[k][0];
      var rValue = radiusEntries[k][1];
      lines.push('  --radius-' + rKey + ': ' + rValue + 'px;');
    }
  }

  lines.push('}');

  // Dark Mode
  if (config.colors?.dark) {
    lines.push('');
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push('  :root {');
    lines.push('    /* Dark Mode Colors */');
    var darkColors = Object.entries(config.colors.dark);
    for (var m = 0; m < darkColors.length; m++) {
      var dKey = darkColors[m][0];
      var dValue = darkColors[m][1];
      lines.push('    --color-' + toKebabCase(dKey) + ': ' + dValue + ';');
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
