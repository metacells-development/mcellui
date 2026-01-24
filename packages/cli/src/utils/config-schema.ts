/**
 * McellUI Config Schema
 *
 * Zod-basierte Validierung für mcellui.config.ts
 * Gibt klare Fehlermeldungen bei ungültiger Konfiguration.
 */

import { z } from 'zod';

// Theme Presets
const themePresetSchema = z.enum([
  'zinc',
  'slate',
  'stone',
  'blue',
  'green',
  'rose',
  'orange',
  'violet',
]);

// Radius Presets
const radiusPresetSchema = z.enum(['none', 'sm', 'md', 'lg', 'full']);

// Color Scheme
const colorSchemeSchema = z.enum(['light', 'dark', 'system']);

// Style Preset
const stylePresetSchema = z.enum(['default', 'ios', 'material']);

// Hex Color (loose validation)
const hexColorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  'Must be a valid hex color (e.g., #ff0000 or #f00)'
);

// Optional hex color (allows undefined)
const optionalHexColorSchema = hexColorSchema.optional();

// Theme Colors Schema
const themeColorsSchema = z.object({
  background: optionalHexColorSchema,
  foreground: optionalHexColorSchema,
  backgroundSubtle: optionalHexColorSchema,
  foregroundMuted: optionalHexColorSchema,
  card: optionalHexColorSchema,
  cardForeground: optionalHexColorSchema,
  primary: optionalHexColorSchema,
  primaryForeground: optionalHexColorSchema,
  secondary: optionalHexColorSchema,
  secondaryForeground: optionalHexColorSchema,
  muted: optionalHexColorSchema,
  mutedForeground: optionalHexColorSchema,
  accent: optionalHexColorSchema,
  accentForeground: optionalHexColorSchema,
  destructive: optionalHexColorSchema,
  destructiveForeground: optionalHexColorSchema,
  border: optionalHexColorSchema,
  input: optionalHexColorSchema,
  ring: optionalHexColorSchema,
  success: optionalHexColorSchema,
  warning: optionalHexColorSchema,
}).partial();

// Fonts Schema
const fontsSchema = z.object({
  sans: z.string().optional(),
  heading: z.string().optional(),
  mono: z.string().optional(),
}).partial();

// Component Overrides
const componentOverridesSchema = z.object({
  button: z.object({
    defaultVariant: z.enum(['default', 'secondary', 'outline', 'ghost', 'destructive']).optional(),
    defaultSize: z.enum(['sm', 'md', 'lg']).optional(),
  }).optional(),
  input: z.object({
    defaultSize: z.enum(['sm', 'md', 'lg']).optional(),
  }).optional(),
  card: z.object({
    defaultVariant: z.enum(['default', 'elevated', 'outlined']).optional(),
  }).optional(),
  badge: z.object({
    defaultVariant: z.enum(['default', 'secondary', 'destructive', 'outline']).optional(),
    defaultSize: z.enum(['sm', 'md', 'lg']).optional(),
  }).optional(),
  avatar: z.object({
    defaultSize: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  }).optional(),
}).partial();

// Path Schema (validates it's a relative path)
const pathSchema = z.string().refine(
  (val) => val.startsWith('./') || val.startsWith('../'),
  'Path must be relative (start with ./ or ../)'
);

// Aliases Schema
const aliasesSchema = z.object({
  components: z.string().optional(),
  utils: z.string().optional(),
}).partial();

/**
 * Complete NativeUI Config Schema
 */
export const nativeUIConfigSchema = z.object({
  // Runtime Configuration
  theme: themePresetSchema.optional(),
  radius: radiusPresetSchema.optional(),
  colorScheme: colorSchemeSchema.optional(),
  colors: themeColorsSchema.optional(),
  lightColors: themeColorsSchema.optional(),
  darkColors: themeColorsSchema.optional(),
  fonts: fontsSchema.optional(),
  haptics: z.boolean().optional(),
  components: componentOverridesSchema.optional(),

  // CLI Configuration
  componentsPath: pathSchema.optional(),
  utilsPath: pathSchema.optional(),
  style: stylePresetSchema.optional(),
  aliases: aliasesSchema.optional(),
}).strict(); // Disallow extra keys

export type ValidatedNativeUIConfig = z.infer<typeof nativeUIConfigSchema>;

/**
 * Validate a config object and return typed result or errors
 */
export function validateConfig(config: unknown): {
  success: true;
  data: ValidatedNativeUIConfig;
} | {
  success: false;
  errors: string[];
} {
  const result = nativeUIConfigSchema.safeParse(config);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into readable strings
  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  return { success: false, errors };
}

/**
 * Validate config and throw with helpful error message
 */
export function validateConfigOrThrow(config: unknown, configPath: string): ValidatedNativeUIConfig {
  const result = validateConfig(config);

  if (!result.success) {
    const errorList = result.errors.map((e) => `  - ${e}`).join('\n');
    throw new Error(
      `Invalid configuration in ${configPath}:\n${errorList}\n\n` +
      `See https://mcellui.dev/docs/config for valid options.`
    );
  }

  return result.data;
}
