---
phase: 18-core-package-exports
plan: 01
subsystem: core-package
tags: [exports, types, cleanup, typescript]
requires:
  - phase-17 # Registry structure with metadata.json
provides:
  - clean-core-exports
  - verified-export-completeness
  - no-orphaned-exports
affects:
  - phase-18-02 # Documentation will reference clean exports
tech-stack:
  added: []
  patterns:
    - Barrel export pattern for TypeScript types
    - Comprehensive type re-exporting from sub-modules
key-files:
  created: []
  modified:
    - packages/core/src/index.ts
    - packages/core/src/theme/index.ts
    - packages/core/src/theme/components.ts
    - packages/core/src/constants.ts
decisions:
  - title: Remove orphaned exports
    rationale: >
      screenTokens, SCREEN_CONSTANTS, and SKELETON_CONSTANTS had zero usage across
      registry and demo. Removing prevents documentation debt and confusion.
    alternatives: []
    tradeoffs: None - purely cleanup
  - title: Add missing type exports to root barrel
    rationale: >
      SpacingValue, RadiusValue, ComponentRadiusKey, ComponentRadiusTokens, LineHeightKey,
      and LetterSpacingKey were exported from theme/index.ts but not re-exported from root.
      Users importing from @metacells/mcellui-core should have access to all types.
    alternatives: []
    tradeoffs: None - improves developer experience
metrics:
  duration: 164s
  completed: 2026-01-28
---

# Phase 18 Plan 01: Core Package Exports Cleanup Summary

**One-liner:** Removed 3 orphaned exports (screenTokens, SCREEN_CONSTANTS, SKELETON_CONSTANTS) and added 6 missing type exports to root barrel

## What Was Done

### Task 1: Remove 3 Confirmed Orphans
- ✅ Verified zero usage of screenTokens, SCREEN_CONSTANTS, SKELETON_CONSTANTS across registry and demo
- ✅ Removed screenTokens and SCREEN_CONSTANTS from:
  - `packages/core/src/theme/components.ts` (removed 58 lines of token definitions)
  - `packages/core/src/theme/index.ts` (removed from re-export list)
  - `packages/core/src/index.ts` (removed from theme re-export block)
- ✅ Removed SKELETON_CONSTANTS from:
  - `packages/core/src/constants.ts` (removed object and SkeletonConstants type)
- ✅ Verified removal with grep - zero results
- ✅ Type-check passed

**Rationale:**
- `screenTokens`/`SCREEN_CONSTANTS`: Never used by any component. Screen layout patterns are component-specific, not global tokens.
- `SKELETON_CONSTANTS`: Duplicate of `skeletonTokens.animation` which is the canonical source.

**Commit:** `53166af` - refactor(18-01): remove 3 orphaned exports from core package

### Task 2: Verify Export Completeness
- ✅ Verified all subpath exports (`/`, `/tokens`, `/utils`) resolve correctly
- ✅ Verified tokens/index.ts exports all token files (colors, spacing, typography, radius, shadows)
- ✅ Verified utils/index.ts exports all utility files (cn, platform, accessibility, haptics, expoGo, typography)
- ✅ Identified and added 6 missing type exports to root barrel:
  - `SpacingValue` - Type for spacing token values
  - `RadiusValue` - Type for radius token values
  - `ComponentRadiusKey` - Keys for component-specific radii
  - `ComponentRadiusTokens` - Component radius token structure
  - `LineHeightKey` - Keys for line height scale
  - `LetterSpacingKey` - Keys for letter spacing scale
- ✅ Verified package.json exports map matches dist structure
- ✅ Turbo type-check passed across monorepo

**Commit:** `22e0b78` - feat(18-01): add missing type exports to core package root barrel

## Deviations from Plan

None - plan executed exactly as written.

## Technical Details

### Export Completeness Analysis
Performed a broader orphan scan by extracting all 85 named exports from `packages/core/src/index.ts` and comparing against imports from registry/demo.

**Finding:** Many exports showed zero internal usage (component tokens, config utilities, font presets, etc.) but these are **intentional public API exports** for user consumption, not orphans. The core package is a library - most exports are meant for external use, not internal consumption.

**Key distinction:**
- **Orphan:** Export with no documented purpose, duplicate of another export, or leftover from refactoring
- **Public API:** Export intentionally provided for library users, even if not used internally

### Type Export Strategy
The root barrel (`packages/core/src/index.ts`) now consistently re-exports all types from sub-modules:
- Theme types: All color, spacing, radius, typography, animation types
- Token types: Legacy token types for backward compatibility
- Config types: Configuration and provider types
- Utility types: Platform detection, accessibility, haptics types

This ensures users importing from `@metacells/mcellui-core` get full TypeScript intellisense and type safety.

## Verification Results

```bash
# Orphan removal verified
$ grep -r "screenTokens\|SCREEN_CONSTANTS\|SKELETON_CONSTANTS" packages/core/src/
# (no output)

# Type-check passed
$ npm run type-check -w packages/core
> @metacells/mcellui-core@0.1.2 type-check
> tsc --noEmit
# (success)

# Turbo type-check passed
$ npx turbo run type-check --filter=@metacells/mcellui-core
Tasks:    1 successful, 1 total
Time:    963ms
```

## Files Modified

| File | Changes | Impact |
|------|---------|--------|
| `packages/core/src/theme/components.ts` | -58 lines (removed screenTokens/SCREEN_CONSTANTS) | No breaking change - unused exports |
| `packages/core/src/theme/index.ts` | -2 exports | Propagates cleanup to theme barrel |
| `packages/core/src/index.ts` | -2 exports, +6 type exports | Cleaner API, better type coverage |
| `packages/core/src/constants.ts` | -11 lines (removed SKELETON_CONSTANTS) | No breaking change - unused constant |

## Impact Assessment

### Breaking Changes
None. All removed exports had zero usage.

### Non-Breaking Improvements
- 6 new type exports improve TypeScript intellisense for users
- Cleaner export list reduces cognitive load when browsing API
- Documentation will be more accurate (Phase 18-02)

## Next Phase Readiness

**Phase 18-02 (Export Documentation):**
- ✅ Clean export list ready to document
- ✅ All types properly exported for API reference
- ✅ No orphaned exports to confuse documentation

**Future Phase Considerations:**
- Core package exports are now stable
- Any new tokens/utilities should follow the established barrel pattern
- Type exports should be added to root barrel immediately

## Performance

- **Duration:** 164 seconds (~3 minutes)
- **Tasks completed:** 2/2
- **Commits:** 2 atomic commits
- **Files modified:** 4
- **Lines changed:** -84 additions, +6 type exports

## Lessons Learned

1. **Public API vs. Internal Orphans:** Export usage analysis must distinguish between unused-but-intentional public API and true orphans (duplicates, refactoring leftovers).

2. **Type Export Completeness:** Barrel files should re-export ALL types from sub-modules, not just frequently-used ones. Users expect comprehensive type coverage from main import path.

3. **Verification Strategy:** Zero-usage grep is definitive for orphan detection, but broader analysis requires understanding library vs. application context.
