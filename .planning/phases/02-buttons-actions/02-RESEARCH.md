# Phase 2: Buttons & Actions - Research

**Researched:** 2026-01-24
**Domain:** Button-like interactive components (Button, Icon Button, FAB, Segmented Control, Action Sheet)
**Confidence:** HIGH

## Summary

This phase focuses on ensuring all button-like components (Button, Icon Button, FAB, Segmented Control, Action Sheet) maintain the gold standard established in Phase 1. Research reveals these components already exist in the codebase with strong patterns: proper token usage, Reanimated animations, haptic feedback, and accessibility support.

**Key findings:**
- Button component is already the gold standard: uses `components.button[size]`, `componentRadius.button`, `platformShadow()`, and `springs.snappy` correctly
- All button variants already implement consistent patterns: proper Pressable usage (not legacy TouchableOpacity), scale animations on press (0.96-0.97), and haptic feedback ('light' for buttons, 'selection' for segmented control)
- IconButton adds `xl` size (4 sizes: sm/md/lg/xl vs Button's 3), and has unique `rounded` prop for circular shape
- FAB implements extended FAB pattern (icon + optional label) with 3 variants (primary/secondary/surface) and custom size tokens
- Action Sheet follows iOS design patterns with swipe-to-dismiss gesture, backdrop, and cancel button
- Segmented Control implements iOS-style animated indicator with spring animations
- React Native recommends Pressable over TouchableOpacity for all new components (2026 standard)

**Primary recommendation:** Verify consistency across all 5 components - ensure they all use the same variant names (default, secondary, outline, ghost, destructive), same animation patterns (withSpring for scale), and same accessibility patterns (accessibilityRole, accessibilityState, accessibilityLabel).

## Standard Stack

The established libraries/tools for button-like components in this codebase:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.1.1 | Press animations | Industry standard, 60fps native thread animations for scale/opacity effects |
| react-native-gesture-handler | 2.x | Gestures | Required for Action Sheet swipe-to-dismiss, pan gesture handling |
| expo-haptics | Latest | Tactile feedback | Provides iOS/Android haptic feedback for button presses |
| react-native-svg | 15.x | Icons | Rendering inline SVG icons for Icon Button, FAB, Action Sheet items |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @metacells/mcellui-core | current | Theme system | All components - provides useTheme() hook, platformShadow(), haptic() |
| AccessibilityInfo API | Built-in | Motion preferences | Detect reduceMotion to disable animations |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pressable | TouchableOpacity | Pressable is recommended by React Native team (0.63+), more flexible API |
| Custom gestures | react-native-gesture-handler | GH provides native gesture recognition, better performance |
| Custom haptics | expo-haptics | expo-haptics handles platform differences, respects system settings |

**Installation:**
All dependencies already present in project. No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
Button Component/
├── Props interface                  # variant, size, disabled, loading, icon
├── Theme token lookup               # const tokens = components.button[size]
├── Variant styles function          # getVariantStyles(variant, colors)
├── Animated press handling          # scale with withSpring
├── Haptic feedback                  # haptic('light') on press
├── Accessibility props              # accessibilityRole="button"
└── Shadow/elevation logic           # platformShadow('sm') for solid variants
```

### Pattern 1: Consistent Variant System
**What:** All button-like components support the same variant prop values
**When to use:** Button, Icon Button, FAB (with exceptions documented)
**Example:**
```typescript
// Source: Button component (line 38)
export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'success';

// Variant styles use color tokens consistently
function getVariantStyles(variant: ButtonVariant, colors) {
  switch (variant) {
    case 'default':
      return {
        container: { backgroundColor: colors.primary },
        text: { color: colors.primaryForeground },
      };
    case 'destructive':
      return {
        container: { backgroundColor: colors.destructive },
        text: { color: colors.destructiveForeground },
      };
    // ... all variants use color tokens, never hardcoded colors
  }
}
```

### Pattern 2: Scale Animation on Press
**What:** Use Reanimated scale animation for tactile press feedback
**When to use:** All pressable button components
**Example:**
```typescript
// Source: Button component (lines 85-110)
const scale = useSharedValue(1);
const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

const handlePressIn = useCallback((e) => {
  if (animationsEnabled) {
    scale.value = withSpring(BUTTON_CONSTANTS.pressScale, springs.snappy);
  }
  onPressIn?.(e);
}, [onPressIn, springs.snappy, animationsEnabled]);

const handlePressOut = useCallback((e) => {
  if (animationsEnabled) {
    scale.value = withSpring(1, springs.snappy);
  }
  onPressOut?.(e);
}, [onPressOut, springs.snappy, animationsEnabled]);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: animationsEnabled ? scale.value : 1 }],
}));

