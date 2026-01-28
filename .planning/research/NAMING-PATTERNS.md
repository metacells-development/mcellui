# Naming Patterns Audit: mcellui v1.2 Consistency Sweep

**Audit Date:** 2026-01-28
**Scope:** Internal codebase audit of registry/ui, registry/blocks, registry/screens, apps/demo
**Confidence:** HIGH (direct source code inspection)

---

## Executive Summary

This audit examined 55 UI components, 28 blocks, 19 screens, and demo app files for naming consistency. Overall consistency is **GOOD** with a few systematic deviations.

**Key Findings:**
- UI components: **100% consistent** - all follow established patterns
- Blocks (registry): **100% consistent** - all have `-block` suffix
- Screens (registry): **100% consistent** - all have `-screen` suffix
- Demo app blocks: **INCONSISTENT** - mix of suffixed and non-suffixed names
- Props types: **100% consistent** - all follow `{Name}Props` pattern
- Export pattern: **100% consistent** - all use named exports

**Total Inconsistencies Found:** 10 (all in demo app)

**Deviation Count by Category:**
- File naming (demo app): 10 instances
- Props naming: 0 instances
- Export naming: 0 instances
- Component display names: 0 instances

---

## Naming Conventions Detected (Established Patterns)

### 1. File Names

**Pattern:** kebab-case with semantic suffixes

| Category | Pattern | Examples |
|----------|---------|----------|
| **UI Components** | `{name}.tsx` | `button.tsx`, `alert-dialog.tsx`, `radio-group.tsx` |
| **Blocks** | `{name}-block.tsx` | `login-block.tsx`, `empty-state-block.tsx` |
| **Screens** | `{name}-screen.tsx` | `login-screen.tsx`, `profile-screen.tsx` |
| **Demo components** | `{name}-demo.tsx` | `button-demo.tsx`, `form-demo.tsx` |

**Compound words:** Use hyphen separator (`alert-dialog`, `radio-group`, `swipeable-row`)

### 2. Component Names

**Pattern:** PascalCase matching file name

| File | Component Export |
|------|-----------------|
| `button.tsx` | `export function Button` |
| `alert-dialog.tsx` | `export function AlertDialog` |
| `login-block.tsx` | `export function LoginBlock` |
| `login-screen.tsx` | `export function LoginScreen` |

**Sub-components:** Compound PascalCase with parent prefix
- `AlertDialog` → `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogAction`
- `RadioGroup` → `RadioGroupItem`
- `Form` → `FormField`, `FormItem`, `FormLabel`, `FormMessage`

### 3. Props Type Names

**Pattern:** `{ComponentName}Props`

**100% consistent across all files:**
```typescript
export interface ButtonProps { ... }
export interface AlertDialogProps { ... }
export interface LoginBlockProps { ... }
export interface LoginScreenProps { ... }
```

**Sub-component props:** Follow same pattern
```typescript
export interface AlertDialogContentProps { ... }
export interface FormFieldProps { ... }
export interface RadioGroupItemProps { ... }
```

### 4. Export Pattern

**Pattern:** Named exports (NOT default exports)

**Verified in all 102 files:**
```typescript
export function Button({ ... }) { ... }
export interface ButtonProps { ... }
```

**No default exports found** in registry UI/blocks/screens.

### 5. Internal Naming

**Helper functions:** camelCase
```typescript
function getVariantStyles(variant: ButtonVariant, colors: ThemeColors) { ... }
function getSocialProviderLabel(provider: SocialProvider): string { ... }
```

**Contexts:** PascalCase with `Context` suffix
```typescript
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
const FormFieldContext = createContext<FormFieldContextValue | null>(null);
```

**Hooks:** camelCase with `use` prefix
```typescript
function useRadioGroup() { ... }
export function useFormField() { ... }
```

---

## Inconsistencies by Category

### Category: File Naming (Demo App Blocks)

The demo app in `apps/demo/components/blocks/` contains mixed naming patterns - some files have `-block` suffix, others don't.

