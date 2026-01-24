# Coding Conventions

**Analysis Date:** 2026-01-24

## Naming Patterns

**Files:**
- Component files: `kebab-case.tsx` (e.g., `button.tsx`, `login-block.tsx`)
- UI components: `packages/registry/ui/[name].tsx`
- Block components: `packages/registry/blocks/[name].tsx`
- Screen components: `packages/registry/screens/[name]-screen.tsx`
- Context/provider files: `PascalCase.tsx` with `Context` suffix (e.g., `ThemeSettingsContext.tsx`)
- Utility files: `kebab-case.ts` (e.g., `haptics.ts`, `platform.ts`)

**Functions & Components:**
- Component functions: `PascalCase` (e.g., `Button`, `LoginBlock`, `useTheme`)
- Type definitions: `PascalCase` with descriptive suffix (e.g., `ButtonProps`, `ButtonVariant`, `ButtonSize`)
- Hook functions: `camelCase` with `use` prefix (e.g., `useTheme`, `useFormField`, `useThemeSettings`)
- Utility functions: `camelCase` (e.g., `haptic`, `isTablet`, `getFontScale`)
- Helper functions (private): `camelCase` prefixed with lowercase context (e.g., `getVariantStyles`, `getSocialProviderLabel`, `getStatusColor`)
- Constants: `UPPER_CASE` for magic numbers and configuration (e.g., `BUTTON_CONSTANTS`, `DIALOG_CONSTANTS`)

**Variables:**
- State variables: `camelCase` (e.g., `checked`, `visible`, `passwordVisible`)
- Shared values (Reanimated): `camelCase` (e.g., `scale`, `progress`)
- Props objects: `camelCase` descriptively (e.g., `themePreset`, `radiusPreset`)

**Types:**
- Union types for variants: `[ComponentName]Variant` (e.g., `ButtonVariant`, `InputSize`, `AvatarStatus`)
- Size types: `[ComponentName]Size` (e.g., `ButtonSize`, `CheckboxSize`, `AvatarSize`)
- Props interfaces: `[ComponentName]Props` (e.g., `ButtonProps`, `LoginBlockProps`)
- Context types: `[ContextName]ContextType` (e.g., `ThemeSettingsContextType`)
- Extracted union type literals (e.g., `SocialProvider = 'google' | 'apple' | 'facebook'`)

## Code Style

**Formatting:**
- Prettier enforces formatting with 100-character line width
- Tab width: 2 spaces
- Quotes: single quotes (`'`)
- Semicolons: required
- Trailing commas: ES5 style (omitted in function parameters)
- Arrow functions: always include parentheses (e.g., `(e) => {}`)

**Configuration:**
- `.prettierrc` enforces all format settings
- ESLint configuration in `.eslintrc.js` enforces TypeScript and React best practices

**Linting:**
- ESLint with TypeScript support (`@typescript-eslint/parser`)
- Extends: `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `prettier`
- No `console` logs except warn/error (rule: `no-console: ['warn', { allow: ['warn', 'error'] }]`)
- No unused variables (prefix with `_` to allow: `@typescript-eslint/no-unused-vars: ['error', { argsIgnorePattern: '^_' }]`)
- No explicit `any` type allowed (`@typescript-eslint/no-explicit-any: 'error'`)
- Consistent type imports enforced (`@typescript-eslint/consistent-type-imports: 'error'`)

## Import Organization

**Order:**
1. React Native and external libraries (`react`, `react-native`, `react-hook-form`, etc.)
2. Animated/gesture libraries (`react-native-reanimated`, `react-native-gesture-handler`)
3. Icons/SVG utilities (`react-native-svg`, `Svg`, `Path`, etc.)
4. Internal utilities and hooks (from `@metacells/mcellui-core`)
5. Sibling components (relative imports from `../ui/`, `../blocks/`)

**Path Aliases:**
- No custom path aliases in core packages (`@metacells/mcellui-core`, `@metacells/mcellui-registry`)
- Relative imports used: `../ui/button`, `../../ui/form`
- In demo app: `@/components`, `@/context` aliases configured in `mcellui.config.ts`

**Type-specific imports:**
- Use consistent type imports: `import type { ButtonProps } from '../ui/button'`
- Organize types after component imports

## Error Handling

**Patterns:**
- Context hooks throw descriptive errors when used outside provider: `throw new Error('[hookName] must be used within [ProviderName]')`
- Examples:
  - `useFormField`: throws when outside `<FormField>`
  - `useToast`: throws when outside `<ToastProvider>`
  - `useDialog`: throws when outside `<Dialog>`
  - `useThemeSettings`: throws when outside `<ThemeSettingsProvider>`

**Try-Catch Usage:**
- Optional dependencies wrapped in try-catch (e.g., `expo-haptics` in `haptics.ts`)
- Graceful fallbacks provided when modules not available

**Validation:**
- Form validation uses Zod schemas (e.g., `loginSchema` in `login-block.tsx`)
- Schema definitions placed at top of file near component
- Type inference from schema: `type FormData = z.infer<typeof schema>`

## Logging

**Framework:** No logging framework used. Console logs allowed only for `warn` and `error`.

**Patterns:**
- Avoid debug logging in production code
- Use `console.warn()` or `console.error()` only for important issues
- Silently fail for non-critical operations (e.g., haptics try-catch silently fails)

**Example (from `haptics.ts`):**
```typescript
try {
  // ... haptic operation
} catch {
  // Silently fail if haptics not supported
}
```

## Comments

**When to Comment:**
- File header comments required (TSDoc format with `/**`)
- Provide example usage in header comments with `@example` tag
- Section separators used for logical grouping (e.g., `// ============================================================================`)
- Explain "why", not "what" (code shows what, comments explain reasoning)

**JSDoc/TSDoc:**
- Function parameters documented with `@param` tags
- Components document with markdown code blocks in examples
- Types documented inline where ambiguous

**Example (from `button.tsx` header):**
```typescript
/**
 * Button
 *
 * A pressable button component with multiple variants and sizes.
 * Uses design tokens for consistent styling across the app.
 *
 * @example
 * ```tsx
 * <Button onPress={() => {}}>Click me</Button>
 * <Button variant="secondary" size="sm">Small</Button>
 * ```
 */
