import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Registry Access ---

function getRegistryPath(): string {
  // When running from npm package, registry is bundled in the package
  // When running locally in monorepo, it's in the sibling directory
  const bundledPath = path.resolve(__dirname, '..', 'registry');
  const monorepoPath = path.resolve(__dirname, '..', '..', 'registry');

  // Check if bundled registry exists (npm install scenario)
  if (fs.existsSync(path.join(bundledPath, 'registry.json'))) {
    return bundledPath;
  }
  // Fallback to monorepo path (local development)
  return monorepoPath;
}

function getCorePath(): string {
  // Similar logic for core tokens
  const monorepoPath = path.resolve(__dirname, '..', '..', 'core', 'src');
  return monorepoPath;
}

// --- Resources Definition ---

export const resources: Resource[] = [
  {
    uri: 'mcellui://registry',
    name: 'Component Registry',
    description: 'Full list of all mcellui components with metadata',
    mimeType: 'application/json',
  },
  {
    uri: 'mcellui://tokens',
    name: 'Design Tokens',
    description: 'Color, spacing, typography, and other design tokens',
    mimeType: 'application/json',
  },
  {
    uri: 'mcellui://docs/getting-started',
    name: 'Getting Started Guide',
    description: 'How to set up mcellui in your project',
    mimeType: 'text/markdown',
  },
  {
    uri: 'mcellui://docs/component-patterns',
    name: 'Component Patterns Guide',
    description: 'Best practices for building React Native components',
    mimeType: 'text/markdown',
  },
  {
    uri: 'mcellui://docs/theme-customization',
    name: 'Theme Customization Guide',
    description: 'How to customize colors, tokens, and themes',
    mimeType: 'text/markdown',
  },
  {
    uri: 'mcellui://docs/animation-patterns',
    name: 'Animation Patterns Guide',
    description: 'Best practices for animations with Reanimated',
    mimeType: 'text/markdown',
  },
  {
    uri: 'mcellui://docs/accessibility',
    name: 'Accessibility Guide',
    description: 'Making components accessible on iOS and Android',
    mimeType: 'text/markdown',
  },
];

// --- Resource Handlers ---

export async function handleResourceRead(
  uri: string
): Promise<{ contents: Array<{ uri: string; text?: string; mimeType?: string }> }> {
  switch (uri) {
    case 'mcellui://registry': {
      try {
        const registryPath = path.join(getRegistryPath(), 'registry.json');
        const data = fs.readFileSync(registryPath, 'utf-8');
        return {
          contents: [{ uri, text: data, mimeType: 'application/json' }],
        };
      } catch {
        return {
          contents: [{ uri, text: '{"error": "Could not load registry"}' }],
        };
      }
    }

    case 'mcellui://tokens': {
      try {
        const tokens = loadTokens();
        return {
          contents: [
            { uri, text: JSON.stringify(tokens, null, 2), mimeType: 'application/json' },
          ],
        };
      } catch {
        return {
          contents: [{ uri, text: '{"error": "Could not load tokens"}' }],
        };
      }
    }

    case 'mcellui://docs/getting-started':
      return {
        contents: [
          { uri, text: GETTING_STARTED_MD, mimeType: 'text/markdown' },
        ],
      };

    case 'mcellui://docs/component-patterns':
      return {
        contents: [
          { uri, text: COMPONENT_PATTERNS_MD, mimeType: 'text/markdown' },
        ],
      };

    case 'mcellui://docs/theme-customization':
      return {
        contents: [
          { uri, text: THEME_CUSTOMIZATION_MD, mimeType: 'text/markdown' },
        ],
      };

    case 'mcellui://docs/animation-patterns':
      return {
        contents: [
          { uri, text: ANIMATION_PATTERNS_MD, mimeType: 'text/markdown' },
        ],
      };

    case 'mcellui://docs/accessibility':
      return {
        contents: [
          { uri, text: ACCESSIBILITY_MD, mimeType: 'text/markdown' },
        ],
      };

    default:
      return {
        contents: [{ uri, text: `Resource not found: ${uri}` }],
      };
  }
}

// --- Token Loading ---

