# Phase 7: Navigation & Interaction - Research

**Researched:** 2026-01-25
**Domain:** React Native navigation components with Reanimated 3 and Gesture Handler 2
**Confidence:** HIGH

## Summary

Phase 7 focuses on refining five navigation/interaction components (Tabs, Accordion, Collapsible, Carousel, Swipeable Row) to meet gold standard quality requirements. All components already exist in the codebase and use the established patterns: React Native StyleSheet with ThemeProvider, Reanimated 3 for animations, Gesture Handler 2 for gestures, and compound component patterns via Context API.

The research reveals that these components follow current best practices (2026) with proper spring animations, gesture handling, and compound patterns. The primary refinement work involves ensuring consistent token usage, smooth edge case handling in gesture-based components, and comprehensive demos showing all states and variants.

**Primary recommendation:** Focus on token consistency validation, gesture edge case handling (velocity thresholds, rubber band effects, simultaneous row management), and animation performance patterns (areAnimationsDisabled support, reduced motion compliance).

## Standard Stack

The established libraries/tools for this domain are already integrated in the project.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 3.x | Smooth animations | Industry standard for performant UI thread animations, 60fps guarantee |
| react-native-gesture-handler | 2.x | Touch gestures | Native gesture recognition, crucial for swipeable interactions |
| react-native-svg | Latest | Animated icons | Chevron/indicator animations in Accordion/Collapsible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Context API | Native | Component state sharing | Compound patterns (Tabs, Accordion, Collapsible) |
| FlatList | Native | Carousel implementation | Horizontal scrolling with pagination |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Reanimated 3 | Reanimated 4 | Reanimated 3 is no longer maintained (as of 2026), but upgrade not required for this phase |
| Custom tabs | react-native-tab-view | Library adds dependency, custom solution provides full control |
| Custom carousel | react-native-snap-carousel | Library unmaintained, custom with FlatList more reliable |

**Note:** All components currently use Reanimated 3, which is still functional but no longer maintained. Reanimated 4 is recommended for new projects, but upgrading is outside this phase scope.

**Installation:**
All dependencies already installed. No new packages required.

## Architecture Patterns

### Recommended Project Structure
```
packages/registry/ui/
├── tabs.tsx              # Compound: Tabs, TabsList, TabsTrigger, TabsContent
├── accordion.tsx         # Compound: Accordion, AccordionItem, AccordionTrigger, AccordionContent
├── collapsible.tsx       # Compound: Collapsible, CollapsibleTrigger, CollapsibleContent
├── carousel.tsx          # Exports: Carousel, CarouselItem, CarouselRef (with forwardRef)
└── swipeable-row.tsx     # Single component with action arrays
```

### Pattern 1: Compound Component with Context API
**What:** Components that share implicit state through React Context
**When to use:** Multi-part components (Tabs, Accordion, Collapsible)
**Example:**
```typescript
// Source: Existing tabs.tsx implementation
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ value, defaultValue, onValueChange, children }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
}

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs provider');
  }
  return context;
}
```

### Pattern 2: Controlled/Uncontrolled Component Pattern
**What:** Support both controlled (external state) and uncontrolled (internal state) modes
**When to use:** All interactive components
**Example:**
```typescript
// Source: Existing accordion.tsx implementation
export function Accordion({ value, defaultValue, onValueChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue || []);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue);
  };
}
```

### Pattern 3: Spring Animation with Disabled State Check
**What:** Respect system reduced motion settings via areAnimationsDisabled
**When to use:** All components with animations
**Example:**
```typescript
// Source: Existing accordion.tsx and collapsible.tsx
import { areAnimationsDisabled } from '@metacells/mcellui-core';

const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

React.useEffect(() => {
  if (animationsEnabled) {
    progress.value = withSpring(isOpen ? 1 : 0, SPRING_CONFIG);
  } else {
    progress.value = isOpen ? 1 : 0;
  }
}, [isOpen, animationsEnabled]);
```

