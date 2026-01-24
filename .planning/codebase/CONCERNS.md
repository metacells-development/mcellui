# Codebase Concerns

**Analysis Date:** 2026-01-24

## Critical Testing Gaps

**Android Platform Untested:**
- Issue: Phase 1-2 PHASES.md line 44 explicitly marks Android testing as pending ("[ ] Test demo app on Android Emulator")
- Files: All 55 UI components in `packages/registry/ui/` + 28 blocks in `packages/registry/blocks/`
- Impact: Components using Reanimated/Gesture Handler may behave differently on Android. Platform-specific style assumptions uncaught.
- Fix approach: Set up Android emulator CI testing in `.github/workflows/ci.yml`. Add explicit Android smoke tests for gesture-heavy components (Sheet, Carousel, SwipeableRow, ActionSheet).

**Accessibility Not Verified:**
- Issue: PHASES.md lines 138-139 mark VoiceOver (iOS) and TalkBack (Android) testing as pending. No `accessibilityLabel`, `accessibilityHint`, or `accessible` attributes found in grep.
- Files: All components lack a11y props. Zero usage across `packages/registry/ui/` and `packages/registry/blocks/`
- Impact: Components unusable for blind/low-vision users. Violates WCAG 2.1 AA. Brand risk.
- Fix approach: Add accessibility props to all interactive components. Implement in layers: (1) Button, Input, Checkbox, Switch, (2) Complex: Dialog, Sheet, Carousel, (3) Blocks. Test with Accessibility Inspector.

**No Automated Test Suite:**
- Issue: 314 test files found via `find` (all in node_modules). Zero test files in `packages/` or `apps/`
- Files: No `*.test.ts`, `*.spec.ts` files exist in source
- Impact: Regressions undetected. Manual testing before release mandatory. Slows iteration.
- Fix approach: Set up Jest or Vitest. Start with critical path: Button, Input, Dialog, Form system. Target 60%+ coverage for core components.

---

## Accessibility Debt

**Missing ARIA-like Semantics:**
- Issue: React Native lacks HTML ARIA standards. Components need explicit accessibility properties.
- Files: All `packages/registry/ui/*.tsx` components
- Current mitigation: None detected
- Recommendations:
  1. Add `accessibilityRole` prop to all interactive components (button, checkbox, switch, etc.)
  2. Add `accessibilityLabel` for screen readers to identify purpose
  3. Add `accessibilityHint` for complex interactions (e.g., "Double tap to expand")
  4. Test with Settings > Accessibility > VoiceOver (iOS) and TalkBack (Android)

**Color Contrast Not Verified:**
- Issue: WCAG AA requires 4.5:1 contrast ratio for normal text, 3:1 for large text
- Files: Theme colors defined in `packages/core/src/tokens/colors.ts`, used throughout
- Risk: Color pairs in dark/light modes may not meet standards
- Recommendation: Run contrast check tool on all 8 theme presets (zinc, slate, stone, blue, green, rose, orange, violet). Document which meet AA/AAA.

---

## Platform-Specific Fragility

**Gesture Handler + Reanimated Lifecycle Bugs:**
- Issue: Both Gesture Handler 2 and Reanimated 3 have known lifecycle edge cases on Android
- Files: `packages/registry/ui/sheet.tsx`, `packages/registry/ui/carousel.tsx`, `packages/registry/ui/swipeable-row.tsx`, `packages/registry/ui/action-sheet.tsx`
- Trigger: Opening/closing sheets rapidly, switching between multiple carousels
- Workaround: Ensure cleanup in useEffect (done in Dialog, Sheet). Risk of memory leaks if not careful.
- Safe modification: Always use `useCallback` for handlers. Test gesture cancellation on Android.

**Android Back Button Handling Inconsistent:**
- Issue: Android back button behavior differs across components using Modal
- Files: `packages/registry/ui/dialog.tsx` (line 86), `packages/registry/ui/sheet.tsx` (line 87), `packages/registry/ui/alert-dialog.tsx`
- Current: Uses `onRequestClose` prop, but Sheet/Dialog may not dismiss properly
- Recommendation: Add explicit back button test in Android emulator. Verify `BackHandler.addEventListener` integration if needed.

