---
phase: 20-spacing-typography-naming
verified: 2026-01-28T13:46:55Z
status: gaps_found
score: 4/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 3/5
  gaps_closed:
    - "textarea.tsx marginLeft: 8 fixed (now uses spacing[2])"
    - "select.tsx marginLeft: 8 and marginTop: 8 fixed (now uses spacing[2])"
    - "fab.tsx marginLeft: 8 fixed (now uses spacing[2])"
    - "datetime-picker.tsx marginBottom: 1 fixed (now uses spacing[0.25])"
  gaps_remaining:
    - "segmented-control.tsx paddingHorizontal: 8"
    - "action-sheet.tsx paddingVertical: 12"
    - "toggle.tsx paddingHorizontal: 8, 12, 16 in SIZE_CONFIG"
  regressions: []
gaps:
  - truth: "All padding/margin values use spacing[n] tokens — no raw number values in styles"
    status: failed
    reason: "3 components outside original Phase 20 scope still have hardcoded spacing values in StyleSheets"
    artifacts:
      - path: "packages/mcp-server/registry/ui/segmented-control.tsx"
        issue: "Line 220: paddingHorizontal: 8 in StyleSheet segment style (should be moved to inline with spacing[2])"
      - path: "packages/mcp-server/registry/ui/action-sheet.tsx"
        issue: "Line 374: paddingVertical: 12 in StyleSheet handleContainer style (should be moved to inline with spacing[3])"
      - path: "packages/mcp-server/registry/ui/toggle.tsx"
        issue: "Lines 110, 117, 124: paddingHorizontal: 8, 12, 16 in SIZE_CONFIG object (should use spacing[2], spacing[3], spacing[4])"
    missing:
      - "Move paddingHorizontal from StyleSheet to inline in segmented-control.tsx segment style"
      - "Move paddingVertical from StyleSheet to inline in action-sheet.tsx handleContainer style"
      - "Replace hardcoded SIZE_CONFIG padding values with spacing tokens in toggle.tsx"
---

# Phase 20: Spacing, Typography & Naming Verification Report

**Phase Goal:** All styling uses theme tokens and naming patterns are consistent — visual hierarchy and developer experience are unified

**Verified:** 2026-01-28T13:46:55Z
**Status:** gaps_found
**Re-verification:** Yes — after gap closure plan 20-06

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All padding/margin values use `spacing[n]` tokens — no raw number values in styles | ✗ FAILED | 3 components missed in original scope: segmented-control (1), action-sheet (1), toggle (3) = 5 hardcoded values |
| 2 | All borderRadius values use `radius.*` tokens — user-configurable radius presets work | ✓ VERIFIED | All borderRadius >= 2 use tokens. Values 1 and 1.5 preserved as intentional per 20-02 decision |
| 3 | All fontSize/fontWeight values use typography tokens — consistent text hierarchy | ✓ VERIFIED | No hardcoded fontSize/fontWeight found in registry/ui |
| 4 | All 9 demo app block files use `-block` suffix in file names — naming pattern matches registry | ✓ VERIFIED | All 16 demo block files have -block suffix |
| 5 | All demo app block component names include `Block` suffix — export names are consistent | ✓ VERIFIED | All 16 demo blocks export components with Block suffix |

**Score:** 4/5 truths verified (improved from 3/5 in previous verification)

### Re-Verification Summary

**Previous gaps (from plan 20-06):** 5 hardcoded spacing values
- ✅ textarea.tsx marginLeft: 8 → Fixed (now spacing[2])
- ✅ select.tsx marginLeft: 8 → Fixed (now spacing[2])
- ✅ select.tsx marginTop: 8 → Fixed (now spacing[2])
- ✅ fab.tsx marginLeft: 8 → Fixed (now spacing[2])
- ✅ datetime-picker.tsx marginBottom: 1 → Fixed (now spacing[0.25])

**New gaps found:** 5 hardcoded spacing values in 3 components NOT in original Phase 20 scope
- ❌ segmented-control.tsx paddingHorizontal: 8
- ❌ action-sheet.tsx paddingVertical: 12
- ❌ toggle.tsx paddingHorizontal: 8, 12, 16 (×3 in SIZE_CONFIG)

