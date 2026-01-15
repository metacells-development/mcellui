# Feature: Figma Plugin (Phase 3)

> Status: **Phase 3 - Next Up**
> Priority: **High**
> Estimated Effort: **2-3 Wochen**

## Übersicht

Ein Figma Plugin das Design-to-Code Workflows für nativeui ermöglicht. Designer können ihre Designs direkt in funktionierenden React Native Code exportieren.

---

## Ziele

### Primary Goals
1. **Design Token Sync** - Figma Variables ↔ nativeui Theme
2. **Component Export** - Figma Components → nativeui Code
3. **Asset Export** - Icons und Images für React Native

### Secondary Goals
4. **Theme Generator** - Erstelle nativeui Theme aus Figma Styles
5. **Code Preview** - Zeige generierten Code direkt in Figma

### Non-Goals (für später)
- Bidirektionaler Sync (Code → Figma)
- Live Preview der App in Figma
- Automatische Component Detection

---

## User Stories

### Als Designer möchte ich...
- Mein Design System als nativeui Theme exportieren
- Ausgewählte Components als React Native Code exportieren
- Icons und Assets in den richtigen Formaten exportieren
- Sehen welcher Code aus meinem Design generiert wird

### Als Developer möchte ich...
- Design Tokens automatisch synchronisiert bekommen
- Component Code bekommen der zu unserer Codebase passt
- Assets in @1x, @2x, @3x Varianten bekommen
- Keine manuellen Anpassungen am generierten Code machen müssen

---

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                      Figma Plugin                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   UI Layer   │    │  Transform   │    │   Output     │  │
│  │   (React)    │───▶│   Engine     │───▶│  Generator   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Figma Plugin │    │    Token     │    │    Code      │  │
│  │     API      │    │   Mapper     │    │   Emitter    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  nativeui.config │
                    │  components/ui/  │
                    │  assets/         │
                    └──────────────────┘
```

---

## Features im Detail

### 1. Design Token Sync

#### Figma Variables → nativeui Theme

```
Figma Variables Collection: "nativeui"
├── Colors/
│   ├── primary           → colors.primary
│   ├── primary-foreground → colors.primaryForeground
│   ├── secondary         → colors.secondary
│   ├── background        → colors.background
│   ├── foreground        → colors.foreground
│   ├── muted             → colors.muted
│   ├── border            → colors.border
│   └── ...
├── Spacing/
│   ├── 1                 → spacing[1] (4px)
│   ├── 2                 → spacing[2] (8px)
│   ├── 4                 → spacing[4] (16px)
│   └── ...
├── Radius/
│   ├── sm                → radius.sm
│   ├── md                → radius.md
│   ├── lg                → radius.lg
│   └── ...
└── Typography/
    ├── font-size-sm      → fontSize.sm
    ├── font-size-base    → fontSize.base
    └── ...
```

**Output: `nativeui.config.ts`**

```typescript
import { defineConfig } from '@nativeui/core';

