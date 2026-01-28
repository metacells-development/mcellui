---
phase: 20-spacing-typography-naming
plan: 02
subsystem: ui
tags: [design-tokens, radius, theme, react-native]

# Dependency graph
requires:
  - phase: 20-01
    provides: spacing token migration pattern
provides:
  - All UI component borderRadius values use radius tokens
  - Radius preset changes apply globally to all 7 migrated components
  - Intentional sub-token design details (1, 1.5) preserved
affects: [20-03, 20-04, 20-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "radius.xs for 2px values, radius.sm for 4px values"
    - "Intentional sub-token values (1, 1.5) kept as-is for subtle design details"

key-files:
  created: []
  modified:
    - packages/mcp-server/registry/ui/input.tsx
    - packages/mcp-server/registry/ui/chip.tsx
    - packages/mcp-server/registry/ui/alert.tsx
    - packages/mcp-server/registry/ui/action-sheet.tsx
    - packages/mcp-server/registry/ui/calendar.tsx
    - packages/mcp-server/registry/ui/datetime-picker.tsx

key-decisions:
  - "borderRadius values >= 2 migrate to tokens (radius.xs or radius.sm)"
  - "borderRadius values < 2 (1, 1.5) kept as intentional design details"

patterns-established:
  - "radius.xs (2) for small rounded elements (handle indicators, icon details)"
  - "radius.sm (4) for interactive button elements (icon buttons, close buttons)"

# Metrics
duration: 3min
completed: 2026-01-28
---

# Phase 20 Plan 02: Radius Token Migration Summary

**7 UI components migrated from hardcoded borderRadius to theme tokens, enabling global radius preset changes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-28T13:13:17Z
- **Completed:** 2026-01-28T13:16:22Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Migrated all borderRadius >= 2 to radius tokens (radius.xs or radius.sm)
- Preserved intentional design details (borderRadius: 1, 1.5) for subtle visual effects
- Enabled global radius preset changes to affect all migrated components

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate radius in form and alert components** - `fc5c639` (refactor)
2. **Task 2: Migrate radius in calendar and date components** - `ea06576` (refactor)

## Files Created/Modified
- `packages/mcp-server/registry/ui/input.tsx` - iconButton uses radius.sm for rounded corners
- `packages/mcp-server/registry/ui/chip.tsx` - closeButton uses radius.sm for rounded corners
- `packages/mcp-server/registry/ui/alert.tsx` - closeButton uses radius.sm for rounded corners
- `packages/mcp-server/registry/ui/action-sheet.tsx` - handle uses radius.xs for subtle rounding
- `packages/mcp-server/registry/ui/calendar.tsx` - marked dot uses radius.xs for circular indicator
- `packages/mcp-server/registry/ui/datetime-picker.tsx` - handle and calendarBody use radius.xs

## Decisions Made

1. **Intentional sub-token values preserved** - borderRadius values of 1 and 1.5 are intentional design details for subtle visual effects (close button lines, icon details). These are smaller than the smallest token (radius.xs = 2) and should remain hardcoded.

2. **Mapping strategy** - borderRadius: 2 → radius.xs, borderRadius: 4 → radius.sm. This follows the radius scale where base=8: xs=2, sm=4, md=8, lg=12.

3. **Inline dynamic styles** - All migrated borderRadius values moved from StyleSheet.create() to inline styles, since StyleSheet is evaluated at module load time and cannot access theme tokens.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Radius token migration pattern established for remaining components
- Ready for typography token migration (fontSize, lineHeight, fontWeight)
- 7 components now respond to global radius preset changes
- Pre-existing TypeScript errors in MCP server remain (documented technical debt)

---
*Phase: 20-spacing-typography-naming*
*Completed: 2026-01-28*
