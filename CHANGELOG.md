# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.5] - 2026-01-24

### Breaking Changes

#### Rebranding: `nativeui` → `mcellui`
This release completes the rebranding from `nativeui` to `mcellui`. All packages now use the `@metacells/mcellui-*` namespace.

- **Config file renamed**: `nativeui.config.ts` → `mcellui.config.ts`
  - Legacy `nativeui.config.ts` files still work (backwards compatible)
  - CLI will warn when using legacy config name
- **Package imports**: `@nativeui/core` → `@metacells/mcellui-core`
- **CLI program name**: `nativeui` → `mcellui`
  - Old: `npx nativeui add button`
  - New: `npx mcellui add button`

### Added

#### CLI (`@metacells/mcellui-cli` v0.1.5)
- **`mcellui diff` command** - Compare locally installed components against the registry
  - `npx mcellui diff` - diff all installed components
  - `npx mcellui diff button` - diff specific component(s)
  - `npx mcellui diff --list` - list components with differences only
  - `npx mcellui diff --json` - JSON output for CI/CD integration
  - Colored unified diff output (green=added, red=removed)
  - Exit code 0 if identical, 1 if differences found
  - Summary showing identical, modified, and custom components
- **`mcellui list --installed`** - Show only installed components
- **Automatic dependency resolution** - CLI now resolves registry dependencies automatically

#### Metro Plugin (`@metacells/mcellui-metro-plugin` v0.1.2) - NEW PACKAGE
- Auto-discovery of `mcellui.config.ts` at build time
- Seamless integration with Metro bundler
- Usage:
  ```js
  // metro.config.js
  const { withMcellUI } = require('@metacells/mcellui-metro-plugin');
  module.exports = withMcellUI(getDefaultConfig(__dirname));
  ```

#### Core (`@metacells/mcellui-core` v0.1.2)
- **Expo Go fallback** - Components now work in Expo Go without Reanimated crashes
  - `areAnimationsDisabled()` helper to check if animations should be disabled
  - `isExpoGo()` helper to detect Expo Go environment
  - Components gracefully degrade when Reanimated is not available
- **New layout components**: `Column`, `Row`, `Screen`
- **Animation constants** exported: `BUTTON_CONSTANTS`, `SHEET_CONSTANTS`, etc.

### Changed

#### Registry
- All components now use `@metacells/mcellui-core` imports directly
- No more import transformation needed during `mcellui add`
- Simplified `transformImports()` - only handles utils alias now

#### CLI
- Config detection priority: `mcellui.config.*` → `nativeui.config.*` (legacy)
- Doctor command checks for `@metacells/mcellui-core` dependency
- All output messages updated to use `mcellui` branding
- Improved local registry detection with `MCELLUI_REGISTRY_URL=""` support

#### MCP Server (`@metacells/mcellui-mcp-server` v0.1.6)
- Bundled registry updated with new imports
- All tools and resources use new package names

### Fixed
- Local registry path resolution in CLI
- Diff command now correctly normalizes content before comparison
- Config loading no longer crashes on jiti parse errors (falls back to defaults)

### Migration Guide

1. **Rename your config file**:
   ```bash
   mv nativeui.config.ts mcellui.config.ts
   ```

2. **Update imports in your components** (if you have local modifications):
   ```diff
   - import { useTheme } from '@nativeui/core';
   + import { useTheme } from '@metacells/mcellui-core';
   ```

3. **Update CLI commands**:
   ```diff
   - npx nativeui add button
   + npx mcellui add button
   ```

4. **Update package.json dependencies**:
   ```diff
   - "@nativeui/core": "^0.1.0"
   + "@metacells/mcellui-core": "^0.1.2"
   ```

5. **(Optional) Add metro plugin** for auto-config discovery:
   ```bash
   npm install @metacells/mcellui-metro-plugin
   ```

### Package Versions

| Package | Version |
|---------|---------|
| `@metacells/mcellui-cli` | 0.1.5 |
| `@metacells/mcellui-core` | 0.1.2 |
| `@metacells/mcellui-mcp-server` | 0.1.6 |
| `@metacells/mcellui-metro-plugin` | 0.1.2 |

## [0.1.0] - 2025-01-17

### Added

#### CLI (`@nativeui/cli`)
- `nativeui init` - Initialize project with mcellui.config.ts
- `nativeui add <component>` - Add components to your project
- `nativeui list` - List all available components
- `nativeui diff` - Show component updates available
- `nativeui update` - Update installed components
- `nativeui doctor` - Check project setup and compatibility
- `nativeui create` - Scaffold new custom components
- `nativeui pick` - Interactive component picker

#### MCP Server (`@nativeui/mcp-server`)
- 8 tools for AI-assisted development:
  - `nativeui_list_components` - List available components
  - `nativeui_get_component` - Get component source code
  - `nativeui_add_component` - Get CLI add instructions
  - `nativeui_suggest_component` - AI-powered suggestions
  - `nativeui_create_component` - Component creation guide
  - `nativeui_customize_theme` - Theme customization help
  - `nativeui_doctor` - Project diagnostics
  - `nativeui_search` - Search components
- 7 resources for documentation access

#### Components (43 total)
- **Inputs & Forms**: Button, Input, Textarea, Checkbox, Switch, Radio Group, Select, Slider, Stepper, Label, Search Input, DateTime Picker, Form
- **Data Display**: Card, Badge, Avatar, Avatar Stack, Skeleton, Progress, Rating, Image, Stories
- **Overlays & Feedback**: Dialog, Sheet, Toast, Alert Dialog, Action Sheet, Tooltip
- **Navigation**: Tabs, Accordion, Segmented Control
- **Mobile Patterns**: Pull to Refresh, Swipeable Row
- **Layout**: Separator, Spinner, List, Horizontal List, Section Header, Chip
- **Media**: Carousel, Image Gallery
- **Actions**: Icon Button, FAB

#### Blocks (14 total)
- LoginBlock, SignupBlock, SettingsListBlock, ProfileBlock
- EmptyStateBlock, ErrorStateBlock
- NotificationItem, ContentCard, FeatureCard, StatsCard
- QuickActionsGrid, HeroBlock, SocialProofBar, SearchHeader

#### Screens (2 total)
- OnboardingScreen, OTPVerificationScreen

#### Theme System
- 8 color presets: zinc, slate, stone, blue, green, rose, orange, violet
- 5 radius presets: none, sm, md, lg, full
- Light/Dark mode support
- Animation presets: subtle, playful

### Technical
- Monorepo with Turborepo
- TypeScript strict mode
- Reanimated 3 for animations
- Gesture Handler 2 for gestures
- React Native 0.76+ / Expo SDK 54+

[Unreleased]: https://github.com/metacells-development/mcellui/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/metacells-development/mcellui/compare/v0.1.0...v0.1.5
[0.1.0]: https://github.com/metacells-development/mcellui/releases/tag/v0.1.0
