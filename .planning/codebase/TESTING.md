# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Current Status:**
- No automated testing framework configured
- No unit tests, integration tests, or E2E tests present in source code
- Testing is manual only (simulator/emulator verification)

**Why no tests:**
This is a copy-paste component library (shadcn/ui model). Users own the code they copy, so testing is:
1. Part of user responsibility in their apps
2. Done manually across iOS/Android simulators before release
3. Verified via the demo app (`apps/demo/`)

## Quality Assurance Strategy

Instead of automated tests, mcellui uses a rigorous manual testing process documented in CLAUDE.md:

**Before Each Component Release:**
- iOS Simulator testing
- Android Emulator testing
- Accessibility verification (VoiceOver on iOS, TalkBack on Android)
- Dark mode verification
- Full TypeScript type checking

**Configuration for type safety:**
File: `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

Key enforcement:
- `strict: true` - All strict type checks enabled
- `strictNullChecks: true` - Null/undefined must be explicit
- `noUncheckedIndexedAccess: true` - Array access checked
- `noEmit: true` - Type checking only, no output

**Type Checking Command:**
```bash
npm run type-check              # Verify TypeScript across all packages
```

## Demo App as Testing Ground

The demo app (`apps/demo/`) serves as the main testing and validation environment:

**Structure:**
- `apps/demo/app/` - Expo Router pages
- `apps/demo/components/` - Local copies of component source
- `apps/demo/context/` - Theme/settings context

**Running the Demo:**
```bash
npm run dev                     # Start demo in development
npm run ios                     # Run on iOS simulator
npm run android                 # Run on Android emulator
```

**Demo Components:**
Each component has a demo page showing:
- Default variant
- All size variants
- All color/state variants
- Real usage examples
- Props customization

Example files:
- `apps/demo/app/components/[name].tsx` - Dynamic component showcase
- `apps/demo/app/index.tsx` - Component list with links

## Component Verification Checklist

Since testing is manual, each component goes through this workflow:

**Visual Testing:**
- Render in iOS simulator (light + dark modes)
- Render in Android emulator (light + dark modes)
- Check spacing matches design tokens
- Verify colors use theme system
- Test animations (smooth, no jank)

**Interaction Testing:**
- Test all interactive states (pressed, focused, disabled)
- Verify keyboard navigation (where applicable)
- Test async operations (loading states)
- Verify error handling

**Accessibility Testing:**
- iOS: Enable VoiceOver and navigate
- Android: Enable TalkBack and navigate
- Check all text is readable by screen readers
- Verify touch target sizes (min 44pt on iOS)
- Test semantic roles

**Platform-Specific Testing:**
- iOS 15+ support
- Android 10+ (API 29) support
- Test with Expo Go where applicable
- Verify StatusBar behavior

**Type Safety Verification:**
- Run `npm run type-check`
- Verify no `any` types
- Check prop types are strict
- Verify return types are explicit

## Linting as Quality Gate

Linting serves as automated code quality verification:

**ESLint Configuration:**
File: `eslint.config.js`

Strict rules enforced:
- No unused variables (except `_` prefix)
- No `any` types (warn level, but discouraged)
- Consistent type imports
- No duplicate imports
- Prefer const over let

**Run linting:**
```bash
npm run lint                    # Check code style and rules
```

**Run linting on changed files (example):**
```bash
eslint packages/registry/ui/button.tsx
```

## TypeScript Strict Mode

All packages compiled with strict TypeScript settings:

**What strict mode catches:**
- Implicit `any` types
- Null/undefined access without checks
- Unreachable code
- Unused variables
- Inconsistent function returns

**Files requiring strict types:**
- All component source files
- All utility files
- All type definitions

**Example of type strictness:**
From `packages/core/src/utils/cn.ts`:
```typescript
type Style = ViewStyle | TextStyle | ImageStyle;
type StyleInput = Style | Style[] | null | undefined | false;

export function cn(...inputs: StyleInput[]): Style {
  // Explicitly handle all input types
  const styles: Style[] = [];

  for (const input of inputs) {
    if (!input) continue;  // Handles null, undefined, false

    if (Array.isArray(input)) {
      const flattened = StyleSheet.flatten(input);
      if (flattened) styles.push(flattened);
    } else {
      styles.push(input);
    }
  }

  return StyleSheet.flatten(styles);
}
```

## Validation Testing

Components validate input at runtime where necessary:

**Schema Validation Pattern:**
Form components use Zod schemas for validation:

Example from `login-block.tsx`:
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

**Context Validation Pattern:**
Component composition errors thrown at runtime:

From `alert-dialog.tsx`:
```typescript
const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialog');
  }
  return context;
};
```

This catches developer mistakes (using components outside their context).

## Performance Verification

Since no automated performance tests exist, manual verification includes:

**Animation Performance:**
- Use React Native Debugger to check FPS
- Verify 60fps animations (or 120fps on Pro devices)
- Check for jank during interactions

**Memory Usage:**
- Monitor in simulator debugger
- Verify no memory leaks in long-running components
- Check large lists render efficiently

**Bundle Size:**
- Each component is copy-paste, so imported independently
- No unused code in user bundles

## Accessibility Testing Tools

Manual accessibility testing uses:

**iOS VoiceOver:**
- Enable in Settings > Accessibility > VoiceOver
- Navigate with swipe-right for next element
- Swipe-left for previous element
- Double-tap to activate

**Android TalkBack:**
- Enable in Settings > Accessibility > TalkBack
- Swipe-right for next element
- Swipe-left for previous element
- Double-tap to activate

**Testing checklist:**
- All interactive elements have accessible names
- Touch targets meet minimum size (44pt iOS, 48dp Android)
- Color contrast meets WCAG AA standard (4.5:1 minimum)
- Focus indicators visible when using keyboard
- Semantic roles properly assigned

## Test-Driven Development Approach

While no test suite exists, the codebase follows TDD principles:

**Specification First:**
- Components defined in `docs/features/` before implementation
- ADRs document decisions
- Props interfaces specify contract before implementation

**Example: Form System**
- Defined in feature spec
- Props interface defines all behaviors
- Implementation matches spec exactly
- Verified manually on both platforms

## CI/CD Quality Checks

GitHub Actions (or similar) should verify:

**Build validation:**
```bash
npm run build                   # All packages compile
npm run type-check              # No type errors
npm run lint                    # Code style clean
npm run format:check            # Formatting verified
```

**Before merge:**
These commands should pass locally and in CI:
```bash
npm run build
npm run type-check
npm run lint
npm run format:check
```

## No Test Files

The absence of `.test.ts`, `.spec.ts`, or test configuration is intentional:

**Why:**
1. This is a library, not an application
2. Copy-paste model means users test in their own apps
3. Manual testing on both platforms more valuable than unit tests
4. Strict TypeScript catches most issues

**If Testing Were Added:**
If future phases require automated testing, use:
- Framework: Jest or Vitest (React Native compatible)
- Assertion: native testing library or react-native-testing-library
- Mocking: Jest mocks (components, native modules)

Example future structure:
```
packages/registry/
├── ui/
│   ├── button.tsx
│   └── __tests__/
│       └── button.test.tsx
└── blocks/
    ├── login-block.tsx
    └── __tests__/
        └── login-block.test.tsx
```

---

*Testing analysis: 2026-01-26*
