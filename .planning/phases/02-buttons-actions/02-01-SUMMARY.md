---
phase: 02-buttons-actions
plan: 01
subsystem: ui
tags: [design-tokens, theme, radius, components]

# Dependency graph
requires:
  - phase: 01-form-inputs
    provides: Token foundation pattern from buttonTokens, componentRadius, and inputTokens
provides:
  - iconButtonTokens, fabTokens, segmentedControlTokens, actionSheetTokens with size variants
  - Component radius mappings for iconButton, fab, segmentedControl, actionSheet
affects: [02-02, 02-03, 02-04, 02-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Consistent token structure for button-like components (size variants with iconSize, fontSize, padding)"
    - "Specialized tokens for non-standard layouts (actionSheet with item/header/cancel sections)"

key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
    - packages/core/src/theme/radius.ts

key-decisions:
  - "IconButton XL variant uses size 56px with iconSize 28 (matches existing sizeConfig pattern)"
  - "FAB always uses PILL_RADIUS for fully circular shape regardless of theme preset"
  - "SegmentedControl MD variant uses height 40px (slightly smaller than componentHeight.md for compact feel)"
  - "ActionSheet items use componentHeight.lg (48px) for comfortable touch targets"

patterns-established:
  - "Helper function pattern: createComponentRadius extends radius mappings as new components are added"
  - "iconButtonRounded pattern: separate token for rounded=true prop (PILL_RADIUS vs preset radius)"

# Metrics
duration: 2min
completed: 2026-01-24
---

# Phase 2 Plan 1: Token Foundation Summary

**Centralized component tokens for IconButton, FAB, SegmentedControl, and ActionSheet with consistent size variants and radius mappings**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-24T20:58:09Z
- **Completed:** 2026-01-24T21:00:05Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added iconButtonTokens with sm/md/lg/xl variants following button pattern
- Added fabTokens with sm/md/lg variants including typography tokens
- Added segmentedControlTokens with sm/md/lg variants and dual font weights
- Added actionSheetTokens with item/header/cancel sections for flexible layouts
- Extended ComponentRadiusTokens interface with 6 new radius mappings
- All tokens exported in components object and accessible via theme

## Task Commits

Each task was committed atomically:

1. **Task 1: Add IconButton, FAB, SegmentedControl, and ActionSheet tokens to components.ts** - `f6ae1ba` (feat)
2. **Task 2: Add component radius tokens for IconButton, FAB, SegmentedControl, ActionSheet** - `925531e` (feat)

## Files Created/Modified
- `packages/core/src/theme/components.ts` - Added iconButtonTokens, fabTokens, segmentedControlTokens, actionSheetTokens
- `packages/core/src/theme/radius.ts` - Extended ComponentRadiusTokens interface and createComponentRadius function

## Decisions Made

**IconButton XL variant sizing**
- Used size 56px with iconSize 28 to match existing sizeConfig pattern
- Maintains consistency with current IconButton implementation

**FAB always circular**
- FAB uses PILL_RADIUS (9999) for fully circular shape
- Ensures FAB remains circular regardless of theme radius preset

**SegmentedControl compact sizing**
- MD variant uses height 40px (vs componentHeight.md of 44px)
- Creates more compact feel appropriate for segmented controls
- SM and LG variants follow standard componentHeight values

**ActionSheet touch targets**
- Items use componentHeight.lg (48px) for comfortable touch targets
- Header and cancel sections maintain consistent spacing
- Follows iOS/Android touch target guidelines

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript compilation verified successful (pre-existing ConfigProvider error unrelated to these changes).

## Next Phase Readiness

**Ready for component implementation:**
- 02-02 (IconButton component) can use iconButtonTokens and componentRadius.iconButton
- 02-03 (FAB component) can use fabTokens and componentRadius.fab
- 02-04 (SegmentedControl component) can use segmentedControlTokens and componentRadius.segmentedControl
- 02-05 (ActionSheet component) can use actionSheetTokens and componentRadius.actionSheet

**No blockers:**
- All tokens properly typed and exported
- Token structure follows established pattern from Phase 1
- Components can proceed with token-based styling

---
*Phase: 02-buttons-actions*
*Completed: 2026-01-24*
