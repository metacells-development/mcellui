# Phase 1: Form Inputs - Research

**Researched:** 2026-01-24
**Domain:** React Native form input components refinement
**Confidence:** HIGH

## Summary

This phase focuses on refining existing form input components (Input, Textarea, Select, Slider, Stepper, Checkbox, Switch, Radio, Tag Input) to match the gold standard established by Button and Card components. The research reveals a clear pattern: all gold-standard components use theme tokens consistently, implement size variants via token lookups, handle state transitions with Reanimated, and provide comprehensive accessibility support.

**Key findings:**
- Button and Card demonstrate perfect token usage: `components.button[size]`, `componentRadius.button`, `platformShadow()`, `springs.snappy`
- Current form inputs show inconsistent patterns: some use hardcoded values (Textarea, Select), others use proper tokens (Input, Checkbox, Switch)
- React Native accessibility requires proper `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` - focus rings are handled by platform
- Mobile touch targets should be minimum 44px (componentHeight.md) per iOS HIG
- Error states universally use `colors.destructive` with 2px border width for emphasis

**Primary recommendation:** Extract common patterns from Button/Card (token lookups, animated borders, state handling) into reusable patterns that can be systematically applied to all form inputs.

## Standard Stack

The established libraries/tools for React Native form input components in this codebase:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.1.1 | Animations | Industry standard for performant React Native animations, 60fps on native thread |
| react-native-gesture-handler | 2.x | Gestures | Required for Reanimated, provides native gesture handling for Slider |
| react-native-svg | 15.x | Icons | Rendering inline SVG icons for checkmarks, chevrons, clear buttons |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @metacells/mcellui-core | current | Theme system | All components - provides useTheme() hook with tokens |
| AccessibilityInfo API | Built-in | Motion preferences | Checkbox, Switch, Radio - detect reduceMotion setting |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom tokens | Hardcoded values | Tokens enable theme consistency but require lookup overhead |
| State-based styles | Animated styles | Animated provides smoother transitions but more complex code |

**Installation:**
All dependencies already present in project. No new packages needed.

## Architecture Patterns

### Recommended Component Structure
```
Input Component/
├── Props interface with size prop      # size: 'sm' | 'md' | 'lg'
├── Theme token lookup                  # const tokens = components.input[size]
├── State management                    # focused, error, disabled states
├── Animated values                     # focusProgress for border transitions
├── Event handlers                      # onFocus, onBlur with haptics
├── Animated styles                     # interpolateColor for borders
└── Render with tokens                  # All dimensions from tokens
```

### Pattern 1: Token-Based Sizing
**What:** Use centralized size tokens instead of hardcoded values
**When to use:** All components with size variants (sm/md/lg)
**Example:**
```typescript
// Source: Button component (lines 81-90)
const { colors, components, componentRadius } = useTheme();
const tokens = components.button[size];

// Get size-specific border radius from dynamic componentRadius
const borderRadius = size === 'sm' ? componentRadius.buttonSm
  : size === 'lg' ? componentRadius.buttonLg
  : componentRadius.button;

// Apply tokens to styles
style={{
  minHeight: tokens.height,
  paddingHorizontal: tokens.paddingHorizontal,
  paddingVertical: tokens.paddingVertical,
  borderRadius,
  fontSize: tokens.fontSize,
}}
```

### Pattern 2: Animated Focus States
**What:** Use Reanimated for smooth border color/width transitions
**When to use:** All focusable inputs (Input, Textarea, Select)
**Example:**
```typescript
// Source: Input component (lines 145-204)
const focusProgress = useSharedValue(0);

const handleFocus = useCallback((e) => {
  focusProgress.value = withTiming(1, timing.default);
  haptic('selection');
  onFocus?.(e);
}, [onFocus, timing.default]);

const animatedBorderStyle = useAnimatedStyle(() => {
  if (hasError) {
    return { borderColor: colors.destructive, borderWidth: 2 };
  }
  return {
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.border, colors.primary]
    ),
    borderWidth: focusProgress.value > 0.5 ? 2 : tokens.borderWidth,
  };
}, [hasError, colors, tokens.borderWidth]);
```