### Pattern 4: Height Animation with Layout Measurement
**What:** Animate content height without knowing height in advance
**When to use:** Accordion, Collapsible components
**Example:**
```typescript
// Source: Existing accordion.tsx implementation
const [measuredHeight, setMeasuredHeight] = useState(0);
const heightValue = useSharedValue(0);
const isOpenRef = React.useRef(isOpen);

const onLayout = (event: LayoutChangeEvent) => {
  const h = event.nativeEvent.layout.height;
  // Only accept heights LARGER than current measurement
  // Prevents accepting small heights from lingering collapse animation
  if (isOpenRef.current && h > 0 && h > measuredHeight) {
    setMeasuredHeight(h);
  }
};

const animatedStyle = useAnimatedStyle(() => ({
  height: interpolate(
    progress.value,
    [0, 1],
    [0, heightValue.value],
    Extrapolation.CLAMP
  ),
  overflow: 'hidden' as const,
}));
```

### Pattern 5: Gesture Handler with Velocity Thresholds
**What:** Pan gesture with velocity-based snap decisions
**When to use:** Swipeable Row, Sheet components
**Example:**
```typescript
// Source: Existing swipeable-row.tsx implementation
const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])  // Prevent accidental activation
  .onUpdate((event) => {
    let newX = contextX.value + event.translationX;
    // Add rubber band resistance past action buttons
    if (newX < -rightActionsWidth) {
      const overshoot = -newX - rightActionsWidth;
      const resistance = Math.min(overshoot * 0.3, maxSwipeLeft - rightActionsWidth);
      newX = -rightActionsWidth - resistance;
    }
    translateX.value = newX;
  })
  .onEnd((event) => {
    'worklet';
    const velocity = event.velocityX;
    const x = translateX.value;

    // Velocity threshold: -500 or +500
    if (x < -rightActionsWidth / 2 || velocity < -500) {
      runOnJS(openRight)();
    } else {
      runOnJS(close)();
    }
  });
```

### Pattern 6: FlatList Carousel with Animated Indicators
**What:** Horizontal scrolling with interpolated dot indicators
**When to use:** Carousel/slideshow components
**Example:**
```typescript
// Source: Existing carousel.tsx implementation
const scrollX = useSharedValue(0);

const handleScroll = (event) => {
  scrollX.value = event.nativeEvent.contentOffset.x;
};

function AnimatedDot({ index, scrollX, width }) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);
    return { width: dotWidth, opacity };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
}

<FlatList
  horizontal
  pagingEnabled
  onScroll={handleScroll}
  scrollEventThrottle={16}
  showsHorizontalScrollIndicator={false}
/>
```

### Anti-Patterns to Avoid
- **Hardcoded animation durations:** Use theme animation tokens (springs, timing)
- **Missing worklet directive:** Gesture callbacks must use `'worklet'` directive
- **Re-creating context values:** Memoize context values to prevent re-renders
- **Ignoring reduced motion:** Always check areAnimationsDisabled
- **Missing keyboard navigation:** All interactive components need accessibilityRole

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab indicator animation | Custom position tracking | Reanimated useSharedValue + interpolate | Layout measurement is async, shared values are synchronous |
| Height animation | CSS-style max-height transition | LayoutChangeEvent + Reanimated interpolate | max-height doesn't exist in RN, requires actual height measurement |
| Swipe velocity detection | Manual touch event math | Gesture Handler Pan gesture | Provides native velocity calculation, handles edge cases |
| Carousel pagination | Custom scroll tracking | FlatList onScroll + scrollX shared value | Native scroll events, optimized performance |
| Spring physics | Linear timing animations | Reanimated withSpring | Natural feel, matches iOS/Android native animations |
| Gesture conflicts | Custom event blocking | Gesture Handler simultaneous/waitFor | Proper gesture priority system |

**Key insight:** Reanimated and Gesture Handler handle complex physics, threading, and platform differences. Custom solutions miss edge cases like rapid gesture changes, device rotation, and reduced motion settings.

## Common Pitfalls

### Pitfall 1: onLayout Called During Animation
**What goes wrong:** onLayout fires repeatedly during height animations, causing infinite loops or incorrect measurements
**Why it happens:** Animated.View triggers layout events as height changes
**How to avoid:**
- Use a ref to track open state (`isOpenRef.current`)
- Only accept measurements when content is actually open
- Only accept LARGER heights than current (prevents collapse state measurements)
**Warning signs:** Accordion content flickers, animation stutters, excessive re-renders

