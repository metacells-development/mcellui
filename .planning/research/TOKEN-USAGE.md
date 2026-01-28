# Token Usage Audit: mcellui v1.2 Consistency Sweep

**Audited:** 2026-01-28
**Scope:** All UI components (55), blocks (28), screens (19)
**Total Code:** ~17,000+ lines across registry
**Confidence:** HIGH (direct codebase inspection)

## Executive Summary

Comprehensive audit of mcellui codebase reveals **significant token usage inconsistencies** across all component categories. While the token system is well-designed and comprehensive, many components bypass it in favor of hardcoded values, undermining theming, dark mode support, and visual consistency.

**Key Metrics:**
- **Hardcoded colors:** 100+ instances (hex, rgba)
- **Hardcoded spacing:** 50+ instances (raw pixel values)
- **Hardcoded typography:** 80+ instances (fontSize, fontWeight, lineHeight)
- **Hardcoded radius:** 15+ instances
- **Hardcoded shadows:** 6+ instances with custom values

**Severity Distribution:**
- HIGH (colors — breaks theming/dark mode): ~100 findings
- MEDIUM (spacing/typography — inconsistent UX): ~130 findings
- LOW (radius/shadows — edge cases): ~20 findings

## Token System Overview

The mcellui token system is comprehensive and well-structured:

### Available Tokens

| Category | Tokens | Access Pattern |
|----------|--------|----------------|
| **Colors** | 30+ semantic colors (primary, background, foreground, destructive, success, etc.) | `colors.primary`, `colors.background` |
| **Spacing** | 20 values (0, 0.5, 1-12, 14, 16, 20, 24, 28, 32) | `spacing[4]` = 16px |
| **Radius** | 8 values (none, xs, sm, md, lg, xl, 2xl, full) | `radius.md`, `componentRadius.button` |
| **Typography** | Font sizes (2xs-5xl), weights (100-900), line heights, letter spacing | `fontSize.md`, `fontWeight.semibold` |
| **Shadows** | 6 presets (none, sm, md, lg, xl, 2xl) with platform optimization | `platformShadow('sm')` |
| **Component Tokens** | Per-component sizing (button, input, card, etc.) | `components.button.md.height` |

### Token Access

Components should use `useTheme()` hook:

```tsx
const { colors, spacing, radius, componentRadius, fontSize, fontWeight, platformShadow } = useTheme();
```

## Findings by Category

### 1. Hardcoded Colors (HIGH Severity)

Colors are the most critical issue — they break theming and dark mode support.

#### 1.1 Hex Colors

**Pattern:** `#FFFFFF`, `#000`, `#3B82F6`, etc.

| File | Line(s) | Hardcoded Value | Should Use |
|------|---------|-----------------|------------|
| `ui/avatar-stack.tsx` | 175, 235 | `#ffffff` | `colors.background` or `colors.card` |
| `ui/rating.tsx` | 223 | `#F59E0B` (amber) | `colors.warning` |
| `ui/card.tsx` | 403 | `#ffffff` | `colors.primaryForeground` (overlay text) |
| `ui/stories.tsx` | 95-96 | `#F58529`, `#DD2A7B`, etc. (gradients) | Keep (intentional Instagram gradient) |
| `ui/tag-input.tsx` | 53 | `#000` (icon default) | `colors.foreground` |
| `ui/segmented-control.tsx` | 213 | `#000` (shadow) | Use `platformShadow()` |
| `ui/calendar.tsx` | 53, 61 | `#000` (icon defaults) | `colors.foreground` |
| `ui/tooltip.tsx` | 342 | `#000` (shadow) | Use `platformShadow()` |
| `ui/popover.tsx` | 299 | `#000` (shadow) | Use `platformShadow()` |
| `ui/slider.tsx` | 299 | `#000` (shadow) | Use `platformShadow()` |
| `ui/tabs.tsx` | 342 | `#000` (shadow) | Use `platformShadow()` |
| `ui/pagination.tsx` | 56, 64 | `#000` (icon defaults) | `colors.foreground` |
| `ui/swipeable-row.tsx` | 334 | `#fff` (default text) | `colors.primaryForeground` |

