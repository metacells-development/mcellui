# ADR 004: Unified Configuration File (nativeui.config.ts)

**Status:** Accepted
**Date:** 2026-01-15
**Authors:** nativeui team
**Supersedes:** ADR-002 Alternative 2 rejection
**Related:** ADR-002 (Theming), Feature-001 (CLI)

## Context

In ADR-002, we rejected a config file approach in favor of ThemeProvider props:

> **Rejected because:** Adds build complexity. React Native doesn't have the same config-file ecosystem as web. Props on ThemeProvider are more idiomatic.

However, as the project evolved, we identified two use cases that benefit from a unified config file:

1. **CLI configuration** - The `npx nativeui add` command needs to know where to install components, what path aliases to use, and which style preset to apply. This information must persist between CLI invocations.

2. **Runtime theming** - While ThemeProvider props work well, having a single source of truth for the design system (similar to `tailwind.config.js`) improves developer experience and makes it easy to share configuration across team members.

The shadcn/ui CLI already uses a `components.json` config file. We extend this pattern to include runtime theming options, creating a single file that configures both the CLI and the app's design system.

## Decision

We introduce `nativeui.config.ts` as the single configuration file for both CLI and runtime theming.

### Configuration API

```ts
// nativeui.config.ts
import { defineConfig } from '@nativeui/core';

export default defineConfig({
  // ============================================
  // Runtime Configuration (used by ConfigProvider)
  // ============================================

  // Theme preset
  theme: 'blue', // 'zinc' | 'slate' | 'stone' | 'blue' | 'green' | 'rose' | 'orange' | 'violet'

  // Border radius preset
  radius: 'md', // 'none' | 'sm' | 'md' | 'lg' | 'full'

  // Color scheme preference
  colorScheme: 'system', // 'light' | 'dark' | 'system'

  // Custom color overrides
  colors: {
    primary: '#6366F1',
  },

  // Light mode specific overrides
  lightColors: {
    background: '#FFFFFF',
  },

  // Dark mode specific overrides
  darkColors: {
    background: '#0A0A0A',
  },

  // Custom fonts
  fonts: {
    sans: 'Inter_400Regular',
  },

  // Component defaults
  components: {
    button: { defaultVariant: 'default', defaultSize: 'md' },
    badge: { defaultVariant: 'default', defaultSize: 'md' },
  },

  // ============================================
  // CLI Configuration (used by npx nativeui add)
  // ============================================

  // Where components are installed
  componentsPath: './components/ui',

  // Where utilities (cn, etc.) are installed
  utilsPath: './lib/utils',

  // Style preset for components
  style: 'default', // 'default' | 'ios' | 'material'

  // Path aliases for imports
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
  },
});
```

### Usage in App

```tsx
// App.tsx or _layout.tsx
import { ConfigProvider } from '@nativeui/core';
import config from './nativeui.config';

export default function App() {
  return (
    <ConfigProvider config={config}>
      <YourApp />
    </ConfigProvider>
  );
}
```

### ConfigProvider API

```tsx
interface ConfigProviderProps {
  /** Configuration from nativeui.config.ts */
  config?: NativeUIConfig;

  /** Override theme (takes precedence over config) */
  theme?: ThemePreset;

  /** Override radius (takes precedence over config) */
  radius?: RadiusPreset;

  /** Override color scheme (takes precedence over config) */
  colorScheme?: 'light' | 'dark' | 'system';

  children: ReactNode;
}
```

The prop overrides allow runtime theme switching while still using the config as defaults:

```tsx
function App() {
  const [theme, setTheme] = useState<ThemePreset>('blue');

  return (
    <ConfigProvider config={config} theme={theme}>
      <ThemeSelector onChange={setTheme} />
      <YourApp />
    </ConfigProvider>
  );
}
```

### CLI Integration

The CLI reads the same config file:

```bash
# Initializes project and creates nativeui.config.ts
npx nativeui init

# Reads nativeui.config.ts to determine component installation path
npx nativeui add button
```

