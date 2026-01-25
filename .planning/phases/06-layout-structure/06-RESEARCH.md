# Phase 6: Layout & Structure - Research

**Researched:** 2026-01-25
**Domain:** React Native layout primitives and composition
**Confidence:** HIGH

## Summary

This phase focuses on refining existing layout components (Separator, Row, Column, Screen, List, Horizontal List, Section Header) to achieve consistent spacing, predictable composition, and proper token usage. The research reveals that most components already exist and use tokens, but several have hardcoded magic numbers that need migration to the token system.

**Key findings:**
- Row and Column already implement semantic gap API (`gap="md"`) with spacing token resolution
- Screen component properly uses safe-area-context and theme tokens for variants
- List component has one hardcoded value: `minHeight: 56` should use `componentHeight.lg`
- List divider inset uses magic number `56px` instead of calculating from icon/avatar size
- Section Header has one hardcoded margin: `marginRight: 16` should use `spacing[4]`
- Demo files contain extensive hardcoded values that need token migration
- React Native 0.81.5 (current version) fully supports flexbox `gap` property (added in 0.71)
- FlatList optimization is well-documented with official React Native guidance

**Primary recommendation:** Migrate the 3 identified hardcoded values to tokens, add LIST_CONSTANTS for standard dimensions, and systematically migrate demo files to use theme tokens throughout.

## Standard Stack

The established libraries/tools for React Native layout components in this codebase:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-safe-area-context | ~5.6.0 | Safe area handling | Industry standard, works with React Navigation, provides useSafeAreaInsets hook |
| react-native-reanimated | ~4.1.1 | Animations | Already established for press animations in List/SectionHeader |
| react-native-gesture-handler | ~2.28.0 | Gestures | Required for HorizontalList snap behavior |
| react-native | 0.81.5 | Core framework | Fully supports flexbox gap property (added in 0.71) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @metacells/mcellui-core | current | Theme system | All components - provides useTheme() hook with spacing/radius/colors |
| react-native-svg | 15.x | Icons | Inline SVG for chevrons in List/SectionHeader |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| FlatList | FlashList (Shopify) | FlashList v2 offers 10x better performance via cell recycling, but requires React Native New Architecture (0.76+), project uses 0.81.5 which doesn't have New Architecture stable yet |
| Manual safe area | react-native-safe-area-context | Library is standard, already integrated, no reason to hand-roll |
| Custom gap logic | Native flexbox gap | Gap property fully supported in RN 0.71+, simpler than margins |

**Installation:**
All dependencies already present in project. No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
Layout Components/
├── primitives/               # Row, Column (composition building blocks)
├── containers/              # Screen (safe area + scroll management)
├── list-components/         # List, ListItem, HorizontalList
├── decorative/              # Separator, Section Header
└── demo-files/              # Demonstrate all composition patterns
```

### Pattern 1: Semantic Gap API with Token Resolution
**What:** Row/Column use semantic names (`xs`, `sm`, `md`) that map to spacing keys
**When to use:** All layout primitives that accept gap/spacing props
**Example:**
```typescript
// Source: Row component (lines 24-39, 82-94)
type GapSemantic = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GapValue = GapSemantic | number;

const semanticGapMap: Record<GapSemantic, number> = {
  'none': 0,
  'xs': 2,    // spacing[2] = 8px
  'sm': 3,    // spacing[3] = 12px
  'md': 4,    // spacing[4] = 16px
  'lg': 6,    // spacing[6] = 24px
  'xl': 8,    // spacing[8] = 32px
  '2xl': 12,  // spacing[12] = 48px
};

function resolveGap(
  value: GapValue | undefined,
  spacing: ReturnType<typeof useTheme>['spacing']
): number | undefined {
  if (value === undefined) return undefined;

  if (typeof value === 'string') {
    const key = semanticGapMap[value as GapSemantic];
    return (spacing as Record<number, number>)[key];
  }

  return (spacing as Record<number, number>)[value];
}

// Usage
<Row gap="md">  {/* 16px */}
<Row gap={6}>   {/* 24px directly from spacing[6] */}
```

### Pattern 2: Shorthand Padding Props
**What:** Row/Column support `p`, `px`, `py` for padding using same gap resolution
**When to use:** Layout containers that need consistent padding API
**Example:**
```typescript
// Source: Row component (lines 70-76)
export interface RowProps {
  p?: GapValue;   // padding (all sides)
  px?: GapValue;  // paddingHorizontal
  py?: GapValue;  // paddingVertical
}