**Blocks:**

| File | Issue | Count |
|------|-------|-------|
| `blocks/hero-block.tsx` | Gradient presets with hardcoded colors | 15+ colors |
| `blocks/review-card-block.tsx` | Icon defaults `#000`, `#fff` | 4 |
| `blocks/feed-post-card-block.tsx` | Icon defaults `#000` | 4 |
| `blocks/pricing-card-block.tsx` | Icon defaults `#000` | 2 |
| `blocks/banner-block.tsx` | Icon defaults `#fff` | 2 |
| `blocks/product-card-block.tsx` | Icon defaults `#000`, `#fff` | 4 |
| `blocks/article-card-block.tsx` | Icon defaults `#000`, `#fff`, overlay colors | 6 |
| `blocks/chat-bubble-block.tsx` | Icon defaults `#fff`, status colors | 3 |
| `blocks/task-item-block.tsx` | Icon defaults + priority colors (`#10b981`, `#f59e0b`, `#ef4444`) | 7 |
| `blocks/event-card-block.tsx` | Icon defaults `#000` | 4 |
| `blocks/media-item-block.tsx` | Icon defaults `#FFFFFF`, `#666666` | 3 |
| `blocks/cart-item-block.tsx` | Icon defaults `#fff`, `#000` | 4 |

**Screens:**

| File | Issue | Count |
|------|-------|-------|
| `screens/login-screen.tsx` | Google icon colors (`#4285F4`, `#34A853`, etc.) | 4 |
| `screens/signup-screen.tsx` | Same Google icon colors + `#FFFFFF` button | 5 |
| `screens/profile-screen.tsx` | `#3B82F6` verified badge | 1 |
| `screens/home-screen.tsx` | `#fff` badge text | 1 |
| `screens/notifications-screen.tsx` | `#fff` action icon | 1 |
| `screens/product-detail-screen.tsx` | `#fff` badge background | 1 |
| All screen icons | Default `#000` for 50+ icon components | 50+ |

#### 1.2 RGBA Colors

