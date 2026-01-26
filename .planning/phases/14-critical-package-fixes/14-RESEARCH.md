# Phase 14: Critical Package Fixes - Research

**Researched:** 2026-01-26
**Domain:** npm package configuration, TypeScript compilation, peer dependency management
**Confidence:** HIGH

## Summary

Phase 14 addresses three critical package configuration issues that prevent proper npm distribution: core package exporting TypeScript source instead of compiled JavaScript, missing peer dependency declarations for animated components, and missing package.json exports for tooling compatibility.

The research confirms all three issues exist and are blocking proper package distribution. The core package currently exports raw `.ts` files which breaks in production and JavaScript-only projects. The registry package is missing peer dependencies for react-native-reanimated and react-native-gesture-handler, which are used by 49+ components. All packages are missing the `./package.json` export that tooling relies on.

**Primary recommendation:** Use tsup for core package compilation (ESM-only) with type declarations, add peerDependencies for animation libraries to registry package, and add `./package.json` exports to all published packages.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | ^8.0.0 | TypeScript bundler | Zero-config, esbuild-powered, generates .d.ts automatically, used by CLI already |
| TypeScript | ^5.4.0 | Type system | Already in use, industry standard for React Native libraries |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tsc | (built-in) | Type checking only | Use with --noEmit for validation, not compilation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tsup | tsc --emitDeclarationOnly | Slower, requires manual JS compilation, more configuration |
| tsup | rollup | More configuration needed, slower than esbuild-based tools |

**Installation:**
```bash
npm install -D tsup
# tsup already installed in CLI package, can be added to core
```

## Architecture Patterns

### Recommended Project Structure (Post-Fix)
```
packages/core/
├── src/              # TypeScript source (dev)
│   ├── index.ts
│   ├── theme/
│   ├── tokens/
│   └── utils/
├── dist/             # Compiled output (published)
│   ├── index.js      # ESM JavaScript
│   ├── index.d.ts    # Type declarations
│   ├── index.d.ts.map
│   └── ...
├── package.json      # Points to dist/
└── tsup.config.ts    # Build configuration
```

### Pattern 1: ESM-Only Build with Type Declarations
**What:** Compile TypeScript to ESM JavaScript with declaration files, no CommonJS needed for Expo/Metro ecosystem

**When to use:** React Native/Expo libraries where Metro is the bundler

**Example tsup.config.ts:**
```typescript
// Source: https://blog.logrocket.com/tsup/
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],        // ESM only (user decision)
  dts: true,              // Generate .d.ts files
  clean: true,            // Clean dist before build
  sourcemap: true,        // Source maps for debugging
  treeshake: true,        // Remove unused exports
  splitting: false,       // Single bundle for now
});
```

### Pattern 2: Conditional Exports with Types First
**What:** Use package.json exports field with types condition first for proper TypeScript resolution

**When to use:** All published packages

**Example package.json:**
```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "default": "./dist/tokens/index.js"
    },
    "./utils": {
      "types": "./dist/utils/index.d.ts",
      "default": "./dist/utils/index.js"
    },
    "./package.json": "./package.json"
  },
  "sideEffects": false
}
```

**Key points:**
- `types` condition MUST be first in exports
- `./package.json` export enables tooling access
- `sideEffects: false` enables tree-shaking

### Pattern 3: Peer Dependencies for Shared Libraries
**What:** Declare React Native animation libraries as peer dependencies, not direct dependencies

**When to use:** Component libraries that use reanimated or gesture-handler

**Example:**
```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-native-reanimated": ">=3.0.0",
    "react-native-gesture-handler": ">=2.0.0"
  },
  "peerDependenciesMeta": {
    "react-native-reanimated": {
      "optional": true
    },
    "react-native-gesture-handler": {
      "optional": true
    }
  }
}
```

**Rationale:**
- Components that don't use animations don't need these libraries
- Prevents duplicate library installations
- User controls which version to install
- Optional meta allows users to skip if not using animated components

### Pattern 4: Build Before Publish
**What:** Use prepublishOnly script to ensure package is built before publishing

**When to use:** All compiled packages

