# Feature: Advanced Theming

> ⚠️ **DEPRECATED**: Dieser Ansatz wird durch NativeWind ersetzt.
> Siehe [NATIVEWIND-STYLING.md](./NATIVEWIND-STYLING.md) für den neuen Ansatz.
> Siehe [ADR-003](../adr/003-nativewind-migration.md) für die Entscheidung.

**Status:** Deprecated (wird durch NativeWind ersetzt)
**Priority:** High
**Related ADR:** [ADR-002](../adr/002-theming-customization.md), [ADR-003](../adr/003-nativewind-migration.md)

## Overview

nativeui provides a powerful theming system inspired by shadcn/ui. With minimal configuration, users can completely transform the look of their app.

## Features

### 1. Base Radius

Control the roundness of all components with a single prop.

```tsx
import { ThemeProvider } from '@nativeui/core';

// Sharp, brutalist design
<ThemeProvider radius="none">

// Soft, friendly design
<ThemeProvider radius="lg">

// Pill-shaped buttons and inputs
<ThemeProvider radius="full">
```

#### Radius Presets

| Preset | Base | sm | md | lg | xl | 2xl | full |
|--------|------|----|----|----|----|-----|------|
| `none` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `sm` | 4 | 2 | 4 | 6 | 8 | 12 | 9999 |
| `md` | 8 | 4 | 8 | 12 | 16 | 24 | 9999 |
| `lg` | 12 | 6 | 12 | 18 | 24 | 32 | 9999 |
| `full` | 9999 | 9999 | 9999 | 9999 | 9999 | 9999 | 9999 |

#### Usage in Components

```tsx
const { radius } = useTheme();

<View style={{ borderRadius: radius.md }}>
  <Button />  // Uses radius.md internally
</View>
```

---

### 2. Theme Presets

Pre-designed color schemes for instant brand alignment.

```tsx
// Professional gray theme (default)
<ThemeProvider theme="zinc">

// Vibrant, energetic theme
<ThemeProvider theme="orange">

// Premium, creative theme
<ThemeProvider theme="violet">
```

#### Available Presets

| Preset | Primary Color | Best For |
|--------|---------------|----------|
| `zinc` | `#71717A` | Minimal, clean apps |
| `slate` | `#64748B` | Professional, tech |
| `stone` | `#78716C` | Organic, earthy |
| `blue` | `#3B82F6` | Trust, corporate |
| `green` | `#22C55E` | Health, finance, success |
| `rose` | `#F43F5E` | Social, lifestyle |
| `orange` | `#F97316` | Creative, energy |
| `violet` | `#8B5CF6` | Premium, creative |

#### Preset Color Mapping

Each preset generates a full semantic color palette:

```typescript
// Example: 'blue' preset generates
{
  primary: '#3B82F6',
  primaryForeground: '#FFFFFF',
  // Derived colors for light mode
  light: {
    background: '#FFFFFF',
    foreground: '#0F172A',
    card: '#FFFFFF',
    cardForeground: '#0F172A',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#DBEAFE',       // blue-100
    accentForeground: '#1E40AF', // blue-800
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#3B82F6',
  },
  // Derived colors for dark mode
  dark: {
    background: '#0F172A',
    foreground: '#F8FAFC',
    // ...
  }
}
```

---

### 3. Color Overrides

Fine-tune individual colors while keeping the rest of the theme.

```tsx
<ThemeProvider
  theme="blue"
  colors={{
    primary: '#6366F1',  // Use indigo instead of blue
    destructive: '#DC2626',
  }}
>
```

#### Overridable Colors

**Semantic Colors:**
- `primary` - Brand color, buttons, links
- `primaryForeground` - Text on primary background
- `secondary` - Secondary actions
- `secondaryForeground` - Text on secondary background
- `destructive` - Delete, error states
- `destructiveForeground` - Text on destructive background
- `muted` - Subtle backgrounds
- `mutedForeground` - Subtle text
- `accent` - Highlights, hover states
- `accentForeground` - Text on accent background

**Surface Colors:**
- `background` - App background
- `foreground` - Primary text
- `card` - Card backgrounds
- `cardForeground` - Card text
- `border` - Borders, dividers
- `input` - Input borders
- `ring` - Focus rings

#### Light/Dark Specific Overrides

```tsx
<ThemeProvider
  colors={{
    // Applied to both modes
    primary: '#8B5CF6',
  }}
  lightColors={{
    // Light mode only
    background: '#FAFAFA',
  }}
  darkColors={{
    // Dark mode only
    background: '#09090B',
  }}
>
```

---

## Combined Usage

All theming props can be combined:

```tsx
<ThemeProvider
  // Color scheme
  defaultColorScheme="system"

  // Theme preset
  theme="violet"

  // Radius
  radius="lg"

  // Fonts (from ADR-001)
  fonts={{
    sans: 'Inter_400Regular',
    heading: 'CalSans_700Bold',
    mono: 'JetBrainsMono_400Regular',
  }}

  // Color overrides
  colors={{
    primary: '#7C3AED',
    ring: '#7C3AED',
  }}
>
  <App />
</ThemeProvider>
```

---

## API Reference

### ThemeProviderProps

```typescript
interface ThemeProviderProps {
  /** Color scheme preference */
  defaultColorScheme?: 'light' | 'dark' | 'system';

  /** Theme preset */
  theme?: 'zinc' | 'slate' | 'stone' | 'blue' | 'green' | 'rose' | 'orange' | 'violet';

  /** Base radius preset */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  /** Custom fonts */
  fonts?: Partial<Fonts>;

  /** Color overrides (both modes) */
  colors?: Partial<ThemeColors>;

  /** Light mode color overrides */
  lightColors?: Partial<ThemeColors>;

  /** Dark mode color overrides */
  darkColors?: Partial<ThemeColors>;

  children: ReactNode;
}
```

### useTheme Hook

```typescript
const {
  // Existing
  colorScheme,
  isDark,
  setColorScheme,
  colors,
  fonts,
  typography,
  spacing,

  // New
  radius,        // Computed radius tokens
  themePreset,   // Current preset name or undefined
} = useTheme();
```

---

## Implementation Checklist

- [ ] Base radius scaling system
- [ ] Radius preset definitions
- [ ] Theme preset color definitions (8 presets)
- [ ] Color override merging logic
- [ ] Light/dark specific overrides
- [ ] Update ThemeProvider props
- [ ] Update useTheme return value
- [ ] Export new types
- [ ] Update demo app with theme selector
- [ ] Documentation

---

## Design Decisions

### Why these specific presets?

The 8 presets cover the most common brand color families:
- **Neutrals** (zinc, slate, stone) - For minimal, professional apps
- **Trust colors** (blue, green) - Corporate, finance, health
- **Warm colors** (rose, orange) - Social, lifestyle, creative
- **Premium** (violet) - Luxury, creative, unique

### Why not more presets?

Following shadcn's philosophy: provide good defaults, let users customize. Too many presets create choice paralysis. Users who need specific colors can use overrides.

### Why base radius instead of per-component?

Components should feel cohesive. When you want "rounded UI", you want it everywhere. Per-component radius breaks visual consistency and requires more configuration.