**Pattern:** `rgba(0,0,0,0.5)`, `rgba(255,255,255,0.8)`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/toast.tsx` | 272 | `rgba(255,255,255,0.2)` | `colors.backgroundElevated` with opacity |
| `ui/action-sheet.tsx` | 364 | `rgba(0, 0, 0, 0.5)` | `colors.overlay` |
| `ui/datetime-picker.tsx` | 540 | `rgba(0, 0, 0, 0.5)` | `colors.overlay` |
| `ui/image-gallery.tsx` | 336 | `rgba(255,255,255,0.4)` | `colors.background` with opacity |
| `ui/card.tsx` | 408, 621 | `rgba(255,255,255,0.8)`, `rgba(0,0,0,0.4)` | `colors.foreground`/`colors.scrim` |
| `ui/card.tsx` | 637, 644 | `rgba(0,0,0,0.3)` (text shadow) | Use semantic color or remove |

**Blocks:**

| File | Issue |
|------|-------|
| `blocks/hero-block.tsx` | Multiple gradient overlays with hardcoded rgba |
| `blocks/media-item-block.tsx` | `rgba(0,0,0,0.5)`, `rgba(255,255,255,0.8)` overlays |
| `blocks/chat-bubble-block.tsx` | `rgba(255,255,255,0.7)` status colors |
| `blocks/product-card-block.tsx` | `rgba(0,0,0,0.5)` overlay |
| `blocks/article-card-block.tsx` | Multiple rgba overlays for image cards |
| `blocks/banner-block.tsx` | `rgba(0,0,0,0.4)` overlay |
| `blocks/review-card-block.tsx` | `rgba(0,0,0,0.5)` more images overlay |

**Impact:** HIGH — These prevent proper dark mode adaptation. Overlays appear too dark/light depending on theme.

### 2. Hardcoded Spacing (MEDIUM Severity)

**Pattern:** `padding: 16`, `marginLeft: 8`, `gap: 12`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/input.tsx` | 400, 401 | `padding: 4`, `borderRadius: 4` | `spacing[1]` |
| `ui/textarea.tsx` | 270 | `marginLeft: 8` | `spacing[2]` |
| `ui/select.tsx` | 303, 308 | `marginLeft: 8`, `marginTop: 8` | `spacing[2]` |
| `ui/fab.tsx` | 179 | `marginLeft: 8` | `spacing[2]` |
| `ui/toggle.tsx` | 110-124 | `paddingHorizontal: 8/12/16` | Use from `components.toggle` |
| `ui/button.tsx` | 234-235 | `paddingHorizontal: 0`, `paddingVertical: 0` | Fine (explicit reset) |
| `ui/action-sheet.tsx` | 372 | `paddingVertical: 12` | `spacing[3]` |
| `ui/tag-input.tsx` | 515-516 | `paddingVertical: 0`, `paddingHorizontal: 0` | Fine (explicit reset) |
| `ui/radio-group.tsx` | 268 | `marginTop: 2` | `spacing[0.5]` |
| `ui/segmented-control.tsx` | 224 | `paddingHorizontal: 8` | `spacing[2]` |
| `ui/chip.tsx` | 220, 250, 298 | `marginRight: 6`, `marginLeft: 4`, `padding: 2` | `spacing[1.5]`, `spacing[1]`, `spacing[0.5]` |
| `ui/datetime-picker.tsx` | 579 | `marginBottom: 1` | `spacing[0.25]` or remove (too small) |
| `ui/alert.tsx` | 285, 299 | `marginTop: 2`, `padding: 4` | `spacing[0.5]`, `spacing[1]` |
| `ui/card.tsx` | 276, 301 | `paddingTop: 0` | Fine (explicit reset) |

**Impact:** MEDIUM — Inconsistent spacing breaks visual rhythm and makes responsive adjustments harder.

### 3. Hardcoded Typography (MEDIUM Severity)

#### 3.1 Font Sizes

**Pattern:** `fontSize: 14`, `fontSize: 16`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/select.tsx` | 302, 316, 319 | `10`, `16`, `16` | `fontSize.xs`, `fontSize.md` |
| `ui/checkbox.tsx` | 253 | `13` | `fontSize.xs` |
| `ui/toast.tsx` | 306, 310, 314 | `14`, `13`, `13` | `fontSize.base`, `fontSize.xs` |
| `ui/toggle.tsx` | 111, 118, 125 | `12`, `14`, `16` | Use from `components.toggle` |
| `ui/tag-input.tsx` | 524, 527 | `12`, `12` | `fontSize.sm` |
| `ui/calendar.tsx` | 540 | `10` | `fontSize['2xs']` |
| `ui/switch.tsx` | 238 | `13` | `fontSize.xs` |
| `ui/card.tsx` | 635, 642, 663, 668, 673 | `20`, `14`, `11`, `16`, `14` | `fontSize.xl`, `fontSize.base`, `fontSize.xs`, `fontSize.md` |

**Blocks & Screens:** 30+ additional instances in blocks and screens (review-card, chat-bubble, comment-item, pricing-card, etc.)

#### 3.2 Font Weights

**Pattern:** `fontWeight: '600'`, `fontWeight: '500'`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/slider.tsx` | 280, 283 | `'500'`, `'600'` | `fontWeight.medium`, `fontWeight.semibold` |
| `ui/input.tsx` | 382 | `'500'` | `fontWeight.medium` |
| `ui/label.tsx` | 91 | `'400'` | `fontWeight.normal` |
| `ui/card.tsx` | 636, 643, 664, 669 | `'700'`, `'500'`, `'700'`, `'600'` | Use semantic weights |