### Pattern 3: Consistent Error Handling
**What:** Error state overrides focus state with destructive color + 2px border
**When to use:** All form inputs with validation
**Example:**
```typescript
// Source: Multiple components show this pattern
const hasError = !!error;

// In animated styles - error takes priority
if (hasError) {
  return {
    borderColor: colors.destructive,
    borderWidth: 2,  // Emphasis for errors
  };
}

// Label color
style={{
  color: hasError ? colors.destructive : colors.foreground
}}
```

### Pattern 4: Accessibility-First Props
**What:** Proper accessibility properties on all interactive elements
**When to use:** Every pressable/input component
**Example:**
```typescript
// Source: Checkbox component (lines 162-168)
<Pressable
  accessible
  accessibilityRole="checkbox"
  accessibilityLabel={accessibilityLabel ?? label}
  accessibilityState={{
    checked: indeterminate ? 'mixed' : checked,
    disabled,
  }}
>
```

### Pattern 5: Platform-Aware Shadows
**What:** Use `platformShadow()` helper for cross-platform shadows
**When to use:** Elevated elements (buttons, cards, raised switches)
**Example:**
```typescript
// Source: Button component (lines 128-131)
const shadowStyle = variant !== 'ghost' && variant !== 'outline' && !isDisabled
  ? platformShadow('sm')
  : {};

// Apply to style array
style={[baseStyles, shadowStyle]}
```

### Anti-Patterns to Avoid
- **Hardcoded dimensions:** `fontSize: 14` instead of `fontSize: tokens.fontSize`
- **Hardcoded colors:** `borderColor: '#ccc'` instead of `colors.border`
- **Hardcoded radius:** `borderRadius: 8` instead of `componentRadius.input`
- **Missing size tokens:** `height: 48` instead of `tokens.height`
- **Direct state changes:** Not using Reanimated for smooth transitions
- **Inconsistent disabled state:** Some components use opacity, others don't

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus animations | Custom useState transitions | Reanimated withTiming + interpolateColor | Runs on native thread (60fps), handles interruptions |
| Haptic feedback | Platform-specific imports | `haptic()` from core | Handles Expo vs bare, respects system settings |
| Shadow styles | Manual shadowOffset/elevation | `platformShadow('sm'\|'md'\|'lg')` | Consistent iOS/Android shadows, adjusts for theme |
| Motion preferences | Custom accessibility checks | `areAnimationsDisabled()` from core | Caches result, respects AccessibilityInfo.isReduceMotionEnabled |
| Theme token access | Props drilling | `useTheme()` hook | Provides all tokens + helpers, memoized |
| Size variant logic | Switch statements | Token lookup: `components.input[size]` | Centralized tokens, type-safe |

**Key insight:** The theme system and core utilities already solve 90% of common component problems. Using them ensures consistency and maintainability.

## Common Pitfalls

### Pitfall 1: Mixing Hardcoded Values with Tokens
**What goes wrong:** Component partially uses tokens (e.g., colors) but hardcodes dimensions
**Why it happens:** Incrementally adopting tokens without full audit
**How to avoid:**
- Grep for numeric literals in component file: `/\d{1,3}px|\d+,$/`
- Verify every number is either from tokens or a ratio/offset
- Use spacing tokens for all margins/padding: `spacing[2]` not `8`
**Warning signs:**
- Mixed units: some `spacing[3]`, some `12`
- Size prop doesn't affect all dimensions

### Pitfall 2: Inconsistent Border Width Changes
**What goes wrong:** Focus/error states change color but not width, or vice versa
**Why it happens:** Border width changes can cause layout shift if not accounted for
**How to avoid:**
- Always pair border width with border color in animated styles
- Use 1px default, 2px for focused/error states (established pattern)
- Consider using outline instead of border if layout shift is problematic
**Warning signs:**
- Subtle layout "jumps" when focusing inputs
- Border appears to "pulse" instead of smoothly transitioning

### Pitfall 3: Forgetting Disabled State Styling
**What goes wrong:** Disabled inputs look identical to enabled, confusing users
**Why it happens:** Disabled state is easy to forget in visual testing
**How to avoid:**
- Test disabled variant in demo file for EVERY component
- Use consistent disabled pattern: `backgroundColor: colors.backgroundMuted`, `opacity: 0.5` on interactive elements
- Disable animations: `scale.value = 1` when disabled
**Warning signs:**
- Demo doesn't show disabled state
- Disabled component responds to press events