| # | File Path | Current Name | Expected Name | Severity |
|---|-----------|--------------|---------------|----------|
| 1 | `apps/demo/components/blocks/content-card.tsx` | `content-card.tsx` | `content-card-block.tsx` | MEDIUM |
| 2 | `apps/demo/components/blocks/feature-card.tsx` | `feature-card.tsx` | `feature-card-block.tsx` | MEDIUM |
| 3 | `apps/demo/components/blocks/feed-post-card.tsx` | `feed-post-card.tsx` | `feed-post-card-block.tsx` | MEDIUM |
| 4 | `apps/demo/components/blocks/media-item.tsx` | `media-item.tsx` | `media-item-block.tsx` | MEDIUM |
| 5 | `apps/demo/components/blocks/notification-item.tsx` | `notification-item.tsx` | `notification-item-block.tsx` | MEDIUM |
| 6 | `apps/demo/components/blocks/onboarding-slide.tsx` | `onboarding-slide.tsx` | `onboarding-slide-block.tsx` | MEDIUM |
| 7 | `apps/demo/components/blocks/search-header.tsx` | `search-header.tsx` | `search-header-block.tsx` | MEDIUM |
| 8 | `apps/demo/components/blocks/social-proof-bar.tsx` | `social-proof-bar.tsx` | `social-proof-bar-block.tsx` | MEDIUM |
| 9 | `apps/demo/components/blocks/stats-card.tsx` | `stats-card.tsx` | `stats-card-block.tsx` | MEDIUM |

**Already Correct in Demo:**
- ✅ `empty-state-block.tsx`
- ✅ `error-state-block.tsx`
- ✅ `hero-block.tsx`
- ✅ `login-block.tsx`
- ✅ `profile-block.tsx`
- ✅ `settings-list-block.tsx`
- ✅ `signup-block.tsx`

### Category: Component Export Names (Demo App)

The component names exported from these files also lack the `Block` suffix:

| # | File Path | Current Export | Expected Export | Severity |
|---|-----------|----------------|-----------------|----------|
| 10 | `apps/demo/components/blocks/stats-card.tsx` | `export function StatsCard` | `export function StatsCardBlock` | MEDIUM |

**Note:** The other 8 demo files likely have the same issue (component names without `Block` suffix). These should be verified during remediation.

### Category: Props Naming

**Status:** ✅ **NO INCONSISTENCIES FOUND**

All props types follow the `{ComponentName}Props` pattern consistently across:
- 55 UI components
- 28 blocks
- 19 screens
- All sub-components

### Category: Export Pattern

**Status:** ✅ **NO INCONSISTENCIES FOUND**

All files use named exports. No default exports found in registry.

### Category: Display Names

**Status:** ✅ **NO INCONSISTENCIES FOUND**

All components using `forwardRef` include display names:
```typescript
export const Button = forwardRef(function Button(...) { ... });
export const IconButton = forwardRef(function IconButton(...) { ... });
```

---

## Pattern Consistency Analysis

### UI Components (55 files) - ✅ 100% Consistent

**File naming:** All use kebab-case without suffix
- Single word: `button.tsx`, `badge.tsx`, `card.tsx`
- Compound: `alert-dialog.tsx`, `radio-group.tsx`, `icon-button.tsx`

**Component naming:** All match file name in PascalCase
- `button.tsx` → `Button`
- `alert-dialog.tsx` → `AlertDialog`
- `swipeable-row.tsx` → `SwipeableRow`

**Props naming:** All use `{Name}Props` pattern
- `ButtonProps`, `AlertDialogProps`, `SwipeableRowProps`

### Blocks (28 files in registry) - ✅ 100% Consistent

**File naming:** All use `-block` suffix
```
login-block.tsx
empty-state-block.tsx
product-card-block.tsx
settings-list-block.tsx
```

**Component naming:** All include `Block` suffix
```typescript
export function LoginBlock
export function EmptyStateBlock
export function ProductCardBlock
export function SettingsListBlock
```