**Safe Area Edge Cases:**
- Issue: Components relying on safe area insets (notches, Dynamic Island, Android cutouts)
- Files: `packages/registry/ui/toast.tsx` (uses `useSafeAreaInsets`), others may need it
- Risk: Toast/Modals may overlap system UI on notched devices
- Test: Run on iOS 14+ with notch, Android 9+ with notch/punch-hole

---

## Dependency Risk

**Undeclared Peer Dependencies:**
- Issue: `packages/registry/blocks/product-card.tsx` imports React Native SVG but it's not in dependencies
- Files: `packages/registry/blocks/*.tsx` blocks use SVG icons inline
- Current: `react-native-svg` is in `packages/registry/package.json` but not declared consistently
- Recommendation: Audit all blocks. Ensure all external deps are listed explicitly.

**Reanimated 3 Worklets Not Type-Safe:**
- Issue: `'worklet'` directive is a runtime magic string, not type-checked
- Files: All gesture handlers use `'worklet'` (e.g., `packages/registry/ui/sheet.tsx` line 155+)
- Risk: Typos, missing returns, closure captures not caught until runtime
- Mitigation: ESLint plugin `eslint-plugin-reanimated` (not found in `.eslintrc` configs)
- Recommendation: Add to `eslint.config.js`. Configure rule set.

**CLI Dependency on `jiti` (ESM Module Loading):**
- Issue: `packages/cli/package.json` depends on `jiti` for dynamic config loading
- Files: `packages/cli/src/` (not inspected deeply)
- Risk: Loading untrusted `mcellui.config.ts` could execute arbitrary code
- Current mitigation: Assumed user controls their own config, but no sandboxing
- Recommendation: Document security consideration in README.

---

## Component Incompleteness

**Forms Integration Incomplete:**
- Issue: Form system exists but integrates with third-party libs (react-hook-form, zod)
- Files: `packages/registry/ui/form.tsx`, blocks like `packages/registry/blocks/login-block.tsx`
- Risk: Users must add these deps manually. No auto-install via CLI.
- Fix: Update CLI `add` command to detect form dependencies and install them.

**Icon System Fragmented:**
- Issue: Components embed SVGs directly instead of using icon library
- Files: All blocks (`packages/registry/blocks/*.tsx`) redefine icons (HeartIcon, CartIcon, etc.)
- Impact: Code duplication, inconsistent sizing/styling, bundling SVGs multiple times
- Fix: Create `@metacells/mcellui-icons` package with 50+ common icons or document how to integrate custom icon lib.

**Missing Screens (Incomplete Phase 5):**
- Issue: PHASES.md line 258 marks forgot-password-screen as skipped ("[ ] `forgot-password-screen`")
- Files: Only `onboarding-screen.tsx`, `otp-verification-screen.tsx` exist (2/3 planned)
- Impact: Common auth pattern missing
- Priority: Medium - can be added as separate contribution

---

## Performance Bottlenecks

**Reanimated Interpolation in Every Render:**
- Issue: Components using `interpolate()` re-run math on every frame
- Files: `packages/registry/ui/dialog.tsx` line 137-144, `packages/registry/ui/carousel.tsx` line 100+
- Current: Using Reanimated's `useAnimatedStyle` correctly, but complex transformations may lag
- Test: Profile with React Native Debugger on lower-end Android (API 29)

**Toast Stack Memory Leak Risk:**
- Issue: Toast component uses `useRef` to track toast IDs. If dismissal is delayed/missed, references persist
- Files: `packages/registry/ui/toast.tsx` line 100-200+
- Current mitigation: Automatic dismissal via `duration`, but no cleanup on unmount
- Recommendation: Audit useRef cleanup in useEffect. Add timeout abort logic.

**Carousel Snap Behavior on Large Lists:**
- Issue: Carousel doesn't use `FlatList` windowing for data arrays
- Files: `packages/registry/ui/carousel.tsx` line 68
- Risk: Rendering 100+ items at once causes frame drops
- Recommendation: Use `FlatList` internally for data arrays. Keep children pattern simple.

---

## Documentation Gaps

**Zero Component Pages in Documentation Site:**
- Issue: PHASES.md line 348 shows 1/43 component pages done (Button only). 42 remaining.
- Files: Phase 7 setup complete but content missing
- Impact: Users can't learn prop APIs, see examples, copy code
- Timeline: Priority for Phase 7.3+

