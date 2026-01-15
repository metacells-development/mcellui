# ADR 003: Migration zu NativeWind

## Status

**Accepted**

## Kontext

Aktuell nutzen wir React Native StyleSheets mit einem ThemeProvider Context für Theming:

```tsx
// Aktuell: Inline Styles mit Theme Context
const { colors, spacing } = useTheme();
<View style={{
  backgroundColor: colors.primary,
  padding: spacing[4],
  borderRadius: radius.lg
}}>
```

**Probleme:**
1. Verbose - jede Component braucht `useTheme()` und lange style-Objekte
2. Nicht wie shadcn - shadcn nutzt Tailwind + CSS Variables
3. Token Override umständlich - nur via ThemeProvider Props
4. Kein echtes "globales Stylesheet" - alles in JS

## Entscheidung

**Migration zu NativeWind (Tailwind CSS für React Native)**

### Neuer Ansatz

```css
/* global.css */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --primary: 263 70% 73%;
}
```

```tsx
// Neu: Tailwind Classes wie shadcn
<View className="bg-primary p-4 rounded-[--radius]">
  <Text className="text-primary-foreground font-medium">
    Hello
  </Text>
</View>
```

### Token Override

```tsx
// User kann einfach CSS überschreiben
// Option 1: global.css editieren
// Option 2: CSS Variables per Style setzen
<View style={{ '--primary': '340 82% 52%' } as any}>
  <Button>Jetzt Pink!</Button>
</View>
```

## Alternativen betrachtet

### 1. StyleSheet + ThemeProvider (aktuell)
- ✅ Kein zusätzliches Dependency
- ❌ Verbose, nicht wie shadcn
- ❌ Token Override nur via Props

### 2. Tamagui
- ✅ Mächtig, optimiert
- ❌ Eigenes Design System, nicht Tailwind
- ❌ Steile Lernkurve

### 3. Dripsy
- ✅ Theme-aware sx prop
- ❌ Weniger aktiv maintained
- ❌ Nicht Tailwind-basiert

### 4. NativeWind ✅
- ✅ Tailwind CSS Syntax
- ✅ CSS Variables Support
- ✅ Aktiv maintained
- ✅ Gleiche DX wie shadcn/ui
- ❌ Zusätzliches Setup

## Konsequenzen

### Positiv
1. **Gleiche DX wie shadcn** - Vertraute Tailwind Classes
2. **CSS Variables** - Echtes Token Override via CSS
3. **Cleaner Code** - Keine langen inline styles
4. **Web-Dev friendly** - Gleiche Syntax wie Web
5. **Dark Mode** - Via `.dark` Class wie shadcn

### Negativ
1. **Breaking Change** - Alle Components müssen refactored werden
2. **Zusätzliche Dependencies** - nativewind, tailwindcss
3. **Build Komplexität** - tailwind.config.js, babel plugin, metro config
4. **Lernkurve** - Für RN-Devs die Tailwind nicht kennen

### Migration Plan

1. NativeWind Setup in Demo App
2. `global.css` mit CSS Variables erstellen
3. `tailwind.config.js` mit Theme konfigurieren
4. Components einzeln migrieren (Button → Card → ...)
5. ThemeProvider vereinfachen (nur noch ColorScheme toggle)
6. Alte StyleSheet-basierte Tokens deprecaten

## Referenzen

- [NativeWind Docs](https://www.nativewind.dev/)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS](https://tailwindcss.com/)
