# nativeui

> Eine moderne, copy-paste UI-Komponenten-Bibliothek für Expo/React Native – inspiriert von shadcn/ui, aber mit einem frischen, app-native Design.

## Philosophie & Non-Negotiables

### Core Beliefs

1. **Copy-Paste > npm install**
   - Du besitzt den Code, nicht eine Dependency
   - Keine Breaking Changes durch Library Updates
   - Volle Kontrolle, volle Verantwortung

2. **Funktioniert oder existiert nicht**
   - Jede Komponente muss auf iOS UND Android perfekt laufen
   - Keine "works on my machine" Releases
   - Lieber 20 perfekte Components als 50 halbgare

3. **Docs sind das Produkt**
   - Wenn es nicht dokumentiert ist, existiert es nicht
   - Jede Komponente: Live Preview + Code + Copy Button
   - Beispiele > Erklärungen

4. **Developer Experience ist alles**
   - `npx nativeui add button` muss in 5 Sekunden funktionieren
   - Keine Config-Hölle, sane defaults
   - Fehlermeldungen die helfen, nicht frustrieren

### Quality Standards

```
Bevor eine Komponente released wird:

□ iOS Simulator: Funktioniert einwandfrei
□ Android Emulator: Funktioniert einwandfrei
□ VoiceOver: Vollständig navigierbar
□ TalkBack: Vollständig navigierbar
□ Dark Mode: Sieht gut aus
□ Reduce Motion: Animationen respektieren Setting
□ Expo Go: Funktioniert ODER klar markiert
□ TypeScript: Vollständig typisiert, keine `any`
□ Docs: Beispiel + Props + Preview vorhanden
```

### Was wir NICHT machen

- ❌ Features shippen die "fast fertig" sind
- ❌ Platform-spezifische Bugs ignorieren
- ❌ Breaking Changes ohne Migration Guide
- ❌ Komplexität ohne klaren Nutzen
- ❌ Dependencies die nicht unbedingt nötig sind

### Community Promise

- Jedes GitHub Issue bekommt eine Antwort
- PRs werden innerhalb einer Woche reviewed
- Breaking Changes werden mindestens 1 Version vorher angekündigt
- Dokumentation bleibt immer aktuell

---

## Das Problem

React Native/Expo hat keine shadcn-äquivalente Lösung:

| Web (shadcn) | React Native Status |
|--------------|---------------------|
| Radix UI Primitives | Nicht vorhanden |
| Tailwind CSS | NativeWind (limitiert) |
| Copy-paste Architektur | Nur npm-Packages |
| CLI zum Installieren | Nicht vorhanden |
| Konsistentes Design System | Fragmentiert |

**Existierende Lösungen:**
- **React Native Paper** – Material Design locked
- **NativeBase** – Schwer, komplexes API
- **Tamagui** – Steile Lernkurve, Web-fokussiert
- **Gluestack UI** – Gut, aber noch jung

## Die Vision

Eine UI-Bibliothek die:

1. **Copy-paste first** – Du besitzt den Code, nicht eine Dependency
2. **Modern App Design** – Nicht clean/minimal, sondern:
   - Weiche Schatten und Depth
   - Subtile Blur-Effekte (iOS Glassmorphism)
   - Micro-Animationen überall
   - Native Platform-Patterns
3. **Expo-optimiert** – Nutzt Expo APIs wo sinnvoll
4. **CLI-gestützt** – `npx nativeui add button`
5. **AI-ready** – MCP Server für Claude Code Integration
6. **Vollständig typisiert** – TypeScript first

## Design-Philosophie

```
shadcn Style:          nativeui Style:
┌─────────────────┐    ┌─────────────────┐
│ ▢ Flat          │    │ ◐ Depth/Shadows │
│ ▢ Minimal       │    │ ◐ Layered       │
│ ▢ Monochrome    │    │ ◐ Vibrant       │
│ ▢ Static        │    │ ◐ Animated      │
│ ▢ Web-native    │    │ ◐ Platform-aware│
└─────────────────┘    └─────────────────┘
```

**Inspirationen:**
- Arc Browser UI
- Linear App
- Raycast
- Apple iOS 17+ Design Language
- Stripe Dashboard Mobile

## Core Architektur

