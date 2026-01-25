# Phase 9: Blocks - Auth & Settings - Research

**Researched:** 2026-01-25
**Domain:** React Native authentication and settings UI blocks
**Confidence:** HIGH

## Summary

This phase focuses on refining six existing blocks to meet production-quality standards established in Phases 1-8. The blocks (LoginBlock, SignupBlock, ProfileBlock, SettingsListBlock, EmptyStateBlock, ErrorStateBlock) already exist but need systematic refinement for:

1. **Token alignment** - Replace hardcoded values with theme tokens (spacing, typography, radius, colors)
2. **Form pattern consistency** - Ensure auth blocks use the established Form component patterns from react-hook-form
3. **State coverage** - Add comprehensive loading, error, and disabled states
4. **Accessibility** - Ensure keyboard navigation, focus states, and screen reader support

The blocks compose from existing UI components and should follow the established pattern: tokens → composition → state management.

**Primary recommendation:** Refine blocks systematically using the component token migration pattern established in earlier phases. Each block needs token audit, state coverage verification, and demo expansion.

## Standard Stack

The project has already established its stack. This phase refines existing blocks using these tools:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.54.0 | Form state management | De facto standard for React Native forms, excellent TypeScript support, minimal re-renders |
| @hookform/resolvers | ^3.9.0 | Validation integration | Official bridge between react-hook-form and validation libraries |
| zod | ^3.24.0 | Schema validation | Type-safe validation with excellent TypeScript inference, composable schemas |
| React Native StyleSheet | Built-in | Styling | Native styling approach, better performance than CSS-in-JS |
| @metacells/mcellui-core | Internal | Theme system | Project's established token system |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-reanimated | ~4.1.1 | Animations | Loading states, state transitions |
| react-native-gesture-handler | ~2.28.0 | Touch interactions | Swipeable actions, custom gestures |
| react-native-svg | 15.12.1 | Icons | Empty state icons, error icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hook-form | Formik | Formik has more boilerplate, less performant (re-renders entire form) |
| zod | Yup | Yup has weaker TypeScript inference, less modern API |
| StyleSheet | Styled Components | CSS-in-JS adds runtime overhead, not as performant on native |

**Installation:**
These dependencies are already installed in the project.

## Architecture Patterns

### Recommended Block Structure
```
packages/registry/blocks/
├── login-block.tsx           # Auth block with form validation
├── signup-block.tsx          # Registration with complex validation
├── profile-block.tsx         # User display with stats
├── settings-list-block.tsx   # Grouped settings with switches
├── empty-state-block.tsx     # Placeholder with CTA
└── error-state-block.tsx     # Error display with retry
```

### Pattern 1: Token-First Refactoring
**What:** Replace all hardcoded values with theme tokens
**When to use:** For all existing blocks that use hardcoded spacing, font sizes, colors
**Example:**
```typescript
// Source: Project pattern from phases 1-8
// BAD - Hardcoded values
const styles = StyleSheet.create({
  title: {
    fontSize: 28,      // ❌ Hardcoded
    fontWeight: '700', // ❌ Hardcoded
    marginBottom: 8,   // ❌ Hardcoded
  },
});

// GOOD - Theme tokens
function MyBlock() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  return (
    <Text style={[
      styles.title,
      {
        fontSize: fontSize['3xl'],      // ✅ Token
        fontWeight: fontWeight.bold,    // ✅ Token
        color: colors.foreground,       // ✅ Token
        marginBottom: spacing[2],       // ✅ Token
      }
    ]}>
      {title}
    </Text>
  );
}
```

### Pattern 2: Form Integration with Loading States
**What:** Use Form component with async submit handlers and loading states
**When to use:** LoginBlock, SignupBlock - any block with form submission
**Example:**
```typescript
// Source: apps/demo/components/demos/form-demo.tsx
function LoginBlock({ onSubmit, loading = false }) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form form={form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        onPress={form.handleSubmit(onSubmit)}
        loading={loading}  // ✅ Loading state
      >
        Sign In
      </Button>
    </Form>
  );
}
```

### Pattern 3: Customizable State Blocks
**What:** Empty and error states with flexible content props
**When to use:** EmptyStateBlock, ErrorStateBlock - showing various empty/error scenarios
**Example:**
```typescript
// Source: Existing blocks pattern
interface EmptyStateBlockProps {
  icon?: React.ReactNode;        // Custom icon
  title: string;                 // Required message
  description?: string;          // Optional detail
  actionText?: string;           // CTA text
  onAction?: () => void;         // CTA handler
  compact?: boolean;             // Size variant
}

// Allows composition for different use cases:
<EmptyStateBlock
  icon={<InboxIcon />}
  title="No messages"
  description="You don't have any messages yet."
  actionText="New Message"
  onAction={() => navigate('compose')}
/>
```

