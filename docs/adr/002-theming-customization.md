# ADR 002: Theming Customization (Radius, Presets, Colors)

**Status:** Accepted
**Date:** 2025-01-15
**Authors:** nativeui team
**Supersedes:** -
**Related:** ADR-001 (Fonts)

## Context

nativeui aims to provide a shadcn-like experience for React Native. shadcn/ui excels at theming with:

1. **Theme presets** - Pre-made color schemes (zinc, slate, blue, green, rose, etc.)
2. **Base radius** - Single value that controls roundness across all components
3. **Color customization** - Override semantic colors via CSS variables

Users expect to quickly customize the look of their app without touching individual components. A well-designed theming system allows:

- Quick brand alignment with preset themes
- Fine-grained control when needed
- Consistent visual language across all components

## Decision

We implement three theming features that mirror shadcn's approach:

### 1. Base Radius

A single `radius` prop on ThemeProvider that scales all component border radii:

```tsx
type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';

<ThemeProvider radius="lg">
```

| Preset | Base Value | Effect |
|--------|------------|--------|
| `none` | 0 | Sharp corners, brutalist |
| `sm` | 4 | Subtle rounding |
| `md` | 8 | Default, balanced |
| `lg` | 12 | Soft, friendly |
| `full` | 9999 | Pill shapes, playful |

Component radii derive from the base:
- `radius.sm` = base * 0.5
- `radius.md` = base
- `radius.lg` = base * 1.5
- `radius.xl` = base * 2
- `radius.full` = 9999

### 2. Theme Presets

Pre-defined color schemes that can be applied with a single prop:

```tsx
type ThemePreset = 'zinc' | 'slate' | 'stone' | 'neutral' | 'blue' | 'green' | 'rose' | 'orange' | 'violet';

<ThemeProvider theme="rose">
```

Each preset defines:
- Primary color (brand color for buttons, links, focus rings)
- Full semantic color palette derived from the primary

**Initial presets:**

| Preset | Primary | Character |
|--------|---------|-----------|
| `zinc` | Gray-neutral | Clean, minimal (default) |
| `slate` | Blue-gray | Professional, tech |
| `stone` | Warm gray | Earthy, organic |
| `blue` | Blue | Trust, corporate |
| `green` | Green | Growth, success |
| `rose` | Pink-red | Warm, friendly |
| `orange` | Orange | Energy, creativity |
| `violet` | Purple | Premium, creative |

### 3. Color Overrides

Fine-grained control over semantic colors:

```tsx
<ThemeProvider
  colors={{
    primary: '#8B5CF6',
    primaryForeground: '#FFFFFF',
    destructive: '#EF4444',
    // ... partial overrides merged with theme/defaults
  }}
>
```

Overridable colors:
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `destructive`, `destructiveForeground`
- `muted`, `mutedForeground`
- `accent`, `accentForeground`
- `background`, `foreground`
- `card`, `cardForeground`
- `border`, `input`, `ring`

### Priority / Merge Order

Colors are resolved in this order (later wins):

1. **Base colors** (light/dark defaults)
2. **Theme preset** (if specified)
3. **Color overrides** (if specified)

```tsx
// Example: Rose theme with custom primary
<ThemeProvider
  theme="rose"
  colors={{ primary: '#FF1493' }}  // Override rose's primary
>
```

## Alternatives Considered

### Alternative 1: CSS-in-JS Theme Object

Pass a complete theme object like styled-components/emotion:

```tsx
<ThemeProvider theme={{
  colors: { ... },
  radius: { ... },
  // everything
}}>
```

**Rejected because:** Too verbose for simple customization. Users shouldn't need to define 50+ tokens to change a color.

### Alternative 2: Tailwind-style Config File

Use a config file like `mcellui.config.js`:

```js
module.exports = {
  theme: 'rose',
  radius: 'lg',
}
```

**Rejected because:** Adds build complexity. React Native doesn't have the same config-file ecosystem as web. Props on ThemeProvider are more idiomatic.

### Alternative 3: No Presets, Only Color Overrides

Skip presets, let users override individual colors.

**Rejected because:** Most users want quick wins. Presets provide immediate value. Power users can still override.

## Consequences

### Positive

- **Quick customization** - Change entire app look with one prop
- **Consistent with shadcn** - Familiar mental model
- **Progressive disclosure** - Simple (presets) to advanced (overrides)
- **Type-safe** - All options are typed and validated

### Negative

- **Bundle size** - Preset definitions add ~2-3KB
- **Learning curve** - Users need to understand priority order
- **Maintenance** - Presets need to be kept visually consistent

### Neutral

- **No runtime theme switching for presets** - Changing `theme` prop requires re-render (acceptable)

## Implementation

### Files to Create/Modify

1. `packages/core/src/theme/presets.ts` - Theme preset definitions
2. `packages/core/src/theme/radius.ts` - Update with scaling logic
3. `packages/core/src/theme/ThemeProvider.tsx` - Add props, merge logic
4. `packages/core/src/theme/index.ts` - Export new types

### API Surface

```tsx
interface ThemeProviderProps {
  // Existing
  defaultColorScheme?: ColorSchemePreference;
  fonts?: Partial<Fonts>;

  // New
  theme?: ThemePreset;
  radius?: RadiusPreset;
  colors?: Partial<ThemeColors>;

  children: ReactNode;
}
```

## References

- [shadcn/ui Themes](https://ui.shadcn.com/themes)
- [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
