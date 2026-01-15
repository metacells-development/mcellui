# NativeWind Styling System

## Overview

nativeui verwendet NativeWind (Tailwind CSS für React Native) für Styling. Dies ermöglicht:

- **Tailwind Classes** - Gleiche Syntax wie im Web
- **CSS Variables** - Token Override via CSS
- **Dark Mode** - Automatisch via `.dark` Class
- **shadcn-kompatibel** - Gleicher Ansatz wie shadcn/ui

## Setup

### 1. Dependencies

```bash
npm install nativewind tailwindcss
npm install --save-dev tailwindcss
```

### 2. Tailwind Config

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
```

### 3. Global CSS

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;

  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;

  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 9%;

  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 262 83% 58%;

  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;

  --card: 0 0% 7%;
  --card-foreground: 0 0% 98%;

  --primary: 263 70% 73%;
  --primary-foreground: 0 0% 9%;

  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 98%;

  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 64%;

  --destructive: 0 62% 50%;
  --destructive-foreground: 0 0% 98%;

  --border: 0 0% 15%;
  --input: 0 0% 15%;
  --ring: 263 70% 73%;
}
```

### 4. Metro Config

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

### 5. App Entry

```tsx
// app/_layout.tsx
import '../global.css';

export default function RootLayout() {
  // ...
}
```

---

## Usage

### Basic Styling

```tsx
import { View, Text } from 'react-native';

// Tailwind classes wie im Web
<View className="bg-background p-4 rounded-lg border border-border">
  <Text className="text-foreground text-lg font-semibold">
    Hello World
  </Text>
  <Text className="text-muted-foreground text-sm">
    Subtitle text
  </Text>
</View>
```

### Component Example: Button

```tsx
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'border border-input bg-background',
        ghost: 'bg-transparent',
      },
      size: {
        default: 'h-12 px-4',
        sm: 'h-9 px-3',
        lg: 'h-14 px-6',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      ghost: 'text-foreground',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ComponentProps<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <Text className={cn(buttonTextVariants({ variant, size }))}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### Dark Mode

```tsx
import { useColorScheme } from 'nativewind';

function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    // NativeWind wendet automatisch .dark class an
    <View className="flex-1 bg-background">
      <Button onPress={toggleColorScheme}>
        {colorScheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </Button>
    </View>
  );
}
```

---

## Token Customization

### Option 1: Edit global.css

```css
/* Eigene Brand Colors */
:root {
  --primary: 340 82% 52%;        /* Pink statt Violet */
  --primary-foreground: 0 0% 100%;
  --radius: 1rem;                 /* Mehr Rundung */
}
```

### Option 2: Theme Presets via CSS

```css
/* themes/rose.css */
:root {
  --primary: 346 77% 50%;
  --primary-foreground: 0 0% 100%;
}

/* themes/blue.css */
:root {
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
}
```

```tsx
// Import gewünschtes Theme
import '../themes/rose.css';
```

### Option 3: Runtime Override (Advanced)

```tsx
import { vars } from 'nativewind';

// CSS Variables zur Runtime setzen
<View style={vars({ '--primary': '340 82% 52%' })}>
  <Button>Pink Button</Button>
</View>
```

---

## Migration von StyleSheet

### Vorher (StyleSheet)

```tsx
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@nativeui/core';

function Card() {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.card,
        padding: spacing[4],
        borderRadius: radius.lg,
        borderColor: colors.border,
      }
    ]}>
      <Text style={[styles.title, { color: colors.cardForeground }]}>
        Title
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Nachher (NativeWind)

```tsx
import { View, Text } from 'react-native';

function Card() {
  return (
    <View className="bg-card p-4 rounded-lg border border-border">
      <Text className="text-card-foreground text-lg font-semibold">
        Title
      </Text>
    </View>
  );
}
```

---

## Utilities

### cn() Helper

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
<View className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary',
  isDisabled && 'opacity-50',
  className
)}>
```

---

## Best Practices

1. **Semantic Colors nutzen** - `bg-primary` statt `bg-violet-500`
2. **CSS Variables für Customization** - Nicht hardcoded colors
3. **cn() für conditional classes** - Sauberes Merging
4. **cva() für Variants** - Type-safe variant management
5. **Responsive mit Breakpoints** - `sm:`, `md:`, `lg:` prefixes

---

## Referenzen

- [NativeWind Dokumentation](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [class-variance-authority](https://cva.style/docs)