### Pattern 4: Settings List with Type Safety
**What:** Type-safe settings items with discriminated unions
**When to use:** SettingsListBlock - various setting types (switch, navigation, button)
**Example:**
```typescript
// Source: packages/registry/blocks/settings-list-block.tsx
type SettingsItem =
  | { type: 'switch'; label: string; value: boolean; onValueChange: (v: boolean) => void }
  | { type: 'navigation'; label: string; onPress: () => void; displayValue?: string }
  | { type: 'button'; label: string; onPress: () => void; variant?: 'destructive' };

// Type-safe rendering:
function renderItem(item: SettingsItem) {
  switch (item.type) {
    case 'switch':
      return <Switch checked={item.value} onCheckedChange={item.onValueChange} />;
    case 'navigation':
      return <Chevron />;
    case 'button':
      return null;
  }
}
```

### Anti-Patterns to Avoid

- **Inconsistent spacing:** Using hardcoded pixel values instead of spacing tokens leads to visual inconsistency across the design system
- **Form state in component state:** Don't use `useState` for form fields - react-hook-form manages this better with validation
- **Missing loading states:** Auth blocks MUST show loading during async operations (Apple/Google may reject apps with poor UX)
- **Inline styles without theme tokens:** Always destructure theme values, never inline hardcoded colors/sizes
- **Typography inconsistency:** Using fontSize directly without typography tokens creates inconsistent text hierarchy

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic with state | react-hook-form + zod | Handles edge cases: field-level validation, async validation, form state management, TypeScript inference |
| Password strength | Custom regex + UI | Zod schema with multiple .regex() rules | Type-safe, composable, clear error messages per rule |
| Empty state layouts | Custom View components per screen | EmptyStateBlock with props | Consistent UX, handles icon sizing, spacing, dark mode automatically |
| Settings list rendering | Manual map() with custom items | SettingsListBlock with typed items | Type-safe, handles separators, grouped sections, platform conventions |
| Error retry logic | Custom error + button state | ErrorStateBlock with retry handler | Handles loading state during retry, error code display, consistent UX |
| Social auth UI | Custom social buttons | Established pattern with variant prop | Platform requirements (Apple requires Sign in with Apple if Google is present) |

**Key insight:** Blocks compose from base components. Don't rebuild Input, Button, Switch - compose them. The block's value is in the layout pattern and prop interface, not reimplementing primitives.

## Common Pitfalls

### Pitfall 1: Token Migration Incompleteness
**What goes wrong:** Blocks partially use tokens but keep some hardcoded values, leading to inconsistent appearance across themes
**Why it happens:** Easy to miss hardcoded values in inline styles or forgot to check all style properties
**How to avoid:**
- Systematic audit: Search codebase for numeric literals in style objects
- Use ESLint rule to flag hardcoded font sizes
- Test with multiple themes (light/dark, different radius settings)
**Warning signs:** Component looks different from design system, doesn't respond to theme changes

### Pitfall 2: Async Validation Without Loading States
**What goes wrong:** Users submit forms repeatedly because there's no visual feedback during submission
**Why it happens:** Form submission is async but loading prop isn't wired to button
**How to avoid:**
```typescript
// Pattern from react-hook-form docs
const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    await api.login(data);
  } finally {
    setIsSubmitting(false);  // Always reset, even on error
  }
};

<Button loading={isSubmitting} onPress={form.handleSubmit(onSubmit)} />
```
**Warning signs:** Double-submissions, users complaining about "broken" forms

### Pitfall 3: Accessibility Oversight
**What goes wrong:** Screen readers can't navigate forms, keyboard navigation doesn't work, focus rings missing
**Why it happens:** Not testing with VoiceOver/TalkBack, assuming visual UI is sufficient
**How to avoid:**
- Test EVERY block with VoiceOver (iOS) and TalkBack (Android)
- Use `accessibilityLabel` on custom icons
- Ensure all interactive elements have min 44pt touch target (iOS HIG requirement)
- Test keyboard navigation on Android (many users rely on this)
**Warning signs:** App rejection from Apple/Google for accessibility violations

