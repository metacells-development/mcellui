/**
 * Token Importer - Code → Figma
 *
 * Importiert mcellui Tokens als Figma Variables.
 */

import { lightColors, darkColors, spacing, radius } from '../data/tokens';

// =============================================================================
// Types
// =============================================================================

export interface ImportResult {
  success: boolean;
  collectionsCreated: number;
  variablesCreated: number;
  errors: string[];
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Konvertiert Hex-Farbe zu Figma RGB (0-1 Range)
 */
function hexToFigmaRGB(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/**
 * Erstellt einen validen Figma Variable Namen (Slashes für Gruppierung)
 */
function toVariableName(group: string, name: string): string {
  // Figma nutzt "/" für Gruppierung
  return group + '/' + name;
}

// =============================================================================
// Color Import
// =============================================================================

/**
 * Importiert alle Color Tokens als Figma Variables
 */
export async function importColorTokens(): Promise<{
  collection: VariableCollection;
  variables: Variable[];
  lightModeId: string;
  darkModeId: string;
}> {
  // Erstelle Collection
  const collection = figma.variables.createVariableCollection('mcellui/colors');

  // Benenne den ersten Mode um zu "Light"
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, 'Light');

  // Füge Dark Mode hinzu
  const darkModeId = collection.addMode('Dark');

  const variables: Variable[] = [];

  // Iteriere durch alle Color Keys
  const colorKeys = Object.keys(lightColors) as (keyof typeof lightColors)[];

  for (const key of colorKeys) {
    const lightValue = lightColors[key];
    const darkValue = darkColors[key];

    // Bestimme die Gruppe basierend auf dem Key-Prefix
    let group = 'other';
    if (key.startsWith('background')) group = 'background';
    else if (key.startsWith('foreground')) group = 'foreground';
    else if (key.startsWith('border')) group = 'border';
    else if (key.startsWith('primary')) group = 'primary';
    else if (key.startsWith('secondary')) group = 'secondary';
    else if (key.startsWith('destructive')) group = 'destructive';
    else if (key.startsWith('success')) group = 'success';
    else if (key.startsWith('warning')) group = 'warning';
    else if (key.startsWith('error')) group = 'error';
    else if (key.startsWith('card')) group = 'card';
    else if (key.startsWith('input')) group = 'input';

    const variableName = toVariableName(group, key);

    // Erstelle Variable (collection object statt ID für incremental mode)
    const variable = figma.variables.createVariable(
      variableName,
      collection,
      'COLOR'
    );

    // Setze Werte für beide Modes
    variable.setValueForMode(lightModeId, hexToFigmaRGB(lightValue));
    variable.setValueForMode(darkModeId, hexToFigmaRGB(darkValue));

    variables.push(variable);
  }

  return { collection, variables, lightModeId, darkModeId };
}

// =============================================================================
// Spacing Import
// =============================================================================

/**
 * Importiert alle Spacing Tokens als Figma Variables
 */
export async function importSpacingTokens(): Promise<{
  collection: VariableCollection;
  variables: Variable[];
}> {
  const collection = figma.variables.createVariableCollection('mcellui/spacing');

  // Spacing hat keine Modes - nur einen Default Mode
  const modeId = collection.modes[0].modeId;
  collection.renameMode(modeId, 'Default');

  const variables: Variable[] = [];

  for (const [key, value] of Object.entries(spacing)) {
    // Ersetze Punkte durch Bindestriche (z.B. "0.5" -> "0-5")
    var safeName = key.replace('.', '-');
    var variableName = 'spacing/' + safeName;

    const variable = figma.variables.createVariable(
      variableName,
      collection,
      'FLOAT'
    );

    variable.setValueForMode(modeId, value);
    variables.push(variable);
  }

  return { collection, variables };
}

// =============================================================================
// Radius Import
// =============================================================================

/**
 * Importiert alle Radius Tokens als Figma Variables
 */
export async function importRadiusTokens(): Promise<{
  collection: VariableCollection;
  variables: Variable[];
}> {
  const collection = figma.variables.createVariableCollection('mcellui/radius');

  const modeId = collection.modes[0].modeId;
  collection.renameMode(modeId, 'Default');

  const variables: Variable[] = [];

  for (const [key, value] of Object.entries(radius)) {
    // Skip "full" da 9999 in Figma keinen Sinn macht
    if (key === 'full') continue;

    var variableName = 'radius/' + key;

    const variable = figma.variables.createVariable(
      variableName,
      collection,
      'FLOAT'
    );

    variable.setValueForMode(modeId, value);
    variables.push(variable);
  }

  return { collection, variables };
}

// =============================================================================
// Full Import
// =============================================================================

/**
 * Importiert alle mcellui Tokens nach Figma
 */
export async function importAllTokens(): Promise<ImportResult> {
  const errors: string[] = [];
  let collectionsCreated = 0;
  let variablesCreated = 0;

  try {
    // Colors
    const colorResult = await importColorTokens();
    collectionsCreated++;
    variablesCreated += colorResult.variables.length;

    // Spacing
    const spacingResult = await importSpacingTokens();
    collectionsCreated++;
    variablesCreated += spacingResult.variables.length;

    // Radius
    const radiusResult = await importRadiusTokens();
    collectionsCreated++;
    variablesCreated += radiusResult.variables.length;

    return {
      success: true,
      collectionsCreated,
      variablesCreated,
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      collectionsCreated,
      variablesCreated,
      errors,
    };
  }
}

// =============================================================================
// Check Existing
// =============================================================================

/**
 * Prüft ob mcellui Collections bereits existieren
 */
export async function checkExistingCollections(): Promise<{
  hasColors: boolean;
  hasSpacing: boolean;
  hasRadius: boolean;
}> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  return {
    hasColors: collections.some((c) => c.name === 'mcellui/colors'),
    hasSpacing: collections.some((c) => c.name === 'mcellui/spacing'),
    hasRadius: collections.some((c) => c.name === 'mcellui/radius'),
  };
}

/**
 * Löscht alle mcellui Collections
 */
export async function deleteExistingCollections(): Promise<void> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  for (const collection of collections) {
    if (collection.name.startsWith('mcellui/')) {
      collection.remove();
    }
  }
}