// CRITICAL: Check areAnimationsDisabled() to respect accessibility settings
```

### Pattern 3: Size-Specific Border Radius
**What:** Use componentRadius tokens that vary by size, not just base radius
**When to use:** Button (has buttonSm/button/buttonLg), future components with size variants
**Example:**
```typescript
// Source: Button component (lines 87-90)
const borderRadius = size === 'sm' ? componentRadius.buttonSm
  : size === 'lg' ? componentRadius.buttonLg
  : componentRadius.button;

// NOT: borderRadius: radius.md (ignores size variant)
// YES: Use size-specific componentRadius values
```

### Pattern 4: Conditional Shadow Application
**What:** Apply shadow only to solid variants, not outline/ghost
**When to use:** All button variants
**Example:**
```typescript
// Source: Button component (lines 128-131)
const shadowStyle =
  variant !== 'ghost' && variant !== 'outline' && !isDisabled
    ? platformShadow('sm')
    : {};

// Apply in style array
style={[baseStyles, variantStyles, shadowStyle, animatedStyle]}
```

### Pattern 5: Loading State with ActivityIndicator
**What:** Replace content with ActivityIndicator when loading=true
**When to use:** All async action buttons
**Example:**
```typescript
// Source: Button component (lines 160-181)
{loading ? (
  <ActivityIndicator size="small" color={variantStyles.spinnerColor} />
) : (
  <>
    {icon && <View style={styles.icon}>{icon}</View>}
    <Text style={[styles.text, variantStyles.text]}>
      {children}
    </Text>
    {iconRight && <View style={styles.icon}>{iconRight}</View>}
  </>
)}

// CRITICAL: Spinner color matches text color for variant consistency
```

### Pattern 6: FAB Extended Pattern
**What:** FAB supports optional label for extended floating action button
**When to use:** FAB component when text label aids clarity
**Example:**
```typescript
// Source: FAB component (lines 103-209)
const isExtended = !!label;

<AnimatedPressable
  style={{
    width: isExtended ? 'auto' : config.size,
    height: config.size,
    paddingHorizontal: isExtended ? config.paddingHorizontal : 0,
  }}
>
  {icon}
  {label && <Text>{label}</Text>}
</AnimatedPressable>

// Extended FAB: dynamic width with horizontal padding
// Regular FAB: fixed square/circle with centered icon
```

### Pattern 7: Segmented Control Animated Indicator
**What:** Animated indicator that slides between segments with spring physics
**When to use:** Segmented Control for smooth visual feedback
**Example:**
```typescript
// Source: Segmented Control (lines 93-144)
const indicatorX = useSharedValue(0);
const indicatorWidth = useSharedValue(0);

useEffect(() => {
  const layout = segmentLayouts.get(value);
  if (layout) {
    if (animationsEnabled) {
      indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
    } else {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
    }
  }
}, [value, segmentLayouts, animationsEnabled]);

// Indicator follows selected segment with spring animation
```

### Pattern 8: Action Sheet Swipe-to-Dismiss
**What:** Pan gesture allows user to swipe down to dismiss sheet
**When to use:** Action Sheet, bottom sheets
**Example:**
```typescript
// Source: Action Sheet (lines 131-146)
const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationY > 0) {
      translateY.value = event.translationY;
    }
  })
  .onEnd((event) => {
    if (event.translationY > 100 || event.velocityY > 500) {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 150 });
      runOnJS(close)();
    } else {
      translateY.value = withTiming(0, { duration: 150 });
    }
  });