**Blocks & Screens:** 25+ additional instances

#### 3.3 Line Heights

**Pattern:** `lineHeight: 20`, `lineHeight: 22`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/card.tsx` | 670, 674 | `22`, `20` | Calculate from `fontSize * lineHeight.normal` |
| `ui/datetime-picker.tsx` | 567 | `20` | Calculate from fontSize |
| `ui/alert.tsx` | 295 | `20` | Calculate from fontSize |

**Blocks & Screens:** 20+ additional instances with hardcoded line heights that should be calculated from fontSize tokens.

**Impact:** MEDIUM — Inconsistent typography breaks visual hierarchy and makes font family changes (e.g., switching from Geist to Inter) look broken.

### 4. Hardcoded Border Radius (LOW-MEDIUM Severity)

**Pattern:** `borderRadius: 8`, `borderRadius: 4`, etc.

| File | Line | Hardcoded Value | Should Use |
|------|------|-----------------|------------|
| `ui/image-gallery.tsx` | 505 | `1` | `radius.xs` or remove (too small) |
| `ui/action-sheet.tsx` | 377 | `2` | `radius.xs` |
| `ui/input.tsx` | 401 | `4` | `radius.sm` |
| `ui/chip.tsx` | 299 | `4` | `radius.sm` |
| `ui/alert.tsx` | 302 | `4` | `radius.sm` |
| `ui/calendar.tsx` | 547 | `2` | `radius.xs` |
| `ui/datetime-picker.tsx` | 547, 578, 583, 591 | `2`, `1`, `2`, `1.5` | `radius.xs` |
| `ui/card.tsx` | 419 | `componentRadius.card + 4` | Should calculate properly or use next size up |

**Impact:** LOW-MEDIUM — Breaks visual consistency when user changes radius preset (e.g., from `md` to `lg`). Less critical than colors but still affects polish.

### 5. Hardcoded Shadows (MEDIUM Severity)

**Pattern:** Custom shadow objects with `shadowColor`, `shadowOpacity`, etc.

| File | Line | Issue |
|------|------|-------|
| `ui/tag-input.tsx` | 436-438 | Custom shadow (`#000`, opacity 0.1) |
| `ui/tooltip.tsx` | 342-344 | Custom shadow (`#000`, opacity 0.2) |
| `ui/segmented-control.tsx` | 213-215 | Custom shadow (`#000`, opacity 0.08) |
| `ui/popover.tsx` | 299-301 | Custom shadow (`#000`, opacity 0.15) |
| `ui/tabs.tsx` | 342-344 | Custom shadow (`#000`, opacity 0.05) |
| `ui/slider.tsx` | 299-303 | Custom shadow (`#000`, opacity 0.1) |

**Should Use:** `platformShadow('sm')` or `platformShadow('md')` instead

**Impact:** MEDIUM — Custom shadows don't adapt to dark mode (should have higher opacity in dark mode) and bypass platform-specific optimizations (iOS shadow vs Android elevation).

## Worst Offender Files

Files with the most token violations:

| File | Colors | Spacing | Typography | Radius | Total |
|------|--------|---------|------------|--------|-------|
| `ui/card.tsx` | 8 | 4 | 10 | 1 | **23** |
| `blocks/hero-block.tsx` | 15+ | 2 | 2 | 0 | **19+** |
| `blocks/task-item-block.tsx` | 7 | 3 | 4 | 0 | **14** |
| `blocks/article-card-block.tsx` | 6 | 3 | 4 | 0 | **13** |
| `ui/toggle.tsx` | 0 | 6 | 6 | 0 | **12** |
| `blocks/product-card-block.tsx` | 4 | 2 | 4 | 0 | **10** |
| `ui/datetime-picker.tsx` | 1 | 2 | 1 | 5 | **9** |
| All screens with icons | 50+ | 5 | 10 | 0 | **65+** |

