# Architecture

**Analysis Date:** 2026-01-24

## Pattern Overview

**Overall:** Copy-paste component library with monorepo structure (Turborepo). Modular packages approach with copy-first philosophy inspired by shadcn/ui, adapted for Expo/React Native.

**Key Characteristics:**
- Copy-paste philosophy: Users own the code, not npm-installed dependencies
- Monorepo with Turborepo for build orchestration across packages
- Theme-driven design system with StyleSheet + ThemeProvider
- Registry-based component discovery and distribution
- CLI-first developer experience for component installation
- MCP (Model Context Protocol) server for AI-assisted development

## Layers

**Core Design System (`packages/core`):**
- Purpose: Provides theme system, design tokens, and shared utilities
- Location: `packages/core/src/`
- Contains: Theme provider, color palettes, spacing/radius tokens, typography, animation constants, component tokens, utilities
- Depends on: React, React Native
- Used by: All components in registry, demo app, CLI, MCP server

**Component Registry (`packages/registry`):**
- Purpose: Single source of truth for all copy-paste components
- Location: `packages/registry/`
- Contains: UI components (57 files in `ui/`), blocks (30+ screen templates in `blocks/`), screens (21 in `screens/`), hooks, primitives
- Depends on: `@metacells/mcellui-core`, react-hook-form, Zod, Reanimated, Gesture Handler
- Used by: Demo app (copies components), CLI (reads registry), MCP server (serves via resources)

**CLI Tool (`packages/cli`):**
- Purpose: `npx mcellui` command for adding components to user projects
- Location: `packages/cli/src/`
- Contains: Commands for init, add, list, diff, update, create, pick, doctor
- Depends on: Commander, Chalk, Zod, fs-extra, glob, prompts
- Used by: End developers installing components

**MCP Server (`packages/mcp-server`):**
- Purpose: Integration with Claude Code and AI assistants for development
- Location: `packages/mcp-server/src/`
- Contains: MCP resource providers and tools for reading components, registry, documentation
- Depends on: MCP SDK, registry data
- Used by: Claude Code, other AI assistants via stdio transport

**Metro Plugin (`packages/metro-plugin`):**
- Purpose: Metro bundler integration for automatic config discovery
- Location: `packages/metro-plugin/src/`
- Contains: Virtual module resolver for `@mcellui/auto-config`, config file finder
- Depends on: None (pure Metro resolver logic)
- Used by: Expo projects in their metro.config.js

**Demo App (`apps/demo`):**
- Purpose: Reference implementation and component showcase
- Location: `apps/demo/`
- Contains: Expo app with component demos, theme playground, blocks examples
- Depends on: All packages, react-native, expo-router, gesture-handler
- Used by: Testing, documentation, development reference

## Data Flow

**User Adding a Component:**

1. Developer runs: `npx mcellui add button`
2. CLI (`packages/cli/src/commands/add.ts`) parses request
3. CLI reads registry from `packages/registry/registry.json`
4. CLI locates component files in `packages/registry/[type]/button.tsx`
5. CLI resolves dependencies (both npm and registry dependencies)
6. CLI copies component code to user's project (typically `components/ui/button.tsx`)
7. CLI updates package.json with npm dependencies
8. Developer imports: `import { Button } from '@/components/ui/button'`

**Component Initialization in App:**

1. App wraps with `<ConfigProvider config={mcellui.config}>` from `packages/core`
2. ConfigProvider reads user's `mcellui.config.ts` via Metro plugin's virtual module resolver
3. ConfigProvider establishes ThemeProvider context with resolved tokens
4. Components import from `@metacells/mcellui-core` via `useTheme()` hook
5. Styling happens with React Native StyleSheet + theme values from context

**AI Assistant Integration (MCP):**

1. Claude Code connects to MCP server via stdio
2. MCP server (`packages/mcp-server/src/index.ts`) responds to:
   - `ListResources` - lists available components, screens, documentation
   - `ReadResource` - serves component source code
   - `ListTools` - exposes helper tools (generate component, suggest patterns, etc.)
   - `CallTool` - executes tools with arguments
3. Claude can now read component registry, understand patterns, and guide development

**Theme Customization Flow:**

1. User creates `mcellui.config.ts` with `defineConfig({ theme: 'violet', radius: 'lg' })`
2. Metro plugin intercepts import of `@mcellui/auto-config` and resolves to this file
3. ConfigProvider loads config and merges with defaults
4. Theme tokens are resolved from `packages/core/src/theme/` based on selections
5. All components access tokens via `useTheme()` hook
6. Dark mode determined from `colorScheme` setting and device preference

