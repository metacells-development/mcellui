# Phase 11: Blocks - E-commerce & Info - Research

**Researched:** 2026-01-25
**Domain:** React Native e-commerce and informational UI blocks
**Confidence:** MEDIUM

## Summary

Phase 11 refines 13 block components for e-commerce and informational use cases. Many blocks already exist in the codebase (Banner, Hero, Pricing Card, Stats Card, Feature Card, Content Card, Social Proof Bar, Media Item, Notification Item, Onboarding Slide, Order Item, Task Item, Search Header), establishing proven patterns. The standard approach uses theme tokens, composition from existing primitives (Button, Card, Avatar, Badge, Rating), inline StyleSheet patterns for blocks, and skeleton loading states for async image/data.

Key findings: Number formatting should use JavaScript's native `Intl.NumberFormat` or simple `.toFixed()` methods (zero dependencies). Image loading states already handled by existing Skeleton component. Block demos follow established Section-based organization patterns from phases 9 and 10.

**Primary recommendation:** Follow established block patterns from ProfileBlock, BannerBlock, and PricingCard - compose from primitives, use centralized tokens for typography/spacing, implement loading states where async data expected.

## Standard Stack

The established libraries/tools for React Native block components:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Native | 0.76+ | UI framework | Project base, StyleSheet API |
| @metacells/mcellui-core | Current | Theme tokens | Centralized design tokens |
| react-native-reanimated | 3.x | Animations | Smooth 60fps animations |
| react-native-svg | Latest | Icons/graphics | Lightweight vector graphics |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | Latest | Form state | Auth blocks with validation |
| zod | Latest | Schema validation | Form validation in blocks |
| @hookform/resolvers | Latest | Form integration | Connect Zod to react-hook-form |

### Number Formatting (Zero Dependencies Preferred)
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| External library | `Intl.NumberFormat` | Native API, no bundle size, locale support |
| External library | `.toFixed()` + string manipulation | Simplest, sufficient for basic currency |
| react-native-currency-input | Native Intl | Only needed for input components, not display |

**Installation:**
```bash
# Core dependencies already in project
# No additional packages needed for number formatting
# Use native JavaScript APIs
```

## Architecture Patterns

### Recommended Project Structure
```
packages/registry/blocks/
├── banner-block.tsx           # Already exists
├── hero-block.tsx             # Already exists
├── pricing-card.tsx           # Already exists
├── stats-card.tsx             # Already exists
├── feature-card.tsx           # Already exists
├── content-card.tsx           # Already exists
├── social-proof-bar.tsx       # Already exists
├── media-item.tsx             # Already exists
├── notification-item.tsx      # Already exists
├── onboarding-slide.tsx       # Already exists
├── order-item.tsx             # Already exists
├── task-item.tsx              # Already exists
└── search-header.tsx          # Already exists
```

### Pattern 1: Block Component Structure (Established Pattern)
**What:** Blocks compose from existing primitives and use centralized tokens
**When to use:** All block components
**Example:**
```typescript
// Source: ProfileBlock (established pattern)
import { useTheme, profileBlockTokens } from '@metacells/mcellui-core';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

export function ExampleBlock({ name, stats, onAction }: ExampleBlockProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing[6] }]}>
      <Text style={[styles.name, {
        color: colors.foreground,
        fontSize: profileBlockTokens.name.fontSize,
        fontWeight: profileBlockTokens.name.fontWeight,
      }]}>
        {name}
      </Text>
      <Button onPress={onAction}>Action</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  name: {
    // fontSize/fontWeight from tokens (inline)
    // color from theme (inline)
  },
});
```

### Pattern 2: Number Formatting (Zero Dependencies)
**What:** Use native JavaScript APIs for currency and number display
**When to use:** Pricing Card, Stats Card, Product Card, Order Item
**Example:**
```typescript
// Source: Research - Native Intl API approach
// Simple approach (current in ProductCard)
const formatPrice = (value: number, currency = '$') => {
  if (value === 0) return 'Free';
  return `${currency}${value.toFixed(2)}`;
};

// Locale-aware approach (recommended for international apps)
const formatCurrency = (value: number, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Stats formatting with abbreviations
const formatStat = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};
```

### Pattern 3: Loading States for Async Data
**What:** Show skeleton or loading UI while data/images load
**When to use:** Hero Block, Feature Card, Onboarding Slide, Media Item
**Example:**
```typescript
// Source: Existing Skeleton component pattern
import { Skeleton } from '../ui/skeleton';

export function ImageBlock({ image, loading }: ImageBlockProps) {
  const { colors, radius } = useTheme();

  if (loading) {
    return (
      <Skeleton
        width="100%"
        height={200}
        radius={radius.lg}
      />
    );
  }

  return (
    <Image
      source={image}
      style={{ width: '100%', height: 200, borderRadius: radius.lg }}
    />
  );
}
```

