---
phase: 07
plan: 01
title: Extend core token system with navigation and interaction component tokens
subsystem: theme-tokens
tags: [tokens, navigation, tabs, accordion, carousel, swipeable-row]
dependency-graph:
  requires:
    - 06-01  # List and layout tokens established component token pattern
    - 04-01  # Progress tokens established animation configuration pattern
  provides:
    - Navigation component token foundation
    - Centralized constants for Tabs, Accordion, Collapsible, Carousel, SwipeableRow
    - ComponentRadius entries for navigation components
  affects:
    - 07-02  # Tabs component migration will consume tabsTokens
    - 07-03  # Accordion/Collapsible migration will consume accordionTokens/collapsibleTokens
    - 07-04  # Carousel migration will consume carouselTokens
    - 07-05  # SwipeableRow migration will consume swipeableRowTokens
tech-stack:
  added: []
  patterns:
    - "COMPONENT_CONSTANTS pattern for animation configs and dimensions"
    - "componentTokens pattern with trigger/content/indicator structure"
    - "Spring animation config pattern { damping, stiffness, mass }"
key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
    - packages/core/src/theme/radius.ts
decisions:
  - id: tabs-spring-animation
    choice: "damping: 20, stiffness: 200"
    rationale: "Matches existing segmented control and button animation feel"
  - id: accordion-spring-mass
    choice: "Added mass: 0.5 for accordion/collapsible spring config"
    rationale: "Provides smoother, more natural expand/collapse motion for content areas"
  - id: carousel-dot-size
    choice: "dotSize: 8, dotActiveWidth: 24"
    rationale: "Standard mobile indicator dimensions with 3:1 active:inactive width ratio"
  - id: swipeable-action-width
    choice: "actionWidth: 80px"
    rationale: "Comfortable touch target for swipe actions (delete, archive, etc.)"
  - id: tabs-indicator-radius
    choice: "tabsIndicator separate from tabs container radius"
    rationale: "Allows pill variant container (lg) with more subtle indicator (md) for visual hierarchy"
  - id: carousel-pill-radius
    choice: "carousel uses PILL_RADIUS for perfect circular dots"
    rationale: "Carousel indicators should always be circular regardless of theme preset"
metrics:
  duration: 2 min
  completed: 2026-01-25
---

# Phase 07 Plan 01: Extend core token system with navigation and interaction component tokens Summary

Navigation and interaction component tokens added to core theme system with centralized constants for animations, dimensions, and styling.

## What Was Done

### Task 1: Add navigation component tokens to components.ts
**Commit:** `be2cb31`

Added five new component token groups to `packages/core/src/theme/components.ts`:

**Tabs Tokens:**
- `TABS_CONSTANTS`: Spring animation config, indicator height (2px), pill padding (4px)
- `tabsTokens`: Trigger sizing (fontSize.base, spacing tokens), separate underline variant padding, content margin, indicator dimensions

**Accordion Tokens:**
- `ACCORDION_CONSTANTS`: Spring config with mass: 0.5 for smooth expansion, chevron size (16px)
- `accordionTokens`: Trigger padding/typography, content padding, item border width

**Collapsible Tokens:**
- `COLLAPSIBLE_CONSTANTS`: Same spring config as accordion for consistency
- `collapsibleTokens`: Trigger padding and icon margin

**Carousel Tokens:**
- `CAROUSEL_CONSTANTS`: Autoplay interval (4000ms), scroll event throttle (16ms for 60fps)
- `carouselTokens`: Dot indicator dimensions (8px dots, 24px active width), scale/opacity values, line indicator widths

**SwipeableRow Tokens:**
- `SWIPEABLE_ROW_CONSTANTS`: Action width (80px), spring config, velocity threshold (500px/s), full swipe ratio (0.5), resistance factor (0.3)
- `swipeableRowTokens`: Action button dimensions, padding, icon margin, label typography

Updated `components` export to include: `tabs`, `accordion`, `collapsible`, `carousel`, `swipeableRow`.

### Task 2: Add componentRadius entries for navigation components
**Commit:** `5a9cca4`

Extended `ComponentRadiusTokens` interface and `createComponentRadius` function in `packages/core/src/theme/radius.ts`:

- `tabs`: `radiusTokens.lg` - Pill variant container uses larger radius for pronounced rounded effect
- `tabsIndicator`: `radiusTokens.md` - Indicator uses medium radius for subtle distinction
- `accordion`: `radiusTokens.lg` - Accordion items use large radius for card-like appearance
- `carousel`: `PILL_RADIUS` - Carousel indicator dots always perfectly circular regardless of theme preset

## Deviations from Plan

None - plan executed exactly as written.

## Technical Notes

### Token Design Patterns

1. **CONSTANTS vs Tokens Split:**
   - CONSTANTS: Animation configs, fixed dimensions, behavior thresholds
   - Tokens: Size-responsive spacing, typography, layout values

2. **Spring Animation Consistency:**
   - Base spring: `{ damping: 20, stiffness: 200 }` (tabs, swipeable)
   - Content expansion spring: `{ damping: 20, stiffness: 200, mass: 0.5 }` (accordion, collapsible)
   - Mass parameter adds weight for smoother, more natural content area animations

3. **Indicator Sizing Pattern:**
   - Carousel dots: 8px inactive → 24px active (3:1 ratio)
   - Tabs underline: 2px height (subtle emphasis)
   - Visual hierarchy through size contrast

### Component Radius Strategy

- **Always circular:** carousel dots (PILL_RADIUS) - indicators work best as perfect circles
- **Large radius:** tabs container, accordion items - creates card-like, friendly appearance
- **Medium radius:** tabs indicator - subtle distinction from container
- **Preset-independent:** carousel dots ignore theme radius preset for consistent UX

## Next Phase Readiness

### Blockers
None.

### Concerns
None - token foundation complete for wave 2 component migrations.

### Dependencies Ready
All navigation component migrations (07-02 through 07-05) can proceed in parallel once token foundation is committed.

## Validation

### Success Criteria Verification
✅ `tabsTokens.trigger.fontSize` references `fontSize.base` (14)
✅ `accordionTokens.trigger.paddingVertical` references `spacing[4]` (16)
✅ `carouselTokens.indicator.dotSize` = 8
✅ `swipeableRowTokens.action.width` = 80 (via SWIPEABLE_ROW_CONSTANTS.actionWidth)
✅ `TABS_CONSTANTS.spring.damping` = 20
✅ `componentRadius.tabs` uses `radiusTokens.lg`
✅ No hardcoded numeric values in token definitions (all reference spacing/fontSize/fontWeight)

### TypeScript Compilation
✅ Core package compiles without errors related to new tokens
✅ Components export includes all five new token groups
✅ ComponentRadiusTokens interface complete

## Files Modified

### packages/core/src/theme/components.ts
- Added TABS_CONSTANTS, tabsTokens (141 lines)
- Added ACCORDION_CONSTANTS, accordionTokens
- Added COLLAPSIBLE_CONSTANTS, collapsibleTokens
- Added CAROUSEL_CONSTANTS, carouselTokens
- Added SWIPEABLE_ROW_CONSTANTS, swipeableRowTokens
- Updated components export object

### packages/core/src/theme/radius.ts
- Extended ComponentRadiusTokens interface (+4 entries)
- Updated createComponentRadius function (+11 lines)

## Commits

1. `be2cb31` - feat(07-01): add navigation component tokens to core theme
2. `5a9cca4` - feat(07-01): add componentRadius entries for navigation components

**Total Changes:** 2 files modified, 152 lines added