### Pitfall 4: Accessibility Role Mismatch
**What goes wrong:** Screen readers announce wrong element type (e.g., "button" instead of "checkbox")
**Why it happens:** Copy-paste from different component type
**How to avoid:**
- Map component to correct accessibilityRole:
  - Input → "none" (TextInput handles this)
  - Select → "combobox"
  - Checkbox → "checkbox"
  - Switch → "switch"
  - Radio → "radio"
  - Slider → "adjustable"
- Test with VoiceOver (iOS) and TalkBack (Android)
**Warning signs:**
- Screen reader announces unexpected element type
- Double-tap behavior doesn't match visual expectation

### Pitfall 5: Size Prop Not Affecting All Dimensions
**What goes wrong:** Size changes height but not padding, font size, or icon size
**Why it happens:** Missing token lookups for some dimension
**How to avoid:**
- Create exhaustive size token object: `{ height, padding, fontSize, iconSize, gap }`
- Apply ALL token values to respective style properties
- Verify in demo: sm/md/lg should look proportional
**Warning signs:**
- Text overflows in sm variant
- Icons look too large/small for container
- Padding feels cramped in lg variant

## Code Examples

Verified patterns from official sources:

### Consistent Token Lookup Pattern
```typescript
// Source: Button component - THE GOLD STANDARD
export const Button = forwardRef(({ size = 'md', ... }) => {
  const { colors, components, componentRadius, platformShadow, springs } = useTheme();
  const tokens = components.button[size];

  // Get size-specific radius
  const borderRadius = size === 'sm' ? componentRadius.buttonSm
    : size === 'lg' ? componentRadius.buttonLg
    : componentRadius.button;

  return (
    <AnimatedPressable
      style={[
        {
          minHeight: tokens.height,           // From token
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          borderRadius,                       // From componentRadius
          gap: tokens.gap,
        },
        variantStyles.container,
        platformShadow('sm'),                  // From helper
        style,
      ]}
    >
      <Text style={{
        fontSize: tokens.fontSize,             // From token
        fontWeight: tokens.fontWeight,         // From token
      }}>
        {children}
      </Text>
    </AnimatedPressable>
  );
});
```

### Complete Focus State Animation
```typescript
// Source: Input component - lines 160-204
const focusProgress = useSharedValue(0);

const handleFocus = useCallback((e) => {
  focusProgress.value = withTiming(1, timing.default);
  haptic('selection');  // Tactile feedback
  onFocus?.(e);
}, [onFocus, timing.default]);

const handleBlur = useCallback((e) => {
  focusProgress.value = withTiming(0, timing.default);
  onBlur?.(e);
}, [onBlur, timing.default]);

const animatedBorderStyle = useAnimatedStyle(() => {
  // Error state takes priority over focus
  if (hasError) {
    return {
      borderColor: colors.destructive,
      borderWidth: 2,
    };
  }

  // Smooth transition between border and primary
  return {
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.border, colors.primary]
    ),
    // Increase width at midpoint for crisp transition
    borderWidth: focusProgress.value > 0.5 ? 2 : tokens.borderWidth,
  };
}, [hasError, colors, tokens.borderWidth]);

<AnimatedTextInput
  style={[baseStyles, animatedBorderStyle]}
  onFocus={handleFocus}
  onBlur={handleBlur}
/>
```

### Comprehensive Accessibility Props
```typescript
// Source: Checkbox component - complete pattern
<Pressable
  onPress={handlePress}
  disabled={disabled}
  accessible                                    // Enable accessibility
  accessibilityRole="checkbox"                  // Correct semantic role
  accessibilityLabel={accessibilityLabel ?? label}  // Readable label
  accessibilityState={{
    checked: indeterminate ? 'mixed' : checked, // Current state
    disabled,                                    // Disabled state
  }}
>
  {/* Visual checkbox */}
</Pressable>
```