### Pattern 4: Block Tokens (Centralized Typography)
**What:** Create token object for related block typography/spacing
**When to use:** When multiple blocks share similar patterns
**Example:**
```typescript
// Source: authBlockTokens, stateBlockTokens patterns
export const ecommerceBlockTokens = {
  hero: {
    titleFontSize: fontSize['3xl'],      // 32
    titleFontWeight: fontWeight.bold,
    subtitleFontSize: fontSize.lg,       // 18
  },
  stats: {
    valueFontSize: fontSize['3xl'],      // 32
    valueFontWeight: fontWeight.bold,
    labelFontSize: fontSize.sm,          // 13
  },
  pricing: {
    priceFontSize: 40,                   // Custom large size
    intervalFontSize: fontSize.md,       // 16
  },
} as const;
```

### Anti-Patterns to Avoid
- **Hardcoded spacing/colors:** Use `spacing[4]` and `colors.primary` instead of `16` and `'#007AFF'`
- **External number formatting libraries:** Native APIs sufficient, avoid bundle bloat
- **Static StyleSheet for dynamic values:** Use inline styles with theme tokens for colors/spacing
- **Missing loading states:** All async data should have skeleton/loading UI
- **Inconsistent size scales:** Use established sm/md/lg pattern from existing blocks

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Currency formatting | Custom string builder | `Intl.NumberFormat` or `.toFixed()` | Locale support, decimal handling, thousand separators |
| Skeleton loaders | Custom fade animation | Existing `Skeleton` component | Consistent animation, theme integration |
| Image placeholders | Custom SVG icons | Pattern from ProductCard/ContentCard | Already proven, theme-aware |
| Press animations | Custom Animated.Value | `withSpring` from Reanimated | Smooth native animations, proven pattern |
| Form validation | Custom regex | Zod schemas (auth blocks) | Type-safe, composable, proven in LoginBlock |

**Key insight:** React Native blocks should compose from existing primitives. The codebase already has 27 blocks implemented - extend proven patterns rather than reinventing.

## Common Pitfalls

### Pitfall 1: Inconsistent Number Formatting
**What goes wrong:** Different blocks format numbers differently (some with decimals, some without)
**Why it happens:** No standard formatting function established
**How to avoid:** Create shared formatting utilities in block file or shared utils
**Warning signs:** `.toFixed(2)` in some places, `.toFixed(0)` in others, manual rounding

### Pitfall 2: Missing Loading States
**What goes wrong:** Blocks show empty/broken state while async data loads
**Why it happens:** Loading prop not considered in component design
**How to avoid:** Add `loading?: boolean` prop to blocks expecting async data, render Skeleton
**Warning signs:** User sees empty content briefly before data appears

### Pitfall 3: Hardcoded Typography in Blocks
**What goes wrong:** Font sizes don't scale with theme, inconsistent text hierarchy
**Why it happens:** Copying patterns from demos instead of component implementations
**How to avoid:** Use centralized block tokens (like `authBlockTokens`, `profileBlockTokens`)
**Warning signs:** `fontSize: 16` inline, no token import from core

### Pitfall 4: Not Composing from Primitives
**What goes wrong:** Blocks reinvent button/card/avatar logic
**Why it happens:** Building blocks from scratch instead of composing
**How to avoid:** Import and use Button, Card, Avatar, Badge, etc. from `../ui/`
**Warning signs:** Custom button logic, manual press states, reimplementing existing components

### Pitfall 5: Platform-Specific Image Handling Ignored
**What goes wrong:** Images look different or fail on iOS vs Android
**Why it happens:** Not testing both platforms, using web image patterns
**How to avoid:** Use React Native Image component with proper resizeMode, test both platforms
**Warning signs:** Missing `resizeMode`, no fallback for broken images

## Code Examples

Verified patterns from official sources and existing codebase:

### Currency Display (Simple)
```typescript
// Source: ProductCard.tsx (existing implementation)
const formatPrice = (value: number, currency = '$') => {
  return `${currency}${value.toFixed(2)}`;
};

// Usage
<Text>{formatPrice(149.99)}</Text> // "$149.99"
```

### Currency Display (Locale-Aware)
```typescript
// Source: Research - Intl.NumberFormat API
const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Usage
<Text>{formatCurrency(1234.56, 'EUR', 'de-DE')}</Text> // "1.234,56 €"
```

### Stats Number Abbreviation
```typescript
// Source: Common pattern for social metrics
const formatStat = (value: number): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

// Usage
<Text>{formatStat(1234)}</Text>     // "1.2K"
<Text>{formatStat(1234567)}</Text>  // "1.2M"
```

