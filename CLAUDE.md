# CLAUDE.md

## Projekt: nativeui

Eine moderne, copy-paste UI-Komponenten-Bibliothek für Expo/React Native - inspiriert von shadcn/ui.

## Status

**Vision/Konzept-Phase** - Aktuell existiert nur die Dokumentation. Das Projekt befindet sich in der Planungsphase.

## Projektstruktur (geplant)

```
nativeui/
├── docs/                  # Dokumentation (aktuell vorhanden)
│   ├── VISION.md          # Projekt-Vision und Philosophie
│   ├── ROADMAP.md         # Entwicklungs-Roadmap
│   └── features/          # Feature-Spezifikationen
├── packages/              # (geplant)
│   ├── cli/               # npx nativeui add button
│   ├── mcp-server/        # Claude Code Integration
│   ├── core/              # Shared Utilities
│   └── registry/          # Component Registry Data
├── apps/                  # (geplant)
│   ├── playground/        # Web Playground (Next.js)
│   ├── docs/              # Documentation Site
│   └── demo/              # Expo Demo App
├── extensions/            # (geplant)
│   ├── vscode/            # VS Code Extension
│   └── figma/             # Figma Plugin
└── registry/              # (geplant)
    ├── primitives/        # Building Blocks
    ├── ui/                # 55+ Components
    ├── blocks/            # Screen Templates
    ├── hooks/             # Utility Hooks
    └── themes/            # Theme Presets
```

## Kernphilosophie

1. **Copy-Paste > npm install** - Der Nutzer besitzt den Code
2. **Funktioniert oder existiert nicht** - iOS UND Android perfekt
3. **Docs sind das Produkt** - Live Preview + Code + Copy Button
4. **Developer Experience ist alles** - 5 Sekunden Setup

## Qualitätsstandards

Vor jedem Component-Release:
- iOS Simulator + Android Emulator getestet
- VoiceOver + TalkBack zugänglich
- Dark Mode + Reduce Motion unterstützt
- Vollständig TypeScript typisiert (keine `any`)
- Dokumentation mit Beispiel + Props vorhanden

## Tech Stack (geplant)

- **Framework**: Expo SDK 50+, React Native 0.73+
- **Styling**: NativeWind / StyleSheet
- **Animations**: Reanimated 3
- **Gestures**: Gesture Handler 2
- **CLI**: Node.js mit Commander
- **Monorepo**: Turborepo

## Platform Support

- iOS 15+ (optimiert für iOS 17-18)
- Android 10+ API 29 (optimiert für Android 13-14)
- Expo Go kompatibel (wo möglich, sonst markiert)

## Wichtige Dokumente

- [Vision](./docs/VISION.md) - Vollständige Projekt-Vision
- [Roadmap](./docs/ROADMAP.md) - Entwicklungsphasen
- [Features Index](./docs/features/INDEX.md) - Alle geplanten Features

## Design-Inspirationen

- Arc Browser UI
- Linear App
- Raycast
- Apple iOS 17+ Design Language
- Stripe Dashboard Mobile

## Sprache

Dokumentation und Kommentare: Deutsch
Code und API: Englisch
