# Phase 20: Spacing, Typography & Naming - Research

**Researched:** 2026-01-28
**Domain:** Design token migration and code standardization
**Confidence:** HIGH

## Summary

Phase 20 migrates hardcoded spacing, borderRadius, and typography values to theme tokens across all components (~50 registry components) and renames demo app blocks to match registry patterns. This is a standardization phase, not a visual redesign — components should look identical after migration.

The existing token infrastructure is already comprehensive:
- **Spacing scale**: 4px base (0.5-96 range) exists in `packages/core/src/theme/spacing.ts`
- **Radius tokens**: Preset system with createRadius() exists in `packages/core/src/theme/radius.ts`
- **Typography tokens**: Complete semantic system with createTypography() exists in `packages/core/src/theme/typography.ts`

Current state analysis shows ~41 hardcoded values across 8-16 components (fontSize: 19 occurrences, spacing/margin/gap: 11 occurrences, borderRadius: 11 occurrences). Most components already use tokens via `components.button[size]` pattern.

**Primary recommendation:** Migrate in three atomic passes (spacing → radius → typography), then rename blocks atomically. Each pass should be a single commit to enable easy rollback if visual regressions occur.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Native StyleSheet | Built-in | Component styling | Native styling API, type-safe |
| Reanimated 3 | ^3.x | Animation values | Used throughout existing codebase |
| @metacells/mcellui-core | Internal | Theme tokens | Already provides spacing/radius/typography |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | ^5.x | Type safety | All token accesses should be type-checked |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct token replacement | CSS-in-JS library | Would require full rewrite, against project philosophy |
| Manual search-replace | AST transformation (jscodeshift) | Overkill for ~41 values, manual review preferred |

**Installation:**
No new dependencies required — all token infrastructure already exists.

## Architecture Patterns

### Recommended Migration Structure
```
1. Spacing migration (padding, margin, gap)
   - Search: /padding:\s*\d+|margin:\s*\d+|gap:\s*\d+/
   - Replace: padding: spacing[n]

2. Radius migration (borderRadius)
   - Search: /borderRadius:\s*\d+/
   - Replace: borderRadius: componentRadius.component

3. Typography migration (fontSize, fontWeight)
   - Search: /fontSize:\s*\d+|fontWeight:\s*['"]?\d+['"]?/
   - Replace: fontSize: typography.role.fontSize

4. Block renaming
   - Rename files: hero-block.tsx
   - Update exports: export function HeroBlock
   - Update imports: import { HeroBlock }
```

### Pattern 1: Spacing Token Migration
**What:** Replace hardcoded pixel values with `spacing[n]` array access
**When to use:** All padding, margin, gap properties
**Example:**
```typescript
// Before
const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
});

// After
const styles = StyleSheet.create({
  container: {
    padding: spacing[4],    // 16px
    gap: spacing[3],        // 12px
    marginBottom: spacing[2], // 8px
  },
});
```
**Source:** Existing pattern in button.tsx, card.tsx uses `components.button.md.paddingHorizontal` which references spacing tokens

### Pattern 2: Dynamic Radius via componentRadius
**What:** Use componentRadius object from useTheme() for all borderRadius values
**When to use:** Component-level border radius that should respond to global radius preset
**Example:**
```typescript
// Before
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
});

// After
function MyCard() {
  const { componentRadius } = useTheme();
  return (
    <View style={[styles.card, { borderRadius: componentRadius.card }]} />
  );
}
```
**Source:** packages/core/src/theme/radius.ts createComponentRadius() system

### Pattern 3: Typography via Component Tokens
**What:** Use component-specific typography tokens that bundle fontSize + fontWeight + lineHeight
**When to use:** All text styling in components
**Example:**
```typescript
// Before
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
});

// After
function MyComponent() {
  const { components } = useTheme();
  return (
    <Text style={{
      fontSize: components.card.titleFontSize,
      fontWeight: components.card.titleFontWeight,
    }}>
  );
}
```
**Source:** packages/core/src/theme/components.ts already defines component-specific typography tokens