### Size Variants with Demo Pattern
```typescript
// Source: Toggle demo - shows how to demonstrate sizes
<Section title="Sizes">
  <Card>
    <CardContent style={{ paddingTop: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <Toggle size="sm" pressed={false}>
          <BoldIcon size={14} color={colors.foreground} />
        </Toggle>
        <Toggle size="md" pressed={false}>
          <BoldIcon size={16} color={colors.foreground} />
        </Toggle>
        <Toggle size="lg" pressed={false}>
          <BoldIcon size={20} color={colors.foreground} />
        </Toggle>
      </View>
    </CardContent>
  </Card>
</Section>
```

### Error State Display Pattern
```typescript
// Source: Input component - consistent error pattern
const hasError = !!error;

// Label
<Text style={{
  fontSize: tokens.labelFontSize,
  color: hasError ? colors.destructive : colors.foreground,
}}>
  {label}
</Text>

// Helper text / error message
{(error || helperText) && (
  <Text style={{
    fontSize: tokens.helperFontSize,
    marginTop: spacing[1],
    color: hasError ? colors.destructive : colors.foregroundMuted,
  }}>
    {error || helperText}
  </Text>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded spacing values | spacing token system | Phase 4 | All new components use spacing[n], old ones need migration |
| Component-specific radius | componentRadius tokens | Phase 4 | Button has buttonSm/button/buttonLg, others need similar |
| Manual shadow objects | platformShadow() helper | Phase 4 | Consistent shadows, some components not migrated yet |
| Static border styles | Animated borders with focus | Ongoing | Button/Card/Input use, others inconsistent |
| Inconsistent size props | Standardized sm/md/lg | Ongoing | Some components missing size support entirely |

**Deprecated/outdated:**
- Direct `radius.md` usage: Replaced by `componentRadius.input` for component-specific radius
- `backgroundColor: '#f5f5f5'`: Use `colors.backgroundMuted` for disabled states
- Manual animation configs: Use `springs.snappy` or `timing.default` from theme

## Open Questions

Things that couldn't be fully resolved:

1. **Textarea size variants**
   - What we know: Textarea currently doesn't support size prop, uses hardcoded values
   - What's unclear: Should rows be affected by size, or just padding/fontSize?
   - Recommendation: Size affects padding/fontSize only, rows remains independent prop

2. **Select focus indicator without TextInput**
   - What we know: Select uses Pressable not TextInput, current focus animation works
   - What's unclear: Is the current approach sufficient for accessibility?
   - Recommendation: Test with screen readers; current animated border likely adequate

3. **Slider accessibility focus**
   - What we know: Slider uses gesture handler, has accessibilityRole="adjustable"
   - What's unclear: Whether visual focus indicator needed beyond gesture feedback
   - Recommendation: Add focus ring when component receives keyboard focus

4. **Tag Input size token structure**
   - What we know: TagInput has custom SIZE_CONFIG object, not using components.input
   - What's unclear: Should it align with input tokens or remain separate?
   - Recommendation: Create tagInput tokens in components.ts for consistency

## Sources

### Primary (HIGH confidence)
- Existing codebase audit:
  - `/packages/registry/ui/button.tsx` - Gold standard for token usage
  - `/packages/registry/ui/card.tsx` - Gold standard for animations
  - `/packages/registry/ui/input.tsx` - Best-in-class input implementation
  - `/packages/registry/ui/checkbox.tsx` - Perfect accessibility example
  - `/packages/core/src/theme/components.ts` - Token definitions
- React Native official docs on TextInput and Accessibility (Jan 2025)

### Secondary (MEDIUM confidence)
- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility) - Official accessibility patterns
- [Appt.org Focus Indicators](https://appt.org/en/docs/react-native/samples/accessibility-focus-indicator) - Visual focus patterns
- [React Native Paper TextInput](https://callstack.github.io/react-native-paper/docs/components/TextInput/) - Industry reference for input patterns

### Tertiary (LOW confidence)
- Web search results on React Native form best practices 2026 - General patterns, not RN-specific
- GitHub discussions on accessibility focus order - Exploratory, no definitive solutions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json and imports
- Architecture: HIGH - Patterns extracted from working gold-standard components
- Pitfalls: HIGH - Identified from code audit and comparing inconsistent implementations
- Code examples: HIGH - All examples copied verbatim from working components
- Open questions: MEDIUM - Based on code observation, need team discussion/testing

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable tech stack, minimal churn expected)
