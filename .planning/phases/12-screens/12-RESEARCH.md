# Phase 12: Screens - Research

**Researched:** 2026-01-25
**Domain:** React Native/Expo Screen Templates & Architecture
**Confidence:** HIGH

## Summary

Screen templates in React Native/Expo represent complete, production-ready user interfaces that compose multiple components and blocks to create functional application pages. Phase 12 involves refining 19 existing screen templates (Login, Signup, OTP Verification, Profile, Settings, Feed, Cart, Checkout, Product Detail, Order History, Home, Account, Search, Chat, Notifications, Comments, Followers, Onboarding, Help) to ensure they follow all quality requirements established in prior phases.

The research reveals that modern React Native screen architecture (2026) emphasizes:
1. **File-based routing** with Expo Router as the emerging standard
2. **Component composition** from existing UI primitives and blocks
3. **Platform-specific conventions** for iOS/Android navigation and interaction patterns
4. **State management** using lightweight solutions (Zustand) + React Query for async data
5. **Performance optimization** through proper list rendering (FlatList over ScrollView) and memoization

**Primary recommendation:** Screens should be thin composition layers that orchestrate existing components/blocks with minimal custom logic. Focus on proper keyboard handling (KeyboardAvoidingView), safe area insets (useSafeAreaInsets), loading/error/empty states, and platform-appropriate navigation patterns.

## Standard Stack

The established libraries/tools for React Native screen templates:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-safe-area-context | Latest (SDK 54+) | Safe area handling | Official Expo SDK package, natively implemented for performance |
| React Navigation 7+ | 7.x | Navigation framework | Industry standard, 80%+ adoption, static API improves DX |
| Expo Router | Latest | File-based routing | Emerging standard for Expo apps, automatic deep linking |
| @tanstack/react-query (React Query) | 5.x | Async state management | Handles 80% of server-state patterns, caching, refetching |
| Zustand | 4.x+ | Client state management | 40%+ adoption, simpler than Redux, better than Context alone |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.x+ | Form state management | Authentication screens, checkout flows |
| zod | 3.x+ | Form validation | Any screen with form inputs |
| react-native-keyboard-controller | Latest | Keyboard handling | Login, signup, chat screens with forms |
| @shopify/flash-list | Latest | High-performance lists | Feed, notifications, order history screens |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Navigation | Expo Router only | RN loses flexibility for complex custom nav patterns |
| Zustand | Redux Toolkit | Redux overkill for most apps, more boilerplate |
| React Query | SWR | Similar capabilities, React Query has better DevTools |
| FlatList | FlashList | FlashList 60fps but requires Shopify dependency |

**Installation:**
```bash
# Core dependencies (most already in mcellui)
npm install react-native-safe-area-context @react-navigation/native

# State management (if needed)
npm install zustand @tanstack/react-query

# Forms (already in mcellui)
npm install react-hook-form @hookform/resolvers zod

# Performance (optional upgrade)
npm install @shopify/flash-list react-native-keyboard-controller
```

## Architecture Patterns

### Recommended Project Structure
```
packages/registry/screens/
├── login-screen.tsx           # Auth flow screens
├── signup-screen.tsx
├── otp-verification-screen.tsx
├── profile-screen.tsx         # User screens
├── settings-screen.tsx
├── feed-screen.tsx            # Social screens
├── chat-screen.tsx
├── notifications-screen.tsx
├── cart-screen.tsx            # E-commerce screens
├── checkout-screen.tsx
├── product-detail-screen.tsx
└── ...
```

