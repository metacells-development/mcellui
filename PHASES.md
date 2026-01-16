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

**Status: COMPLETE**

Form integration and screen templates.

### Forms
- [x] react-hook-form integration
- [x] zod validation
- [x] FormField with Controller integration
- [x] Form component (FormProvider wrapper)
- [x] FormItem, FormLabel, FormMessage, FormDescription
- [x] useFormField hook for field state access

### Blocks (Screen Templates)
- [x] LoginBlock - Email/Password + Social Login
- [x] SignupBlock - Name/Email/Password + Terms Checkbox
- [x] SettingsListBlock - Grouped settings with Switch/Navigation
- [x] ProfileBlock - Avatar, Name, Stats, Action Buttons
- [x] EmptyStateBlock - Icon, Title, Description, CTA
- [x] ErrorStateBlock - Error Icon, Message, Retry Button

### Files Created
- `packages/registry/ui/form.tsx` - Form system components
- `packages/registry/blocks/login-block.tsx`
- `packages/registry/blocks/signup-block.tsx`
- `packages/registry/blocks/settings-list-block.tsx`
- `packages/registry/blocks/profile-block.tsx`
- `packages/registry/blocks/empty-state-block.tsx`
- `packages/registry/blocks/error-state-block.tsx`

### Demo App Updates
- Form demo with Login/Signup examples
- Blocks demo with all block previews
- Dependencies: react-hook-form, @hookform/resolvers, zod

---

## Phase 5: B2C Expansion

**Status: IN PROGRESS** (Batch 1 Complete)

Expand from 33 items to 62 - optimized for consumer apps.

See [docs/phases/phase-5-b2c-expansion.md](./docs/phases/phase-5-b2c-expansion.md) for full details.

### New Components (17)

**Core Inputs & Actions (8)**
- [x] `search-input` - Search icon, clear button, loading state
- [ ] `datetime-picker` - Date/time via bottom sheet
- [x] `icon-button` - Square/circular icon-only button
- [x] `fab` - Floating Action Button (bottom-right)
- [x] `action-sheet` - iOS-style bottom menu
- [x] `list` - ListItem with slots, chevron, dividers
- [ ] `tooltip` - Long-press popup
- [x] `chip` - Selectable filter pills

**Media (5)**
- [x] `image` - Loading skeleton, error fallback, blur-up
- [x] `carousel` - Horizontal swipe with dots
- [ ] `stories` - Avatar with gradient ring (Instagram-style)
- [x] `avatar-stack` - Overlapping avatars
- [ ] `image-gallery` - Grid with fullscreen tap

**Layout & Navigation (4)**
- [x] `horizontal-list` - Snap-scroll container
- [x] `section-header` - Title + "See All"
- [ ] `header` - Top nav with back, title, actions
- [x] `rating` - Star display/input

### New Blocks (8)
- [ ] `notification-item` - Avatar, message, time, unread dot
- [ ] `content-card` - Large image + title + action
- [ ] `feature-card` - Icon + title + description
- [ ] `stats-card` - Big number + trend indicator
- [ ] `quick-actions-grid` - Grid of icon buttons
- [ ] `hero-block` - Full-width image + title + CTA
- [ ] `social-proof-bar` - Avatar stack + engagement text
- [ ] `search-header` - Search + filter + avatar

### New Screens (3)
- [ ] `onboarding-screen` - Swipe carousel + skip/start
- [ ] `forgot-password-screen` - Email + submit
- [ ] `otp-verification-screen` - Code input + resend

### Theme Enhancements
- [ ] Animation presets: `subtle` vs `playful`
- [ ] Spring config variants per preset

### Summary
| Category | Before | Current | Target |
|----------|--------|---------|--------|
| Components | 27 | 33 | 45 |
| Blocks | 6 | 6 | 14 |
| Screens | 0 | 0 | 3 |
| **Total** | **33** | **39** | **62** |

---

## Phase 6: Tooling & MCP

**Status: NOT STARTED**

CLI polish and MCP-guided component creation.

### CLI
- [ ] `nativeui diff` - Show component updates
- [ ] `nativeui doctor` - Check compatibility
- [ ] `nativeui update` - Update components
- [ ] `nativeui create` - Scaffold new component
- [ ] Interactive component picker

### MCP Server
- [ ] Live registry data (not hardcoded)
- [ ] Component creation guide for Claude
- [ ] AI suggestions based on context
- [ ] Theme customization support

---

## Phase 7: Documentation & Playground

**Status: NOT STARTED**

Public documentation site with interactive playground.

### Documentation Site (Next.js)
- [ ] Next.js 14+ App Router Setup
- [ ] MDX for Component Docs
- [ ] Auto-generated API docs from TypeScript
- [ ] Getting Started Guide
- [ ] Theme Customization Guide

### Interactive Playground
- [ ] Live Component Preview (React Native Web)
- [ ] Prop Editor (variants, sizes live)
- [ ] Code Editor with syntax highlighting
- [ ] Share links for playground states

---

## Phase 8: CI/CD & Release

**Status: NOT STARTED**

Finale Phase - Automatisierte Qualitätssicherung und erster npm Release.

### GitHub Actions Workflows
- [ ] `ci.yml` - Lint, TypeCheck, Build bei jedem PR
- [ ] `release.yml` - npm Publish bei Git Tag (v*)
- [ ] `demo.yml` - Expo Preview Build für PRs (optional)

### Quality Gates
- [ ] ESLint muss bestehen
- [ ] TypeScript strict muss bestehen
- [ ] Build muss erfolgreich sein
- [ ] Bundle Size Check (Warnung bei >10% Anstieg)

### Testing Infrastructure
- [ ] Jest Setup (Config, Mocks für RN)
- [ ] Mindestens 1 Smoke Test pro Component
- [ ] Detox/Maestro E2E Setup (optional)

### Release Vorbereitung
- [ ] package.json Versionen finalisieren (1.0.0)
- [ ] README.md für npm optimieren
- [ ] CHANGELOG.md anlegen
- [ ] npm publish dry-run testen

### Bonus
- [ ] Dependabot für Dependency Updates
- [ ] CodeQL Security Scanning
- [ ] Automatische Changelog-Generierung

---

## Timeline Notes

- Each phase should be ~1-2 weeks of focused work
- Phases can overlap (e.g., docs while building components)
- Quality > speed: No phase is "done" until tested
- Community feedback shapes priorities after Phase 2
