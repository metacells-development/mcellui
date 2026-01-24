---
phase: 03-feedback-components
plan: 04
subsystem: design-tokens
status: complete
completed: 2026-01-24
duration: 18 min
wave: 2
depends_on: ["03-01"]
requires:
  - phase: 03-01
    provides: POPOVER_CONSTANTS and TOOLTIP_CONSTANTS in core package
provides:
  - Popover component using centralized POPOVER_CONSTANTS
  - Tooltip component using centralized TOOLTIP_CONSTANTS
affects:
  - Future feedback component implementations (reference pattern)
tech-stack:
  added: []
  patterns:
    - Centralized constants migration pattern for positioning components
key-files:
  created: []
  modified:
    - packages/registry/ui/popover.tsx
    - packages/registry/ui/tooltip.tsx
decisions: []
tags:
  - design-tokens
  - constants
  - positioning
  - feedback-components
---

# Phase 03 Plan 04: Popover & Tooltip Constants Migration Summary

**Popover and Tooltip migrated from hardcoded values to centralized POPOVER_CONSTANTS and TOOLTIP_CONSTANTS**

## Performance

- **Duration:** 18 minutes (1077 seconds)
- **Started:** 2026-01-24T20:28:40Z
- **Completed:** 2026-01-24T20:46:37Z
- **Tasks:** 2/2 (100%)
- **Files modified:** 2

## Accomplishments

- Popover now uses POPOVER_CONSTANTS for all magic numbers (offset, maxWidth, minWidth, animation durations, spring config)
- Tooltip internal constants removed, all 22 usages migrated to TOOLTIP_CONSTANTS
- Both components maintain exact same behavior with centralized maintainability

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Popover to POPOVER_CONSTANTS** - `b6e939f` (refactor)
2. **Task 2: Migrate Tooltip to TOOLTIP_CONSTANTS** - `7c4bb28` (refactor)

## Files Created/Modified

### packages/registry/ui/popover.tsx
- Replaced hardcoded `offset = 8` with `POPOVER_CONSTANTS.defaultOffset`
- Replaced hardcoded `maxWidth = 280` with `POPOVER_CONSTANTS.defaultMaxWidth`
- Replaced hardcoded `minWidth: 120` with `POPOVER_CONSTANTS.minWidth`
- Replaced animation durations (150ms/100ms) with `animationInDuration`/`animationOutDuration`
- Replaced spring config with `springDamping`/`springStiffness`

### packages/registry/ui/tooltip.tsx
- Removed internal constants: `TOOLTIP_PADDING`, `TOOLTIP_MARGIN`, `ARROW_SIZE`
- Replaced `delayMs = 500` with `TOOLTIP_CONSTANTS.defaultDelay`
- Replaced `maxWidth = 250` with `TOOLTIP_CONSTANTS.defaultMaxWidth`
- Replaced animation durations (150ms/100ms) with `animationInDuration`/`animationOutDuration`
- Updated all 22 usages of internal constants to reference centralized constants

## Decisions Made

None - followed plan as specified. All constants were already defined in plan 03-01.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward migration with no type errors or behavioral changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Blockers:** None

**Ready for:**
- Phase 3 remaining plans (03-05 if exists)
- All feedback components now use centralized constants for consistency

**Concerns:** None

## Context for Future Sessions

When migrating components to centralized constants:

1. **Import pattern:** Add constants to existing imports from `@metacells/mcellui-core`
2. **Replace defaults:** Update function parameter defaults with constant references
3. **Replace inline values:** Use `replace_all` for consistent constant names throughout file
4. **Remove internal constants:** Delete local constant definitions after migration
5. **Verify behavior:** Ensure exact same runtime behavior (no behavioral changes)

This pattern established for Popover/Tooltip can be applied to any component with magic numbers.

## Links

- **Plan:** `.planning/phases/03-feedback-components/03-04-PLAN.md`
- **Constants definition:** Plan 03-01 (`.planning/phases/03-feedback-components/03-01-SUMMARY.md`)
- **Phase overview:** `.planning/ROADMAP.md` (Phase 3)

---
*Phase: 03-feedback-components*
*Completed: 2026-01-24*