### Pattern 1: Screen Composition (Thin Orchestration Layer)
**What:** Screens should compose existing components and blocks rather than implementing custom UI logic
**When to use:** All screens in Phase 12
**Example:**
```typescript
// Source: mcellui existing pattern (login-screen.tsx)
export function LoginScreen({
  onLogin,
  loading = false,
  error,
}: LoginScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing[8],
          paddingHorizontal: spacing[6],
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Compose from existing components */}
        <Input label="Email" {...emailProps} />
        <Input label="Password" secureTextEntry {...passwordProps} />
        <Button onPress={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### Pattern 2: Safe Area with Keyboard Handling
**What:** All screens must handle safe areas (notch, status bar) and keyboard overlays properly
**When to use:** Every screen, especially those with forms
**Example:**
```typescript
// Source: React Native Safe Area Context docs + keyboard handling best practices
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FormScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: spacing[4],
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen content */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### Pattern 3: List Screens with Pull-to-Refresh & Pagination
**What:** Screens with scrolling lists should use FlatList (or FlashList) with proper pagination
**When to use:** Feed, notifications, order history, comments, followers screens
**Example:**
```typescript
// Source: mcellui existing pattern (feed-screen.tsx) + React Native best practices
export function FeedScreen({ posts, onRefresh, onEndReached }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh?.();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedPostCard {...item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      ListEmptyComponent={<EmptyStateBlock />}
      showsVerticalScrollIndicator={false}
    />
  );
}
```

### Pattern 4: Loading, Error, Empty State Handling
**What:** All screens must show appropriate UI for loading, error, and empty states
**When to use:** Any screen with async data (feed, profile, product detail, etc.)
**Example:**
```typescript
// Source: React Native UI best practices (LogRocket + Medium articles)
export function DataScreen({ data, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorStateBlock
        title="Something went wrong"
        message={error.message}
        onRetry={onRetry}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyStateBlock
        title="No items yet"
        message="Content will appear here when available"
      />
    );
  }

  return (
    {/* Render data */}
  );
}
```

### Pattern 5: Platform-Specific Navigation Conventions
**What:** iOS and Android have different navigation patterns that screens should respect
**When to use:** Headers, back buttons, modal presentations
**Example:**
```typescript
// Source: React Native platform conventions (InfoQ article)
const Header = () => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.header,
      {
        // iOS: Larger header, centered title
        // Android: Smaller header, left-aligned title
        height: Platform.OS === 'ios' ? 44 : 56,
        justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
      }
    ]}>
      {Platform.OS === 'android' && <BackButton />}
      <Text style={[
        styles.title,
        { textAlign: Platform.OS === 'ios' ? 'center' : 'left' }
      ]}>
        {title}
      </Text>
    </View>
  );
};
```

### Anti-Patterns to Avoid
- **Anonymous renderItem functions:** Always memoize FlatList renderItem with useCallback to prevent re-renders
- **Inline style objects:** Creates new objects every render, breaks React comparison checks
- **Mixing KeyboardAvoidingView with KeyboardAwareScrollView:** They conflict and fight each other
- **ScrollView for long lists:** Use FlatList/FlashList for 10+ items, ScrollView renders everything at once
- **Absolute positioning without accessibility:** TalkBack can't access absolutely positioned elements outside ancestor bounds

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard avoidance | Custom keyboard offset logic | `react-native-keyboard-controller` or `KeyboardAvoidingView` | Platform differences (iOS padding, Android height), keyboard events, animation timing |
| Safe area handling | Manual inset calculations | `react-native-safe-area-context` (useSafeAreaInsets) | Device-specific notches, status bars, home indicators, landscape rotation |
| Pull-to-refresh | Custom gesture + animation | FlatList `refreshControl` prop with `RefreshControl` | Native feel, platform differences, gesture conflicts, loading states |
| Infinite scroll | Manual scroll position tracking | FlatList `onEndReached` + `onEndReachedThreshold` | Scroll position edge cases, debouncing, performance optimization |
| Form state + validation | Manual field tracking | `react-hook-form` + `zod` | Field registration, validation errors, touched/dirty state, submission handling |
| Async data caching | Manual fetch + useState | `@tanstack/react-query` (useQuery) | Caching, refetching, deduplication, stale data, error retry, optimistic updates |
| List performance | Optimizing ScrollView | FlatList or `@shopify/flash-list` | Virtualization, memory management, lazy loading, 60fps scrolling |

**Key insight:** Screen-level concerns (keyboard, safe areas, navigation, list performance) have mature solutions that handle 100+ edge cases. Custom implementations miss platform nuances and performance optimizations that took years to perfect.

## Common Pitfalls