function loadTokens(): Record<string, unknown> {
  const tokensPath = path.join(getCorePath(), 'tokens');
  const tokens: Record<string, unknown> = {};

  const files = ['colors', 'spacing', 'typography', 'radius', 'shadows'];

  for (const file of files) {
    try {
      const filePath = path.join(tokensPath, `${file}.ts`);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract exported object (simple parsing)
      const match = content.match(/export const \w+ = ({[\s\S]*?});/);
      if (match) {
        // Very basic parsing - just include the raw structure description
        tokens[file] = `See ${file}.ts for full token definitions`;
      }
    } catch {
      // Skip if file doesn't exist
    }
  }

  return tokens;
}

// --- Documentation ---

const GETTING_STARTED_MD = `# Getting Started with mcellui

A copy-paste component library for Expo/React Native.

## Quick Start

### 1. Initialize

\`\`\`bash
npx mcellui init
\`\`\`

This creates:
- \`mcellui.config.ts\` - Configuration file
- \`components/ui/\` - Component directory
- \`lib/utils/cn.ts\` - Style merge utility

### 2. Add Components

\`\`\`bash
npx mcellui add button
npx mcellui add card input badge
\`\`\`

### 3. Use Components

\`\`\`tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyScreen() {
  return (
    <Card>
      <Button onPress={() => console.log('pressed')}>
        Click me
      </Button>
    </Card>
  );
}
\`\`\`

## Philosophy

1. **Copy-Paste > npm install** - You own the code
2. **Works or doesn't exist** - Tested on iOS AND Android
3. **DX is everything** - 5 second setup

## Available Commands

- \`npx mcellui init\` - Initialize project
- \`npx mcellui add <component>\` - Add component(s)
- \`npx mcellui list\` - List available components

## Platform Support

- iOS 15+ (optimized for iOS 17-18)
- Android 10+ (optimized for Android 13-14)
- Expo SDK 50+
- React Native 0.73+
`;

// --- Component Patterns Guide ---

const COMPONENT_PATTERNS_MD = `# Component Patterns Guide

Best practices for building React Native components with mcellui.

## Basic Component Structure

\`\`\`tsx
import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

export interface MyComponentProps extends ViewProps {
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export function MyComponent({
  variant = 'default',
  size = 'md',
  style,
  children,
  ...props
}: MyComponentProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.background },
        variantStyles[variant],
        sizeStyles[size],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
  },
});

const variantStyles = StyleSheet.create({
  default: {},
  outlined: { borderWidth: 1 },
});

const sizeStyles = StyleSheet.create({
  sm: { padding: 8 },
  md: { padding: 12 },
  lg: { padding: 16 },
});
\`\`\`

## Forward Ref Pattern

For components that need ref forwarding:

\`\`\`tsx
import React, { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {}

export const Card = forwardRef<View, CardProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.card, style]} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';
\`\`\`

## Pressable Component Pattern

\`\`\`tsx
import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface InteractiveCardProps extends PressableProps {
  children: React.ReactNode;
}

export function InteractiveCard({
  children,
  style,
  ...props
}: InteractiveCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
\`\`\`

## Compound Component Pattern

\`\`\`tsx
import React, { createContext, useContext } from 'react';
import { View, Text } from 'react-native';

// Context
const CardContext = createContext<{ variant: string }>({ variant: 'default' });

// Root
function CardRoot({ variant = 'default', children }) {
  return (
    <CardContext.Provider value={{ variant }}>
      <View style={styles.card}>{children}</View>
    </CardContext.Provider>
  );
}

// Sub-components
function CardHeader({ children }) {
  return <View style={styles.header}>{children}</View>;
}

function CardContent({ children }) {
  return <View style={styles.content}>{children}</View>;
}

function CardFooter({ children }) {
  return <View style={styles.footer}>{children}</View>;
}

// Export
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});

// Usage:
// <Card variant="outlined">
//   <Card.Header>Title</Card.Header>
//   <Card.Content>Body</Card.Content>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
\`\`\`

## Input Component Pattern

\`\`\`tsx
import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, onFocus, onBlur, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            isFocused && styles.focused,
            error && styles.error,
            style,
          ]}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);
\`\`\`

## Best Practices

1. **Always use TypeScript** - Export proper interfaces for props
2. **Extend base props** - \`extends ViewProps\`, \`extends PressableProps\`
3. **Use useTheme()** - Access design tokens for consistent theming
4. **Spread remaining props** - \`{...props}\` for flexibility
5. **Merge styles** - \`[baseStyle, variantStyle, propStyle]\`
6. **Use forwardRef** - When ref access is needed
7. **Add displayName** - For better debugging
`;