```

## Function Design

**Size:** Functions kept to single responsibility. Helper functions extracted when logic exceeds one concern.

**Parameters:**
- Props interfaces used for all component parameters
- Destructured props in function signatures
- Callbacks prefixed with `on` or `handle` (e.g., `onPress`, `onCheckedChange`, `handleSubmit`)
- Default values provided in function signature when reasonable

**Return Values:**
- Components always return `React.ReactNode` or JSX
- Hooks return single value or tuple (e.g., `[state, setState]`)
- Utility functions return primitive types or objects
- Null returns only when component conditionally renders: `if (!message && !children) return null;`

**Hooks with Callbacks:**
```typescript
const handlePressIn = useCallback(
  (e: GestureResponderEvent) => {
    // implementation
  },
  [onPressIn, springs.snappy, animationsEnabled]  // dependencies listed
);
```

## Module Design

**Exports:**
- Named exports for all components and utilities
- Type exports for interfaces and type unions
- Default exports not used (consistency with Expo ecosystem)

**Barrel Files:**
- Index files re-export from subdirectories
- Example: `packages/core/src/index.ts` exports all utilities, types, and hooks
- Grouping by concern (theme, utils, primitives, components)

**File Structure Pattern:**
1. JSDoc header with example
2. Imports (organized by category)
3. Type definitions and interfaces
4. Context creation (if applicable)
5. Helper functions (exported or internal)
6. Main component export
7. Internal components or utilities
8. StyleSheet.create() at end

**Example structure from `button.tsx`:**
```
- File header JSDoc
- Imports
- Animated component creation
- Type exports (ButtonVariant, ButtonSize)
- Interface exports (ButtonProps)
- Component export (Button)
- Helper function (getVariantStyles)
- Styles (StyleSheet.create)
```

## Platform-Specific Code

**Patterns:**
- Platform detection via utilities: `isIOS`, `isAndroid`, `isTablet()` (from `platform.ts`)
- Platform-specific behavior in conditionals: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- Shadow handling: `platformShadow('sm')` function respects iOS elevation vs Android shadowOffset
- Animations respect accessibility: `areAnimationsDisabled()` function checks system preferences

## Design Token Usage

**Theme System:**
- All color values come from `useTheme().colors`
- All spacing values from `useTheme().spacing` (e.g., `spacing[4]`, `spacing[6]`)
- All border radius from `useTheme().componentRadius` or `useTheme().radius`
- Component-specific tokens: `useTheme().components.button[size]` (contains `height`, `paddingHorizontal`, `fontSize`, `fontWeight`)

**Animation Tokens:**
- Spring animations: `useTheme().springs.snappy` (for press interactions)
- Should be explicitly named: `springs.snappy`, `springs.gentle`, etc.

**Accessibility:**
- `useTheme()` respects dark mode automatically
- Color contrast maintained via token palette
- Font scaling respected via `getFontScale()`
- Haptic feedback respects `setHapticsEnabled(false)` global setting

---

*Convention analysis: 2026-01-24*
