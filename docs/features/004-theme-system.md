# Feature: Theme System

Ein flexibles Design Token System mit Dark Mode, Custom Themes und Theme Gallery.

## Design Tokens

```typescript
// packages/core/src/tokens.ts

export const tokens = {
  colors: {
    // Backgrounds mit Depth
    bg: {
      base: '#FFFFFF',
      elevated: '#FAFAFA',
      overlay: 'rgba(255,255,255,0.8)',
      sunken: '#F5F5F5',
    },

    // Primärfarben
    primary: {
      DEFAULT: '#6366F1',
      soft: '#EEF2FF',
      hover: '#4F46E5',
    },

    // Grays
    gray: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },

    // Semantic
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 5,
    },
    glow: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 0,
    },
  },

  radius: {
    none: 0,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
};
```

## Dark Mode

```typescript
// Automatische Dark Mode Tokens
const darkTokens = {
  colors: {
    bg: {
      base: '#09090B',
      elevated: '#18181B',
      overlay: 'rgba(0,0,0,0.8)',
      sunken: '#000000',
    },
    gray: {
      50: '#18181B',
      100: '#27272A',
      // ... inverted
      900: '#FAFAFA',
    },
  },
  shadows: {
    // Subtilere Shadows im Dark Mode
    sm: { ...tokens.shadows.sm, shadowOpacity: 0.2 },
    md: { ...tokens.shadows.md, shadowOpacity: 0.3 },
  },
};
```

## Theme Provider

```tsx
// components/theme-provider.tsx
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext<ThemeContextType>(null);

export const ThemeProvider = ({ children, defaultTheme = 'system' }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(defaultTheme);

  const activeTheme = theme === 'system' ? systemScheme : theme;
  const tokens = activeTheme === 'dark' ? darkTokens : lightTokens;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

## Custom Themes

```typescript
// nativeui.config.ts
export default defineConfig({
  theme: {
    // Override einzelner Tokens
    colors: {
      primary: '#EC4899', // Pink statt Indigo
    },
    radius: {
      default: 16, // Rundere Ecken
    },
  },
});
```

## Theme Presets

```bash
npx nativeui theme add midnight-black
npx nativeui theme add candy-pop
npx nativeui theme add earth-tones
```

**Verfügbare Presets:**
- `default` – Indigo/Neutral
- `midnight-black` – Dunkles Theme mit Akzenten
- `candy-pop` – Bunte, verspielte Farben
- `earth-tones` – Warme, natürliche Farben
- `minimal` – Schwarz/Weiß mit einem Akzent
- `neon` – Leuchtende Akzentfarben

## Theme Gallery (Web)

```
┌─────────────────────────────────────────────────────────┐
│  Theme Gallery                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ ░░░░░░░ │  │ ▓▓▓▓▓▓▓ │  │ ████████│  │ ▒▒▒▒▒▒▒ │   │
│  │  Vapor  │  │ Midnight│  │  Candy  │  │  Earth  │   │
│  │  Wave   │  │  Black  │  │  Pop    │  │  Tones  │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
│  [Create Theme]  [Import]  [Export]                     │
└─────────────────────────────────────────────────────────┘
```

## AI Theme Generator

```typescript
// Im Playground
const generateTheme = async (prompt: string) => {
  // "Create a theme inspired by Spotify"
  // → Generiert passende Farben, Shadows, etc.

  return {
    colors: {
      primary: '#1DB954',
      bg: { base: '#121212', elevated: '#282828' },
      // ...
    },
  };
};
```
