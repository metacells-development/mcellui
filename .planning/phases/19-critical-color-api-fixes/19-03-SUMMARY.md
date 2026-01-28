---
phase: 19
plan: 03
subsystem: blocks
tags: [theming, semantic-tokens, dark-mode, blocks]
requires: [core-theme-system]
provides: [themed-block-components]
affects: []
tech-stack:
  added: []
  patterns: [semantic-color-tokens, theme-aware-icons]
key-files:
  created: []
  modified:
    - packages/registry/blocks/hero-block.tsx
    - packages/registry/blocks/banner-block.tsx
    - packages/registry/blocks/product-card-block.tsx
    - packages/registry/blocks/article-card-block.tsx
    - packages/registry/blocks/media-item-block.tsx
    - packages/registry/blocks/review-card-block.tsx
    - packages/registry/blocks/chat-bubble-block.tsx
    - packages/registry/blocks/feed-post-card-block.tsx
    - packages/registry/blocks/pricing-card-block.tsx
    - packages/registry/blocks/task-item-block.tsx
    - packages/registry/blocks/event-card-block.tsx
    - packages/registry/blocks/cart-item-block.tsx
    - packages/registry/blocks/comment-item-block.tsx
    - packages/registry/blocks/search-header-block.tsx
    - packages/registry/blocks/order-item-block.tsx
decisions:
  - Replace all icon defaults from hardcoded #000 to colors.foreground
  - Use colors.overlay for full backdrop overlays (0.5 opacity)
  - Use colors.scrim for subtle/medium overlays (0.3-0.4 opacity)
  - Replace white text on colored backgrounds with colors.primaryForeground
  - Use semantic tokens for task priorities (success/warning/destructive)
  - Preserve hero-block gradient presets as intentional artistic choices
metrics:
  duration: 11min
  completed: 2026-01-28
---

# Phase 19 Plan 03: Fix Hardcoded Colors in Block Components Summary

**One-liner:** Replaced 50+ hardcoded colors in 15 block components with semantic tokens for automatic theme support

## What Was Built

Fixed all hardcoded colors (icon defaults, RGBA overlays, hex values) in 15 block components to use semantic tokens from the theme system.

## Tasks Completed

| Task | Description | Commit | Files Modified |
|------|-------------|--------|----------------|
| 1 | Fix overlay-heavy blocks | 148db61 | hero, banner, product-card, article-card, media-item, review-card, chat-bubble |
| 2 | Fix remaining blocks | 27f7020 | feed-post, pricing, task-item, event, cart-item, comment-item, search-header, order-item |

## Decisions Made

**Icon color defaults pattern:**
- Before: `color = '#000'` hardcoded default
- After: `color ?? colors.foreground` using theme token
- Every icon function now calls `useTheme()` to access semantic colors
- Ensures icons adapt to light/dark mode automatically

**Overlay color mapping:**
- `rgba(0,0,0,0.5)` → `colors.overlay` (full backdrop)
- `rgba(0,0,0,0.3)` or `0.4` → `colors.scrim` (subtle overlay)
- `rgba(255,255,255,0.8)` → `colors.background` (light surface)
- Overlays now respect theme-defined opacity values

**Text color replacements:**
- `#fff` / `#ffffff` on colored backgrounds → `colors.primaryForeground`
- `#000` for regular text → `colors.foreground`
- `rgba(255,255,255,0.7)` for muted text → `colors.primaryForeground` (opacity handled by theme)

**Priority indicator colors (task-item-block):**
- Low priority: `#10b981` → `colors.success`
- Medium priority: `#f59e0b` → `colors.warning`
- High priority: `#f97316` → `colors.warning`
- Urgent priority: `#ef4444` → `colors.destructive`
- Changed from constant object to function that receives theme colors

**Hero block exception:**
- Gradient presets (ocean, sunset, forest, purple, candy) remain unchanged
- These are intentional artistic color schemes, not theme-dependent
- Only overlay rgba values in hero were converted to semantic tokens

## Deviations from Plan

None - plan executed exactly as written.

## Implementation Details

**Pattern applied to all icons:**
```tsx
// Before
function IconName({ size = 24, color = '#000' }: Props) {
  return <Svg stroke={color}>...</Svg>
}

// After
function IconName({ size = 24, color }: Props) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return <Svg stroke={finalColor}>...</Svg>
}
```

**Special case - HeartIcon in feed-post-card:**
- Has additional `activeColor` prop for filled state
- Logic: `filled && activeColor ? activeColor : (color ?? colors.foreground)`
- Preserves special highlighting while using semantic default

**Task priority colors migration:**
```tsx
// Before - constant object
const PRIORITY_CONFIG = {
  low: { color: '#10b981', label: 'Low' }
}

// After - function receiving theme
const getPriorityConfig = (colors) => ({
  low: { color: colors.success, label: 'Low' }
})
```

## Files Modified

**15 block components updated:**
- hero-block.tsx - Overlay tokens, text colors (gradients preserved)
- banner-block.tsx - Icon defaults, overlay, text colors
- product-card-block.tsx - Icon defaults, out-of-stock overlay
- article-card-block.tsx - Icon defaults, featured variant overlay
- media-item-block.tsx - Icon defaults, play button overlay, selection overlay
- review-card-block.tsx - Icon defaults, image overlay
- chat-bubble-block.tsx - Icon defaults, status indicator colors
- feed-post-card-block.tsx - Icon defaults (special HeartIcon handling)
- pricing-card-block.tsx - Icon defaults
- task-item-block.tsx - Icon defaults, priority semantic tokens
- event-card-block.tsx - Icon defaults
- cart-item-block.tsx - Icon defaults
- comment-item-block.tsx - Icon defaults
- search-header-block.tsx - Icon defaults
- order-item-block.tsx - Icon defaults

## Testing / Verification

```bash
# Verified zero hardcoded icon defaults
grep -rn "color = '#000'" packages/registry/blocks/
# Result: 0 matches

# Verified priority colors removed
grep -n "'#10b981'\|'#f59e0b'\|'#ef4444'" packages/registry/blocks/task-item-block.tsx
# Result: 0 matches

# Verified semantic tokens used
grep -rn "colors.success\|colors.warning\|colors.destructive" packages/registry/blocks/task-item-block.tsx
# Result: 6 matches (priority config + usage)

# Verified only hero gradient presets remain
grep -rn "rgba(" packages/registry/blocks/ | grep -v "gradient"
# Result: Only hero-block mesh gradient presets
```

## Impact

**User benefit:**
- Block components now support automatic dark mode
- Theme changes apply to all blocks instantly
- Users who copy-paste blocks get proper theming by default

**Technical impact:**
- All 15 block files now consistently use theme system
- Icons adapt to theme automatically
- Overlays use semantic opacity values
- Priority indicators use semantic meaning (success/warning/destructive)

**Performance:**
- No performance impact - useTheme hook already called in components
- Icon color resolution happens once per render

## Next Phase Readiness

**Ready for:**
- Phase 19-04: Complex component color fixes (accordions, carousels, etc.)
- Phase 19-05: Utility component color fixes (remaining components)

**No blockers or concerns.**

## Notes

- Hero block gradient presets intentionally preserved as artistic choices
- Pattern established can be applied to remaining UI components
- All blocks now fully theme-aware with zero hardcoded colors (except intentional presets)
