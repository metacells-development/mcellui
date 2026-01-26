# Codebase Concerns

**Analysis Date:** 2026-01-26

## Tech Debt

**CheckoutScreen StepIndicator Type Safety:**
- Issue: StepIndicator function component receives `colors`, `spacing`, `fontSize`, `fontWeight` parameters with `any` type annotations (lines 153-156)
- Files: `packages/registry/screens/checkout-screen.tsx`
- Impact: Lines 184-185, 196 use these untyped parameters - no IDE autocomplete or type checking. Potential runtime issues if theme structure changes.
- Fix approach: Extract proper type from `useTheme()` hook return value and create typed interface for StepIndicator props. Reference how other screens handle theme destructuring.

**Orphaned screenTokens Function:**
- Issue: `screenTokens()` function created in core but never imported or used by any screen component
- Files: `packages/core/src/theme/components.ts` (lines 954-983)
- Impact: Dead code bloats core exports and creates confusion about intended API. Developers reading components won't understand the pattern.
- Fix approach: Either remove the function and use `SCREEN_CONSTANTS` directly (current pattern), or refactor all screens to use it for consistency. Choose one approach and document it.

**Orphaned SCREEN_CONSTANTS:**
- Issue: `SCREEN_CONSTANTS` object defined but not imported by any screen component
- Files: `packages/core/src/theme/components.ts` (lines 923-948)
- Impact: Exported from core for external use but no internal adoption. Creates maintenance burden and unclear API surface.
- Fix approach: Document intended usage (external library users only?), or migrate screens to use these constants for padding/header heights instead of hardcoded values. Currently screens define spacing inline.

**Type Safety in Registry Components:**
- Issue: 48 instances of `any` type across registry UI/blocks/screens (10 `as any` casts found)
- Files: `packages/registry/screens/checkout-screen.tsx`, `packages/registry/screens/chat-screen.tsx`, `packages/registry/ui/carousel.tsx`, and 23 others
- Impact: Loss of type safety prevents IDE assistance, increases refactoring risk when theme/props structure changes
- Fix approach: Create proper type exports from core (`ThemeValues` type, etc.) and apply across all components. Use TypeScript strict mode to catch new `any` usage.

## Monolithic Exports

**core/src/theme/components.ts Size:**
- Issue: Single file contains 1579 lines with 40+ token definitions and constants
- Files: `packages/core/src/theme/components.ts`
- Impact: Hard to navigate, increases merge conflicts in team development, slow IDE parsing
- Fix approach: Split into logical modules: `buttonTokens.ts`, `navigationTokens.ts`, `dataTokens.ts`, etc. Re-export from index.ts.

**core/src/index.ts Re-exports Everything:**
- Issue: All 40+ token definitions, all constants, and utility functions exposed at package level
- Files: `packages/core/src/index.ts` (179 lines)
- Impact: Large API surface, unclear dependencies, no way to tree-shake unused tokens
- Fix approach: Create named exports by category (`import { buttonTokens, cardTokens } from '@metacells/mcellui-core/tokens'`). Keep only essential primitives at root.

## Missing Test Coverage

**Zero Test Files in Packages:**
- Issue: No `.test.ts`, `.spec.ts`, or test configuration found in packages
- Files: All of `packages/registry`, `packages/core`, `packages/cli`
- Impact: Cannot verify component behavior, regression risk on changes, no CI validation
- Fix approach: Set up Jest/Vitest in packages, write tests for: (1) core theme functions, (2) component rendering with props, (3) CLI commands, (4) icon/SVG rendering. Start with high-risk areas: theme loading, animation tokens, form validation.

## Missing Error Boundaries

**Registry Components Lack Global Error Safety:**
- Issue: Many compound components throw if used outside provider (e.g., AlertDialog, Tabs, Sheet lines 62-104), but no error boundary wraps them in screens/blocks
- Files: `packages/registry/screens/*.tsx`, `packages/registry/blocks/*.tsx`
- Impact: One misplaced component or provider error crashes entire screen. Users don't see helpful error messages.
- Fix approach: Wrap screen/block rendering in ErrorBoundary (exists in core). Add JSDoc examples showing correct provider usage.

## Performance Bottlenecks

**Large Screen Components with State:**
- Issue: Checkout, SearchScreen, ProductDetailScreen use multiple `useState` hooks (8, 11, 3 respectively) without `useCallback` memoization
- Files: `packages/registry/screens/checkout-screen.tsx` (8 useState), `packages/registry/screens/search-screen.tsx` (11 useState), `packages/registry/screens/product-detail-screen.tsx` (3 useState)
- Impact: All child components re-render on every keystroke/filter change. Performance degrades with long product lists or complex checkout steps.
- Fix approach: Wrap expensive calculations in `useMemo`, wrap event handlers in `useCallback`, consider splitting into smaller managed sub-screens.

**FontSize/FontWeight Re-destructuring:**
- Issue: Every screen calls `useTheme()` to access `fontSize` and `fontWeight`, then passes through multiple component layers
- Files: All screens in `packages/registry/screens/`
- Impact: Creates prop drilling, increases bundle size with repeated destructuring, theme context accessed multiple times per render
- Fix approach: Create hook `useTypography()` that returns `{ fontSize, fontWeight }` memoized. Use throughout screens.

## Fragile Areas

**MCP Server Registry Path Resolution:**
- Issue: Registry path resolved via filesystem checks with fallback logic (getRegistryPath tries bundled path, then monorepo path)
- Files: `packages/mcp-server/src/resources/index.ts` (lines 14-23), `packages/mcp-server/src/tools/index.ts` (lines 42-53)
- Why fragile: Breaks if npm package structure changes, works differently in npm install vs monorepo, no error logging if both paths fail
- Safe modification: Add explicit error handling with logged warnings. Test both scenarios (npm/monorepo). Document expected directory structure.
- Test coverage: Missing - no tests for path resolution