**Code pattern:**
```typescript
const isOpenRef = React.useRef(isOpen);
isOpenRef.current = isOpen;

const onLayout = (event: LayoutChangeEvent) => {
  const h = event.nativeEvent.layout.height;
  if (isOpenRef.current && h > 0 && h > measuredHeight) {
    setMeasuredHeight(h);
  }
};
```

### Pitfall 2: Multiple Swipeable Rows Open Simultaneously
**What goes wrong:** User swipes one row open, then swipes another - both stay open
**Why it happens:** Each row manages its own state independently
**How to avoid:**
- Use refs to track open rows
- Close previous row when opening new one
- Implement closeOthers callback pattern
**Warning signs:** Multiple rows swiped open at once, confusing UI state

### Pitfall 3: Gesture Handler Not Wrapped in GestureHandlerRootView
**What goes wrong:** Gestures don't work or feel unresponsive
**Why it happens:** Gesture Handler requires root wrapper at app level
**How to avoid:** Ensure demo app wraps components in GestureHandlerRootView
**Warning signs:** Swipe gestures lag, pan doesn't register

### Pitfall 4: Missing 'worklet' Directive in Gesture Callbacks
**What goes wrong:** Runtime error "Tried to synchronously call a non-worklet function"
**Why it happens:** Gesture callbacks run on UI thread, need worklet marking
**How to avoid:** Add `'worklet'` as first statement in .onUpdate(), .onEnd() callbacks
**Warning signs:** Error on gesture interaction, animations freeze

**Code pattern:**
```typescript
.onEnd((event) => {
  'worklet';  // MUST be first line
  const velocity = event.velocityX;
  runOnJS(someCallback)();  // Use runOnJS for JS thread calls
})
```

### Pitfall 5: FlatList initialScrollIndex Without getItemLayout
**What goes wrong:** Carousel doesn't scroll to initial index, shows warning
**Why it happens:** FlatList needs item dimensions to calculate scroll offset
**How to avoid:** Always provide getItemLayout when using initialScrollIndex
**Warning signs:** "You have a large list that is slow to update" warning, wrong initial position

**Code pattern:**
```typescript
<FlatList
  initialScrollIndex={initialIndex}
  getItemLayout={(_, index) => ({
    length: containerWidth,
    offset: containerWidth * index,
    index,
  })}
/>
```

### Pitfall 6: Forgetting to Stop Autoplay on User Interaction
**What goes wrong:** Carousel auto-advances while user is swiping
**Why it happens:** Autoplay interval continues during manual gestures
**How to avoid:**
- Clear interval on `onScrollBeginDrag`
- Restart interval on `onScrollEndDrag`
**Warning signs:** Carousel fights user input, jumpy scrolling

### Pitfall 7: Tab Indicator animates to 0 width on mount
**What goes wrong:** Tab indicator shrinks to zero then expands on first render
**Why it happens:** Layout hasn't been measured yet, shared values default to 0
**How to avoid:**
- Initialize shared values only after first layout measurement
- Use conditional rendering or opacity until measured
**Warning signs:** Indicator flashes/jumps on mount

## Code Examples

Verified patterns from official sources and existing implementation:

### Compound Pattern: Tabs with Context
```typescript
// Source: packages/registry/ui/tabs.tsx
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ value, defaultValue, onValueChange, children, style }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = useCallback((newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue);
  }, [isControlled, onValueChange]);

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
}

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}
```

### Spring Animation with Theme Tokens
```typescript
// Source: packages/core/src/theme/animations.ts
export const springs = {
  snappy: { damping: 20, stiffness: 300, mass: 0.5 },
  default: { damping: 15, stiffness: 200, mass: 0.8 },
  bouncy: { damping: 12, stiffness: 180, mass: 0.8 },
  gentle: { damping: 18, stiffness: 120, mass: 1 },
};

// Usage in components:
import { useTheme } from '@metacells/mcellui-core';

const { springs } = useTheme();
progress.value = withSpring(isOpen ? 1 : 0, springs.default);
```

