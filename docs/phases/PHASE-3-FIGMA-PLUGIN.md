# Phase 3: Figma Plugin

> Status: **IN PROGRESS** (Milestone 2 In Progress)
> Estimated: **2-3 Wochen**

## Übersicht

Design-to-Code Workflow mit einem Figma Plugin, das Design Tokens synchronisiert und Components exportiert.

---

## Ziele

1. **Token Sync** - Figma Variables → nativeui Theme
2. **Component Export** - Figma Components → React Native Code
3. **Asset Export** - Icons (SVG) und Images (@1x/@2x/@3x)

---

## Milestones

### Milestone 1: Setup & Token Sync ✅

- [x] Figma Plugin Boilerplate (manifest.json, package.json, tsconfig.json, esbuild.config.js)
- [x] Plugin UI mit React (ui.tsx mit Token-Selektor)
- [x] Figma Variables API Integration (extractor.ts)
- [x] Token Extraction (Colors, Spacing, Radius)
- [x] `mcellui.config.ts` Generator (transformer.ts, emitter.ts)
- [x] Light/Dark Mode Support (automatische Mode-Erkennung)

**Implementierte Dateien:**
- `packages/figma-plugin/src/main.ts` - Figma Sandbox Entry
- `packages/figma-plugin/src/ui.tsx` - React UI mit Collection-Selektor
- `packages/figma-plugin/src/lib/types.ts` - TypeScript Interfaces
- `packages/figma-plugin/src/lib/tokens/extractor.ts` - Figma Variables → Tokens
- `packages/figma-plugin/src/lib/tokens/transformer.ts` - Tokens → nativeui Format
- `packages/figma-plugin/src/lib/tokens/emitter.ts` - Config File Generator

### Milestone 2: Code → Figma Sync (Woche 2) 🔄

- [x] Token Importer (nativeui Tokens → Figma Variables)
  - [x] Colors (Light/Dark Mode als Modes)
  - [x] Spacing Scale
  - [x] Radius Scale
- [x] Component Generator (Registry → Figma Components)
  - [x] Button (sm/md/lg × default/secondary/outline/destructive/ghost × default/hover/pressed/disabled)
  - [x] Checkbox (sm/md/lg × unchecked/checked × default/hover/pressed/disabled)
  - [x] Switch (sm/md/lg × off/on × default/hover/pressed/disabled)
  - [x] Badge (sm/md/lg × default/secondary/outline/destructive)
  - [x] Avatar (sm/md/lg/xl × image/fallback)
  - [x] Input (sm/md/lg × default × default/focus/error/disabled)
  - [x] Card, Progress, Spinner, Separator, Label
- [x] Auto Layout Mapping
- [x] Variant Properties Setup (Component Sets)
- [x] UI für Component Generation (Generate / Delete Buttons)
- [ ] **NEEDS POLISH**: Visuelle Genauigkeit (Farben, Abstände, Details)
  - Checkbox: Checkmark SVG sichtbar machen
  - Switch: Thumb-Position, Track-Farben
  - Button: Text-Zentrierung, Font-Weight
  - Allgemein: Pixel-perfekte Übereinstimmung mit Demo App

**Implementierte Dateien:**
- `packages/figma-plugin/src/lib/tokens/importer.ts` - nativeui Tokens → Figma Variables
- `packages/figma-plugin/src/lib/data/tokens.ts` - Token Definitionen (spacing, radius, colors)
- `packages/figma-plugin/src/lib/data/components.ts` - Pixel-perfekte Component Definitions
- `packages/figma-plugin/src/lib/components/generator.ts` - Figma Component Generator

**Bekannte Issues:**
- Components funktionieren, sehen aber nicht 1:1 wie Demo App aus
- Feintuning der Farben, Abstände und visuellen Details erforderlich
- SVG-Inhalte (Checkmark) werden nicht korrekt angezeigt

### Milestone 3: Polish & Bidirectional (Woche 3)

- [ ] Settings Panel (Theme Selection)
- [ ] Selective Component Import
- [ ] Update Detection (nur geänderte Components)
- [ ] Typography Styles
- [ ] Icon Library Import
- [ ] Documentation

---

## Projektstruktur

```
packages/figma-plugin/
├── manifest.json           # Figma Plugin Config
├── package.json
├── tsconfig.json
├── esbuild.config.js
├── src/
│   ├── main.ts             # Plugin Entry (sandbox)
│   ├── ui.tsx              # UI Entry (React)
│   ├── ui.html
│   └── lib/
│       ├── tokens/
│       │   ├── extractor.ts    # Figma → Code (Milestone 1)
│       │   ├── transformer.ts
│       │   ├── emitter.ts
│       │   └── importer.ts     # Code → Figma (Milestone 2)
│       ├── components/
│       │   ├── generator.ts    # Registry → Figma Components
│       │   ├── variants.ts     # Variant Property Setup
│       │   └── layout.ts       # Auto Layout Mapping
│       ├── data/
│       │   ├── tokens.ts       # nativeui Token Definitions
│       │   └── components.ts   # Component Structure Definitions
│       └── types.ts
└── README.md
```

---

## Tech Stack

- **Figma Plugin API** - Plugin Integration
- **TypeScript** - Type Safety
- **React** - Plugin UI
- **esbuild** - Bundling
- **svgo** - SVG Optimization

---

## Erfolgskriterien

| Kriterium | Ziel |
|-----------|------|
| Token Sync | 100% Accuracy |
| Component Recognition | 80%+ der nativeui Components |
| Export Time | < 2 Sekunden |
| Code Quality | Keine manuellen Fixes nötig |

---

## Detaillierte Spezifikation

→ [Feature: Figma Plugin](../features/FIGMA-PLUGIN.md)

---

## Nächste Phase

→ [Phase 4: Forms & Blocks](./PHASE-4-FORMS-BLOCKS.md)