## Key Abstractions

**Theme System:**
- Purpose: Single source of design tokens (colors, spacing, typography, animations)
- Examples: `packages/core/src/theme/colors.ts`, `packages/core/src/theme/spacing.ts`, `packages/core/src/theme/animations.ts`
- Pattern: Token definition files export constants and presets; ThemeProvider + useTheme hook provide runtime access

**Component Patterns:**
- Purpose: Consistent component interface across UI library
- Examples: `packages/registry/ui/button.tsx`, `packages/registry/ui/input.tsx`, `packages/registry/blocks/login-block.tsx`
- Pattern: Export interface with props, default export as named component, styled with StyleSheet + theme tokens, animations via Reanimated

**Registry Metadata:**
- Purpose: Map components to files, dependencies, and categories
- Examples: `packages/registry/registry.json` (main), component entries have name, type, files, dependencies, registryDependencies
- Pattern: CLI parses registry to understand relationships; MCP server uses registry to expose components; build scripts generate registry from files

**Form System:**
- Purpose: Provide react-hook-form integration with Zod validation
- Examples: `packages/registry/ui/form.tsx`, `packages/registry/blocks/login-block.tsx`
- Pattern: Form wrapper component manages react-hook-form Controller; FormField/FormItem/FormLabel/FormMessage composition pattern

**Blocks (Screen Templates):**
- Purpose: Copy-paste complete screens, not just components
- Examples: `packages/registry/blocks/login-block.tsx`, `packages/registry/screens/profile-screen.tsx`
- Pattern: Larger components with business logic, use base UI components, fully typed, example in comments

## Entry Points

**For End Users:**
- Location: `npx mcellui init|add|list` - CLI entry point in `packages/cli/src/index.ts`
- Triggers: Developer runs command in terminal
- Responsibilities: Parse args, read registry, resolve dependencies, write files

**For App Developers:**
- Location: `apps/demo/app/_layout.tsx` (RootLayout with Expo Router)
- Triggers: App starts
- Responsibilities: Wrap app with GestureHandlerRootView, ConfigProvider, ThemeProvider, StatusBar

**For Component Usage:**
- Location: Component files in `packages/registry/[type]/[name].tsx`
- Triggers: Import statement in user code
- Responsibilities: Export styled component that consumes theme via useTheme()

**For AI Integration:**
- Location: `packages/mcp-server/src/index.ts` (MCP server entry)
- Triggers: Claude Code connects
- Responsibilities: Handle MCP requests for resources and tools

## Error Handling

**Strategy:** Graceful degradation with helpful messages. CLI validates before copying. Components have fallbacks for missing assets.

**Patterns:**
- CLI command validation using Zod schemas before execution
- Graceful file not found handling in registry reads
- Theme tokens have defaults, components don't break without custom theme
- Try-catch around async operations in CLI with user-friendly error messages via Chalk
- Components handle missing props with sensible defaults (e.g., empty state components)

## Cross-Cutting Concerns

**Logging:**
- CLI uses `chalk` for colored console output and `ora` for spinners
- MCP server logs errors to console.error()
- Demo app has debug logging in development via React Native debugging
- No centralized logging framework (not required for copy-paste library)

**Validation:**
- CLI uses Zod for config and component selection validation
- Form components use Zod validators passed via react-hook-form
- Registry entries validated at build time (implicit, registry.json structure)

**Authentication:**
- Not applicable - library doesn't handle auth
- Form components provide patterns for login flows (blocks like LoginBlock)
- Auth handled by consuming application

**Accessibility:**
- Components support VoiceOver (iOS) and TalkBack (Android)
- Form components use proper labels and semantic structure
- Button components use Pressable with proper hit targets (minimum 44x44 iOS, 48x48 Android)
- Not enforced at library level but documented in component guidelines

**Dark Mode:**
- ThemeProvider determines mode from device preference or explicit setting
- All components use `useTheme()` to get colors for current mode
- Colors in `packages/core/src/theme/colors.ts` include both light and dark variants
- Components conditionally apply styles based on `colors.isDark` or mode-specific color keys

**Animations:**
- Reanimated 3 for all animations to ensure smooth 60fps performance
- Animation tokens in `packages/core/src/theme/animations.ts` define spring/timing configs
- Components check `areAnimationsDisabled()` from core for accessibility
- Both "subtle" and "playful" animation presets available

---

*Architecture analysis: 2026-01-24*
