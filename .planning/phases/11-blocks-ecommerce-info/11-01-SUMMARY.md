---
phase: 11-blocks-ecommerce-info
plan: 01
subsystem: design-tokens
completed: 2026-01-25
duration: 5 min
tags: [tokens, ecommerce, info, blocks, typography, spacing]
requires: [09-blocks-auth-settings]
provides: [ecommerceBlockTokens, infoBlockTokens]
affects: [11-02, 11-03, 11-04, 11-05, 11-06]
tech-stack:
  added: []
  patterns: [centralized-block-tokens]
key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
decisions:
  - id: 11-01-ecommerce-tokens
    what: Created ecommerceBlockTokens with banner/hero/pricing/stats sections
    why: Phase 11 e-commerce blocks need centralized typography and spacing tokens
    impact: Banner, Hero, PricingCard, StatsCard blocks will consume these tokens
  - id: 11-01-info-tokens
    what: Created infoBlockTokens with 9 block sections (feature, content, onboarding, socialProof, notification, media, order, task, searchHeader)
    why: Phase 11 informational blocks need consistent typography/spacing
    impact: All 9 info blocks share centralized token system for visual consistency
---

# Phase 11 Plan 01: E-commerce & Info Block Tokens Summary

**One-liner:** Centralized typography and spacing tokens for 13 Phase 11 blocks (Banner, Hero, Pricing, Stats + 9 info blocks)

## What Was Built

Added two comprehensive token objects to `packages/core/src/theme/components.ts`:

1. **ecommerceBlockTokens** - Typography and spacing for e-commerce UI blocks
   - `banner`: Size variants (sm/md/lg) with padding, title/subtitle typography, icon sizing
   - `hero`: Large hero section typography (32px title, 16px subtitle)
   - `pricing`: Plan card typography (40px price, feature list sizing, badge positioning)
   - `stats`: Statistics display typography (32px value, 14px label, trend indicators)

2. **infoBlockTokens** - Typography and spacing for informational UI blocks
   - `feature`: Feature card layout (56px icon container, 16px title)
   - `content`: Content card typography (18px title, 16/9 aspect ratio)
   - `onboarding`: Onboarding slide typography (28px title, pagination dots)
   - `socialProof`: Social proof bar (avatar overlap ratio, text sizing)
   - `notification`: Notification item (44px avatar, unread dot, time stamp)
   - `media`: Media item (play button, checkbox, duration badge)
   - `order`: Order item (order ID, date, total, product image sizing)
   - `task`: Task item (title, description, due date, tags typography)
   - `searchHeader`: Search header (filter badge offset)

Both token objects exported via `components.ecommerceBlock` and `components.infoBlock`.

## Decisions Made

### Decision: Banner Size Variants (sm/md/lg)
**Context:** Banner blocks appear in various contexts (small notifications, medium alerts, large promotions)
**Options:**
1. Single size - Simple but inflexible
2. Size variants - More complex but matches button/input pattern
**Chose:** Size variants (sm/md/lg) following established component token pattern
**Rationale:** Consistency with existing componentHeight.sm/md/lg pattern. Enables Banner to scale appropriately in different UI contexts.

### Decision: Hero titleFontWeight = 800
**Context:** Hero sections need bold, attention-grabbing typography
**Options:**
1. Use fontWeight.bold (700) - Matches other headings
2. Use 800 (extra bold) - Stronger visual hierarchy
**Chose:** 800 (extra bold)
**Rationale:** Hero blocks are primary landing sections requiring maximum visual impact. Extra bold weight creates clear distinction from other headings.

### Decision: Pricing priceFontSize = 40
**Context:** Price is the focal point of pricing cards
**Options:**
1. Use fontSize['3xl'] (32px) - Largest token size
2. Custom 40px - Larger than token scale
**Chose:** 40px hardcoded value
**Rationale:** Pricing requires larger font than standard scale to emphasize value. Specific to pricing context, not a reusable token.

### Decision: Info Block Token Organization
**Context:** 9 diverse informational blocks with varying layouts
**Options:**
1. Individual token objects (featureBlockTokens, contentBlockTokens, etc.)
2. Unified infoBlockTokens with sub-sections
**Chose:** Unified infoBlockTokens with sub-sections
**Rationale:** Follows established pattern (authBlockTokens has header/form/footer sections). Cleaner import (`infoBlockTokens.feature` vs separate imports). All info blocks grouped logically.

## Technical Implementation

### Token Structure Pattern
All block tokens follow established component token pattern:
```typescript
export const ecommerceBlockTokens = {
  banner: {
    sm: { /* size-specific values */ },
    md: { /* size-specific values */ },
    lg: { /* size-specific values */ },
    // shared properties
    titleFontWeight: fontWeight.bold,
  },
  hero: { /* no size variants */ },
  // ...
} as const;
```

### Size Variant Strategy
- **Banner:** Full sm/md/lg variants (different use cases: notification vs promotion)
- **Hero/Pricing/Stats:** No size variants (fixed context)
- **Info blocks:** No size variants (most have single optimal size)

