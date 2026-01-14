# Feature: Figma Plugin

Bidirektionale Synchronisation zwischen Figma und nativeui.

## Richtungen

### Figma → nativeui

**1. Design Token Import**

Extrahiere Figma Variables als nativeui Tokens.

```
Figma Variables:
├── Colors/Primary → tokens.colors.primary
├── Colors/Gray/500 → tokens.colors.gray.500
├── Spacing/4 → tokens.space.4
└── Radius/md → tokens.radius.md
```

**2. Component Import**

Konvertiere Figma Components zu nativeui Code.

```
Figma Component "Button/Primary/Medium"
↓
<Button variant="primary" size="md">Label</Button>
```

**3. Screen Import**

Importiere komplette Screens als Blocks.

```
Figma Frame "Login Screen"
↓
blocks/login-custom/
├── index.tsx
└── styles.ts
```

### nativeui → Figma

**1. Token Export**

Exportiere Theme als Figma Variables.

```typescript
// nativeui tokens
tokens.colors.primary.DEFAULT = '#6366F1'
↓
// Figma Variable
Colors/Primary = #6366F1
```

**2. Component Generation**

Generiere Figma Components aus Code.

```tsx
<Button variant="primary" size="md" />
↓
Figma Component Set "Button" mit Variants
```

## Plugin UI

```
┌─────────────────────────────────────────┐
│  nativeui Sync                    [⚙️]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Import from Figma               │   │
│  ├─────────────────────────────────┤   │
│  │ ○ Variables (Colors, Spacing)   │   │
│  │ ○ Selected Component            │   │
│  │ ○ Selected Frame as Block       │   │
│  │                                 │   │
│  │ [Import Selected]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Export to Figma                 │   │
│  ├─────────────────────────────────┤   │
│  │ ○ Current Theme as Variables    │   │
│  │ ○ Component as Figma Component  │   │
│  │                                 │   │
│  │ [Export]                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Last Sync: 2 hours ago                 │
│  [Sync All] [Settings]                  │
└─────────────────────────────────────────┘
```

## Workflow

### Design System Setup

```
1. Designer erstellt Figma Variables
2. Plugin exportiert als nativeui Theme
3. Developer nutzt Theme in Code
4. Änderungen werden zurück synchronisiert
```

### Component Handoff

```
1. Designer finalisiert Component in Figma
2. Plugin generiert nativeui Code
3. Developer passt Code an
4. Component wird zur Registry hinzugefügt
```

## API

```typescript
// Figma Plugin API
figma.variables.getLocalVariables()
figma.variables.createVariable()

// nativeui API
nativeui.theme.import(figmaVariables)
nativeui.theme.export() // → Figma format
nativeui.components.toFigma(component)
nativeui.components.fromFigma(node)
```

## Tech Stack

- **Figma Plugin API**
- **TypeScript**
- **React** (für Plugin UI)
- **Figma Variables API**
