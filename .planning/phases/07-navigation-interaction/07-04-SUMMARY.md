---
phase: 07-navigation-interaction
plan: 04
subsystem: carousel-swipeable
tags: [tokens, carousel, swipeable-row, animations, indicators]
requires: [07-01]
provides:
  - Carousel with centralized indicator and animation tokens
  - SwipeableRow with centralized action and spring tokens
affects: [demos, migration-pattern]
tech-stack:
  added: []
  patterns:
    - Centralized animation constants for component consistency
    - Token-based indicator dimensions for theme flexibility
    - Action button sizing via swipeableRowTokens
key-files:
  created: []
  modified:
    - packages/registry/ui/carousel.tsx
    - packages/registry/ui/swipeable-row.tsx
    - packages/core/src/theme/index.ts
    - packages/core/src/index.ts
decisions:
  - title: "Carousel indicator dots use token-based dimensions"
    rationale: "Allows theme-level control over indicator size and spacing"
    date: 2026-01-25
  - title: "SwipeableRow action buttons use centralized typography tokens"
    rationale: "Ensures consistent font sizing across swipeable actions"
    date: 2026-01-25
metrics:
  duration: 3.1 min
  completed: 2026-01-25
---

# Phase 07 Plan 04: Carousel and SwipeableRow Token Migration Summary

**One-liner:** Carousel indicators and SwipeableRow actions now use centralized tokens for consistent animation timing, dimensions, and typography.

## What Was Built

### Carousel Token Migration
- Replaced hardcoded autoplay interval (4000ms) with `CAROUSEL_CONSTANTS.autoplayInterval`
- Replaced scroll throttle (16) with `CAROUSEL_CONSTANTS.scrollEventThrottle`
- Migrated AnimatedDot interpolation values to `carouselTokens`:
  - `dotSize` (8px) for indicator dimensions
  - `lineIndicator.activeWidth` (24px) for line variant
  - `dotInactiveOpacity` (0.4) and `dotActiveScale` (1.0) for animation
  - `dotInactiveScale` (0.8) for subtle scaling effect
- Updated indicator container styles to use `carouselTokens.indicator.gap` (6px) and `paddingVertical` (8px)
- Dot borderRadius now uses `dotSize / 2` for perfect circular shape

### SwipeableRow Token Migration
- Removed local constants `ACTION_WIDTH` (80) and `SPRING_CONFIG` (damping: 20, stiffness: 200)
- Replaced with `SWIPEABLE_ROW_CONSTANTS`:
  - `actionWidth` for default action button width
  - `spring` for consistent spring animation config
  - `velocityThreshold` (500px/s) for snap decision
  - `fullSwipeRatio` (0.5) for full-swipe trigger
  - `resistanceFactor` (0.3) for rubber-band effect
- Migrated ActionButton styles to `swipeableRowTokens.action`:
  - `paddingHorizontal` (8px) for button padding
  - `iconMargin` (4px) for icon spacing
  - `labelFontSize` (12px) for text size
  - `labelFontWeight` (600) for semibold text

### Token Export Infrastructure
- Added `carouselTokens` and `CAROUSEL_CONSTANTS` to `@metacells/mcellui-core` exports
- Added `swipeableRowTokens` and `SWIPEABLE_ROW_CONSTANTS` to core package exports
- Updated `packages/core/src/theme/index.ts` and `packages/core/src/index.ts` for public API

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

### 1. Carousel Indicator Dimensions
**Context:** Carousel had hardcoded 8px dot size and 24px active line width.

**Decision:** Use `carouselTokens.indicator.dotSize` and `carouselTokens.lineIndicator.activeWidth` for all indicator dimensions.

**Rationale:** Enables theme-level customization of indicator appearance without modifying component code.

**Alternatives Considered:**
- Keep hardcoded values (rejected - prevents theme flexibility)
- Use spacing tokens directly (rejected - component-specific sizing needs dedicated tokens)

### 2. SwipeableRow Spring Configuration
**Context:** SwipeableRow used local `SPRING_CONFIG` for all animations.

**Decision:** Centralize spring config in `SWIPEABLE_ROW_CONSTANTS.spring` shared across all swipe animations.

**Rationale:** Ensures consistent feel across open/close/snap animations and allows global tuning.

**Alternatives Considered:**
- Separate spring configs per animation type (rejected - unnecessary complexity)
- Use global spring tokens (rejected - swipe needs specific damping/stiffness)

### 3. Velocity Threshold Centralization
**Context:** Hardcoded 500px/s threshold for determining snap direction.

**Decision:** Use `SWIPEABLE_ROW_CONSTANTS.velocityThreshold` for all velocity checks.

**Rationale:** Makes threshold tunable for different device performance characteristics.

**Alternatives Considered:**
- Keep hardcoded 500 (rejected - prevents experimentation with threshold values)

