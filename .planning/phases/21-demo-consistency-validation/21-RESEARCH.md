# Phase 21: Demo Consistency & Validation - Research

**Researched:** 2026-01-28
**Domain:** Demo app token migration and naming standardization
**Confidence:** HIGH

## Summary

Phase 21 migrates the demo app (`apps/demo`) to use the same semantic tokens and naming conventions as the library components (`packages/mcp-server/registry`). This is an internal consistency task that ensures the demo app demonstrates proper token usage and survives dark mode switching without visual breaks.

The demo app has **16 block files**, **58 demo component files**, **5 app screens**, and **4 playground/context files**. Based on grep analysis, there are approximately:
- **~130 hardcoded hex colors** across demo files (excluding intentional gradient/showcase colors)
- **~150 hardcoded fontSize values** across StyleSheets
- **~100 hardcoded gap/padding/margin values** across StyleSheets
- **~20 hardcoded rgba overlays** that need migration

The existing token infrastructure in `@metacells/mcellui-core` is complete: spacing scale (0-32), typography scale (2xs-5xl), and semantic color tokens (30+ colors). Phase 20 established migration patterns for spacing/typography that apply directly here.

**Primary recommendation:** Audit demo files first (report findings), then migrate in passes: colors -> spacing -> typography -> dark mode verification. Focus on blocks first (user-facing), then demos (examples), then app chrome (navigation).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @metacells/mcellui-core | Internal | Theme tokens | Already provides all required tokens |
| React Native StyleSheet | Built-in | Component styling | Demo follows same styling approach as library |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| useTheme hook | Core | Token access | All dynamic styling requiring theme tokens |
| TypeScript | ^5.x | Type safety | All token accesses should be type-checked |

### No New Dependencies
Demo app migration requires no new dependencies. All token infrastructure exists.

## Architecture Patterns

### Recommended Migration Priority
```
1. Blocks (apps/demo/components/blocks/)
   - 16 files, user-facing reusable sections
   - Highest visibility, most important for consistency
   - Files: hero-block, login-block, signup-block, profile-block, etc.

2. Demos (apps/demo/components/demos/)
   - 58 files, example code for each component
   - Medium visibility, shown in component detail screens
   - Lighter standards acceptable (demo code, not production)

3. App Chrome (apps/demo/app/)
   - 5 files: _layout, index, playground, tokens, components/[name]
   - Navigation, root layout, component browser
   - Functional > polished (per user decision)

4. Playground/Context (apps/demo/components/playground/, context/)
   - 4 files: ThemeGrid, ThemeCell, ComponentPreview, ThemeSettingsContext
   - Theme switching UI, already partially uses tokens
```

### Pattern 1: Color Token Migration
**What:** Replace hardcoded hex/rgba colors with semantic tokens from useTheme()
**When to use:** All color properties (backgroundColor, color, borderColor)
**Example:**
```typescript
// Source: Established pattern from Phase 19 research

// BEFORE
const styles = StyleSheet.create({
  container: { backgroundColor: '#ffffff' },
  title: { color: '#171717' },
  subtitle: { color: '#737373' },
  border: { borderColor: '#e5e5e5' },
});

// AFTER
function Component() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>{subtitle}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},  // backgroundColor moved to inline
  title: {},      // color moved to inline
  subtitle: {},   // color moved to inline
});
```

### Pattern 2: Spacing Token Migration
**What:** Replace hardcoded padding/margin/gap with spacing[n] tokens
**When to use:** All spacing properties
**Example:**
```typescript
// Source: Phase 20 research patterns

// BEFORE
const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  header: { marginBottom: 24 },
});

// AFTER
const styles = StyleSheet.create({
  container: { padding: spacing[4], gap: spacing[3] },
  header: { marginBottom: spacing[6] },
});

// Spacing scale reference:
// spacing[1] = 4,  spacing[2] = 8,   spacing[3] = 12
// spacing[4] = 16, spacing[5] = 20,  spacing[6] = 24
// spacing[7] = 28, spacing[8] = 32
```

