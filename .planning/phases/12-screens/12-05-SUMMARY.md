---
phase: 12-screens
plan: 05
subsystem: screens
tags: [typography, tokens, theme, screens, home, search, followers, onboarding, help]
requires: [12-01]
provides:
  - Content/utility screens with typography tokens
  - Dashboard screen token consistency
  - Search screen token consistency
  - Social list screen token consistency
  - Onboarding flow token consistency
  - Support screen token consistency
affects: [screen-demos, theme-system]
tech-stack:
  added: []
  patterns:
    - Typography token usage in content screens
    - Font size token application in dashboard layouts
    - Font weight token application in search interfaces
    - Line height token usage in onboarding flows
key-files:
  created: []
  modified:
    - packages/registry/screens/home-screen.tsx
    - packages/registry/screens/search-screen.tsx
    - packages/registry/screens/followers-screen.tsx
    - packages/registry/screens/onboarding-screen.tsx
    - packages/registry/screens/help-screen.tsx
decisions: []
metrics:
  duration: 5.3 min
  completed: 2026-01-25
---

# Phase 12 Plan 05: Content/Utility Screens Typography Migration Summary

Typography token migration for content and utility screens - completing token coverage across dashboard, search, lists, onboarding, and support screen types.

## What Was Built

Migrated five content/utility screens to use theme typography tokens consistently:

1. **Home Screen** - Dashboard with stats, hero, and featured content
2. **Search Screen** - Search interface with filters, recent searches, and trending
3. **Followers Screen** - Social connections list with tabs
4. **Onboarding Screen** - Multi-slide onboarding flow
5. **Help Screen** - FAQ and support interface

## Token Migration Details

### Home Screen
- **Greeting text**: `fontSize.xs`
- **User name**: `fontSize.lg` + `fontWeight.semibold`
- **Notification badge**: `fontSize.xs` + `fontWeight.bold`
- **Quick action labels**: `fontSize.xs` + `fontWeight.medium`

### Search Screen
- **Cancel button**: `fontSize.base` + `fontWeight.medium`
- **Results count**: `fontSize.xs`
- **Result titles**: `fontSize.base` + `fontWeight.medium`
- **Result subtitles**: `fontSize.sm`
- **No results message**: `fontSize.base`
- **Recent searches title**: `fontSize.md` + `fontWeight.semibold`
- **Recent search items**: `fontSize.base`
- **Trending title**: `fontSize.md` + `fontWeight.semibold`
- **Trending items**: `fontSize.base` (title), `fontSize.xs` (count)
- **Category titles**: `fontSize.md` + `fontWeight.semibold`
- **Category labels**: `fontSize.sm` + `fontWeight.medium`
- **Clear all link**: `fontSize.sm`

### Followers Screen
- **Header title**: `fontSize.lg` + `fontWeight.semibold`
- Tab labels handled by Tabs component

### Onboarding Screen
- **Slide title**: `fontSize['2xl']` + `fontWeight.bold`
- **Slide description**: `fontSize.base` + `lineHeight.relaxed`
- Skip/Next buttons handled by Button component

### Help Screen
- **Header title**: `fontSize.lg` + `fontWeight.semibold`
- **Section titles** (FAQ, Contact): `fontSize.lg` + `fontWeight.semibold`
- **Category chips**: `fontSize.xs` + `fontWeight.medium`
- **FAQ questions**: `fontSize.base` + `fontWeight.medium`
- **FAQ answers**: `fontSize.sm` + `lineHeight.relaxed`
- **Empty state title**: `fontSize.md` + `fontWeight.semibold`
- **Empty state description**: `fontSize.sm`
- **Contact option labels**: `fontSize.base` + `fontWeight.semibold`
- **Contact option descriptions**: `fontSize.xs`

## File Changes

### Modified Files (5)
1. `packages/registry/screens/home-screen.tsx` - Dashboard screen with typography tokens
2. `packages/registry/screens/search-screen.tsx` - Search interface with typography tokens
3. `packages/registry/screens/followers-screen.tsx` - Social list with typography tokens
4. `packages/registry/screens/onboarding-screen.tsx` - Onboarding flow with typography tokens
5. `packages/registry/screens/help-screen.tsx` - Support screen with typography tokens

## Verification Results

