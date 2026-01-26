# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Copy-paste component library with monorepo architecture

**Key Characteristics:**
- Monorepo with Turborepo orchestration (packages: CLI, core, registry, plugins)
- Copy-paste distribution model (users own the code, no npm install)
- Design token system with ThemeProvider for global styling
- Component registry with dependency resolution
- Expo/React Native first, StyleSheet-based (not CSS-in-JS)
- Form system with react-hook-form + Zod integration

## Layers

**CLI Layer:**
- Purpose: Command-line interface for project initialization, component discovery, and installation
- Location: `packages/cli/`
- Contains: Commander-based CLI commands, dependency resolution, registry fetching, file copying
- Depends on: Node.js fs, glob, diff, prompts; local utils (project, registry, imports)
- Used by: Developers, via `npx mcellui init` and `npx mcellui add`

**Core Theme Layer:**
- Purpose: Global design tokens, ThemeProvider context, and utilities shared across all components
- Location: `packages/core/src/`
- Contains: Theme tokens (colors, spacing, typography, radius, shadows, animations), ThemeProvider component, config system
- Depends on: React, React Native, Reanimated
- Used by: All UI components, demo app, user applications

**Component Registry:**
- Purpose: Single source of truth for all UI components, screens, and blocks
- Location: `packages/registry/`
- Contains: 57 UI components, 20 screen templates, 28 reusable blocks; registry.json metadata
- Depends on: React, React Native, react-hook-form, @hookform/resolvers, Zod, Reanimated, Gesture Handler, SVG
- Used by: CLI (for distribution), demo app (for showcase)

**Demo Application:**
- Purpose: Live showcase and testing ground for all components and design system
- Location: `apps/demo/`
- Contains: Expo app with Expo Router navigation, theme settings UI, component showcase screens
- Depends on: All core and registry packages, Expo, Expo Router, react-hook-form
- Used by: Developers for testing, documentation, visual validation

**MCP Server:**
- Purpose: Model Context Protocol server for Claude Code integration
- Location: `packages/mcp-server/`
- Contains: MCP server with tools for registry queries and resource access
- Depends on: @modelcontextprotocol/sdk
- Used by: Claude Code for component discovery and assistance

**Metro Plugin:**
- Purpose: Metro bundler integration for theme customization support in user projects
- Location: `packages/metro-plugin/`
- Contains: Bundler plugin, theme resolution logic
- Used by: Demo app and user Expo projects

**Figma Plugin:**
- Purpose: Design-to-code bridge for exporting Figma designs as mcellui components
- Location: `packages/figma-plugin/`
- Contains: Figma plugin UI and export logic
- Used by: Designers creating component variants

## Data Flow

**Component Discovery & Installation Flow:**

1. User runs `npx mcellui init` in their Expo/React Native project
2. CLI detects project type, creates `mcellui.config.ts` with paths (componentsPath, utilsPath, style)
3. User runs `npx mcellui add button card input`
4. CLI fetches registry.json from `packages/registry/registry.json` (via npm/URL)
5. CLI resolves dependencies (component A depends on component B)
6. CLI transforms component code: replaces @metacells/mcellui-core imports, adjusts relative paths
7. CLI copies transformed files to user's `components/ui/` directory
8. User imports components from their local copy, not npm

**Design Token & Theme Flow:**

1. Demo app wraps root with `<ThemeProvider theme="violet" radius="lg">`
2. ThemeProvider creates context with full Theme object:
   - Colors (8 presets: zinc, slate, stone, blue, green, rose, orange, violet)
   - Spacing scale (0-32)
   - Typography (fonts, sizes, weights, line heights)
   - Component tokens (button sizes, input heights, etc.)
   - Animations (springs, timing, durations)
3. Component uses `const { colors, spacing, radius, components } = useTheme()`
4. Component renders with tokens: `backgroundColor: colors.primary`, `padding: spacing[4]`

**State Management:**

- Theme state lives in ThemeProvider context (color scheme preference, radius preset, animation preset)
- Per-component state: Local useState for UI state (input value, checkbox checked, etc.)
- Form state: react-hook-form with Zod validation (external library, not internal)
- No Redux, Zustand, or centralized global state

## Key Abstractions

**Theme System:**
- Purpose: Centralized design token access without prop drilling
- Examples: `packages/core/src/theme/ThemeProvider.tsx`, `packages/core/src/theme/colors.ts`, `packages/core/src/theme/radius.ts`
- Pattern: Context-based with useTheme hook; tokens exposed as plain objects (no CSS-in-JS runtime)

