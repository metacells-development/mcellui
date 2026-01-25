# Phase 5: Data Display - Research

**Researched:** 2026-01-25
**Domain:** Data display components (Card, Avatar, Avatar Stack, Badge, Chip, Label, Typography, Rating, Image)
**Confidence:** HIGH

## Summary

This phase focuses on ensuring all data display components use consistent theme tokens and compose cleanly. The codebase audit reveals varying levels of token adoption across these components:

**Gold Standard Components (Card, Avatar, Badge):**
- Card is exemplary: uses `components.card` tokens, `componentRadius.card`, `platformShadow()`, animated press states with `springs.snappy`
- Avatar uses `components.avatar[size]` tokens properly with xs/sm/md/lg/xl size scale
- Badge uses `components.badge[size]` tokens for sm/md/lg, supports multiple variants (default, secondary, destructive, outline, success, warning)

**Components Needing Token Migration (Chip, Label, Rating, AvatarStack, Image):**
- Chip uses inline `SIZE_CONFIG` object with hardcoded values (e.g., `paddingHorizontal: 14`) instead of component tokens
- Label uses inline `sizeTokens` with hardcoded fontSize/lineHeight instead of typography tokens
- Rating uses inline `SIZE_CONFIG` with hardcoded starSize/gap instead of component tokens
- AvatarStack uses inline `SIZE_CONFIG` with hardcoded size/fontSize/borderWidth instead of component tokens
- Image uses `radius.md` directly instead of a componentRadius.image token

**Typography Component Status:**
- Typography already uses `typography` presets from theme correctly
- Provides variant prop mapping to typography tokens (h1, h2, body, caption, etc.)
- H5/H6 variants use hardcoded values instead of typography tokens (should be migrated)

**Primary recommendation:** Create missing component tokens (chip, label, rating, avatarStack, image) in `components.ts`, migrate hardcoded values to token lookups, and ensure all demos use theme tokens (spacing, colors) instead of hardcoded StyleSheet values.

## Standard Stack

The established libraries/tools for data display components:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.1.1 | Animations | Card/Chip/Rating press animations, Image fade-in |
| react-native-svg | 15.x | Icons | Chip close icon, Rating star icons |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @metacells/mcellui-core | current | Theme system | All components - useTheme(), haptic(), platformShadow() |
| expo-haptics | Latest | Tactile feedback | Rating star press, Chip press/dismiss |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Unicode stars in Rating | SVG stars | Unicode is simpler but less customizable; current approach works |
| View-based skeleton | react-native-skeleton-content | Custom skeleton integrated better with theme |

**Installation:**
All dependencies already present in project. No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
Data Display Component/
├── Props interface                  # size, variant, and component-specific props
├── Theme token lookup               # const tokens = components.{component}[size]
├── Size-specific styling            # All dimensions from tokens
├── Color from tokens                # colors.{semantic}, never hardcoded
├── Accessibility props              # accessibilityRole, accessibilityLabel
└── StyleSheet for static styles     # Only layout/position, no colors/sizes
```

### Pattern 1: Component Token Structure
**What:** Define all size-variant tokens in `components.ts`
**When to use:** All components with size prop (sm/md/lg or custom scales)
**Example:**
```typescript
// Source: components.ts - avatarTokens pattern (lines 312-338)
export const avatarTokens = {
  xs: {
    size: 24,
    fontSize: fontSize['2xs'],
    fontWeight: fontWeight.semibold,
  },
  sm: {
    size: 32,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  md: {
    size: 40,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  lg: {
    size: 56,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  xl: {
    size: 80,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
};
```

### Pattern 2: Token Lookup in Component
**What:** Components consume tokens via useTheme().components
**When to use:** Every component with size variants
**Example:**
```typescript
// Source: avatar.tsx (lines 83-84)
const { colors, components, componentRadius, platformShadow } = useTheme();
const tokens = components.avatar[size];

// Apply tokens
<View style={{
  width: tokens.size,
  height: tokens.size,
  borderRadius: componentRadius.avatar,
}}>
  <Text style={{
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
  }} />
</View>
```

### Pattern 3: Badge Variant System
**What:** Consistent variant styles using color tokens
**When to use:** Badge, Chip, and any component with color variants
**Example:**
```typescript
// Source: badge.tsx (lines 200-245)
function getVariantStyles(variant: BadgeVariant, colors: ThemeColors) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary },
        text: { color: colors.primaryForeground },
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary },
        text: { color: colors.secondaryForeground },
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive },
        text: { color: colors.destructiveForeground },
      };
    // All variants use color tokens, never hardcoded
  }
}
```

### Pattern 4: Card as Composition Example
**What:** Card demonstrates clean sub-component composition
**When to use:** Complex components with multiple parts
**Example:**
```typescript
// Source: card.tsx - demonstrates composition pattern
// Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// Each sub-component uses tokens from the same source
const { components, spacing } = useTheme();
const tokens = components.card;

