# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- Components: `kebab-case` (e.g., `alert-dialog.tsx`, `pull-to-refresh.tsx`)
- Blocks: `kebab-case` (e.g., `login-block.tsx`, `profile-block.tsx`)
- Types/utilities: `camelCase` with descriptive names (e.g., `cn.ts`, `platform.ts`)
- Directories: `kebab-case` for feature folders, `camelCase` for utility folders

Example structure in `packages/registry/`:
- `ui/button.tsx` - UI component
- `blocks/login-block.tsx` - Screen block component
- `utils/typography.ts` - Utility module

**Functions:**
- camelCase for all functions, including React components
- Component functions: PascalCase (e.g., `function LoginBlock()`)
- Helper functions: camelCase (e.g., `getSocialProviderLabel()`)
- Hook names: Start with `use` (e.g., `useTheme()`, `useAlertDialog()`)

Example from `login-block.tsx`:
```typescript
function getSocialProviderLabel(provider: SocialProvider): string {
  // ...
}

export function LoginBlock({ onSubmit, ... }: LoginBlockProps) {
  // ...
}
```

**Variables:**
- camelCase for all variables and constants
- Constants in PascalCase when exporting types or configuration
- Prefix private/internal variables with underscore if needed: `_internal`

Example from `profile-block.tsx`:
```typescript
const initials = name
  .split(' ')
  .map((n) => n[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);
```

**Types:**
- PascalCase for all TypeScript interfaces and types
- Props interfaces: `ComponentNameProps` (e.g., `LoginBlockProps`, `AlertDialogProps`)
- Event/callback types: Descriptive names (e.g., `SocialProvider`)
- Generic types: PascalCase (e.g., `Style`, `StyleInput`)

Example from `profile-block.tsx`:
```typescript
export interface ProfileStat {
  label: string;
  value: string | number;
  onPress?: () => void;
}

export interface ProfileBlockProps {
  avatarUrl?: string;
  name: string;
  // ...
}
```

## Code Style

**Formatting:**
- Prettier for automatic formatting
- Configuration: `.prettierrc`

Key settings:
```json
{
  "semi": true,           // Always add semicolons
  "singleQuote": true,    // Use single quotes
  "tabWidth": 2,          // 2-space indentation
  "trailingComma": "es5", // Trailing commas where valid
  "printWidth": 100,      // 100 character line limit
  "bracketSpacing": true, // Spaces in object literals
  "arrowParens": "always" // Arrow function parens
}
```

Run formatting:
```bash
npm run format              # Format all files
npm run format:check       # Check formatting without changes
```

**Linting:**
- ESLint with TypeScript support
- Configuration: `eslint.config.js`

Key rules enforced:
- `@typescript-eslint/no-unused-vars`: Error (except args/vars starting with `_`)
- `@typescript-eslint/no-explicit-any`: Warn (strict type safety)
- `@typescript-eslint/consistent-type-imports`: Error (use `type` imports)
- `no-console`: Warn (except in CLI/demo/MCP server)
- `prefer-const`: Error
- `no-duplicate-imports`: Error

Run linting:
```bash
npm run lint               # Run linter across all packages
```

## Import Organization

**Order:**
1. React/React Native core imports
2. Third-party library imports (reanimated, gesture-handler, etc.)
3. Internal package imports (@metacells/mcellui-core)
4. Local relative imports (../ui, ./helpers, etc.)

Groups separated by blank lines.

**Type imports:**
Always use `type` keyword for type-only imports:
```typescript
import type { ViewStyle, TextStyle } from 'react-native';
import type { Profile } from './types';
```

**Path Aliases:**
The codebase uses these standard aliases:
- `@metacells/mcellui-core` - Core package exports
- `@/lib/utils` - User's configured utilities (in installed components)

Example from `login-block.tsx`:
```typescript
import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme, authBlockTokens } from '@metacells/mcellui-core';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormField } from '../ui/form';
```

## Error Handling

**Strategy:**
- Throw errors for context setup violations
- Use try-catch for async operations (file system, API calls)
- Provide user-friendly error messages with context

**Context validation pattern:**
Used in dialog/sheet components to ensure proper component hierarchy:
```typescript
const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialog');
  }
  return context;
};
```

**CLI command error handling:**
From `init.ts`:
```typescript
try {
  const projectRoot = await getProjectRoot(cwd);

  if (!projectRoot) {
    console.log(chalk.red('Could not find a valid Expo/React Native project.'));
    process.exit(1);
  }
  // ...
} catch (error) {
  // Handle and report error
}
```

**Console logging:**
- `console.warn()` and `console.error()` allowed in production code
- `console.log()` allowed in CLI tools, MCP server, and demo app
- Disabled in component libraries

## Comments

**When to Comment:**
- Complex logic or non-obvious algorithms
- Important implementation notes or trade-offs
- Configuration sections (marked with headers)

