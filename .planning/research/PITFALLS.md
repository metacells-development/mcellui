# Common Pitfalls in Developer Tooling

**Domain:** CLI tools, package libraries, and developer tooling for React Native/Expo
**Researched:** 2026-01-26
**Confidence:** HIGH (verified with official sources and current 2025-2026 ecosystem data)

## Executive Summary

Developer tooling pitfalls fall into five critical categories: CLI user experience failures, package configuration errors, dependency management issues, TypeScript/export misconfigurations, and React Native/Expo-specific compatibility problems. These pitfalls cause user frustration, silent failures, and maintenance nightmares.

**Most Critical for mcellui:**
1. TypeScript source exports in production (core package exports .ts files)
2. Missing peer dependency declarations (registry lacks reanimated, gesture-handler)
3. CLI error messages without actionable guidance
4. Expo SDK version compatibility tracking

---

## Critical Pitfalls

### Pitfall 1: Silent CLI Failures
**What goes wrong:** Commands fail without clear error messages, leaving users confused about what happened and how to fix it.

**Why it happens:**
- Catching errors but not displaying them properly
- Writing errors to stdout instead of stderr
- Not providing exit codes on failure
- Swallowing exceptions with generic messages

**Consequences:**
- Users waste hours debugging
- Loss of trust in the tool
- Support burden increases
- Users abandon the tool

**Prevention:**
- Always write errors to stderr, not stdout
- Exit with nonzero status codes (process.exit(1)) on errors
- Include actionable guidance in error messages: "Command failed" → "Could not find mcellui.config.ts. Run 'mcellui init' first."
- Catch expected errors and rewrite for humans
- Include error codes for searchability (ERROR_001: Config not found)

**Detection:**
- Test CLI with invalid inputs
- Check if errors go to stderr: `mcellui invalid-command 2>&1 | grep ERROR`
- Verify exit codes: `mcellui fail-command; echo $?` (should be non-zero)
- Search codebase for: `console.log` in error handlers, missing `process.exit(1)`