### Pattern 3: Typography Token Migration
**What:** Replace hardcoded fontSize/fontWeight with typography tokens
**When to use:** All text styling
**Example:**
```typescript
// Source: Phase 20 research patterns

// BEFORE
const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '500' },
});

// AFTER
const { fontSize, fontWeight } = useTheme();
// OR use typography presets
const styles = StyleSheet.create({
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.normal },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
});

// Typography scale reference:
// fontSize['2xs'] = 10, fontSize.xs = 11, fontSize.sm = 12
// fontSize.base = 14,   fontSize.md = 16, fontSize.lg = 18
// fontSize.xl = 20,     fontSize['2xl'] = 24, fontSize['3xl'] = 30
```

### Pattern 4: Intentional Exceptions
**What:** Some hardcoded colors are intentional and should NOT be migrated
**When to keep:**
- Gradient preset colors (decorative)
- Showcase colors (demonstrating color options)
- Component demo colors (showing color prop behavior)
- Contrast text on colored backgrounds (white text on gradient)

**Example intentional exceptions:**
```typescript
// KEEP: Gradient presets (decorative artistic choice)
const meshGradients = {
  purple: [{ colors: ['#667eea', '#764ba2'] }],
  ocean: [{ colors: ['#0093E9', '#80D0C7'] }],
};

// KEEP: Carousel demo showing colored backgrounds
const items = [
  { title: 'Summer Sale', bg: '#FF6B6B' },  // Demo showcase
  { title: 'New Arrivals', bg: '#4ECDC4' }, // Demo showcase
];

// KEEP: Theme selector showing theme preview colors
const themeColors = { zinc: '#71717a', blue: '#3b82f6' };
```

### Anti-Patterns to Avoid
- **Moving ALL colors to inline styles**: Only move dynamic (theme-dependent) colors inline. Static layout properties stay in StyleSheet.
- **Breaking intentional demo showcases**: Color demos showing hardcoded colors are intentional examples.
- **Over-engineering demo code**: Demo files have lighter standards than library. Functional > perfect.
- **Forgetting dark mode test**: Every change must be verified in both light and dark mode.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding hardcoded colors | Manual review | Grep patterns from research | Comprehensive, fast |
| Mapping values to tokens | Custom mapping | Phase 20 reference tables | Already documented |
| Dark mode testing | Automated visual diff | Manual iOS Simulator check | Per user decision, sufficient for demo app |
| Missing tokens | Custom token values | Add to core package if needed | Keeps tokens centralized |

**Key insight:** This is application of established patterns, not new pattern discovery. Use Phase 19/20 research as reference.

## Common Pitfalls

### Pitfall 1: _layout.tsx Has Most Violations
**What goes wrong:** The theme selector modal in _layout.tsx has ~50 hardcoded colors for UI chrome
**Why it happens:** Modal is not wrapped in ConfigProvider, renders with light mode assumptions
**How to avoid:** User decided: "Demo navigation/chrome just needs to work and not break in dark mode"
**Warning signs:** Theme selector shows white background in dark mode
**Mitigation:** Minimal fixes to prevent dark mode breaks, don't pursue perfection

### Pitfall 2: Confusing Demo Showcase vs Real Violations
**What goes wrong:** Migrating hardcoded colors that are intentional demo examples
**Why it happens:** Carousel demo, horizontal-list demo use colored items as showcase
**How to avoid:** Check context - if it's demonstrating component behavior with colors, keep it
**Warning signs:** Demo component no longer shows intended color variation after migration

### Pitfall 3: Typography Rounding Introduces Visual Changes
**What goes wrong:** Mapping fontSize 28 to fontSize['2xl'] (24) changes heading size
**Why it happens:** Not all values fall exactly on the scale
**How to avoid:** Visual comparison before/after. Accept slight changes per Phase 20 decision.
**Warning signs:** Titles look noticeably smaller or larger after migration

### Pitfall 4: Static StyleSheet Needs Runtime Tokens
**What goes wrong:** Putting `colors.foreground` in StyleSheet.create() (evaluated at module load)
**Why it happens:** StyleSheet is static, theme tokens are dynamic
**How to avoid:** Move color/spacing that depends on theme to inline styles with useTheme()
**Warning signs:** TypeScript error or colors don't change with theme switching