// Applied in component
const resolvedP = resolveGap(p, spacing);
const resolvedPx = resolveGap(px, spacing);
const resolvedPy = resolveGap(py, spacing);

const containerStyle: ViewStyle = {
  ...(resolvedP !== undefined && { padding: resolvedP }),
  ...(resolvedPx !== undefined && { paddingHorizontal: resolvedPx }),
  ...(resolvedPy !== undefined && { paddingVertical: resolvedPy }),
};
```

### Pattern 3: Safe Area Screen Container
**What:** Screen component manages safe area insets with edge control and scroll support
**When to use:** Root container for app screens
**Example:**
```typescript
// Source: Screen component (lines 58-128)
export const Screen = forwardRef<View | ScrollView, ScreenProps>(function Screen({
  scroll = false,
  scrollProps,
  padded = false,
  variant = 'default',
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  contentContainerStyle,
  children,
}, ref) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate safe area padding based on edges
  const safeAreaStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  // Content padding when padded is true
  const paddedStyle: ViewStyle = padded
    ? { paddingHorizontal: spacing[4] }
    : {};

  if (scroll) {
    return (
      <ScrollView
        style={[{ backgroundColor }, safeAreaStyle, style]}
        contentContainerStyle={[{ flexGrow: 1 }, paddedStyle, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaStyle, paddedStyle, style]}>
      {children}
    </View>
  );
});
```

### Pattern 4: FlatList Optimization Configuration
**What:** Standard performance-optimized FlatList setup for large lists
**When to use:** Lists with 50+ items or complex item components
**Example:**
```typescript
// Source: React Native official docs + FeedScreen (lines 304-316)
<FlatList
  data={items}
  renderItem={renderItem}              // useCallback wrapped
  keyExtractor={keyExtractor}           // useCallback wrapped

  // Performance optimizations
  initialNumToRender={10}               // Initial render (covers screen)
  maxToRenderPerBatch={10}              // Items per batch (balance fill rate vs JS time)
  windowSize={10}                       // Viewports to mount (default 21 is too high)
  removeClippedSubviews={true}          // Auto on Android, enable on iOS
  getItemLayout={getItemLayout}         // For uniform item heights (skip async calc)

  // Scroll behavior
  onEndReached={onEndReached}           // Pagination trigger
  onEndReachedThreshold={0.5}           // Trigger at 50% from bottom

  // UI
  refreshControl={refreshControl}       // Pull-to-refresh
  ListFooterComponent={loadingMore ? <LoadingFooter /> : null}
  contentContainerStyle={{ paddingBottom: insets.bottom }}
  showsVerticalScrollIndicator={false}
/>
```

### Pattern 5: Edge-to-Edge Horizontal Lists
**What:** HorizontalList with negative margin to break out of screen padding
**When to use:** Full-width scrollable content (carousels, product grids, stories)
**Example:**
```typescript
// Source: horizontal-list-demo.tsx (lines 17-19)
// Screen has padded={true} which adds spacing[4] horizontal padding
// HorizontalList needs to break out for edge-to-edge scroll

<HorizontalList
  contentInset={16}              // First/last item padding
  itemSpacing={12}               // Gap between items
  style={{ marginHorizontal: -spacing[4] }}  // Counteract screen padding
>
  {items.map(item => (
    <ProductCard key={item.id} style={{ width: 200 }} />
  ))}
</HorizontalList>

// HorizontalList internally handles contentInset:
const inset = contentInset ?? spacing[4];
const gap = itemSpacing ?? spacing[3];

{childArray.map((child, index) => {
  const isFirst = index === 0;
  const isLast = index === childArray.length - 1;

  return (
    <View style={{
      marginLeft: isFirst ? inset : gap,
      marginRight: isLast ? inset : 0,
    }}>
      {child}
    </View>
  );
})}
```

### Pattern 6: List Context for Divider Configuration
**What:** List uses Context to pass divider config to all children
**When to use:** Components that need parent-to-child configuration without prop drilling
**Example:**
```typescript
// Source: List component (lines 121-129, 153-195)
interface ListContextValue {
  showDividers: boolean;
  insetDividers: boolean;
}

const ListContext = createContext<ListContextValue>({
  showDividers: true,
  insetDividers: false,
});

