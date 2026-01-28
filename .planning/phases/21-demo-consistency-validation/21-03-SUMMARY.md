---
phase: 21-demo-consistency-validation
plan: 03
subsystem: ui
tags: [demo, typography, tokens, theme, dark-mode]

# Dependency graph
requires:
  - phase: 20-spacing-typography-naming
    provides: Typography and spacing token system
provides:
  - High-violation demo files migrated to theme tokens
  - Demo components demonstrate proper token usage patterns
affects: [demo-app, documentation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Inline styles for dynamic theme token values
    - Icon components receive color prop without defaults (caller provides theme color)
    - fontSize.xs/sm/md/lg/xl/2xl for typography
    - fontWeight.medium/semibold/bold for font weights
    - spacing[N] for gap and padding values

key-files:
  modified:
    - apps/demo/components/demos/carousel-demo.tsx
    - apps/demo/components/demos/toggle-demo.tsx
    - apps/demo/components/demos/chip-demo.tsx
    - apps/demo/components/demos/segmented-control-demo.tsx
    - apps/demo/components/demos/circular-progress-demo.tsx
    - apps/demo/components/demos/card-demo.tsx
    - apps/demo/components/demos/horizontal-list-demo.tsx
    - apps/demo/components/demos/list-demo.tsx

key-decisions:
  - "Icon color defaults removed - callers pass colors.foreground"
  - "Showcase colors preserved (banner backgrounds, gallery colors) - intentional examples"
  - "StyleSheet fontSize/gap moved to inline for token access"
  - "fontSize 13 rounds up to fontSize.sm (14px) - no sub-token values"

patterns-established:
  - "Demo icons: Remove color defaults, pass from theme context"
  - "Dynamic styles: Use inline styles with useTheme() destructuring"
  - "Showcase preservation: Keep intentional hardcoded colors with comments"

# Metrics
duration: 12min
completed: 2026-01-28
---

# Phase 21 Plan 03: High-Violation Demo Migration Summary

**8 high-violation demo files migrated from hardcoded typography values to theme tokens while preserving intentional showcase colors**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-28T16:16:30Z
- **Completed:** 2026-01-28T16:28:30Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Migrated carousel-demo.tsx (fontSize 24/18 -> tokens, gap 32 -> spacing[8])
- Migrated toggle-demo.tsx (4 fontSize + 8 icon colors -> tokens)
- Migrated chip-demo.tsx (7 fontSize + icon colors -> tokens)
- Migrated segmented-control-demo.tsx (7 fontSize values -> tokens)
- Migrated circular-progress-demo.tsx (8 fontSize values -> tokens)
- Migrated card-demo.tsx (7 fontSize values -> tokens)
- Verified horizontal-list-demo.tsx already compliant
- Migrated list-demo.tsx (7 icon color defaults -> removed)
- All showcase colors preserved (banner backgrounds, gallery images, etc.)

## Task Commits

Each task was committed atomically:

1. **Task 1: carousel-demo and toggle-demo** - `bf32725` (refactor)
2. **Task 2: chip, segmented-control, circular-progress demos** - `af16b65` (refactor)
3. **Task 3: card, horizontal-list, list demos** - `3e68180` (refactor)

## Files Modified

- `apps/demo/components/demos/carousel-demo.tsx` - Typography tokens for banner/product text
- `apps/demo/components/demos/toggle-demo.tsx` - Typography tokens, icon colors from theme
- `apps/demo/components/demos/chip-demo.tsx` - Typography tokens, icon colors from theme
- `apps/demo/components/demos/segmented-control-demo.tsx` - Typography tokens for all labels
- `apps/demo/components/demos/circular-progress-demo.tsx` - Typography tokens for captions/labels
- `apps/demo/components/demos/card-demo.tsx` - Typography tokens for section titles/descriptions
- `apps/demo/components/demos/horizontal-list-demo.tsx` - Already compliant, verified
- `apps/demo/components/demos/list-demo.tsx` - Icon color defaults removed

## Decisions Made

1. **Icon color defaults removed** - Icons now receive `color` prop without `= '#000'` defaults. Callers pass `colors.foreground` from theme context. This ensures dark mode compatibility.

2. **Showcase colors preserved** - Banner background colors (#FF6B6B, #4ECDC4, etc.), gallery image colors (#E74C3C, #3498DB, etc.), and white text on colored backgrounds (#fff, rgba(255,255,255,0.85)) intentionally kept hardcoded. These demonstrate component visual capabilities.

3. **fontSize 13 -> fontSize.sm** - No sub-token for 13px exists. Rounded up to fontSize.sm (14px) per Phase 20 decision.

4. **StyleSheet to inline styles** - Moved typography styles from StyleSheet to inline to enable theme token access at runtime.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all migrations straightforward.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 high-violation demo files now use theme tokens
- Demo app demonstrates proper token usage patterns
- Dark mode should work correctly across all migrated demos
- Ready for final validation of demo consistency

---
*Phase: 21-demo-consistency-validation*
*Completed: 2026-01-28*