// --- Theme Customization Guide ---

const THEME_CUSTOMIZATION_MD = `# Theme Customization Guide

Customize mcellui themes to match your brand.

## Configuration File

The \`mcellui.config.ts\` file controls theming:

\`\`\`ts
// mcellui.config.ts
import { defineConfig } from 'mcellui';

export default defineConfig({
  // Theme preset (color palette)
  theme: 'violet',  // zinc, slate, stone, blue, green, rose, orange, violet

  // Border radius scale
  radius: 'md',     // none, sm, md, lg, full

  // Color scheme preference
  colorScheme: 'system',  // light, dark, system

  // Component paths
  aliases: {
    components: '@/components/ui',
    utils: '@/lib/utils',
  },
});
\`\`\`

## Available Theme Presets

| Theme | Primary Color | Best For |
|-------|--------------|----------|
| zinc | Gray | Neutral, professional |
| slate | Blue-gray | Modern tech |
| stone | Warm gray | Organic, natural |
| blue | Blue | Trust, corporate |
| green | Green | Health, finance |
| rose | Pink/red | Social, creative |
| orange | Orange | Energy, food |
| violet | Purple | Creative, luxury |

## Accessing Theme in Components

\`\`\`tsx
import { useTheme } from '@metacells/mcellui-core';

function MyComponent() {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.card,
      padding: spacing[4],
      borderRadius: radius.lg,
      borderColor: colors.border,
      borderWidth: 1,
    }}>
      <Text style={{
        color: colors.foreground,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.medium,
      }}>
        Themed Content
      </Text>
    </View>
  );
}
\`\`\`

## Color Tokens

Each theme provides these semantic colors:

### Backgrounds
- \`background\` - Main background
- \`foreground\` - Main text color
- \`card\` - Card background
- \`cardForeground\` - Card text color

### Interactive
- \`primary\` - Primary actions
- \`primaryForeground\` - Text on primary
- \`secondary\` - Secondary actions
- \`secondaryForeground\` - Text on secondary

### Semantic
- \`destructive\` - Destructive actions
- \`destructiveForeground\` - Text on destructive
- \`muted\` - Muted backgrounds
- \`mutedForeground\` - Muted text

### Utility
- \`border\` - Border color
- \`input\` - Input border color
- \`ring\` - Focus ring color
- \`accent\` - Accent highlights

## Spacing Scale

\`\`\`ts
const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
};
\`\`\`

## Radius Scale

\`\`\`ts
const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
\`\`\`

## Dark Mode

mcellui automatically handles dark mode:

\`\`\`tsx
import { ThemeProvider } from '@metacells/mcellui-core';

export default function App() {
  return (
    <ThemeProvider colorScheme="system">
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`

Options:
- \`"light"\` - Always light mode
- \`"dark"\` - Always dark mode
- \`"system"\` - Follow device setting

## Custom Colors

To extend or override colors, modify the theme in your provider:

\`\`\`tsx
import { ThemeProvider } from '@metacells/mcellui-core';

const customColors = {
  brand: '#FF6B00',
  brandForeground: '#FFFFFF',
};

export default function App() {
  return (
    <ThemeProvider
      colorScheme="system"
      colors={customColors}
    >
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`
`;

// --- Animation Patterns Guide ---

const ANIMATION_PATTERNS_MD = `# Animation Patterns Guide

Best practices for animations with Reanimated in mcellui.

## Setup

mcellui uses Reanimated 3 for animations:

