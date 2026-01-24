# Codebase Structure

**Analysis Date:** 2026-01-24

## Directory Layout

```
mcellui/
├── packages/                    # Monorepo packages
│   ├── core/                    # Design system and theme
│   │   └── src/
│   │       ├── theme/          # Theme system (colors, spacing, radius, animation, typography)
│   │       ├── config/         # Config definition and provider
│   │       ├── tokens/         # Design tokens (legacy exports)
│   │       ├── utils/          # Utility functions
│   │       ├── primitives/     # Low-level React Native wrappers
│   │       ├── components/     # Error boundaries
│   │       └── constants.ts    # Magic numbers and constants
│   ├── registry/                # Component source code (copy-paste)
│   │   ├── ui/                 # 57 UI components
│   │   ├── blocks/             # 30+ screen blocks (LoginBlock, ProfileBlock, etc.)
│   │   ├── screens/            # 21 full-page screen templates
│   │   ├── hooks/              # Custom hooks (empty/minimal)
│   │   ├── primitives/         # Low-level building blocks
│   │   ├── registry.json       # Component metadata (name, type, files, dependencies)
│   │   ├── scripts/            # Build scripts (build-registry.js)
│   │   └── package.json        # Private package, no npm publish
│   ├── cli/                     # Command-line tool
│   │   ├── src/
│   │   │   ├── commands/       # init.ts, add.ts, list.ts, diff.ts, update.ts, doctor.ts, create.ts, pick.ts
│   │   │   ├── utils/          # Command helpers (file operations, registry parsing, validation)
│   │   │   └── index.ts        # CLI entry point with Commander
│   │   ├── dist/               # Compiled output
│   │   └── package.json        # Executable package (bin: mcellui)
│   ├── mcp-server/              # Model Context Protocol server
│   │   ├── src/
│   │   │   ├── resources/      # Resource definitions (components, screens, docs)
│   │   │   ├── tools/          # Tool definitions for AI assistants
│   │   │   └── index.ts        # MCP server setup and request handlers
│   │   ├── registry/           # Copied registry (symlinked during build)
│   │   └── package.json        # Published package
│   ├── metro-plugin/            # Expo Metro bundler plugin
│   │   ├── src/
│   │   │   ├── index.ts        # withMcellUI() function to wrap metro config
│   │   │   ├── findConfig.ts   # Locate mcellui.config.ts in project
│   │   │   └── emptyConfig.ts  # Fallback empty config
│   │   └── package.json
│   └── figma-plugin/            # (Secondary) Figma integration
│       └── src/
├── apps/                        # Monorepo applications
│   ├── demo/                    # Expo demo and showcase app
│   │   ├── app/                # Expo Router navigation
│   │   │   ├── _layout.tsx     # Root layout with theme selector
│   │   │   ├── index.tsx       # Home screen listing all components
│   │   │   ├── playground.tsx  # Theme token playground
│   │   │   ├── tokens.tsx      # Token reference screen
│   │   │   └── components/     # Dynamic component screens
│   │   ├── components/         # Demo-specific components
│   │   │   ├── ui/            # Copy of registry UI components
│   │   │   ├── blocks/        # Copy of registry blocks
│   │   │   ├── screens/       # Copy of registry screens
│   │   │   └── demos/         # Demo harnesses (ButtonDemo, CardDemo, etc.)
│   │   ├── context/            # Demo-only context (theme switching)
│   │   ├── lib/                # Demo utilities
│   │   ├── metro.config.js     # Metro config with mcellui plugin
│   │   ├── app.json            # Expo config
│   │   ├── mcellui.config.ts   # Demo's theme config
│   │   └── package.json
│   └── docs/                    # Documentation website
│       ├── app/                # Next.js app router
│       ├── components/         # Next.js components
│       ├── content/            # MDX documentation pages
│       ├── lib/                # Documentation utilities
│       └── package.json
├── docs/                        # Project documentation
│   ├── adr/                    # Architecture Decision Records
│   ├── features/               # Feature specifications
│   ├── phases/                 # Development phase documentation
│   ├── COMPONENT_GUIDELINES.md # How to write components
│   ├── VISION.md               # Project vision
│   └── ROADMAP.md              # High-level roadmap
├── .planning/                   # GSD planning outputs
│   └── codebase/               # Codebase analysis documents
├── .github/                     # GitHub config
│   ├── workflows/              # CI/CD pipelines
│   └── ISSUE_TEMPLATE/
├── .mcp.json                    # MCP server configuration
├── turbo.json                   # Turborepo config
├── package.json                 # Root monorepo package
├── tsconfig.base.json          # Base TypeScript config
├── tsconfig.json               # Root TypeScript config
├── tsconfig.react-native.json  # React Native specific config
├── tsconfig.node.json          # Node.js utilities config
├── .prettierrc                  # Code formatting
├── .eslintrc.js                # Code linting
├── PHASES.md                    # Development phases roadmap
├── REGISTRY.md                  # Registry documentation
├── CHANGELOG.md                 # Version history
└── CLAUDE.md                    # Project instructions for Claude
```

