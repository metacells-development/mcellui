# Package Structure Best Practices

**Research Date:** 2026-01-26
**Context:** mcellui monorepo with Turborepo - Component library for React Native/Expo
**Confidence:** HIGH (based on official Node.js, Metro, Turborepo, and TypeScript documentation)

## Executive Summary

Modern npm packages should use the `exports` field in package.json for precise control over entry points, tree-shaking, and platform-specific resolution. For React Native component libraries, special attention must be paid to Metro bundler compatibility, peer dependency management, and the unique constraints of the React Native ecosystem.

**Key Findings:**
- The `exports` field is now the standard (Node 12.7+, Metro 0.82+, TypeScript 4.7+)
- React Native requires special condition names: `"react-native"` should precede `"import"`/`"require"`
- Component libraries MUST use peerDependencies for React/React Native to avoid version conflicts
- Barrel exports harm tree-shaking and should be avoided in published packages
- Source-based distribution (publishing TypeScript source) is viable for copy-paste libraries

---

## 1. Exports Configuration

### 1.1 Modern Exports Field

The `exports` field takes **precedence over** `main`, `browser`, and `module` fields when present.

**Official Node.js Pattern:**
```json
{
  "name": "@org/package",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    },
    "./package.json": "./package.json"
  }
}
```

**Condition Name Priority (official order):**
1. `"types"` — TypeScript declarations (MUST be first)
2. `"react-native"` — React Native (before import/require)
3. `"browser"` — Web environments
4. `"import"` — ES modules (import statement)
5. `"require"` — CommonJS (require() call)
6. `"default"` — Fallback (MUST be last)

### 1.2 React Native Specific Configuration

Metro bundler defaults to `['require', 'react-native']` condition names.

**React Native Pattern:**
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "react-native": "./src/index.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    }
  }
}
```

**Critical:** `"react-native"` condition must appear **above** `"import"`/`"require"` to ensure Metro resolves correctly.

### 1.3 Source Distribution Pattern (mcellui use case)

For copy-paste component libraries where users consume source code directly:

```json
{
  "name": "@metacells/mcellui-core",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./tokens": {
      "types": "./src/tokens/index.ts",
      "default": "./src/tokens/index.ts"
    },
    "./utils": {
      "types": "./src/utils/index.ts",
      "default": "./src/utils/index.ts"
    }
  },
  "files": ["src"],
  "sideEffects": false
}
```

**Rationale:**
- Users compile source with their own TypeScript/Metro setup
- No build step needed in the package
- Direct TypeScript imports work seamlessly
- `"sideEffects": false` enables aggressive tree-shaking

### 1.4 Subpath Patterns

For packages with many exports (100+ components):

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./components/*": "./dist/components/*.js",
    "./utils/*": "./dist/utils/*.js",
    "./package.json": "./package.json"
  }
}
```

**Warning:** Subpath patterns use simple string replacement, not glob expansion. `./components/*.js` matches `./components/Button.js` but not `./components/forms/Input.js`.

### 1.5 Encapsulation

The `exports` field **blocks** deep imports to paths not explicitly listed:

```javascript
// ✅ Allowed (exported)
import { Button } from '@org/ui';

// ❌ Blocked (not exported)
import { Button } from '@org/ui/dist/components/Button';
```

**Always export** `./package.json` to allow tooling access:

```json
{
  "exports": {
    "./package.json": "./package.json"
  }
}
```

---

## 2. TypeScript Configuration

### 2.1 Declaration Files

**Essential tsconfig.json settings:**

