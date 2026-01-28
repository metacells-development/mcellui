---
phase: 19-critical-color-api-fixes
plan: 09
subsystem: ui
tags: [theme, tokens, avatar, semantic-colors, dark-mode]

# Dependency graph
requires:
  - phase: 19-05
    provides: Avatar standardized to 3-size scale (sm|md|lg)
  - phase: 19-01
    provides: Semantic color token system
provides:
  - Hardcoded hex colors (#fff, #ffffff) replaced with semantic tokens in 3 UI components
  - Invalid Avatar size="xl" usages replaced with valid size="lg" in blocks and screens
  - Theme-adaptive text and backgrounds in card, avatar-stack, swipeable-row components
affects: [v1.2-consistency-sweep, dark-mode, theming]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ImageCard text uses colors.primaryForeground for theme adaptation"
    - "AvatarStack initials and wrapper backgrounds use semantic tokens"
    - "SwipeableRow action text defaults to colors.primaryForeground"

key-files:
  created: []
  modified:
    - packages/registry/ui/card.tsx
    - packages/registry/ui/avatar-stack.tsx
    - packages/registry/ui/swipeable-row.tsx
    - packages/registry/blocks/profile-block.tsx
    - packages/registry/screens/profile-screen.tsx
    - packages/registry/screens/account-screen.tsx

key-decisions:
  - "ImageCard subtitle uses colors.primaryForeground with 0.8 opacity instead of rgba(255,255,255,0.8)"
  - "AvatarStack wrapper background uses colors.background for consistent borders"
  - "All Avatar size=\"xl\" changed to size=\"lg\" per standardized API from 19-05"

patterns-established:
  - "Text-on-image overlays use colors.primaryForeground for theme support"
  - "Avatar component only accepts 3 sizes: sm, md, lg (no xl, 2xl)"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 19 Plan 09: Gap Closure Summary

**Hardcoded hex colors replaced with semantic tokens in 3 UI components, and invalid Avatar API usages fixed in blocks/screens**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T12:10:56Z
- **Completed:** 2026-01-28T12:13:05Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- All #fff/#ffffff hardcoded colors replaced with colors.primaryForeground or colors.background
- All invalid Avatar size="xl" usages replaced with valid size="lg"
- 6 files now fully theme-aware and compliant with standardized Avatar API

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix hex colors in card.tsx, avatar-stack.tsx, swipeable-row.tsx** - `bfc9e97` (fix)
2. **Task 2: Fix Avatar size="xl" usages** - `99bbea1` (fix)

## Files Created/Modified
- `packages/registry/ui/card.tsx` - ImageCard title and subtitle now use colors.primaryForeground
- `packages/registry/ui/avatar-stack.tsx` - Initials text and wrapper background use semantic tokens
- `packages/registry/ui/swipeable-row.tsx` - Action text defaults to colors.primaryForeground
- `packages/registry/blocks/profile-block.tsx` - Avatar size changed from "xl" to "lg"
- `packages/registry/screens/profile-screen.tsx` - Avatar size changed from "xl" to "lg"
- `packages/registry/screens/account-screen.tsx` - Avatar size changed from "xl" to "lg"

## Decisions Made

**ImageCard subtitle opacity approach:**
Changed `rgba(255,255,255,0.8)` to `colors.primaryForeground` with `opacity: 0.8` style property. This maintains visual appearance while using semantic tokens that adapt to theme.

**AvatarStack background token choice:**
Used `colors.background` instead of hardcoded `#ffffff` for avatar wrapper background. This ensures avatar borders appear correctly in both light and dark modes.

**Avatar size standardization:**
All "xl" usages changed to "lg" to comply with Avatar component's standardized 3-size scale established in plan 19-05.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Gap closure complete. All hardcoded hex colors and invalid Avatar API usages from VERIFICATION.md have been resolved.

**Remaining gaps from VERIFICATION.md:**
- 9 demo app files missing `-block` suffix (out of scope for this plan, tracked separately)

**Phase 19 status:**
- All 9 gap closure plans complete (19-06 through 19-09)
- All UI components, blocks, and screens now use semantic tokens
- All components comply with standardized APIs

---
*Phase: 19-critical-color-api-fixes*
*Completed: 2026-01-28*