## Directory Purposes

**`packages/core/`:**
- Purpose: Design system library - shared tokens and theme system
- Contains: TypeScript only, no React components, pure functions and constants
- Key files: `src/theme/`, `src/config/`, `src/index.ts`
- Published to npm as `@metacells/mcellui-core`
- **Used by:** All other packages, consuming apps

**`packages/registry/`:**
- Purpose: Component source code repository
- Contains: TSX files for every component, block, and screen (not compiled, source only)
- Key files: `registry.json`, `ui/*.tsx`, `blocks/*.tsx`, `screens/*.tsx`
- **Not published** (private package)
- **Used by:** CLI for copying, MCP server for serving, demo app for showing examples

**`packages/cli/`:**
- Purpose: `npx mcellui` command-line tool
- Contains: Commander commands, file system operations, registry parsing
- Key files: `src/index.ts` (entry), `src/commands/*.ts`
- Published to npm as `@metacells/mcellui-cli`
- Executable binary at `dist/index.js`

**`packages/mcp-server/`:**
- Purpose: AI assistant integration (Claude Code, etc.)
- Contains: MCP protocol handlers, resource and tool definitions
- Key files: `src/index.ts`, `src/resources/index.ts`, `src/tools/index.ts`
- Published to npm as `@metacells/mcellui-mcp-server`
- Started as: `node -e "import('@metacells/mcellui-mcp-server').then(m => m.default?.())"`

**`packages/metro-plugin/`:**
- Purpose: Expo Metro bundler integration
- Contains: Virtual module resolver for dynamic config discovery
- Key files: `src/index.ts` (withMcellUI function), `src/findConfig.ts`
- Published to npm as `@metacells/mcellui-metro-plugin`
- Usage: Wrap metro config in `metro.config.js`

**`apps/demo/`:**
- Purpose: Expo reference app and component showcase
- Contains: Screen demos, theme playground, blocks examples
- Key files: `app/_layout.tsx`, `app/index.tsx`, `components/demos/`
- **Not published**
- **Also serves as:** Testing ground, documentation reference

**`docs/`:**
- Purpose: Architecture records, feature specs, component guidelines
- Contains: Markdown documentation and ADRs
- Key files: `COMPONENT_GUIDELINES.md`, `VISION.md`, `adr/`, `features/`

## Key File Locations

**Entry Points:**

| Entry | Location | Purpose |
|-------|----------|---------|
| CLI executable | `packages/cli/dist/index.js` | `npx mcellui` command |
| MCP server | `packages/mcp-server/dist/index.js` | AI integration entry |
| Demo app root | `apps/demo/app/_layout.tsx` | Expo Router root layout |
| Component export | `packages/registry/ui/button.tsx` | Each component file |

**Configuration:**

| File | Location | Purpose |
|------|----------|---------|
| Theme system | `packages/core/src/theme/index.ts` | All theme exports |
| Design tokens | `packages/core/src/tokens/` | Legacy token exports |
| Component registry | `packages/registry/registry.json` | Metadata for all components |
| App config | `apps/demo/mcellui.config.ts` | Example theme config |
| Metro plugin | `packages/metro-plugin/src/index.ts` | Config auto-discovery |
| TypeScript base | `tsconfig.base.json` | Shared TS configuration |
| Turborepo | `turbo.json` | Build pipeline config |

**Core Logic:**

| Component | Location | Purpose |
|-----------|----------|---------|
| Theme Provider | `packages/core/src/theme/provider.tsx` | Context setup and useTheme hook |
| ThemeProvider | `packages/core/src/theme/ThemeProvider.tsx` | Component wrapper |
| ConfigProvider | `packages/core/src/config/ConfigProvider.tsx` | Config wrapping |
| CLI add command | `packages/cli/src/commands/add.ts` | Main install logic |
| Registry parsing | `packages/cli/src/utils/` | Registry and file utilities |
| Button component | `packages/registry/ui/button.tsx` | Example UI component |
| LoginBlock | `packages/registry/blocks/login-block.tsx` | Example screen block |

**Testing:**
- No centralized test directory
- Tests co-located with source (not implemented in current phase)
- Command: `npm run type-check` for type safety

## Naming Conventions

**Files:**
- Components: kebab-case (e.g., `login-block.tsx`, `button.tsx`)
- Utilities: kebab-case (e.g., `get-theme.ts`)
- Screens in Expo Router: kebab-case or segment syntax (e.g., `[name].tsx`)
- Directories: kebab-case except `src`, `dist`, `node_modules`