<CardHeader style={{ padding: tokens.headerPadding }} />
<CardContent style={{ padding: tokens.contentPadding }} />
<CardFooter style={{ padding: tokens.footerPadding, gap: spacing[2] }} />
```

### Pattern 5: Typography Token Integration
**What:** Typography presets come from theme, component uses direct mapping
**When to use:** Typography component and any component displaying text
**Example:**
```typescript
// Source: typography.tsx (lines 54-89)
const { colors, typography, fonts } = useTheme();

const getVariantStyle = (): TextStyle => {
  switch (variant) {
    case 'h1': return typography.h1;
    case 'h2': return typography.h2;
    case 'body': return typography.body;
    case 'caption': return typography.caption;
    // All variants map to typography tokens
    default: return typography[variant as TypographyKey] || typography.body;
  }
};
```

### Anti-Patterns to Avoid
- **Inline SIZE_CONFIG objects:** `const SIZE_CONFIG = { sm: { size: 28 }}` - should be in components.ts
- **Hardcoded colors in demos:** `color: '#737373'` - use `colors.foregroundMuted`
- **Direct radius values:** `borderRadius: 8` - use `componentRadius.{component}` or `radius.md`
- **Hardcoded spacing in demos:** `gap: 24` - use `spacing[6]`
- **Missing typography tokens for H5/H6:** Hardcoded `fontSize: 16, fontWeight: '600'` in Typography

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Star rating icons | Complex SVG paths | Unicode stars (current approach) | Simpler, theme-colorable, works cross-platform |
| Image loading state | Custom loading logic | Existing Image component skeleton | Already integrated with theme |
| Avatar initials from name | Custom parsing | getInitials() in AvatarStack | Already handles edge cases (single name, empty) |
| Status indicator colors | Hardcoded color map | getStatusColor() with theme colors | Consistent with theme, supports dark mode |
| Circular border radius | Calculated per-use | componentRadius.avatar (9999) | Centralized, consistent pill radius |

**Key insight:** Most data display components are relatively simple - the complexity is ensuring consistency with theme tokens, not complex logic. Focus effort on token migration, not new features.

## Common Pitfalls

### Pitfall 1: Mixing Inline SIZE_CONFIG with Theme Tokens
**What goes wrong:** Component has local size configs instead of using components.ts
**Why it happens:** Rapid prototyping before token system was established
**How to avoid:**
- Search for `SIZE_CONFIG` or `sizeTokens` in component files
- Move all such objects to `components.ts` with proper token references
- Component should only do `const tokens = components.{component}[size]`
**Warning signs:**
- Hardcoded pixel values in component file
- Component doesn't import from theme tokens
- Size changes require editing component file, not theme

### Pitfall 2: Demo Files Using Hardcoded Styles
**What goes wrong:** Demo StyleSheet has hardcoded colors (#737373), spacing (24), radius (12)
**Why it happens:** Demos written before theme-awareness was prioritized
**How to avoid:**
- Use `useTheme()` in all demo components
- Replace hardcoded colors with `colors.{semantic}`
- Replace hardcoded spacing with `spacing[n]`
- Replace hardcoded radius with `radius.{size}`
**Warning signs:**
- Hex colors in demo StyleSheet
- Numeric literals for padding/margin/gap
- Demo doesn't call useTheme()

### Pitfall 3: Inconsistent Size Scale Names
**What goes wrong:** Avatar uses xs/sm/md/lg/xl but AvatarStack uses sm/md/lg/xl (no xs)
**Why it happens:** Components developed independently
**How to avoid:**
- Audit all size scales in phase
- Standardize: data display components should use xs/sm/md/lg (optional xl)
- Badge/Chip: sm/md/lg (no xs - too small for text)
- Avatar/AvatarStack: xs/sm/md/lg/xl (xs for tiny indicators)
**Warning signs:**
- Size type definitions don't match between related components
- Some sizes work on one component but not another

### Pitfall 4: Missing componentRadius Entries
**What goes wrong:** Component uses `radius.md` directly instead of `componentRadius.{component}`
**Why it happens:** componentRadius wasn't expanded when component was created
**How to avoid:**
- Check `radius.ts` for componentRadius entries for each phase component
- Add missing entries (image, chip) to ComponentRadiusTokens interface
- Update createComponentRadius() function
**Warning signs:**
- Component uses `radius.md` instead of `componentRadius.{name}`
- No entry in ComponentRadiusTokens for the component

### Pitfall 5: Typography H5/H6 Using Hardcoded Values
**What goes wrong:** H5/H6 variants in Typography use inline styles instead of typography tokens
**Why it happens:** typography.ts only defines up to h4, H5/H6 added later
**How to avoid:**
- Add h5/h6 presets to typography.ts
- Update Typography component to use these presets
- Ensure consistent font family (fonts.heading) and weight pattern
**Warning signs:**
- Switch case with hardcoded TextStyle instead of typography[key]
- fontFamily: fonts.heading duplicated in component instead of token

## Code Examples

Verified patterns from official sources:

### Card Token Usage (Gold Standard)
```typescript
// Source: card.tsx (lines 66-108)
export function Card({ children, onPress, disabled, style }: CardProps) {
  const { colors, components, componentRadius, platformShadow, springs } = useTheme();
  const tokens = components.card;
  const scale = useSharedValue(1);

  // Animation using springs from theme
  const handlePressIn = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(0.98, springs.snappy);
    }
  }, [isInteractive, springs.snappy]);

  // Card style using tokens
  const cardStyle = [
    styles.card,
    {
      borderRadius: componentRadius.card,
      borderWidth: tokens.borderWidth,
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    platformShadow('sm'),
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}
```

### Avatar Token Structure
```typescript
// Source: components.ts (lines 312-338) - avatarTokens
// Source: avatar.tsx (lines 74-84) - usage

// In components.ts:
export const avatarTokens = {
  xs: { size: 24, fontSize: fontSize['2xs'], fontWeight: fontWeight.semibold },
  sm: { size: 32, fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  md: { size: 40, fontSize: fontSize.base, fontWeight: fontWeight.semibold },
  lg: { size: 56, fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
  xl: { size: 80, fontSize: fontSize['2xl'], fontWeight: fontWeight.semibold },
};

// In avatar.tsx:
const { colors, components, componentRadius, platformShadow } = useTheme();
const tokens = components.avatar[size];

<View style={{
  width: tokens.size,
  height: tokens.size,
  borderRadius: componentRadius.avatar, // 9999 for circular
  backgroundColor: colors.backgroundMuted,
}}>
  <Text style={{
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    color: colors.primaryForeground,
  }}>
    {fallback}
  </Text>
</View>
```

### Badge with Variant Styles
```typescript
// Source: badge.tsx (lines 57-198)
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  ...
}: BadgeProps) {
  const { colors, components, componentRadius, platformShadow } = useTheme();
  const tokens = components.badge[size];
  const variantStyles = getVariantStyles(variant, colors);

  return (
    <View style={[
      styles.base,
      {
        paddingHorizontal: tokens.paddingHorizontal,
        paddingVertical: tokens.paddingVertical,
        borderRadius: componentRadius.badge, // 9999 for pill shape
      },
      variantStyles.container,
      variant !== 'outline' ? platformShadow('sm') : {},
    ]}>
      <Text style={[
        { fontSize: tokens.fontSize, fontWeight: tokens.fontWeight },
        variantStyles.text,
      ]}>
        {children}
      </Text>
    </View>
  );
}
```

### Demo with Theme Tokens (Target Pattern)
```typescript
// Target pattern for demo files (based on card-demo.tsx)
export function ComponentDemo() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing[6] }]}>
      <View style={[styles.section, { gap: spacing[3] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Section Title</Text>
        {/* Component demos */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},  // gap set dynamically
  section: {},    // gap set dynamically
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    // color set dynamically from theme
  },
});
```

## Token Gaps to Address

Components missing from `components.ts` that need tokens added:

### 1. Chip Tokens (NEW)
```typescript
// Proposed addition to components.ts
export const chipTokens = {
  sm: {
    paddingHorizontal: spacing[2.5],  // was 10
    paddingVertical: spacing[1],       // was 4
    fontSize: fontSize.sm,             // was 12
    iconSize: iconSize.sm,             // was 14
  },
  md: {
    paddingHorizontal: spacing[3.5],  // was 14
    paddingVertical: spacing[1.5],     // was 6
    fontSize: fontSize.base,           // was 14
    iconSize: iconSize.sm,             // was 16
  },
  lg: {
    paddingHorizontal: spacing[4.5],  // was 18 -> spacing[4] + adjustment
    paddingVertical: spacing[2],       // was 8
    fontSize: fontSize.md,             // was 16
    iconSize: iconSize.md,             // was 18
  },
} as const;
```

### 2. Label Tokens (NEW)
```typescript
// Proposed addition to components.ts
export const labelTokens = {
  sm: {
    fontSize: fontSize.sm,      // was 12
    lineHeight: 16,             // 1.33 ratio
    fontWeight: fontWeight.medium,
  },
  md: {
    fontSize: fontSize.base,    // was 14
    lineHeight: 20,             // 1.43 ratio
    fontWeight: fontWeight.medium,
  },
  lg: {
    fontSize: fontSize.md,      // was 16
    lineHeight: 24,             // 1.5 ratio
    fontWeight: fontWeight.medium,
  },
} as const;
```

### 3. Rating Tokens (NEW)
```typescript
// Proposed addition to components.ts
export const ratingTokens = {
  sm: {
    starSize: 18,
    gap: spacing[0.5],  // was 2
  },
  md: {
    starSize: 26,
    gap: spacing[1],    // was 4
  },
  lg: {
    starSize: 34,
    gap: spacing[1.5],  // was 6
  },
} as const;
```

### 4. AvatarStack Tokens (NEW)
```typescript
// Proposed addition to components.ts
export const avatarStackTokens = {
  sm: {
    size: 28,
    fontSize: fontSize['2xs'],    // was 10
    borderWidth: 2,
  },
  md: {
    size: 36,
    fontSize: fontSize.sm,        // was 12
    borderWidth: 2,
  },
  lg: {
    size: 44,
    fontSize: fontSize.base,      // was 14
    borderWidth: 3,
  },
  xl: {
    size: 56,
    fontSize: fontSize.lg,        // was 18
    borderWidth: 3,
  },
} as const;
```

### 5. ComponentRadius Additions (NEW)
```typescript
// Add to ComponentRadiusTokens interface and createComponentRadius()
chip: radiusTokens.lg,  // Pill-like, but not full 9999
image: radiusTokens.md, // Default image border radius
```

### 6. Typography H5/H6 Additions (NEW)
```typescript
// Add to typography.ts createTypography()
h5: {
  fontFamily: fonts.heading,
  fontSize: fontSize.md,        // 16
  fontWeight: fontWeight.semibold,
  lineHeight: fontSize.md * lineHeight.snug,
},
h6: {
  fontFamily: fonts.heading,
  fontSize: fontSize.base,      // 14
  fontWeight: fontWeight.semibold,
  lineHeight: fontSize.base * lineHeight.snug,
},
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline SIZE_CONFIG | components.ts tokens | Phase 1-4 | Some components not migrated yet |
| Hardcoded demo colors | useTheme() colors | Phase 2 | Demos need migration |
| radius.md for components | componentRadius.{name} | Phase 1 | Some components missing entries |
| fontSize numbers | fontSize tokens | Established | Typography/Label partially migrated |

