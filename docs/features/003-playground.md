# Feature: Design Playground

Ein Web-basierter Playground zum Erkunden und Testen aller Komponenten mit Live-Preview.

## Konzept

```
┌─────────────────────────────────────────────────────────────────┐
│  🎨 nativeui Playground                          [Theme ▼] [☀️] │
├─────────────┬───────────────────────────────────────────────────┤
│             │                                                   │
│  Components │   ┌─────────────────────────────────────────┐    │
│  ──────────│   │                                         │    │
│  ▼ Inputs   │   │      📱 iPhone 15 Pro                   │    │
│    Button   │   │     ┌─────────────────────┐            │    │
│    Input    │   │     │                     │            │    │
│    Select   │   │     │   [ Button ]        │            │    │
│    ...      │   │     │                     │            │    │
│             │   │     │   [ Button ]        │            │    │
│  ▼ Feedback │   │     │                     │            │    │
│    Toast    │   │     │   [ Button ]        │            │    │
│    Dialog   │   │     │                     │            │    │
│    ...      │   │     └─────────────────────┘            │    │
│             │   │                                         │    │
│  ▼ Blocks   │   │   [iPhone ▼] [Android] [Tablet]        │    │
│    Login    │   └─────────────────────────────────────────┘    │
│    ...      │                                                   │
│             ├───────────────────────────────────────────────────┤
├─────────────┤   Props                        Code               │
│             │   ──────                       ──────             │
│  Tokens     │   variant: [primary ▼]        <Button             │
│  ──────────│   size:    [md ▼]               variant="primary" │
│  Colors     │   loading: [ ]                 size="md"         │
│  Spacing    │   disabled:[ ]               >                   │
│  Radius     │   haptic:  [✓]                 Press me          │
│  Shadows    │                               </Button>           │
│  Typography │                                                   │
│             │                               [Copy] [Export]     │
└─────────────┴───────────────────────────────────────────────────┘
```

## Features

### 1. Live Device Preview

Echte Komponenten via react-native-web, nicht Mockups.

```typescript
const DeviceFrame = ({ device, children }) => {
  const frames = {
    'iphone-15-pro': { width: 393, height: 852, notch: true },
    'iphone-se': { width: 375, height: 667, notch: false },
    'pixel-8': { width: 412, height: 915, notch: 'punch-hole' },
    'ipad-pro': { width: 1024, height: 1366, notch: false },
  };

  return (
    <div className="device-frame" style={frames[device]}>
      {children}
    </div>
  );
};
```

### 2. Props Editor

Automatisch aus TypeScript Types generiert.

```typescript
const PropsEditor = ({ component, onChange }) => {
  const schema = getComponentSchema(component);

  return (
    <div className="props-editor">
      {schema.props.map(prop => (
        <PropInput
          key={prop.name}
          type={prop.type}
          value={prop.value}
          options={prop.enum}
          onChange={(v) => onChange(prop.name, v)}
        />
      ))}
    </div>
  );
};
```

### 3. Theme Editor (Live)

Ändere Tokens und sieh sofort das Ergebnis.

```typescript
const ThemeEditor = () => {
  const [theme, setTheme] = useTheme();

  return (
    <div className="theme-editor">
      <ColorPicker
        label="Primary"
        value={theme.colors.primary}
        onChange={(c) => setTheme('colors.primary', c)}
      />
      <Slider
        label="Border Radius"
        value={theme.radius.md}
        onChange={(r) => setTheme('radius.md', r)}
      />
    </div>
  );
};
```

### 4. Code Export

```typescript
const exportOptions = {
  'component': () => generateComponentCode(),
  'component-themed': () => generateWithTheme(),
  'screen': () => generateScreenCode(),
  'styles-only': () => extractStyles(),
};
```

### 5. Responsive Testing

```typescript
const breakpoints = {
  'phone-small': 320,
  'phone': 375,
  'phone-large': 428,
  'tablet': 768,
  'tablet-large': 1024,
};
```

## URL Struktur

```
playground.nativeui.dev/
├── /                           # Landing + Quick Preview
├── /playground                 # Full Playground
├── /playground/button          # Direkt zu Komponente
├── /playground/blocks/login-01 # Block Preview
├── /docs                       # Documentation
├── /docs/components/button     # Component Docs
├── /themes                     # Theme Gallery
├── /themes/create              # Theme Creator
└── /export                     # Export Tool
```

## Tech Stack

```
apps/playground/
├── app/
│   ├── page.tsx              # Landing
│   ├── playground/           # Main Playground
│   ├── docs/                 # Documentation
│   └── themes/               # Theme Gallery
└── components/
    ├── device-frame/
    ├── props-editor/
    ├── code-preview/
    └── theme-editor/
```

- **Next.js 15** – Framework
- **react-native-web** – RN Components im Browser
- **Monaco Editor** – Code Editor
- **Shiki** – Syntax Highlighting
- **Zustand** – State Management