### Pitfall 5: Forgetting Dark Mode Verification
**What goes wrong:** Colors look fine in light mode but invisible/clashing in dark mode
**Why it happens:** Development happens primarily in light mode
**How to avoid:** Test every screen in both modes before committing
**Warning signs:** White text on white background, black icons invisible

## Code Examples

Verified patterns from the existing codebase:

### Color Migration (from index.tsx)
```typescript
// Source: apps/demo/app/index.tsx (already uses tokens correctly)
// This file demonstrates correct pattern

export default function Home() {
  const { colors, spacing, radius, platformShadow } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSubtle }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>Components</Text>
      <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>
        Tap a component to see examples
      </Text>
    </ScrollView>
  );
}

// Static layout properties remain in StyleSheet
const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },  // These need migration too
  subtitle: { fontSize: 16 },
});
```

### _layout.tsx Theme Selector (needs migration)
```typescript
// Source: apps/demo/app/_layout.tsx (lines 222-320)
// BEFORE - hardcoded colors
const selectorStyles = StyleSheet.create({
  container: { backgroundColor: '#ffffff' },           // -> colors.background
  title: { color: '#171717' },                         // -> colors.foreground
  closeText: { color: '#3b82f6' },                     // -> colors.primary
  sectionTitle: { color: '#737373' },                  // -> colors.foregroundMuted
  themeOption: { backgroundColor: '#f5f5f5' },         // -> colors.secondary
  themeOptionSelected: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },  // -> colors.primary, colors.primaryMuted
});

// AFTER - semantic tokens (applied inline)
function ThemeSelector() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[selectorStyles.container, { backgroundColor: colors.background }]}>
      <Text style={[selectorStyles.title, { color: colors.foreground }]}>Theme Settings</Text>
      {/* ... */}
    </SafeAreaView>
  );
}
```

### Block Migration (login-block.tsx)
```typescript
// Source: apps/demo/components/blocks/login-block.tsx
// BEFORE
const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16 },
  forgotLink: { fontSize: 14, fontWeight: '500' },
});

// AFTER (typography tokens)
// Note: Block already uses colors correctly via useTheme()
// Only typography needs migration
const styles = StyleSheet.create({
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold },
  subtitle: { fontSize: fontSize.md },
  forgotLink: { fontSize: fontSize.base, fontWeight: fontWeight.medium },
});
```