**Block Props Not Documented:**
- Issue: 28 blocks exist but no individual documentation
- Files: `packages/registry/blocks/*.tsx` - most have JSDoc but no site pages
- Risk: Discovery hard, adoption low
- Fix: Generate block pages from JSDoc comments

**CLI Commands Under-Documented:**
- Issue: `nativeui create`, `nativeui pick`, `nativeui diff` exist but no usage examples
- Files: `packages/cli/README.md` (not inspected)
- Recommendation: Add examples to CLI package README

---

## Security Considerations

**Config File Remote Execution Risk:**
- Issue: CLI loads `mcellui.config.ts` via `jiti` dynamic import
- Files: `packages/cli/src/` (dynamic config loading)
- Risk: User's config could execute arbitrary code if injected
- Current mitigation: Config is local, user-controlled
- Recommendations:
  1. Document that configs should never be downloaded from untrusted sources
  2. Validate config schema with Zod before execution
  3. Consider sandboxing via Worker (complex, may not be necessary)

**SVG Injection in Blocks:**
- Issue: Blocks embed SVG paths as strings (product-card.tsx line 56-80)
- Risk: If these were user-generated, could be XSS vector (but they're not in this codebase)
- Current: Safe (hardcoded), but pattern is worth noting

---

## Known Behavioral Issues

**Dialog Backdrop Opacity Not Consistent:**
- Issue: Dialog backdrop opacity uses `DIALOG_CONSTANTS.backdropMaxOpacity` (assumed 0.5)
- Files: `packages/registry/ui/dialog.tsx` line 137
- Symptom: On some devices, backdrop may be too dark/light
- Workaround: Users can override via custom DialogContent styling
- Test coverage needed on different Android/iOS versions

**Sheet Gesture Cancellation on Swipe Conflict:**
- Issue: If Sheet is inside a ScrollView, swipe gestures may conflict
- Files: `packages/registry/ui/sheet.tsx` (gesture setup)
- Trigger: Nested scrollable content inside sheet
- Workaround: Use `scrollEnabled={false}` on nested ScrollViews or increase gesture tolerance
- Test: Not automated, manual verification only

**Toast Auto-Dismiss Race Condition:**
- Issue: Toast may dismiss while user is tapping action button
- Files: `packages/registry/ui/toast.tsx` (dismiss timing)
- Trigger: Setting low duration + slow action handler
- Workaround: Increase duration for toasts with actions
- Fix: Pause dismissal timer on press, resume after action completes

---

## Test Coverage Gaps

**Form Validation Not Tested:**
- What's not tested: `FormField`, `useFormField`, validation error display
- Files: `packages/registry/ui/form.tsx`, blocks `packages/registry/blocks/login-block.tsx`
- Risk: Form doesn't work if hooks are misconfigured
- Priority: High - forms are critical

**Gesture Handler Interactions Not Tested:**
- What's not tested: Long-press, swipe, pan gestures across platforms
- Files: `packages/registry/ui/sheet.tsx`, `packages/registry/ui/carousel.tsx`, `packages/registry/ui/action-sheet.tsx`
- Risk: Gesture behavior untested on Android
- Priority: High

**Dark Mode Not Tested:**
- What's not tested: Color switching, readability in dark mode
- Files: All components - dark colors defined but not visually verified
- Risk: Dark mode may have contrast issues or miss color overrides
- Test: Screenshots on iOS/Android with dark mode enabled

**Haptic Feedback Behavior:**
- What's not tested: Whether haptic calls work on different devices (some Android devices have haptics disabled)
- Files: Components using `haptic()` from core
- Risk: Silent failures on devices without haptic motor
- Recommendation: Wrap haptic calls in try-catch or device capability check

---

## Scaling Limits

**CLI Registry Size (55 components):**
- Current: 55 UI components + 28 blocks + 2 screens = 85 items in registry
- Limit: Registry JSON becomes unwieldy beyond 100+ items (parsing/search slow)
- Scaling path: (1) Paginate registry, (2) Add search indexing, (3) Create sub-registries (ui, blocks, screens)

**Demo App Navigation (55+ routes):**
- Issue: Demo app has 55+ component demos, navigation may become slow
- Files: `apps/demo/` navigation setup
- Scaling: Consider categorized tabs or search UI instead of flat list

**Bundle Size (Not Monitored):**
- Issue: No bundle size tracking in CI
- Files: `.github/workflows/ci.yml` (missing bundle check step)
- Risk: Components could quietly add dependencies, bloat bundle
- Recommendation: Add `bundlesize` or `size-limit` package with thresholds

---

## Fragile Patterns

**Context-Based Component Validation (No Runtime Validation):**
- Files: Dialog, Sheet, Tabs, Accordion use React Context
- Why fragile: If nested component is used outside provider, error thrown at render time
- Safe modification: Always add `if (!context) throw new Error(...)` checks (done in current code, good pattern)
- Test coverage: Missing - no tests for invalid nesting

**Hardcoded Animation Constants:**
- Files: `packages/core/src/constants.ts` defines DIALOG_CONSTANTS, SHEET_CONSTANTS, etc.
- Risk: If constants are out of sync with animation timing, UI looks janky
- Safe modification: Change constants in one place, test animation visually
- Example: DIALOG_CONSTANTS.closeAnimationDuration must match FadeOut timing

**Platform-Specific Styling Without Fallback:**
- Files: Components check `Platform.OS` but may not have fallback for unknown platforms (e.g., Web)
- Example: `packages/registry/ui/sheet.tsx` line 34 uses `Platform.OS === 'ios'`
- Risk: RN Web support breaks if component is used on web
- Recommendation: Use `Platform.select()` with 'default' fallback

---

## Missing Critical Features

**No Theme Builder UI (Phase 3 Incomplete):**
- Issue: Theme customization requires manual `mcellui.config.ts` edit
- Blocks: Users can't visually customize colors in demo app
- Impact: Poor DX, hard to discover theme capabilities
- Priority: Medium - nice-to-have for Phase 9

**No Component Search in Demo (Phase 7 In Progress):**
- Issue: Demo app has 55+ components but no search. ⌘K not wired in docs site.
- Files: `apps/docs/` - Fumadocs supports search but not configured
- Impact: Hard to find components, discoverability low
- Timeline: Phase 7.4 blocker

**No E2E Tests (Detox/Maestro):**
- Issue: No automated E2E testing framework configured
- Current: Manual testing only
- Risk: User flows untested (navigation, auth, form submission)
- Recommendation: Set up Maestro (simpler than Detox, cloud-based CI support)

---

## Dependencies at Risk

**Expo SDK Version Lock:**
- Issue: Project targets Expo SDK 54+, React Native 0.76+
- Risk: Expo SDK updates may break components (every version has breaking changes)
- Current: Package.json doesn't pin strict versions
- Mitigation: Test on each new Expo SDK release
- Timeline: Set up quarterly compatibility checks

**Reanimated 3 API Instability:**
- Issue: Reanimated 3 is relatively new, API may shift in 3.x releases
- Risk: Components using specific APIs (interpolate, withSpring) may break
- Current: Using documented APIs, should be stable
- Monitoring: Watch for deprecation warnings in beta/RC releases

**React Native Gesture Handler v2 Edge Cases:**
- Issue: Gesture Handler has known issues with nested gestures, Android back button
- Files: All sheet/gesture components
- Mitigation: Follow GitHub issues, pin version if critical fix needed
- Recommendation: Test on new GH releases in Android emulator

---

## Summary Table

| Category | Severity | Impact | Status |
|----------|----------|--------|--------|
| Android Testing Gap | Critical | Untested platform | Pending |
| Accessibility (a11y) | Critical | WCAG non-compliant | Not started |
| No Unit Tests | High | Regressions undetected | Missing |
| Platform Fragility | High | Gesture/animation bugs on Android | Known issues |
| Incomplete Documentation | High | Poor discoverability | In progress (Phase 7) |
| Form Integration | Medium | Manual dependency install | Needs CLI work |
| Icon Duplication | Medium | Code bloat, maintenance | Fragmented |
| Bundle Size Monitoring | Medium | Silent bloat risk | Not monitored |
| Theme Builder UI | Low | Poor DX for customization | Nice-to-have |
| E2E Testing | Low | User flows untested | Not started |

---

*Concerns audit: 2026-01-24*
