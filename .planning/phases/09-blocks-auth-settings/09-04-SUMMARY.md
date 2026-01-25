---
phase: 09-blocks-auth-settings
plan: 04
completed: 2026-01-25
duration: 2.3 min
subsystem: blocks
tags: [tokens, state-blocks, typography, migration]

requires:
  - 09-01 # Block token foundation

provides:
  - Token-based EmptyStateBlock with theme-aware typography
  - Token-based ErrorStateBlock with theme-aware typography
  - Consistent state block sizing across default/compact variants

affects:
  - Future state block consumers (now have token-based sizing)

tech-stack:
  added: []
  patterns:
    - "State blocks consume centralized stateBlockTokens for typography/sizing"

key-files:
  created: []
  modified:
    - packages/registry/blocks/empty-state-block.tsx
    - packages/registry/blocks/error-state-block.tsx
    - packages/core/src/index.ts

decisions:
  - "Export stateBlockTokens and profileBlockTokens from core/index for block consumption"
  - "SVG icon sizes (40/48px) preserved as component logic, not tokens (icon detail sizing)"
---

# Phase 09 Plan 04: State Block Token Migration Summary

**One-liner:** EmptyStateBlock and ErrorStateBlock migrated to use centralized stateBlockTokens for all typography and icon container sizing

## What Was Done

### Task 1: EmptyStateBlock Migration
- **Commit:** e44b084
- **Changes:**
  - Imported `stateBlockTokens` from core
  - Replaced hardcoded icon container sizes (64/80) with `stateBlockTokens.compact.iconContainerSize` / `stateBlockTokens.default.iconContainerSize`
  - Replaced hardcoded icon container radius (32/40) with `stateBlockTokens.compact.iconContainerRadius` / `stateBlockTokens.default.iconContainerRadius`
  - Replaced hardcoded title fontSize (18/20) with `stateBlockTokens.compact.titleFontSize` / `stateBlockTokens.default.titleFontSize`
  - Replaced hardcoded description fontSize (14/15) with `stateBlockTokens.compact.descriptionFontSize` / `stateBlockTokens.default.descriptionFontSize`
  - Added `fontWeight: stateBlockTokens.typography.titleFontWeight` to title
  - Removed `fontWeight: '600'` from styles.title (now token-based)

### Task 2: ErrorStateBlock Migration
- **Commit:** 0597b5d
- **Changes:**
  - Imported `stateBlockTokens` from core
  - Added local references: `tokens`, `errorTokens` for cleaner access
  - Replaced hardcoded icon container sizes (72/88) with `errorTokens.iconContainerSizeCompact` / `errorTokens.iconContainerSize`
  - Replaced hardcoded icon container radius (36/44) with `errorTokens.iconContainerRadiusCompact` / `errorTokens.iconContainerRadius`
  - Replaced hardcoded title fontSize (18/20) with `stateBlockTokens.compact.titleFontSize` / `stateBlockTokens.default.titleFontSize`
  - Replaced hardcoded description fontSize (14/15) with `stateBlockTokens.compact.descriptionFontSize` / `stateBlockTokens.default.descriptionFontSize`
  - Replaced hardcoded errorCode fontSize (12) with `errorTokens.codeFontSize`
  - Added `fontWeight: stateBlockTokens.typography.titleFontWeight` to title
  - Removed `fontWeight: '600'` from styles.title (now token-based)
  - Preserved SVG iconSize logic (40/48px) as component detail sizing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing token exports in core/index.ts**
- **Found during:** Task 1 execution
- **Issue:** TypeScript compilation failed with "Module '@metacells/mcellui-core' has no exported member 'stateBlockTokens'"
- **Fix:** Added `stateBlockTokens` and `profileBlockTokens` to core/index.ts exports (line 96-97)
- **Files modified:** packages/core/src/index.ts
- **Commit:** e44b084 (bundled with Task 1)
- **Rationale:** Cannot import tokens without export - blocking issue for Task 1 completion

## Verification Results

All verification criteria passed:

