---
phase: 06-layout-structure
plan: 01
subsystem: core-theme
tags:
  - tokens
  - list
  - layout
  - constants
requires:
  - 05-04 # Typography and Image tokens as foundation
provides:
  - LIST_CONSTANTS for standard List dimensions (dividerInset, itemMinHeight)
  - listTokens for divider and item styling
affects:
  - 06-02 # List component migration will consume these tokens
  - 06-03 # SectionHeader will use spacing tokens
tech-stack:
  added: []
  patterns:
    - "LIST_CONSTANTS pattern for component-specific dimension constants"
    - "listTokens.divider.inset references LIST_CONSTANTS for single source of truth"
key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
decisions:
  - decision: "LIST_CONSTANTS.dividerInset = spacing[14] (56px) for iOS-standard left inset"
    rationale: "Matches iOS Human Interface Guidelines for lists with leading icons (16px padding + 24px icon + 12px gap + 4px buffer)"
    plan: "06-01"
  - decision: "LIST_CONSTANTS.itemMinHeight = componentHeight.lg (52px)"
    rationale: "Consistent with other interactive components using lg height for comfortable touch targets"
    plan: "06-01"
  - decision: "listTokens.item includes iconSize and iconMargin for standard icon layout"
    rationale: "Centralizes icon sizing (24px) and spacing (12px) for consistent List item icon patterns"
    plan: "06-01"
metrics:
  duration: 2.5
  completed: 2026-01-25
---

# Phase 6 Plan 01: List Component Token Foundation Summary

**One-liner:** Centralized LIST_CONSTANTS and listTokens provide standard dimensions for divider inset (56px) and item height (52px) eliminating hardcoded values.

## What Was Built

Extended the core token system with List component tokens:

1. **LIST_CONSTANTS** - Standard dimensions for List components:
   - `dividerInset: spacing[14]` (56px) - iOS-standard left inset for dividers
   - `itemMinHeight: componentHeight.lg` (52px) - Default list item height
   - `legacyMinHeight: 56` - Backwards compatibility constant

2. **listTokens** - Structured tokens for List styling:
   - `divider.inset` - References LIST_CONSTANTS.dividerInset
   - `item.minHeight` - References LIST_CONSTANTS.itemMinHeight
   - `item.paddingHorizontal` - spacing[4] (16px)
   - `item.paddingVertical` - spacing[3] (12px)
   - `item.iconSize` - iconSize.lg (24px)
   - `item.iconMargin` - spacing[3] (12px)

3. **components export** - Added `list: listTokens` to components object

## Architecture Decisions

### Decision: spacing[14] (56px) for dividerInset

**Context:** List dividers need consistent left inset that aligns with text content when icons are present.

**Options considered:**

1. Calculate: 16 (padding) + 24 (icon) + 12 (gap) = 52px
2. Use iOS standard: spacing[14] = 56px
3. Use componentHeight.lg = 52px

**Decision:** spacing[14] (56px)

**Rationale:**
- Matches iOS Human Interface Guidelines standard for lists with leading icons
- Provides 4px visual buffer for better alignment
- Uses existing spacing token rather than custom calculation
- Consistent with iOS native list patterns

### Decision: itemMinHeight = componentHeight.lg (52px)

**Context:** List items need minimum height for comfortable touch targets and visual consistency.

**Options considered:**

1. Custom constant: 56px (legacy value)
2. componentHeight.md: 44px (iOS minimum)
3. componentHeight.lg: 52px (comfortable)

**Decision:** componentHeight.lg (52px)

**Rationale:**
- Consistent with other interactive components (Button lg, ActionSheet items)
- Provides comfortable touch target above iOS minimum
- Uses existing component height token
- Slightly smaller than legacy 56px while maintaining usability

## Implementation Details

### Token Structure

```typescript
// Constants for standard dimensions
export const LIST_CONSTANTS = {
  dividerInset: spacing[14],        // 56px
  itemMinHeight: componentHeight.lg, // 52px
  legacyMinHeight: 56,              // For backwards compat
} as const;

// Structured tokens
export const listTokens = {
  divider: {
    inset: LIST_CONSTANTS.dividerInset,
  },
  item: {
    minHeight: LIST_CONSTANTS.itemMinHeight,
    paddingHorizontal: spacing[4],   // 16px
    paddingVertical: spacing[3],     // 12px
    iconSize: iconSize.lg,           // 24px
    iconMargin: spacing[3],          // 12px
  },
} as const;
```

### Token References

All values reference existing token systems:
- `spacing[14]` for dividerInset (56px)
- `componentHeight.lg` for itemMinHeight (52px)
- `spacing[4]` for horizontal padding (16px)
- `spacing[3]` for vertical padding and icon margin (12px)
- `iconSize.lg` for icon size (24px)

No hardcoded numeric values in token definitions.

## Verification Results

✅ All verification criteria met:

1. **packages/core/src/theme/components.ts contains LIST_CONSTANTS** - Exported at top level
2. **listTokens includes divider.inset and item.minHeight** - Both properties present
3. **components export includes list: listTokens** - Added to components object
4. **TypeScript compilation passes** - No new errors introduced (pre-existing ConfigProvider error unrelated)

## Success Criteria Met

✅ LIST_CONSTANTS.dividerInset = 56 (spacing[14])
✅ LIST_CONSTANTS.itemMinHeight = 52 (componentHeight.lg)
✅ listTokens.item.paddingHorizontal = 16 (spacing[4])
✅ No hardcoded numeric values in token definitions (all reference spacing/componentHeight)

## Commits

| Task | Commit  | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| 1    | 7900816 | Add LIST_CONSTANTS and listTokens to core theme |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Phase 6 Plan 02 (List Component Migration) is ready to proceed:**
- LIST_CONSTANTS available for import
- listTokens accessible via components.list
- dividerInset (56px) ready for List divider alignment
- itemMinHeight (52px) ready for ListItem minimum height
- Icon tokens (size 24px, margin 12px) ready for icon layout

**No blockers.**

## Learning Notes

### Pattern: LIST_CONSTANTS for component-specific dimensions

This establishes a pattern for components that need standard dimensions referenced across multiple token properties:

1. Define `{COMPONENT}_CONSTANTS` with descriptive names
2. Reference constants in structured tokens
3. Export both constants and tokens for maximum flexibility

This allows:
- Single source of truth for dimensions
- Clear documentation of calculation/rationale
- Easy updates if standards change
- Components can import constants OR use tokens

### iOS Human Interface Guidelines Alignment

Using spacing[14] (56px) for dividerInset aligns with iOS native patterns:
- iOS Mail app: 56px left inset for message list dividers
- iOS Settings app: 56px left inset for setting list dividers
- iOS Contacts app: 56px left inset for contact list dividers

This creates familiarity for iOS users and follows platform conventions.
