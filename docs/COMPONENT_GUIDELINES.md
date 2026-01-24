# nativeui Component Guidelines

This document defines how to build components, blocks, and screens for nativeui.
Follow these patterns to ensure consistency, quality, and maintainability.

**For AI/MCP:** Use this document as the source of truth when generating new components.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Theme Usage](#theme-usage)
3. [No Magic Numbers](#no-magic-numbers)
4. [Styling Patterns](#styling-patterns)
5. [Animation Patterns](#animation-patterns)
6. [Component Patterns](#component-patterns)
7. [TypeScript Patterns](#typescript-patterns)
8. [Accessibility](#accessibility)
9. [Haptic Feedback](#haptic-feedback)
10. [Documentation](#documentation)
11. [Component Types](#component-types)

---

## 1. File Structure

### Component File Template

```tsx
/**
 * ComponentName
 *
 * Brief description of what this component does.
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ComponentVariant = 'default' | 'secondary' | 'outline';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface ComponentNameProps {
  /** Brief description */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: ComponentVariant;
  /** Size preset */
  size?: ComponentSize;
  /** Disabled state */
  disabled?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function ComponentName({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
}: ComponentNameProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          padding: spacing[4],
          borderRadius: radius.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // Only layout properties that don't change
    flexDirection: 'row',
    alignItems: 'center',
  },
});
```

### Naming Conventions

| Type | File Name | Export Name |
|------|-----------|-------------|
| Component | `button.tsx` | `Button` |
| Compound | `tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| Block | `login-block.tsx` | `LoginBlock` |
| Screen | `onboarding-screen.tsx` | `OnboardingScreen` |

---

## 2. Theme Usage

### Always Use `useTheme()`

```tsx
// ✅ CORRECT
const { colors, spacing, radius, springs } = useTheme();

<View style={{ backgroundColor: colors.primary, padding: spacing[4] }}>

// ❌ WRONG - Never hardcode values
<View style={{ backgroundColor: '#7C3AED', padding: 16 }}>
```

### Available Theme Tokens

```tsx
const {
  // Colors (semantic)
  colors: {
    primary, primaryForeground,
    secondary, secondaryForeground,
    background, backgroundSubtle, backgroundMuted,
    foreground, foregroundMuted, foregroundSubtle,
    card, cardForeground,
    border, borderSubtle,
    destructive, destructiveForeground,
    success, warning, info,
  },

  // Spacing (0-32 scale)
  spacing: { 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 24, 28, 32 },

  // Border Radius
  radius: { none, xs, sm, md, lg, xl, '2xl', '3xl', full },

  // Typography
  fontSize: { xs, sm, base, lg, xl, '2xl', '3xl', '4xl' },
  fontWeight: { normal, medium, semibold, bold },

  // Shadows
  platformShadow: (size: 'none' | 'sm' | 'md' | 'lg' | 'xl') => ViewStyle,

  // Animation configs
  springs: { gentle, snappy, bouncy, stiff },

  // Component-specific tokens
  components: { button, input, card, ... },
} = useTheme();
```

---

## 3. No Magic Numbers

### Spacing

```tsx
// ✅ CORRECT
<View style={{ padding: spacing[4], marginBottom: spacing[2], gap: spacing[3] }}>

// ❌ WRONG
<View style={{ padding: 16, marginBottom: 8, gap: 12 }}>
```

### Font Sizes

```tsx
// ✅ CORRECT
<Text style={{ fontSize: fontSize.base }}>  // 16
<Text style={{ fontSize: fontSize.lg }}>    // 18
<Text style={{ fontSize: fontSize.sm }}>    // 14

// ❌ WRONG
<Text style={{ fontSize: 16 }}>
```

### Border Radius

```tsx
// ✅ CORRECT
<View style={{ borderRadius: radius.lg }}>
<View style={{ borderRadius: radius.full }}>  // Circular

// ❌ WRONG
<View style={{ borderRadius: 12 }}>
```

### Allowed Exceptions

Only these literal values are acceptable:

```tsx
// Layout fundamentals
flex: 1
flexDirection: 'row'
alignItems: 'center'
justifyContent: 'center'
position: 'absolute'
top: 0, bottom: 0, left: 0, right: 0

// Percentages
width: '100%'
height: '50%'

// Border widths (use sparingly)
borderWidth: 1
borderWidth: 2

// Opacity
opacity: 0.5
opacity: disabled ? 0.5 : 1

// Flex values
flexShrink: 0
flexGrow: 1
```

---

## 4. Styling Patterns

### StyleSheet for Static Styles

```tsx
// Put static layout styles in StyleSheet
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    flexShrink: 0,
  },
});
```

### Inline for Dynamic Styles

```tsx
// Theme-dependent and dynamic styles inline
<View
  style={[
    styles.container,
    {
      backgroundColor: colors.card,
      padding: spacing[4],
      borderRadius: radius.md,
      borderColor: colors.border,
    },
    isActive && { backgroundColor: colors.primary },
    style, // User override always last
  ]}
>
```

### Style Prop Pattern

Always accept and apply `style` prop last:

```tsx
interface Props {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

<View style={[styles.base, dynamicStyles, style]}>
  <Text style={[styles.text, textStyle]}>{children}</Text>
</View>
```

---

## 5. Animation Patterns

### Spring Animations (Preferred)

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function Component() {
  const { springs } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.snappy);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  );
}
```

### Spring Presets

```tsx
// Use theme spring presets
springs.gentle  // { damping: 20, stiffness: 180 } - Smooth, calm
springs.snappy  // { damping: 20, stiffness: 300 } - Quick, responsive
springs.bouncy  // { damping: 12, stiffness: 180 } - Playful bounce
springs.stiff   // { damping: 20, stiffness: 400 } - Immediate, precise
```

### Gesture Handler Integration

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    'worklet';
    translateX.value = withSpring(0);
    runOnJS(onComplete)(); // Call JS functions from worklet
  });

return (
  <GestureDetector gesture={panGesture}>
    <Animated.View style={animatedStyle} />
  </GestureDetector>
);
```

---

## 6. Component Patterns

### Controlled/Uncontrolled Pattern

Support both modes for all input components:

```tsx
interface Props {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

function Input({ value: controlledValue, defaultValue = '', onValueChange }: Props) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return <TextInput value={value} onChangeText={handleChange} />;
}
```

### Compound Components Pattern

For complex components with multiple parts:

```tsx
// Context
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Root component provides context
export function Tabs({ children, value, onValueChange }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
}

// Child components consume context
export function TabsTrigger({ value: tabValue, children }: TabsTriggerProps) {
  const { value, onValueChange } = useTabsContext();
  const isActive = value === tabValue;

  return (
    <Pressable onPress={() => onValueChange(tabValue)}>
      <Text>{children}</Text>
    </Pressable>
  );
}
```

### Composing Existing Components

Blocks and screens should reuse existing components:

```tsx
// ✅ CORRECT - Reuse components
import { Button } from './button';
import { Input } from './input';
import { Card, CardHeader, CardContent } from './card';

export function LoginBlock({ onLogin }: LoginBlockProps) {
  return (
    <Card>
      <CardHeader>
        <Text>Login</Text>
      </CardHeader>
      <CardContent>
        <Input label="Email" />
        <Input label="Password" secureTextEntry />
        <Button onPress={onLogin}>Sign In</Button>
      </CardContent>
    </Card>
  );
}

// ❌ WRONG - Reimplementing button from scratch
export function LoginBlock() {
  return (
    <View>
      <Pressable style={styles.button}>
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
}
```

---

## 7. TypeScript Patterns

### Strict Types (No `any`)

```tsx
// ✅ CORRECT
interface Props {
  onPress: (event: GestureResponderEvent) => void;
  items: Array<{ id: string; label: string }>;
}

// ❌ WRONG
interface Props {
  onPress: (event: any) => void;
  items: any[];
}
```

### Export Types

```tsx
// Export types users might need
export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  // ...
}

export function Button(props: ButtonProps) { /* ... */ }
```

### Props Documentation

```tsx
export interface ButtonProps {
  /** Button content (text or elements) */
  children: React.ReactNode;
  /** Visual style variant @default 'default' */
  variant?: ButtonVariant;
  /** Size preset @default 'md' */
  size?: ButtonSize;
  /** Show loading spinner, disables button */
  loading?: boolean;
  /** Prevents interaction */
  disabled?: boolean;
  /** Called when button is pressed */
  onPress?: () => void;
  /** Additional container styles */
  style?: ViewStyle;
}
```

---

## 8. Accessibility

### Required Accessibility Props

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit your information"
  accessibilityState={{
    disabled: isDisabled,
    selected: isSelected,
    checked: isChecked,
  }}
>
```

### Common Roles

| Component | Role |
|-----------|------|
| Button | `button` |
| Link | `link` |
| Checkbox | `checkbox` |
| Switch | `switch` |
| Radio | `radio` |
| Tab | `tab` |
| Slider | `adjustable` |
| Image | `image` |
| Header | `header` |

### Focus and State

```tsx
// Communicate state changes
<Switch
  accessibilityRole="switch"
  accessibilityState={{ checked: isEnabled }}
  accessibilityLabel={`Notifications ${isEnabled ? 'enabled' : 'disabled'}`}
/>
```

---

## 9. Haptic Feedback

### When to Use Haptics

| Action | Haptic Type |
|--------|-------------|
| Button press | `light` |
| Toggle switch | `light` |
| Selection change | `selection` |
| Success action | `success` |
| Error/warning | `warning` |
| Destructive action | `medium` |
| Pull to refresh | `medium` |
| Swipe action trigger | `medium` |

### Implementation

```tsx
import { haptic } from '@metacells/mcellui-core';

function Button({ onPress }: Props) {
  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  return <Pressable onPress={handlePress} />;
}

// For gestures (call from JS thread)
import { runOnJS } from 'react-native-reanimated';

const gesture = Gesture.Pan().onEnd(() => {
  'worklet';
  runOnJS(haptic)('medium');
});
```

---

## 10. Documentation

### File Header

Every component file must start with:

```tsx
/**
 * ComponentName
 *
 * Brief description of what this component does and when to use it.
 * Mention key features and behavior.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ComponentName>Content</ComponentName>
 *
 * // With variants
 * <ComponentName variant="secondary" size="lg">
 *   Large secondary
 * </ComponentName>
 *
 * // Controlled
 * <ComponentName value={value} onValueChange={setValue} />
 * ```
 */
```

### Section Separators

Use visual separators for code organization:

```tsx
// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
```

---

## 11. Component Types

### UI Components

Basic building blocks. Located in `packages/registry/ui/`.

- Single responsibility
- Highly customizable via props
- No business logic
- Examples: Button, Input, Card, Badge

### Blocks

Composed sections of UI. Located in `packages/registry/blocks/`.

- Combine multiple UI components
- Provide sensible defaults
- Accept callback props for actions
- May include minimal local state
- Examples: LoginBlock, ProfileBlock, SettingsListBlock

```tsx
// Block pattern
export interface LoginBlockProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
}

export function LoginBlock({
  onLogin,
  onForgotPassword,
  onSignUp,
  loading,
}: LoginBlockProps) {
  // Local form state is OK
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={() => onLogin(email, password)} loading={loading}>
        Sign In
      </Button>
      {onForgotPassword && (
        <Button variant="ghost" onPress={onForgotPassword}>
          Forgot Password?
        </Button>
      )}
    </Card>
  );
}
```

### Screens

Full-page templates. Located in `packages/registry/screens/`.

- Complete page layouts
- May include navigation elements
- Combine multiple blocks
- Examples: OnboardingScreen, SettingsScreen

```tsx
// Screen pattern
export interface OnboardingScreenProps {
  slides: Array<{
    title: string;
    description: string;
    image: ImageSourcePropType;
  }>;
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingScreen({
  slides,
  onComplete,
  onSkip,
}: OnboardingScreenProps) {
  const { colors, spacing } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Carousel
        data={slides}
        onIndexChange={setCurrentIndex}
        renderItem={({ item }) => (
          <OnboardingSlide {...item} />
        )}
      />
      <View style={{ padding: spacing[4] }}>
        <Button onPress={onComplete}>Get Started</Button>
        {onSkip && (
          <Button variant="ghost" onPress={onSkip}>Skip</Button>
        )}
      </View>
    </View>
  );
}
```

---

## Checklist

Before submitting a component:

- [ ] Uses `useTheme()` for all colors, spacing, radius
- [ ] No magic numbers (except allowed exceptions)
- [ ] TypeScript strict - no `any` types
- [ ] Props documented with JSDoc comments
- [ ] File header with description and example
- [ ] Accepts `style` prop for customization
- [ ] Supports controlled/uncontrolled (if applicable)
- [ ] Accessibility props included
- [ ] Haptic feedback where appropriate
- [ ] Dark mode tested
- [ ] Animations use theme springs
- [ ] Reuses existing components (for blocks/screens)