// Threshold-based dismissal: 100px translation OR 500px/s velocity
```

### Anti-Patterns to Avoid
- **TouchableOpacity usage:** Use Pressable instead (React Native recommendation 2026)
- **Missing animation disable check:** Always check `areAnimationsDisabled()` for accessibility
- **Hardcoded press scale:** Use `BUTTON_CONSTANTS.pressScale` not `0.95`
- **Inconsistent variant names:** Stick to default/secondary/outline/ghost/destructive
- **Missing haptic feedback:** All button presses should call `haptic('light')`
- **Missing accessibilityLabel on icon-only buttons:** Required for screen readers
- **Shadow on outline/ghost variants:** Looks wrong, use conditional shadow application
- **Ignoring loading state:** Buttons with async actions need loading prop support

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Press animation | Manual state + Animated | useSharedValue + withSpring | Runs on native thread, smoother interruptions |
| Haptic feedback | Platform-specific imports | `haptic('light')` from core | Handles Expo vs bare, respects user settings |
| Variant styles | Props-based conditional styling | Centralized variant function | Single source of truth, easier to maintain |
| Shadow styles | Manual Platform.select | `platformShadow('sm')` | Consistent iOS/Android shadows, theme-aware |
| Size tokens | Hardcoded dimensions per size | `components.button[size]` lookup | Centralized, globally adjustable |
| Border radius scaling | Manual size checks | `componentRadius.buttonSm/button/buttonLg` | Respects global radius preset |
| Motion preferences | Custom accessibility check | `areAnimationsDisabled()` | Caches result, respects AccessibilityInfo |
| Icon color matching | Manual color per variant | Pass color to cloneElement | Ensures icon matches text color |
| Loading spinner color | Manual variant check | Use `variantStyles.spinnerColor` | Matches foreground color automatically |
| Bottom sheet gestures | Custom pan handlers | react-native-gesture-handler Gesture.Pan() | Native gesture recognition, better performance |

**Key insight:** Button component demonstrates the complete pattern - all button-like components should follow its token usage, animation patterns, and accessibility patterns exactly.

## Common Pitfalls

### Pitfall 1: Icon Button Missing AccessibilityLabel
**What goes wrong:** Icon-only buttons are invisible to screen readers without text
**Why it happens:** No visual text makes it easy to forget accessibility
**How to avoid:**
- Make `accessibilityLabel` required prop on IconButton (line 65)
- Test with VoiceOver (iOS) and TalkBack (Android) on every icon button
- Descriptive labels: "Add item" not "Plus" or "Icon"
**Warning signs:**
- Screen reader reads nothing when focusing icon button
- TalkBack/VoiceOver skips over button entirely
- Generic labels like "Button" or "Icon"

### Pitfall 2: Variant Inconsistency Across Components
**What goes wrong:** Button supports 'link' variant but IconButton doesn't
**Why it happens:** Components evolved independently without cross-checking
**How to avoid:**
- Document canonical variant list: default, secondary, outline, ghost, destructive
- Optional variants marked clearly (Button's 'link', 'success')
- FAB has different variants (primary/secondary/surface) - document why
**Warning signs:**
- Developer tries to use variant that doesn't exist on component
- TypeScript error: variant='outline' not assignable to FABVariant
- Inconsistent visual results across similar components

### Pitfall 3: Forgetting Animation Disable Check
**What goes wrong:** Animations run even when user has "Reduce Motion" enabled
**Why it happens:** Easy to forget accessibility settings in press handlers
**How to avoid:**
- ALWAYS check `areAnimationsDisabled()` before animations
- Pattern: `const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);`
- In animated styles: `transform: [{ scale: animationsEnabled ? scale.value : 1 }]`
- Test with iOS Settings > Accessibility > Motion > Reduce Motion ON
**Warning signs:**
- Animations run regardless of system settings
- No check for `areAnimationsDisabled()` in component
- Direct animation without conditional check

### Pitfall 4: Press Scale Value Inconsistency
**What goes wrong:** Different components use different scale values (0.9, 0.92, 0.95, 0.97)
**Why it happens:** Magic numbers hardcoded per component
**How to avoid:**
- Use `BUTTON_CONSTANTS.pressScale` (0.97 for buttons)
- IconButton uses 0.9 for more prominent feedback (acceptable variance)
- FAB uses 0.92 (acceptable variance for floating element)
- Document reason for any deviation from standard 0.97
**Warning signs:**
- Hardcoded `withSpring(0.95, ...)` instead of constant
- Inconsistent "feel" across similar components
- No constant defined for press scale

### Pitfall 5: Missing Loading Spinner Color Matching
**What goes wrong:** ActivityIndicator shows wrong color (e.g., black on dark button)
**Why it happens:** Forgot to pass variant-specific color to spinner
**How to avoid:**
- Store `spinnerColor` alongside container/text styles in variant function
- Pass `spinnerColor` to ActivityIndicator color prop
- Test loading state for EVERY variant (especially destructive, secondary)
**Warning signs:**
- Spinner invisible on certain variants
- Spinner color doesn't match text color
- Hard to see spinner on primary button

### Pitfall 6: Segmented Control Segment Width Issues
**What goes wrong:** Segments not equal width, or indicator doesn't align correctly
**Why it happens:** Layout measurement happens after initial render
**How to avoid:**
- Use `onLayout` to capture segment dimensions (line 102-116 in SegmentedControl)
- Store layouts in ref Map, not state (avoids re-renders)
- Update indicator position in useEffect when value changes
- Handle case where layout measurement hasn't completed yet
**Warning signs:**
- Indicator starts at wrong position
- Indicator width doesn't match segment width
- Unequal segment widths when they should be equal

### Pitfall 7: Action Sheet Close on Backdrop Press
**What goes wrong:** Tapping backdrop doesn't close sheet, or closes incorrectly
**Why it happens:** Backdrop Pressable positioned/configured wrong
**How to avoid:**
- Backdrop must be `StyleSheet.absoluteFill` to cover entire screen
- Use separate Pressable for backdrop, not parent container
- Pattern: `<Pressable style={StyleSheet.absoluteFill} onPress={close} />`
- Test on both iOS and Android (behavior sometimes differs)
**Warning signs:**
- Can tap "through" backdrop to content below
- Backdrop only responds to taps in certain areas
- Sheet doesn't close when tapping outside

## Code Examples

Verified patterns from existing components:

### Complete Button Implementation Pattern
```typescript
// Source: Button component - THE GOLD STANDARD for Phase 2
export const Button = forwardRef(function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  onPress,
  ...props
}, ref) {
  const { colors, components, componentRadius, platformShadow, springs } = useTheme();
  const tokens = components.button[size];
  const isDisabled = disabled || loading;
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
  const scale = useSharedValue(1);

  // Size-specific border radius
  const borderRadius = size === 'sm' ? componentRadius.buttonSm
    : size === 'lg' ? componentRadius.buttonLg
    : componentRadius.button;

  const handlePressIn = useCallback((e) => {
    if (animationsEnabled) {
      scale.value = withSpring(BUTTON_CONSTANTS.pressScale, springs.snappy);
    }
    onPressIn?.(e);
  }, [onPressIn, springs.snappy, animationsEnabled]);

  const handlePressOut = useCallback((e) => {
    if (animationsEnabled) {
      scale.value = withSpring(1, springs.snappy);
    }
    onPressOut?.(e);
  }, [onPressOut, springs.snappy, animationsEnabled]);

  const handlePress = useCallback((e) => {
    haptic('light');
    onPress?.(e);
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationsEnabled ? scale.value : 1 }],
  }));

  const variantStyles = getVariantStyles(variant, colors);

  const shadowStyle = variant !== 'ghost' && variant !== 'outline' && !isDisabled
    ? platformShadow('sm')
    : {};

  return (
    <AnimatedPressable
      ref={ref}
      style={[
        styles.base,
        {
          minHeight: tokens.height,
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
          borderRadius,
          gap: tokens.gap,
        },
        variantStyles.container,
        shadowStyle,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        animatedStyle,
      ]}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.spinnerColor} />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, { fontSize: tokens.fontSize, fontWeight: tokens.fontWeight }, variantStyles.text]}>
            {children}
          </Text>
          {iconRight && <View style={styles.icon}>{iconRight}</View>}
        </>
      )}
    </AnimatedPressable>
  );
});
```

### Icon Button with Required AccessibilityLabel
```typescript
// Source: IconButton component (lines 49-66)
export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;  // REQUIRED - no optional marker
}