### Pattern 4: Atomic Block Renaming
**What:** Rename file + component export + all imports in single commit
**When to use:** Demo app block renaming to match registry pattern
**Example:**
```typescript
// File: apps/demo/components/blocks/hero.tsx → hero-block.tsx
// Before export
export function Hero({ ... }) { }

// After export
export function HeroBlock({ ... }) { }

// Update imports
import { HeroBlock } from '@/components/blocks/hero-block';
```

### Anti-Patterns to Avoid
- **String literal radius values**: Never use `borderRadius: 'lg'` in StyleSheet — StyleSheet only accepts numbers
- **Mixed token/hardcoded values**: Don't do `padding: spacing[4]` in one place and `padding: 16` elsewhere in same file
- **Negative raw values**: Use `margin: -spacing[2]` not `margin: -8` — keeps token reference clear
- **Component-specific typography in StyleSheet**: Typography tokens should be applied inline with useTheme(), not in static StyleSheet
- **Gradual block renaming**: Don't rename hero.tsx first and leave imports broken — rename file + update all imports atomically

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding all hardcoded spacing values | Manual grep and replace | Systematic search with verification | grep might miss computed values, edge cases with template literals |
| Mapping hardcoded values to tokens | Custom mapping script | Manual review with rounding rules | User decided "round to nearest" is acceptable — automated rounding could introduce subtle bugs |
| Renaming TypeScript symbols | sed/awk text replacement | IDE rename refactor or manual | TypeScript imports need path updates, not just text replacement |
| Verifying visual consistency | Manual screenshots | Automated visual regression (Playwright) | Too expensive for internal demo app, manual iOS/Android check sufficient |

**Key insight:** This is a refactoring task, not a transformation task. Prefer manual review over automation to catch edge cases (computed values, conditional styles, platform-specific overrides).

## Common Pitfalls

### Pitfall 1: StyleSheet Radius Requires Numbers
**What goes wrong:** Using `borderRadius: componentRadius.card` directly in StyleSheet.create() causes type error
**Why it happens:** StyleSheet.create() is evaluated at module load time, before theme is available
**How to avoid:** Apply dynamic radius inline, keep static styles in StyleSheet
**Warning signs:** TypeScript error "Type 'number | undefined' is not assignable to type 'number'"
**Example:**
```typescript
// WRONG - componentRadius not available at module load time
const styles = StyleSheet.create({
  card: {
    borderRadius: componentRadius.card, // ERROR
  },
});

// CORRECT - apply dynamically
function Card() {
  const { componentRadius } = useTheme();
  return <View style={[styles.card, { borderRadius: componentRadius.card }]} />;
}
```

### Pitfall 2: Rounding Spacing Values Changes Visuals
**What goes wrong:** Rounding 13px to spacing[3] (12px) causes 1px visual shift that looks wrong
**Why it happens:** Not all values fall on 4px grid, some intentional odd values for optical balance
**How to avoid:** Visually verify each rounded value on iOS/Android before committing
**Warning signs:** Component looks slightly "off" after migration, especially padding around text
**Mitigation:** User decided rounding is acceptable, but verify hero block title (32px → fontSize['3xl'] = 30px) doesn't look degraded

### Pitfall 3: Negative Margins Lose Token Reference
**What goes wrong:** Writing `margin: -spacing[2]` works but loses clarity when spacing scale changes
**Why it happens:** Negative values are less common, easy to forget they're token-based
**How to avoid:** Always use token reference even for negative values, never hardcode `-8`
**Warning signs:** Negative margins inconsistent with positive spacing elsewhere

### Pitfall 4: Typography Token Mismatch
**What goes wrong:** Mapping card title (20px bold) to wrong typography role, resulting in wrong size
**Why it happens:** Multiple typography tokens have similar sizes, easy to pick wrong semantic role
**How to avoid:** Use component-specific tokens first (components.card.titleFontSize), fall back to typography roles only when no component token exists
**Warning signs:** Text size changes unexpectedly after migration

