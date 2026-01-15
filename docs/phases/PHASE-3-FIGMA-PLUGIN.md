# Phase 3: Figma Plugin

> Status: **NOT STARTED**
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

### Milestone 1: Setup & Token Sync (Woche 1)

- [ ] Figma Plugin Boilerplate
- [ ] Plugin UI mit React
- [ ] Figma Variables API Integration
- [ ] Token Extraction (Colors, Spacing, Radius)
- [ ] `nativeui.config.ts` Generator
- [ ] Light/Dark Mode Support

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
