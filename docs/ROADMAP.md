# Roadmap

> Detaillierte Phase-Dokumentation: [docs/phases/](./phases/INDEX.md)

---

## Current Status

**Phase 1: Foundation** - Complete ✅

---

## Phases Overview

| Phase | Focus | Status |
|-------|-------|--------|
| [Phase 1](./phases/PHASE-1-FOUNDATION.md) | Foundation | ✅ 100% |
| [Phase 2](./phases/PHASE-2-CORE-COMPONENTS.md) | Core Components | ⏳ 0% |
| [Phase 3](./phases/PHASE-3-ADVANCED.md) | Advanced | ⏳ 0% |
| [Phase 4](./phases/PHASE-4-ECOSYSTEM.md) | Ecosystem | ⏳ 0% |
| [Phase 5](./phases/PHASE-5-POLISH.md) | Polish & Scale | ⏳ 0% |

---

## MVP Requirements

### Must Have
- [x] CLI mit `init` und `add`
- [x] Utils Library (`cn()`)
- [ ] 20 Core Components (aktuell: 5)
- [ ] Basic Theme System
- [x] MCP Server Basics (4 Tools)
- [x] Platform Testing iOS (Expo SDK 54)
- [ ] Platform Testing Android

### Should Have
- [ ] Playground
- [ ] 40+ Components
- [ ] Blocks (Auth, Forms, Settings)
- [ ] Form Integration
- [ ] Tablet Support

### Nice to Have
- [ ] Figma Plugin
- [ ] AI Generator
- [ ] Theme Marketplace

---

## Platform Support

### Minimum
- iOS 15+
- Android 10+ (API 29)
- Expo SDK 50+
- React Native 0.73+

### Optimized For
- iOS 17-18
- Android 13-14
- Expo SDK 52
- React Native 0.76+ (New Architecture)

---

## Quality Gates

```bash
# Vor jedem Release:
npx mcellui test:all      # Unit + Visual
npx mcellui a11y check    # Accessibility
npx mcellui doctor        # SDK Compatibility
```

### Per-Component Checklist
- [ ] iOS Simulator getestet
- [ ] Android Emulator getestet
- [ ] VoiceOver funktioniert
- [ ] TalkBack funktioniert
- [ ] Expo Go kompatibel (oder markiert)
- [ ] Dark Mode funktioniert
- [ ] Reduce Motion respektiert