### Gesture Handler Pan with Rubber Band Effect
```typescript
// Source: packages/registry/ui/swipeable-row.tsx
const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])  // Prevent conflicts with vertical scroll
  .onStart(() => {
    contextX.value = translateX.value;
  })
  .onUpdate((event) => {
    let newX = contextX.value + event.translationX;

    // Rubber band resistance when swiping past action buttons
    if (newX < -rightActionsWidth) {
      const overshoot = -newX - rightActionsWidth;
      const resistance = Math.min(overshoot * 0.3, maxSwipeLeft - rightActionsWidth);
      newX = -rightActionsWidth - resistance;
    }

    translateX.value = newX;
  })
  .onEnd((event) => {
    'worklet';
    const velocity = event.velocityX;
    const x = translateX.value;

    // Velocity-based snap decision
    if (x < -rightActionsWidth / 2 || velocity < -500) {
      runOnJS(openRight)();
      runOnJS(haptic)('selection');
    } else {
      runOnJS(close)();
    }
  });
```

### Carousel with FlatList and Animated Dots
```typescript
// Source: packages/registry/ui/carousel.tsx
const scrollX = useSharedValue(0);

const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  scrollX.value = event.nativeEvent.contentOffset.x;
};

function AnimatedDot({ index, scrollX, width, activeColor }) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);
    return { width: dotWidth, opacity, backgroundColor: activeColor };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
}

<FlatList
  ref={flatListRef}
  horizontal
  pagingEnabled
  onScroll={handleScroll}
  scrollEventThrottle={16}
  showsHorizontalScrollIndicator={false}
  bounces={false}
  decelerationRate="fast"
  initialScrollIndex={initialIndex}
  getItemLayout={(_, index) => ({
    length: containerWidth,
    offset: containerWidth * index,
    index,
  })}
/>
```