**Example:**
```json
{
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build",
    "type-check": "tsc --noEmit"
  }
}
```

### Anti-Patterns to Avoid
- **Exporting TypeScript source in production packages:** Breaks in JavaScript projects and requires consumers to configure TypeScript
- **React in dependencies instead of peerDependencies:** Creates duplicate React instances, breaking hooks
- **Missing ./package.json export:** Breaks tooling that needs to read package metadata
- **Missing sideEffects field:** Prevents effective tree-shaking in Metro bundler

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript compilation | Manual tsc + JS bundler | tsup | Handles .d.ts generation, esbuild-powered, zero-config, used by major libraries |
| Type declaration bundling | Complex rollup-plugin-dts config | tsup --dts flag | Automatic, maintains type accuracy, handles re-exports |
| ESM + CJS dual-build | Manual build scripts | tsup format: ['esm', 'cjs'] | Handles module format differences, source maps, proper extensions |
| Package validation | Manual testing | publint, @arethetypeswrong/cli | Catches exports misconfigurations, type resolution issues |

**Key insight:** TypeScript library compilation is deceptively complex with module formats, declaration files, source maps, and proper exports. Modern tools like tsup handle all edge cases that took years to discover.

## Common Pitfalls

### Pitfall 1: TypeScript Source Exports in Production
**What goes wrong:** Exporting raw .ts files instead of compiled .js breaks in production and non-TypeScript projects

**Why it happens:**
- Development convenience - monorepo works with source files
- Not understanding exports field implications
- Forgetting to build before publishing
- Assuming all consumers use TypeScript

**How to avoid:**
- Use tsup or tsc to compile to dist/
- Export compiled .js and .d.ts files
- Add prepublishOnly script
- Test with `npm pack` in fresh project

**Warning signs:**
- package.json exports point to ./src/ paths
- No dist/ directory
- No build script in package.json
- Users report "Cannot find module" in production

**Current status:** mcellui-core package has this issue (PKG-01)

### Pitfall 2: Missing Peer Dependencies for Animation Libraries
**What goes wrong:** Components use reanimated/gesture-handler but don't declare them as peer dependencies, causing runtime errors

**Why it happens:**
- Library works in monorepo due to hoisting
- Easy to forget which components use which libraries
- Not testing outside monorepo
- React Native ecosystem has many optional dependencies

**How to avoid:**
- Audit all imports: `grep -r "react-native-reanimated" packages/registry/`
- Declare all third-party imports as peerDependencies
- Use peerDependenciesMeta for optional features
- Test fresh install outside monorepo

**Warning signs:**
- "Cannot find module 'react-native-reanimated'" at runtime
- Components work in demo but not in user projects
- npm install succeeds but app crashes on component use

**Current status:** mcellui-registry missing reanimated and gesture-handler (PKG-02)

**Affected components (49 use reanimated):**
- Sheet, Dialog, Alert Dialog, Toast (modals/overlays)
- Swipeable Row, Pull to Refresh (gestures with reanimated)
- All input components (focus animations)
- Slider, Stepper, Progress (animated values)
- Accordion, Collapsible, Tabs (expand/collapse)
- Plus 30+ more components

**Affected components (8 use gesture-handler):**
- Swipeable Row (PanGestureHandler)
- Sheet, Action Sheet (gestures)
- Slider (TapGestureHandler)
- Image Gallery (pinch/pan gestures)
- DateTime Picker (scroll gestures)

### Pitfall 3: Missing ./package.json Export
**What goes wrong:** Tools can't read package metadata, breaking version detection, auto-imports, and CLI features

**Why it happens:**
- Not understanding exports field encapsulation
- Following old examples without ./package.json
- Not testing with tools that need metadata

**How to avoid:**
- Always add `"./package.json": "./package.json"` to exports
- Test with tools: npm ls, IDE auto-imports
- Verify mcellui diff can read registry version

**Warning signs:**
- IDEs can't auto-import from package
- Version detection fails
- CLI can't compare installed vs registry versions

**Current status:** All mcellui packages missing this (PKG-03)

### Pitfall 4: Expo SDK Version Compatibility
**What goes wrong:** Peer dependency ranges don't match actual Expo SDK compatibility, causing upgrade issues

