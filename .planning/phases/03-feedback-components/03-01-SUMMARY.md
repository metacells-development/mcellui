---
phase: 03-feedback-components
plan: 01
subsystem: design-tokens
status: complete
completed: 2026-01-24
duration: 2.25 min
wave: 1
depends_on: []
requires: []
provides:
  - ALERT_CONSTANTS with sm/md/lg size variants
  - POPOVER_CONSTANTS with animation and positioning tokens
  - TOOLTIP_CONSTANTS with delay and display tokens
  - overlayTypography tokens for Dialog/AlertDialog/Sheet
affects:
  - 03-02: Dialog/AlertDialog/Sheet can use overlayTypography
  - 03-03: Alert component can use ALERT_CONSTANTS
  - 03-04: Popover component can use POPOVER_CONSTANTS
  - 03-05: Tooltip component can use TOOLTIP_CONSTANTS
tech-stack:
  added: []
  patterns:
    - Centralized feedback component constants pattern
    - Overlay typography token sharing pattern
key-files:
  created: []
  modified:
    - packages/core/src/constants.ts
    - packages/core/src/theme/components.ts
    - packages/core/src/index.ts
    - packages/core/src/theme/index.ts
decisions:
  - id: overlay-typography-tokens
    context: Dialog, AlertDialog, and Sheet need consistent typography
    decision: Created shared overlayTypography tokens for title and description
    rationale: Avoids hardcoded values in each component, ensures visual consistency
    alternatives: Component-specific typography tokens
  - id: alert-size-variants
    context: Alert component needs size flexibility
    decision: Three size variants (sm/md/lg) with padding, icons, gaps, and typography
    rationale: Consistent with other component size APIs (Button, Input, etc.)
    alternatives: Single size with custom props
  - id: popover-spring-config
    context: Popover animations need smooth motion
    decision: Spring config with damping 20, stiffness 400
    rationale: Provides responsive feel without overshoot
    alternatives: Timing-based animations
tags:
  - design-tokens
  - constants
  - typography
  - feedback-components
---

# Phase 03 Plan 01: Feedback Component Tokens Summary

**One-liner:** Extended core token system with Alert/Popover/Tooltip constants and overlay typography tokens

## Objective

Establish the token foundation for all feedback components (Dialog, AlertDialog, Sheet, Toast, Alert, Popover, Tooltip) by adding centralized constants and typography tokens.

## What Was Built

### 1. Alert Constants (ALERT_CONSTANTS)
Added comprehensive size variant tokens for the Alert component:
- **Size variants:** sm/md/lg with padding (12/16/20)
- **Icon sizes:** 16/20/24 per size variant
- **Gap values:** 8/12/16 between icon and text
- **Typography:** Title sizes (13/15/17) and text sizes (12/14/16)

### 2. Popover Constants (POPOVER_CONSTANTS)
Added positioning and animation tokens:
- **Layout:** defaultOffset: 8, defaultMaxWidth: 280, minWidth: 120
- **Animation durations:** in: 150ms, out: 100ms
- **Spring config:** damping: 20, stiffness: 400

### 3. Tooltip Constants (TOOLTIP_CONSTANTS)
Added display and timing tokens:
- **Layout:** padding: 12, margin: 8, arrowSize: 8
- **Sizing:** defaultMaxWidth: 250
- **Behavior:** defaultDelay: 500ms
- **Animation:** in: 150ms, out: 100ms

### 4. Overlay Typography Tokens (overlayTypography)
Created shared typography for modal-style components:
- **Title:** fontSize.lg (18), semibold, lineHeight: 24
- **Description:** fontSize.base (14), normal, lineHeight: 20
- Used by Dialog, AlertDialog, and Sheet

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Add feedback component constants to constants.ts | 44e7c5e | ✅ Complete |
| 2 | Add overlay typography tokens to components.ts | 2f0684e | ✅ Complete |
| 3 | Export new constants from index.ts | 188883f | ✅ Complete |

## Key Changes

### packages/core/src/constants.ts
- Added `ALERT_CONSTANTS` with 12 properties covering all size variants
- Added `POPOVER_CONSTANTS` with 7 properties for positioning and animation
- Added `TOOLTIP_CONSTANTS` with 7 properties for display and timing
- Exported type definitions for all three constants

### packages/core/src/theme/components.ts
- Added `overlayTypography` token object with title and description styles
- Included in components export object for theme integration

### packages/core/src/index.ts
- Added explicit `overlayTypography` export to theme exports section
- Constants automatically exported via `export * from './constants'`

### packages/core/src/theme/index.ts
- Added explicit `overlayTypography` export from components

## Decisions Made

**1. Overlay Typography Tokens**
- **Decision:** Create shared `overlayTypography` tokens for Dialog, AlertDialog, and Sheet
- **Rationale:** These three components share identical typography requirements. Centralizing prevents duplication and ensures consistency.
- **Impact:** Future overlay components can reuse these tokens

**2. Alert Size Variants**
- **Decision:** Implement three size variants (sm/md/lg) for Alert component
- **Rationale:** Maintains API consistency with other components (Button, Input, etc.)
- **Impact:** Users expect size prop to work consistently across all components

**3. Popover Spring Animation**
- **Decision:** Use spring config (damping: 20, stiffness: 400) instead of timing
- **Rationale:** Spring animations provide more natural, responsive feel for popovers
- **Impact:** Smoother animations that feel native to the platform

## Deviations from Plan

None - plan executed exactly as written.

## Testing & Verification

### Verification Results
✅ TypeScript compilation passes (1 pre-existing unrelated error in ConfigProvider)
✅ All new constants exist in constants.ts
✅ overlayTypography exists in components.ts and is exported
✅ All exports accessible from @metacells/mcellui-core

### Manual Verification
- Verified ALERT_CONSTANTS export via grep
- Verified POPOVER_CONSTANTS export via grep
- Verified TOOLTIP_CONSTANTS export via grep
- Verified overlayTypography in components export
- Confirmed no circular dependencies
- Confirmed no duplicate exports

## Next Phase Readiness

**Blockers:** None

**Ready for:**
- 03-02: Dialog/AlertDialog/Sheet can immediately use overlayTypography tokens
- 03-03: Alert component can reference ALERT_CONSTANTS
- 03-04: Popover component can reference POPOVER_CONSTANTS
- 03-05: Tooltip component can reference TOOLTIP_CONSTANTS

**Concerns:** None

## Performance Metrics

- **Duration:** 2.25 minutes (135 seconds)
- **Tasks completed:** 3/3 (100%)
- **Commits:** 3 atomic commits
- **Files modified:** 4 files
- **Lines added:** ~100 LOC

## Context for Future Sessions

When working with feedback components:

1. **Use centralized constants:** All feedback components should reference these constants instead of hardcoded values
2. **Overlay typography pattern:** Any modal/overlay component should use `overlayTypography` tokens
3. **Size variant consistency:** Alert follows the same sm/md/lg pattern as form inputs
4. **Animation approach:** Popover uses spring, Tooltip uses timing - this is intentional based on UX needs

## Links

- **Plan:** `.planning/phases/03-feedback-components/03-01-PLAN.md`
- **Research:** `.planning/phases/03-feedback-components/03-RESEARCH.md`
- **Phase overview:** `.planning/ROADMAP.md` (Phase 3)
