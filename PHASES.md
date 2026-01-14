# nativeui Development Phases

## Phase 0: Project Scaffolding ✅

**Status: COMPLETE**

Monorepo foundation with all packages and tooling.

### Deliverables
- [x] Turborepo monorepo structure
- [x] TypeScript configuration (base, node, react-native)
- [x] ESLint + Prettier setup
- [x] `@nativeui/core` - Design tokens + utils (`cn()`)
- [x] `@nativeui/cli` - Basic structure (init, add, list)
- [x] `@nativeui/mcp-server` - Basic structure (5 tools, 3 resources)
- [x] `@nativeui/registry` - 5 starter components
- [x] `apps/demo` - Expo app with component demos
- [x] `apps/docs` - Placeholder

### Components in Registry
- Button (variants, sizes, loading)
- Card (Header, Title, Description, Content, Footer)
- Input (label, error, helper text)
- Badge (variants)
- Avatar (sizes, fallback)

---

## Phase 1: Foundation

**Status: NOT STARTED**

Make everything actually work end-to-end.

### Goals
- [ ] `npm install` works without errors
- [ ] Demo app runs on iOS + Android simulators
- [ ] CLI `init` and `add` commands work
- [ ] Components pass basic visual QA

### Tasks
- [ ] Fix any TypeScript errors
- [ ] Test demo app on iOS Simulator
- [ ] Test demo app on Android Emulator
- [ ] CLI: Wire up actual registry fetching
- [ ] Add missing Expo assets (icons, splash)
- [ ] Verify all 5 components render correctly

### Exit Criteria
```bash
npm install        # No errors
npm run dev        # Demo app starts
npx nativeui init  # Creates config
npx nativeui add button  # Copies component
```

---

## Phase 2: Core Components

**Status: NOT STARTED**

Expand to 15 production-ready components.

### New Components
- [ ] Switch (animated toggle)
- [ ] Checkbox (animated)
- [ ] Radio (group support)
- [ ] Select (bottom sheet picker)
- [ ] Slider (value input)
- [ ] Toast (notifications)
- [ ] Dialog (modal)
- [ ] Alert (confirmation)
- [ ] Bottom Sheet (reanimated)
- [ ] Skeleton (loading shimmer)

### Quality Requirements
- [ ] All components tested on iOS 17+
- [ ] All components tested on Android 13+
- [ ] VoiceOver accessible
- [ ] TalkBack accessible
- [ ] Dark mode support

---

## Phase 3: Forms & Blocks

**Status: NOT STARTED**

Form integration and screen templates.

### Forms
- [ ] react-hook-form integration
- [ ] zod validation
- [ ] Field wrapper component
- [ ] Form component (context provider)

### Blocks (Screen Templates)
- [ ] Login screen
- [ ] Signup screen
- [ ] Settings list
- [ ] Profile page
- [ ] Empty state
- [ ] Error state

---

## Phase 4: Tooling Polish

**Status: NOT STARTED**

CLI and MCP server fully functional.

### CLI
- [ ] `nativeui diff` - Show component updates
- [ ] `nativeui doctor` - Check compatibility
- [ ] `nativeui update` - Update components
- [ ] Better error messages
- [ ] Interactive component picker

### MCP Server
- [ ] Live registry data (not hardcoded)
- [ ] Component validation (real checks)
- [ ] AI suggestions based on context
- [ ] Theme customization support

---

## Phase 5: Documentation

**Status: NOT STARTED**

Public documentation site.

### Tasks
- [ ] Next.js docs site setup
- [ ] Component API docs (auto-generated)
- [ ] Getting started guide
- [ ] Theme customization guide
- [ ] Accessibility guidelines
- [ ] Interactive playground (web)

---

## Phase 6: Advanced Components

**Status: NOT STARTED**

Complex components for power users.

### Components
- [ ] Command Palette
- [ ] Calendar / Date Picker
- [ ] Data Table
- [ ] Charts (victory-native)
- [ ] Tabs (animated)
- [ ] Navigation Bar
- [ ] Tab Bar

---

## Phase 7: Ecosystem

**Status: NOT STARTED**

Integrations and extensions.

### Tasks
- [ ] Figma plugin (design to code)
- [ ] VS Code extension (snippets)
- [ ] Theme gallery
- [ ] Community components registry
- [ ] Expo Go compatibility report

---

## Timeline Notes

- Each phase should be ~1-2 weeks of focused work
- Phases can overlap (e.g., docs while building components)
- Quality > speed: No phase is "done" until tested
- Community feedback shapes priorities after Phase 2
