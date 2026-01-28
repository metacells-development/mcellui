---
phase: 20-spacing-typography-naming
verified: 2026-01-28T14:30:00Z
status: gaps_found
score: 3/5 must-haves verified
re_verification: false
gaps:
  - truth: "All padding/margin values use spacing[n] tokens — no raw number values in styles"
    status: failed
    reason: "4 components still have hardcoded marginLeft/marginTop values in StyleSheet"
    artifacts:
      - path: "packages/mcp-server/registry/ui/textarea.tsx"
        issue: "Line 270: marginLeft: 8 (should be spacing[2])"
      - path: "packages/mcp-server/registry/ui/select.tsx"
        issue: "Lines 303, 308: marginLeft: 8, marginTop: 8 (should be spacing[2])"
      - path: "packages/mcp-server/registry/ui/fab.tsx"
        issue: "Line 179: marginLeft: 8 (should be spacing[2])"
      - path: "packages/mcp-server/registry/ui/datetime-picker.tsx"
        issue: "Line 581: marginBottom: 1 (should be spacing[0.25] or 0)"
    missing:
      - "Replace marginLeft: 8 with spacing[2] in textarea.tsx count style"
      - "Replace marginLeft: 8 with spacing[2] in select.tsx chevron style"
      - "Replace marginTop: 8 with spacing[2] in select.tsx optionsList style"
      - "Replace marginLeft: 8 with spacing[2] in fab.tsx label inline style"
      - "Replace marginBottom: 1 with spacing[0.25] or 0 in datetime-picker.tsx calendarTop"
  - truth: "All borderRadius values use radius.* tokens — user-configurable radius presets work"
    status: failed
    reason: "datetime-picker.tsx has hardcoded borderRadius values in calendar icon styles"
    artifacts:
      - path: "packages/mcp-server/registry/ui/datetime-picker.tsx"
        issue: "Lines 580, 593: borderRadius: 1, borderRadius: 1.5 (tiny values for icon decoration)"
    missing:
      - "Evaluate if borderRadius 1px and 1.5px in calendar icon are intentional micro-decorations or should use tokens"
---

# Phase 20: Spacing, Typography & Naming Verification Report

**Phase Goal:** All styling uses theme tokens and naming patterns are consistent — visual hierarchy and developer experience are unified

**Verified:** 2026-01-28T14:30:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All padding/margin values use `spacing[n]` tokens — no raw number values in styles | ✗ FAILED | 4 components have hardcoded values: textarea (1), select (2), fab (1), datetime-picker (1) |
| 2 | All borderRadius values use `radius.*` tokens — user-configurable radius presets work | ✗ FAILED | datetime-picker has borderRadius: 1 and 1.5 for calendar icon micro-decorations |
| 3 | All fontSize/fontWeight values use typography tokens — consistent text hierarchy | ✓ VERIFIED | Grep for hardcoded fontSize/fontWeight returned 0 results in registry/ui |
| 4 | All 9 demo app block files use `-block` suffix in file names — naming pattern matches registry | ✓ VERIFIED | All 16 demo block files have -block suffix (9 renamed + 7 already correct) |
| 5 | All demo app block component names include `Block` suffix — export names are consistent | ✓ VERIFIED | All 16 demo blocks export components with Block suffix |