```
nativeui/
├── packages/
│   ├── cli/              # npx nativeui add button
│   ├── mcp-server/       # Claude Code Integration
│   ├── core/             # Shared Utilities
│   └── registry/         # Component Registry Data
│
├── apps/
│   ├── playground/       # Web Playground (Next.js)
│   ├── docs/             # Documentation Site
│   └── demo/             # Expo Demo App
│
├── extensions/
│   ├── vscode/           # VS Code Extension
│   └── figma/            # Figma Plugin
│
└── registry/
    ├── primitives/       # Building Blocks
    ├── ui/               # 55+ Components
    ├── blocks/           # Screen Templates
    ├── hooks/            # Utility Hooks
    └── themes/           # Theme Presets
```

## Komponenten-Übersicht

### Primitives
```
Pressable, Portal, FocusTrap, Slot, VisuallyHidden
```

### UI Components (55+)
```
Inputs:     Button, Input, Textarea, Checkbox, Switch, Radio, Slider, Select
Feedback:   Toast, Dialog, Alert, Bottom Sheet, Popover, Tooltip
Navigation: Tabs, Tab Bar, Navigation Bar, Segmented Control
Display:    Avatar, Badge, Card, List Item, Skeleton, Spinner, Progress
Layout:     Accordion, Collapsible, Scroll Area, Carousel
```

### Blocks (Screen Templates)
```
Auth:       Login, Signup, OTP, Forgot Password
Onboarding: Carousel, Steps, Permissions
Settings:   List, Profile Edit, Account
Lists:      Contacts, Chat, Feed, Search Results
```

## Platform-Strategie

### iOS vs Android: Adaptive Components

nativeui ist **platform-aware** – Komponenten passen sich automatisch an:

```
┌─────────────────────────────────┬─────────────────────────────────┐
│            iOS                  │           Android               │
├─────────────────────────────────┼─────────────────────────────────┤
│ ActionSheet (native bottom)     │ BottomSheet (Material)          │
│ SegmentedControl               │ Tabs / ToggleGroup              │
│ NavigationBar (large titles)    │ AppBar (collapsing)             │
│ Haptic Engine (Taptic)          │ Vibration API (graceful)        │
│ SF Symbols                      │ Material Icons                  │
│ Blur (UIVisualEffectView)       │ Dimmed Overlay (Fallback)       │
│ Native Spring Animations        │ Reanimated Springs              │
│ Dynamic Island / Notch          │ Punch-hole / Gesture Bar        │
└─────────────────────────────────┴─────────────────────────────────┘
```

**Beispiel:**
```typescript
// Intern: Automatische Platform Detection
export function ContextMenu({ children, items }) {
  return Platform.select({
    ios: <ActionSheet items={items}>{children}</ActionSheet>,
    android: <BottomSheet items={items}>{children}</BottomSheet>,
  });
}
```

### Expo Compatibility

| Feature | Expo Go | Dev Build | Production |
|---------|---------|-----------|------------|
| Basic Components | ✓ | ✓ | ✓ |
| Blur Effects | ✓ | ✓ | ✓ |
| Haptics | ✓ | ✓ | ✓ |
| Bottom Sheet | ✗ | ✓ | ✓ |
| Context Menu (zeego) | ✗ | ✓ | ✓ |

**Docs werden klar markieren:** "Requires Development Build" wo nötig.

### React Native New Architecture

nativeui unterstützt sowohl alte als auch neue Architektur:
- Reanimated 3 ✓
- Gesture Handler 2 ✓
- Alle Core Dependencies kompatibel

## Differenzierung

| vs. | Unterschied |
|-----|-------------|
| **shadcn** | Mobile-native, Animations eingebaut, Platform-aware |
| **Tamagui** | Einfacher, Copy-paste statt Config, schnellerer Einstieg |
| **Gluestack** | Moderneres Design, mehr Micro-Animations, bessere DX |
| **RN Paper** | Nicht Material locked, moderner, leichtgewichtiger |

## Kernfeatures

1. **CLI** – `npx nativeui add button card input`
2. **MCP Server** – Native Claude Code Integration
3. **Design Playground** – Web-basierter Live-Preview
4. **Theme System** – Dark Mode, Custom Themes, Theme Gallery

## Quick Start (Ziel)

```bash
# Init
npx nativeui init

# Add components
npx nativeui add button card input

# Add a complete screen
npx nativeui add blocks/login-01
```

## Links

- [Roadmap](./ROADMAP.md)
- [Features](./features/)
- [Components](./COMPONENTS.md)
- [Design Tokens](./DESIGN-TOKENS.md)

---

*Status: Vision/Konzept*
*Erstellt: Januar 2025*