```json
{
  "compilerOptions": {
    "declaration": true,           // Generate .d.ts files
    "declarationMap": true,        // Generate .d.ts.map for debugging
    "emitDeclarationOnly": false,  // Emit both JS and .d.ts
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "moduleResolution": "Bundler",  // Modern resolution (TS 5.0+)
    "target": "ES2020",
    "jsx": "react-native",          // For React Native
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 2.2 Export Organization

**❌ BAD: Barrel exports harm tree-shaking**

```typescript
// src/index.ts (barrel file)
export * from './Button';
export * from './Card';
export * from './Input';
// ... 50 more exports
```

**Problem:** Importing one component loads the entire module graph. In one case study, barrel files increased bundle size from 1MB to 12MB.

**✅ GOOD: Granular exports**

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./Button": "./dist/Button.js",
    "./Card": "./dist/Card.js",
    "./Input": "./dist/Input.js"
  }
}
```

```typescript
// Consumer picks exactly what they need
import { Button } from '@org/ui/Button';
```

**Exception:** Barrel exports are acceptable for **internal** packages in a monorepo where tree-shaking happens at the app level.

### 2.3 Type-Only Exports

For type-only packages or type utilities:

```typescript
// types.ts
export type ButtonProps = {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
};

export type { ButtonProps } from './types';  // Type-only export
```

```json
{
  "exports": {
    "./types": {
      "types": "./dist/types.d.ts",
      "default": "./dist/types.js"
    }
  }
}
```

---

## 3. Dependency Management

### 3.1 dependencies vs peerDependencies vs devDependencies

| Field | When to Use | Example |
|-------|-------------|---------|
| **dependencies** | Required at runtime, bundled with package | `commander`, `chalk`, `fs-extra` |
| **peerDependencies** | Required but provided by consumer | `react`, `react-native`, `typescript` |
| **devDependencies** | Build tools, testing, type definitions | `@types/react`, `tsup`, `vitest` |
| **optionalDependencies** | Nice-to-have features | Performance optimizations |

### 3.2 Component Library Pattern (CRITICAL)

**❌ WRONG: React in dependencies**

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.73.0"
  }
}
```

**Problem:** Creates duplicate React instances, breaking hooks and context.

**✅ CORRECT: React in peerDependencies**

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0"
  },
  "devDependencies": {
    "@types/react": "~19.1.10",
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

**Rationale:**
- Consumer's app must provide React (only one React instance)
- `devDependencies` provides types and testing capability
- Version range allows flexibility (`>=18.0.0`)

### 3.3 Optional vs Required Peer Dependencies

**Strict requirement:**
```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

**Optional feature:**
```json
{
  "peerDependencies": {
    "react-native-reanimated": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "react-native-reanimated": {
      "optional": true
    }
  }
}
```

### 3.4 Form Library Pattern (mcellui case)

Some components require additional dependencies only if used:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-hook-form": ">=7.50.0",
    "@hookform/resolvers": ">=3.3.0",
    "zod": ">=3.22.0"
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
    }
  }
}
```

**User experience:**
- Users who add `Form` component get warning to install form dependencies
- Users who only add `Button` don't need form dependencies
- CLI can auto-detect and install required peers

---

## 4. Monorepo Patterns (Turborepo)

### 4.1 Internal Package Structure

**Recommended directory layout:**

```
monorepo/
├── apps/
│   ├── demo/               # Expo demo app
│   └── docs/               # Documentation site
├── packages/
│   ├── core/               # @org/core - Theme system
│   ├── cli/                # @org/cli - CLI tool
│   ├── registry/           # @org/registry (private) - Component source
│   └── mcp-server/         # @org/mcp-server - AI integration
└── turbo.json
```

**Rationale:** Apps vs packages separation keeps application code distinct from reusable libraries.

### 4.2 Workspace Protocol

**Use workspace references for internal dependencies:**

**npm/yarn:**
```json
{
  "name": "@org/demo",
  "dependencies": {
    "@org/core": "*"
  }
}
```

**pnpm:**
```json
{
  "name": "@org/demo",
  "dependencies": {
    "@org/core": "workspace:*"
  }
}
```

**Turborepo automatically detects these relationships** and builds packages in dependency order.

### 4.3 Package Naming

**Use scoped namespaces:**

```json
{
  "name": "@metacells/mcellui-core",
  "name": "@metacells/mcellui-cli",
  "name": "@metacells/mcellui-registry"
}
```

**Benefits:**
- Avoids npm registry conflicts
- Clear ownership/organization
- Consistent naming across packages

### 4.4 Private Packages

For packages not published to npm:

```json
{
  "name": "@org/registry",
  "version": "0.0.1",
  "private": true
}
```

**mcellui registry pattern:** Component source code lives in a private package. CLI reads from `registry.json` and copies files. Users never install `@metacells/mcellui-registry`.

### 4.5 Turbo Configuration

**turbo.json for optimal caching:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Key patterns:**
- `^build` means "build dependencies first"
- `outputs` defines what to cache
- `cache: false` for watch/dev tasks
- `persistent: true` for long-running processes

---

## 5. Tree-Shaking and Side Effects

### 5.1 sideEffects Field

**Enable aggressive tree-shaking:**

```json
{
  "sideEffects": false
}
```

**Tells bundlers:** "This package has no side effects. Unused exports can be safely removed."

**With exceptions:**

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```