### Pitfall 4: Form State vs Component State Confusion
**What goes wrong:** Using `useState` for form fields alongside react-hook-form, causing sync issues
**Why it happens:** Mixing patterns from different examples
**How to avoid:**
- ONLY use react-hook-form for form fields (email, password, name)
- Use `useState` ONLY for loading state, modal visibility, non-form UI state
- If you need field value outside form, use `watch()` from react-hook-form
**Warning signs:** Form values don't persist, validation fires incorrectly, form doesn't clear on reset

### Pitfall 5: Platform-Specific Auth Requirements
**What goes wrong:** App rejected because it has "Sign in with Google" but not "Sign in with Apple" (or vice versa)
**Why it happens:** Not reading Apple/Google platform guidelines
**How to avoid:**
- Apple: If you offer ANY third-party sign-in (Google, Facebook), you MUST also offer Sign in with Apple
- Google: No equivalent requirement, but recommended for consistency
- Make social providers configurable via props: `socialProviders={['google', 'apple']}`
**Warning signs:** App Store rejection with reason "Missing Sign in with Apple"

### Pitfall 6: Error State Without Retry Logic
**What goes wrong:** Error block shows error but retry button doesn't actually retry, or retries without showing loading
**Why it happens:** Forgetting to wire retry handler or manage retry loading state
**How to avoid:**
```typescript
const [retryLoading, setRetryLoading] = useState(false);

const handleRetry = async () => {
  setRetryLoading(true);
  try {
    await refetch();
  } finally {
    setRetryLoading(false);
  }
};

<ErrorStateBlock
  onRetry={handleRetry}
  retryLoading={retryLoading}  // ✅ Show loading during retry
/>
```
**Warning signs:** Users clicking retry multiple times, no visual feedback

## Code Examples

Verified patterns from project codebase:

### Auth Block with Form Integration
```typescript
// Source: packages/registry/blocks/login-block.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginBlock({ onSubmit, loading = false }) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Form form={form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            onPress={form.handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
          >
            Sign in
          </Button>
        </Form>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### Settings List with Grouped Sections
```typescript
// Source: packages/registry/blocks/settings-list-block.tsx
export interface SettingsGroup {
  title?: string;
  description?: string;
  items: SettingsItem[];
}