## Pattern Analysis

### Common Anti-Patterns

1. **Icon Component Defaults**
   - **Pattern:** Icon components with `color = '#000'` as default param
   - **Where:** Almost every file with custom SVG icons (50+ files)
   - **Fix:** Default to `colors.foreground` from theme context

2. **Inline Style Objects**
   - **Pattern:** Inline styles with hardcoded values in JSX
   - **Where:** Card variants, overlays, special states
   - **Fix:** Extract to component tokens or calculate from theme

3. **Size Config Objects**
   - **Pattern:** Component-local size configs with hardcoded values
   - **Where:** `toggle.tsx`, custom components without token system
   - **Fix:** Move to `components.ts` token definitions

4. **Shadow Objects**
   - **Pattern:** Custom shadow objects instead of using `platformShadow()`
   - **Where:** 6 UI components
   - **Fix:** Use `platformShadow('sm')` or `platformShadow('md')`

5. **Color Overlays**
   - **Pattern:** `rgba(0,0,0,0.5)` overlays on images
   - **Where:** Card variants, hero blocks, media components
   - **Fix:** Use `colors.overlay` or `colors.scrim` from theme

### Files with Good Token Usage

Examples of components that DO use tokens correctly:

- `ui/button.tsx` — Perfect token usage throughout
- `ui/input.tsx` — Mostly good (only icon button has hardcoded values)
- `ui/avatar.tsx` — Uses all tokens correctly
- `ui/badge.tsx` — Clean token usage
- `ui/progress.tsx` — Exemplary implementation

**Pattern:** These components:
1. Import tokens via `useTheme()`
2. Use component-specific tokens from `components.*`
3. No hardcoded colors/spacing/typography
4. Use `platformShadow()` for shadows

## Recommendations for v1.2 Requirements

Based on this audit, the v1.2 Consistency Sweep should include:

### 1. Color Token Migration (HIGH Priority)

**Requirement:**
```
All color values must use semantic color tokens from useTheme().colors.
Exception: Intentional brand colors (e.g., Google logo, Instagram gradient presets).
```

**Tasks:**
- [ ] Replace all `#000` icon defaults with `colors.foreground`
- [ ] Replace all `#fff` with appropriate semantic colors
- [ ] Replace all `rgba(...)` overlays with `colors.overlay` or `colors.scrim`
- [ ] Convert gradient presets to accept theme colors or document as intentional
- [ ] Update priority colors in task-item-block to use semantic colors

**Estimated Impact:** 100+ files

### 2. Spacing Token Migration (MEDIUM Priority)

**Requirement:**
```
All spacing values (padding, margin, gap) must use spacing tokens.
Explicit resets (e.g., padding: 0) are allowed.
```

**Tasks:**
- [ ] Audit all numeric padding/margin values
- [ ] Replace with `spacing[n]` equivalents
- [ ] Move size configs to `components.ts` token system
- [ ] Document exceptions (when raw values are intentional)

**Estimated Impact:** 50+ instances across 30+ files

### 3. Typography Token Migration (MEDIUM Priority)

**Requirement:**
```
All font sizes, weights, and line heights must use typography tokens.
Line heights should be calculated from fontSize * lineHeight ratio.
```

**Tasks:**
- [ ] Replace hardcoded fontSize with `fontSize.*` tokens
- [ ] Replace hardcoded fontWeight with `fontWeight.*` tokens
- [ ] Calculate line heights from fontSize tokens
- [ ] Remove hardcoded lineHeight values

**Estimated Impact:** 80+ instances across 40+ files

### 4. Radius Token Migration (LOW Priority)

**Requirement:**
```
All borderRadius values must use radius or componentRadius tokens.
Exception: Calculated values (e.g., size/2 for perfect circles).
```

**Tasks:**
- [ ] Replace small hardcoded radius values with `radius.xs` or `radius.sm`
- [ ] Document when calculated radius is intentional (e.g., pill shapes)