### Pitfall 5: Block Rename Import Breakage
**What goes wrong:** Renaming hero.tsx → hero-block.tsx but forgetting to update import paths
**Why it happens:** File rename and import update are separate operations
**How to avoid:** Use IDE rename refactor, or rename file + update imports in same commit
**Warning signs:** TypeScript errors "Cannot find module '@/components/blocks/hero'"

### Pitfall 6: Gap vs Padding Scale Mismatch
**What goes wrong:** Using same spacing tokens for gap and padding causes overly tight/loose layouts
**Why it happens:** User noted "flex gaps use a different/tighter scale than padding/margin"
**How to avoid:** Gap values typically 1-2 steps smaller than padding (padding: spacing[4], gap: spacing[2])
**Warning signs:** Flex layouts look cramped or spacious compared to before

## Code Examples

Verified patterns from official sources:

### Spacing Token Migration (Common Operation)
```typescript
// Source: packages/mcp-server/registry/ui/button.tsx (line 140)
// Existing correct usage
style={[
  styles.base,
  {
    minHeight: tokens.height,
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    borderRadius,
    gap: tokens.gap,
  },
]}

// Source: packages/mcp-server/registry/ui/card.tsx (line 420)
// ImageCard uses inline spacing tokens
{ borderRadius: componentRadius.card + 4 }  // Computed from token
```

### Radius Migration (Common Operation)
```typescript
// Source: packages/core/src/theme/radius.ts (line 174)
// Component radius creation pattern
export function createComponentRadius(radiusTokens: RadiusTokens): ComponentRadiusTokens {
  return {
    button: radiusTokens.md,
    buttonSm: radiusTokens.sm,
    buttonLg: radiusTokens.lg,
    badge: PILL_RADIUS,  // Always 9999
    avatar: PILL_RADIUS,
    card: radiusTokens.lg,
  };
}

// Usage in components
const { componentRadius } = useTheme();
<View style={{ borderRadius: componentRadius.card }} />
```

### Typography Migration (Common Operation)
```typescript
// Source: packages/core/src/theme/components.ts (line 662)
// Card typography tokens (existing)
export const cardTokens = {
  titleFontSize: fontSize.lg,        // 18
  titleFontWeight: fontWeight.semibold,
  descriptionFontSize: fontSize.base, // 14
} as const;

// Usage in component
const { components, colors } = useTheme();
<Text style={{
  fontSize: components.card.titleFontSize,
  fontWeight: components.card.titleFontWeight,
  color: colors.cardForeground,
}}>
```

### Block Renaming (File Structure)
```typescript
// Source: Inferred from existing registry pattern
// Registry blocks use: hero-block.tsx exports HeroBlock
// Demo app currently uses: hero-block.tsx exports HeroBlock (already correct!)
// Only component names need Block suffix added

// apps/demo/components/blocks/hero-block.tsx
export function HeroBlock({ ... }) {  // Already has Block suffix
  // ...
}

// But imports might need updating:
// apps/demo/app/(tabs)/blocks.tsx
import { HeroBlock } from '@/components/blocks/hero-block';
```

