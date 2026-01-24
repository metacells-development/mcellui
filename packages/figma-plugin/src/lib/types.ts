/**
 * mcellui Figma Plugin - Type Definitions
 */

// ============================================================================
// Figma Variable Types
// ============================================================================

export interface FigmaVariableValue {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  type?: 'VARIABLE_ALIAS';
  id?: string;
}

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaVariableValue | number | string | boolean>;
  scopes: VariableScope[];
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
  variableIds: string[];
  defaultModeId: string;
}

// ============================================================================
// Token Types
// ============================================================================

export interface ColorToken {
  name: string;
  value: string; // hex string
  opacity?: number;
}

export interface SpacingToken {
  name: string;
  value: number;
}

export interface RadiusToken {
  name: string;
  value: number;
}

export interface TypographyToken {
  name: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface TokenCollection {
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
  typography?: Record<string, TypographyToken>;
}

// ============================================================================
// mcellui Config Types
// ============================================================================

export interface NativeUIThemeConfig {
  colors?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  spacing?: Record<string, number>;
  radius?: Record<string, number>;
  fonts?: {
    sans?: string;
    heading?: string;
    mono?: string;
  };
}

export interface NativeUIConfig {
  theme?: string | NativeUIThemeConfig;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  colorScheme?: 'light' | 'dark' | 'system';
}

// ============================================================================
// Plugin Message Types
// ============================================================================

export type PluginMessage =
  | { type: 'init' }
  | { type: 'get-collections' }
  | { type: 'extract-tokens'; collectionId: string; options: ExtractOptions }
  | { type: 'copy-config'; config: string }
  | { type: 'notify'; message: string; error?: boolean }
  // Import (Code → Figma)
  | { type: 'check-existing-collections' }
  | { type: 'import-tokens'; options: ImportOptions }
  | { type: 'delete-collections' }
  // Component Generation (Code → Figma)
  | { type: 'get-available-components' }
  | { type: 'check-existing-components' }
  | { type: 'generate-components'; componentNames: string[] }
  | { type: 'generate-all-components' }
  | { type: 'delete-components' };

export type UIMessage =
  | { type: 'collections'; collections: CollectionInfo[] }
  | { type: 'tokens-extracted'; tokens: TokenCollection; config: string }
  | { type: 'error'; message: string }
  | { type: 'success'; message: string }
  // Import (Code → Figma)
  | { type: 'existing-collections'; existing: ExistingCollections }
  | { type: 'import-complete'; result: ImportResult }
  // Component Generation (Code → Figma)
  | { type: 'available-components'; components: string[] }
  | { type: 'existing-components'; existing: ExistingComponents }
  | { type: 'components-generated'; result: ComponentGenerateResult };

export interface ExistingCollections {
  hasColors: boolean;
  hasSpacing: boolean;
  hasRadius: boolean;
}

export interface ImportOptions {
  includeColors: boolean;
  includeSpacing: boolean;
  includeRadius: boolean;
  overwrite: boolean;
}

export interface ImportResult {
  success: boolean;
  collectionsCreated: number;
  variablesCreated: number;
  errors: string[];
}

export interface ExistingComponents {
  exists: boolean;
  componentNames: string[];
}

export interface ComponentGenerateResult {
  success: boolean;
  componentsCreated: number;
  variantsCreated: number;
  errors: string[];
}

export interface CollectionInfo {
  id: string;
  name: string;
  modes: { id: string; name: string }[];
  variableCount: number;
  tokenCounts: {
    colors: number;
    spacing: number;
    radius: number;
    typography: number;
  };
}

export interface ExtractOptions {
  includeColors: boolean;
  includeSpacing: boolean;
  includeRadius: boolean;
  includeTypography: boolean;
  lightModeId?: string;
  darkModeId?: string;
}

// ============================================================================
// Component Types (for future Milestone 2)
// ============================================================================

export interface ComponentAnalysis {
  name: string;
  type: string;
  variants: {
    property: string;
    options: string[];
  }[];
  props: Record<string, unknown>;
  children: ComponentChild[];
}

export interface ComponentChild {
  name: string;
  type: 'text' | 'icon' | 'component' | 'frame';
  content?: string;
}

export interface ComponentMapping {
  component: string;
  props: Record<string, unknown>;
  variantMap?: Record<string, Record<string, unknown>>;
  sizeMap?: Record<string, string>;
}

// ============================================================================
// Plugin State
// ============================================================================

export interface PluginState {
  collections: CollectionInfo[];
  selectedCollection: string | null;
  extractOptions: ExtractOptions;
  lastExtractedConfig: string | null;
  isLoading: boolean;
  error: string | null;
}