### Intentional Exception (hero-block.tsx gradients)
```typescript
// Source: apps/demo/components/blocks/hero-block.tsx (lines 54-73)
// KEEP AS-IS - decorative gradient presets, not theme-dependent

const meshGradients: Record<MeshGradientPreset, ...> = {
  purple: [
    { colors: ['#667eea', '#764ba2'], angle: 135 },
    { colors: ['rgba(102,126,234,0.7)', 'rgba(118,75,162,0.3)'], angle: 45 },
  ],
  ocean: [
    { colors: ['#0093E9', '#80D0C7'], angle: 160 },
  ],
  // ... more presets
};

// These are artistic presets, not UI colors. Keep hardcoded.
// Text overlay colors (#FFFFFF, rgba(255,255,255,0.9)) also intentional
// for readability on gradient backgrounds.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded colors in StyleSheet | Dynamic colors via useTheme() | Phase 19 | Dark mode support |
| Hardcoded spacing (16, 24) | spacing[4], spacing[6] tokens | Phase 20 | Theme-responsive spacing |
| Hardcoded fontSize (28, 16) | fontSize['2xl'], fontSize.md | Phase 20 | Typography scale consistency |

**Demo app status:** Partially migrated. Some files (index.tsx) use tokens correctly, others (_layout.tsx, most blocks) have hardcoded values.

## Open Questions

Things that couldn't be fully resolved:

1. **Exact scope of carousel-demo.tsx colors**
   - What we know: Has ~25 hardcoded colors for demo items
   - What's unclear: Which are intentional demo showcases vs actual violations?
   - Recommendation: Treat item background colors as intentional (showing colored cards), migrate only UI chrome colors

2. **Theme selector modal dark mode handling**
   - What we know: Modal uses hardcoded light colors, will look broken in dark mode
   - What's unclear: Does modal need to adapt to dark mode, or is it always light?
   - Recommendation: Make it theme-aware (migrate colors) per user decision "work and not break in dark mode"

3. **Typography precision for title fontSize: 28**
   - What we know: Closest token is fontSize['2xl'] = 24 or fontSize['3xl'] = 30
   - What's unclear: Is 4px difference acceptable?
   - Recommendation: Use fontSize['2xl'] (24), visual test, accept slight change per Phase 20 decision

## Sources

### Primary (HIGH confidence)
- `apps/demo/app/_layout.tsx` - Verified hardcoded colors via direct inspection
- `apps/demo/components/blocks/*.tsx` - 16 files analyzed via grep
- `apps/demo/components/demos/*.tsx` - 58 files confirmed via ls
- `packages/core/src/theme/colors.ts` - Semantic color token definitions
- `packages/core/src/theme/spacing.ts` - Spacing scale (0-32)
- `packages/core/src/theme/typography.ts` - Typography tokens

### Secondary (MEDIUM confidence)
- `.planning/phases/20-spacing-typography-naming/20-RESEARCH.md` - Migration patterns reference
- `.planning/phases/19-critical-color-api-fixes/19-RESEARCH.md` - Color token mapping

### Tertiary (LOW confidence)
- Grep analysis counts (may include comments, unused code, intentional exceptions)

## Metadata

**Confidence breakdown:**
- Color violations: HIGH - Direct grep + file inspection
- Spacing violations: HIGH - Grep patterns verified against files
- Typography violations: HIGH - Grep patterns verified against files
- Intentional exceptions: MEDIUM - Manual analysis of context
- Migration patterns: HIGH - Established in Phase 19/20

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - patterns stable, demo app internal)

## Demo App File Inventory

For planning reference:

### Blocks (16 files) - Priority 1
```
apps/demo/components/blocks/
  content-card-block.tsx
  empty-state-block.tsx
  error-state-block.tsx
  feature-card-block.tsx
  feed-post-card-block.tsx
  hero-block.tsx
  login-block.tsx
  media-item-block.tsx
  notification-item-block.tsx
  onboarding-slide-block.tsx
  profile-block.tsx
  search-header-block.tsx
  settings-list-block.tsx
  signup-block.tsx
  social-proof-bar-block.tsx
  stats-card-block.tsx
```

### App Screens (5 files) - Priority 3
```
apps/demo/app/
  _layout.tsx      # ~50 violations (theme selector)
  index.tsx        # Partially migrated, ~10 typography violations
  playground.tsx   # ~15 violations
  tokens.tsx       # Special case (shows all tokens)
  components/[name].tsx  # ~5 violations
```

### Demos (58 files) - Priority 2
```
apps/demo/components/demos/
  accordion-demo.tsx through typography-demo.tsx
  (See file listing for complete inventory)
```

### Context/Playground (4 files)
```
apps/demo/context/ThemeSettingsContext.tsx
apps/demo/components/playground/ThemeGrid.tsx
apps/demo/components/playground/ThemeCell.tsx
apps/demo/components/playground/ComponentPreview.tsx
```

## Violation Summary

Based on grep analysis:

| Category | Approximate Count | Files Affected |
|----------|-------------------|----------------|
| Hardcoded hex colors (#xxx) | ~130 | ~30 files |
| Hardcoded rgba() | ~20 | ~10 files |
| Hardcoded fontSize | ~150 | ~40 files |
| Hardcoded gap/padding/margin | ~100 | ~35 files |

**Note:** Counts include intentional exceptions. Actual migration scope is smaller after excluding:
- Demo showcase colors (carousel items, etc.)
- Gradient preset colors (hero-block)
- Theme preview colors (theme selector swatches)
- tokens.tsx (shows all tokens, intentionally hardcoded)