**Regressions:** None — all previously fixed components still use tokens

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/mcp-server/registry/ui/textarea.tsx` | Token-based spacing | ✅ FIXED | Now uses spacing[2] for marginLeft (fixed in 20-06) |
| `packages/mcp-server/registry/ui/select.tsx` | Token-based spacing | ✅ FIXED | Now uses spacing[2] for marginLeft and marginTop (fixed in 20-06) |
| `packages/mcp-server/registry/ui/fab.tsx` | Token-based spacing | ✅ FIXED | Now uses spacing[2] for marginLeft (fixed in 20-06) |
| `packages/mcp-server/registry/ui/datetime-picker.tsx` | Token-based spacing/radius | ✅ FIXED | Now uses spacing[0.25] for marginBottom, borderRadius 1/1.5 intentionally preserved |
| `packages/mcp-server/registry/ui/segmented-control.tsx` | Token-based spacing | ❌ GAP | Line 220: paddingHorizontal: 8 in StyleSheet |
| `packages/mcp-server/registry/ui/action-sheet.tsx` | Token-based spacing | ❌ GAP | Line 374: paddingVertical: 12 in StyleSheet |
| `packages/mcp-server/registry/ui/toggle.tsx` | Token-based spacing | ❌ GAP | Lines 110, 117, 124: hardcoded paddingHorizontal in SIZE_CONFIG |
| `apps/demo/components/blocks/*-block.tsx` | All 16 files | ✓ VERIFIED | All files have -block suffix, all exports have Block suffix |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| Migrated components (20-06) | @metacells/mcellui-core | spacing import from useTheme | ✅ WIRED | textarea, select, fab, datetime-picker successfully use spacing[n] tokens |
| Demo blocks | Block-suffixed exports | File renames + import updates | ✓ WIRED | blocks-demo.tsx imports all Block-suffixed components correctly |
| segmented-control, action-sheet, toggle | spacing tokens | NOT YET MIGRATED | ❌ NOT_WIRED | These components don't access spacing from useTheme |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| TOK-06: All components use `spacing[n]` tokens for padding/margin | ✗ BLOCKED | 3 components (segmented-control, action-sheet, toggle) have 5 hardcoded spacing values |
| TOK-07: All components use `radius.*` tokens for borderRadius | ✓ SATISFIED | All borderRadius >= 2 use tokens. Sub-token values (1, 1.5) intentionally preserved per 20-02 |
| TOK-08: All components use typography tokens for fontSize/fontWeight | ✓ SATISFIED | No hardcoded fontSize/fontWeight found |
| NAME-01: All demo app block files use `-block` suffix | ✓ SATISFIED | All 16 files have -block suffix |
| NAME-02: All demo app block component names include `Block` suffix | ✓ SATISFIED | All 16 exports have Block suffix |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| segmented-control.tsx | 220 | `paddingHorizontal: 8` in StyleSheet | ⚠️ Warning | Prevents spacing token consistency, bypasses theme system |
| action-sheet.tsx | 374 | `paddingVertical: 12` in StyleSheet | ⚠️ Warning | Prevents spacing token consistency, bypasses theme system |
| toggle.tsx | 110, 117, 124 | Hardcoded padding in SIZE_CONFIG | ⚠️ Warning | Prevents spacing token consistency across 3 size variants |

**Notes:**
- Documentation examples in separator.tsx (line 12), section-header.tsx (line 26), and image.tsx (line 26) contain hardcoded values in JSDoc comments showing usage examples, not actual implementation — these are acceptable
- Explicit `0` values for padding/margin are acceptable (intentional resets)
- BorderRadius values of 1 and 1.5 in datetime-picker.tsx are intentional sub-token micro-decorations per plan 20-02 decision — NOT gaps

### Human Verification Required

None - all gaps can be verified programmatically by searching for hardcoded values.

### Gaps Summary

**Plan 20-06 successfully closed all 5 original gaps:**
- ✅ textarea, select, fab, datetime-picker now use spacing tokens

**3 NEW components discovered with hardcoded spacing values:**

These components were NOT in the original Phase 20 scope (plans 20-01, 20-02, 20-06) but violate the TOK-06 requirement "All components use spacing[n] tokens":

1. **segmented-control.tsx** - 1 hardcoded value
   - Line 220: `paddingHorizontal: 8` in StyleSheet segment style
   - Should be moved to inline style with `spacing[2]`

2. **action-sheet.tsx** - 1 hardcoded value
   - Line 374: `paddingVertical: 12` in StyleSheet handleContainer style
   - Should be moved to inline style with `spacing[3]`

3. **toggle.tsx** - 3 hardcoded values
   - Lines 110, 117, 124: `paddingHorizontal: 8, 12, 16` in SIZE_CONFIG object
   - Should use `spacing[2]`, `spacing[3]`, `spacing[4]` respectively
   - SIZE_CONFIG needs to access spacing tokens at runtime

**Root cause:** These components were last modified before Phase 20 and were not caught in the original research scan. They represent pre-Phase 20 code that hasn't been migrated yet.

**Impact:** TOK-06 requirement remains incomplete. Phase 20 goal "All styling uses theme tokens" is not achieved because 3 components still bypass the spacing token system.

**Typography migration (truth 3) is COMPLETE** - all fontSize and fontWeight values now use tokens.

**Radius migration (truth 2) is COMPLETE** - all borderRadius >= 2 use tokens, micro-values intentionally preserved.

**Naming consistency (truths 4-5) is COMPLETE** - all demo blocks have correct file and export naming.

---

_Verified: 2026-01-28T13:46:55Z_
_Verifier: Claude (gsd-verifier)_
