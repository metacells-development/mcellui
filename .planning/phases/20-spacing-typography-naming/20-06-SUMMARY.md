---
phase: 20
plan: 06
type: gap_closure
subsystem: ui-components
tags: [spacing, tokens, theme, consistency]
requires:
  - 20-01 (established spacing token migration pattern)
  - 20-02 (clarified borderRadius micro-value preservation)
provides:
  - "TOK-06 requirement complete: All padding/margin values use spacing[n] tokens"
  - "User-configurable spacing presets work globally across all registry UI components"
affects:
  - "Phase 21: Remaining v1.2 consistency items"
tech-stack:
  added: []
  patterns:
    - "spacing[0.25] for 1px micro-spacing in icon decorations"
    - "spacing[2] for 8px standard component gaps"
key-files:
  created: []
  modified:
    - packages/mcp-server/registry/ui/textarea.tsx
    - packages/mcp-server/registry/ui/select.tsx
    - packages/mcp-server/registry/ui/fab.tsx
    - packages/mcp-server/registry/ui/datetime-picker.tsx
decisions:
  - id: SPACE-06-01
    decision: "Use spacing[0.25] for 1px marginBottom in datetime-picker calendar icon"
    rationale: "Maintains precision for visual micro-spacing while enabling theme customization"
  - id: SPACE-06-02
    decision: "Move all 5 hardcoded margins from StyleSheets to inline styles"
    rationale: "StyleSheets are static; spacing tokens require runtime theme access"
metrics:
  duration: "1m 42s"
  completed: 2026-01-28
---

# Phase 20 Plan 06: TOK-06 Gap Closure (Spacing) Summary

**One-liner:** Migrated final 5 hardcoded spacing values (8px and 1px) to spacing tokens in 4 UI components

## What Was Done

### Task 1: Migrate hardcoded marginLeft/marginTop in textarea, select, fab
**Status:** ✅ Complete
**Commit:** 24e91aa

Replaced 4 hardcoded `marginLeft: 8` and `marginTop: 8` values with `spacing[2]` tokens:

**textarea.tsx:**
- Moved `marginLeft` from StyleSheet `count` style to inline style with `spacing[2]`

**select.tsx:**
- Moved `marginLeft` from StyleSheet `chevron` style to inline style with `spacing[2]`
- Moved `marginTop` from StyleSheet `optionsList` style to inline style with `spacing[2]`

**fab.tsx:**
- Added `spacing` to `useTheme()` destructure
- Updated inline `marginLeft` from hardcoded `8` to `spacing[2]`

**Files modified:**
- `packages/mcp-server/registry/ui/textarea.tsx`
- `packages/mcp-server/registry/ui/select.tsx`
- `packages/mcp-server/registry/ui/fab.tsx`

### Task 2: Migrate hardcoded marginBottom in datetime-picker
**Status:** ✅ Complete
**Commit:** 3b5cfbd

Replaced 1 hardcoded `marginBottom: 1` value with `spacing[0.25]` token:

**datetime-picker.tsx:**
- Moved `marginBottom` from StyleSheet `calendarTop` style to inline style with `spacing[0.25]`
- Added `spacing` to `CalendarIcon` function's `useTheme()` destructure
- Preserved intentional `borderRadius: 1` and `borderRadius: 1.5` micro-values (per 20-02 decision)

**Files modified:**
- `packages/mcp-server/registry/ui/datetime-picker.tsx`

## Technical Details

### Pattern: StyleSheet to Inline Style Migration

**Problem:** StyleSheets are static and defined at module initialization. Spacing tokens require runtime theme access.

**Solution:** Move dynamic spacing from StyleSheet to inline styles where theme is available:

```tsx
// Before (static StyleSheet)
const styles = StyleSheet.create({
  count: {
    marginLeft: 8,  // ❌ Hardcoded, bypasses theme
  },
});

// After (inline style with theme)
<Text style={[
  styles.count,
  {
    marginLeft: spacing[2],  // ✅ Theme-responsive
  },
]} />
```

### Spacing Token Selection

| Hardcoded Value | Token Used | Rationale |
|-----------------|------------|-----------|
| `8px` (×4 occurrences) | `spacing[2]` | Standard component gap spacing |
| `1px` (×1 occurrence) | `spacing[0.25]` | Micro-spacing for icon decoration |

### BorderRadius Preservation

The datetime-picker contains `borderRadius: 1` and `borderRadius: 1.5` values that were **intentionally preserved** per key decision from plan 20-02:

> "Sub-token borderRadius (1, 1.5) preserved as intentional design details"

These micro-values are decorative details on the calendar icon and do not need token migration.

## Verification

### All Hardcoded Spacing Values Removed
```bash
grep -rn "marginLeft: 8\|marginTop: 8\|marginBottom: 1[^.]" \
  packages/mcp-server/registry/ui/{textarea,select,fab,datetime-picker}.tsx
# Result: 0 matches ✅
```

### Spacing Tokens Applied
```bash
grep -rn "spacing\[" packages/mcp-server/registry/ui/{textarea,select,fab,datetime-picker}.tsx | \
  grep -E "marginLeft|marginTop|marginBottom"
# Result: 12 matches including new spacing[2] and spacing[0.25] usages ✅
```

### BorderRadius Micro-Values Preserved
```bash
grep -n "borderRadius: 1\|borderRadius: 1.5" packages/mcp-server/registry/ui/datetime-picker.tsx
# Result: 2 matches at lines 581 and 593 (preserved as intentional) ✅
```

## Impact

### TOK-06 Requirement: COMPLETE ✅

All padding/margin values in registry UI components now use `spacing[n]` tokens. The user-configurable spacing preset system works globally:

```ts
// User's mcellui.config.ts
export default defineConfig({
  spacing: 'compact',  // Now affects ALL components including these 4
});
```

### Components Affected
- ✅ Textarea: Character count spacing
- ✅ Select: Chevron icon spacing, options list top margin
- ✅ FAB: Extended label spacing
- ✅ DateTimePicker: Calendar icon decoration spacing

## Decisions Made

### SPACE-06-01: Use spacing[0.25] for 1px marginBottom
**Context:** datetime-picker calendar icon has 1px marginBottom for visual balance

**Decision:** Use `spacing[0.25]` (= 1px) instead of hardcoded `1`

**Rationale:**
- Maintains exact 1px spacing while enabling theme customization
- Spacing scale includes `0.25` specifically for micro-spacing needs
- Consistent with token-first approach (no raw numbers)

### SPACE-06-02: Move margins from StyleSheets to inline styles
**Context:** All 5 hardcoded margins were in StyleSheet.create() definitions

**Decision:** Move all to inline styles where theme tokens are accessible

**Rationale:**
- StyleSheets are static (defined at module load time)
- Theme tokens require runtime access via `useTheme()` hook
- Inline styles allow dynamic theme-responsive values
- Pattern established in 20-01 for similar migrations

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

### Dependencies Satisfied
This plan completes TOK-06 (spacing token migration). All Phase 20 spacing consistency work is now complete.

### Blockers
None.

### Recommendations for Phase 21
Continue v1.2 consistency sweep with remaining items from 20-RESEARCH findings.

---

**Duration:** 1m 42s
**Tasks completed:** 2/2
**Commits:** 2
**Files modified:** 4