**Deprecated/outdated:**
- Direct `fontSize: 14` in components - use `fontSize.base`
- Direct `borderRadius: 8` - use `radius.md` or `componentRadius.{name}`
- `StyleSheet` colors in demos - use `colors.{semantic}`

## Open Questions

Things that couldn't be fully resolved:

1. **AvatarStack size scale alignment with Avatar**
   - What we know: Avatar has xs/sm/md/lg/xl, AvatarStack has sm/md/lg/xl
   - What's unclear: Should AvatarStack add xs, or is 28px too small for stacks?
   - Recommendation: Keep AvatarStack without xs (stacks typically need readable overflow count)

2. **Image componentRadius decision**
   - What we know: Image currently uses `radius.md` directly
   - What's unclear: Should images have a dedicated componentRadius.image?
   - Recommendation: Add componentRadius.image = radiusTokens.md for consistency

3. **Chip radius: pill vs rounded rectangle**
   - What we know: Chip uses `radius[config.radiusKey]` which maps to md/lg/xl
   - What's unclear: Should chips always be pill-shaped like badges?
   - Recommendation: Keep rounded rectangle (current) - chips are larger, pill looks odd

4. **Typography expansion for complete scale**
   - What we know: H5/H6 are hardcoded, not in typography presets
   - What's unclear: Are display, h1-h6, body, bodySm, bodyLg sufficient?
   - Recommendation: Add h5/h6 to typography.ts for consistency