### Negative Margin Token Usage
```typescript
// No official example found, but pattern:
const styles = StyleSheet.create({
  offset: {
    marginTop: -spacing[3],  // -12px, maintains token reference
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded spacing values | spacing[n] tokens | Phase 19 established | Components use mix of tokens and hardcoded (migration incomplete) |
| Static borderRadius in StyleSheet | Dynamic componentRadius from useTheme() | Phase 19 radius system | Allows global radius preset changes |
| Individual fontSize/fontWeight | Bundled typography tokens | Phase 19 typography system | fontSize + fontWeight + lineHeight together |
| Component-specific typography in components | Component typography tokens in core | Phase 19 component tokens | Centralized in components.ts |

**Deprecated/outdated:**
- **Raw pixel values**: Hardcoded `padding: 16` is deprecated, use `spacing[4]`
- **Static borderRadius numbers**: Hardcoded `borderRadius: 8` is deprecated, use `componentRadius.component`
- **Separate fontSize/fontWeight**: Use component tokens that bundle both

## Open Questions

Things that couldn't be fully resolved:

1. **Gap scale differences**
   - What we know: User noted "flex gaps use different/tighter scale than padding/margin"
   - What's unclear: Exact ratio (gap = padding - 1 step? padding - 2 steps?)
   - Recommendation: Analyze existing correct components (button.tsx gap vs padding), establish pattern

2. **Hero block title rounding (32px → 30px)**
   - What we know: Hero title is 32px (fontSize['3xl'] = 30px is closest)
   - What's unclear: Does 2px reduction look acceptable on actual devices?
   - Recommendation: Visual test on iOS/Android before committing, may need custom token

3. **Block component names current state**
   - What we know: Files already use `-block` suffix (hero-block.tsx)
   - What's unclear: Do component exports already have Block suffix? (check actual files)
   - Recommendation: Audit all 7 demo blocks before planning rename tasks

4. **Component-specific vs semantic typography**
   - What we know: components.card.titleFontSize exists, typography.h3 also exists
   - What's unclear: When to use which? Priority order?
   - Recommendation: Component tokens first, semantic typography as fallback for unmapped text

## Sources

### Primary (HIGH confidence)
- `packages/core/src/theme/spacing.ts` - Spacing token scale definition
- `packages/core/src/theme/radius.ts` - Radius system with createRadius() and createComponentRadius()
- `packages/core/src/theme/typography.ts` - Typography tokens with createTypography()
- `packages/core/src/theme/components.ts` - Component-specific tokens (1582 lines)
- `packages/mcp-server/registry/ui/button.tsx` - Reference implementation using tokens
- `packages/mcp-server/registry/ui/card.tsx` - Reference implementation with dynamic radius
- `.planning/phases/20-spacing-typography-naming/20-CONTEXT.md` - User decisions

### Secondary (MEDIUM confidence)
- [Design tokens with confidence - W3C standard](https://uxdesign.cc/design-tokens-with-confidence-862119eb819b) - 2026 design token standards
- [What Are Design Tokens? Essential Guide](https://www.designrush.com/best-designs/websites/trends/what-are-design-tokens) - Migration best practices
- [USWDS Spacing Units](https://designsystem.digital.gov/design-tokens/spacing-units/) - 8px base system patterns
- [Spacing systems & scales in UI design](https://blog.designary.com/p/spacing-systems-and-scales-ui-design) - 4px vs 8px base discussion

### Tertiary (LOW confidence)
- [React Native spacing system npm](https://www.npmjs.com/package/react-native-spacing-system) - Community spacing patterns
- [TypeScript Refactoring - VS Code](https://code.visualstudio.com/docs/typescript/typescript-refactoring) - Rename symbol tooling
- [Git Move Files - 2026](https://thelinuxcode.com/git-move-files-practical-renames-refactors-and-history-preservation-in-2026/) - File rename best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All token infrastructure already exists in codebase
- Architecture: HIGH - Patterns verified in existing components (button.tsx, card.tsx)
- Pitfalls: HIGH - Based on StyleSheet/React Native constraints and user decisions
- Block renaming: MEDIUM - Need to verify current component export names

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - stable domain, token patterns unlikely to change)

**Key findings:**
1. Token infrastructure is complete — migration is mechanical, not architectural
2. ~41 hardcoded values across 8-16 components (manageable scope)
3. Existing components show correct patterns (button.tsx, card.tsx)
4. Main risk is visual regressions from rounding spacing values
5. Block renaming is simpler than expected (files already use `-block` suffix)

**Migration scope estimate:**
- Spacing migration: ~11 occurrences across 8 files
- Radius migration: ~11 occurrences across 8 files
- Typography migration: ~19 occurrences across 8 files
- Block renaming: 7 demo block files + import updates

**Critical success factors:**
1. Visual verification on iOS/Android after each migration pass
2. Atomic commits (spacing → radius → typography → blocks)
3. Type-safe token access (catch errors at compile time)
4. Gap vs padding scale awareness (user noted different scales)