**No comments needed for:**
- Self-explanatory code
- Simple property assignments
- Standard patterns

**Header sections:**
Components use section headers with `=` dividers for major sections:
```typescript
// ============================================================================
// Types
// ============================================================================

export interface LoginBlockProps {
  // ...
}

// ============================================================================
// Component
// ============================================================================

export function LoginBlock(props) {
  // ...
}

// ============================================================================
// Helpers
// ============================================================================

function getSocialProviderLabel(provider) {
  // ...
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // ...
});
```

## JSDoc/TSDoc

**Usage:**
- JSDoc on component exports (Props and main component)
- Simple `@example` blocks showing basic usage
- Short parameter descriptions

**Component example from `login-block.tsx`:**
```typescript
/**
 * LoginBlock
 *
 * Complete login screen with email/password form and social login options.
 * Uses react-hook-form with Zod validation.
 *
 * @example
 * ```tsx
 * <LoginBlock
 *   onSubmit={(data) => handleLogin(data)}
 *   onForgotPassword={() => navigation.navigate('ForgotPassword')}
 * />
 * ```
 */
export function LoginBlock(props) {
  // ...
}
```

**Props interface example:**
```typescript
export interface LoginBlockProps {
  /** Called when form is submitted with valid data */
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  /** Called when "Forgot Password" is pressed */
  onForgotPassword?: () => void;
  /** Show loading state on submit button */
  loading?: boolean;
}
```

## Function Design

**Size:**
- Functions kept reasonably small (50-100 lines typical for components)
- Large sections separated into logical parts with comments

**Parameters:**
- Use object destructuring for props (destructure in function signature)
- Optional parameters should have default values in destructuring
- Never use `any` for parameter types

Example from `profile-block.tsx`:
```typescript
export function ProfileBlock({
  avatarUrl,
  name,
  subtitle,
  bio,
  stats,
  primaryButtonText = 'Edit Profile',
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  style,
}: ProfileBlockProps) {
  // ...
}
```

**Return Values:**
- Always annotate return type explicitly
- `void` for components and side-effect functions
- Explicit types for utilities (`string`, `number`, `boolean`, etc.)

## Module Design

**Exports:**
- Named exports for components and utilities
- Export types alongside implementations
- No default exports in component files

```typescript
export function LoginBlock(props) { }
export interface LoginBlockProps { }
export type SocialProvider = 'google' | 'apple' | 'facebook';
```

**Barrel Files:**
Used in some packages to organize exports:
- `packages/core/src/index.ts` - Main core exports
- `packages/core/src/theme/index.ts` - Theme token exports
- `packages/core/src/utils/index.ts` - Utility exports

**Component File Structure:**
Standard sections in order:
1. JSDoc comment
2. Imports
3. Section headers with dividers
4. Types/Interfaces
5. Component function
6. Helper functions
7. StyleSheet definition

Example: `packages/registry/blocks/login-block.tsx`

## React Patterns

**Component Definition:**
- Export function components (no class components)
- Function declaration (not arrow functions) for named components
- Arrow functions for callbacks and handlers

**Hooks:**
- `useTheme()` from `@metacells/mcellui-core` for design tokens
- `useForm()` from `react-hook-form` for form state
- `useContext()` for component composition (dialogs, sheets)

**State Management:**
- Controlled components with props for state
- Uncontrolled components (forms) use react-hook-form
- No Redux or external state management in components

**Props pattern:**
- Destructure all props in function signature
- Spread remaining props only when necessary
- Provide JSDoc for each prop

## StyleSheet Pattern

All styling uses React Native `StyleSheet.create()` at the bottom of files:
- Base styles (no theme values) in StyleSheet
- Theme-dependent styles applied inline with `useTheme()` values
- Consistent naming: `container`, `content`, `header`, `footer`, etc.

Example from `login-block.tsx`:
```typescript
const { colors, spacing, radius } = useTheme();

return (
  <View
    style={[
      styles.container,
      { padding: spacing[6] }
    ]}
  >
    {/* Component content */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  // ...
});
```

## Theme Integration

**Required approach:**
Every component must use `useTheme()` from `@metacells/mcellui-core`:
```typescript
const { colors, spacing, radius } = useTheme();
```

**Available tokens:**
- `colors` - Theme colors (primary, foreground, background, etc.)
- `spacing` - Spacing scale [0, 1, 2, 3, 4, 6, 8, ...]
- `radius` - Border radius tokens
- `typography` - Font sizes and weights
- `platformShadow` - Platform-specific shadows
- Specific component tokens: `buttonTokens`, `inputTokens`, etc.

**Typography tokens example:**
For typography values beyond spacing, use tokens from core:
```typescript
import { fontWeight } from '@metacells/mcellui-core';

<Text style={{ fontWeight: fontWeight.bold }}>Bold Text</Text>
```

---

*Convention analysis: 2026-01-26*
