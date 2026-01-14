# Roadmap

## Phase 1: Foundation

- [ ] Project Setup (Monorepo mit Turborepo)
- [ ] Design Token System
- [ ] Utils Library (`cn()`, `mergeStyles()`)
- [ ] Primitives (Pressable, Portal, Slot)
- [ ] Core Components (Button, Input, Card, Badge)
- [ ] CLI Grundstruktur (`init`, `add`)
- [ ] MCP Server Grundstruktur

## Phase 2: Core Components

- [ ] Forms (Checkbox, Switch, Radio, Select, Slider)
- [ ] Form Integration (react-hook-form + zod)
- [ ] Field Component (Label + Input + Error)
- [ ] Feedback (Toast, Dialog, Alert, Bottom Sheet)
- [ ] Navigation (Tabs, Tab Bar, Navigation Bar)
- [ ] Data Display (Avatar, List Item, Skeleton, Empty)
- [ ] MCP Server: Registry & Validation Tools
- [ ] Platform Testing Setup (iOS + Android)

## Phase 3: Advanced

- [ ] Complex Components (Command Palette, Calendar)
- [ ] Blocks (Auth Screens, Settings, Lists)
- [ ] Form Blocks (Login, Signup, Contact, Payment)
- [ ] Theming System (Dark Mode, Custom Themes)
- [ ] Playground MVP (Web)
- [ ] Documentation Site
- [ ] Expo Go Compatibility Testing

## Phase 4: Ecosystem

- [ ] Tablet/iPad Layouts (Split View, Sidebar)
- [ ] Chart Components (victory-native)
- [ ] Dashboard Blocks
- [ ] Playground: Full Features
- [ ] Theme Gallery
- [ ] Figma Plugin

## Phase 5: Polish & Scale

- [ ] Animation Refinement
- [ ] Performance Optimization (Bundle Size, FlatList)
- [ ] Accessibility Audit (VoiceOver + TalkBack)
- [ ] Platform-spezifische Optimierungen
- [ ] New Architecture Testing
- [ ] AI Component Generator
- [ ] Visual Regression Testing

---

## Prioritäten

### Must Have (MVP)
- CLI mit `init` und `add`
- Utils Library (`cn()`)
- 20 Core Components
- Basic Theme System
- MCP Server Basics
- Platform Testing (iOS 17+, Android 13+)

### Should Have
- Playground
- 40+ Components
- Blocks (Auth, Forms, Settings)
- Form Integration
- Tablet Support
- Expo SDK Compatibility

### Nice to Have
- Figma Plugin
- AI Generator
- Theme Marketplace
- Charts & Dashboard

---

## Platform Requirements

### Minimum Supported
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

Vor jedem Release:

```bash
# Alle müssen passen:
npx nativeui test:all      # Unit + Visual
npx nativeui a11y check    # Accessibility
npx nativeui doctor        # SDK Compatibility
```

### Per-Component Checklist
- [ ] iOS Simulator getestet
- [ ] Android Emulator getestet
- [ ] VoiceOver funktioniert
- [ ] TalkBack funktioniert
- [ ] Expo Go kompatibel (oder markiert)
- [ ] Dark Mode funktioniert
- [ ] Reduce Motion respektiert