// Usage in component
<AnimatedPressable
  accessibilityRole="button"
  accessibilityLabel={accessibilityLabel}  // Always present, never undefined
  accessibilityState={{ disabled: isDisabled }}
>
  {React.cloneElement(icon as React.ReactElement, {
    width: config.iconSize,
    height: config.iconSize,
    color: variantStyles.iconColor,  // Color matches variant
  })}
</AnimatedPressable>
```

### FAB Extended Pattern
```typescript
// Source: FAB component (lines 55-72, 151-209)
export interface FABProps {
  icon: React.ReactNode;
  label?: string;  // Optional - creates extended FAB
  size?: FABSize;
  variant?: FABVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const SIZE_CONFIG = {
  sm: { size: 40, iconSize: 18, fontSize: 13, paddingHorizontal: 12 },
  md: { size: 56, iconSize: 24, fontSize: 14, paddingHorizontal: 16 },
  lg: { size: 72, iconSize: 32, fontSize: 16, paddingHorizontal: 20 },
};

const isExtended = !!label;

<AnimatedPressable
  style={{
    width: isExtended ? 'auto' : config.size,
    height: config.size,
    borderRadius: config.size / 2,  // Always circular
    paddingHorizontal: isExtended ? config.paddingHorizontal : 0,
  }}
>
  {icon}
  {label && <Text style={{ marginLeft: 8 }}>{label}</Text>}
</AnimatedPressable>
```

### Segmented Control Indicator Animation
```typescript
// Source: Segmented Control (lines 81-144)
const segmentLayouts = useRef(new Map<string, LayoutRectangle>()).current;
const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);
const indicatorX = useSharedValue(0);
const indicatorWidth = useSharedValue(0);

