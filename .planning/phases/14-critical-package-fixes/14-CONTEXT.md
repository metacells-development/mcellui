# Phase 14: Critical Package Fixes - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix core package compilation and dependency declarations so users can install and import mcellui without issues. Three critical fixes:
1. Core package must export compiled JavaScript, not raw TypeScript
2. Animated components must declare peer dependencies
3. All packages must export ./package.json for tooling

</domain>

<decisions>
## Implementation Decisions

### Module format
- ESM only (user decision)
- No CommonJS dual-build needed
- Target Expo/Metro ecosystem which prefers ESM

### Claude's Discretion

**Main entry point:**
- Claude decides: root barrel vs subpath exports
- Consider developer ergonomics and tree-shaking

**Token exports:**
- Claude decides: granular imports vs bundled-only
- Consider existing usage patterns in codebase

**Source inclusion:**
- Claude decides: compiled-only vs include .ts source
- Consider package size vs debugging utility

**Version constraints:**
- Claude decides: React Native / Expo SDK peer dep ranges
- Consider project's stated compatibility (iOS 15+, Android API 29+, Expo Go)

**Backwards compatibility:**
- Claude decides: how to handle potential breakage
- Current exports are broken anyway, so likely no real users depend on them

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches that follow npm/Metro best practices.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-critical-package-fixes*
*Context gathered: 2026-01-26*
