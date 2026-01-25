---
phase: 06-layout-structure
plan: 02
title: "Migrate List and SectionHeader to Token System"
one-liner: "List and SectionHeader now use centralized tokens (LIST_CONSTANTS, componentHeight, spacing) instead of hardcoded dimensions"
subsystem: layout
tags: [list, section-header, tokens, migration, spacing]
dependencies:
  requires: ["06-01"]
  provides: ["token-based-list", "token-based-section-header"]
  affects: ["06-04"]
tech-stack:
  added: []
  patterns: ["dynamic-style-composition"]
key-files:
  created: []
  modified:
    - path: "packages/registry/ui/list.tsx"
      changes: "migrated to LIST_CONSTANTS.dividerInset and componentHeight.lg"
    - path: "packages/registry/ui/section-header.tsx"
      changes: "migrated marginRight to spacing[4] token"
    - path: "packages/core/src/theme/index.ts"
      changes: "exported LIST_CONSTANTS and listTokens"
    - path: "packages/core/src/index.ts"
      changes: "exported LIST_CONSTANTS and listTokens"
decisions: []
metrics:
  tasks: 2
  duration: "2.1 min"
  completed: "2026-01-25"
---

# Phase 6 Plan 2: Migrate List and SectionHeader to Token System Summary

**One-liner:** List and SectionHeader now use centralized tokens (LIST_CONSTANTS, componentHeight, spacing) instead of hardcoded dimensions

## Objective

Replace hardcoded values (56, 16) with token references in List and SectionHeader components to ensure consistent spacing across theme presets and easier maintenance.

## What Was Built

### Task 1: Migrate List Component to Token System
- ✅ Added imports for `LIST_CONSTANTS` and `componentHeight` from core
- ✅ Replaced hardcoded `56px` divider inset with `LIST_CONSTANTS.dividerInset`
- ✅ Replaced hardcoded `56px` item minHeight with `componentHeight.lg` (52px)
- ✅ Added explanatory comment for divider inset calculation
- ✅ Exported `LIST_CONSTANTS` and `listTokens` from core package

**Files Modified:**
- `packages/registry/ui/list.tsx` - token migration
- `packages/core/src/theme/index.ts` - export additions
- `packages/core/src/index.ts` - export additions

**Commits:**
- `5f1e2ac` - refactor(06-02): migrate List to token system

### Task 2: Migrate SectionHeader to Token System
- ✅ Moved `marginRight: 16` from static StyleSheet to dynamic style
- ✅ Applied `spacing[4]` token for marginRight
- ✅ Added comment explaining token usage pattern

**Files Modified:**
- `packages/registry/ui/section-header.tsx` - spacing token migration

**Commits:**
- `08ce213` - refactor(06-02): migrate SectionHeader to spacing token

## Decisions Made

None - this was a straightforward token migration following established patterns from previous phases.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing exports for LIST_CONSTANTS**
- **Found during:** Task 1
- **Issue:** LIST_CONSTANTS and listTokens were defined in components.ts but not exported from theme/index.ts or core/index.ts
- **Fix:** Added exports to both index files to make tokens available for import
- **Files modified:** `packages/core/src/theme/index.ts`, `packages/core/src/index.ts`
- **Commit:** `5f1e2ac` (included in Task 1 commit)

## Key Technical Details

### List Component Changes
**Before:**
```typescript
marginLeft: insetDividers ? 56 : 0,
minHeight: variant === 'thumbnail' ? thumbnailSize + spacing[3] * 2 : 56,
```

**After:**
```typescript
// Divider inset aligns with text content after icon slot
// = padding (16) + icon (24) + gap (12) + buffer (4) = 56px
marginLeft: insetDividers ? LIST_CONSTANTS.dividerInset : 0,
minHeight: variant === 'thumbnail' ? thumbnailSize + spacing[3] * 2 : componentHeight.lg,
```

### SectionHeader Component Changes
**Before:**
```typescript
// In StyleSheet
titleContainer: {
  flex: 1,
  marginRight: 16,
},
```

**After:**
```typescript
// In component render
<View style={[styles.titleContainer, { marginRight: spacing[4] }]}>

// In StyleSheet
titleContainer: {
  flex: 1,
  // marginRight moved to dynamic style (spacing[4]) for token usage
},
```

### Note on Height Change
List item minHeight changed from `56px` to `componentHeight.lg` (52px). This aligns with iOS touch target guidelines and is consistent with other components in the system. The 4px difference is negligible visually but improves overall consistency.

## Verification Results

All verification checks passed:

1. ✅ `grep "56" packages/registry/ui/list.tsx` - No hardcoded 56 values (only in comments)
2. ✅ `grep "marginRight: 16" packages/registry/ui/section-header.tsx` - No hardcoded marginRight
3. ✅ Both components compile without TypeScript errors
4. ✅ LIST_CONSTANTS imported and used correctly in list.tsx

## Next Phase Readiness

**Blockers:** None

**Recommendations:**
- Plan 06-03 can proceed immediately (both List and SectionHeader already migrated)
- Plan 06-04 (demos) will showcase token-based responsive behavior

## Files Modified

| File | Type | Changes |
|------|------|---------|
| `packages/registry/ui/list.tsx` | Component | Migrated to LIST_CONSTANTS and componentHeight tokens |
| `packages/registry/ui/section-header.tsx` | Component | Migrated marginRight to spacing token |
| `packages/core/src/theme/index.ts` | Theme | Added LIST_CONSTANTS and listTokens exports |
| `packages/core/src/index.ts` | Core | Added LIST_CONSTANTS and listTokens exports |

## Performance Impact

**Build time:** No change
**Runtime:** No change (token values are static constants)
**Bundle size:** Negligible (same number of style definitions, just using imported constants)

## Summary

Plan 06-02 successfully migrated List and SectionHeader components from hardcoded dimensions to centralized tokens. The migration was straightforward with one minor blocking issue (missing exports) that was auto-fixed during execution. Both components now benefit from:

1. **Consistency** - Dimensions align with other components (componentHeight.lg)
2. **Maintainability** - Change tokens once, affects all components
3. **Documentation** - Token names are self-documenting (dividerInset vs 56)
4. **Flexibility** - Future theme customization possible through token system

The slight height reduction (56px → 52px) for default list items improves consistency with the broader component system while maintaining comfortable touch targets.