export default defineConfig({
  theme: {
    colors: {
      light: {
        primary: '#6366F1',
        primaryForeground: '#FFFFFF',
        secondary: '#F4F4F5',
        // ... aus Figma importiert
      },
      dark: {
        primary: '#818CF8',
        primaryForeground: '#FFFFFF',
        // ... aus Figma Dark Mode
      },
    },
    spacing: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
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

#### Mode Support (Light/Dark)

```
Figma Variable Modes:
├── Light Mode → theme.colors.light
└── Dark Mode  → theme.colors.dark
```

---

### 2. Component Export

#### Supported Component Patterns

| Figma Pattern | nativeui Output |
|--------------|-----------------|
| Button mit Variants | `<Button variant="..." size="..." />` |
| Input mit States | `<Input error={...} disabled={...} />` |
| Card mit Slots | `<Card><CardHeader />...</Card>` |
| Icon Button | `<Button variant="ghost" size="icon" />` |
| Badge | `<Badge variant="..." />` |
| Avatar | `<Avatar src="..." fallback="..." />` |

#### Component Detection

```typescript
// Plugin analysiert Figma Component Properties
interface FigmaComponentAnalysis {
  name: string;           // "Button"
  variants: {
    property: string;     // "Variant"
    options: string[];    // ["primary", "secondary", "outline"]
  }[];
  slots: {
    name: string;         // "icon"
    type: 'icon' | 'text' | 'component';
  }[];
  states: string[];       // ["default", "hover", "pressed", "disabled"]
}
```

#### Mapping Rules

```typescript
// Konfigurierbare Mapping Rules
const mappingRules = {
  // Component Name Mapping
  components: {
    'Button/Primary': { component: 'Button', props: { variant: 'default' } },
    'Button/Secondary': { component: 'Button', props: { variant: 'secondary' } },
    'Button/Outline': { component: 'Button', props: { variant: 'outline' } },
    'Button/Ghost': { component: 'Button', props: { variant: 'ghost' } },
    'Button/Destructive': { component: 'Button', props: { variant: 'destructive' } },
  },

  // Size Mapping
  sizes: {
    'Small': 'sm',
    'Medium': 'md',
    'Large': 'lg',
  },

  // State Mapping
  states: {
    'Disabled': { disabled: true },
    'Loading': { loading: true },
  },
};
```

#### Generated Code Example

**Input: Figma "Button/Primary/Medium" mit Icon**

```tsx
// Generated by nativeui Figma Plugin
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react-native';

export function EmailButton() {
  return (
    <Button variant="default" size="md">
      <Mail size={16} />
      Send Email
    </Button>
  );
}
```

---

### 3. Asset Export

#### Icon Export

```
Figma Selection: Icon Component
├── Export as SVG
├── Convert to React Native SVG
└── Output: components/icons/[name].tsx
```

**Generated Icon Component:**

```tsx
// components/icons/mail.tsx
import Svg, { Path } from 'react-native-svg';

interface MailIconProps {
  size?: number;
  color?: string;
}

export function MailIcon({ size = 24, color = 'currentColor' }: MailIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
```

#### Image Export

```
Figma Selection: Image Frame
├── Export @1x → assets/images/[name].png
├── Export @2x → assets/images/[name]@2x.png
├── Export @3x → assets/images/[name]@3x.png
└── Generate import statement
```

---

### 4. Plugin UI

```
┌─────────────────────────────────────────────────────────────┐
│  nativeui                                              [⚙️] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Sync ─────────────────────────────────────────────────┐│
│  │                                                         ││
│  │  Design Tokens                                          ││
│  │  ┌───────────────────────────────────────────────────┐ ││
│  │  │ Variables Collection: [nativeui        ▼]         │ ││
│  │  │ ☑ Colors (24 tokens)                              │ ││
│  │  │ ☑ Spacing (8 tokens)                              │ ││
│  │  │ ☑ Radius (5 tokens)                               │ ││
│  │  │ ☐ Typography (12 tokens)                          │ ││
│  │  └───────────────────────────────────────────────────┘ ││
│  │                                                         ││
│  │  [Sync Tokens to Project]                               ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─ Export ───────────────────────────────────────────────┐│
│  │                                                         ││
│  │  Selected: "Button/Primary/Medium"                      ││
│  │                                                         ││
│  │  ┌─ Preview ─────────────────────────────────────────┐ ││
│  │  │ import { Button } from '@/components/ui/button';  │ ││
│  │  │                                                   │ ││
│  │  │ <Button variant="default" size="md">              │ ││
│  │  │   Click me                                        │ ││
│  │  │ </Button>                                         │ ││
│  │  └───────────────────────────────────────────────────┘ ││
│  │                                                         ││
│  │  Export as:                                             ││
│  │  ○ Component Usage (import + JSX)                       ││
│  │  ○ Full Component File                                  ││
│  │  ○ Screen/Block Template                                ││
│  │                                                         ││
│  │  [Copy to Clipboard]  [Export to Project]               ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─ Assets ───────────────────────────────────────────────┐│
│  │                                                         ││
│  │  Selected: 3 icons, 2 images                            ││
│  │                                                         ││
│  │  Icons: ☑ SVG → React Native                            ││
│  │  Images: ☑ @1x ☑ @2x ☑ @3x                              ││
│  │                                                         ││
│  │  [Export Assets]                                        ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Project: ~/Code/my-app                                     │
│  Last sync: Just now ✓                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Milestone 1: Setup & Token Sync (Week 1)

```
packages/figma-plugin/
├── manifest.json           # Figma Plugin Manifest
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts             # Plugin Entry (Figma sandbox)
│   ├── ui.tsx              # UI Entry (iframe)
│   ├── ui.html
│   └── lib/
│       ├── tokens/
│       │   ├── extractor.ts    # Extract Figma Variables
│       │   ├── transformer.ts  # Transform to nativeui format
│       │   └── emitter.ts      # Generate config file
│       └── types.ts
└── esbuild.config.js
```

**Tasks:**
- [ ] Figma Plugin Boilerplate Setup
- [ ] Plugin UI mit React
- [ ] Figma Variables API Integration
- [ ] Token Extraction Logic
- [ ] nativeui.config.ts Generator
- [ ] Light/Dark Mode Support

### Milestone 2: Component Export (Week 2)

```
src/lib/
├── components/
│   ├── analyzer.ts         # Analyze Figma Component
│   ├── mapper.ts           # Map to nativeui Components
│   ├── codegen.ts          # Generate React Native Code
│   └── mappings/
│       ├── button.ts
│       ├── input.ts
│       ├── card.ts
│       └── index.ts
└── ...
```

**Tasks:**
- [ ] Component Analysis Engine
- [ ] Mapping Configuration
- [ ] Code Generator
- [ ] Preview Panel
- [ ] Copy to Clipboard
- [ ] Export to File System

### Milestone 3: Assets & Polish (Week 3)

```
src/lib/
├── assets/
│   ├── icons.ts            # SVG → React Native SVG
│   ├── images.ts           # Multi-resolution Export
│   └── optimizer.ts        # Asset Optimization
└── ...
```

**Tasks:**
- [ ] Icon Export (SVG → RN)
- [ ] Image Export (@1x, @2x, @3x)
- [ ] Settings Panel
- [ ] Error Handling
- [ ] Documentation
- [ ] Testing

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Figma Plugin API** | Plugin Integration |
| **TypeScript** | Type Safety |
| **React** | Plugin UI |
| **esbuild** | Fast Bundling |
| **Figma Variables API** | Token Access |
| **svgo** | SVG Optimization |

---

## API Design

### Token Sync API

```typescript
// Extract tokens from Figma
async function extractTokens(collectionId: string): Promise<TokenCollection> {
  const variables = await figma.variables.getLocalVariablesAsync();
  const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

  return {
    colors: extractColors(variables, collection),
    spacing: extractSpacing(variables, collection),
    radius: extractRadius(variables, collection),
    typography: extractTypography(variables, collection),
  };
}

// Transform to nativeui format
function transformToNativeUI(tokens: TokenCollection): NativeUIConfig {
  return {
    theme: {
      colors: {
        light: tokens.colors.light,
        dark: tokens.colors.dark,
      },
      spacing: tokens.spacing,
      radius: tokens.radius,
    },
  };
}

// Generate config file
function generateConfigFile(config: NativeUIConfig): string {
  return `import { defineConfig } from '@nativeui/core';

export default defineConfig(${JSON.stringify(config, null, 2)});
`;
}
```

### Component Export API

```typescript
// Analyze selected component
async function analyzeComponent(node: ComponentNode): Promise<ComponentAnalysis> {
  return {
    name: node.name,
    variants: extractVariants(node),
    props: extractProps(node),
    children: extractChildren(node),
  };
}

// Generate code
function generateCode(analysis: ComponentAnalysis, options: CodeGenOptions): string {
  const mapping = findMapping(analysis.name);

  if (mapping) {
    return generateFromMapping(analysis, mapping, options);
  }

  return generateGenericComponent(analysis, options);
}
```

---

## Configuration

### Plugin Settings

```typescript
interface PluginSettings {
  // Project Path
  projectPath: string;

  // Token Sync
  tokenCollection: string;
  syncOnChange: boolean;

  // Component Export
  componentPrefix: string;       // '@/components/ui/'
  useTypeScript: boolean;
  includeImports: boolean;

  // Asset Export
  iconFormat: 'react-native-svg' | 'expo-vector-icons';
  imageScales: ('1x' | '2x' | '3x')[];
  assetPath: string;            // 'assets/'
}
```

### Mapping Configuration

```typescript
// .nativeui/figma-mappings.json
{
  "components": {
    "Button/*": {
      "component": "Button",
      "variantMap": {
        "Primary": { "variant": "default" },
        "Secondary": { "variant": "secondary" },
        "Outline": { "variant": "outline" },
        "Ghost": { "variant": "ghost" },
        "Destructive": { "variant": "destructive" }
      },
      "sizeMap": {
        "Small": "sm",
        "Medium": "md",
        "Large": "lg"
      }
    },
    "Input/*": {
      "component": "Input",
      "stateMap": {
        "Error": { "error": true },
        "Disabled": { "disabled": true }
      }
    }
  }
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Token Sync Accuracy | 100% (all tokens mapped correctly) |
| Component Recognition | 80%+ (of nativeui components) |
| Export Time | < 2s (für einzelne Components) |
| Code Quality | No manual fixes needed |
| Designer Adoption | Used by design team regularly |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Figma API Limitations | Fallback zu manuellen Mappings |
| Complex Component Structures | Fokus auf Standard-Patterns |
| Performance bei großen Files | Lazy Loading, Caching |
| Figma Updates brechen Plugin | Versionierung, Testing |

---

## Future Enhancements

### Phase 3.1 (Optional)
- [ ] Bidirektionaler Sync (Code → Figma)
- [ ] Auto-Sync bei Figma Änderungen
- [ ] Figma Dev Mode Integration

### Phase 3.2 (Optional)
- [ ] Screen/Block Templates
- [ ] Animation Export
- [ ] Responsive Variants

---

## References

- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Figma Variables API](https://www.figma.com/plugin-docs/api/variables/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)