**Exports:**
- Component names: PascalCase (e.g., `LoginBlock`, `Button`, `Card`)
- Type names: PascalCase (e.g., `LoginBlockProps`, `ButtonProps`)
- Hooks: camelCase starting with `use` (e.g., `useTheme`, `useConfig`)
- Constants: UPPER_SNAKE_CASE (e.g., `BUTTON_CONSTANTS`)
- Utilities: camelCase (e.g., `getTheme`, `resolveConfig`)

**Theme Tokens:**
- Color keys: camelCase (e.g., `primary`, `foreground`, `destructive`)
- Spacing keys: numeric indices (e.g., `spacing[4]`, `spacing[8]`)
- Radius keys: camelCase (e.g., `radius.lg`, `radius.sm`)
- Animation keys: camelCase (e.g., `springs.snappy`, `timing.linear`)

## Where to Add New Code

**New UI Component:**
1. Primary code: `packages/registry/ui/[component-name].tsx`
2. Add entry to `packages/registry/registry.json` with metadata
3. Copy to demo: `apps/demo/components/ui/[component-name].tsx`
4. Create demo file: `apps/demo/components/demos/[component-name]-demo.tsx`
5. Link in demo route: `apps/demo/app/components/[name].tsx`

**New Screen Block:**
1. Primary code: `packages/registry/blocks/[block-name].tsx`
2. Add entry to `packages/registry/registry.json` (type: "block")
3. Copy to demo: `apps/demo/components/blocks/[block-name].tsx`
4. Reference in demo: `apps/demo/components/demos/blocks-demo.tsx`

**New Full Screen:**
1. Primary code: `packages/registry/screens/[screen-name].tsx`
2. Add entry to registry.json (type: "screen")
3. Demo route: `apps/demo/app/screens/[screen-name].tsx`

**New Theme Token:**
1. If color: `packages/core/src/theme/colors.ts`
2. If spacing: `packages/core/src/theme/spacing.ts`
3. If radius: `packages/core/src/theme/radius.ts`
4. If animation: `packages/core/src/theme/animations.ts`
5. Export from: `packages/core/src/theme/index.ts`

**New CLI Command:**
1. Implementation: `packages/cli/src/commands/[command-name].ts`
2. Export in: `packages/cli/src/index.ts` (add to program)
3. Utilities: `packages/cli/src/utils/` as needed

**New Utility Function:**
1. Core utilities: `packages/core/src/utils/[name].ts`
2. CLI utilities: `packages/cli/src/utils/[name].ts`
3. Export from: corresponding `index.ts`

## Special Directories

**`packages/registry/`:**
- Purpose: Source of truth for all copyable code
- Generated: `registry.json` is manually maintained (but could be auto-generated)
- Committed: Yes, all source files committed
- Not compiled: TSX files stay as-is, users copy directly

**`apps/demo/components/`:**
- Purpose: Synced copies of registry for local demo
- Generated: Manually copied during development (could be scripted)
- Committed: Yes (for development convenience)
- Workflow: Edit in registry, copy to demo, test in demo app

**`packages/core/src/theme/`:**
- Purpose: Design token definitions
- Generated: No
- Committed: Yes
- 10+ files defining colors, spacing, radius, typography, animations, presets

**`apps/demo/app/components/[name].tsx`:**
- Purpose: Dynamic route for component demo pages
- Generated: No (Expo Router file)
- Committed: Yes
- Pattern: Renders component from `/components/demos/[name]-demo.tsx`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis output
- Generated: Yes (by analysis tools)
- Committed: Yes (reference for implementation)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (npm install)
- Committed: No (.gitignored)

**`dist/` and `build/` directories:**
- Purpose: Compiled output
- Generated: Yes (npm run build)
- Committed: No (.gitignored)
- Packages: `packages/cli/dist/`, `packages/mcp-server/dist/`, `packages/metro-plugin/dist/`

## Build Output Locations

| Package | Input | Output | Type |
|---------|-------|--------|------|
| `@metacells/mcellui-core` | `packages/core/src/` | Published as source (no dist) | Source |
| `@metacells/mcellui-cli` | `packages/cli/src/` | `packages/cli/dist/` | Bundled (tsup) |
| `@metacells/mcellui-mcp-server` | `packages/mcp-server/src/` | `packages/mcp-server/dist/` | Bundled (tsup) |
| `@metacells/mcellui-metro-plugin` | `packages/metro-plugin/src/` | `packages/metro-plugin/dist/` | Bundled (tsup) |
| `@metacells/mcellui-registry` | `packages/registry/` | registry.json in dist | Metadata |

---

*Structure analysis: 2026-01-24*
