# CLAUDE.md

## Projekt: mcellui

Eine moderne, copy-paste UI-Komponenten-Bibliothek für Expo/React Native - inspiriert von shadcn/ui.

## Status

**Phase 4: Forms & Blocks** - Complete! Form System und Screen Templates fertig.

Siehe [PHASES.md](./PHASES.md) für Details.

## Projektstruktur

```
mcellui/
├── docs/                  # Dokumentation
│   ├── adr/               # Architecture Decision Records
│   ├── features/          # Feature-Spezifikationen
│   └── phases/            # Phase-Details
├── packages/
│   ├── cli/               # npx mcellui add button
│   ├── mcp-server/        # Claude Code Integration
│   ├── core/              # Design Tokens + Utilities
│   ├── metro-plugin/      # Metro bundler integration
│   └── registry/          # Component Source Code
├── apps/
│   ├── demo/              # Expo Demo App
│   └── docs/              # Documentation Site (Placeholder)
└── PHASES.md              # Development Roadmap
```

## Kernphilosophie

1. **Copy-Paste > npm install** - Der Nutzer besitzt den Code
2. **Funktioniert oder existiert nicht** - iOS UND Android perfekt
3. **Native First** - StyleSheet statt CSS, Platform-Conventions respektieren
4. **Developer Experience ist alles** - 5 Sekunden Setup

## Tech Stack

- **Framework**: Expo SDK 54+, React Native 0.76+
- **Styling**: React Native StyleSheet + ThemeProvider
- **Animations**: Reanimated 3
- **Gestures**: Gesture Handler 2
- **CLI**: Node.js mit Commander
- **Monorepo**: Turborepo

## Styling-Ansatz (StyleSheet + ThemeProvider)

Wir verwenden React Native StyleSheets mit einem ThemeProvider für Theming:

```tsx
// Theme-aware Component
import { useTheme } from '@metacells/mcellui-core';

function MyComponent() {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.primary,
      padding: spacing[4],
      borderRadius: radius.lg,
    }}>
      <Text style={{ color: colors.primaryForeground }}>
        Hello
      </Text>
    </View>
  );
}
```

**Token Customization:** User nutzt `mcellui.config.ts`:

```ts
export default defineConfig({
  theme: 'violet',      // 8 Presets: zinc, slate, stone, blue, green, rose, orange, violet
  radius: 'md',         // none, sm, md, lg, full
  colorScheme: 'system', // light, dark, system
});
```

## Components (27 UI Components + 6 Blocks)

### UI Components
| Component | Status |
|-----------|--------|
| Button | ✅ Ready |
| Card | ✅ Ready |
| Input | ✅ Ready |
| Textarea | ✅ Ready |
| Select | ✅ Ready |
| Slider | ✅ Ready |
| Stepper | ✅ Ready |
| Badge | ✅ Ready |
| Avatar | ✅ Ready |
| Checkbox | ✅ Ready |
| Switch | ✅ Ready |
| Radio Group | ✅ Ready |
| Label | ✅ Ready |
| Separator | ✅ Ready |
| Spinner | ✅ Ready |
| Skeleton | ✅ Ready |
| Progress | ✅ Ready |
| Sheet | ✅ Ready |
| Dialog | ✅ Ready |
| Alert Dialog | ✅ Ready |
| Toast | ✅ Ready |
| Tabs | ✅ Ready |
| Accordion | ✅ Ready |
| Segmented Control | ✅ Ready |
| Pull to Refresh | ✅ Ready |
| Swipeable Row | ✅ Ready |
| Form | ✅ Ready |

### Screen Blocks (Phase 4)
| Block | Status |
|-------|--------|
| LoginBlock | ✅ Ready |
| SignupBlock | ✅ Ready |
| SettingsListBlock | ✅ Ready |
| ProfileBlock | ✅ Ready |
| EmptyStateBlock | ✅ Ready |
| ErrorStateBlock | ✅ Ready |

### Form System
- `Form` - FormProvider wrapper
- `FormField` - Controller integration
- `FormItem` - Layout container
- `FormLabel` - Label with error state
- `FormMessage` - Validation error display
- `FormDescription` - Helper text

Dependencies: `react-hook-form`, `@hookform/resolvers`, `zod`

## CLI Commands

```bash
npx mcellui init          # Setup in Projekt
npx mcellui add button    # Component hinzufügen
npx mcellui list          # Alle Components anzeigen
npx mcellui diff          # Compare with registry
```

## Qualitätsstandards

Vor jedem Component-Release:
- iOS Simulator + Android Emulator getestet
- VoiceOver + TalkBack zugänglich
- Dark Mode unterstützt
- Vollständig TypeScript typisiert (keine `any`)
- Dokumentation mit Beispiel + Props vorhanden

## Platform Support

- iOS 15+ (optimiert für iOS 17-18)
- Android 10+ API 29 (optimiert für Android 13-14)
- Expo Go kompatibel (wo möglich, sonst markiert)

## Wichtige Dokumente

- [PHASES.md](./PHASES.md) - Development Roadmap
- [ADRs](./docs/adr/) - Architecture Decisions
- [Features](./docs/features/) - Feature Specifications

## Sprache

Dokumentation und Kommentare: Deutsch
Code und API: Englisch
