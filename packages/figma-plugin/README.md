# @nativeui/figma-plugin

Figma Plugin für nativeui - Design Token Sync & Component Export.

## Features

### Phase 3.1: Token Sync (aktuell)

- **Figma Variables → nativeui Theme**: Extrahiere Design Tokens aus Figma Variable Collections
- **Light/Dark Mode Support**: Automatische Erkennung und Zuordnung von Modes
- **Config Generator**: Generiert `nativeui.config.ts` zum Copy-Paste

### Phase 3.2: Component Export (geplant)

- Component Analysis Engine
- Mapping zu nativeui Components
- Code-Vorschau in Figma

### Phase 3.3: Asset Export (geplant)

- Icon Export (SVG → React Native SVG)
- Image Export (@1x, @2x, @3x)

## Installation in Figma

1. Öffne Figma Desktop
2. Gehe zu `Plugins > Development > Import plugin from manifest...`
3. Wähle die `manifest.json` aus `packages/figma-plugin/`

## Development

```bash
# Dependencies installieren
npm install

# Build (einmalig)
npm run build

# Watch Mode (für Entwicklung)
npm run dev
```

## Plugin-Struktur

```
packages/figma-plugin/
├── manifest.json           # Figma Plugin Config
├── package.json
├── tsconfig.json
├── esbuild.config.js       # Build Configuration
├── src/
│   ├── main.ts             # Figma Sandbox Entry
│   ├── ui.tsx              # React UI
│   └── lib/
│       ├── tokens/
│       │   ├── extractor.ts    # Figma Variables → Tokens
│       │   ├── transformer.ts  # Tokens → nativeui Format
│       │   └── emitter.ts      # nativeui.config.ts Generator
│       └── types.ts
└── dist/                   # Build Output (gitignored)
    ├── main.js
    └── ui.html
```

## Token Mapping

### Colors

| Figma Variable | nativeui Token |
|----------------|----------------|
| `Colors/Primary` | `primary` |
| `Colors/Primary Foreground` | `primaryForeground` |
| `Colors/Background` | `background` |
| `Colors/Foreground` | `foreground` |
| ... | ... |

### Spacing

| Figma Variable | nativeui Token |
|----------------|----------------|
| `Spacing/4` oder 4px | `spacing[1]` |
| `Spacing/8` oder 8px | `spacing[2]` |
| `Spacing/16` oder 16px | `spacing[4]` |
| ... | ... |

### Radius

| Figma Variable | nativeui Token |
|----------------|----------------|
| `Radius/sm` oder 4px | `radius.sm` |
| `Radius/md` oder 8px | `radius.md` |
| `Radius/lg` oder 12px | `radius.lg` |
| ... | ... |

## Figma Variables Setup

Für optimale Kompatibilität, erstelle eine Variable Collection in Figma mit folgender Struktur:

```
Collection: "nativeui" (oder beliebiger Name)
├── Modes: "Light", "Dark"
├── Colors/
│   ├── background
│   ├── foreground
│   ├── primary
│   ├── primary-foreground
│   ├── secondary
│   ├── secondary-foreground
│   ├── muted
│   ├── muted-foreground
│   ├── accent
│   ├── accent-foreground
│   ├── destructive
│   ├── destructive-foreground
│   ├── border
│   ├── input
│   └── ring
├── Spacing/
│   ├── 1 (4px)
│   ├── 2 (8px)
│   ├── 3 (12px)
│   ├── 4 (16px)
│   └── ...
└── Radius/
    ├── sm (4px)
    ├── md (8px)
    ├── lg (12px)
    └── full (9999px)
```

## Output Beispiel

```typescript
import { defineConfig } from '@nativeui/core';

export default defineConfig({
  theme: {
    colors: {
      light: {
        background: '#FFFFFF',
        foreground: '#0F172A',
        primary: '#6366F1',
        primaryForeground: '#FFFFFF',
        // ...
      },
      dark: {
        background: '#0F172A',
        foreground: '#F8FAFC',
        primary: '#818CF8',
        primaryForeground: '#FFFFFF',
        // ...
      },
    },
    spacing: {
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      // ...
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
      // ...
    },
  },
});
```