**Estimated Impact:** 15+ instances

### 5. Shadow Token Migration (MEDIUM Priority)

**Requirement:**
```
All shadows must use platformShadow() helper for platform optimization and dark mode support.
```

**Tasks:**
- [ ] Replace custom shadow objects with `platformShadow('sm')` or `platformShadow('md')`
- [ ] Verify shadow appearance in dark mode

**Estimated Impact:** 6 components

### 6. Component Token System Extension

**Recommendation:** Add token definitions for components that currently use local configs:

```typescript
// In components.ts
export const toggleTokens = {
  sm: { height: 32, minWidth: 32, paddingHorizontal: spacing[2], fontSize: fontSize.sm },
  md: { height: 40, minWidth: 40, paddingHorizontal: spacing[3], fontSize: fontSize.base },
  lg: { height: 48, minWidth: 48, paddingHorizontal: spacing[4], fontSize: fontSize.md },
};
```

**Files needing token definitions:**
- `toggle.tsx`
- Custom block components with repeated size patterns

### 7. Icon Component Pattern

**Recommendation:** Create shared icon component wrapper:

```typescript
// ui/icon-primitive.tsx
interface IconProps {
  size?: number;
  color?: string;
  children: React.ReactNode;
}

function Icon({ size = 20, color, children }: IconProps) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;

  return React.cloneElement(children, { width: size, height: size, color: finalColor });
}
```

Then icon components can default to theme color without hardcoding `#000`.

## Testing Strategy

After token migration, test these scenarios:

1. **Theme Switch:** Light → Dark → Light (all colors adapt)
2. **Radius Change:** `none` → `md` → `lg` → `full` (all components update)
3. **Custom Theme:** Apply custom color preset (all components reflect new colors)
4. **Platform Differences:** iOS vs Android (shadows render appropriately)
5. **Accessibility:** High contrast mode, increased text size

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Color violations | HIGH | Direct grep + file inspection |
| Spacing violations | HIGH | Direct grep + file inspection |
| Typography violations | HIGH | Direct grep + file inspection |
| Radius violations | MEDIUM | Direct grep (may miss calculated values) |
| Shadow violations | HIGH | Direct grep + file inspection |

## Gaps & Limitations

**Not Audited:**
- Demo app files (outside registry)
- Core package theme definitions (assumed correct)
- CLI and MCP server (not UI-related)

**Potential False Positives:**
- Some hardcoded values may be intentional (e.g., Google logo colors)
- Some calculated values (e.g., `size/2` for circles) are fine
- Icon default params of `#000` are acceptable if always overridden in practice

**Verification Needed:**
- Each finding should be manually verified before migration
- Check if hardcoded value is actually used or always overridden
- Confirm semantic color mapping (e.g., is `#fff` always `primaryForeground`?)

## Next Steps

1. **Triage findings** — Mark intentional exceptions (e.g., brand colors)
2. **Create migration plan** — Prioritize by severity and file
3. **Write automated fixes** — Codemod for common patterns (e.g., `#000` → `colors.foreground`)
4. **Manual migration** — Handle complex cases (overlays, gradients)
5. **Test thoroughly** — All theme combinations and platforms
6. **Document patterns** — Update component guidelines with token usage rules

## Conclusion

The mcellui codebase has a **solid token foundation** but **inconsistent adoption**. The v1.2 Consistency Sweep should focus on:

1. **Color migration** (highest impact — fixes dark mode issues)
2. **Shadow migration** (medium impact — improves platform experience)
3. **Typography migration** (medium impact — prepares for font changes)
4. **Spacing migration** (medium impact — improves consistency)
5. **Radius migration** (low impact — polish)

Estimated effort: **Medium-Large** (100+ files affected, but many are repetitive patterns amenable to automation).

Expected outcome: **Fully themeable, dark-mode-perfect component library** with consistent visual rhythm and easy customization.
