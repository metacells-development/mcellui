# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
mcellui/ (monorepo root)
├── apps/                       # Runnable applications
│   ├── demo/                   # Expo demo application
│   │   ├── app/                # Expo Router pages/screens
│   │   ├── components/         # Demo-specific UI components
│   │   ├── context/            # React context (ThemeSettingsContext)
│   │   ├── lib/                # Demo utilities
│   │   └── mcellui.config.ts   # Demo theme configuration
│   └── docs/                   # Documentation site (Next.js)
├── packages/                   # Shared packages & libraries
│   ├── cli/                    # CLI tool (npx mcellui)
│   │   ├── src/
│   │   │   ├── commands/       # Command implementations (init, add, list, etc.)
│   │   │   └── utils/          # Project detection, registry fetching, imports
│   │   └── dist/               # Built CLI output
│   ├── core/                   # Design token system & primitives
│   │   ├── src/
│   │   │   ├── theme/          # ThemeProvider, color/spacing/typography tokens
│   │   │   ├── tokens/         # Legacy design tokens (deprecated)
│   │   │   ├── primitives/     # Low-level components (Pressable, Slot, Portal)
│   │   │   ├── components/     # ErrorBoundary
│   │   │   ├── utils/          # Accessibility, platform, haptics, typography
│   │   │   ├── config/         # Config system (mcellui.config.ts)
│   │   │   └── constants.ts    # Magic numbers (button press scale, etc.)
│   ├── registry/               # Component source code (copy-paste ready)
│   │   ├── ui/                 # 57 UI components (button, card, input, etc.)
│   │   ├── blocks/             # 28 composite blocks (login-block, product-card, etc.)
│   │   ├── screens/            # 20 full-page screen templates
│   │   ├── hooks/              # Custom hooks (empty, placeholder for future)
│   │   ├── primitives/         # Layout primitives (empty)
│   │   ├── registry.json       # Component metadata & manifest
│   │   └── scripts/            # Registry build scripts
│   ├── mcp-server/             # Claude Code integration (MCP)
│   │   ├── src/
│   │   │   ├── tools/          # MCP tools (registry queries)
│   │   │   └── resources/      # MCP resources (component definitions)
│   │   └── registry/           # Runtime registry copy (generated)
│   ├── metro-plugin/           # Metro bundler plugin
│   │   └── src/                # Plugin implementation
│   └── figma-plugin/           # Figma design plugin
│       └── src/                # Plugin UI & export logic
├── docs/                       # Project documentation
│   ├── adr/                    # Architecture Decision Records
│   ├── features/               # Feature specifications
│   └── phases/                 # Phase details & planning
├── ios/                        # Native iOS project (Expo managed)
├── node_modules/               # Dependencies
├── .planning/                  # GSD planning documents
│   ├── codebase/               # Structure, architecture, conventions docs
│   └── phases/                 # Phase execution plans
├── package.json                # Root workspace config (npm workspaces)
├── turbo.json                  # Turborepo config
├── tsconfig.base.json          # Base TypeScript config
├── mcellui.config.ts           # Root demo theme config (example)
├── PHASES.md                   # Development roadmap (Phase 1-13)
├── REGISTRY.md                 # Component registry documentation
└── CLAUDE.md                   # Project instructions for Claude
```

## Directory Purposes

**apps/demo:**
- Purpose: Live Expo app showcasing all components, blocks, and screens
- Contains: Expo Router navigation, theme selector UI, component demos
- Key files: `app/_layout.tsx` (root layout), `app/index.tsx` (home screen), `app/[name].tsx` (dynamic component demo)
- Generated: `dist/` build output (not committed)

**apps/docs:**
- Purpose: Documentation website (currently placeholder Next.js)
- Contains: Markdown content, component API docs
- Status: Not fully developed

**packages/cli:**
- Purpose: Command-line tool for project initialization and component installation
- Contains: 8 commands (init, add, list, doctor, diff, update, create, pick)
- Key dependency resolution: `utils/dependencies.ts` resolves component A → component B chains
- Key registry fetch: `utils/registry.ts` loads and queries registry.json

**packages/core:**
- Purpose: Single source of truth for design tokens and theme system
- Contains: ThemeProvider context, all token definitions, utilities
- Key exports: `index.ts` exports ~100 token constants and providers
- Theme presets: `theme/presets.ts` defines 8 color schemes (zinc, slate, stone, blue, green, rose, orange, violet)

**packages/registry:**
- Purpose: Repository of all component source code (ready to copy-paste)
- Contains: 57 components split across `ui/`, `blocks/`, `screens/` subdirectories
- registry.json: Metadata for each component (name, type, files, dependencies, status)
- Not published as npm package (private: true)

**packages/mcp-server:**
- Purpose: MCP server exposing registry and tools to Claude
- Contains: Tool handlers for component search, resource handlers for component sources
- registry/: Copy of registry files (generated for MCP access)

**packages/metro-plugin:**
- Purpose: Metro bundler integration for theme customization
- Contains: Plugin that intercepts module resolution for custom theme handling

**packages/figma-plugin:**
- Purpose: Figma integration for design-to-code export
- Contains: Figma plugin UI, export logic, component generation

**docs/adr:**
- Purpose: Architecture Decision Records explaining major design choices
- Examples: ADR-001 (Copy-paste model), ADR-002 (ThemeProvider design), etc.

**docs/features:**
- Purpose: Feature specifications and detailed component requirements
- Examples: Form system spec, animation system spec

**docs/phases:**
- Purpose: Development roadmap phases (Phase 1-13) with component lists
- Examples: Phase 4 (Forms & Blocks) complete, Phase 5 onward planned

**.planning/codebase:**
- Purpose: GSD-generated analysis documents for code orchestration
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

**.planning/phases:**
- Purpose: GSD-generated implementation plans for each phase
- One directory per phase with task breakdown and execution steps

## Key File Locations

**Entry Points:**

- `package.json` - Root workspace configuration (npm workspaces, Turborepo scripts)
- `apps/demo/app/_layout.tsx` - Demo app root with Expo Router + ThemeProvider
- `packages/cli/src/index.ts` - CLI main with Commander program setup
- `packages/core/src/index.ts` - Core exports (~100 tokens and hooks)
- `packages/registry/registry.json` - Component manifest (metadata source)

**Configuration:**

- `tsconfig.base.json` - Base TypeScript config (shared across workspace)
- `tsconfig.react-native.json` - React Native specific TypeScript config
- `turbo.json` - Turborepo pipeline (build, dev, lint, type-check tasks)
- `.eslintrc.js` - ESLint rules (shared)
- `.prettierrc` - Prettier formatting rules
- `apps/demo/mcellui.config.ts` - Demo theme configuration (user-facing example)

**Core Logic:**

- `packages/core/src/theme/ThemeProvider.tsx` - Theme context and hooks (450 lines)
- `packages/core/src/theme/colors.ts` - Color token definitions with 8 presets
- `packages/core/src/theme/radius.ts` - Border radius token generation
- `packages/core/src/theme/typography.ts` - Font size, weight, line height scales
- `packages/cli/src/commands/add.ts` - Component installation logic with dependency resolution
- `packages/registry/registry.json` - All 105 components metadata (JSON manifest)

**Component Examples:**

- `packages/registry/ui/button.tsx` - UI component example (Pressable + animations)
- `packages/registry/ui/form.tsx` - Form system with react-hook-form integration
- `packages/registry/blocks/login-block.tsx` - Composite block example
- `packages/registry/screens/login-screen.tsx` - Full screen template example

**Testing & Quality:**

- `.eslintrc.js` - Linting configuration
- `.prettierrc` - Code formatting rules
- Workspace scripts in `package.json`: `build`, `lint`, `type-check`, `format`

## Naming Conventions

**Files:**

- Components: `kebab-case.tsx` (e.g., `button.tsx`, `avatar-stack.tsx`, `empty-state-block.tsx`)
- Config: `camelCase.ts` (e.g., `mcellui.config.ts`, `tsconfig.json`)
- Index files: `index.ts` or `index.tsx` (barrel exports)
- Types/interfaces: In same file as implementation, not separate `.types.ts` files

**Directories:**

- Package names: `lowercase-with-hyphens` (e.g., `mcp-server`, `metro-plugin`)
- UI components: `ui/` (atomic components: button, input, card, etc.)
- Composite components: `blocks/` (card-like sections: product-card, login-block, etc.)
- Pages/full screens: `screens/` (complete screens: login-screen, cart-screen, etc.)
- Utilities: `utils/` with feature suffix (e.g., `utils/project.ts`, `utils/dependencies.ts`)
- Context: `context/` (e.g., `ThemeSettingsContext.tsx`)

**Exports:**

- Named exports for components: `export const Button = ...`
- Named exports for functions: `export function useTheme() { ... }`
- Types exported: `export type ButtonProps = { ... }`
- No default exports (consistency across codebase)

## Where to Add New Code

**New UI Component:**
- Primary code: `packages/registry/ui/{name}.tsx`
- Dependencies: List in `packages/registry/registry.json` entry for the component
- Example: Copy structure from `packages/registry/ui/button.tsx`
- Export: No barrel file needed; CLI handles imports
- Style: Use `useTheme()` for colors, spacing, typography; StyleSheet for static styles

**New Block Component:**
- Implementation: `packages/registry/blocks/{name}.tsx`
- Composition: Import from `packages/registry/ui/` components
- Example: See `packages/registry/blocks/login-block.tsx`, `product-card.tsx`
- Registry entry: Add to `packages/registry/registry.json` with type: "block"

**New Screen Template:**
- Implementation: `packages/registry/screens/{name}-screen.tsx`
- Scope: Complete, full-height screen with SafeAreaView, ScrollView, and spacing
- Callbacks: Export callback props (onLogin, onSignUp, etc.) for integration
- Example: See `packages/registry/screens/login-screen.tsx`, `cart-screen.tsx`
- Registry entry: Add to `packages/registry/registry.json` with type: "screen"

**New Design Token:**
- Add to: `packages/core/src/theme/{category}.ts` (colors.ts, spacing.ts, typography.ts, etc.)
- Export from: `packages/core/src/theme/index.ts`
- Expose via: `packages/core/src/index.ts` (main entry point)
- Type: Strongly typed interfaces (e.g., `ThemeColors`, `RadiusTokens`)
- Consumer: Accessed via `const { colors, spacing } = useTheme()`

**New CLI Command:**
- Implementation: `packages/cli/src/commands/{command-name}.ts`
- Export: Register in `packages/cli/src/index.ts` with `program.addCommand()`
- Pattern: Create Command() object with .name(), .description(), .option(), .action()
- Example: See `packages/cli/src/commands/init.ts`, `add.ts`

**New Utility Function:**
- Shared across components: `packages/core/src/utils/{name}.ts`
- CLI utilities: `packages/cli/src/utils/{name}.ts`
- Demo app utilities: `apps/demo/lib/{name}.ts`
- Export: From module's `index.ts` file (barrel pattern)

**Styling Approach:**

All components use React Native StyleSheet + useTheme():

```tsx
import { useTheme } from '@metacells/mcellui-core';

function MyComponent() {
  const { colors, spacing, radius } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing[4],
      borderRadius: radius.md,
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* content */}
    </View>
  );
}
```

**No Style Files:**
- Do NOT create `.css`, `.scss`, `.module.css` files
- Do NOT use StyleSheet.create() outside of component files
- Inline static styles in component file via StyleSheet.create()
- Dynamic styles use `useTheme()` hook

## Special Directories

**node_modules:**
- Purpose: Installed dependencies
- Generated: Yes (not committed)
- Committed: No
- Install: `npm install` at root

**ios/ and android/:**
- Purpose: Native project files (Expo managed)
- Generated: Yes (managed by Expo)
- Committed: Yes (required for native builds)
- Modify: Via Expo CLI or XCode/Android Studio (rarely needed)

**dist/ and .turbo/:**
- Purpose: Build outputs and Turborepo cache
- Generated: Yes (via `npm run build` and Turbo)
- Committed: No (in .gitignore)

**.planning/:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by GSD agents)
- Committed: Yes (reviewed and versioned)

**docs/phases/ (in root):**
- Purpose: Original phase planning documentation
- Contains: Phase 1-13 planning files
- Committed: Yes (reference for development)

---

*Structure analysis: 2026-01-26*