### Accordion Height Animation
```typescript
// Source: packages/registry/ui/accordion.tsx
const [measuredHeight, setMeasuredHeight] = useState(0);
const heightValue = useSharedValue(0);
const progress = useSharedValue(isOpen ? 1 : 0);
const isOpenRef = React.useRef(isOpen);
isOpenRef.current = isOpen;

const onLayout = (event: LayoutChangeEvent) => {
  const h = event.nativeEvent.layout.height;
  // Only accept heights LARGER than current measurement
  // This prevents accepting small heights from lingering collapse animation
  if (isOpenRef.current && h > 0 && h > measuredHeight) {
    setMeasuredHeight(h);
  }
};

const animatedStyle = useAnimatedStyle(() => {
  if (heightValue.value === 0) {
    return { overflow: 'hidden' as const };
  }
  return {
    height: interpolate(
      progress.value,
      [0, 1],
      [0, heightValue.value],
      Extrapolation.CLAMP
    ),
    overflow: 'hidden' as const,
  };
});

<Animated.View style={animatedStyle}>
  <View onLayout={onLayout} style={{ height: measuredHeight > 0 ? measuredHeight : undefined }}>
    {children}
  </View>
</Animated.View>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Reanimated 2 | Reanimated 3 | 2023 | Simpler API, fewer worklet wrappers, better TS support |
| LayoutAnimation | Reanimated Layout Animations | 2023 | Predictable, interruptible animations |
| Animated.timing | withSpring physics | 2024 | More natural, iOS-like feel |
| maxHeight: 1000 trick | Actual height measurement | 2024 | No arbitrary limits, cleaner code |
| react-native-snap-carousel | Custom FlatList carousel | 2025 | Library unmaintained, custom more reliable |
| Manual scroll tracking | FlatList scrollEventThrottle={16} | Always | 60fps scroll tracking built-in |

**Deprecated/outdated:**
- **Reanimated 3 (no longer maintained as of 2026):** Still functional, but Reanimated 4 recommended for new projects. Upgrading requires significant refactoring (worklet syntax changes).
- **LayoutAnimation API for height animations:** Replaced by Reanimated for better control and performance.
- **react-native-snap-carousel:** Unmaintained library, replaced by custom FlatList implementations.
- **Compound components without Context:** Old approach used React.cloneElement, now Context API is standard for flexibility.

## Open Questions

Things that couldn't be fully resolved:

1. **Reanimated 3 vs 4 Migration**
   - What we know: Reanimated 3 is no longer maintained (2026), Reanimated 4 has performance improvements
   - What's unclear: Whether to upgrade during this phase or defer to future milestone
   - Recommendation: Keep Reanimated 3 for this phase (components work well), plan upgrade as separate phase

2. **Keyboard Navigation Support**
   - What we know: React Native keyboard support is limited, mainly for tvOS/Android TV
   - What's unclear: How much keyboard navigation is expected for mobile-focused components
   - Recommendation: Focus on accessibilityRole/accessibilityState for screen readers, defer full keyboard nav to accessibility-focused phase

3. **Carousel Performance with 100+ Items**
   - What we know: FlatList handles large lists well with windowing
   - What's unclear: Whether carousel use case ever needs 100+ slides (vs pagination)
   - Recommendation: Document performance limits (recommend < 20 slides), suggest alternatives for large datasets

4. **Simultaneous Gesture Conflicts**
   - What we know: Gesture Handler has .simultaneousWithExternalGesture() for conflicts
   - What's unclear: Whether SwipeableRow should integrate with ScrollView gestures
   - Recommendation: Use activeOffsetX to prevent horizontal swipe from blocking vertical scroll

## Sources

### Primary (HIGH confidence)
- React Native Reanimated Official Docs (https://docs.swmansion.com/react-native-reanimated/) - Animation patterns, worklet syntax, performance guidelines
- React Native Gesture Handler Official Docs (https://docs.swmansion.com/react-native-gesture-handler/) - Pan gesture, Swipeable component patterns
- React Native Official Docs - Accessibility (https://reactnative.dev/docs/accessibility) - accessibilityRole, accessibilityState patterns
- Existing codebase components (tabs.tsx, accordion.tsx, collapsible.tsx, carousel.tsx, swipeable-row.tsx) - Current implementation patterns

### Secondary (MEDIUM confidence)
- [Dynamic Tab Indicators in React Native using Reanimated](https://medium.com/timeless/dynamic-tab-indicators-in-react-native-using-reanimated-part-i-9edd6cc7cc84) - Tab indicator animation patterns
- [React Native Collapsible Accordions - LogRocket](https://blog.logrocket.com/building-react-native-collapsible-accordions/) - Accordion height animation pitfalls
- [Making React Native Gestures Feel Natural - Shopify Engineering](https://shopify.engineering/making-react-native-gestures-feel-natural) - Velocity thresholds, rubber band effect
- [React Native Animated Carousel Tutorial](https://www.nursaadat.dev/blog/how-to-make-animated-carousel) - FlatList carousel implementation
- [Understanding React Compound Components - LogRocket](https://blog.logrocket.com/understanding-react-compound-components/) - Compound pattern with Context API

### Tertiary (LOW confidence - Community Patterns)
- [React Design Patterns 2026](https://www.sayonetech.com/blog/react-design-patterns/) - Compound component patterns
- [React Native Gesture Handler Tutorial - LogRocket](https://blog.logrocket.com/react-native-gesture-handler-tutorial-examples/) - Swipeable common mistakes
- [Keyboard Accessible Tabs - DEV Community](https://dev.to/eevajonnapanula/keyboard-accessible-tabs-with-react-5ch4) - Keyboard navigation patterns (web-focused)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All components already use established stack (Reanimated 3, Gesture Handler 2, Context API)
- Architecture: HIGH - Patterns verified in existing codebase and official documentation
- Pitfalls: HIGH - Identified from official docs, Shopify engineering blog, and codebase implementation

**Research date:** 2026-01-25
**Valid until:** 30 days (stable technologies, minimal churn expected)

**Notes:**
- Reanimated 3 deprecation is noted but not blocking (components still work)
- All findings based on existing implementations + official documentation
- Focus is on refinement (token usage, edge cases) rather than new patterns
