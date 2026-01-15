# ADR 001: Theming and Font System

**Status:** Accepted
**Date:** 2025-01-15
**Authors:** nativeui team

## Context

nativeui is a copy-paste UI component library for React Native, inspired by shadcn/ui. Like shadcn, we want users to easily customize the look and feel of their apps by changing a few tokens.

Fonts are a critical part of any design system. Users need to:
1. Use the default fonts out of the box
2. Swap fonts globally with minimal configuration
3. Optionally use different fonts for headlines vs body text

### How shadcn/ui handles fonts

shadcn/ui uses CSS variables with just 2 font tokens:
```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;
}
```

Components inherit fonts from the body element. Users customize by changing the CSS variables.

### React Native constraints

Unlike web, React Native:
- Has no CSS variables or inheritance
- Requires explicit `fontFamily` on each Text component
- Needs fonts loaded via `expo-font` or similar before use
- Uses different font loading mechanisms per platform

## Decision

We implement a **3-font token system** that extends shadcn's approach:

```typescript
type Fonts = {
  sans: string;     // Body text, UI elements
  heading: string;  // Headlines (h1-h4)
  mono: string;     // Code, monospace text
};
```

### Default configuration

```typescript
const defaultFonts: Fonts = {
  sans: 'Geist_400Regular',
  heading: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
};
```

By default, `heading` uses a bold variant of the same font family as `sans`, ensuring visual consistency out of the box.

### ThemeProvider accepts font overrides

```tsx
<ThemeProvider
  fonts={{
    sans: 'Inter_400Regular',
    heading: 'PlayfairDisplay_700Bold',
    mono: 'FiraCode_400Regular',
  }}
>
  <App />
</ThemeProvider>
```

Users only need to override what they want to change. Partial overrides are merged with defaults.

### Typography presets use font tokens

```typescript
const typography = {
  h1: {
    fontFamily: fonts.heading,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    // ...
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    // ...
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    // ...
  },
};
```

### Font loading remains user responsibility

Like shadcn, we don't handle font loading internally. Users load fonts in their app entry point:

```tsx
// App entry (e.g., _layout.tsx)
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    // ... other fonts
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider fonts={{ sans: 'Inter_400Regular' }}>
      <MyApp />
    </ThemeProvider>
  );
}
```

## Alternatives Considered

### Alternative 1: Just 2 fonts (exact shadcn mirror)

```typescript
type Fonts = {
  sans: string;
  mono: string;
};
```

**Rejected because:** Different headline fonts are a very common design pattern (display/serif for headlines, clean sans for body). Without a `heading` token, users would need to manually override all typography presets.

### Alternative 2: More granular fonts

```typescript
type Fonts = {
  heading: string;
  body: string;
  ui: string;
  mono: string;
  caption: string;
};
```

**Rejected because:** Over-engineering. Adds complexity without clear benefit. Users who need this level of control can override typography presets directly.

### Alternative 3: Font weight variants in tokens

```typescript
type Fonts = {
  sans: {
    regular: string;
    medium: string;
    bold: string;
  };
  // ...
};
```

**Rejected because:** React Native requires separate font files for each weight. This would force users to load many fonts upfront. Instead, we provide `geistFontFamily` with all variants for users who want fine-grained control.

## Consequences

### Positive

- **Simple API** - Just 3 tokens to understand and customize
- **Sensible defaults** - Works great out of the box with Geist
- **Common pattern supported** - Easy to use display fonts for headlines
- **shadcn-aligned** - Familiar mental model for shadcn users
- **Flexible** - Users can still override typography presets for edge cases

### Negative

- **Font loading not automatic** - Users must load fonts themselves (intentional, matches shadcn philosophy)
- **No runtime font weight switching** - Users need separate font files per weight (React Native limitation)

### Neutral

- **3 fonts vs shadcn's 2** - Minor deviation, but justified by common use case

## Implementation

Files to modify:
- `packages/core/src/theme/typography.ts` - Add `Fonts` type and defaults
- `packages/core/src/theme/ThemeProvider.tsx` - Accept `fonts` prop, merge with defaults
- `packages/core/src/theme/index.ts` - Export new types
- Typography presets updated to use `fonts.heading`, `fonts.sans`, `fonts.mono`

## References

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Custom Fonts Discussion](https://github.com/shadcn-ui/ui/discussions/4143)
- [Expo Font Documentation](https://docs.expo.dev/versions/latest/sdk/font/)