**Figma Plugin UI State Management:**
- Issue: 8 top-level useState hooks in Figma plugin UI with complex message handling (lines 33-67 in ui.tsx)
- Files: `packages/figma-plugin/src/ui.tsx`
- Why fragile: Message routing between plugin thread and UI thread uses string-based case switching. Easy to lose sync if types change.
- Safe modification: Create state machine/reducer for message handling. Use discriminated unions instead of strings.
- Test coverage: Figma plugin uses web APIs, hard to test. Document message protocol.

## Dependencies at Risk

**Deprecated Theming Approach:**
- Issue: THEMING.md marked as `DEPRECATED` - "Dieser Ansatz wird durch NativeWind ersetzt"
- Files: `docs/features/THEMING.md`
- Risk: Conflicting documentation suggests StyleSheet+ThemeProvider will be replaced with NativeWind/Tailwind
- Impact: All 27 components built on current theming. Migration would be massive refactor.
- Migration plan: Clarify decision: (1) Keep StyleSheet+ThemeProvider long-term (update docs), or (2) Plan NativeWind migration with phased approach. If keeping current, remove deprecation marker.

**React 19 + React Native 0.81 Compatibility:**
- Issue: Using React 19.1.0 with React Native 0.81.5 (stable versions are 19.x RN 0.76)
- Files: `package.json`
- Risk: React 19 has breaking changes in hooks/suspense. React Native 0.81 is from Jan 2025. Early versions of combined ecosystem.
- Mitigation: Monitor React Native releases. Lock minor versions. Document tested combinations.

## Security Considerations

**Figma Plugin Credentials in Plain Text:**
- Issue: Figma plugin uses postMessage to communicate between threads. Token/collection data passed without validation
- Files: `packages/figma-plugin/src/ui.tsx`
- Risk: If compromised, could extract design tokens. Plugin runs in user's Figma account context.
- Mitigation: Validate message schema, sanitize token strings, don't log sensitive data to console
- Recommendations: Add message type validation (runtime), document security model for users

**MCP Server Remote Registry Fallback:**
- Issue: MCP server falls back to remote GitHub registry if local not found (line 96 in tools/index.ts)
- Files: `packages/mcp-server/src/tools/index.ts`
- Risk: MITM attack could serve malicious component code to Claude
- Mitigation: Validate registry.json signature, pin GitHub URL, use HTTPS only
- Recommendations: Document registry trust model, add integrity checks

## Scaling Limits

**Core Components File (1579 Lines):**
- Current capacity: ~40 token definitions, 1600 lines
- Limit: Beyond ~2000 lines, IDE performance degrades, developer navigation becomes painful
- Scaling path: (1) Split into feature modules, (2) Create separate token packages for theming, (3) Lazy-load token definitions

**MCP Registry Cache:**
- Current capacity: Single `registryCache` var holds entire registry.json in memory
- Limit: If registry grows beyond 1MB, memory footprint becomes noticeable in Claude context
- Scaling path: (1) Index components, (2) Lazy-load code on demand, (3) Compress registry file

## Unfixed Bugs from v1 Milestone

**CheckoutScreen fontSize/fontWeight Undefined (Runtime Bug):**
- Symptoms: StepIndicator lines 184-185 reference `fontSize.xs` and `fontWeight.semibold` but these are passed as `any` untyped parameters
- Files: `packages/registry/screens/checkout-screen.tsx` (lines 180-192)
- Cause: Function receives typed theme values but destructures them as `any`. If caller passes wrong structure, runtime error on property access.
- Workaround: Works at runtime because caller (line 545) correctly passes theme values, but type checker can't verify it
- Recommendation: Declare `StepIndicatorProps` interface with proper types extracted from theme

## Test Coverage Gaps

**All Screen Components Untested:**
- What's not tested: Layout rendering, form validation, navigation callbacks, state updates
- Files: `packages/registry/screens/checkout-screen.tsx`, `packages/registry/screens/search-screen.tsx`, `packages/registry/screens/product-detail-screen.tsx`, and 16 others (19 total)
- Risk: Cannot verify checkout flow works end-to-end, search filters apply correctly, or form submission triggers callbacks
- Priority: **HIGH** - Screens are end-user facing, bugs here impact app credibility

**CLI Commands Untested:**
- What's not tested: File scaffolding, project initialization, config loading
- Files: `packages/cli/src/commands/*.ts` (create.ts, doctor.ts, etc.)
- Risk: Users get broken scaffolds or corrupted configs. No validation that generated files are valid TypeScript.
- Priority: **MEDIUM** - Blocks adopters but can be worked around manually

**Core Theme Functions Untested:**
- What's not tested: Theme provider setup, color token resolution, typography calculations
- Files: `packages/core/src/theme/ThemeProvider.tsx`, `packages/core/src/theme/colors.ts`
- Risk: Theme changes break silently. Dark mode, custom themes not validated before release.
- Priority: **HIGH** - Theme is foundation for all 102 components

**Figma Plugin Integration Untested:**
- What's not tested: Token extraction, component generation, round-trip sync
- Files: `packages/figma-plugin/src/lib/tokens/extractor.ts`, `packages/figma-plugin/src/lib/components/generator.ts`
- Risk: Generated tokens or components are malformed, breaking apps that depend on sync
- Priority: **MEDIUM** - Power user feature, less critical than core components

---

*Concerns audit: 2026-01-26*