### Token Value Sources
- `fontSize.*`: From typography tokens (xs/sm/base/md/lg/xl/2xl/3xl)
- `fontWeight.*`: From typography tokens (normal/medium/semibold/bold)
- `spacing[*]`: From spacing scale (1-14)
- Custom values: Large price (40px), notification text (15px between base/md)

### Export Integration
Added to components object:
```typescript
export const components = {
  // ... existing tokens
  ecommerceBlock: ecommerceBlockTokens,
  infoBlock: infoBlockTokens,
  // ...
} as const;
```

## Files Changed

### Modified: packages/core/src/theme/components.ts
**Lines added:** ~185 lines
**Sections:**
1. ecommerceBlockTokens definition (lines 1086-1146)
2. infoBlockTokens definition (lines 1152-1226)
3. Export object updates (lines 1566, 1567)

**Key changes:**
- Added 4 e-commerce block token sections (banner, hero, pricing, stats)
- Added 9 info block token sections (feature, content, onboarding, socialProof, notification, media, order, task, searchHeader)
- Exported both via components.ecommerceBlock and components.infoBlock

## Testing

### Verification Performed
1. TypeScript compilation: `cd packages/core && npx tsc --noEmit`
   - Result: No new errors (pre-existing ConfigProvider error unrelated)
2. Token accessibility: Verified `components.ecommerceBlock` and `components.infoBlock` exported
3. Token structure: Confirmed all 13 block sections present with correct properties

### Manual Testing
- Inspected ecommerceBlockTokens structure: ✅ banner/hero/pricing/stats sections complete
- Inspected infoBlockTokens structure: ✅ All 9 sections (feature→searchHeader) complete
- Verified export object: ✅ Both tokens accessible via components object

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

### Ready to Proceed
- ✅ All 13 Phase 11 blocks have centralized tokens
- ✅ Tokens exported and accessible via theme system
- ✅ TypeScript compiles without new errors
- ✅ Pattern matches existing block token structure (authBlockTokens, stateBlockTokens)

### Unblocked Work
- **Plan 11-02:** Can now migrate Banner, Hero blocks to consume ecommerceBlockTokens
- **Plan 11-03:** Can now migrate Pricing, Stats blocks to consume ecommerceBlockTokens
- **Plan 11-04:** Can now migrate Feature, Content, Onboarding to consume infoBlockTokens
- **Plan 11-05:** Can now migrate remaining info blocks to consume infoBlockTokens
- **Plan 11-06:** Demo enhancements can reference consistent block typography/spacing

### Blockers
None identified.

## Metrics

**Duration:** 5 minutes
**Lines changed:** ~185 insertions
**Files modified:** 1
**Commits:** 3 (c797397, 5a2f9f2, b80083c)

**Velocity:** Consistent with Phase 9-01 (3 min) - token creation is fast, well-established pattern

## Lessons Learned

### What Went Well
- Token organization pattern (unified object with sub-sections) scales well for multiple related blocks
- Existing spacing/fontSize/fontWeight tokens covered 95% of needs
- No new dependencies required (native tokens sufficient)

### What Could Improve
- Initial confusion about naming (ecommerceBlockTokens already used in Phase 10 as productBlockTokens)
  - Resolution: Phase 10 renamed to productBlockTokens, Phase 11 uses ecommerceBlockTokens
- Could have grouped banner/hero/pricing/stats tokens earlier to see full Phase 11 scope

### Reusable Patterns
1. **Unified block token object:** `{blockType}BlockTokens = { section1: {...}, section2: {...} }`
2. **Size variants only when needed:** Banner has sm/md/lg, others don't
3. **Custom values for emphasis:** 40px price, 800 font weight for exceptional cases
4. **Export pattern:** `components.{blockCategory}: {blockCategory}Tokens`

## Knowledge for Future Sessions

### Token Naming Convention
- **Component tokens:** `{componentName}Tokens` (e.g., buttonTokens, inputTokens)
- **Block tokens:** `{category}BlockTokens` (e.g., authBlockTokens, ecommerceBlockTokens)
- **Sub-sections:** `{blockTokens}.{blockType}` (e.g., ecommerceBlockTokens.pricing)

### When to Create Size Variants
- **Create variants if:** Component appears in multiple contexts with different size requirements
- **Skip variants if:** Component has single optimal size (Hero always large, Stats always dashboard-sized)

### Custom vs Token Values
- **Use tokens:** 90% of typography/spacing (fontSize.md, spacing[4])
- **Use custom:** Exceptional emphasis (40px price), non-standard sizes (15px between scale)
- **Document custom:** Comment why value doesn't use token (e.g., "// 15 between base and md")

### Block Token Organization
Best practice: Group related blocks in single token object with sub-sections
- ✅ `ecommerceBlockTokens.banner/hero/pricing/stats`
- ❌ `bannerTokens, heroTokens, pricingTokens, statsTokens` (too many exports)

This pattern keeps related blocks discoverable and maintains clean export structure.
