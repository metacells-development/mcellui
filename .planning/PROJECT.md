# mcellui Quality Refinement

## What This Is

A quality refinement milestone for mcellui — a copy-paste UI component library for Expo/React Native. The library has 55 UI components, 28 blocks, and 19 screens that were built incrementally. Early components (Button, Card) are high quality; later components drifted in consistency. This milestone brings everything to the same 10/10 standard.

## Core Value

Every component, block, and screen feels like it was designed and built together — consistent visual language, consistent API patterns, complete state coverage.

## Requirements

### Validated

<!-- Existing functionality that works and should be preserved -->

- ✓ Copy-paste component library architecture — existing
- ✓ Theme system with tokens (colors, spacing, radius, typography) — existing
- ✓ CLI for adding components (`npx mcellui add`) — existing
- ✓ MCP server for AI integration — existing
- ✓ Demo app with component showcase — existing
- ✓ 55 UI components implemented — existing
- ✓ 28 block templates implemented — existing
- ✓ 19 screen templates implemented — existing
- ✓ Form system with react-hook-form + Zod — existing
- ✓ Dark mode support — existing
- ✓ Reanimated animations — existing

### Active

<!-- Quality standards to achieve across all components -->

- [ ] **VISUAL-01**: All components use theme spacing tokens (no hardcoded values)
- [ ] **VISUAL-02**: All components use consistent border radius from tokens
- [ ] **VISUAL-03**: All components use unified shadow/elevation system
- [ ] **VISUAL-04**: All components use typography tokens for font sizes
- [ ] **VISUAL-05**: All components use color tokens correctly (light/dark)
- [ ] **API-01**: All components use consistent prop naming (variant, size, disabled)
- [ ] **API-02**: All components use consistent variant values (default, secondary, destructive)
- [ ] **API-03**: All components use consistent size scale (sm, md, lg)
- [ ] **API-04**: Complex components use compound pattern (Dialog.Content, etc.)
- [ ] **API-05**: All components have complete TypeScript types
- [ ] **STATE-01**: All interactive components support disabled state
- [ ] **STATE-02**: All async components support loading state
- [ ] **STATE-03**: All validatable components support error state
- [ ] **STATE-04**: All focusable components have focus ring for accessibility
- [ ] **DEMO-01**: Demo app shows all variants for each component
- [ ] **DEMO-02**: Demo app shows all states for each component
- [ ] **COMPOSE-01**: Components compose from existing primitives where cleaner

### Out of Scope

- New components — this milestone is refinement only
- New blocks or screens — polish existing, don't add
- Documentation site — separate effort
- Breaking API changes to published packages — maintain compatibility
- Performance optimization — focus is consistency, not speed

## Context

**Gold standard:** Button and Card components represent the quality target. They:
- Use all theme tokens correctly
- Have consistent prop patterns
- Support all interactive states
- Have clean, readable code

**Current state:** Later components were rushed. Common issues:
- Hardcoded spacing/colors instead of tokens
- Inconsistent prop names across similar components
- Missing disabled/loading/error states
- Incomplete TypeScript types

**Scope:** 102 items total (55 UI + 28 blocks + 19 screens), grouped by similarity for efficient batching.

**Existing patterns to follow:**
- `useTheme()` hook for all styling
- StyleSheet.create() for static styles
- Reanimated for animations
- Compound component pattern for complex UI

## Constraints

- **Tech stack**: Expo SDK 54, React Native 0.81.5, Reanimated 4.1.1, TypeScript 5.4
- **Compatibility**: iOS 15+, Android API 29+, Expo Go compatible
- **Architecture**: Must preserve copy-paste philosophy (no runtime dependencies)
- **Testing**: Manual testing on iOS Simulator + Android Emulator before completion

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Group components by similarity | Efficient batching, consistent patterns within groups | — Pending |
| Button/Card as gold standard | Early components are highest quality | — Pending |
| Full state coverage (disabled, loading, error, focused) | Accessibility and UX completeness | — Pending |
| Update demos alongside components | Ensure showcase reflects true capabilities | — Pending |

---
*Last updated: 2026-01-24 after initialization*