const handleLayout = (segmentValue: string, event: LayoutChangeEvent) => {
  const layout = event.nativeEvent.layout;
  segmentLayouts.set(segmentValue, layout);

  if (segmentValue === value) {
    if (animationsEnabled) {
      indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
    } else {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
    }
  }
};

useEffect(() => {
  const layout = segmentLayouts.get(value);
  if (layout) {
    if (animationsEnabled) {
      indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
      indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
    } else {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
    }
  }
}, [value, segmentLayouts, animationsEnabled]);

const indicatorStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: indicatorX.value }],
  width: indicatorWidth.value,
}));
```

### Action Sheet with Gesture Dismissal
```typescript
// Source: Action Sheet (lines 106-154)
const translateY = useSharedValue(SCREEN_HEIGHT);
const backdropOpacity = useSharedValue(0);

React.useEffect(() => {
  if (open) {
    backdropOpacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
  } else {
    backdropOpacity.value = withTiming(0, { duration: 150 });
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200, easing: Easing.in(Easing.ease) });
  }
}, [open, translateY, backdropOpacity]);

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationY > 0) {
      translateY.value = event.translationY;
    }
  })
  .onEnd((event) => {
    if (event.translationY > 100 || event.velocityY > 500) {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 150 });
      runOnJS(close)();
    } else {
      translateY.value = withTiming(0, { duration: 150 });
    }
  });

<GestureDetector gesture={panGesture}>
  <Animated.View style={[styles.sheet, sheetStyle]}>
    {/* Sheet content */}
  </Animated.View>
</GestureDetector>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| TouchableOpacity | Pressable | React Native 0.63 (2020) | All new components use Pressable, better customization |
| Manual opacity animations | Reanimated scale animations | Phase 1-2 | Native thread performance, smoother feel |
| Hardcoded press scales | BUTTON_CONSTANTS.pressScale | Phase 4 | Consistent feel, globally adjustable |
| Component-specific shadows | platformShadow() helper | Phase 4 | Consistent elevation, theme-aware |
| Separate focus/press handlers | Combined Pressable props | Ongoing | Simpler code, fewer handlers |
| Custom gesture code | react-native-gesture-handler | All components | Native gesture recognition, better performance |
| Manual haptic platform checks | haptic() utility | All components | Respects system settings, fallback graceful |