### Block with Loading State
```typescript
// Source: Pattern from ErrorStateBlock + Skeleton
import { Skeleton } from '../ui/skeleton';

export function StatsCard({ value, label, loading }: StatsCardProps) {
  const { colors, spacing, radius } = useTheme();

  if (loading) {
    return (
      <View style={{ padding: spacing[4] }}>
        <Skeleton width={80} height={40} radius={radius.md} />
        <Skeleton width={60} height={16} radius={radius.sm} style={{ marginTop: spacing[2] }} />
      </View>
    );
  }

  return (
    <View style={{ padding: spacing[4] }}>
      <Text style={{ fontSize: 32, fontWeight: '700', color: colors.foreground }}>
        {value}
      </Text>
      <Text style={{ fontSize: 13, color: colors.foregroundMuted }}>
        {label}
      </Text>
    </View>
  );
}
```

### Image with Skeleton Loading
```typescript
// Source: Research - Moti/Skeleton patterns + React Native Image
import { useState } from 'react';

export function HeroBlock({ image, title, loading }: HeroBlockProps) {
  const { colors, spacing, radius } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View>
      {!imageLoaded && (
        <Skeleton width="100%" height={200} radius={radius.lg} />
      )}
      <Image
        source={image}
        style={{
          width: '100%',
          height: 200,
          borderRadius: radius.lg,
          display: imageLoaded ? 'flex' : 'none',
        }}
        onLoad={() => setImageLoaded(true)}
        resizeMode="cover"
      />
    </View>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded spacing | Theme spacing tokens | Phase 6 (2026-01) | All blocks use consistent spacing |
| Static StyleSheet only | Inline styles + StyleSheet | Phase 9 (2026-01) | Theme values applied dynamically |
| External number format libs | Native Intl API or .toFixed() | Current (2026) | Zero dependencies, smaller bundle |
| Custom skeleton animations | Reanimated 3 Skeleton | Phase 4 (2026-01) | Smooth 60fps, consistent pattern |
| Isolated block files | Compose from primitives | Phase 9 (2026-01) | Blocks reuse Button, Card, Avatar, etc. |

**Deprecated/outdated:**
- External currency formatting libraries (react-native-format-currency, react-currency-format): Native APIs sufficient
- Manual press state animations: Use withSpring from Reanimated
- Hardcoded colors/spacing: Use theme tokens from @metacells/mcellui-core
- Static-only StyleSheet: Combine with inline theme values

## Open Questions

Things that couldn't be fully resolved:

1. **Block Tokens Organization**
   - What we know: Existing patterns use `authBlockTokens`, `stateBlockTokens`, `profileBlockTokens`
   - What's unclear: Should all 13 blocks get individual token objects or group into `ecommerceBlockTokens`?
   - Recommendation: Follow established pattern - related blocks share token object (e.g., Banner + Hero could share)

2. **Loading State Consistency**
   - What we know: ErrorStateBlock shows loading during retry, blocks should support async data
   - What's unclear: Which blocks MUST have loading props vs optional?
   - Recommendation: Add loading prop to: Hero (images), Stats Card (async data), Order Item (fetch status)

3. **Number Formatting Locale Default**
   - What we know: Intl.NumberFormat supports locales, .toFixed() doesn't
   - What's unclear: Should blocks accept locale prop or assume user device locale?
   - Recommendation: Start simple (.toFixed()), upgrade to Intl if international support needed

## Sources

### Primary (HIGH confidence)
- Existing codebase blocks: BannerBlock, ProfileBlock, PricingCard, ProductCard - Verified implementation patterns
- @metacells/mcellui-core theme/components.ts - Centralized token system
- blocks-demo.tsx - Demo organization and Section pattern

### Secondary (MEDIUM confidence)
- [React Fundamentals 2026](https://www.nucamp.co/blog/react-fundamentals-in-2026-components-hooks-react-compiler-and-modern-ui-development) - Hermes V1, React Native performance
- [Intl API for Currency](https://dev.to/josephciullo/simplify-currency-formatting-in-react-a-zero-dependency-solution-with-intl-api-3kok) - Zero-dependency number formatting
- [react-native-currency-input](https://www.npmjs.com/package/react-native-currency-input) - Alternative for input (not display)

### Tertiary (LOW confidence - marked for validation)
- [React Native Elements Skeleton](https://reactnativeelements.com/docs/next/components/skeleton) - Skeleton component patterns (project uses custom Skeleton)
- Web-focused product card tutorials - Not directly applicable to React Native blocks

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in existing codebase
- Architecture: HIGH - Patterns extracted from 27+ existing blocks
- Pitfalls: MEDIUM - Based on common React Native issues, not project-specific verified bugs
- Number formatting: HIGH - Native APIs verified, simple patterns in use

**Research date:** 2026-01-25
**Valid until:** 60 days (stable APIs, mature patterns)