**Source:** [Command Line Interface Guidelines (clig.dev)](https://clig.dev/), [CLI Best Practices](https://hackmd.io/@arturtamborski/cli-best-practices)

---

### Pitfall 2: TypeScript Source Exports in Production
**What goes wrong:** Exporting TypeScript source files (.ts) instead of compiled JavaScript breaks in production environments and non-TypeScript projects.

**Why it happens:**
- Development convenience: monorepo works with source files
- Forgetting to build before publishing
- Not understanding package.json exports field implications
- Assuming all consumers use TypeScript with proper configuration

**Consequences:**
- "Cannot find module" errors in production
- Breaks for JavaScript-only projects
- Requires consumers to configure TypeScript paths
- Breaks in Next.js, React Native Metro, and other bundlers
- npm install works but runtime fails

**Prevention:**
- Build to dist/ directory before publishing
- Export compiled .js and .d.ts files, not .ts source
- Use prepublishOnly script: `"prepublishOnly": "npm run build"`
- Test published package in fresh project: `npm pack && npm install ./package.tgz`
- Use exact paths in exports, verify they exist

**Example Fix:**
```json
// ❌ WRONG (mcellui-core current state)
{
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}

// ✅ CORRECT
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  }
}
```

**Detection:**
- Check package.json exports point to .ts files (❌ RED FLAG)
- Run `npm pack` and inspect tarball contents
- Check for build script and prepublishOnly hook
- Try importing in vanilla JavaScript project
- Search for: `"./src/` in exports field

**mcellui Affected Packages:**
- @metacells/mcellui-core (exports TypeScript source)

**Source:** [TypeScript in 2025 with ESM and CJS npm publishing](https://lirantal.com/blog/typescript-in-2025-with-esm-and-cjs-npm-publishing), [TypeScript Handbook - Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

---

### Pitfall 3: Missing or Incorrect Peer Dependencies
**What goes wrong:** Components break at runtime because required packages aren't installed, or version conflicts cause silent failures.

**Why it happens:**
- Forgetting to declare peer dependencies used in components
- Declaring dependencies instead of peerDependencies for shared packages
- Not specifying version ranges (too loose or too strict)
- React Native ecosystem: no central control over what gets added to peerDependencies

**Consequences:**
- "Cannot find module" errors at runtime (not install time)
- Multiple versions bundled (2x bundle size)
- Cryptic errors: "useNativeDriver is not available" (missing reanimated)
- Version conflicts: react-native@0.76 vs react-native@0.77 incompatibility
- Users stuck with --force or --legacy-peer-deps flags

**Prevention:**
- Audit all imports in components: every third-party import should be in peerDependencies
- Use version ranges aligned with ecosystem: `>=7.50.0` not `^7.50.0`
- Declare peer dependencies for React Native core: react, react-native
- Declare peer dependencies for animation/gesture libraries: reanimated, gesture-handler
- Check compatibility: React Native Directory for New Architecture support
- Include peerDependencies in devDependencies for local testing

**Common React Native Peer Dependencies:**
```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-native-reanimated": ">=3.0.0",
    "react-native-gesture-handler": ">=2.0.0",
    "react-hook-form": ">=7.50.0",
    "@hookform/resolvers": ">=3.3.0",
    "zod": ">=3.22.0"
  }
}
```

**Detection:**
- Grep for imports not in peerDependencies: `grep -r "from 'react-native-" registry/ui/`
- Check if animation components declare reanimated peer dependency
- Verify registry package.json includes all used libraries
- Test fresh install: `npm install` in new project, run demo

**mcellui Affected Packages:**
- @metacells/mcellui-registry (likely missing reanimated, gesture-handler for Sheet, Dialog, Toast, Swipeable)

**Source:** [React Native Dependency Management](https://microsoft.github.io/rnx-kit/docs/architecture/dependency-management), [Resolving Peer Dependency Errors in React 2025](https://dev.to/aslanreza/resolving-peer-dependency-errors-in-react-a-comprehensive-guide-3all)

---

### Pitfall 4: Expo SDK Version Mismatches
**What goes wrong:** Components work locally but break after users upgrade Expo SDK or React Native versions.

**Why it happens:**
- Expo SDK updates 3x per year, React Native releases 6x per year
- Each Expo SDK targets exactly one React Native version
- Popular libraries often don't support both RN 0.76 and 0.77 simultaneously
- New Architecture requires library updates (legacy arch removed late 2025)
- Components tested on one SDK version, users on another

**Consequences:**
- "Incompatible React version" errors after security updates
- Gradle build failures on Android
- Methods unavailable: "undefined is not a function (evaluating 'UIManager.getConstants')"
- Cannot upgrade Expo without breaking components
- Users stuck on old SDK versions (security risk)

**Prevention:**
- Test against multiple Expo SDK versions (current, current-1, next-beta)
- Document supported versions explicitly in README
- Check React Native Directory for library compatibility status
- Use Expo modules when possible (better compatibility guarantees)
- Monitor Expo changelog for breaking changes
- Test with New Architecture enabled (enableNewArchMobile: true)
- Use peerDependencies with ranges: react-native >=0.73.0

**Version Tracking:**
```
Expo SDK 54 → React Native 0.81 (Jan 2025)
Expo SDK 53 → React Native 0.78
Expo SDK 52 → React Native 0.77 (Dec 2024)

React Native New Architecture:
- Required by late 2025
- Check compatibility: reactnative.directory
```

**Detection:**
- Check demo app Expo SDK version in package.json
- Test components on Expo SDK 52, 53, 54
- Enable New Architecture in app.json and test
- Search for deprecated APIs: UIManager direct access, legacy modules
- Monitor React Native 0.77+ compatibility

**mcellui Affected Packages:**
- All packages (currently tested on SDK 54 only)
- Sheet, Dialog, Toast use reanimated (check version compatibility)

**Source:** [Expo for React Native in 2025](https://hashrocket.com/blog/posts/expo-for-react-native-in-2025-a-perspective), [React Native 0.77 with Expo SDK 52 Changelog](https://expo.dev/changelog/2025-01-21-react-native-0.77), [React Native Version Mismatch Guide](https://docs.expo.dev/troubleshooting/react-native-version-mismatch/)

---

### Pitfall 5: Copy-Paste Component Updates & Maintenance
**What goes wrong:** Users install components via copy-paste (shadcn model), but can't easily update them when bugs are fixed or features added.

**Why it happens:**
- Components live in user's codebase, not node_modules
- No automatic update mechanism
- Users customize components, making merge conflicts likely
- Upstream changes require manual merge
- No version tracking for copied components

**Consequences:**
- Users miss bug fixes and security patches
- Each project has different component versions
- Support becomes impossible: "Which version do you have?"
- Breaking changes can't be communicated effectively
- Users stuck maintaining forked code
- Community fragmentation (everyone has different bugs)

**Prevention:**
- Implement `mcellui diff [component]` command to show changes
- Add version comments to copied components: `// @mcellui/button v0.1.5`
- Provide migration guides for breaking changes
- Make components composable (easier to update parts)
- Track registry version in mcellui.config.ts
- Warn on outdated components: `mcellui check-updates`
- Keep breaking changes minimal (every break = user pain)

**Detection:**
- Check if CLI has diff command
- Verify components include version comments
- Test update flow: copy component, update registry, run diff
- Check for breaking changes between versions
- Survey user pain points around updates

**mcellui Mitigation Strategy:**
- CLI already has `mcellui diff` command ✅
- Add version tracking to registry metadata
- Consider component versioning in registry.json

**Source:** [shadcn/ui Architecture Lessons](https://medium.com/@szainabshah806/why-i-choose-shadcn-ui-over-other-ui-libraries-in-2025-b64e3243d92c), [The Foundation for Design Systems](https://ui.shadcn.com/)

---

## Moderate Pitfalls

### Pitfall 6: Unclear CLI Error Messages
**What goes wrong:** Errors don't explain what happened or how to fix it.

**Prevention:**
- Follow format: "What failed. Why it failed. How to fix it."
- Example: ❌ "Config error" → ✅ "Invalid theme 'rainbow' in mcellui.config.ts. Valid themes: zinc, slate, stone, blue, green, rose, orange, violet"
- Include context: show filename, line number, expected vs actual
- Suggest next steps: "Run 'mcellui list' to see available components"
- Use color coding: red for errors, yellow for warnings, cyan for hints

**Detection:**
- Test every CLI error path
- Check error messages have actionable guidance
- Verify no generic "Error: Something went wrong"

**Source:** [What's in a Good Error Message](https://www.morling.dev/blog/whats-in-a-good-error-message/), [Error Message Guidelines - Nielsen Norman Group](https://www.nngroup.com/articles/error-message-guidelines/)

---

### Pitfall 7: Missing Config Validation
**What goes wrong:** Invalid config silently fails or causes cryptic errors later.

**Prevention:**
- Validate config on load with Zod schema
- Provide clear validation errors: "theme must be one of: zinc, slate..."
- Support schema validation in IDE (TypeScript types + JSDoc)
- Fail fast: validate on `mcellui init`, not at component add time

**Detection:**
- Check if CLI uses Zod for config validation (✅ CLI has zod dependency)
- Test invalid config values: wrong theme, wrong radius, missing fields
- Verify helpful error messages

**mcellui Status:** CLI includes zod, likely has validation ✅

---

### Pitfall 8: Platform-Specific Code Without iOS/Android Testing
**What goes wrong:** Component works perfectly on iOS but crashes on Android, or vice versa.

**Prevention:**
- Test every component on both platforms
- Use Platform.select() for platform-specific styles
- Check Android-specific issues: elevation vs shadow, StatusBar, hardware back button
- Test iOS-specific issues: SafeAreaView, notch handling, KeyboardAvoidingView
- Test on real devices, not just simulators (performance, gestures)

**Detection:**
- Check if CI runs iOS and Android tests
- Verify components use Platform.OS checks correctly
- Test gesture handlers on Android (different from iOS)

---

### Pitfall 9: Missing TypeScript Strictness
**What goes wrong:** `any` types creep in, defeating the purpose of TypeScript.

**Prevention:**
- Enable strict mode in tsconfig.json
- No `any` types (use `unknown` if truly unknown)
- Proper component prop types (no `props: any`)
- Enable noImplicitAny, strictNullChecks, strictFunctionTypes

**Detection:**
- Grep for `any` in component files
- Check tsconfig.json for strict: true
- Run tsc --noEmit and check for type errors

---

### Pitfall 10: Monorepo Workspace Dependency Issues
**What goes wrong:** Local development works but published packages fail.

**Prevention:**
- Use workspace protocol for local deps: `"@metacells/mcellui-core": "workspace:*"`
- Test published package: npm pack, install in fresh project
- Don't rely on hoisted dependencies in monorepo
- Each package must declare all its dependencies

**Detection:**
- Check package.json for workspace: protocol usage
- Verify dependencies aren't relying on root hoisting
- Test: install single package outside monorepo

---

### Pitfall 11: CLI Not Respecting User's Code Style
**What goes wrong:** CLI adds components with wrong indentation, semicolons, quotes.

**Prevention:**
- Detect indent style from existing files (detect-indent library)
- Match user's import style (default vs named imports)
- Preserve formatting of existing files on update
- Don't force opinionated formatting

**Detection:**
- Check if CLI uses detect-indent (✅ CLI has detect-indent dependency)
- Test with different code styles: tabs, 2-space, 4-space
- Verify added components match project style

**mcellui Status:** CLI includes detect-indent ✅

---

### Pitfall 12: Broken Animations on Android
**What goes wrong:** Reanimated animations look smooth on iOS but janky on Android.

**Prevention:**
- Use useNativeDriver: true whenever possible
- Test on mid-range Android devices (not just flagship)
- Avoid animating non-native properties (transform, opacity OK; width/height not OK)
- Check for dropped frames in Dev Menu → Show Perf Monitor

**Detection:**
- Run demo on Android emulator and real device
- Check for useNativeDriver usage in animated components
- Monitor frame rate during animations

---

## Minor Pitfalls

### Pitfall 13: Missing Demo for Components
**What goes wrong:** Users don't know how to use components without examples.

**Prevention:**
- Every component needs demo in demo app
- Show common use cases, not just basic usage
- Include form validation examples for inputs
- Show dark mode, different sizes, disabled states

**Detection:**
- Check if demo app includes all 27 components + 6 blocks
- Verify demos show multiple variants

---

### Pitfall 14: Inconsistent Naming Conventions
**What goes wrong:** Mixed conventions (kebab-case, camelCase, PascalCase) confuse users.

**Prevention:**
- File names: kebab-case (button.tsx, alert-dialog.tsx)
- Component names: PascalCase (Button, AlertDialog)
- Props: camelCase (backgroundColor, onPress)
- CLI commands: kebab-case (mcellui add button)

**Detection:**
- Audit file naming in registry/ui/
- Check CLI command naming consistency

---

### Pitfall 15: Hardcoded Colors Instead of Theme Tokens
**What goes wrong:** Dark mode doesn't work, customization breaks.

**Prevention:**
- Always use theme tokens: colors.primary, not '#7C3AED'
- Test dark mode on every component
- Use semantic color names: background, foreground, primary

**Detection:**
- Grep for hex colors: `grep -r "#[0-9A-F]" registry/ui/`
- Check if components use useTheme() hook

---

### Pitfall 16: Oversized Dependencies
**What goes wrong:** CLI or packages install massive dependencies for tiny features.

**Prevention:**
- Audit dependency size: npx bundlephobia [package]
- Use native APIs when possible (fs, path instead of libraries)
- Lazy load heavy dependencies (only load when needed)
- Question every dependency: "Can we build this in 50 lines?"

**Detection:**
- Run `npm install` and check size
- Check bundle size: npx bundlephobia @metacells/mcellui-cli

---

### Pitfall 17: Missing Accessibility Labels
**What goes wrong:** VoiceOver/TalkBack users can't use components.

**Prevention:**
- Add accessibilityLabel to buttons, inputs, touchables
- Test with screen reader enabled
- Support accessibilityRole, accessibilityHint
- Keyboard navigation support (TV, Android hardware keyboards)

**Detection:**
- Test with VoiceOver on iOS simulator
- Test with TalkBack on Android emulator
- Check for accessibility props in components

---

### Pitfall 18: Form Components Without Validation Examples
**What goes wrong:** Users struggle to integrate react-hook-form with components.

**Prevention:**
- Provide FormField wrapper for react-hook-form
- Show validation examples with Zod schemas
- Demo error states, async validation, field arrays

**Detection:**
- Check if demo app shows form validation
- Verify Form component integrates with react-hook-form

**mcellui Status:** Form system with FormField exists ✅

---

### Pitfall 19: Metro Bundler Config Errors
**What goes wrong:** Components fail to import, assets don't resolve.

**Prevention:**
- Document Metro config requirements
- Provide metro.config.js template
- Test with fresh Expo project
- Handle asset resolution (SVG, fonts)

**Detection:**
- Test mcellui init in fresh Expo project
- Verify Metro config setup in CLI

---

### Pitfall 20: No Migration Guides for Breaking Changes
**What goes wrong:** Users upgrade, everything breaks, no guidance.

**Prevention:**
- Write migration guide for every breaking change
- Use semantic versioning correctly
- Provide codemod scripts for major updates
- Warn in CLI before destructive operations

**Detection:**
- Check for CHANGELOG.md with migration notes
- Verify versioning follows semver

---

## Domain-Specific Pitfalls: React Native/Expo

### Pitfall 21: Expo Go Incompatibility Not Documented
**What goes wrong:** Component requires native modules, breaks in Expo Go.

**Prevention:**
- Mark components requiring dev client in docs
- Provide Expo Go compatible alternatives when possible
- Test in Expo Go, not just dev client

**Detection:**
- Check README for Expo Go compatibility notes
- Test demo app in Expo Go

---

### Pitfall 22: Android Hardware Back Button Ignored
**What goes wrong:** Modals, dialogs don't close on Android back button press.

**Prevention:**
- Use BackHandler API in Sheet, Dialog, AlertDialog
- Test on Android with hardware back button
- Follow Android platform conventions

**Detection:**
- Test Sheet/Dialog on Android
- Check for BackHandler.addEventListener in modal components

---

### Pitfall 23: iOS Safe Area Ignored
**What goes wrong:** Content hidden under notch or home indicator.

**Prevention:**
- Use SafeAreaView or useSafeAreaInsets
- Test on iPhone 14 Pro (dynamic island) and iPhone 15 Pro Max (notch)
- Respect safe areas in full-screen modals

**Detection:**
- Test on iPhone with notch in simulator
- Check if Sheet/Dialog use safe area insets

---

## Configuration Pitfalls

### Pitfall 24: Config File Not Found But No Error
**What goes wrong:** mcellui.config.ts missing, falls back to defaults silently.

**Prevention:**
- Warn if config file not found
- Suggest running mcellui init
- Show which config is being used (default vs custom)

**Detection:**
- Delete mcellui.config.ts and run CLI
- Verify warning or error appears

---

### Pitfall 25: Invalid Config Values Accepted
**What goes wrong:** Theme "rainbow" doesn't exist but no validation error.

**Prevention:**
- Validate theme against valid presets: zinc, slate, stone, blue, green, rose, orange, violet
- Validate radius: none, sm, md, lg, full
- Validate colorScheme: light, dark, system

**Detection:**
- Test invalid values in mcellui.config.ts
- Check Zod schema includes enum validation

---

## Audit Checklist

### CLI Package (@metacells/mcellui-cli)
- [ ] Errors written to stderr, not stdout
- [ ] Non-zero exit codes on failure
- [ ] Error messages include actionable guidance
- [ ] Config validation with Zod (✅ has zod)
- [ ] User code style detection (✅ has detect-indent)
- [ ] Help text for all commands
- [ ] `mcellui diff` command works correctly
- [ ] Handles missing config file gracefully
- [ ] Version flag: `mcellui --version`
- [ ] Test in fresh Expo project

### Core Package (@metacells/mcellui-core)
- [ ] ❌ CRITICAL: Exports TypeScript source (.ts) instead of compiled (.js)
- [ ] Build script exists and works
- [ ] prepublishOnly hook prevents publishing unbuild code
- [ ] Types exported correctly (.d.ts files)
- [ ] Test import in JavaScript project (not TypeScript)
- [ ] Peer dependencies declared (react, react-native)
- [ ] Version ranges reasonable (>=18.0.0 not ^18.0.0)
- [ ] No hardcoded colors (uses theme tokens)
- [ ] Theme validation works

### Registry Package (@metacells/mcellui-registry)
- [ ] ❌ LIKELY: Missing peer dependencies (reanimated, gesture-handler)
- [ ] All imports declared in peerDependencies
- [ ] Check: Sheet, Dialog, Toast use reanimated → needs peer dep
- [ ] Check: Swipeable, PullToRefresh use gesture-handler → needs peer dep
- [ ] Form components declare react-hook-form, @hookform/resolvers, zod
- [ ] Test fresh install doesn't have missing module errors
- [ ] Version comments in components (for update tracking)
- [ ] No `any` types in component props
- [ ] All components tested on iOS AND Android
- [ ] Dark mode works for all components
- [ ] Accessibility labels present

### MCP Server Package (@metacells/mcellui-mcp-server)
- [ ] Registry copy script works (copy-registry)
- [ ] Bundled registry.json is up to date
- [ ] Error handling for missing files
- [ ] Correct permissions for bin script

### Demo App
- [ ] Includes all 27 components + 6 blocks
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Dark mode toggle works
- [ ] Animations smooth on both platforms
- [ ] Forms show validation examples
- [ ] Safe area respected (iPhone notch)
- [ ] Android back button closes modals

### Monorepo
- [ ] Workspace protocol used for internal deps
- [ ] Each package declares all dependencies (no relying on hoisting)
- [ ] TypeScript project references configured
- [ ] Build order correct (core before registry)
- [ ] Test: npm pack each package and install in fresh project

### Documentation
- [ ] Supported Expo SDK versions documented
- [ ] React Native version compatibility documented
- [ ] Expo Go compatibility noted where relevant
- [ ] Migration guides exist for breaking changes
- [ ] Installation instructions tested in fresh project
- [ ] Common errors documented with solutions

### Platform Compatibility
- [ ] Expo SDK 52, 53, 54 tested
- [ ] React Native 0.76, 0.77, 0.81 tested
- [ ] New Architecture enabled and tested
- [ ] iOS 15+ tested
- [ ] Android 10+ (API 29) tested
- [ ] Check React Native Directory for library compatibility

### Performance
- [ ] Animations use useNativeDriver: true
- [ ] No dropped frames in Performance Monitor
- [ ] Bundle size reasonable (check bundlephobia)
- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] Gesture handlers responsive on Android

---

## Quick Detection Commands

```bash
# Check for TypeScript source exports (should be empty)
grep -r '"./src/' packages/*/package.json

# Check for missing peer dependencies
grep -r "from 'react-native-" packages/registry/ui/ | cut -d: -f2 | sort -u

# Check for hardcoded colors
grep -r "#[0-9A-Fa-f]\{6\}" packages/registry/ui/

# Check for any types
grep -r ": any" packages/registry/ui/

# Check exit codes work
mcellui invalid-command; echo "Exit code: $?"

# Test package outside monorepo
cd packages/core && npm pack && cd /tmp && npm install /path/to/core.tgz

# Check TypeScript strictness
grep "strict" packages/*/tsconfig.json
```

---

## Sources

**CLI Best Practices:**
- [Command Line Interface Guidelines](https://clig.dev/)
- [CLI Best Practices - HackMD](https://hackmd.io/@arturtamborski/cli-best-practices)
- [What's in a Good Error Message - Gunnar Morling](https://www.morling.dev/blog/whats-in-a-good-error-message/)
- [Error Message Guidelines - Nielsen Norman Group](https://www.nngroup.com/articles/error-message-guidelines/)

**NPM & Peer Dependencies:**
- [React Native Dependency Management - Microsoft](https://microsoft.github.io/rnx-kit/docs/architecture/dependency-management)
- [Resolving Peer Dependency Errors in React 2025](https://dev.to/aslanreza/resolving-peer-dependency-errors-in-react-a-comprehensive-guide-3all)
- [Advanced NPM: Working with Peer Dependencies](https://medium.com/@ruben.alapont/advanced-npm-working-with-peer-dependencies-b7c43aa852d8)

**TypeScript & Package Exports:**
- [TypeScript in 2025 with ESM and CJS npm publishing](https://lirantal.com/blog/typescript-in-2025-with-esm-and-cjs-npm-publishing)
- [TypeScript Documentation - Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [Managing TypeScript Packages in Monorepos - Nx](https://nx.dev/blog/managing-ts-packages-in-monorepos)

**Component Library Architecture:**
- [Why I Choose shadcn/ui Over Other UI Libraries in 2025](https://medium.com/@szainabshah806/why-i-choose-shadcn-ui-over-other-ui-libraries-in-2025-b64e3243d92c)
- [shadcn/ui Introduction](https://ui.shadcn.com/docs)
- [Component Library Ups and Downs](https://medium.com/@simon_p_kerr/component-library-ups-and-downs-e12fb5dd8d9b)

**Expo & React Native Compatibility:**
- [Expo for React Native in 2025: A Perspective](https://hashrocket.com/blog/posts/expo-for-react-native-in-2025-a-perspective)
- [React Native Version Mismatch - Expo Docs](https://docs.expo.dev/troubleshooting/react-native-version-mismatch/)
- [React Native 0.77 with Expo SDK 52 Changelog](https://expo.dev/changelog/2025-01-21-react-native-0.77)
- [Upgrading to Expo 54 and React Native 0.81](https://medium.com/@shanavascruise/upgrading-to-expo-54-and-react-native-0-81-a-developers-survival-story-2f58abf0e326)

**Developer Tooling:**
- [6 Things Developer Tools Must Have in 2026](https://evilmartians.com/chronicles/six-things-developer-tools-must-have-to-earn-trust-and-adoption)
- [8 Platform Engineering Anti-patterns - InfoWorld](https://www.infoworld.com/article/4064273/8-platform-engineering-anti-patterns.html)