\`\`\`bash
npx expo install react-native-reanimated
\`\`\`

Add to \`babel.config.js\`:

\`\`\`js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['react-native-reanimated/plugin'],
};
\`\`\`

## Basic Animation Pattern

\`\`\`tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function AnimatedBox() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2);
    opacity.value = withTiming(0.5, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.box, animatedStyle]}>
      <Button onPress={handlePress}>Animate</Button>
    </Animated.View>
  );
}
\`\`\`

## Press Feedback Animation

\`\`\`tsx
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PressableCard({ children, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.95, {
          damping: 15,
          stiffness: 300,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 300,
        });
      }}
      onPress={onPress}
      style={animatedStyle}
    >
      {children}
    </AnimatedPressable>
  );
}
\`\`\`

## Enter/Exit Animations

\`\`\`tsx
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

function AnimatedList({ items }) {
  return (
    <View>
      {items.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeIn.delay(index * 100).duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <ListItem item={item} />
        </Animated.View>
      ))}
    </View>
  );
}
\`\`\`

## Layout Animations

\`\`\`tsx
import Animated, { Layout } from 'react-native-reanimated';

function ReorderableList({ items }) {
  return (
    <View>
      {items.map((item) => (
        <Animated.View
          key={item.id}
          layout={Layout.springify().damping(15)}
        >
          <ListItem item={item} />
        </Animated.View>
      ))}
    </View>
  );
}
\`\`\`

## Spring Configurations

\`\`\`tsx
// Bouncy (playful UI)
withSpring(value, {
  damping: 10,
  stiffness: 100,
});

// Snappy (quick feedback)
withSpring(value, {
  damping: 15,
  stiffness: 300,
});

// Smooth (elegant transitions)
withSpring(value, {
  damping: 20,
  stiffness: 200,
});

// iOS-like (native feel)
withSpring(value, {
  damping: 18,
  stiffness: 250,
  mass: 1,
});
\`\`\`

## Gesture-Driven Animations

\`\`\`tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function DraggableCard() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text>Drag me!</Text>
      </Animated.View>
    </GestureDetector>
  );
}
\`\`\`

## Performance Tips

1. **Use worklets** - Keep animation logic on UI thread
2. **Avoid setState** - Use shared values instead
3. **Use native driver** - Reanimated does this automatically
4. **Batch animations** - Combine multiple withSpring calls
5. **Limit layout animations** - They can be expensive
6. **Profile on device** - Simulator performance differs

## Common Animation Presets

\`\`\`tsx
// Button press
const buttonPress = {
  onPressIn: () => { scale.value = withSpring(0.97); },
  onPressOut: () => { scale.value = withSpring(1); },
};

// Card hover (web)
const cardHover = {
  onHoverIn: () => { translateY.value = withSpring(-4); },
  onHoverOut: () => { translateY.value = withSpring(0); },
};

// Toggle switch
const toggle = (isOn: boolean) => {
  translateX.value = withSpring(isOn ? 20 : 0);
  backgroundColor.value = withTiming(isOn ? '#22C55E' : '#E5E7EB');
};

// Accordion expand
const expand = (isExpanded: boolean) => {
  height.value = withSpring(isExpanded ? 'auto' : 0);
  rotation.value = withSpring(isExpanded ? 180 : 0);
};
\`\`\`
`;

// --- Accessibility Guide ---