**Component Composition:**
- Purpose: Reusable, copyable building blocks that combine primitives
- Examples: Button (Pressable + Text + Animated), Form (react-hook-form integration), Input (TextInput + Icons + clear button)
- Pattern: Functional components with forwardRef, explicit props, StyleSheet for static styles

**Registry Metadata:**
- Purpose: Declarative component manifests for CLI dependency resolution and discovery
- Examples: `packages/registry/registry.json` entries (name, type, files, dependencies, registryDependencies)
- Pattern: JSON-based metadata consumed by CLI and MCP server

**Screen Templates:**
- Purpose: Full-page examples combining components + business logic for common patterns
- Examples: `packages/registry/screens/login-screen.tsx`, `cart-screen.tsx`, `product-detail-screen.tsx`
- Pattern: Export ready-to-copy React components with callback props for integration

**Block Components:**
- Purpose: Composite UI sections (smaller than screens, larger than atomic components)
- Examples: `packages/registry/blocks/login-block.tsx`, `product-card.tsx`, `feed-post-card.tsx`
- Pattern: Self-contained, theme-aware, use other UI components internally

## Entry Points

**CLI Entry:**
- Location: `packages/cli/src/index.ts`
- Triggers: `npx mcellui init`, `npx mcellui add`, `npx mcellui list`, etc.
- Responsibilities: Project detection, config management, component fetching, dependency resolution, file transformation, installation

**Demo App Entry:**
- Location: `apps/demo/app/_layout.tsx`
- Triggers: `expo start` / `npm run dev`
- Responsibilities: Root layout with Expo Router setup, theme provider initialization, navigation structure

**MCP Server Entry:**
- Location: `packages/mcp-server/src/index.ts`
- Triggers: Claude Code integration (stdio transport)
- Responsibilities: Expose registry tools and resources to Claude

**Component Library Entry (for users):**
- Location: User's generated `components/ui/*.tsx` (copied from registry)
- Triggers: `import { Button } from '@/components/ui/button'`
- Responsibilities: Component usage in user application

## Error Handling

**Strategy:** Errors propagate with context, CLI provides helpful messaging

**Patterns:**
- CLI: chalk colors for error messages (red for errors, yellow for warnings, dim for context)
- CLI: ora spinners for long operations with error states
- Components: Fallback values for missing ThemeProvider (warning logged)
- Components: ErrorBoundary component in `packages/core/src/components/ErrorBoundary.tsx`

## Cross-Cutting Concerns

**Logging:**
- CLI: chalk-based console output (structured via ora spinners and chalk colors)
- Components: console.warn when ThemeProvider missing, console.error in error boundaries
- Demo: Minimal logging (development only)

**Validation:**
- CLI: File existence checks, package.json validation, config file schema validation via Zod
- Forms: Zod schema integration via react-hook-form resolver
- Components: PropTypes equivalent via TypeScript interfaces (no runtime validation)

**Authentication:**
- Not built in; screens (LoginScreen, SignupScreen) expose callbacks for integration
- Pattern: Pass `onLogin`, `onSignUp` props; component calls callbacks with user data
- Example: `<LoginScreen onLogin={(email, password) => signIn(email, password)} />`

**Accessibility:**
- Native: Uses React Native built-in a11y props (accessible, accessibilityRole, accessibilityLabel)
- Components: VoiceOver (iOS) + TalkBack (Android) tested per CLAUDE.md
- Dark mode: Automatic via ThemeProvider color scheme detection
- Haptics: Global haptics control via ThemeProvider `haptics` prop; utility in `packages/core/src/utils/haptics.ts`

**Animations:**
- Engine: Reanimated 3 for performant animations
- Control: Global animation preset (subtle vs playful) via ThemeProvider
- Disable: Support for Expo Go (automatically disabled) and explicit opt-out
- Utility: `areAnimationsDisabled()` check in components; `getAnimationPreset()` in theme

**Platform Differences:**
- iOS shadow: React Native shadow props (shadowColor, shadowOffset, shadowOpacity, shadowRadius)
- Android elevation: elevation property
- Helper: `platformShadow()` function in `packages/core/src/theme/shadows.ts` returns platform-appropriate shadow
- Pattern: Components use `platformShadow()` for consistent shadows across platforms

---

*Architecture analysis: 2026-01-26*