**Why it happens:**
- Expo SDK updates 3x per year with breaking changes
- Each SDK targets one React Native version
- Range >=0.73.0 includes incompatible future versions

**How to avoid:**
- Test against multiple Expo SDK versions (52, 53, 54)
- Document supported versions in README
- Consider narrower range if breaking changes expected
- Monitor React Native Directory for compatibility

**Warning signs:**
- Works on SDK 54 but breaks on SDK 52
- Peer dependency warnings after Expo upgrade
- Methods unavailable after React Native update

**Current status:** Need to verify compatibility (current: SDK 54, RN 0.81.5)

### Pitfall 5: Metro Bundler Tree-Shaking Limitations
**What goes wrong:** Metro doesn't tree-shake as effectively as webpack/vite, leading to larger bundles

**Why it happens:**
- Metro uses different algorithm than webpack
- Barrel exports defeat Metro's tree-shaking
- sideEffects field helps but isn't a silver bullet

**How to avoid:**
- Mark sideEffects: false in package.json
- Consider granular exports for large token files
- Test actual bundle size in consuming app
- Avoid re-exporting everything through single barrel

**Warning signs:**
- Bundle includes unused theme presets
- Importing one token brings in all tokens
- Production bundle much larger than expected

**Current status:** Core package has no sideEffects field

## Code Examples

Verified patterns from official sources:

### Core Package Build Configuration
```typescript
// tsup.config.ts
// Source: https://tsup.egoist.dev/
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    // Add subpath entries if needed
    'src/tokens/index.ts',
    'src/utils/index.ts',
  ],
  format: ['esm'],
  dts: true,              // Generate .d.ts
  sourcemap: true,        // Source maps for debugging
  clean: true,            // Clean dist/ before build
  treeshake: true,        // Remove unused code
  splitting: false,       // Single bundle per entry
  target: 'es2020',       // React Native supports ES2020+
  esbuildOptions(options) {
    options.platform = 'neutral'; // Works in both node and RN
  },
});
```

### Core Package package.json (Fixed)
```json
{
  "name": "@metacells/mcellui-core",
  "version": "0.1.2",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "default": "./dist/tokens/index.js"
    },
    "./utils": {
      "types": "./dist/utils/index.d.ts",
      "default": "./dist/utils/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "npm run build",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0"
  },
  "devDependencies": {
    "@types/react": "~19.1.10",
    "tsup": "^8.0.0",
    "typescript": "^5.4.0"
  }
}
```

### Registry Package Peer Dependencies (Fixed)
```json
{
  "name": "@metacells/mcellui-registry",
  "version": "0.0.2",
  "private": true,
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-hook-form": ">=7.50.0",
    "@hookform/resolvers": ">=3.3.0",
    "zod": ">=3.22.0",
    "react-native-reanimated": ">=3.0.0",
    "react-native-gesture-handler": ">=2.0.0"
  },
  "peerDependenciesMeta": {
    "react-hook-form": {
      "optional": true
    },
    "@hookform/resolvers": {
      "optional": true
    },
    "zod": {
      "optional": true
    },
    "react-native-reanimated": {
      "optional": true
    },
    "react-native-gesture-handler": {
      "optional": true
    }
  }
}
```

**Rationale for optional:**
- Users who only add Button don't need form libraries
- Users who only add static components don't need animation libraries
- CLI can detect which dependencies are needed per component
- Better user experience - install only what you use

### CLI Package Exports (Fixed)
```json
{
  "name": "@metacells/mcellui-cli",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"]
}
```

### MCP Server Package Exports (Fixed)
```json
{
  "name": "@metacells/mcellui-mcp-server",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist", "registry"]
}
```

