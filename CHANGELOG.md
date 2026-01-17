# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation site with React Native Web previews
- MCP server documentation page

### Changed
- Updated docs design with violet theme

## [0.1.0] - 2025-01-17

### Added

#### CLI (`@nativeui/cli`)
- `nativeui init` - Initialize project with nativeui.config.ts
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

[Unreleased]: https://github.com/metacells/nativeui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/metacells/nativeui/releases/tag/v0.1.0