### 5.2 Barrel Export Problem

**Case study from GitHub issues:**

> "Using a barrel file results in bundles reaching 12MB whereas without them bundles are less than 1MB."

**Why barrel exports break tree-shaking:**

```typescript
// src/index.ts (barrel)
export * from './Button';
export * from './Card';
export * from './Input';
```

```typescript
// Consumer code
import { Button } from '@org/ui';  // Wanted only Button
```

**What actually happens:**
1. Bundler loads `@org/ui/index.js`
2. `export * from './Button'` loads Button module
3. `export * from './Card'` loads Card module (even though unused!)
4. All transitive dependencies of Card are loaded
5. Tree-shaking fails because bundler can't statically determine which exports are used

**Solution 1: Granular exports**
```json
{
  "exports": {
    "./Button": "./dist/Button.js",
    "./Card": "./dist/Card.js"
  }
}
```

**Solution 2: Dual exports (backwards compatible)**
```json
{
  "exports": {
    ".": "./dist/index.js",          // Barrel for convenience
    "./Button": "./dist/Button.js",  // Direct import for size
    "./Card": "./dist/Card.js"
  }
}
```

### 5.3 React Native Considerations

React Native Metro bundler has **different tree-shaking behavior** than webpack/vite:

- Metro doesn't remove unused exports from modules
- `sideEffects: false` helps but isn't a silver bullet
- Granular exports are MORE important in React Native

---

## 6. Build Output Patterns

### 6.1 Compiled Distribution

**Standard pattern for published libraries:**

```
dist/
├── index.js          # CommonJS entry
├── index.mjs         # ES module entry
├── index.d.ts        # Type declarations
├── index.d.ts.map    # Source map for types
├── components/
│   ├── Button.js
│   ├── Button.d.ts
│   └── ...
└── utils/
    ├── ...
```

### 6.2 Source Distribution

**mcellui pattern (users compile source):**

```
src/
├── index.ts
├── components/
│   ├── Button.tsx
│   └── ...
└── utils/
    └── ...
```

```json
{
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": ["src"]
}
```

**Trade-offs:**

| Aspect | Compiled | Source |
|--------|----------|--------|
| Install size | Larger (JS + .d.ts) | Smaller (TS only) |
| Install speed | Slower | Faster |
| Compile time | Consumer fast | Consumer slower |
| Debugging | Needs sourcemaps | Native TS debugging |
| Version conflicts | Rare | Possible (TS version) |
| Use case | npm install | Copy-paste |

### 6.3 Dual Module Pattern

**Publish both CommonJS and ESM:**

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

**Tools:** `tsup`, `rollup`, `esbuild` handle dual-output builds automatically.

---

## 7. Files to Publish

### 7.1 files Field

**Explicitly list what to publish:**

```json
{
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ]
}
```