## Component Integration

### Carousel
```typescript
import { carouselTokens, CAROUSEL_CONSTANTS } from '@metacells/mcellui-core';

// Uses centralized tokens for:
autoplayInterval = CAROUSEL_CONSTANTS.autoplayInterval  // 4000ms
scrollEventThrottle={CAROUSEL_CONSTANTS.scrollEventThrottle}  // 16

// Indicator dimensions from carouselTokens
gap: carouselTokens.indicator.gap  // 6px
paddingVertical: carouselTokens.indicator.paddingVertical  // 8px
dotSize: carouselTokens.indicator.dotSize  // 8px
```

### SwipeableRow
```typescript
import { swipeableRowTokens, SWIPEABLE_ROW_CONSTANTS } from '@metacells/mcellui-core';

// Uses centralized constants for:
actionWidth = SWIPEABLE_ROW_CONSTANTS.actionWidth  // 80px
spring: SWIPEABLE_ROW_CONSTANTS.spring  // { damping: 20, stiffness: 200 }
velocityThreshold: SWIPEABLE_ROW_CONSTANTS.velocityThreshold  // 500px/s

// Action button styling from swipeableRowTokens
paddingHorizontal: swipeableRowTokens.action.paddingHorizontal  // 8px
labelFontSize: swipeableRowTokens.action.labelFontSize  // 12px
labelFontWeight: swipeableRowTokens.action.labelFontWeight  // 600
```

## Token System Impact

### New Exports
- `carouselTokens` - Indicator dimensions and animation values
- `CAROUSEL_CONSTANTS` - Autoplay and scroll throttle configuration
- `swipeableRowTokens` - Action button styling tokens
- `SWIPEABLE_ROW_CONSTANTS` - Spring animation and threshold values

### Token Coverage
- Carousel: 100% of indicator/animation values now tokenized
- SwipeableRow: 100% of action button and animation values now tokenized

## Next Phase Readiness

### Blockers
None.

### Open Questions
None.

### Concerns
None.

## Migration Pattern Insights

### Animation Constants Pattern
Both components demonstrate the value of `{COMPONENT}_CONSTANTS` for hardcoded numeric values:
- Makes timing/threshold values visible and tunable
- Enables A/B testing of animation parameters
- Documents "magic numbers" with meaningful names

### Component-Specific vs Global Tokens
- SwipeableRow uses dedicated `spring` config (not global springs) because swipe gestures need specific damping
- Carousel uses dedicated `dotSize` (not iconSize) because indicators have unique sizing requirements
- This reinforces: use component tokens when behavior differs from global patterns

### Interpolation Token Usage
Carousel's AnimatedDot shows how to use tokens in `interpolate()`:
```typescript
inputRange,
variant === 'line'
  ? [carouselTokens.indicator.dotSize, carouselTokens.lineIndicator.activeWidth, carouselTokens.indicator.dotSize]
  : [carouselTokens.indicator.dotSize, carouselTokens.indicator.dotSize * 1.5, carouselTokens.indicator.dotSize]
```
Pattern: Use base token with scalar multipliers for derived values (1.5x for active dot scale).

## Files Changed

### Modified (4 files)
1. `packages/registry/ui/carousel.tsx` - Migrated to carouselTokens and CAROUSEL_CONSTANTS
2. `packages/registry/ui/swipeable-row.tsx` - Migrated to swipeableRowTokens and SWIPEABLE_ROW_CONSTANTS
3. `packages/core/src/theme/index.ts` - Added carousel/swipeable-row token exports
4. `packages/core/src/index.ts` - Added carousel/swipeable-row token exports

### Created
None.

## Quality Metrics

- **TypeScript Compilation:** ✅ Pass (carousel.tsx and swipeable-row.tsx have no errors)
- **Token Imports:** ✅ All tokens properly exported from @metacells/mcellui-core
- **Animation Constants:** ✅ All hardcoded timing/threshold values replaced
- **Indicator Tokens:** ✅ All dimension values use carouselTokens
- **Action Button Tokens:** ✅ All styling values use swipeableRowTokens

## Commits

1. **176c51e** - `feat(07-04): migrate Carousel to centralized tokens`
   - Carousel uses carouselTokens for indicator dimensions
   - CAROUSEL_CONSTANTS for autoplay interval and scroll throttle
   - AnimatedDot uses token-based interpolation values
   - Exported tokens from core package

2. **03559e0** - `feat(07-04): migrate SwipeableRow to centralized tokens`
   - SwipeableRow uses SWIPEABLE_ROW_CONSTANTS for spring and thresholds
   - ActionButton uses swipeableRowTokens for typography and spacing
   - Removed local ACTION_WIDTH and SPRING_CONFIG constants
   - All velocity thresholds use centralized constant