**Deprecated/outdated:**
- **TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback:** Use Pressable (React Native team recommendation 2026)
- **Manual Animated.timing for press:** Use withSpring for natural physics-based feel
- **Hardcoded scale values:** Use BUTTON_CONSTANTS.pressScale or document deviation
- **Missing animation disable check:** Always check areAnimationsDisabled() for accessibility
- **Icon-only buttons without accessibilityLabel:** Required for screen readers

## Open Questions

Things that couldn't be fully resolved:

1. **IconButton XL size vs Button size system**
   - What we know: IconButton has 4 sizes (sm/md/lg/xl), Button has 3 (sm/md/lg)
   - What's unclear: Should Button add xl size for consistency?
   - Recommendation: Keep as-is - IconButton needs xl for app bars/toolbars, Button's lg is sufficient for most use cases

2. **FAB variant naming (primary/secondary/surface) vs Button (default/secondary)**
   - What we know: FAB uses different variant names than Button
   - What's unclear: Is this intentional design decision or inconsistency?
   - Recommendation: Document as intentional - FAB is Material Design-inspired (primary/secondary), Button is web-inspired (default/secondary)

3. **Segmented Control haptic type**
   - What we know: Uses 'selection' haptic (line 135), Button uses 'light'
   - What's unclear: Is this the optimal haptic for segment changes?
   - Recommendation: Keep 'selection' - it's semantically correct for choosing between options (like radio buttons)

4. **Action Sheet destructive button placement**
   - What we know: iOS HIG says destructive actions at top, cancel at bottom
   - What's unclear: Current implementation doesn't enforce destructive ordering
   - Recommendation: Add guidance in docs - developer responsibility to order items, ActionSheet doesn't auto-sort

5. **Button link variant accessibility**
   - What we know: Button has 'link' variant with underlined text, minimal padding
   - What's unclear: Touch target might be too small (no minimum height)
   - Recommendation: Test touch target size - may need to maintain minHeight even for link variant

## Sources

### Primary (HIGH confidence)
- Existing codebase audit:
  - `/packages/registry/ui/button.tsx` - Gold standard implementation
  - `/packages/registry/ui/icon-button.tsx` - Icon button patterns
  - `/packages/registry/ui/fab.tsx` - FAB implementation
  - `/packages/registry/ui/segmented-control.tsx` - Segmented control with animated indicator
  - `/packages/registry/ui/action-sheet.tsx` - Action sheet with gestures
  - `/packages/core/src/theme/components.ts` - Button token definitions
  - `/packages/core/src/constants.ts` - BUTTON_CONSTANTS
  - `/packages/core/src/theme/animations.ts` - Spring configurations
  - `/apps/demo/components/demos/button-demo.tsx` - Demo patterns
- React Native official documentation (January 2026)

### Secondary (MEDIUM confidence)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility) - Official accessibility patterns for buttons
- [React Native Reanimated Examples](https://docs.swmansion.com/react-native-reanimated/examples/) - FAB animation patterns
- [Expo Haptics Documentation](https://docs.expo.dev/versions/latest/sdk/haptics/) - Haptic feedback best practices
- [Apple HIG: Action Sheets](https://developer.apple.com/design/human-interface-guidelines/action-sheets) - iOS action sheet design patterns
- [Apple HIG: Segmented Controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) - iOS segmented control guidelines
- [Mobbin: Bottom Sheet Patterns](https://mobbin.com/glossary/bottom-sheet) - Bottom sheet design examples

### Tertiary (LOW confidence - verified with code)
- [Pressable vs TouchableOpacity 2026](https://duruldalkanat.medium.com/pressable-vs-touchableopacity-in-react-native-making-the-right-choice-4e5212f289d0) - Why Pressable is recommended
- [React Native FAB Patterns](https://callstack.github.io/react-native-paper/docs/components/FAB/) - FAB design patterns (verified against codebase)
- [React Native Button Design System 2026](https://javascript.plainenglish.io/react-native-button-design-system-1a7ac0c535a6) - Variant pattern approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json, components use them correctly
- Architecture: HIGH - Patterns extracted from 5 working components, consistent across codebase
- Pitfalls: HIGH - Identified from code audit and comparing implementations
- Code examples: HIGH - All examples copied from working components
- Open questions: MEDIUM - Based on code observation and design guidelines, need design team input

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable tech stack, React Native/Reanimated patterns mature)
