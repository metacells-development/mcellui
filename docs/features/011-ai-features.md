# Feature: AI Features

KI-gestützte Tools für Component Generation und Theme Creation.

## AI Component Generator

Im Playground: Beschreibe was du willst, bekomme Code.

### Interface

```
┌─────────────────────────────────────────────────────────┐
│  AI Generator                                    [✨]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ A pricing card with monthly/yearly toggle,      │   │
│  │ three tiers, and a "most popular" badge on the  │   │
│  │ middle tier.                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Generate]                                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Generated Component:                            │   │
│  │                                                 │   │
│  │ <Card>                                          │   │
│  │   <SegmentedControl                             │   │
│  │     options={['Monthly', 'Yearly']}             │   │
│  │   />                                            │   │
│  │   <PricingTier                                  │   │
│  │     name="Basic"                                │   │
│  │     price={9}                                   │   │
│  │   />                                            │   │
│  │   ...                                           │   │
│  │ </Card>                                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Copy] [Add to Project] [Refine]                       │
└─────────────────────────────────────────────────────────┘
```

### Capabilities

```typescript
const aiGenerator = {
  // Beschreibung → Code
  generateFromDescription: async (prompt: string) => {
    // "A pricing card with monthly/yearly toggle"
    return {
      code: '<PricingCard ... />',
      components: ['card', 'segmented-control', 'badge'],
      suggestedBlocks: ['pricing-table'],
    };
  },

  // Screenshot → Code
  generateFromImage: async (image: File) => {
    // Analysiert UI Screenshot
    // Generiert passenden nativeui Code
  },

  // Verbesserungen vorschlagen
  suggestImprovements: async (code: string) => {
    return {
      suggestions: [
        'Add loading state for async actions',
        'Consider adding haptic feedback',
        'Missing accessibility label',
      ],
    };
  },
};
```

### Refinement Loop

```
User: "A login form"
AI: [Generiert Basic Login]

User: "Add social login buttons"
AI: [Fügt Google, Apple, etc. hinzu]

User: "Make it more modern with blur background"
AI: [Fügt BlurView und Styling hinzu]
```

## AI Theme Generator

Erstelle Themes aus Beschreibungen oder Inspirationen.

### Interface

```
┌─────────────────────────────────────────────────────────┐
│  Theme Generator                                 [🎨]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Create from:                                           │
│  ○ Description                                          │
│  ○ Brand URL                                            │
│  ○ Image/Screenshot                                     │
│  ○ Color Palette                                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Create a theme inspired by Spotify - dark with  │   │
│  │ vibrant green accents and modern feel           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Generate Theme]                                       │
│                                                         │
│  Preview:                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ ■ Primary│ │ ■ Bg     │ │ ■ Text   │              │
│  │ #1DB954  │ │ #121212  │ │ #FFFFFF  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
│  [Apply] [Export] [Adjust]                              │
└─────────────────────────────────────────────────────────┘
```

### Generation Methods

```typescript
const themeGenerator = {
  // Aus Beschreibung
  fromDescription: async (prompt: string) => {
    // "Dark theme with neon purple accents"
    return generateTheme(prompt);
  },

  // Aus Brand Website
  fromUrl: async (url: string) => {
    // Extrahiert Farben von Website
    // Generiert passendes Theme
  },

  // Aus Bild
  fromImage: async (image: File) => {
    // Extrahiert dominante Farben
    // Generiert harmonisches Theme
  },

  // Aus Farbpalette
  fromColors: async (colors: string[]) => {
    // Erweitert zu vollem Theme
    // Generiert Shades, Semantic Colors, etc.
  },
};
```

## AI Code Review

Analysiert generierten Code auf Best Practices.

```typescript
const codeReview = {
  analyze: async (code: string) => {
    return {
      issues: [
        {
          type: 'performance',
          message: 'Consider memoizing this callback',
          line: 15,
          suggestion: 'useCallback(() => {...}, [deps])',
        },
        {
          type: 'accessibility',
          message: 'Missing accessibility label',
          line: 23,
          suggestion: 'accessibilityLabel="Submit form"',
        },
      ],
      score: 85, // out of 100
    };
  },
};
```

## Integration mit MCP Server

```typescript
// MCP Tool für AI Features
ai_generate_component: {
  description: 'Generate a component from natural language description',
  parameters: {
    prompt: { type: 'string' },
    style: { enum: ['minimal', 'modern', 'playful'] },
  },
}

ai_generate_theme: {
  description: 'Generate a theme from description or inspiration',
  parameters: {
    prompt: { type: 'string' },
    baseTheme: { enum: ['light', 'dark'] },
  },
}
```

## Privacy & Data

- Keine User-Daten werden gespeichert
- Code wird nicht für Training verwendet
- Opt-in für alle AI Features
- Lokale Alternativen wo möglich
