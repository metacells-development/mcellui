# Feature: Animation System

Konsistente Micro-Animations für alle Komponenten.

## Philosophie

- **Subtil** – Animationen unterstützen, nicht ablenken
- **Schnell** – Unter 300ms für die meisten Interactions
- **Purposeful** – Jede Animation hat einen Grund
- **Platform-aware** – Respektiert "Reduce Motion" Settings

## Animation Presets

```typescript
// packages/core/src/animations.ts
import { Easing } from 'react-native-reanimated';

export const animations = {
  // Spring für natürliche Bewegung
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Schneller Spring für Buttons
  springFast: {
    damping: 20,
    stiffness: 400,
  },

  // Langsamer Spring für Modals
  springSlow: {
    damping: 20,
    stiffness: 100,
  },

  // Timing für einfache Transitions
  timing: {
    fast: { duration: 150, easing: Easing.ease },
    normal: { duration: 250, easing: Easing.ease },
    slow: { duration: 400, easing: Easing.ease },
  },

  // Easing Curves
  easing: {
    easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
    easeOut: Easing.bezier(0, 0, 0.2, 1),
    easeIn: Easing.bezier(0.4, 0, 1, 1),
    sharp: Easing.bezier(0.4, 0, 0.6, 1),
  },
};
```

## Common Patterns

### Press Animation (Button)

```typescript
const usePressAnimation = () => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.97, animations.springFast);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, animations.springFast);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPressIn, onPressOut, animatedStyle };
};
```

### Fade In (Content Loading)

```typescript
const useFadeIn = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, animations.timing.normal));
    translateY.value = withDelay(delay, withSpring(0, animations.spring));
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
};
```

### Slide Up (Bottom Sheet, Modal)

```typescript
const useSlideUp = (visible: boolean) => {
  const translateY = useSharedValue(300);

  useEffect(() => {
    translateY.value = visible
      ? withSpring(0, animations.springSlow)
      : withSpring(300, animations.spring);
  }, [visible]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
};
```

### Skeleton Shimmer

```typescript
const useShimmer = () => {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite
      false
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));
};
```

### Checkbox Check

```typescript
const useCheckAnimation = (checked: boolean) => {
  const scale = useSharedValue(checked ? 1 : 0);
  const path = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      scale.value = withSpring(1, animations.springFast);
      path.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0, animations.springFast);
      path.value = withTiming(0, { duration: 150 });
    }
  }, [checked]);

  return { scale, path };
};
```

## Reduce Motion Support

```typescript
import { useReducedMotion } from 'react-native-reanimated';

const useAccessibleAnimation = () => {
  const reduceMotion = useReducedMotion();

  const animate = (value: number, config: AnimationConfig) => {
    if (reduceMotion) {
      return withTiming(value, { duration: 0 });
    }
    return withSpring(value, config);
  };

  return { animate, reduceMotion };
};
```

## Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

export const haptics = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  selection: () => Haptics.selectionAsync(),
};
```

## Gesture Animations

```typescript
// Pan to dismiss
const usePanToDismiss = (onDismiss: () => void) => {
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        translateY.value = withSpring(500, animations.spring);
        runOnJS(onDismiss)();
      } else {
        translateY.value = withSpring(0, animations.spring);
      }
    });

  return { gesture, translateY };
};
```

## Shared Element Transitions

```typescript
// Für Navigation zwischen Screens
import { SharedTransition } from 'react-native-reanimated';

const transition = SharedTransition.custom((values) => {
  'worklet';
  return {
    width: withSpring(values.targetWidth),
    height: withSpring(values.targetHeight),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});
```

## Performance Guidelines

### Do's

```typescript
// ✓ Worklets für UI Thread
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return { transform: [{ scale: scale.value }] };
});

// ✓ Shared Values für Animation State
const progress = useSharedValue(0);

// ✓ Memoization für teure Berechnungen
const Component = React.memo(({ data }) => {
  // ...
});

// ✓ useCallback für Event Handlers
const handlePress = useCallback(() => {
  scale.value = withSpring(1);
}, []);

// ✓ Native Driver wo möglich (Animated API)
Animated.timing(value, {
  useNativeDriver: true,  // ✓ Läuft auf UI Thread
});
```

### Don'ts

```typescript
// ✗ Keine Inline Styles in render()
<View style={{ transform: [{ scale: scale.value }] }} />

// ✗ Keine Arrow Functions als Props
<Button onPress={() => doSomething()} />

// ✗ Keine setState während Animation
const animatedStyle = useAnimatedStyle(() => {
  setCount(count + 1);  // ✗ NIEMALS
  return { ... };
});

// ✗ Nicht runOnJS ohne Grund
const animatedStyle = useAnimatedStyle(() => {
  runOnJS(heavyFunction)();  // ✗ Blockt JS Thread
  return { ... };
});
```

### Performance Monitoring

```typescript
// Debug Performance
import { enableLayoutAnimations } from 'react-native-reanimated';

if (__DEV__) {
  // Log dropped frames
  enableLayoutAnimations(true, (tag, animation) => {
    console.log(`Animation ${tag}:`, animation);
  });
}
```

### Bundle Size Optimierung

```typescript
// ✓ Importiere nur was du brauchst
import { withSpring, useSharedValue } from 'react-native-reanimated';

// ✗ Nicht den ganzen Namespace
import Animated from 'react-native-reanimated';

// ✓ Lazy Loading für Blocks
const HeavyChart = React.lazy(() => import('./chart'));
```

### FlatList Performance

```typescript
// Für animierte Listen
<FlatList
  data={items}
  renderItem={({ item }) => <AnimatedItem item={item} />}
  // Performance Optimierungen:
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```
