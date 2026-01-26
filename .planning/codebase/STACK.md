# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.4.0 - All source code, React Native components and React components
- JavaScript - Configuration files, build scripts

**Secondary:**
- JSX/TSX - React and React Native UI components

## Runtime

**Environment:**
- Node.js 20.0.0+ - Development and CLI runtime
- React Native 0.81.5 - Mobile app runtime (iOS/Android)
- Expo SDK 54+ - Managed React Native platform

**Package Manager:**
- npm 10.2.4
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.1.0 - UI library (used in demo, docs, registry)
- React Native 0.81.5 - Native mobile framework
- Expo 54.0.31 - Managed React Native platform

**Routing & Navigation:**
- Expo Router 6.0.21 - File-based routing for demo app (`apps/demo`)
- React Navigation - Navigation stack (via Expo Router)

**Animation & Gestures:**
- react-native-reanimated 4.1.1 - High-performance animations (used in Sheet, Card, Slider, Accordion, Tabs, etc.)
- react-native-gesture-handler 2.28.0 - Gesture detection for touch interactions (used in Slider, SwipeableRow, Sheet)

**Form Management:**
- react-hook-form 7.54.0 - Form state management
- @hookform/resolvers 3.9.0 - Validation resolver integration

**Styling & Theme:**
- React Native StyleSheet - CSS-in-JS for React Native
- Custom ThemeProvider - Located in `packages/core/src/theme` - provides design tokens and color schemes

**Accessibility:**
- react-native-safe-area-context 5.6.0 - Safe area handling (notches, dynamic island)
- react-native-screens 4.16.0 - Native screen components for performance

**Graphics & Icons:**
- react-native-svg 15.12.1 - SVG rendering support
- expo-linear-gradient 15.0.8 - Gradient rendering (HeroBlock uses this)

**Testing:**
- No testing framework detected in dependencies

**Build/Dev:**
- Turborepo 2.0.0 - Monorepo orchestration and build caching
- tsup 8.0.0 - TypeScript bundler (used in `packages/cli`, `packages/metro-plugin`, `packages/mcp-server`)
- Metro - React Native bundler (via Expo)
- esbuild - JavaScript bundler (Figma plugin)
- Babel - JavaScript transpiler (via Expo, custom babel.config.js)

**Code Quality:**
- ESLint 9.0.0 - Linting
- typescript-eslint 8.0.0 - TypeScript linting rules
- Prettier 3.2.5 - Code formatting
- eslint-config-prettier 9.1.0 - Disables conflicting ESLint rules

**Documentation:**
- fumadocs-core 15.0.0 - Documentation framework
- fumadocs-mdx 11.0.0 - Markdown integration
- fumadocs-ui 15.0.0 - Documentation UI components (in `apps/docs`)

**Web Build (Docs Site):**
- Next.js 15.0.3 - React framework for documentation site (`apps/docs`)
- Tailwind CSS 4.0.0-beta.8 - Utility CSS framework
- PostCSS 8.4.47 - CSS transformation

**Utility Libraries:**
- zod 3.24.0 - TypeScript-first schema validation (used in CLI, MCP server, forms)
- commander 12.0.0 - CLI framework (CLI tool)
- chalk 5.3.0 - Terminal colors (CLI tool)
- fs-extra 11.2.0 - Extended file system methods (CLI tool)
- glob 10.3.0 - File pattern matching (CLI tool)
- prompts 2.4.2 - Interactive CLI prompts (CLI tool)
- ora 8.0.0 - Terminal spinners (CLI tool)
- diff 7.0.0 - Text diffing (CLI tool)
- detect-indent 7.0.1 - Indentation detection (CLI tool)
- jiti 1.21.0 - TypeScript loader for config files (CLI tool)
- @react-native-community/datetimepicker 8.4.4 - Native date/time picker
- react-native-web 0.21.2 - React Native for web
- Radix UI - Headless component library for docs site

## Configuration

**Environment:**
- No environment variables required (zero-config philosophy)
- Configuration via `mcellui.config.ts` in user projects
- Design tokens stored in `packages/core/src/tokens/` and `packages/core/src/theme/`

**Build:**
- `metro.config.js` - Metro bundler configuration (`apps/demo/metro.config.js`)
- `babel.config.js` - Babel configuration with module resolver (`apps/demo/babel.config.js`)
- `tsup.config.ts` - TypeScript bundler for CLI/plugins
- `turbo.json` - Turborepo build task configuration

**Linting & Formatting:**
- `.eslintrc.js` - ESLint configuration (flat config format)
- `.prettierrc` - Prettier configuration (100 char line width, semicolons, single quotes)

## Platform Requirements

**Development:**
- Node.js >= 20.0.0
- macOS, Linux, or Windows
- Xcode (for iOS development on macOS)
- Android Studio (for Android development)

**Production:**
- iOS 15+ (optimized for iOS 17-18)
- Android 10+ (API 29+, optimized for Android 13-14)
- Expo Go (compatible where possible)

**Monorepo Structure:**
- Workspaces: `apps/*` and `packages/*`
- Root `package.json` defines workspace configuration
- Each package has independent `package.json` and build configuration

---

*Stack analysis: 2026-01-26*