1. **TypeScript compilation:** No errors for empty-state-block.tsx or error-state-block.tsx
2. **No hardcoded fontSize:** `grep "fontSize: [0-9]+"` returns zero matches in both files
3. **No hardcoded icon sizes:** All width/height values use token conditional expressions
4. **Token imports present:** Both files import stateBlockTokens from core
5. **Visual appearance:** Token values match previous hardcoded values exactly:
   - Default: title 20px, description 15px, icon container 80×80 (EmptyState), 88×88 (ErrorState)
   - Compact: title 18px, description 14px, icon container 64×64 (EmptyState), 72×72 (ErrorState)

## Technical Details

**Before (EmptyStateBlock):**
```typescript
fontSize: compact ? 18 : 20,      // Title - hardcoded
fontSize: compact ? 14 : 15,      // Description - hardcoded
width: compact ? 64 : 80,         // Icon container - hardcoded
height: compact ? 64 : 80,
borderRadius: compact ? 32 : 40,
fontWeight: '600',                // Static StyleSheet
```

**After (EmptyStateBlock):**
```typescript
fontSize: compact ? stateBlockTokens.compact.titleFontSize : stateBlockTokens.default.titleFontSize,
fontSize: compact ? stateBlockTokens.compact.descriptionFontSize : stateBlockTokens.default.descriptionFontSize,
width: compact ? stateBlockTokens.compact.iconContainerSize : stateBlockTokens.default.iconContainerSize,
height: compact ? stateBlockTokens.compact.iconContainerSize : stateBlockTokens.default.iconContainerSize,
borderRadius: compact ? stateBlockTokens.compact.iconContainerRadius : stateBlockTokens.default.iconContainerRadius,
fontWeight: stateBlockTokens.typography.titleFontWeight,
```

**Before (ErrorStateBlock):**
```typescript
fontSize: compact ? 18 : 20,      // Title - hardcoded
fontSize: compact ? 14 : 15,      // Description - hardcoded
fontSize: 12,                     // Error code - hardcoded
width: compact ? 72 : 88,         // Icon container - hardcoded
height: compact ? 72 : 88,
borderRadius: compact ? 36 : 44,
fontWeight: '600',                // Static StyleSheet
```

**After (ErrorStateBlock):**
```typescript
fontSize: compact ? stateBlockTokens.compact.titleFontSize : stateBlockTokens.default.titleFontSize,
fontSize: compact ? stateBlockTokens.compact.descriptionFontSize : stateBlockTokens.default.descriptionFontSize,
fontSize: errorTokens.codeFontSize,
width: compact ? errorTokens.iconContainerSizeCompact : errorTokens.iconContainerSize,
height: compact ? errorTokens.iconContainerSizeCompact : errorTokens.iconContainerSize,
borderRadius: compact ? errorTokens.iconContainerRadiusCompact : errorTokens.iconContainerRadius,
fontWeight: stateBlockTokens.typography.titleFontWeight,
```

**SVG Icon Sizing:**
ErrorStateBlock's `iconSize = compact ? 40 : 48` intentionally preserved as component logic. This controls the SVG path rendering detail, not the visual container - appropriate for component-level sizing decision rather than theme token.

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Export stateBlockTokens and profileBlockTokens from core | Blocks need access to centralized tokens | Enables token consumption across all state/profile blocks |
| Preserve SVG iconSize as component logic | SVG detail sizing is component concern, not theme token | Keeps theme tokens focused on visual container sizing |
| Use inline fontWeight instead of StyleSheet | Typography weight now comes from tokens | Enables theme-based weight customization |

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Ready for:**
- Migration of remaining blocks to their respective tokens (ProfileBlock → profileBlockTokens, SettingsListBlock → settingsBlockTokens)
- Theme customization of state block typography via stateBlockTokens

## Metrics

- **Tasks completed:** 2/2
- **Commits:** 2 (e44b084, 0597b5d)
- **Files modified:** 3
- **Duration:** 2.3 minutes
- **Auto-fixes applied:** 1 (missing token exports)