The CLI uses `jiti` to load TypeScript config files without requiring a build step.

## Alternatives Considered

### Alternative 1: Separate CLI and Runtime Configs

Keep `components.json` for CLI (like shadcn) and use ThemeProvider props for runtime:

```json
// components.json
{
  "componentsPath": "./components/ui",
  "style": "default"
}
```

```tsx
// App.tsx
<ThemeProvider theme="blue" radius="md">
```

**Rejected because:** Maintaining two config files is error-prone. The single config approach provides better DX and ensures consistency.

### Alternative 2: JSON Config Only

Use a JSON file for simplicity:

```json
// nativeui.config.json
{
  "theme": "blue",
  "componentsPath": "./components/ui"
}
```

**Rejected because:** TypeScript config provides better autocomplete, type safety, and allows importing the config directly in code.

### Alternative 3: Keep Props-Only Approach

Continue with ThemeProvider props and add a separate CLI config:

**Rejected because:** The config file approach is now industry standard (Tailwind, shadcn, Next.js) and provides a single source of truth. The original concern about "build complexity" is addressed by using `jiti` for runtime TypeScript loading.

## Consequences

### Positive

- **Single source of truth** - One file for all configuration
- **Type-safe** - `defineConfig` provides full autocomplete and validation
- **Familiar pattern** - Matches tailwind.config.js, next.config.js patterns
- **Shareable** - Easy to share configuration across team/projects
- **CLI integration** - Seamless integration between CLI and runtime

### Negative

- **Extra file** - Projects need `nativeui.config.ts` in root
- **Import required** - Config must be imported in app entry point
- **Learning curve** - Users need to understand config vs props

### Neutral

- **Props still work** - ConfigProvider accepts override props for runtime changes
- **Migration path** - Existing ThemeProvider usage continues to work

## Implementation

### Files Created/Modified

1. `packages/core/src/config/types.ts` - Unified NativeUIConfig type
2. `packages/core/src/config/defineConfig.ts` - Helper function and resolver
3. `packages/core/src/config/ConfigProvider.tsx` - Wraps ThemeProvider with config
4. `packages/core/src/config/index.ts` - Exports
5. `packages/cli/src/utils/project.ts` - Updated to use unified config
6. `packages/cli/src/commands/init.ts` - Generates unified config file

### Type Definition

```typescript
interface NativeUIConfig {
  // Runtime
  theme?: ThemePreset;
  radius?: RadiusPreset;
  colorScheme?: 'light' | 'dark' | 'system';
  colors?: Partial<ThemeColors>;
  lightColors?: Partial<ThemeColors>;
  darkColors?: Partial<ThemeColors>;
  fonts?: Partial<Fonts>;
  components?: ComponentDefaults;

  // CLI
  componentsPath?: string;
  utilsPath?: string;
  style?: 'default' | 'ios' | 'material';
  aliases?: {
    components?: string;
    utils?: string;
  };
}
```

## Migration

### From ThemeProvider Props

Before:
```tsx
<ThemeProvider theme="blue" radius="md">
  <App />
</ThemeProvider>
```

After:
```tsx
// nativeui.config.ts
export default defineConfig({
  theme: 'blue',
  radius: 'md',
});

// App.tsx
import config from './nativeui.config';

<ConfigProvider config={config}>
  <App />
</ConfigProvider>
```

### From Old CLI Config

Before (if using old `@nativeui/cli` type):
```ts
import type { NativeUIConfig } from '@nativeui/cli';

const config: NativeUIConfig = {
  componentsPath: './components/ui',
  style: 'default',
};
```

After:
```ts
import { defineConfig } from '@nativeui/core';

export default defineConfig({
  componentsPath: './components/ui',
  style: 'default',
  theme: 'blue',  // Now can also configure runtime
});
```

## References

- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [jiti - TypeScript loader](https://github.com/unjs/jiti)
- ADR-002: Theming Customization
