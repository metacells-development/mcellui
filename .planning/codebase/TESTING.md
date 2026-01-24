# Testing Patterns

**Analysis Date:** 2026-01-24

## Test Framework

**Status:** No testing framework currently configured

**Note:** The codebase has no Jest, Vitest, or other test runner configured. No test files (*.test.ts, *.spec.ts) exist in the repository.

**Development Tools Available:**
- `npm run type-check`: TypeScript compilation check
- `npm run lint`: ESLint checks
- `npm run format:check`: Prettier format validation

## Type Checking

**Framework:** TypeScript strict mode

**Configuration:**
- File: `tsconfig.base.json` and `tsconfig.react-native.json`
- Strict checks enabled:
  - `strict: true` - All strict type checking enabled
  - `strictNullChecks: true` - No implicit null/undefined
  - `noUncheckedIndexedAccess: true` - Safe object indexing
  - `noEmit: true` - Type checking only, no output
  - `isolatedModules: true` - Each file can be independently transpiled
  - `noUnusedLocals: implicit` - ESLint catches unused variables
  - `noImplicitAny` - Enforced via ESLint

**Run Commands:**
```bash
npm run type-check              # Run TypeScript checks across all packages
npx tsc --noEmit               # Type check specific package
```

## Linting & Format Verification

**Linter:** ESLint with TypeScript support

**Configuration:** `.eslintrc.js`

**Run Commands:**
```bash
npm run lint                    # Run ESLint checks
npm run format:check            # Verify Prettier formatting
npm run format                  # Auto-format all files
```

## Test Structure

**Current State:** No test framework integrated

**Recommended approach for future:**
- Tests should be co-located with components
- Test file naming: `[component].test.tsx`
- Location alongside source: `packages/registry/ui/__tests__/button.test.tsx` or `packages/registry/ui/button.test.tsx`

## Code Quality Gates

**Type Safety:**
- ESLint rule: `@typescript-eslint/no-explicit-any: 'error'` - No `any` types allowed
- ESLint rule: `@typescript-eslint/no-unused-vars` - Unused variables caught (with `_` prefix allowed)
- Consistent type imports: `@typescript-eslint/consistent-type-imports: 'error'`

**Format Enforcement:**
- Prettier with 100-character line width
- Pre-commit hooks can be set up to enforce (not currently in place)

## Component Interface Validation

**Props Validation:**
- All components use TypeScript interfaces for props (e.g., `ButtonProps extends Omit<PressableProps, 'style'>`)
- Required vs optional props explicitly typed
- Type inference from component context (e.g., `z.infer<typeof schema>` for form data)

**Example prop interface pattern (`packages/registry/ui/button.tsx`):**
```typescript
export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon element (left side) */
  icon?: React.ReactNode;
  // ... more props
}
```

## Mocking

**Current State:** No mocking framework configured

**External Dependencies Handled:**
- Optional dependencies wrapped in try-catch with graceful fallback (e.g., `expo-haptics`)
- Example from `packages/core/src/utils/haptics.ts`:
```typescript
let Haptics: typeof import('expo-haptics') | null = null;

try {
  Haptics = require('expo-haptics');
} catch {
  // expo-haptics not available, haptics will be no-ops
}
```

## Integration Points

**Form Testing Patterns (using existing Form system):**
- Forms use `react-hook-form` with Zod validation
- Schema-based validation: `z.object({ email: z.string().email(), ... })`
- Example from `packages/registry/blocks/login-block.tsx`:
```typescript
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

**Test Data Approach (recommended):**
- Use Zod schema's `parse()` to validate test data
- Create fixture schemas alongside component tests
- Example:
```typescript
const mockLoginData: LoginFormData = {
  email: 'test@example.com',
  password: 'password123',
};
```

## Accessibility Testing

**Current Approach:**
- Manual accessibility validation (iOS VoiceOver, Android TalkBack)
- All components include accessibility props:
  - `accessibilityRole`: Semantic role (e.g., 'button', 'checkbox')
  - `accessibilityLabel`: Descriptive label
  - `accessibilityState`: Current state (disabled, checked, etc.)
  - `accessibilityHint`: Additional context when needed

**Example from `packages/registry/ui/button.tsx`:**
```typescript
<AnimatedPressable
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  {...props}
>
```

## Manual Testing Evidence

**Validation:**
- Components tested on:
  - iOS Simulator + real iOS devices (15+, optimized for 17-18)
  - Android Emulator + real Android devices (API 29+, optimized for 13-14)
  - Expo Go compatibility verified where possible

**Checked in CLAUDE.md:**
> Vor jedem Component-Release:
> - iOS Simulator + Android Emulator getestet
> - VoiceOver + TalkBack zugänglich
> - Dark Mode unterstützt
> - Vollständig TypeScript typisiert (keine `any`)
> - Dokumentation mit Beispiel + Props vorhanden

## Dark Mode Testing

**Validation Pattern:**
- Colors retrieved from `useTheme().colors` which respects system dark mode preference
- Tested through `colorScheme: 'system'` in config and manual toggle
- Demo app includes theme selector for manual verification

**Example from `packages/demo/context/ThemeSettingsContext.tsx`:**
```typescript
export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
  }
  return context;
}
```

## Recommended Testing Framework Setup

**For Future Implementation:**

**Option 1: Jest + React Native Testing Library**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Option 2: Vitest (lighter weight)**
```bash
npm install --save-dev vitest @testing-library/react-native happy-dom
```

**Test Structure (recommended):**
```
packages/registry/
├── ui/
│   ├── button.tsx
│   ├── __tests__/
│   │   └── button.test.tsx
│   ├── checkbox.tsx
│   └── __tests__/
│       └── checkbox.test.tsx
```

## Test Coverage Gaps

**Untested Areas:**
- No unit tests exist for any components
- No integration tests for form submissions
- No animation state verification
- No platform-specific behavior tests

**High Priority for Testing:**
1. Form validation and submission (`packages/registry/ui/form.tsx`)
2. Modal/Dialog state management (open/close)
3. Animation state (press scaling, spring animations)
4. Context hooks error cases (provider missing)
5. Accessibility attributes on interactive components
6. Dark mode color switching

## Performance Testing

**Current Approach:**
- Manual testing during development
- Animation performance checked via Reanimated worklet execution
- No benchmarking framework configured

**Considerations:**
- StyleSheet.create() used for static styles (performance optimized)
- useMemo/useCallback used strategically for complex computations
- Animations use Reanimated worklets for 60 FPS on native thread

## CI/CD Testing

**Status:** Not configured

**GitHub Actions configuration exists** (`.github/workflows/`) but no test CI pipeline documented

**Recommended workflow:**
```yaml
- npm run type-check    # TypeScript validation
- npm run lint          # ESLint validation
- npm run format:check  # Prettier validation
- npm run test          # (once configured) Test runner
```

---

*Testing analysis: 2026-01-24*
