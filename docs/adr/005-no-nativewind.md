# ADR 005: Kein NativeWind - StyleSheet bleibt

## Status

**Accepted** (ersetzt ADR 003)

## Kontext

ADR 003 hatte eine Migration zu NativeWind vorgeschlagen, um "gleiche DX wie shadcn/ui" zu erreichen. Nach praktischer Evaluation wurde entschieden, bei React Native StyleSheets zu bleiben.

## Entscheidung

**Wir bleiben bei React Native StyleSheet + ThemeProvider.**

NativeWind wird NICHT verwendet.

## Gründe

### 1. Komplexität ohne klaren Nutzen

NativeWind fügt hinzu:
- `tailwind.config.js`
- `metro.config.js` Anpassungen
- `babel.config.js` Plugin
- `global.css` Datei
- Build-Zeit Overhead

Für Mobile-Apps ist der Nutzen von "CSS editieren können" fragwürdig.

### 2. RN-Entwickler kennen StyleSheets

Die Zielgruppe (React Native Entwickler) ist mit StyleSheets vertraut. Tailwind-Syntax ist für viele RN-Devs fremd.

```tsx
// Das kennt jeder RN-Dev:
style={{ backgroundColor: colors.primary, padding: 16 }}

// Das muss man lernen:
className="bg-primary p-4"
```

### 3. Unser ThemeProvider funktioniert

Wir haben bereits:
- 8 Color Presets (zinc, slate, stone, blue, green, rose, orange, violet)
- 5 Radius Presets (none, sm, md, lg, full)
- Dark/Light/System Mode
- `defineConfig()` für Customization

Das deckt 95% der Use Cases ab.

### 4. CSS Variables sind nicht "native"

CSS Variables existieren in React Native nicht wirklich. NativeWind "simuliert" sie - aber warum simulieren, wenn wir echte JS-Werte haben?

### 5. Debugging ist einfacher

StyleSheet-Fehler sind in React Native DevTools sichtbar. Tailwind-Klassen-Fehler sind schwerer zu debuggen.

## Konsequenzen

### Positiv

1. **Einfacheres Setup** - Keine zusätzliche Config nötig
2. **Weniger Dependencies** - Kein nativewind, kein tailwindcss
3. **Vertraute API** - Standard React Native Patterns
4. **Besseres Debugging** - Native DevTools Support
5. **Schnellere Builds** - Kein Tailwind Compilation

### Negativ

1. **Nicht 1:1 wie shadcn** - Unterschiedlicher Styling-Ansatz
2. **Kein CSS editieren** - Customization via Config statt CSS
3. **Mehr Boilerplate** - Inline Styles sind verbaler als Klassen

### Migration

Keine Migration nötig - wir ändern nichts am bestehenden Code.

## Alternativen

| Option | Entscheidung |
|--------|--------------|
| NativeWind | Abgelehnt - zu komplex |
| Tamagui | Abgelehnt - eigenes Design System |
| StyleSheet + ThemeProvider | **Gewählt** |

## Referenzen

- ADR 003 (ersetzt)
- [React Native StyleSheet Docs](https://reactnative.dev/docs/stylesheet)
