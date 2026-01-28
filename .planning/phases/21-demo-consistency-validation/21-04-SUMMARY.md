---
phase: 21-demo-consistency-validation
plan: 04
subsystem: demo-app
tags: [typography, tokens, theming, consistency]
dependency-graph:
  requires: [20-03]
  provides: [demo-typography-tokens]
  affects: []
tech-stack:
  added: []
  patterns: [typography-token-usage, semantic-color-tokens]
key-files:
  created: []
  modified:
    - apps/demo/components/demos/swipeable-row-demo.tsx
    - apps/demo/components/demos/action-sheet-demo.tsx
    - apps/demo/components/demos/icon-button-demo.tsx
    - apps/demo/components/demos/screens-demo.tsx
    - apps/demo/components/demos/avatar-demo.tsx
    - apps/demo/components/demos/fab-demo.tsx
    - apps/demo/components/demos/popover-demo.tsx
    - apps/demo/components/demos/tooltip-demo.tsx
    - apps/demo/components/demos/badge-demo.tsx
    - apps/demo/components/demos/button-demo.tsx
    - apps/demo/components/demos/blocks-demo.tsx
    - apps/demo/components/demos/alert-demo.tsx
    - apps/demo/components/demos/progress-demo.tsx
    - apps/demo/components/demos/spinner-demo.tsx
    - apps/demo/components/demos/pull-to-refresh-demo.tsx
    - apps/demo/components/demos/tag-input-demo.tsx
    - apps/demo/components/demos/dialog-demo.tsx
decisions:
  - id: showcase-values-preserved
    choice: Keep hardcoded values for showcase elements
    alternatives: [migrate-all, use-showcase-tokens]
    rationale: InfoIcon fontSize:12 and emoji fontSize:48 are design sizes, not UI text
  - id: shared-section-component
    choice: Use shared Section component from ./section
    alternatives: [local-section-with-tokens]
    rationale: Reduces code duplication, ensures consistent section styling
metrics:
  duration: 6m
  completed: 2026-01-28
---

# Phase 21 Plan 04: Remaining Demo File Token Migration Summary

All demo files now use typography tokens for UI chrome text while preserving showcase element sizes.

## What Changed

### Task 1: Swipeable Row and Action Sheet Demos
- **swipeable-row-demo.tsx**: Converted container gap from hardcoded `24` to `spacing[6]` token
- **action-sheet-demo.tsx**: Migrated hint text from `fontSize: 12` to `fontSize.xs` token
- Swipe action colors (red, blue, green, amber) preserved as showcase demonstrating component functionality

### Task 2: Icon Button, Screens, Avatar, FAB Demos
- **icon-button-demo.tsx**: Section subtitles now use `fontSize.xs` token
- **screens-demo.tsx**: All text uses `fontSize.md/sm` and `fontWeight.semibold/medium` tokens
- **avatar-demo.tsx**: Migrated to shared Section component, semantic colors for user card
- **fab-demo.tsx**: Hint and mock screen text use `fontSize.xs/sm` tokens
- Removed invalid `size="xl"` from Avatar demo (standardized 3-size API: sm|md|lg)

### Task 3: Remaining Low-Violation Demos
- **popover-demo.tsx**: All popover text uses typography tokens
- **tooltip-demo.tsx**: Hint text uses `fontSize.xs` token
- **badge-demo.tsx**: Migrated to shared Section component, semantic colors
- **button-demo.tsx**: Migrated to shared Section component
- **blocks-demo.tsx**: Intro text and section titles use typography tokens
- **alert-demo.tsx**: Dimmed text uses semantic colors
- **progress-demo.tsx**: All labels use `fontSize.xs` token
- **spinner-demo.tsx**: Use case labels use `fontSize.xs` token
- **pull-to-refresh-demo.tsx**: Labels use `fontSize.sm/xs` tokens
- **tag-input-demo.tsx**: Size labels use `fontSize.xs` token
- **dialog-demo.tsx**: Content text uses `fontSize.sm` token

## Preserved Showcase Values

Two intentional hardcoded values remain (not UI chrome):
1. **tooltip-demo.tsx line 12**: InfoIcon "i" character at `fontSize: 12` - icon design size
2. **pagination-demo.tsx line 242**: Camera emoji at `fontSize: 48` - decorative element in mockup

## Pattern Applied

Standard migration pattern:
1. Add `fontSize`, `fontWeight` to `useTheme()` destructuring
2. Replace hardcoded `fontSize: N` with `fontSize: fontSize.token` inline styles
3. Replace hardcoded `fontWeight: 'N'` with `fontWeight: fontWeight.token`
4. Migrate local Section components to shared `./section` component
5. Remove unused StyleSheet properties

## Commits

| Hash | Description |
|------|-------------|
| de3cc4c | Migrate swipeable-row-demo and action-sheet-demo |
| 6979513 | Migrate icon-button, screens, avatar, fab demos |
| ee4ac7c | Migrate remaining demo files |

## Verification

```bash
# UI chrome fontSize all use tokens
grep -rE "fontSize:\s*[0-9]+" apps/demo/components/demos/
# Returns only 2 showcase values (InfoIcon:12, emoji:48)
```

## Deviations from Plan

None - plan executed exactly as written.

## Next Steps

Phase 21 demo consistency validation complete. All demo files:
- Use typography tokens for UI chrome text
- Use semantic color tokens for theme-adaptive colors
- Preserve showcase/example colors for component demonstrations
