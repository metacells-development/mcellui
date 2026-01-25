---
phase: 05-data-display
plan: 01
subsystem: theme-tokens
tags: [tokens, chip, label, rating, avatarStack, radius]
requires: []
provides: [chipTokens, labelTokens, ratingTokens, avatarStackTokens, componentRadius.chip, componentRadius.image]
affects: [05-02, 05-03, 05-04]
tech-stack:
  added: []
  patterns: [centralized-tokens, component-radius-mapping]
key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
    - packages/core/src/theme/radius.ts
decisions:
  - "chipTokens lg uses spacing[5] (20px) instead of 4.5 (18px) - spacing scale doesn't have 4.5"
  - "chip uses radiusTokens.lg for pill-like appearance without full circular"
  - "image uses radiusTokens.md for default rounded corners"
metrics:
  duration: "2 min"
  completed: "2026-01-25"
---

# Phase 05 Plan 01: Extend Token System for Data Display Components Summary

Data display component tokens (chip, label, rating, avatarStack) centralized in components.ts with componentRadius entries for chip and image.

## What Was Built

### Token Objects Added to components.ts

1. **chipTokens** - Chip component sizing
   - sm: paddingHorizontal 10, paddingVertical 4, fontSize 12, iconSize 16
   - md: paddingHorizontal 14, paddingVertical 6, fontSize 14, iconSize 16
   - lg: paddingHorizontal 20, paddingVertical 8, fontSize 16, iconSize 20

2. **labelTokens** - Label component typography
   - sm: fontSize 12, lineHeight 16, fontWeight medium
   - md: fontSize 14, lineHeight 20, fontWeight medium
   - lg: fontSize 16, lineHeight 24, fontWeight medium

3. **ratingTokens** - Rating component star sizing
   - sm: starSize 18, gap 2
   - md: starSize 26, gap 4
   - lg: starSize 34, gap 6

4. **avatarStackTokens** - AvatarStack component sizing
   - sm: size 28, fontSize 10, borderWidth 2
   - md: size 36, fontSize 12, borderWidth 2
   - lg: size 44, fontSize 14, borderWidth 3
   - xl: size 56, fontSize 18, borderWidth 3

### componentRadius Entries Added to radius.ts

- `chip: radiusTokens.lg` - pill-like but not full circular
- `image: radiusTokens.md` - default rounded corners for images

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| chipTokens lg uses spacing[5] | spacing scale doesn't have 4.5 key | 20px instead of 18px, minimal visual difference |
| chip uses lg radius | Pill-like appearance without being fully circular | Respects theme preset while maintaining chip identity |
| image uses md radius | Default rounded corners following design system | Consistent with other content containers |

## Commits

| Hash | Message |
|------|---------|
| 0fda932 | feat(04-01): add progress component tokens (includes data display tokens) |
| c9d9dda | feat(05-01): add componentRadius entries for chip and image |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed invalid spacing key**
- **Found during:** Task 1
- **Issue:** Plan specified `spacing[4.5]` but that key doesn't exist in spacing scale
- **Fix:** Used `spacing[5]` (20px) instead, closest to original 18px value
- **Files modified:** packages/core/src/theme/components.ts
- **Commit:** Part of 0fda932

## Next Phase Readiness

**Unblocked:**
- 05-02: Chip component migration (has chipTokens)
- 05-03: Label component migration (has labelTokens)
- 05-04: Rating component migration (has ratingTokens)

**Dependencies satisfied:**
- All four token objects exported from components.ts
- componentRadius.chip and componentRadius.image available