### Testing Package Configuration
```bash
# Source: https://www.npmjs.com/package/publint
# Validate package.json exports
npx publint

# Check TypeScript type resolution
npx @arethetypeswrong/cli --pack .

# Preview what will be published
npm pack --dry-run

# Test in fresh project
cd /tmp
npm pack /path/to/package
npm install ./package.tgz
node -e "import('@metacells/mcellui-core').then(console.log)"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Source distribution (.ts files) | Compiled distribution (.js + .d.ts) | Now (this phase) | Fixes production, enables JavaScript users |
| main/module/types fields only | exports field with conditions | Node 12.7+ (2019), Metro 0.82+ (2024) | Better tree-shaking, explicit encapsulation |
| dependencies for React | peerDependencies | Library best practice (2015+) | Prevents duplicate React, smaller installs |
| Implicit peer deps | Explicit peer deps with optional meta | npm 7+ (2021) | Better DX, clear requirements |

**Deprecated/outdated:**
- Relying on main/module without exports - Still works but exports takes precedence
- Publishing TypeScript source for production packages - Never was standard, breaks non-TS users
- Forgetting ./package.json export - Breaks modern tooling (2023+)

## Open Questions

Things that couldn't be fully resolved:

1. **Should core package include granular token exports?**
   - What we know: Current exports are root, /tokens, /utils
   - What's unclear: Does importing one theme preset pull in all 8 presets?
   - Recommendation: Test bundle size, add granular exports if needed (/tokens/colors, /tokens/spacing)

2. **Should CLI auto-detect and install missing peer dependencies?**
   - What we know: CLI already has prompts and package manager integration
   - What's unclear: User preference - auto-install vs warn-only
   - Recommendation: Warn with install command, don't auto-install (user control)

3. **Exact version compatibility for Expo SDK 52/53/54**
   - What we know: Demo uses SDK 54 (RN 0.81), reanimated ~4.1.1, gesture-handler ~2.28.0
   - What's unclear: Do components work on SDK 52 (RN 0.77)?
   - Recommendation: Test on SDK 52 and 53, document supported range

4. **Source inclusion for debugging**
   - What we know: Compiled dist only, or include src for debugging?
   - What's unclear: Trade-off between package size and debugging utility
   - Recommendation: Compiled only with source maps (sourcemap: true in tsup)

## Sources

### Primary (HIGH confidence)
- [Node.js Packages Documentation](https://nodejs.org/api/packages.html) - Official exports field specification
- [TypeScript Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html) - Type declarations and exports
- [Metro Package Exports](https://metrobundler.dev/docs/package-exports/) - React Native bundler support
- [Package Exports Support in React Native](https://reactnavigation.dev/blog/2023/06/21/package-exports-support) - RN ecosystem adoption

### Secondary (MEDIUM confidence)
- [Using tsup to bundle your TypeScript package - LogRocket](https://blog.logrocket.com/tsup/) - tsup configuration patterns
- [Guide to package.json exports field - Hiroki Osame](https://hirok.io/posts/package-json-exports) - Comprehensive export patterns
- [TypeScript and NPM package.json exports the 2024 way - Velopen](https://www.velopen.com/blog/typescript-npm-package-json-exports/) - Modern TypeScript + exports
- [React Native Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/) - Peer dependency requirements
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/) - Integration with gesture-handler

### Tertiary (LOW confidence)
- [How to Use create-react-native-library Like a Pro in 2026](https://javascript.plainenglish.io/how-to-use-create-react-native-library-like-a-pro-in-2026-3c7083b67b4b) - RN library build tools (WebSearch)
- WebSearch results on peer dependency compatibility (unverified version ranges)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - tsup is proven, used by CLI already, official docs verified
- Architecture: HIGH - Official Node.js, TypeScript, Metro documentation
- Pitfalls: HIGH - Verified with existing codebase issues and prior research (PITFALLS.md)

**Research date:** 2026-01-26
**Valid until:** 30 days (stable ecosystem practices, but verify Expo SDK compatibility quarterly)

**Verification performed:**
- Checked current package.json configurations (all 4 packages)
- Confirmed TypeScript source exports in core package (PKG-01)
- Grepped for reanimated/gesture-handler usage (49 and 8 files respectively, PKG-02)
- Verified missing ./package.json exports (PKG-03)
- Cross-referenced with prior research (STRUCTURE.md, PITFALLS.md)
- Verified current versions: Expo SDK 54, RN 0.81.5, reanimated ~4.1.1, gesture-handler ~2.28.0