export function List({ children, showDividers = true, insetDividers = false, style }) {
  const childArray = React.Children.toArray(children);

  return (
    <ListContext.Provider value={{ showDividers, insetDividers }}>
      <View style={[styles.list, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {showDividers && index < childArray.length - 1 && (
              <View style={[
                styles.divider,
                {
                  backgroundColor: colors.border,
                  marginLeft: insetDividers ? 56 : 0,  // ISSUE: Hardcoded 56
                },
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </ListContext.Provider>
  );
}
```

### Anti-Patterns to Avoid
- **Hardcoded divider insets:** `marginLeft: 56` instead of calculating from icon size + margin
- **Hardcoded list item heights:** `minHeight: 56` instead of `componentHeight.lg`
- **Demo hardcoded dimensions:** `fontSize: 14` instead of `fontSize.sm`, `gap: 24` instead of `spacing[6]`
- **Negative margins without spacing tokens:** `marginHorizontal: -16` instead of `-spacing[4]`
- **Missing useCallback on FlatList props:** Causes unnecessary re-renders of all items
- **Default windowSize (21):** Too high for most use cases, causes excess memory usage

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Safe area handling | Manual Platform.select for status bar | react-native-safe-area-context useSafeAreaInsets | Handles all devices (notch, Dynamic Island, Android gesture nav), updates on orientation change |
| Divider lines | Custom View with borderTop | Separator component with StyleSheet.hairlineWidth | Cross-platform pixel-perfect lines (1px iOS, varies Android based on density) |
| Flex containers | Inline View with flexDirection | Row/Column components | Consistent gap/padding API, semantic names, type-safe |
| Horizontal scroll with snap | Custom ScrollView logic | HorizontalList with snapEnabled | Handles snap offsets, active index tracking, content insets automatically |
| List performance | ScrollView.map() for large lists | FlatList with optimizations | Virtualization, cell recycling, batch rendering prevents memory issues |
| Section headers in lists | Custom sticky header logic | SectionList with renderSectionHeader | Platform-optimized sticky headers, works with VirtualizedList |

**Key insight:** React Native provides highly optimized list components (FlatList, SectionList) that handle virtualization and recycling. Custom ScrollView.map() patterns work for small lists (< 50 items) but don't scale. The existing layout primitives (Row, Column, Screen) already solve composition problems - use them instead of inline View components.

## Common Pitfalls

### Pitfall 1: Hardcoded Divider Insets Not Scaling with Icon Size
**What goes wrong:** List divider `marginLeft: 56` assumes 24px icon + 32px total margin, breaks when icon size changes
**Why it happens:** Inset calculated manually instead of from actual icon layout
**How to avoid:**
- Define LIST_CONSTANTS with standard icon sizes and margins
- Calculate inset as: `iconSize + leftMargin + iconMargin = 24 + 16 + 12 = 52`
- Or use semantic value: `insetDividers ? spacing[14] : 0` (56px)
- Document the calculation in component comments
**Warning signs:**
- Divider doesn't align with content when icon size changes
- Inset value doesn't match any spacing token

### Pitfall 2: Using ScrollView.map() for Long Lists
**What goes wrong:** Rendering 100+ items with `.map()` causes all items to mount, excessive memory usage
**Why it happens:** ScrollView renders all children immediately, no virtualization
**How to avoid:**
- FlatList for homogeneous data (feed posts, product grid)
- SectionList for grouped data (contacts by letter, settings by category)
- Keep ScrollView.map() only for small, known-size lists (< 20 items)
- Mark with comment if intentionally using ScrollView: `{/* Small list (< 20 items), no virtualization needed */}`
**Warning signs:**
- Slow initial render with many items
- High memory usage that grows with list length
- Janky scrolling with complex item components
- FeedScreen already demonstrates the pattern: `optimized` prop switches between ScrollView and FlatList

### Pitfall 3: Forgetting useCallback on FlatList Props
**What goes wrong:** Every parent re-render recreates renderItem, keyExtractor causing all list items to re-render
**Why it happens:** Inline arrow functions or function definitions in render
**How to avoid:**
- Wrap renderItem in useCallback with proper dependencies
- Wrap keyExtractor in useCallback (usually no dependencies if using item.id)
- Wrap event handlers (onEndReached, onRefresh) in useCallback
**Warning signs:**
```typescript
// BAD - recreated every render
<FlatList
  renderItem={({ item }) => <ItemCard {...item} />}
  keyExtractor={(item) => item.id}
/>

// GOOD - stable references
const renderItem = useCallback(({ item }) => <ItemCard {...item} />, []);
const keyExtractor = useCallback((item) => item.id, []);

<FlatList
  renderItem={renderItem}
  keyExtractor={keyExtractor}
/>
```

### Pitfall 4: Demo Hardcoded Values Breaking Theme Consistency
**What goes wrong:** Demo files use `fontSize: 14`, `gap: 24`, `padding: 16` instead of tokens
**Why it happens:** Quick prototyping without token discipline
**How to avoid:**
- Audit demo files for numeric literals: grep for `\d+` in style objects
- Replace all spacing values with `spacing[n]`
- Replace all font sizes with `fontSize.sm`/`fontSize.base`/etc
- Replace all colors with `colors.foreground`/`colors.border`/etc
- Section component is particularly problematic (lines 23-35 all hardcoded)
**Warning signs:**
- Demos look different from actual components
- Changing theme preset doesn't affect demo styles
- Dark mode has hardcoded light colors (`#737373`)

### Pitfall 5: StyleSheet.hairlineWidth Visibility on Non-Integer Pixel Ratio Devices
**What goes wrong:** Dividers disappear on devices with fractional pixel ratios (e.g., 2.75x)
**Why it happens:** hairlineWidth can round to 0 on certain Android devices
**How to avoid:**
- Always use `StyleSheet.hairlineWidth` for dividers (not `1` or `0.5`)
- Test on physical Android devices, not just simulator (simulators may downscale)
- If invisible, fallback to `Math.max(StyleSheet.hairlineWidth, 1 / PixelRatio.get())`
- Current implementation in Separator and List is correct
**Warning signs:**
- Dividers visible in iOS simulator but invisible on Android device
- Bug reports from users with specific Android models

### Pitfall 6: Edge-to-Edge Lists Without Negative Margin
**What goes wrong:** HorizontalList has contentInset but still has screen padding on sides
**Why it happens:** Screen component adds `padded` prop, HorizontalList is inside
**How to avoid:**
- Use `style={{ marginHorizontal: -spacing[4] }}` on HorizontalList when Screen is padded
- This is intentional pattern (see demos), not a bug
- Document in component: "Use negative margin to break out of padded Screen"
**Warning signs:**
- First/last items in horizontal list have visible padding gap from screen edge
- Design shows edge-to-edge but implementation has white space

## Code Examples

Verified patterns from existing components:

### Complete Row/Column Implementation Pattern
```typescript
// Source: Row component (lines 96-136)
export const Row = forwardRef<View, RowProps>(function Row({
  gap,
  align,
  justify,
  wrap = false,
  flex,
  p,
  px,
  py,
  style,
  children,
  ...props
}, ref) {
  const { spacing } = useTheme();

  const resolvedGap = resolveGap(gap, spacing);
  const resolvedP = resolveGap(p, spacing);
  const resolvedPx = resolveGap(px, spacing);
  const resolvedPy = resolveGap(py, spacing);

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    ...(resolvedGap !== undefined && { gap: resolvedGap }),
    ...(align && { alignItems: alignMap[align] }),
    ...(justify && { justifyContent: justifyMap[justify] }),
    ...(wrap && { flexWrap: 'wrap' }),
    ...(flex !== undefined && { flex }),
    ...(resolvedP !== undefined && { padding: resolvedP }),
    ...(resolvedPx !== undefined && { paddingHorizontal: resolvedPx }),
    ...(resolvedPy !== undefined && { paddingVertical: resolvedPy }),
  };

  return (
    <View ref={ref} style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
});
```

### List Container with Dividers
```typescript
// Source: List component (lines 153-195) - CURRENT PATTERN
export function List({ children, showDividers = true, insetDividers = false, style }) {
  const { colors, radius } = useTheme();
  const childArray = React.Children.toArray(children);

  return (
    <ListContext.Provider value={{ showDividers, insetDividers }}>
      <View style={[
        styles.list,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}>
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {showDividers && index < childArray.length - 1 && (
              <View style={[
                styles.divider,
                {
                  backgroundColor: colors.border,
                  marginLeft: insetDividers ? 56 : 0,  // HARDCODED: Should be LIST_CONSTANTS.dividerInset
                },
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </ListContext.Provider>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,  // CORRECT: Cross-platform pixel-perfect
  },
});
```

### Optimized FlatList with Pull-to-Refresh
```typescript
// Source: FeedScreen (lines 230-316)
const renderPost = useCallback(
  ({ item, index }: { item: FeedPost; index: number }) => (
    <FeedPostCard
      {...item}
      onLike={() => onLike(item.id)}
      showSeparator={index < posts.length - 1}
    />
  ),
  [onLike, posts.length]
);

const keyExtractor = useCallback((item: FeedPost) => item.id, []);

const refreshControl = onRefresh ? (
  <RefreshControl
    refreshing={refreshing}
    onRefresh={handleRefresh}
    tintColor={colors.primary}
  />
) : undefined;

<FlatList
  data={posts}
  renderItem={renderPost}
  keyExtractor={keyExtractor}
  refreshControl={refreshControl}
  onEndReached={onEndReached}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loadingMore ? <LoadingFooter colors={colors} /> : null}
  contentContainerStyle={{ paddingBottom: insets.bottom }}
  showsVerticalScrollIndicator={false}
/>
```

### Section Header Size Variants
```typescript
// Source: SectionHeader component (lines 84-92)
const sizeConfig = {
  sm: { titleSize: 'sm' as const, subtitleSize: 'xs' as const, actionSize: 'xs' as const },
  md: { titleSize: 'lg' as const, subtitleSize: 'sm' as const, actionSize: 'sm' as const },
  lg: { titleSize: 'xl' as const, subtitleSize: 'base' as const, actionSize: 'base' as const },
};

// Applied in render
const config = sizeConfig[size];

<Text style={{
  fontSize: fontSize[config.titleSize],     // Lookup from typography tokens
  fontWeight: fontWeight.semibold,
}}>
  {title}
</Text>
```

### HorizontalList Snap Behavior
```typescript
// Source: HorizontalList component (lines 100-119)
const handleItemLayout = useCallback(
  (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemPositions.current[index] = { x, width };

    // Recalculate snap offsets when all items are measured
    if (itemPositions.current.filter(Boolean).length === childArray.length) {
      const offsets = itemPositions.current.map((pos, index) => {
        if (index === 0) return 0;
        // Snap so previous item is completely off-screen
        const prevItem = itemPositions.current[index - 1];
        return prevItem.x + prevItem.width;
      });
      setSnapOffsets(offsets);
    }
  },
  [childArray.length]
);

<ScrollView
  snapToOffsets={snapEnabled ? snapOffsets : undefined}
  snapToStart={snapEnabled}
  snapToEnd={snapEnabled}
  onLayout={handleItemLayout(index)}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual margin-based gaps | Native flexbox gap property | React Native 0.71 (2023) | Simpler code, no negative margins needed, Row/Column already use it |
| react-native SafeAreaView | react-native-safe-area-context | Industry standard (2020+) | Better control, works with modals, consistent with React Navigation |
| ScrollView for all lists | FlatList/SectionList for long lists | Always available, often underused | Virtualization critical for performance, FeedScreen shows hybrid pattern |
| FlashList recommended | FlashList v2 requires New Architecture | 2025 | Project on RN 0.81.5, New Arch not stable yet, defer FlashList to future |
| getItemLayout optional | getItemLayout strongly recommended | Always available | Uniform height lists get massive perf boost, should be standard pattern |

**Deprecated/outdated:**
- Using `SafeAreaView` from react-native: Replaced by `react-native-safe-area-context` (better control, works everywhere)
- Margin-based spacing in flex containers: Use `gap` property directly (supported since RN 0.71)
- `initialWindowMetrics` for SafeAreaProvider: Optional optimization, not required
- FlashList for this project (RN 0.81.5): Requires New Architecture (RN 0.76+ stable), not ready yet

## Open Questions

Things that couldn't be fully resolved:

1. **List divider inset calculation**
   - What we know: Currently hardcoded as `56px`, should be based on icon size + margins
   - What's unclear: Should this be a LIST_CONSTANT, or calculated dynamically from icon slot width?
   - Recommendation: Add `LIST_CONSTANTS.dividerInset = 56` and `LIST_CONSTANTS.itemMinHeight = 56`, document the calculation (icon 24px + margins)

2. **Demo file token migration scope**
   - What we know: 57 demo files have hardcoded values, extensive migration needed
   - What's unclear: Should demos be migrated in this phase, or separate phase?
   - Recommendation: Migrate only layout-related demo files (6-7 files) in this phase, defer full demo audit to later

3. **FlashList adoption timeline**
   - What we know: FlashList v2 requires React Native New Architecture (0.76+), project is on 0.81.5
   - What's unclear: When will project upgrade to New Architecture?
   - Recommendation: Continue with FlatList optimizations, plan FlashList migration when upgrading to RN 0.76+

4. **Section component token usage**
   - What we know: apps/demo/components/demos/section.tsx has all hardcoded values (fontSize, gap, letterSpacing)
   - What's unclear: Is Section a demo helper or a reusable component?
   - Recommendation: If reusable, migrate to tokens; if demo-only, can remain as-is but note inconsistency

## State of Art: React Native Version Compatibility

**Current Project:** React Native 0.81.5 (Expo SDK 54+)

| Feature | Minimum Version | Current Support | Notes |
|---------|----------------|-----------------|-------|
| Flexbox gap | 0.71 | Fully supported | Row/Column already use it |
| FlatList | 0.43+ | Fully supported | All optimization props available |
| SectionList | 0.43+ | Fully supported | Sticky headers work perfectly |
| Safe Area Context | External lib | 5.6.0 installed | Screen component uses correctly |
| FlashList v2 | 0.76+ (New Arch) | Not supported | RN 0.81.5 doesn't have stable New Arch |
| Reanimated 3 | 0.70+ | 4.1.1 installed | Used for press animations |

## Sources

### Primary (HIGH confidence)
- Existing codebase audit:
  - `/packages/registry/ui/row.tsx` - Semantic gap implementation
  - `/packages/registry/ui/column.tsx` - Semantic gap implementation
  - `/packages/registry/ui/screen.tsx` - Safe area and scroll patterns
  - `/packages/registry/ui/list.tsx` - List container with dividers (hardcoded 56px found)
  - `/packages/registry/ui/horizontal-list.tsx` - Snap scroll implementation
  - `/packages/registry/ui/section-header.tsx` - Size variants with token lookup
  - `/packages/registry/ui/separator.tsx` - hairlineWidth usage
  - `/packages/registry/screens/feed-screen.tsx` - FlatList optimization example
  - `/packages/core/src/theme/spacing.ts` - Spacing token definitions
  - `/packages/core/src/theme/components.ts` - Component token system
- React Native version check: 0.81.5 (from package.json)
- react-native-safe-area-context version: 5.6.0 (from package.json)

### Secondary (MEDIUM confidence)
- [React Native Optimizing FlatList Configuration](https://reactnative.dev/docs/optimizing-flatlist-configuration) - Official performance guidance
- [Expo Safe Area Context Docs](https://docs.expo.dev/versions/latest/sdk/safe-area-context/) - Library integration guide
- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility) - List accessibility roles
- [FlashList v2 Announcement](https://shopify.engineering/flashlist-v2) - 2025 release, New Architecture requirement
- [React Native StyleSheet Docs](https://reactnative.dev/docs/stylesheet) - hairlineWidth behavior

### Tertiary (LOW confidence)
- WebSearch: FlatList optimization blog posts - General patterns, many pre-2024
- WebSearch: Platform-specific padding differences - Mostly addressed by safe-area-context
- Community discussions on FlashList migration - Not applicable yet (need RN 0.76+)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json, versions confirmed
- Architecture patterns: HIGH - Patterns extracted from existing working components
- Hardcoded values identified: HIGH - Direct code audit found exact locations
- FlatList optimizations: HIGH - Official React Native documentation
- FlashList adoption: MEDIUM - Clear requirements (New Arch), unclear project timeline
- Demo migration scope: LOW - Unclear if demos should maintain token discipline

**Identified Issues Requiring Fixes:**

| Component | File | Line | Issue | Fix |
|-----------|------|------|-------|-----|
| List | list.tsx | 186 | `marginLeft: insetDividers ? 56 : 0` | Use LIST_CONSTANTS.dividerInset or spacing[14] |
| List | list.tsx | 423 | `minHeight: ... : 56` | Use componentHeight.lg (56) |
| SectionHeader | section-header.tsx | 241 | `marginRight: 16` | Use spacing[4] |
| Section (demo) | section.tsx | 24-35 | All hardcoded values | Migrate to theme tokens |
| Row Demo | row-demo.tsx | 162-197 | All hardcoded values | Migrate to theme tokens |
| Column Demo | column-demo.tsx | 187-230 | All hardcoded values | Migrate to theme tokens |
| Separator Demo | separator-demo.tsx | 44-78 | All hardcoded values | Migrate to theme tokens |
| Screen Demo | screen-demo.tsx | 172-210 | All hardcoded values | Migrate to theme tokens |
| List Demo | list-demo.tsx | 299-308 | Hardcoded values | Migrate to theme tokens |
| SectionHeader Demo | section-header-demo.tsx | 106-128 | Hardcoded values | Migrate to theme tokens |
| HorizontalList Demo | horizontal-list-demo.tsx | 205-306 | Hardcoded values | Migrate to theme tokens |

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable tech stack, React Native patterns well-established)
