---
phase: 04-progress-loading
plan: 02
subsystem: ui
tags: [spinner, skeleton, design-tokens, migration, react-native]

# Dependency graph
requires:
  - phase: 04-progress-loading
    plan: 01
    provides: spinnerTokens, skeletonTokens centralized in core
provides:
  - Spinner component consuming spinnerTokens for size variants
  - Skeleton component consuming skeletonTokens for radius and animation
  - Token-based sizing eliminates hardcoded magic numbers
affects: [04-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Component token consumption pattern (import tokens, access by size variant)
    - Animation token usage (duration, minOpacity, maxOpacity from tokens)
    - Text component defaults from token definitions

key-files:
  created: []
  modified:
    - packages/registry/ui/spinner.tsx
    - packages/registry/ui/skeleton.tsx
    - packages/core/src/index.ts

key-decisions: []

patterns-established:
  - "Component imports tokens and accesses by size: spinnerTokens[size]"
  - "Animation values consumed from nested token structure: skeletonTokens.animation.duration"
  - "Default props use token values: lines = skeletonTokens.text.defaultLines"

# Metrics
duration: 3.8min
completed: 2026-01-25
---

# Phase 04 Plan 02: Spinner & Skeleton Token Migration

**Migrate Spinner and Skeleton components from hardcoded values to centralized theme tokens**

## Performance

- **Duration:** 3.8 min
- **Started:** 2026-01-25T10:09:08Z
- **Completed:** 2026-01-25T10:12:57Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Migrated Spinner component to use spinnerTokens for container and indicator sizing
- Migrated Skeleton component to use skeletonTokens for radius, animation, and text defaults
- Removed all hardcoded magic numbers (16, 24, 36, 1500, 0.3, 0.6) from both components
- Fixed missing token exports from core package index.ts
- Both components now fully token-driven and theme-configurable

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Spinner to spinnerTokens** - `6277246` (refactor)
2. **Task 2: Migrate Skeleton to skeletonTokens** - `ec8eeb7` (refactor)
3. **Bug fix: Export tokens from core index** - `7f626cb` (fix)

## Files Created/Modified

- `packages/registry/ui/spinner.tsx` - Removed sizeMap and containerSizes constants, now uses spinnerTokens[size].containerSize and tokens.indicatorSize
- `packages/registry/ui/skeleton.tsx` - Removed radiusMap constant and hardcoded animation values, now uses skeletonTokens.radius, skeletonTokens.animation, and skeletonTokens.text
- `packages/core/src/index.ts` - Added spinnerTokens, skeletonTokens, progressTokens, circularProgressTokens to main package exports (bug fix from 04-01)

## Decisions Made

None - implementation followed established token consumption patterns from previous phases.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing token exports from core package index**

- **Found during:** Task 1 verification
- **Issue:** spinnerTokens and skeletonTokens were defined in theme/components.ts and exported from theme/index.ts, but not re-exported from the main packages/core/src/index.ts entry point. This caused TypeScript errors "Module has no exported member 'spinnerTokens'" when components tried to import them.
- **Fix:** Added spinnerTokens, skeletonTokens, progressTokens, circularProgressTokens to the main index.ts export list alongside other component tokens
- **Files modified:** packages/core/src/index.ts
- **Commit:** 7f626cb
- **Rationale:** Bug from plan 04-01 that prevented token consumption - required for task completion

## Issues Encountered

**TypeScript module resolution:**
- Initial imports failed because tokens weren't re-exported from main package entry point
- Fixed by adding explicit exports to packages/core/src/index.ts
- No cache clearing or rebuild needed - proper exports resolved the issue immediately

## User Setup Required

None - all changes are internal component refactoring.

## Next Phase Readiness

**Ready for 04-03 (Progress & CircularProgress migration):**
- Token consumption pattern validated with Spinner and Skeleton
- Bug in core package exports fixed (benefits all future token additions)
- No blockers for remaining wave 2 migrations

**Migration pattern established:**
1. Import tokens from @metacells/mcellui-core
2. Access tokens by size variant: `const tokens = componentTokens[size]`
3. Use nested token structures for config: `tokens.animation.duration`
4. Replace default props with token values
5. Maintain existing accessibility and functionality

**Token usage validated for:**
- Container sizing (Spinner)
- Border radius variants (Skeleton)
- Animation timing and opacity ranges (Skeleton)
- Text component defaults (SkeletonText)

---
*Phase: 04-progress-loading*
*Completed: 2026-01-25*
