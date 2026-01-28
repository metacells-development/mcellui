---
phase: 19-critical-color-api-fixes
plan: 02
subsystem: ui-components
tags: [theming, color-tokens, dark-mode, semantic-colors, overlay, rgba]
status: complete
requires:
  - "Design tokens system (colors.overlay, colors.scrim, colors.warning)"
provides:
  - "RGBA overlay values replaced with semantic tokens in 5 UI components"
  - "Hardcoded hex colors replaced with semantic tokens in 4 UI components"
  - "Full dark mode compatibility for overlays and text"
affects:
  - "19-03: Other UI components needing color token migration"
tech-stack:
  added: []
  patterns: ["Semantic color tokens for overlays and text"]
key-files:
  created: []
  modified:
    - packages/mcp-server/registry/ui/toast.tsx
    - packages/mcp-server/registry/ui/action-sheet.tsx
    - packages/mcp-server/registry/ui/datetime-picker.tsx
    - packages/mcp-server/registry/ui/image-gallery.tsx
    - packages/mcp-server/registry/ui/card.tsx
    - packages/mcp-server/registry/ui/swipeable-row.tsx
    - packages/mcp-server/registry/ui/avatar-stack.tsx
    - packages/mcp-server/registry/ui/rating.tsx
decisions:
  - decision: "Remove text shadows from card image titles/subtitles"
    rationale: "Text shadows used hardcoded rgba(0,0,0,0.3) that doesn't adapt to theme. Removing is cleaner than trying to make shadows theme-aware for text-on-image use case."
    alternatives: ["Add textShadowColor: colors.scrim", "Keep hardcoded shadows"]
    context: "card.tsx imageCardTitle and imageCardSubtitle"
  - decision: "Use colors.backgroundElevated for toast action button background"
    rationale: "Toast action buttons need subtle contrast against the toast background. backgroundElevated provides appropriate elevation without hardcoded opacity."
    alternatives: ["colors.background", "colors.secondary"]
    context: "toast.tsx action button background"
  - decision: "Use colors.scrim for card image overlay gradient"
    rationale: "Image overlays need to dim the image for text readability. colors.scrim is semantically designed for subtle darkening layers."
    alternatives: ["colors.overlay (too dark)", "custom opacity value"]
    context: "card.tsx ImageCard gradient overlay"
metrics:
  duration: "3.4 minutes"
  completed: "2026-01-28"
---

# Phase 19 Plan 02: RGBA Overlays & Hex Colors Summary

Replace hardcoded RGBA overlays and hex colors with semantic tokens for full theming support.

## One-liner

Migrated 8 UI components from hardcoded rgba() overlays and hex colors to semantic tokens (overlay, scrim, backgroundElevated, primaryForeground, warning), enabling proper dark mode adaptation.

## What Was Built

### Task 1: Fix RGBA Overlays (Commit 0d75ffb)

**Fixed 5 components with hardcoded rgba() values:**

1. **toast.tsx** (line 272)
   - `rgba(255,255,255,0.2)` → `colors.backgroundElevated`
   - Action button background now adapts to theme

2. **action-sheet.tsx** (line 364)
   - `rgba(0,0,0,0.5)` → `colors.overlay`
   - Modal backdrop properly dims in light/dark mode

3. **datetime-picker.tsx** (line 540)
   - `rgba(0,0,0,0.5)` → `colors.overlay`
   - Bottom sheet backdrop theme-aware

4. **image-gallery.tsx** (line 336)
   - `rgba(255,255,255,0.4)` → `colors.backgroundElevated`
   - Page indicator dots adapt to theme

5. **card.tsx** (lines 403-644)
   - Image card title: `#ffffff` → `colors.primaryForeground`
   - Image card subtitle: `rgba(255,255,255,0.8)` → `colors.primaryForeground`
   - Gradient overlay: `rgba(0,0,0,0.4)` → `colors.scrim`
   - Text shadows: `rgba(0,0,0,0.3)` → **Removed** (see Decisions)

### Task 2: Fix Hardcoded Hex Colors (Commit 519e97b)

**Fixed 4 components with hardcoded hex colors:**

1. **swipeable-row.tsx** (line 334)
   - `#fff` → `colors.primaryForeground`
   - Swipe action text color now theme-aware
   - Added `useTheme()` to ActionButton component

2. **avatar-stack.tsx** (lines 175, 235)
   - Avatar fallback text: `#ffffff` → `colors.primaryForeground`
   - Avatar wrapper background: `#ffffff` → `colors.background`
   - Border colors already used `colors.background` (correct)

3. **rating.tsx** (line 223)
   - `#F59E0B` (amber) → `colors.warning`
   - Star color semantically correct and theme-adaptive

## Technical Implementation

### Token Mapping Applied

| Old Value | New Token | Use Case |
|-----------|-----------|----------|
| `rgba(0,0,0,0.5)` | `colors.overlay` | Full-screen modal/dialog backdrops |
| `rgba(0,0,0,0.4)` | `colors.scrim` | Subtle image dimming for text readability |
| `rgba(255,255,255,0.2)` | `colors.backgroundElevated` | Elevated surfaces, button backgrounds |
| `rgba(255,255,255,0.4)` | `colors.backgroundElevated` | Semi-transparent UI elements |
| `rgba(255,255,255,0.8)` | `colors.primaryForeground` | Text on dark images |
| `#ffffff` / `#fff` | `colors.primaryForeground` | High-contrast text |
| `#F59E0B` | `colors.warning` | Warning/amber colors (stars, alerts) |

### Pattern: Dynamic Backdrop Colors

Since StyleSheet.create() is static, backdrop colors must be applied inline:

```tsx
// Before (static, won't work with theme)
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

// After (dynamic, theme-aware)
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});

<Animated.View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
```

Applied to: action-sheet.tsx, datetime-picker.tsx

## Deviations from Plan

None - plan executed exactly as written.

## Known Issues / Technical Debt

None identified.

## Testing Notes

**Verification commands run:**
- `grep -rn "rgba(0,0,0" [files]` → 0 matches ✅
- `grep -rn "rgba(255,255,255" [files]` → 0 matches ✅
- `grep -rn "'#ffffff'\|'#fff'\|'#F59E0B'" [files]` → 0 matches ✅
- `grep -rn "colors.overlay\|colors.scrim\|..." [files]` → 12 matches ✅

**Manual testing recommended:**
1. Toggle between light/dark mode in all affected components
2. Test different theme presets (violet, blue, green, etc.)
3. Verify overlays have appropriate opacity in both modes
4. Check text readability on image cards in both modes

## Next Phase Readiness

**Blockers:** None

**Concerns:**
- Some components may still have hardcoded colors not caught in research phase (19-RESEARCH.md)
- Instagram Stories gradient in stories.tsx intentionally left unchanged (brand colors)

**Recommendations:**
- Continue with 19-03 for remaining UI components
- Consider adding ESLint rule to prevent hardcoded rgba() and hex colors in future

## Team Notes

**For designers:**
- All overlay colors now use semantic tokens
- Text-on-image contrast no longer uses text shadows (relies on gradient overlay only)

**For developers:**
- Always use `colors.overlay` for modal backdrops
- Always use `colors.scrim` for image overlays
- Never hardcode rgba() or hex colors - use theme tokens

**For QA:**
- Test priority: Dark mode toggle on cards with images, modal backdrops, swipe actions