All success criteria met:
- ✅ Home screen has zero hardcoded numeric font sizes
- ✅ Search screen has zero hardcoded numeric font sizes
- ✅ Followers screen has zero hardcoded numeric font sizes
- ✅ Onboarding screen has zero hardcoded numeric font sizes
- ✅ Help screen has zero hardcoded numeric font sizes
- ✅ All screens use fontWeight tokens
- ✅ All migrated screens compile without TypeScript errors

## Task Breakdown

### Task 1: Home and Search Screens (Commit: 971450a)
- Migrated home-screen.tsx to typography tokens
- Migrated search-screen.tsx to typography tokens
- Replaced all hardcoded font sizes with fontSize tokens
- Replaced all font weights with fontWeight tokens
- Verified zero hardcoded numeric font sizes

### Task 2: Followers, Onboarding, Help Screens (Commit: 5ea6302)
- Migrated followers-screen.tsx to typography tokens
- Migrated onboarding-screen.tsx to typography tokens
- Migrated help-screen.tsx to typography tokens
- Added lineHeight tokens for body text
- Replaced all hardcoded font sizes with fontSize tokens
- Replaced all font weights with fontWeight tokens
- Verified zero hardcoded numeric font sizes

## Token Usage Patterns

### Dashboard Pattern (Home Screen)
- Stats use large numbers with bold weight
- Labels use extra small size with muted color
- Section titles use medium size with semibold weight
- Action labels use small size with medium weight

### Search Pattern (Search Screen)
- Section titles use medium size with semibold weight
- Primary items (results, searches) use base size
- Secondary info (counts, subtitles) use small/extra small size
- Interactive elements (cancel, clear) use base size with medium weight

### List Pattern (Followers Screen)
- Header titles use large size with semibold weight
- Tab labels handled by Tabs component for consistency

### Onboarding Pattern (Onboarding Screen)
- Titles use extra large (2xl) size with bold weight
- Descriptions use base size with relaxed line height for readability
- Buttons handled by Button component

### Support Pattern (Help Screen)
- Section headings use large size with semibold weight
- Questions use base size with medium weight
- Answers use small size with relaxed line height
- Category chips use extra small size with medium weight
- Contact info uses base/extra small hierarchy

## Deviations from Plan

None - plan executed exactly as written.

## Impact on System

### Theme System
- Content screens now fully integrated with typography tokens
- Dashboard layouts demonstrate stat/metric typography patterns
- Search interfaces demonstrate filter/result typography patterns
- List screens demonstrate header/item typography patterns
- Onboarding flows demonstrate title/description hierarchy
- Support screens demonstrate FAQ/contact typography patterns

### Screen Architecture
- All five content/utility screens use consistent token access pattern
- Typography hierarchy established for each screen type
- Font weight tokens used for emphasis and hierarchy
- Line height tokens used for body text readability

## Next Phase Readiness

**Blockers**: None

**Recommendations**:
1. Continue screen migrations in parallel for remaining screen types
2. Consider extracting common screen patterns (dashboard stats, search filters, FAQ sections)
3. Add screen-specific token groups if patterns emerge

**Dependencies**: None - other Wave 2 plans can proceed independently

## Performance Notes

**Execution Time**: 5.3 minutes
- Task 1 (Home + Search): ~2.5 min
- Task 2 (Followers + Onboarding + Help): ~2.8 min

**Efficiency**:
- Systematic token replacement across all text elements
- Zero compilation errors after migration
- Clean StyleSheet cleanup (removed all hardcoded typography)

## Lessons Learned

1. **Content screens have rich typography hierarchy** - Dashboard stats, search results, FAQ sections all need varied sizing
2. **Line height matters for body text** - Onboarding descriptions and FAQ answers use relaxed line height for readability
3. **Secondary info uses smaller sizes** - Counts, subtitles, descriptions consistently use sm/xs sizes
4. **Section titles pattern** - Most screens use lg size with semibold weight for major sections
5. **Interactive elements use medium weight** - Cancel buttons, clear links use medium weight for clickability cues

## Quality Checklist

- ✅ All five screens migrated to typography tokens
- ✅ Zero hardcoded numeric font sizes remain
- ✅ All font weights use token references
- ✅ Line height tokens used where appropriate
- ✅ No TypeScript compilation errors
- ✅ StyleSheet cleanup completed (removed unused typography styles)
- ✅ Two atomic commits with clear descriptions
- ✅ Verification tests pass for all screens
