# Phase 3: Figma Plugin

> Status: **IN PROGRESS** (Milestone 1 Complete)
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
- [x] `nativeui.config.ts` Generator (transformer.ts, emitter.ts)
- [x] Light/Dark Mode Support (automatische Mode-Erkennung)

**Implementierte Dateien:**
- `packages/figma-plugin/src/main.ts` - Figma Sandbox Entry
- `packages/figma-plugin/src/ui.tsx` - React UI mit Collection-Selektor
- `packages/figma-plugin/src/lib/types.ts` - TypeScript Interfaces
- `packages/figma-plugin/src/lib/tokens/extractor.ts` - Figma Variables → Tokens
- `packages/figma-plugin/src/lib/tokens/transformer.ts` - Tokens → nativeui Format
- `packages/figma-plugin/src/lib/tokens/emitter.ts` - Config File Generator

### Milestone 2: Component Export (Woche 2)

- [ ] Component Analysis Engine
- [ ] Mapping Configuration (Button, Input, Card, etc.)
- [ ] Code Generator
- [ ] Preview Panel
- [ ] Copy to Clipboard
- [ ] Export to File System

### Milestone 3: Assets & Polish (Woche 3)

- [ ] Icon Export (SVG → React Native SVG)
- [ ] Image Export (@1x, @2x, @3x)
- [ ] Settings Panel
- [ ] Error Handling
- [ ] Documentation
- [ ] Testing

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
│       │   ├── extractor.ts
│       │   ├── transformer.ts
│       │   └── emitter.ts
│       ├── components/
│       │   ├── analyzer.ts
│       │   ├── mapper.ts
│       │   └── codegen.ts
│       ├── assets/
│       │   ├── icons.ts
│       │   └── images.ts
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