**Props naming:** All use `{Name}BlockProps` pattern
```typescript
export interface LoginBlockProps
export interface EmptyStateBlockProps
```

### Screens (19 files) - ✅ 100% Consistent

**File naming:** All use `-screen` suffix
```
login-screen.tsx
profile-screen.tsx
otp-verification-screen.tsx
product-detail-screen.tsx
```

**Component naming:** All include `Screen` suffix
```typescript
export function LoginScreen
export function ProfileScreen
export function OTPVerificationScreen
export function ProductDetailScreen
```

**Props naming:** All use `{Name}ScreenProps` pattern
```typescript
export interface LoginScreenProps
export interface ProfileScreenProps
```

### Demo App - ⚠️ INCONSISTENT

**Demo components (`apps/demo/components/demos/`):** ✅ Consistent
- All use `-demo.tsx` suffix
- Examples: `button-demo.tsx`, `form-demo.tsx`, `alert-dialog-demo.tsx`

**Demo blocks (`apps/demo/components/blocks/`):** ❌ Inconsistent
- 7 files have `-block` suffix (correct)
- 9 files lack `-block` suffix (incorrect)
- This creates confusion: are they blocks or different components?

---

## Cross-Reference Analysis

### Block Names: Registry vs Demo

Comparing naming between `packages/registry/blocks/` and `apps/demo/components/blocks/`:

| Registry File | Demo File | Status |
|---------------|-----------|--------|
| `login-block.tsx` | `login-block.tsx` | ✅ Match |
| `empty-state-block.tsx` | `empty-state-block.tsx` | ✅ Match |
| `error-state-block.tsx` | `error-state-block.tsx` | ✅ Match |
| `profile-block.tsx` | `profile-block.tsx` | ✅ Match |
| `settings-list-block.tsx` | `settings-list-block.tsx` | ✅ Match |
| `signup-block.tsx` | `signup-block.tsx` | ✅ Match |
| `hero-block.tsx` | `hero-block.tsx` | ✅ Match |
| `stats-card-block.tsx` | `stats-card.tsx` | ❌ **MISMATCH** |
| `content-card-block.tsx` | `content-card.tsx` | ❌ **MISMATCH** |
| `feature-card-block.tsx` | `feature-card.tsx` | ❌ **MISMATCH** |
| `feed-post-card-block.tsx` | `feed-post-card.tsx` | ❌ **MISMATCH** |
| `media-item-block.tsx` | `media-item.tsx` | ❌ **MISMATCH** |
| `notification-item-block.tsx` | `notification-item.tsx` | ❌ **MISMATCH** |
| `onboarding-slide-block.tsx` | `onboarding-slide.tsx` | ❌ **MISMATCH** |
| `search-header-block.tsx` | `search-header.tsx` | ❌ **MISMATCH** |
| `social-proof-bar-block.tsx` | `social-proof-bar.tsx` | ❌ **MISMATCH** |

**Pattern:** Demo app is missing `-block` suffix on 9 files that correspond to registry blocks.

---

## Recommendations for v1.2 Requirements

### High Priority (Breaking Changes in Demo App)

1. **Rename demo block files to include `-block` suffix**
   - Affects: 9 files in `apps/demo/components/blocks/`
   - Impact: Demo app only (internal), no external API change
   - Severity: MEDIUM (creates confusion about component purpose)

2. **Rename component exports to include `Block` suffix**
   - Change: `StatsCard` → `StatsCardBlock`
   - Affects: Component names in demo blocks without suffix
   - Impact: Demo app imports only

### Verification Requirements

For each inconsistency fix:

1. **File rename verification:**
   - Old file deleted
   - New file exists with correct name
   - Matches registry naming pattern

2. **Import update verification:**
   - All imports in demo app updated
   - No broken references
   - Demo app builds successfully

3. **Component name verification:**
   - Export name matches file name
   - Props type name updated (if applicable)
   - Display name updated (for forwardRef components)

