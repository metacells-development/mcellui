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

## Phase 1: Foundation ✅

**Status: COMPLETE**

Make everything actually work end-to-end.

### Goals
- [x] `npm install` works without errors
- [x] Demo app runs on iOS + Android simulators
- [x] CLI `init` and `add` commands work
- [x] Components pass basic visual QA

### Tasks
- [x] Fix any TypeScript errors
- [x] Test demo app on iOS Simulator
- [ ] Test demo app on Android Emulator
- [x] CLI: Wire up actual registry fetching
- [ ] Add missing Expo assets (icons, splash)
- [x] Verify all 5 components render correctly

### Exit Criteria
```bash
npm install        # ✅ No errors
npm run dev        # ✅ Demo app starts
npx nativeui init  # ✅ Creates config
npx nativeui add button  # ✅ Copies component
```

### Bonus Completed (beyond original scope)
- [x] Theme Presets (8 color themes: zinc, slate, stone, blue, green, rose, orange, violet)
- [x] Radius Presets (5 levels: none, sm, md, lg, full)
- [x] Color Overrides (general + mode-specific)
- [x] Font System (sans/heading/mono tokens)
- [x] Theme Selector UI component
- [x] 3 additional components (Checkbox, Switch, Radio Group)
- [x] Geist font integration

---

## Phase 2: Core Components ✅

**Status: COMPLETE**

Expanded from 8 to 26 production-ready components. StyleSheet-based styling (no NativeWind).

### Styling Decision
We stay with React Native StyleSheet + ThemeProvider. Reasons:
- NativeWind adds complexity without clear mobile benefit
- RN developers know StyleSheets better than Tailwind
- Our ThemeProvider with 8 presets works great
- CSS Variables aren't native to mobile anyway

### Core Components (6 components)
- [x] Label - Form labels with required indicator, size variants
- [x] Separator - Horizontal/vertical divider with color support
- [x] Skeleton - Loading shimmer with Reanimated interpolateColor
- [x] Spinner - Activity indicator with 4 sizes (sm/md/lg/xl)
- [x] Progress - Animated progress bar with indeterminate mode
- [x] Textarea - Multiline input with auto-grow, character count

### Overlay Components (4 components)
- [x] Dialog - Modal with backdrop, scale animation, compound pattern
- [x] Sheet - Bottom sheet with snap points, gesture handling
- [x] Toast - Notification system with ToastProvider, 4 variants
- [x] Alert Dialog - Confirmation modal with action/cancel buttons

### Navigation Components (3 components)
- [x] Tabs - Animated tab bar with sliding indicator, compound pattern
- [x] Accordion - Collapsible sections, single/multiple mode, animated chevron
- [x] Segmented Control - iOS-style picker with 3 sizes

### Input Components (4 components)
- [x] Select - Bottom sheet picker with search, multiple selection
- [x] Slider - Value slider with Gesture Handler, step increments
- [x] Stepper - Quantity input with +/- buttons, haptic feedback
- [x] (Previously: Checkbox, Switch, Radio Group)

### Mobile Components (2 components)
- [x] Pull to Refresh - RefreshControl wrapper with custom indicator
- [x] Swipeable Row - Swipe-to-reveal actions, full swipe support

### Technical Achievements

#### Animation Patterns Established
- Spring animations with `withSpring({ damping: 20, stiffness: 200 })`
- Timing animations with `Easing.out(Easing.quad)` from Reanimated
- `'worklet'` directive for gesture handler callbacks
- `runOnJS()` for calling JS functions from UI thread
- `interpolateColor()` for smooth color transitions

#### Component Patterns Established
- Compound components with React Context (Tabs, Accordion, Dialog)
- Controlled/Uncontrolled pattern for all inputs
- Platform-specific styling (iOS vs Android)
- Haptic feedback integration via `@nativeui/core`

#### Files Created/Modified
- 18 new component files in `packages/registry/ui/`
- 18 demo files in `apps/demo/components/demos/`
- Updated `registry.json` with all component metadata
- Updated navigation in demo app

### Quality Requirements
- [x] All components tested on iOS 17+
- [x] All components use Reanimated 3 for animations
- [x] All components use Gesture Handler 2 for gestures
- [x] Dark mode support
- [x] TypeScript strict mode (no `any`)
- [ ] All components tested on Android 13+ (pending)
- [ ] VoiceOver accessible (pending)
- [ ] TalkBack accessible (pending)

### Component Count Summary
| Category | Count |
|----------|-------|
| Inputs & Forms | 11 |
| Data Display | 7 |
| Overlays & Feedback | 4 |
| Navigation | 3 |
| Mobile Patterns | 2 |
| **Total** | **26** |

---

## Phase 3: Figma Plugin

**Status: IN PROGRESS** (Milestone 1 Complete)

Design-to-code workflow mit Figma Integration.

### Core Features
- [x] Figma Plugin Setup (manifest, UI, esbuild)
- [x] Design Token Sync (Colors, Spacing, Radius)
- [x] Light/Dark Mode Support
- [x] nativeui.config.ts Generator
- [ ] Component Export (Figma → nativeui Code)
- [ ] Theme Generation aus Figma Styles
- [ ] Asset Export (Icons, Images)

### Nice-to-Have
- [ ] Live Preview in Figma
- [ ] Bidirectional Sync (Code → Figma)
- [ ] Figma Variables Support
- [ ] Team Library Integration

---

## Phase 4: Forms & Blocks

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

## Phase 5: Tooling Polish

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

## Phase 6: Documentation

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

## Phase 7: Advanced Components & Screens

**Status: NOT STARTED**

Complex components and complete screens for power users.

### Advanced Components
- [ ] Command Palette
- [ ] Calendar / Date Picker
- [ ] Data Table
- [ ] Charts (victory-native)
- [ ] Navigation Bar
- [ ] Tab Bar
- [ ] Image Picker
- [ ] Camera Integration

### Complete Screens
- [ ] Onboarding Flow
- [ ] E-Commerce Product Detail
- [ ] Chat/Messaging
- [ ] Social Feed
- [ ] Dashboard

### Ecosystem
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