### Pitfall 1: Unnecessary Re-renders Killing Performance
**What goes wrong:** Creating objects/functions inline in render causes React to rebuild components unnecessarily, making screens feel sluggish
**Why it happens:**
- `style={[styles.container, { marginTop: 10 }]}` creates new object every render
- `onPress={() => handlePress()}` creates new function every render
- `renderItem={(item) => <Component {...item} />}` recreates function on every list update

**How to avoid:**
```typescript
// ❌ BAD: Creates new style object every render
<View style={[styles.base, { marginTop: spacing[4] }]} />

// ✅ GOOD: Memoize dynamic styles
const dynamicStyle = useMemo(
  () => ({ marginTop: spacing[4] }),
  [spacing]
);
<View style={[styles.base, dynamicStyle]} />

// ❌ BAD: Creates new function every render
<FlatList renderItem={(item) => <Card {...item} />} />

// ✅ GOOD: Memoize render function
const renderItem = useCallback(
  ({ item }) => <Card {...item} />,
  []
);
<FlatList renderItem={renderItem} />
```

**Warning signs:** Slow scrolling, input lag, choppy animations, high CPU usage in React DevTools profiler

### Pitfall 2: ScrollView vs FlatList Confusion
**What goes wrong:** Using ScrollView for long lists causes memory issues, slow initial render, and poor performance
**Why it happens:** ScrollView renders ALL children immediately, while FlatList only renders visible items
**How to avoid:**
```typescript
// ❌ BAD: ScrollView with 100+ items
<ScrollView>
  {posts.map(post => <PostCard key={post.id} {...post} />)}
</ScrollView>

// ✅ GOOD: FlatList with virtualization
<FlatList
  data={posts}
  renderItem={({ item }) => <PostCard {...item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

**Warning signs:** Slow mounting, high memory usage, app crashes on long lists, scrolling jank

### Pitfall 3: Keyboard Overlapping Inputs
**What goes wrong:** Keyboard covers input fields, user can't see what they're typing
**Why it happens:** Not using KeyboardAvoidingView, wrong behavior prop, missing keyboardShouldPersistTaps
**How to avoid:**
```typescript
// ✅ GOOD: Proper keyboard handling
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <Input label="Email" />
    <Input label="Password" />
  </ScrollView>
</KeyboardAvoidingView>
```

**Warning signs:** Input fields hidden behind keyboard, keyboard dismisses when tapping buttons, form submission issues

### Pitfall 4: Ignoring Safe Area Insets
**What goes wrong:** Content hidden behind notch, status bar, or home indicator on iPhone X+ and Android devices with gesture navigation
**Why it happens:** Not using SafeAreaView or useSafeAreaInsets hook
**How to avoid:**
```typescript
// ✅ GOOD: Proper safe area handling
const insets = useSafeAreaInsets();

return (
  <View style={{ flex: 1 }}>
    <View style={{ paddingTop: insets.top }}>
      {/* Header content */}
    </View>
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
      {/* Screen content */}
    </ScrollView>
  </View>
);
```

**Warning signs:** Text cut off at top/bottom of screen, content behind notch, buttons hidden by home indicator

### Pitfall 5: Missing Loading/Error/Empty States
**What goes wrong:** Users see blank screens, spinners forever, or cryptic errors
**Why it happens:** Only implementing happy path, not handling async state transitions
**How to avoid:**
```typescript
// ✅ GOOD: Complete state coverage
function Screen() {
  const { data, isLoading, error, refetch } = useQuery(/* ... */);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorStateBlock onRetry={refetch} />;
  if (!data?.length) return <EmptyStateBlock />;

  return <FlatList data={data} {...props} />;
}
```

**Warning signs:** User complaints about "broken" screens, no feedback during loading, unclear error messages

### Pitfall 6: Platform-Specific UI Inconsistencies
**What goes wrong:** Screen looks/behaves wrong on iOS or Android, doesn't follow platform conventions
**Why it happens:** Not testing on both platforms, ignoring platform differences
**How to avoid:**
- Test on both iOS and Android simulators/devices
- Use Platform.select() for platform-specific values
- Follow iOS Human Interface Guidelines and Material Design
- Use platform-appropriate icons (SF Symbols on iOS, Material Icons on Android)

**Warning signs:** iOS users expect centered titles but see left-aligned, Android users expect FAB bottom-right not bottom-center

## Code Examples

Verified patterns from official sources and mcellui codebase:

### Authentication Screen with Form Validation
```typescript
// Source: mcellui login-screen.tsx + react-hook-form best practices
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

