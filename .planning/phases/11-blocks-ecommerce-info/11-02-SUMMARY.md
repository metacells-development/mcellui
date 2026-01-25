---
phase: 11-blocks-ecommerce-info
plan: 02
subsystem: blocks
completed: 2026-01-25
duration: 2 min
tags: [blocks, tokens, banner, hero, ecommerce, typography]
requires: [11-01]
provides: [token-based-banner-hero]
affects: [11-06]
tech-stack:
  added: []
  patterns: [block-token-migration]
key-files:
  created: []
  modified:
    - packages/registry/blocks/banner-block.tsx
    - packages/registry/blocks/hero-block.tsx
decisions:
  - id: 11-02-banner-shared-tokens
    what: Separate size-specific and shared tokens in BannerBlock
    why: titleFontWeight and subtitleLineHeight same across all sizes
    impact: Cleaner token access pattern for properties shared across size variants
  - id: 11-02-hero-inline-styles
    what: Move typography from static StyleSheet to inline styles in HeroBlock
    why: StyleSheet.create requires static values, tokens are runtime values
    impact: Typography now theme-responsive at runtime
---

# Phase 11 Plan 02: Banner & Hero Token Migration Summary

**One-liner:** Migrated BannerBlock and HeroBlock from hardcoded typography/spacing to centralized ecommerceBlockTokens

## What Was Built

Replaced all hardcoded size configurations and typography in promotional blocks with centralized token system.

### BannerBlock Migration
- **Removed:** SIZE_CONFIG constant (23 lines of hardcoded values)
- **Added:** ecommerceBlockTokens.banner import with size variants (sm/md/lg)
- **Token properties:** padding, titleFontSize, subtitleFontSize, iconSize, minHeight, titleFontWeight, subtitleLineHeight
- **Pattern:** Separate size-specific tokens (`tokens = banner[size]`) and shared tokens (`sharedTokens = banner`)

### HeroBlock Migration
- **Removed:** Static StyleSheet typography (fontSize: 32, fontWeight: '800', lineHeight: 38/24)
- **Added:** ecommerceBlockTokens.hero import
- **Token properties:** titleFontSize (32), titleFontWeight (800), titleLineHeight (38), subtitleFontSize (16), subtitleLineHeight (24)
- **Pattern:** Inline styles for dynamic theme-aware typography

## Decisions Made

### Decision: Separate Size-Specific and Shared Tokens
**Context:** BannerBlock has properties that vary by size (padding, fontSize) and properties constant across sizes (fontWeight, lineHeight)
**Options:**
1. Duplicate titleFontWeight/subtitleLineHeight in each size variant
2. Access size-specific and shared tokens separately
**Chose:** Separate access pattern (`tokens = banner[size]`, `sharedTokens = banner`)
**Rationale:** Avoids token duplication. Makes it clear which properties scale with size vs which are constant. Matches pattern from existing blocks where some properties are size-independent.

### Decision: Inline Styles for HeroBlock Typography
**Context:** HeroBlock needs to use runtime token values for typography
**Options:**
1. Keep static StyleSheet with hardcoded values
2. Move typography to inline styles with token access
**Chose:** Inline styles with token access
**Rationale:** StyleSheet.create() requires static values at module initialization. Tokens are runtime values from theme system. Inline styles allow dynamic token-based typography that responds to theme changes. Follows pattern from recent demo migrations (Phase 6-7).

## Technical Implementation

### BannerBlock Token Replacement Pattern

**Before:**
```typescript
const SIZE_CONFIG = {
  sm: { padding: 12, titleSize: 14, ... },
  md: { padding: 16, titleSize: 16, ... },
  lg: { padding: 20, titleSize: 20, ... },
};
const config = SIZE_CONFIG[size];

<Text style={[styles.title, { fontSize: config.titleSize }]}>
```

**After:**
```typescript
const tokens = ecommerceBlockTokens.banner[size];
const sharedTokens = ecommerceBlockTokens.banner;

<Text style={[
  styles.title,
  {
    fontSize: tokens.titleFontSize,
    fontWeight: sharedTokens.titleFontWeight,
  }
]}>
```

### HeroBlock Token Replacement Pattern

**Before:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
});

<Text style={[styles.title, { color: '#FFF' }]}>
```

**After:**
```typescript
const heroTokens = ecommerceBlockTokens.hero;