export function SettingsListBlock({ groups }: { groups: SettingsGroup[] }) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View>
      {groups.map((group, index) => (
        <View key={index} style={{ marginBottom: spacing[6] }}>
          {group.title && (
            <Text style={{
              fontSize: fontSize.xs,  // ✅ Token
              fontWeight: fontWeight.semibold,  // ✅ Token
              color: colors.foregroundMuted,  // ✅ Token
              paddingHorizontal: spacing[4],  // ✅ Token
            }}>
              {group.title.toUpperCase()}
            </Text>
          )}

          <View style={{
            backgroundColor: colors.card,  // ✅ Token
            borderRadius: radius.lg,  // ✅ Token
            marginTop: spacing[2],  // ✅ Token
          }}>
            {group.items.map((item, i) => (
              <React.Fragment key={i}>
                <SettingsItemComponent item={item} />
                {i < group.items.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
```

### Empty State with Customization
```typescript
// Source: packages/registry/blocks/empty-state-block.tsx
export function EmptyStateBlock({
  icon,
  title,
  description,
  actionText,
  onAction,
  compact = false,
}: EmptyStateBlockProps) {
  const { colors, spacing, fontSize, fontWeight } = useTheme();

  return (
    <View style={{
      padding: compact ? spacing[6] : spacing[10],  // ✅ Responsive spacing
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {icon && (
        <View style={{
          backgroundColor: colors.backgroundMuted,  // ✅ Token
          width: compact ? 64 : 80,
          height: compact ? 64 : 80,
          borderRadius: compact ? 32 : 40,
          marginBottom: spacing[4],  // ✅ Token
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </View>
      )}

      <Text style={{
        fontSize: compact ? fontSize.lg : fontSize.xl,  // ✅ Responsive typography
        fontWeight: fontWeight.semibold,  // ✅ Token
        color: colors.foreground,  // ✅ Token
        marginBottom: spacing[2],  // ✅ Token
        textAlign: 'center',
      }}>
        {title}
      </Text>

      {description && (
        <Text style={{
          fontSize: compact ? fontSize.base : fontSize.md,  // ✅ Responsive
          color: colors.foregroundMuted,  // ✅ Token
          marginBottom: spacing[6],  // ✅ Token
          textAlign: 'center',
        }}>
          {description}
        </Text>
      )}

      {actionText && onAction && (
        <Button onPress={onAction}>{actionText}</Button>
      )}
    </View>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Formik for forms | react-hook-form | 2021-2022 | Better performance (fewer re-renders), better TypeScript support |
| Yup validation | Zod validation | 2022-2023 | Type inference from schemas, more composable, modern API |
| Hardcoded spacing | Spacing tokens | Phase 1-3 (2026) | Consistent spacing, easy theme customization |
| Hardcoded font sizes | Typography tokens | Phase 1-3 (2026) | Consistent text hierarchy, responsive typography |
| Custom error/empty components | Reusable blocks | Phase 4 (2026) | Consistency, less code duplication |

**Deprecated/outdated:**
- **AsyncStorage for auth tokens**: Not secure (data not encrypted). Use expo-secure-store or platform keychain
- **Custom keyboard avoidance**: Use KeyboardAvoidingView with proper behavior prop (iOS: 'padding', Android: 'height')
- **Direct platform checks for styling**: Use theme system that handles platform differences

## Open Questions

Things that couldn't be fully resolved:

1. **ComponentRadius for Blocks**
   - What we know: Components have componentRadius.{component} tokens (e.g., componentRadius.chip)
   - What's unclear: Should blocks have componentRadius.loginBlock or just use radius.lg/radius.md?
   - Recommendation: Blocks use general radius tokens (lg, md) since they're compositions, not atomic components. Only add componentRadius for blocks if they need consistent customization across app.

2. **Social Auth Icon Sources**
   - What we know: Blocks show social login buttons (Google, Apple, Facebook)
   - What's unclear: Where do icons come from? Are they expected to be provided by user, or should blocks include default SVGs?
   - Recommendation: For MVP, use text labels ("Continue with Google"). Document that users can customize with icon prop. Add optional icon library integration in future.

3. **Form Field Spacing Consistency**
   - What we know: FormItem has marginBottom: spacing[4] built-in
   - What's unclear: Should blocks override this for tighter/looser layouts?
   - Recommendation: Use default FormItem spacing. If blocks need custom density, add a `compact` prop rather than overriding per-field.

## Sources

### Primary (HIGH confidence)
- Project codebase:
  - packages/registry/blocks/*.tsx (existing block implementations)
  - packages/registry/ui/form.tsx (Form component pattern)
  - packages/core/src/theme/components.ts (token definitions)
  - apps/demo/components/demos/form-demo.tsx (form integration examples)

### Secondary (MEDIUM confidence)
- [Expo Authentication Documentation](https://docs.expo.dev/develop/authentication/) - OAuth, PKCE, secure storage patterns
- [React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow/) - Navigation patterns for auth
- [react-hook-form Advanced Usage](https://react-hook-form.com/advanced-usage) - Async validation, error handling
- [iOS Accessibility Guidelines Best Practices](https://medium.com/@david-auerbach/ios-accessibility-guidelines-best-practices-for-2025-6ed0d256200e) - VoiceOver, Dynamic Type, accessibility requirements
- [LogRocket UI Best Practices](https://blog.logrocket.com/ui-design-best-practices-loading-error-empty-state-react/) - Empty state, error state, loading state patterns
- [Mobile App Accessibility Guide 2025](https://www.accessibilitychecker.org/guides/mobile-apps-accessibility/) - Cross-platform accessibility requirements

### Tertiary (LOW confidence)
- [Empty State UX Examples](https://www.eleken.co/blog-posts/empty-state-ux) - Design patterns (not code-specific)
- WebSearch findings on React Native best practices 2026 - General ecosystem trends

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use in project, versions confirmed in package.json
- Architecture: HIGH - Patterns extracted from existing project code and established phase patterns
- Pitfalls: MEDIUM-HIGH - Combination of project patterns and industry best practices (WebSearch + official docs)

**Research date:** 2026-01-25
**Valid until:** ~30 days (stable domain - form/auth patterns don't change rapidly, but check for library updates)

**Key findings:**
1. Blocks already exist and work - this is refinement, not net-new development
2. Token migration is the primary work (spacing, typography, colors, radius)
3. Form integration pattern is established and working well in demo
4. State coverage (loading, error, disabled) needs systematic verification
5. Accessibility testing is critical - must test with VoiceOver/TalkBack before completion
