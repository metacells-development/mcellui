/**
 * nativeui Figma Plugin - Token Extractor
 *
 * Extrahiert Design Tokens aus Figma Variable Collections.
 */

import type {
  TokenCollection,
  CollectionInfo,
  ExtractOptions,
} from '../types';

// ============================================================================
// Collection Info
// ============================================================================

export async function getCollectionInfo(
  collection: VariableCollection
): Promise<CollectionInfo> {
  const variables = await getVariablesFromCollection(collection);

  // Token-Typen zählen
  let colorCount = 0;
  let spacingCount = 0;
  let radiusCount = 0;
  let typographyCount = 0;

  for (const variable of variables) {
    const category = categorizeVariable(variable);
    switch (category) {
      case 'color':
        colorCount++;
        break;
      case 'spacing':
        spacingCount++;
        break;
      case 'radius':
        radiusCount++;
        break;
      case 'typography':
        typographyCount++;
        break;
    }
  }

  return {
    id: collection.id,
    name: collection.name,
    modes: collection.modes.map((mode) => ({
      id: mode.modeId,
      name: mode.name,
    })),
    variableCount: variables.length,
    tokenCounts: {
      colors: colorCount,
      spacing: spacingCount,
      radius: radiusCount,
      typography: typographyCount,
    },
  };
}

// ============================================================================
// Token Extraction
// ============================================================================

export async function extractTokensFromCollection(
  collection: VariableCollection,
  options: ExtractOptions
): Promise<TokenCollection> {
  const variables = await getVariablesFromCollection(collection);

  // Mode IDs bestimmen
  const lightModeId = options.lightModeId || collection.defaultModeId;
  const darkModeId = options.darkModeId;

  // Ergebnis initialisieren
  const tokens: TokenCollection = {
    colors: { light: {}, dark: {} },
    spacing: {},
    radius: {},
  };

  for (const variable of variables) {
    const category = categorizeVariable(variable);
    const tokenName = normalizeTokenName(variable.name);

    switch (category) {
      case 'color':
        if (options.includeColors && variable.resolvedType === 'COLOR') {
          // Light Mode
          const lightValue = variable.valuesByMode[lightModeId];
          if (lightValue && isColorValue(lightValue)) {
            tokens.colors.light[tokenName] = rgbaToHex(lightValue);
          }

          // Dark Mode (falls vorhanden)
          if (darkModeId) {
            const darkValue = variable.valuesByMode[darkModeId];
            if (darkValue && isColorValue(darkValue)) {
              tokens.colors.dark[tokenName] = rgbaToHex(darkValue);
            }
          }
        }
        break;

      case 'spacing':
        if (options.includeSpacing && variable.resolvedType === 'FLOAT') {
          const value = variable.valuesByMode[lightModeId];
          if (typeof value === 'number') {
            tokens.spacing[tokenName] = value;
          }
        }
        break;

      case 'radius':
        if (options.includeRadius && variable.resolvedType === 'FLOAT') {
          const value = variable.valuesByMode[lightModeId];
          if (typeof value === 'number') {
            tokens.radius[tokenName] = value;
          }
        }
        break;

      case 'typography':
        // Für später - Typography ist komplexer
        break;
    }
  }

  return tokens;
}

// ============================================================================
// Helper Functions
// ============================================================================

async function getVariablesFromCollection(
  collection: VariableCollection
): Promise<Variable[]> {
  const variables: Variable[] = [];

  for (const variableId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable) {
      variables.push(variable);
    }
  }

  return variables;
}

type TokenCategory = 'color' | 'spacing' | 'radius' | 'typography' | 'unknown';

function categorizeVariable(variable: Variable): TokenCategory {
  const name = variable.name.toLowerCase();
  const scopes = variable.scopes || [];

  // Nach Name kategorisieren
  if (
    name.includes('color') ||
    name.includes('foreground') ||
    name.includes('background') ||
    name.includes('border') ||
    name.includes('primary') ||
    name.includes('secondary') ||
    name.includes('muted') ||
    name.includes('accent') ||
    name.includes('destructive')
  ) {
    return 'color';
  }

  // Wenn es ein COLOR-Typ ist, wahrscheinlich ein Color Token
  if (variable.resolvedType === 'COLOR') {
    return 'color';
  }

  if (
    name.includes('spacing') ||
    name.includes('space') ||
    name.includes('gap') ||
    name.includes('padding') ||
    name.includes('margin')
  ) {
    return 'spacing';
  }

  if (
    name.includes('radius') ||
    name.includes('corner') ||
    name.includes('rounded')
  ) {
    return 'radius';
  }

  if (
    name.includes('font') ||
    name.includes('text') ||
    name.includes('line-height') ||
    name.includes('letter-spacing')
  ) {
    return 'typography';
  }

  // Nach Scopes kategorisieren
  if (scopes.includes('CORNER_RADIUS')) {
    return 'radius';
  }

  if (scopes.includes('GAP') || scopes.includes('WIDTH_HEIGHT')) {
    return 'spacing';
  }

  if (
    scopes.includes('STROKE_COLOR') ||
    scopes.includes('ALL_FILLS') ||
    scopes.includes('FRAME_FILL') ||
    scopes.includes('SHAPE_FILL') ||
    scopes.includes('TEXT_FILL')
  ) {
    return 'color';
  }

  return 'unknown';
}

function normalizeTokenName(name: string): string {
  // "Colors/Primary" -> "primary"
  // "colors/primary-foreground" -> "primaryForeground"
  // "Spacing/4" -> "4"

  // Pfad-Komponenten trennen und letzte nehmen oder konvertieren
  const parts = name.split('/');

  // Kategorie-Prefix entfernen falls vorhanden
  const lastPart = parts.length > 1 ? parts.slice(1).join('/') : parts[0];

  // Zu camelCase konvertieren
  return toCamelCase(lastPart);
}

function toCamelCase(str: string): string {
  // "primary-foreground" -> "primaryForeground"
  // "Primary Foreground" -> "primaryForeground"
  // "SPACING_4" -> "spacing4"

  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function isColorValue(value: unknown): value is ColorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    'g' in value &&
    'b' in value
  );
}

function rgbaToHex(color: ColorValue): string {
  var r = Math.round(color.r * 255);
  var g = Math.round(color.g * 255);
  var b = Math.round(color.b * 255);

  var hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

  // Alpha nur hinzufügen wenn nicht 1
  if (color.a !== undefined && color.a < 1) {
    var a = Math.round(color.a * 255);
    return hex + a.toString(16).padStart(2, '0');
  }

  return hex.toUpperCase();
}