const ACCESSIBILITY_MD = `# Accessibility Guide

Making mcellui components accessible on iOS and Android.

## Core Principles

1. **Perceivable** - Content can be perceived by all users
2. **Operable** - UI can be operated by all users
3. **Understandable** - Content is understandable
4. **Robust** - Works with assistive technologies

## Accessibility Props

React Native provides these accessibility props:

\`\`\`tsx
<View
  accessible={true}
  accessibilityLabel="Send message button"
  accessibilityHint="Double tap to send your message"
  accessibilityRole="button"
  accessibilityState={{
    disabled: false,
    selected: false,
    checked: undefined,
    expanded: undefined,
  }}
/>
\`\`\`

## Button Accessibility

\`\`\`tsx
function AccessibleButton({ onPress, disabled, children }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      accessibilityState={{ disabled }}
    >
      {children}
    </Pressable>
  );
}
\`\`\`

## Form Input Accessibility

\`\`\`tsx
function AccessibleInput({
  label,
  error,
  value,
  onChangeText,
  ...props
}) {
  const inputRef = useRef(null);

  return (
    <View>
      <Text
        accessible={true}
        accessibilityRole="text"
        onPress={() => inputRef.current?.focus()}
      >
        {label}
      </Text>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={error || undefined}
        accessibilityState={{
          disabled: props.editable === false,
        }}
        {...props}
      />
      {error && (
        <Text
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
\`\`\`

## Checkbox/Switch Accessibility

\`\`\`tsx
function AccessibleCheckbox({ checked, onChange, label }) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <CheckIcon />}
      </View>
      <Text>{label}</Text>
    </Pressable>
  );
}

function AccessibleSwitch({ value, onValueChange, label }) {
  return (
    <View accessible={true} accessibilityRole="switch">
      <Text>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}
\`\`\`

## Image Accessibility

\`\`\`tsx
// Decorative image (no a11y needed)
<Image
  source={decorativePattern}
  accessible={false}
/>

// Informative image
<Image
  source={productPhoto}
  accessible={true}
  accessibilityLabel="Blue running shoes, side view"
/>

// Interactive image
<Pressable
  onPress={openGallery}
  accessible={true}
  accessibilityRole="imagebutton"
  accessibilityLabel="Product photo, tap to enlarge"
>
  <Image source={productPhoto} />
</Pressable>
\`\`\`

## List Accessibility

\`\`\`tsx
function AccessibleList({ items }) {
  return (
    <FlatList
      data={items}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel={\`List of \${items.length} items\`}
      renderItem={({ item, index }) => (
        <View
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel={\`Item \${index + 1} of \${items.length}: \${item.title}\`}
        >
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
\`\`\`

## Modal/Dialog Accessibility

\`\`\`tsx
function AccessibleDialog({ visible, title, onClose, children }) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel={title}
      >
        <Text accessibilityRole="header">{title}</Text>
        {children}
        <Button
          onPress={onClose}
          accessibilityLabel="Close dialog"
        >
          Close
        </Button>
      </View>
    </Modal>
  );
}
\`\`\`

## Focus Management

\`\`\`tsx
import { AccessibilityInfo, findNodeHandle } from 'react-native';

function FocusExample() {
  const errorRef = useRef(null);

  const handleError = () => {
    // Move focus to error message
    const node = findNodeHandle(errorRef.current);
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  };

  return (
    <View>
      <TextInput onSubmitEditing={validate} />
      <Text
        ref={errorRef}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        {error}
      </Text>
    </View>
  );
}
\`\`\`

## Screen Reader Announcements

\`\`\`tsx
import { AccessibilityInfo } from 'react-native';

function announceForAccessibility(message: string) {
  AccessibilityInfo.announceForAccessibility(message);
}

// Usage
const handleSubmit = async () => {
  await submitForm();
  announceForAccessibility('Form submitted successfully');
};
\`\`\`

## Testing Accessibility

### iOS (VoiceOver)
1. Settings > Accessibility > VoiceOver
2. Or triple-click home/side button
3. Swipe to navigate, double-tap to activate

### Android (TalkBack)
1. Settings > Accessibility > TalkBack
2. Swipe to navigate, double-tap to activate

### Automated Testing

\`\`\`tsx
import { render } from '@testing-library/react-native';

test('button is accessible', () => {
  const { getByRole } = render(
    <Button onPress={jest.fn()}>Submit</Button>
  );

  const button = getByRole('button');
  expect(button).toHaveAccessibleName('Submit');
});
\`\`\`

## Accessibility Checklist

- [ ] All interactive elements have labels
- [ ] Images have alt text (or marked decorative)
- [ ] Focus order is logical
- [ ] Color is not only indicator
- [ ] Touch targets are 44x44pt minimum
- [ ] Text scales with system settings
- [ ] Animations can be disabled
- [ ] Error messages are announced
- [ ] Forms have proper labels
- [ ] Modals trap focus correctly
`;