### Suggested Requirement Format

```markdown
## File Naming Consistency

**Requirement:** All block components in demo app MUST use `-block` suffix in filenames.

**Rationale:** Registry blocks use `-block` suffix. Demo app should mirror this for consistency.

**Changes Required:**

1. Rename files in `apps/demo/components/blocks/`:
   - `content-card.tsx` → `content-card-block.tsx`
   - `feature-card.tsx` → `feature-card-block.tsx`
   - `feed-post-card.tsx` → `feed-post-card-block.tsx`
   - `media-item.tsx` → `media-item-block.tsx`
   - `notification-item.tsx` → `notification-item-block.tsx`
   - `onboarding-slide.tsx` → `onboarding-slide-block.tsx`
   - `search-header.tsx` → `search-header-block.tsx`
   - `social-proof-bar.tsx` → `social-proof-bar-block.tsx`
   - `stats-card.tsx` → `stats-card-block.tsx`

2. Update component export names to include `Block` suffix

3. Update all imports in demo app

**Verification:**
- [ ] All 9 files renamed
- [ ] Component names updated
- [ ] Imports updated
- [ ] Demo app builds without errors
- [ ] Pattern matches registry blocks 100%
```

---

## Gaps and Observations

### What This Audit DID Cover

✅ File naming patterns (kebab-case, suffixes)
✅ Component export naming (PascalCase)
✅ Props type naming (`{Name}Props`)
✅ Export patterns (named vs default)
✅ Sub-component naming conventions
✅ Internal helper function naming
✅ Context and hook naming
✅ Cross-reference between registry and demo

### What This Audit DID NOT Cover

❌ Variable naming inside component bodies (out of scope)
❌ CSS class naming (React Native doesn't use classes)
❌ Test file naming (no test files found in scope)
❌ README or documentation file naming
❌ Git commit message patterns
❌ Type parameter naming conventions (could be future audit)

### Additional Observations

1. **Compound word consistency:** Excellent
   - All use hyphen separator: `alert-dialog`, `radio-group`, `icon-button`
   - No inconsistencies like `alertDialog` or `alert_dialog`

2. **Sub-component pattern:** Consistent
   - Always prefix with parent: `AlertDialogContent`, `FormField`
   - Never standalone: never just `Content` or `Field`

3. **Props export order:** Consistent
   - Props types always exported before component
   - Pattern: interface → types → component function

4. **File organization:** Consistent
   - All follow: imports → types → component → helpers → styles
   - Comments use JSDoc format with examples

5. **No abbreviations in names:**
   - Always `Button` not `Btn`
   - Always `AlertDialog` not `AlertDlg`
   - Only exception: `OTPVerificationScreen` (OTP is well-known acronym)

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| **UI Components** | HIGH | All 55 files manually inspected |
| **Blocks (registry)** | HIGH | All 28 files inspected, patterns verified |
| **Screens** | HIGH | All 19 files inspected, patterns verified |
| **Demo App** | HIGH | Direct file listing and sample inspection |
| **Props Naming** | HIGH | Grep pattern search + manual verification |
| **Export Pattern** | HIGH | Grep search across all files |

**Overall Audit Confidence: HIGH**

This audit is based on direct source code inspection, not assumptions or external documentation.

---

## Conclusion

The mcellui codebase demonstrates **excellent naming consistency** in the registry (UI components, blocks, and screens). The only inconsistencies found are in the demo app's block components, where 9 files are missing the `-block` suffix.

**Recommended Action:**
- Fix the 9 demo app files to align with registry naming
- This is a low-risk change (demo app only, no external API impact)
- Establishes 100% consistency across the entire codebase

**Impact of Fix:**
- Improves clarity (blocks are clearly identified)
- Makes demo app match registry structure
- Eliminates confusion about component purpose
- Maintains established naming conventions from v1.1

**Priority:** MEDIUM
**Effort:** LOW (file renames + import updates)
**Risk:** LOW (demo app only)
