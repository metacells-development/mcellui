# Technology Stack

**Analysis Date:** 2026-01-24

## Languages

**Primary:**
- TypeScript 5.4.0 - All source code, components, and tooling
- JavaScript (ES2022) - Build scripts, configuration files

**Secondary:**
- JSX/TSX - React Native components in `packages/registry/ui/` and `apps/demo/`
- JavaScript - Figma plugin UI (esbuild-bundled)

## Runtime

**Environment:**
- Node.js 20.0.0 (minimum)
- Expo SDK 54 (for demo app and component library)
- React Native 0.81.5 (core runtime for components)

**Package Manager:**
- npm 10.2.4
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core React Native:**
- React 19.1.0 (demo) / 18.x (peer for components) - UI framework
- React Native 0.81.5 - Mobile runtime
- Expo 54 - Development and deployment platform

**Build & Bundling:**
- Turbo 2.0.0 - Monorepo task orchestration (used in `turbo.json`)
- Metro (via Expo) - React Native bundler with plugin support
- tsup 8.0.0 - TypeScript build tool for CLI and MCP packages
- esbuild 0.20.0 - Figma plugin bundling
- Babel 7.24.0 - Code transformation (demo app)

**Web/Documentation:**
- Next.js 15.0.3 - Documentation site with App Router
- Tailwind CSS 4.0.0-beta.8 - Web UI styling
- Fumadocs 15.0.0 - MDX documentation framework
- React Native Web 0.21.2 - React Native components in web documentation

**Animations & Gestures:**
- React Native Reanimated 4.1.1 - GPU-accelerated animations (used in all interactive components)
- React Native Gesture Handler 2.28.0 - Native gesture recognition

**Testing & Quality:**
- ESLint 9.0.0 - Code linting (flat config format)
- TypeScript ESLint 8.0.0 - TS-specific linting rules
- Prettier 3.2.5 - Code formatting
- Commander 12.0.0 - CLI argument parsing

**Form & Validation:**
- react-hook-form 7.54.0 (demo) / 7.50.0+ (peer) - Form state management
- @hookform/resolvers 3.9.0 (demo) / 3.3.0+ (peer) - Validation adapters
- Zod 3.24.0 (demo) / 3.22.0+ (peer) - Schema validation library

**Navigation & Routing:**
- Expo Router 6.0.21 - File-based routing for demo app
- React Navigation (via expo-router) - Navigation system

**UI Components & Design:**
- Radix UI (web only, docs site) - Headless components for documentation
- Class Variance Authority 0.7.0 - Component variant patterns (docs site)
- CLSX 2.1.1 - Conditional CSS class utilities

**Utilities & CLI:**
- Chalk 5.3.0 - Terminal colors in CLI
- Ora 8.0.0 - CLI spinners
- Prompts 2.4.2 - Interactive CLI prompts
- fs-extra 11.2.0 - Enhanced filesystem operations
- Glob 10.3.0 - File pattern matching
- detect-indent 7.0.1 - Auto-detect indentation
- Jiti 1.21.0 - Import config files dynamically
- Diff 7.0.0 - File difference comparison

**MCP (Model Context Protocol):**
- @modelcontextprotocol/sdk 1.0.0 - MCP server framework for Claude integration

**Expo Ecosystem:**
- expo-router 6.0.21 - File-based routing
- expo-status-bar 3.0.9 - Status bar control
- expo-constants 18.0.13 - App constants
- expo-asset 12.0.12 - Asset management
- expo-haptics 15.0.8 - Haptic feedback
- expo-linear-gradient 15.0.8 - Gradient component
- expo-linking 8.0.11 - Deep linking
- @react-native-community/datetimepicker 8.4.4 - Native date/time picker
- react-native-safe-area-context 5.6.0 - Safe area support
- react-native-screens 4.16.0 - Native screen management

**Documentation & Development:**
- Lucide React 0.454.0 - Icon library (docs site)
- Shiki 1.22.2 - Code syntax highlighting
- Rehype Pretty Code 0.14.0 - Markdown code block processing
- Motion 11.18.2 - Animation library for web
- Sonner 1.7.0 - Toast notifications for web
- Fuse.js 7.0.0 - Fuzzy search (docs site)
- Nuqs 2.2.3 - Query string utilities (docs site)
- next-themes 0.4.3 - Theme switching (docs site)

## Configuration

**Environment:**
- Configuration via `mcellui.config.ts` in user projects (optional)
- Theme provider accepts config object at runtime
- No required environment variables for component library
- Optional: `MCELLUI_REGISTRY_URL` or `NATIVEUI_REGISTRY_URL` for custom registry (defaults to GitHub)

**Build:**
- TypeScript configuration: `tsconfig.json` (extends Expo base)
- ESLint: `eslint.config.js` (flat config, v9+ format)
- Prettier: `.prettierrc` (JSON format)
- Turbo: `turbo.json` (task orchestration config)
- Package manager: `npm` with workspaces in root `package.json`

**Publishing:**
- npm registry: `https://registry.npmjs.org`
- GitHub Actions: `release.yml` publishes on git tags (v*)
- Packages published: `@metacells/mcellui-cli`, `@metacells/mcellui-core`, `@metacells/mcellui-mcp-server`
- Registry package `@metacells/mcellui-registry` is private (monorepo only)

## Platform Requirements

**Development:**
- Node.js >= 20.0.0
- npm >= 10.2.4
- Xcode (for iOS simulator testing)
- Android Studio/Emulator (for Android testing)
- Metro bundler (via Expo)

**Production - Demo App (Expo):**
- iOS 15+ (optimized for iOS 17-18)
- Android API 29+ (optimized for Android 13-14)
- Tested on Expo Go compatible devices

**Production - CLI Package:**
- Node.js >= 18.0.0
- Runs on macOS, Linux, Windows via npm

**Production - MCP Server:**
- Node.js >= 18.0.0
- Integrates with Claude/Anthropic's Model Context Protocol

**Production - Web Documentation:**
- Modern browsers supporting ES2022+
- Next.js 15 deployment platform (Vercel/Netlify ready)

## Key Dependencies by Purpose

**Animation & Performance:**
- `react-native-reanimated` ~4.1.1 - All animated components use this
- `react-native-worklets` ^0.7.1 - Performance optimization

**Form Handling:**
- `react-hook-form` >=7.50.0 - FormField, FormItem components depend on this
- `@hookform/resolvers` >=3.3.0 - Zod integration for validation
- `zod` >=3.22.0 - Schema validation in form examples

**Mobile Development:**
- `expo` 54 - Core development platform
- `expo-router` ~6.0.21 - Navigation framework
- `react-native` 0.81.5 - Core runtime

**CLI & Tooling:**
- `commander` ^12.0.0 - Command parsing
- `chalk` ^5.3.0 - Terminal styling
- `ora` ^8.0.0 - Spinner animations
- `prompts` ^2.4.2 - Interactive prompts
- `tsup` ^8.0.0 - Build tool

**AI/LLM Integration:**
- `@modelcontextprotocol/sdk` ^1.0.0 - MCP server for Claude integration

**Development Quality:**
- `typescript` ^5.4.0 - Type checking
- `eslint` ^9.0.0 - Linting
- `prettier` ^3.2.5 - Code formatting

---

*Stack analysis: 2026-01-24*