**npm automatically includes:**
- `package.json`
- `README` (any case)
- `LICENSE` / `LICENCE` (any case)

**npm automatically excludes:**
- `.git`
- `node_modules`
- `.env` files

### 7.2 .npmignore

**Use `.npmignore` for fine-grained control:**

```
# Development files
src/
tsconfig.json
.eslintrc
.prettierrc

# Test files
**/*.test.ts
**/*.spec.ts
__tests__/
coverage/

# Build artifacts
*.tsbuildinfo
```

**Or** use `files` allowlist (recommended - more explicit).

---

## 8. Entry Points Best Practices

### 8.1 Multiple Entry Points

**Organized by feature:**

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./theme": "./dist/theme/index.js",
    "./components": "./dist/components/index.js",
    "./utils": "./dist/utils/index.js"
  }
}
```

**Import examples:**
```typescript
import { createTheme } from '@org/ui/theme';
import { Button } from '@org/ui/components';
import { cn } from '@org/ui/utils';
```

### 8.2 Avoid Deep Imports

**❌ Discouraged:**
```typescript
import { Button } from '@org/ui/dist/components/Button/Button';
```

**✅ Preferred:**
```typescript
import { Button } from '@org/ui/components';
// or
import { Button } from '@org/ui';
```

**How:** Use `exports` field to control what's importable.

---

## 9. Checklist for Package Audit

### 9.1 Core Package Structure

- [ ] **package.json has `exports` field** (not just `main`)
- [ ] **`exports` includes `./package.json`** for tooling access
- [ ] **`types` condition is first** in conditional exports
- [ ] **`default` condition is last** as fallback
- [ ] **`sideEffects` field is present** (`false` or array)
- [ ] **`files` field explicitly lists published files**
- [ ] **`engines` specifies minimum Node version**

### 9.2 TypeScript Configuration

- [ ] **`declaration: true`** in tsconfig.json
- [ ] **`declarationMap: true`** for debugging support
- [ ] **Type definitions match JavaScript exports**
- [ ] **No `any` types in public API**
- [ ] **Exported types have JSDoc comments**

### 9.3 React Native Specifics

- [ ] **`"react-native"` condition before `"import"`/`"require"`**
- [ ] **Metro bundler compatibility tested**
- [ ] **Platform-specific code uses `Platform.select()`** (not file extensions)
- [ ] **No Node.js-only APIs** (fs, path, etc.) in runtime code
- [ ] **Assets referenced correctly** for Metro resolution

### 9.4 Dependency Management

- [ ] **React/React Native in `peerDependencies`** (not `dependencies`)
- [ ] **Runtime libraries in `dependencies`**
- [ ] **Build tools in `devDependencies`**
- [ ] **Optional features use `peerDependenciesMeta`**
- [ ] **Peer dependency versions use ranges** (`>=18.0.0`)

### 9.5 Monorepo (Turborepo)

- [ ] **Package names use scoped namespace** (`@org/package`)
- [ ] **Internal dependencies use workspace protocol**
- [ ] **Private packages marked with `"private": true`**
- [ ] **`turbo.json` includes build outputs** in task configuration
- [ ] **Build order dependencies specified** with `^build`

### 9.6 Tree-Shaking Optimization

- [ ] **`sideEffects: false`** if no global side effects
- [ ] **Granular exports** instead of single barrel export
- [ ] **Conditional exports properly ordered** (types first, default last)
- [ ] **No unnecessary re-exports** (`export *` used sparingly)
- [ ] **Test actual bundle size** with consumer app

### 9.7 Distribution Strategy

For **compiled distribution:**
- [ ] Build outputs in `dist/`
- [ ] Both CJS and ESM formats
- [ ] TypeScript declarations generated
- [ ] Source maps included

For **source distribution** (mcellui):
- [ ] TypeScript source in `src/`
- [ ] `main` and `types` point to `.ts` files
- [ ] Consumer tsconfig compatible
- [ ] No build step required

### 9.8 Documentation and Metadata

- [ ] **`description` field** is clear and concise
- [ ] **`keywords` array** for npm search
- [ ] **`repository` field** links to source
- [ ] **`license` field** specified
- [ ] **`homepage` field** for documentation
- [ ] **README.md** exists and explains usage
- [ ] **CHANGELOG.md** documents version changes

---

## 10. Common Anti-Patterns

### 10.1 ❌ Mixing CommonJS and ESM Without Exports Field

```json
{
  "main": "./index.js",
  "module": "./index.mjs"
}
```

**Problem:** Only bundlers respect `module`. Node.js ignores it.

**Fix:** Use `exports` with conditions.

### 10.2 ❌ Missing Type Definitions in Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

**Problem:** TypeScript can't find types.

**Fix:** Add `"types"` condition first.

### 10.3 ❌ React in dependencies Instead of peerDependencies

```json
{
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

**Problem:** Duplicate React instances break hooks.

**Fix:** Move to `peerDependencies`.

### 10.4 ❌ Platform Extensions in Exports

```json
{
  "exports": {
    "./Button": "./dist/Button.ios.js"  // ❌ Don't do this
  }
}
```

**Problem:** Metro won't resolve `.android.js` fallback.

**Fix:** Use single entry, handle platform internally with `Platform.select()`.

### 10.5 ❌ Barrel Exports for Large Libraries

```typescript
// index.ts
export * from './Component1';
export * from './Component2';
// ... 100 more
```

**Problem:** Breaks tree-shaking, massive bundles.

**Fix:** Granular exports in package.json.

### 10.6 ❌ Publishing Test Files

```json
{
  "files": ["dist"]  // Good
}
```

vs

```json
{
  "files": ["dist", "**/*.test.ts"]  // Bad - test files leak
}
```

### 10.7 ❌ Hardcoded Paths

```typescript
import config from '../../../config.json';  // ❌ Brittle
```

**Fix:** Use package imports or proper exports.

---

## 11. mcellui Specific Recommendations

### 11.1 Core Package (@metacells/mcellui-core)

**Current structure is good, with minor improvements:**

```json
{
  "name": "@metacells/mcellui-core",
  "version": "0.1.2",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./tokens": {
      "types": "./src/tokens/index.ts",
      "default": "./src/tokens/index.ts"
    },
    "./utils": {
      "types": "./src/utils/index.ts",
      "default": "./src/utils/index.ts"
    },
    "./package.json": "./package.json"  // ADD THIS
  },
  "files": ["src"],
  "sideEffects": false,  // ADD THIS
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0"
  },
  "devDependencies": {
    "@types/react": "~19.1.10",
    "typescript": "^5.4.0"
  }
}
```

**Improvements:**
1. Add `"./package.json"` export for tooling
2. Add `"sideEffects": false` for tree-shaking
3. Current source distribution approach is correct for copy-paste philosophy

### 11.2 Registry Package (@metacells/mcellui-registry)

**Current private package is correct:**

```json
{
  "name": "@metacells/mcellui-registry",
  "version": "0.0.2",
  "private": true,  // ✅ Good - never published
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.73.0",
    "react-hook-form": ">=7.50.0",
    "@hookform/resolvers": ">=3.3.0",
    "zod": ">=3.22.0"
  }
}
```

**Recommendation:** Add `peerDependenciesMeta` for optional form dependencies:

```json
{
  "peerDependenciesMeta": {
    "react-hook-form": { "optional": true },
    "@hookform/resolvers": { "optional": true },
    "zod": { "optional": true }
  }
}
```

**CLI should:**
- Detect which component is being added
- Check if it requires form dependencies (Form, FormField, etc.)
- Auto-install required peers if missing

### 11.3 CLI Package (@metacells/mcellui-cli)

**Current structure is excellent:**

```json
{
  "name": "@metacells/mcellui-cli",
  "type": "module",  // ✅ ESM
  "bin": {
    "mcellui": "./dist/index.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Minor improvements:**

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "sideEffects": false
}
```

### 11.4 Monorepo Root

**Current turbo.json is good. Consider adding:**

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "cache": true  // Explicitly enable
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []  // No outputs, just validation
    }
  }
}
```

---

## 12. Version Compatibility Matrix

| Tool | Version | Exports Support | Notes |
|------|---------|-----------------|-------|
| Node.js | 12.7+ | ✅ Full | `exports` field supported |
| Node.js | 20+ | ✅ Recommended | Better ESM support |
| TypeScript | 4.7+ | ✅ Full | `exports` resolution |
| Metro | 0.82+ | ✅ Full | Default in RN 0.79+ |
| Expo | SDK 53+ | ✅ Full | RN 0.79 included |
| Webpack | 5+ | ✅ Full | — |
| Vite | 2+ | ✅ Full | — |
| pnpm | 7+ | ✅ Full | `workspace:*` protocol |
| npm | 7+ | ✅ Full | Workspace support |
| yarn | 3+ | ✅ Full | Berry rewrite |

---

## 13. Testing Your Package Structure

### 13.1 Validation Commands

```bash
# Check exports resolution
npx @arethetypeswrong/cli --pack .

