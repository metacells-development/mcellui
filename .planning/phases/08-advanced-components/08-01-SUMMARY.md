---
phase: 08-advanced-components
plan: 01
subsystem: theme-system
tags: [tokens, design-system, calendar, datetime, form, gallery, pagination, stories, search]
dependencies:
  requires: [06-layout-structure]
  provides: [advanced-component-tokens]
  affects: [08-02, 08-03, 08-04, 08-05]
tech-stack:
  added: []
  patterns: [centralized-tokens, size-variants]
files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
decisions:
  - Icon dotGap uses literal 3px (not in spacing scale - intentional pixel value)
  - Stories fontSize uses xs (12) instead of 11 (closest scale value)
  - ImageGallery closeButtonTop/Android use platform-specific safe area values
  - Pagination simple variant has only gap token (no size variants needed)
metrics:
  tasks: 3
  duration: 3.6
  commits: 3
  files_modified: 1
completed: 2026-01-25
---

# Phase 08 Plan 01: Advanced Component Tokens Summary

Extended core theme system with centralized tokens for 7 advanced components (Calendar, DateTimePicker, Form, ImageGallery, Pagination, Stories, SearchInput).

## What Was Accomplished

### Token Sets Added

**1. calendarTokens** (sm/md variants)
- Day cell sizing (32/40px)
- Typography scale (sm→base, base→md)
- Layout spacing (gap, padding, navButtonPadding)
- Week number width constant

**2. dateTimePickerTokens** (input/sheet/fallback/icon groups)
- Input dimensions (height, padding, iconMarginLeft)
- Sheet layout (borderRadius 20 iOS convention, handle, header, picker)
- Fallback spacing (padding, gap)
- Custom icon dimensions (calendar icon illustration)

**3. formTokens** (item/label/description/message groups)
- Form field layout (marginBottom)
- Label typography (fontSize.base, fontWeight.medium, marginBottom)
- Helper text sizing (description, message both fontSize.sm)

**4. imageGalleryTokens** (grid/fullscreen groups)
- Grid defaults (3 columns, 2px spacing, 1:1 aspect ratio)
- Fullscreen UI (backdrop opacity, close button, page indicators)
- Platform-specific safe areas (iOS: 50, Android: 20)

**5. paginationTokens** (sm/md/lg/simple variants)
- Dot indicators (6/8/10px sizes)
- Button/number sizing (28/36/44px)
- Typography scale (sm/base/md)
- Simple variant gap token

**6. storiesTokens** (sm/md/lg/row variants)
- Concentric ring sizing (outer/inner/avatar dimensions)
- Border width progression (3/3/4px)
- Typography (xs/xs/sm)
- Plus icon sizing (14/18/22px)
- Row layout (paddingHorizontal, gap)

**7. searchInputTokens** (single size)
- Height (componentHeight.md = 44px)
- Padding and icon layout
- Clear button sizing
- Typography (fontSize.md)

### Components Export

All 7 token sets added to components export object:
```typescript
export const components = {
  // ... existing tokens ...
  calendar: calendarTokens,
  dateTimePicker: dateTimePickerTokens,
  form: formTokens,
  imageGallery: imageGalleryTokens,
  pagination: paginationTokens,
  stories: storiesTokens,
  searchInput: searchInputTokens,
  // ...
} as const;
```

## Technical Implementation

### Token Structure Patterns

**Size variant pattern** (calendar, pagination, stories):
```typescript
export const componentTokens = {
  sm: { /* dimensions */ },
  md: { /* dimensions */ },
  lg: { /* dimensions */ },
} as const;
```

**Group-based pattern** (dateTimePicker, imageGallery):
```typescript
export const componentTokens = {
  section1: { /* tokens */ },
  section2: { /* tokens */ },
} as const;
```

**Flat pattern** (searchInput, form):
```typescript
export const componentTokens = {
  token1: value,
  token2: value,
} as const;
```

### Spacing/Typography Integration

All tokens reference core design system values:
- `spacing[0.5]` through `spacing[6]` for layout
- `fontSize.xs` through `fontSize.md` for typography
- `fontWeight.medium` and `fontWeight.semibold` for text emphasis

**Exception:** Icon dotGap uses literal `3` (3px not in spacing scale)

### Platform-Specific Values

DateTimePicker sheet borderRadius: 20 (iOS bottom sheet convention)
ImageGallery closeButtonTop: 50 (iOS safe area) vs 20 (Android)

## Files Modified

**packages/core/src/theme/components.ts** (+122 lines)
- Added 7 complete token sets
- Updated components export object
- All tokens use spacing/fontSize/fontWeight imports

## Deviations from Plan

None - plan executed exactly as written.

## Integration Points

**Consumed by:**
- Plan 08-02: Calendar component migration
- Plan 08-03: DateTimePicker component migration
- Plan 08-04: Form components migration
- Plan 08-05: Gallery/Pagination/Stories/Search migrations

**Dependencies:**
- Core spacing tokens (packages/core/src/theme/spacing.ts)
- Core typography tokens (packages/core/src/theme/typography.ts)
- componentHeight from same file

## Testing & Validation

**TypeScript Compilation:** ✓ Passed (pre-existing ConfigProvider error ignored)

**Token Exports:** ✓ All 7 sets exported in components object

**Import Verification:** ✓ All tokens use spacing/fontSize/fontWeight

## Next Phase Readiness

**Ready for:**
- Calendar component token migration (08-02)
- DateTimePicker component token migration (08-03)
- Form system token migration (08-04)
- Advanced UI component migrations (08-05)

**Blockers:** None

**Risks:** None - all token sets follow established patterns

## Notes

**Token Coverage:**
- 7 component token sets added
- 4 different structural patterns used (size variants, groups, flat, hybrid)
- All advanced Phase 08 components now have centralized tokens

**Pattern Consistency:**
- Size variants use sm/md/lg naming
- Typography tokens reference fontSize.* constants
- Layout tokens reference spacing[*] scale
- Intentional pixel values clearly commented

**Design System Benefits:**
- Single source of truth for advanced component dimensions
- Easy global adjustments via token modifications
- Consistent spacing/typography across all 7 components
- Platform-specific values documented in tokens