<Text style={[
  styles.title,
  {
    fontSize: heroTokens.titleFontSize,
    fontWeight: String(heroTokens.titleFontWeight) as any,
    lineHeight: heroTokens.titleLineHeight,
    color: '#FFF',
  }
]}>
```

### Type Casting for fontWeight
Used `String(heroTokens.titleFontWeight) as any` to handle fontWeight type. Token value is `800` (number), React Native expects string `'800'` or numeric weight. Type cast ensures compatibility.

### Removed Hardcoded Values
- BannerBlock: Removed all SIZE_CONFIG properties (6 properties × 3 sizes = 18 values)
- HeroBlock: Removed fontSize (32, 16), fontWeight ('800'), lineHeight (38, 24)
- Styles objects cleaned up (removed empty properties from StyleSheet)

## Files Changed

### Modified: packages/registry/blocks/banner-block.tsx
**Lines changed:** -42 +16 (net -26 lines)
**Key changes:**
1. Added ecommerceBlockTokens import (line 31)
2. Removed SIZE_CONFIG constant (lines 102-124 deleted)
3. Added token access in component body (lines 147-148)
4. Replaced config properties with tokens throughout (7 locations)
5. Cleaned up static styles object (removed hardcoded fontWeight/lineHeight)

### Modified: packages/registry/blocks/hero-block.tsx
**Lines changed:** -33 +76 (net +43 lines)
**Key changes:**
1. Added ecommerceBlockTokens import (line 40)
2. Added heroTokens access in component body (line 127)
3. Moved title typography to inline styles (lines 168-171)
4. Moved subtitle typography to inline styles (lines 180-181)
5. Cleaned up static styles object (removed fontSize/fontWeight/lineHeight)

## Testing

### Verification Performed
1. TypeScript compilation: `cd packages/registry && npx tsc --noEmit`
   - Result: ✅ No errors for banner-block.tsx or hero-block.tsx
2. SIZE_CONFIG removal: `grep SIZE_CONFIG banner-block.tsx`
   - Result: ✅ No matches (constant fully removed)
3. Hardcoded fontSize removal: `grep "fontSize:\s*(32|16)" hero-block.tsx`
   - Result: ✅ No matches (hardcoded values removed)
4. Token import verification: `grep ecommerceBlockTokens blocks/*-block.tsx`
   - Result: ✅ Both banner-block.tsx and hero-block.tsx import tokens

### Manual Testing
Not performed (demo app not run). Migration is type-safe and follows established pattern from Plans 09-02, 09-03, 09-04.

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

### Ready to Proceed
- ✅ BannerBlock fully migrated to size-variant token system
- ✅ HeroBlock fully migrated to hero typography tokens
- ✅ No hardcoded font sizes or spacing remain in either block
- ✅ TypeScript compiles without errors
- ✅ Pattern established for remaining e-commerce block migrations (Pricing, Stats)

### Unblocked Work
- **Plan 11-03:** Can now migrate PricingCard and StatsCard using same token pattern
- **Plan 11-06:** Demo enhancements can rely on consistent token-based sizing across Banner/Hero

### Blockers
None identified.

## Metrics

**Duration:** 2 minutes
**Lines changed:** +92 insertions, -75 deletions (net +17 lines)
**Files modified:** 2
**Commits:** 2 (a5a4deb, b03ba91)

**Velocity:** Faster than Phase 9 block migrations (3-4 min). Simpler token structures (no form fields, fewer size variants).

## Lessons Learned

### What Went Well
- Established pattern from Phase 9 blocks made migration straightforward
- Separate size-specific/shared token access pattern emerged naturally from BannerBlock structure
- Inline style pattern for dynamic typography now well-established (used in Phase 6-7 demos, now blocks)

### What Could Improve
- Could have documented fontWeight type casting pattern in plan (needed `String(value) as any`)
- Plan could have noted that inline styles increase JSX line count (acceptable tradeoff for dynamic tokens)

### Reusable Patterns

1. **Size-variant token access:**
   ```typescript
   const tokens = blockTokens.section[size];        // Size-specific
   const sharedTokens = blockTokens.section;         // Size-independent
   ```

2. **Inline typography pattern:**
   ```typescript
   <Text style={[
     styles.staticStyle,
     {
       fontSize: tokens.fontSize,
       fontWeight: tokens.fontWeight,
       lineHeight: tokens.lineHeight,
       // ... other dynamic properties
     }
   ]}>
   ```

3. **StyleSheet cleanup:**
   - Remove hardcoded typography from StyleSheet.create()
   - Keep only structural styles (flex, position, alignment)
   - Move all theme-dependent values to inline styles

## Knowledge for Future Sessions

### Token Migration Checklist for Blocks
1. Add token import: `import { [category]BlockTokens } from '@metacells/mcellui-core'`
2. Access tokens in component body: `const tokens = blockTokens.section[size]` (if size variants) or `const tokens = blockTokens.section`
3. Replace hardcoded constants/configs with token access
4. Move typography to inline styles (fontSize, fontWeight, lineHeight)
5. Clean up static StyleSheet (remove now-dynamic properties)
6. Verify TypeScript compilation
7. Commit with clear description of replaced values

### When to Use Inline vs StyleSheet Styles
- **Inline:** All theme-dependent values (colors, spacing, typography from tokens)
- **StyleSheet:** Structural values (flexDirection, alignItems, position)
- **Mixed:** Combine static StyleSheet base with dynamic inline overrides

### Size Variant Token Pattern
- If component has size prop with different typography/spacing per size: Use size-indexed tokens (`blockTokens.section[size]`)
- If component has properties shared across sizes: Use separate shared token access (`blockTokens.section.sharedProperty`)
- Avoid duplicating shared values in token definition (DRY principle)

This pattern now proven across auth blocks (Phase 9) and e-commerce blocks (Phase 11).