# Test tree-shaking
npx bundle-size-inspector ./dist

# Validate package.json
npx publint

# Preview published files
npm pack --dry-run
```

### 13.2 Consumer Testing

**Create a test app:**

```bash
npx create-expo-app test-app
cd test-app
npm install file:../path/to/your/package
```

**Test scenarios:**
- Import from main entry: `import { X } from '@org/pkg'`
- Import from subpath: `import { Y } from '@org/pkg/utils'`
- Check bundle size with `npx react-native-bundle-visualizer`
- Verify TypeScript types work
- Test on both iOS and Android

### 13.3 Bundle Size Analysis

```bash
# In consumer app
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/index.ios.bundle

ls -lh /tmp/index.ios.bundle
```

---

## Sources

### Official Documentation (HIGH confidence)
- [Node.js Packages Documentation](https://nodejs.org/api/packages.html) - Exports field specification
- [Metro Package Exports Support](https://metrobundler.dev/docs/package-exports/) - React Native bundler
- [TypeScript Library Structures](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html) - Type declarations
- [Turborepo Creating Internal Packages](https://turborepo.dev/docs/crafting-your-repository/creating-an-internal-package) - Monorepo patterns

### Technical Articles (MEDIUM confidence)
- [Guide to package.json exports field by Hiroki Osame](https://hirok.io/posts/package-json-exports) - Comprehensive export patterns
- [TypeScript and NPM package.json exports the 2024 way - Velopen](https://www.velopen.com/blog/typescript-npm-package-json-exports/) - TypeScript integration
- [A practical guide against barrel files - DEV Community](https://dev.to/thepassle/a-practical-guide-against-barrel-files-for-library-authors-118c) - Tree-shaking issues

### Community Resources (MEDIUM confidence)
- [Peer Dependencies in depth - DEV Community](https://dev.to/icy0307/peer-dependencies-in-depth-1o3b) - Dependency management
- [Turborepo Structure Guide](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository) - Repository organization
- [Package Exports Support in React Native Blog Post](https://reactnative.dev/blog/2023/06/21/package-exports-support) - Metro compatibility

### Issue Discussions (LOW-MEDIUM confidence)
- [Tree shaking doesn't work with TypeScript barrel files - Next.js #12557](https://github.com/vercel/next.js/issues/12557) - Barrel export problems
- [Burn the Barrel! by Brett Uglow](https://uglow.medium.com/burn-the-barrel-c282578f21b6) - Performance case study

---

## Revision History

- **2026-01-26**: Initial research for mcellui audit milestone
- Verified with official Node.js, Metro, Turborepo, and TypeScript documentation
- Cross-referenced with 2025-2026 community best practices
