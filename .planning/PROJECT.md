# mcellui

## What This Is

A modern, copy-paste UI component library for Expo/React Native — inspired by shadcn/ui. The library provides 55 UI components, 28 blocks, and 19 screens that developers copy directly into their projects, owning the code completely.

## Core Value

Users own the component code. No npm dependency lock-in, full customization freedom, native-first styling.

## Current State (v1.2)

**Shipped:** 2026-01-28

All inconsistencies fixed across the entire codebase:
- 250+ hardcoded values migrated to semantic tokens
- All icon colors use `colors.foreground` fallback for dark mode
- All shadows use `platformShadow()` helper for cross-platform consistency
- All overlays use `colors.overlay` / `colors.scrim` semantic tokens
- Avatar API standardized to `sm|md|lg` size scale
- Demo app follows same token and naming standards as library
- 14 consistency requirements satisfied (100%)

**Stats:** 329,405 LOC | 2,616 files | 21 phases complete (v1.0 + v1.1 + v1.2)

<details>
<summary>Previous: v1.1 (Shipped 2026-01-28)</summary>

All tooling audited and production-ready:
- Core package exports compiled JS (ESM-only with subpath exports)
- CLI has centralized error handling (stderr, exit codes, retry logic)
- MCP server optimized for AI agent consumption (descriptions, flat schemas, recovery hints)
- Registry has complete metadata (displayName, expoGo, schemaVersion, JSON Schema validation)
- All core exports documented with JSDoc (144 blocks across 15 files)

**Stats:** 33,870+ LOC TypeScript | 102 components | 18 phases complete (v1.0 + v1.1)
</details>

<details>
<summary>Previous: v1.0 (Shipped 2026-01-26)</summary>

All 102 components refined to consistent quality:
- Centralized theme token system (40+ token sets)
- Consistent API patterns (variant, size, disabled props)
- Complete state coverage (loading, error, disabled, focused)
- Full demo coverage with all variants and states

**Stats:** 33,870 LOC TypeScript | 102 components | 13 phases complete
</details>

## Next Milestone Goals

To be defined with `/gsd:new-milestone`

## Requirements

### Validated

<!-- Shipped and confirmed valuable -->

- ✓ Copy-paste component library architecture — v1.0
- ✓ Theme system with tokens (colors, spacing, radius, typography) — v1.0
- ✓ CLI for adding components (`npx mcellui add`) — v1.0
- ✓ MCP server for AI integration — v1.0
- ✓ Demo app with component showcase — v1.0
- ✓ 55 UI components with consistent tokens — v1.0
- ✓ 28 block templates with consistent tokens — v1.0
- ✓ 19 screen templates with consistent tokens — v1.0
- ✓ Form system with react-hook-form + Zod — v1.0
- ✓ Dark mode support — v1.0
- ✓ Reanimated animations — v1.0
- ✓ All components use theme spacing tokens — v1.0
- ✓ All components use consistent border radius — v1.0
- ✓ All components use unified shadow/elevation — v1.0
- ✓ All components use typography tokens — v1.0
- ✓ All components use color tokens correctly — v1.0
- ✓ All components have consistent prop naming — v1.0
- ✓ All interactive components support disabled state — v1.0
- ✓ All async components support loading state — v1.0
- ✓ All validatable components support error state — v1.0
- ✓ All focusable components have focus rings — v1.0
- ✓ Demo app shows all variants and states — v1.0
- ✓ CLI audit — error handling, exit codes, flag consistency, help text, edge cases — v1.1
- ✓ MCP Server audit — tool descriptions, responses, error recovery, flat schemas, resources — v1.1
- ✓ Core package audit — compiled exports, peer dependencies, package.json exports — v1.1
- ✓ Registry structure audit — metadata, dependencies, naming consistency, validation — v1.1
- ✓ Core exports audit — token documentation, utility types, orphan removal — v1.1
- ✓ All blocks/screens reuse existing UI components (MediaCard on Home screen) — v1.2
- ✓ Naming patterns consistent (16 demo blocks use `-block` suffix, `Block` exports) — v1.2
- ✓ All styling uses semantic color tokens (250+ hardcoded values migrated) — v1.2
- ✓ All styling uses spacing tokens (no raw number padding/margin) — v1.2
- ✓ All styling uses radius tokens (borderRadius ≥2 use `radius.*`) — v1.2
- ✓ All styling uses typography tokens (fontSize/fontWeight from theme) — v1.2
- ✓ All shadows use platformShadow() helper — v1.2
- ✓ All overlays use semantic tokens (overlay, scrim, backgroundElevated) — v1.2
- ✓ Avatar API standardized to sm|md|lg size scale — v1.2
- ✓ Demo app follows same token and naming standards — v1.2

### Active

<!-- No active requirements — run /gsd:new-milestone to define next version -->

### Out of Scope

- Performance optimization beyond current state — not a priority yet
- Breaking API changes to published packages — maintain v1.x compatibility

## Context

**Architecture:** Monorepo with Turborepo. Copy-paste distribution model.

**Tech stack:**
- Expo SDK 54, React Native 0.81.5
- TypeScript 5.4, Reanimated 4.1.1
- react-hook-form + Zod for forms

**Established patterns:**
- `useTheme()` hook for all styling
- Centralized tokens in `packages/core/src/theme/components.ts`
- StyleSheet.create() for static styles
- Compound component pattern for complex UI (Dialog, Sheet, Accordion)

**Codebase documentation:** See `.planning/codebase/` for detailed analysis

## Constraints

- **Tech stack**: Expo SDK 54, React Native 0.81.5, Reanimated 4.1.1, TypeScript 5.4
- **Compatibility**: iOS 15+, Android API 29+, Expo Go compatible
- **Architecture**: Must preserve copy-paste philosophy (no runtime dependencies)
- **Testing**: Manual testing on iOS Simulator + Android Emulator before completion

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Group components by similarity | Efficient batching, consistent patterns within groups | ✓ Good — 13 phases worked well |
| Button/Card as gold standard | Early components are highest quality | ✓ Good — clear reference point |
| Full state coverage (disabled, loading, error, focused) | Accessibility and UX completeness | ✓ Good — all 102 components compliant |
| Update demos alongside components | Ensure showcase reflects true capabilities | ✓ Good — demos comprehensive |
| Centralized token system | Single source of truth for styling | ✓ Good — 40+ token sets in use |
| ESM-only core package output | Modern bundlers, no CommonJS needed | ✓ Good — clean subpath exports |
| Optional peer dependencies | Users install only what they need | ✓ Good — animation libs optional |
| Centralized CLI error handling | Consistent stderr output, exit codes | ✓ Good — all 8 commands unified |
| MCP descriptions for AI agents | "{Action} {what}. Use this when {scenario}." | ✓ Good — agent tool selection improved |
| JSON Schema registry validation | CI enforcement of component quality | ✓ Good — Ajv v8 validates all 101 entries |
| JSDoc for all core exports | IDE intellisense for developers | ✓ Good — 144 doc blocks, full coverage |

---
*Last updated: 2026-01-28 after v1.2 milestone start*
