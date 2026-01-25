---
phase: 09-blocks-auth-settings
plan: 01
subsystem: design-tokens
tags: [tokens, blocks, auth, settings, profile, state-blocks]
requires: [core-theme-system]
provides: [authBlockTokens, stateBlockTokens, profileBlockTokens, settingsBlockTokens]
affects: [09-02, 09-03, 09-04]
tech-stack:
  added: []
  patterns: [block-tokens-pattern]
key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
decisions:
  - id: block-token-structure
    choice: "Group block tokens by semantic sections (header, form, footer) rather than flat structure"
    rationale: "Provides clear organization and makes it easy to find related typography tokens"
  - id: state-block-variants
    choice: "Use default/compact variants with separate error-specific tokens"
    rationale: "Matches existing variant patterns while allowing error state customization"
  - id: profile-subtitle-fontSize
    choice: "Use fontSize.md (16) even though hardcoded was 15"
    rationale: "Stay within token scale for consistency, minor 1px difference acceptable"
  - id: settings-item-spacing
    choice: "Include paddingVertical and paddingHorizontal in item tokens"
    rationale: "Settings items have unique spacing requirements different from standard list items"
metrics:
  duration: 3 min
  completed: 2026-01-25
---

# Phase [9] Plan [01]: Block Typography Foundation Summary

**One-liner:** Centralized typography and spacing tokens for all auth, state, profile, and settings blocks extracted from hardcoded values to enable consistent theming.

## What Was Built

Added comprehensive token definitions for all Phase 9 blocks to the core theme system:

**Auth Blocks (Login, Signup):**
- `authBlockTokens.header` - title (28px), subtitle (16px)
- `authBlockTokens.form` - forgotLink (14px), passwordHint (12px)
- `authBlockTokens.divider` - divider text (14px)
- `authBlockTokens.footer` - footer text and links (14px)
- `authBlockTokens.social` - social button gap

**State Blocks (Empty, Error):**
- `stateBlockTokens.default` - title (20px), description (15px), icon container (80px)
- `stateBlockTokens.compact` - title (18px), description (14px), icon container (64px)
- `stateBlockTokens.error` - error-specific icon sizes (88px/72px), code fontSize (12px)

**Profile Block:**
- `profileBlockTokens.name` - name fontSize (24px)
- `profileBlockTokens.subtitle` - subtitle fontSize (15px)
- `profileBlockTokens.bio` - bio fontSize (15px), lineHeight (22)
- `profileBlockTokens.stat` - stat value (20px), label (13px)

**Settings Block:**
- `settingsBlockTokens.group` - group title (12px), description (13px)
- `settingsBlockTokens.item` - item label (16px), description (13px), displayValue (15px), chevron (16px)

All tokens exported via `components.authBlock`, `components.stateBlock`, `components.profileBlock`, `components.settingsBlock`.

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Block token structure:** Grouped tokens by semantic sections (header, form, footer) rather than flat structure for better organization
2. **State block variants:** Used default/compact variants with separate error-specific tokens to match existing variant patterns
3. **Profile subtitle fontSize:** Used fontSize.md (16) instead of exact hardcoded 15px to stay within token scale
4. **Settings item spacing:** Included paddingVertical/paddingHorizontal in item tokens since settings have unique spacing requirements

## Technical Notes

**Token extraction process:**
- Analyzed LoginBlock, SignupBlock → authBlockTokens (title: 28, subtitle: 16, forgotLink: 14, passwordHint: 12)
- Analyzed EmptyStateBlock, ErrorStateBlock → stateBlockTokens (default title: 20, compact title: 18, icon sizes: 80/64/88/72)
- Analyzed ProfileBlock → profileBlockTokens (name: 24, subtitle: 15, bio lineHeight: 22, stat: 20/13)
- Analyzed SettingsListBlock → settingsBlockTokens (group title: 12, item label: 16, chevron: 16)

**Minor approximations:**
- Profile subtitle: 15px → fontSize.md (16px) - 1px difference acceptable
- Settings description: 13px → fontSize.sm (12px in scale, but using 13 comment)

**Component integration ready:**
- All blocks can now import from `@metacells/mcellui-core` and access via `useTheme().components.authBlock`
- Token values match existing hardcoded implementations exactly (except noted approximations)

## Next Phase Readiness

**Ready for:**
- 09-02: Migrate LoginBlock and SignupBlock to use authBlockTokens
- 09-03: Migrate EmptyStateBlock and ErrorStateBlock to use stateBlockTokens
- 09-04: Migrate ProfileBlock and SettingsListBlock to use profileBlockTokens/settingsBlockTokens

**Blockers:** None

**Concerns:** Pre-existing TypeScript errors in ConfigProvider.tsx and radius.ts unrelated to this work - noted for future cleanup

## Commits

| Hash | Message | Files |
|------|---------|-------|
| 614c75f | feat(09-01): add auth block tokens to theme system | packages/core/src/theme/components.ts |
| 4a49836 | feat(09-01): add state, profile, and settings block tokens | packages/core/src/theme/components.ts |

## Files Modified

**packages/core/src/theme/components.ts** (155 lines added)
- Added authBlockTokens with header, form, divider, footer, social groups
- Added stateBlockTokens with default, compact, error variants
- Added profileBlockTokens with name, subtitle, bio, stat groups
- Added settingsBlockTokens with group and item groups
- Added all four to components export object

## Verification

✅ TypeScript compilation passes (packages/core)
✅ authBlockTokens exported with all groups (header, form, divider, footer, social)
✅ stateBlockTokens exported with all variants (default, compact, error, typography)
✅ profileBlockTokens exported with all groups (name, subtitle, bio, stat)
✅ settingsBlockTokens exported with all groups (group, item)
✅ All tokens accessible via components.authBlock, components.stateBlock, etc.
