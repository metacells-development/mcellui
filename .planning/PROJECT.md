# mcellui

## What This Is

A modern, copy-paste UI component library for Expo/React Native — inspired by shadcn/ui. The library provides 55 UI components, 28 blocks, and 19 screens that developers copy directly into their projects, owning the code completely.

## Core Value

Users own the component code. No npm dependency lock-in, full customization freedom, native-first styling.

## Current State (v1.0)

**Shipped:** 2026-01-26

All 102 components refined to consistent quality:
- Centralized theme token system (40+ token sets)
- Consistent API patterns (variant, size, disabled props)
- Complete state coverage (loading, error, disabled, focused)
- Full demo coverage with all variants and states

**Stats:** 33,870 LOC TypeScript | 102 components | 13 phases complete

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

### Active

<!-- Current scope for next milestone -->

(Define in next milestone)

### Out of Scope

- Performance optimization beyond current state — not a priority yet
- Breaking API changes to published packages — maintain v1.0 compatibility

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

---
*Last updated: 2026-01-26 after v1.0 milestone*