## Sources

### Primary (HIGH confidence)
- Codebase audit:
  - `/packages/registry/ui/card.tsx` - Gold standard for data display
  - `/packages/registry/ui/avatar.tsx` - Proper token usage example
  - `/packages/registry/ui/badge.tsx` - Variant system example
  - `/packages/registry/ui/chip.tsx` - Needs token migration
  - `/packages/registry/ui/typography.tsx` - Typography preset usage
  - `/packages/registry/ui/rating.tsx` - Needs token migration
  - `/packages/registry/ui/label.tsx` - Needs token migration
  - `/packages/registry/ui/image.tsx` - Needs componentRadius entry
  - `/packages/registry/ui/avatar-stack.tsx` - Needs token migration
  - `/packages/core/src/theme/components.ts` - Token definitions
  - `/packages/core/src/theme/typography.ts` - Typography system
  - `/packages/core/src/theme/radius.ts` - Radius and componentRadius

### Secondary (MEDIUM confidence)
- Phase 1 & 2 research documents - Established patterns
- Demo files - Show current vs target state

### Tertiary (LOW confidence)
- None - all findings from codebase audit

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json
- Architecture: HIGH - Patterns extracted from gold-standard Card/Avatar/Badge
- Pitfalls: HIGH - Identified through code comparison (good vs needs-migration)
- Token gaps: HIGH - Concrete code changes identified from audit
- Open questions: MEDIUM - Design decisions that need team input

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable tech stack, no external dependencies)
