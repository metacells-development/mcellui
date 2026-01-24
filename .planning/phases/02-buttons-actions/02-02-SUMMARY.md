---
phase: 02-buttons-actions
plan: 02
subsystem: button-components
tags: [iconbutton, tokens, accessibility, animations]
requires: [02-01]
provides: [token-based-iconbutton]
affects: []
tech-stack:
  added: []
  patterns: [token-driven-sizing, animation-accessibility, componentRadius-pattern]
key-files:
  created: []
  modified: [packages/registry/ui/icon-button.tsx]
decisions:
  - "IconButton uses 0.9 scale for press feedback (more prominent than Button's 0.95)"
  - "IconButton respects areAnimationsDisabled() for reduce-motion accessibility"
  - "IconButton uses BUTTON_CONSTANTS.disabledOpacity for consistent disabled state"
metrics:
  duration: 1.5
  completed: 2026-01-24
---

# Phase 02 Plan 02: IconButton Token Migration Summary

**One-liner:** IconButton migrated to centralized tokens with animation accessibility support

## Objective

Migrate IconButton to use centralized token system and add missing accessibility features to match Button's gold standard pattern.

## What Was Done

### Task 1: Migrate IconButton to Centralized Tokens ✅

**Changes Made:**

1. **Updated imports** - Added `BUTTON_CONSTANTS` and `areAnimationsDisabled` from core
2. **Removed hardcoded sizeConfig** - Deleted local size configuration object
3. **Added animation accessibility check** - Added `useMemo` for `areAnimationsDisabled()` check
4. **Updated theme destructuring** - Changed from `radius` to `components` and `componentRadius`
5. **Implemented token-based sizing**:
   - Size: `tokens.size` from `components.iconButton[size]`
   - Icon size: `tokens.iconSize` from same token object
6. **Updated border radius**:
   - Non-rounded: `componentRadius.iconButton`
   - Rounded: `componentRadius.iconButtonRounded`
7. **Respected animation preferences**:
   - Check `animationsEnabled` before running scale animations
   - Set scale to 1 when animations disabled
8. **Used constant for disabled opacity**:
   - Changed from hardcoded `0.5` to `BUTTON_CONSTANTS.disabledOpacity`
9. **Removed disabled style** - Moved opacity to inline style for dynamic application

**Files Modified:**
- `packages/registry/ui/icon-button.tsx` (-29 lines, +22 lines)

**Commit:** 291ca6d

## Deviations from Plan

None - plan executed exactly as written.

## Key Technical Details

### Token Structure Used

```typescript
const tokens = components.iconButton[size];
// tokens.size: 32 | 40 | 48 | 56
// tokens.iconSize: 16 | 20 | 24 | 28
```

### Border Radius Pattern

```typescript
const borderRadiusValue = rounded
  ? componentRadius.iconButtonRounded  // Fully circular
  : componentRadius.iconButton;        // Preset-based square
```

### Animation Accessibility

```typescript
const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

const handlePressIn = useCallback((e) => {
  if (animationsEnabled) {
    scale.value = withSpring(0.9, springs.snappy);
  }
  onPressIn?.(e);
}, [onPressIn, springs.snappy, animationsEnabled]);
```

### Scale Feedback Tuning

IconButton uses **0.9 scale** (10% reduction) for press feedback, which is more prominent than Button's 0.95 (5% reduction). This is intentional - icon buttons are smaller visual elements and need more pronounced feedback to feel responsive.

## Verification

✅ TypeScript compilation passes (IconButton component itself has no errors)
✅ Demo app structure verified (icon-button-demo.tsx exists with comprehensive coverage)
✅ All success criteria met:
  - Imports `areAnimationsDisabled` and `BUTTON_CONSTANTS` from core
  - Uses `components.iconButton[size]` for tokens
  - Uses `componentRadius.iconButton/iconButtonRounded` for border radius
  - Checks `animationsEnabled` before running animations
  - Uses `BUTTON_CONSTANTS.disabledOpacity` for disabled state
  - Local `sizeConfig` removed
  - Visual output unchanged (same sizes, same appearance)

## Impact

### Before
- Hardcoded size configuration
- No animation accessibility support
- Hardcoded disabled opacity (0.5)
- Used generic `radius.md` for border radius

### After
- Token-driven sizing from centralized config
- Respects reduce-motion accessibility preference
- Uses shared BUTTON_CONSTANTS for consistent disabled state
- Uses component-specific `componentRadius` pattern

### Design Consistency
All button-like components (Button, IconButton) now follow same patterns:
- Centralized token-based sizing
- Animation accessibility support
- Shared constants for disabled states
- Component-specific radius tokens

## Next Phase Readiness

**Status:** ✅ Ready to proceed

**Next Step:** Plan 02-03 - Migrate FAB to centralized tokens

**No blockers or concerns.**

---

**Total Duration:** 1.5 minutes
**Task Commits:** 1
**Deviations:** 0