export function LoginScreen({ onLogin }: Props) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await onLogin(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing[8],
          paddingBottom: insets.bottom + spacing[6],
          paddingHorizontal: spacing[6],
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Sign In
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### List Screen with Async Data & States
```typescript
// Source: mcellui feed-screen.tsx + React Query patterns
import { useQuery } from '@tanstack/react-query';

export function FeedScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['feed'],
    queryFn: fetchFeed,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <FeedPostCard
        {...item}
        showSeparator={index < data.length - 1}
      />
    ),
    [data?.length]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorStateBlock
        title="Couldn't load feed"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        ListEmptyComponent={
          <EmptyStateBlock
            title="No posts yet"
            message="Follow people to see their posts here"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
```

### E-commerce Screen with Multi-Step Flow
```typescript
// Source: mcellui checkout-screen.tsx + e-commerce best practices
type Step = 'shipping' | 'payment' | 'review';

export function CheckoutScreen({ items, total, onPlaceOrder }: Props) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('shipping');
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  const progress = {
    shipping: 0.33,
    payment: 0.66,
    review: 1,
  }[step];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with progress */}
      <View style={{ paddingTop: insets.top + spacing[2] }}>
        <Progress value={progress} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing[4] }}>
        {step === 'shipping' && (
          <ShippingForm
            onComplete={(data) => {
              setShippingData(data);
              setStep('payment');
            }}
          />
        )}

        {step === 'payment' && (
          <PaymentForm
            onComplete={(data) => {
              setPaymentData(data);
              setStep('review');
            }}
            onBack={() => setStep('shipping')}
          />
        )}

        {step === 'review' && (
          <OrderReview
            items={items}
            total={total}
            shipping={shippingData}
            payment={paymentData}
            onPlaceOrder={() => onPlaceOrder({ shipping: shippingData, payment: paymentData })}
            onBack={() => setStep('payment')}
          />
        )}
      </ScrollView>
    </View>
  );
}
```

### Platform-Specific Header
```typescript
// Source: React Native platform conventions + mcellui patterns
export function ScreenHeader({ title, onBack, rightAction }: Props) {
  const { colors, spacing, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + spacing[2],
          paddingBottom: spacing[3],
          paddingHorizontal: spacing[4],
          borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
          borderBottomColor: colors.border,
          height: Platform.OS === 'ios' ? 44 : 56,
        },
      ]}
    >
      {onBack && (
        <Pressable onPress={onBack} hitSlop={8}>
          <ChevronLeftIcon size={24} color={colors.foreground} />
        </Pressable>
      )}

      <Text
        style={[
          styles.title,
          {
            color: colors.foreground,
            fontWeight: fontWeight.bold,
            fontSize: Platform.OS === 'ios' ? 17 : 20,
            textAlign: Platform.OS === 'ios' ? 'center' : 'left',
            flex: Platform.OS === 'ios' ? 1 : 0,
          },
        ]}
      >
        {title}
      </Text>

      {rightAction || <View style={{ width: 24 }} />}
    </View>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Redux for all state | Zustand + React Query | 2023-2024 | 40% less boilerplate, simpler mental model, better DX |
| Component-based routing (React Navigation only) | File-based routing (Expo Router) | 2024-2025 | Automatic deep linking, better web support, simpler navigation |
| KeyboardAwareScrollView library | react-native-keyboard-controller | 2025-2026 | Native performance, consistent iOS/Android behavior, actively maintained |
| FlatList for all lists | FlashList where performance critical | 2023-2024 | 60fps scrolling, better memory usage, same API |
| Manual safe area handling | useSafeAreaInsets hook | 2020 | Native implementation, no async bridge delay, more reliable |
| ScrollView for everything | FlatList for 10+ items | Always best practice | Virtualization prevents memory issues, lazy loading |

**Deprecated/outdated:**
- **Redux Thunk/Saga for async:** React Query handles server state better, less boilerplate
- **KeyboardAwareScrollView (npm):** Unmaintained, use react-native-keyboard-controller instead
- **Manual inset calculations:** useSafeAreaInsets from react-native-safe-area-context is standard
- **StyleSheet.create for dynamic styles:** Static styles OK, but dynamic token-based styles preferred for theming

## Open Questions

Things that couldn't be fully resolved:

1. **Should screens have their own token system?**
   - What we know: Components and blocks have centralized tokens (spacing, typography, colors)
   - What's unclear: Screens are composition layers - do they need screen-specific tokens or just use existing component tokens?
   - Recommendation: Start without screen-specific tokens. If patterns emerge (e.g., consistent header heights, content padding), add screenTokens to core theme

2. **File-based routing (Expo Router) vs component-based (React Navigation)?**
   - What we know: mcellui is a copy-paste library, not an app framework. Screens exist in `/registry/screens/` as standalone components
   - What's unclear: Should screens assume Expo Router structure, or remain routing-agnostic?
   - Recommendation: Keep screens routing-agnostic. Provide example integration for both Expo Router and React Navigation in documentation

3. **FlashList vs FlatList as default recommendation?**
   - What we know: FlashList provides 60fps performance, same API as FlatList, but adds Shopify dependency
   - What's unclear: Does adding FlashList dependency align with mcellui's minimal dependencies philosophy?
   - Recommendation: Use FlatList by default (built-in), document FlashList as drop-in performance upgrade in comments

4. **How to handle screen-level navigation (tabs, stacks)?**
   - What we know: Screens compose UI, navigation setup is usually in app-level routing
   - What's unclear: Should some screens (like Home with bottom tabs) include navigation setup?
   - Recommendation: Screens receive navigation handlers as props (onNavigate, onBack), keep navigation setup out of screen components

## Sources

### Primary (HIGH confidence)
- React Native ScrollView documentation - https://reactnative.dev/docs/scrollview
- Expo Safe Area Context documentation - https://docs.expo.dev/versions/latest/sdk/safe-area-context/
- React Native official Accessibility docs - https://reactnative.dev/docs/accessibility
- React Native Performance docs - https://reactnative.dev/docs/performance

### Secondary (MEDIUM confidence)
- [Expo Router vs React Navigation comparison (2025)](https://viewlytics.ai/blog/react-navigation-7-vs-expo-router)
- [React Native best practices (2026)](https://www.esparkinfo.com/blog/react-native-best-practices)
- [State Management in 2026: Redux, Context API, Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [React Native FlatList performance guide](https://rafalnawojczyk.pl/blog/react-native/flatlist-performance)
- [Building e-commerce apps with React Native](https://blog.logrocket.com/build-ecommerce-app-from-scratch-with-react-native/)
- [UI best practices for loading, error, empty states](https://blog.logrocket.com/ui-design-best-practices-loading-error-empty-state-react/)
- [React Native platform-specific UI guidelines](https://www.infoq.com/articles/ios-android-react-native-design-patterns/)
- [Keyboard handling in React Native (2026)](https://medium.com/@shreyasdamase/mastering-keyboard-handling-in-react-native-a-complete-guide-to-react-native-keyboard-controller-451438bdc1f0)
- [React Native accessibility best practices](https://www.accessibilitychecker.org/blog/react-native-accessibility/)
- [7 React Native mistakes slowing apps (2026)](https://medium.com/@baheer224/7-react-native-mistakes-slowing-your-app-in-2026-19702572796a)

### Tertiary (LOW confidence - needs validation)
- Various Medium articles on specific patterns (should verify implementation details with official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Native/Expo official packages well-documented
- Architecture: HIGH - Patterns verified in mcellui existing screens (login, feed, checkout)
- Pitfalls: HIGH - Documented in official React Native performance guide + real-world examples
- State management: MEDIUM - Ecosystem trends (Zustand, React Query) not official standards
- File-based routing: MEDIUM - Expo Router emerging but not universal adoption yet

**Research date:** 2026-01-25
**Valid until:** 30 days (stable ecosystem, React Native/Expo patterns evolve slowly)