**Score:** 3/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/mcp-server/registry/ui/textarea.tsx` | Token-based spacing | ⚠️ PARTIAL | Most spacing uses tokens, but count style has `marginLeft: 8` |
| `packages/mcp-server/registry/ui/select.tsx` | Token-based spacing | ⚠️ PARTIAL | Most spacing uses tokens, but chevron and optionsList have hardcoded values |
| `packages/mcp-server/registry/ui/fab.tsx` | Token-based spacing | ⚠️ PARTIAL | Most spacing uses tokens, but label inline style has `marginLeft: 8` |
| `packages/mcp-server/registry/ui/datetime-picker.tsx` | Token-based spacing and radius | ⚠️ PARTIAL | Has `marginBottom: 1`, `borderRadius: 1`, `borderRadius: 1.5` in calendar icon |
| `packages/mcp-server/registry/ui/input.tsx` | Token-based spacing | ✓ VERIFIED | Uses spacing[1], spacing[2] via tokens object |
| `packages/mcp-server/registry/ui/alert.tsx` | Token-based spacing | ✓ VERIFIED | Uses spacing[0.5], spacing[1] tokens correctly |
| `packages/mcp-server/registry/ui/chip.tsx` | Token-based spacing | ✓ VERIFIED | Uses spacing[0.5], spacing[1], spacing[1.5] tokens |
| `apps/demo/components/blocks/*-block.tsx` | All 16 files | ✓ VERIFIED | All files have -block suffix, all exports have Block suffix |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| Migrated components | @metacells/mcellui-core | spacing import from useTheme | ✓ WIRED | Successfully migrated components destructure `spacing` from useTheme() |
| Demo blocks | Block-suffixed exports | File renames + import updates | ✓ WIRED | blocks-demo.tsx imports all Block-suffixed components correctly |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| TOK-06: All components use `spacing[n]` tokens for padding/margin | ✗ BLOCKED | 4 components have hardcoded marginLeft/marginTop/marginBottom |
| TOK-07: All components use `radius.*` tokens for borderRadius | ✗ BLOCKED | datetime-picker has hardcoded borderRadius 1 and 1.5 |
| TOK-08: All components use typography tokens for fontSize/fontWeight | ✓ SATISFIED | No hardcoded fontSize/fontWeight found |
| NAME-01: All demo app block files use `-block` suffix | ✓ SATISFIED | All 16 files have -block suffix |
| NAME-02: All demo app block component names include `Block` suffix | ✓ SATISFIED | All 16 exports have Block suffix |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| textarea.tsx | 270 | `marginLeft: 8` | ⚠️ Warning | Prevents spacing token consistency |
| select.tsx | 303 | `marginLeft: 8` | ⚠️ Warning | Prevents spacing token consistency |
| select.tsx | 308 | `marginTop: 8` | ⚠️ Warning | Prevents spacing token consistency |
| fab.tsx | 179 | `marginLeft: 8` inline | ⚠️ Warning | Prevents spacing token consistency |
| datetime-picker.tsx | 581 | `marginBottom: 1` | ℹ️ Info | Micro-spacing, unclear if intentional |
| datetime-picker.tsx | 580 | `borderRadius: 1` | ℹ️ Info | Micro-decoration, may be intentional for icon |
| datetime-picker.tsx | 593 | `borderRadius: 1.5` | ℹ️ Info | Micro-decoration, may be intentional for icon |

**Notes:**
- Documentation examples in separator.tsx (line 12) and image.tsx (line 26) contain hardcoded values but are JSDoc comments showing usage examples, not actual implementation — these are acceptable
- Explicit `0` values for padding/margin are acceptable (intentional resets)

### Human Verification Required

None - all gaps can be verified programmatically by searching for hardcoded values.

### Gaps Summary

**5 hardcoded spacing values remain across 4 components:**
- textarea.tsx: 1 hardcoded marginLeft
- select.tsx: 2 hardcoded values (marginLeft, marginTop)
- fab.tsx: 1 hardcoded marginLeft
- datetime-picker.tsx: 1 hardcoded marginBottom

**3 hardcoded radius values in 1 component:**
- datetime-picker.tsx: 2 borderRadius values (1px, 1.5px) for calendar icon micro-decorations

These are likely cases where the component wasn't included in the original plan scope (textarea, select, and fab weren't listed in 20-01-PLAN.md Task 1 files). The datetime-picker micro-values (1px, 1.5px) may be intentional for icon decoration and might not have corresponding tokens.

**Typography migration (truths 3) is COMPLETE** - all fontSize and fontWeight values now use tokens.

**Naming consistency (truths 4-5) is COMPLETE** - all demo blocks have correct file and export naming.

---

_Verified: 2026-01-28T14:30:00Z_
_Verifier: Claude (gsd-verifier)_
