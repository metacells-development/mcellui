---
phase: 14-critical-package-fixes
plan: 02
subsystem: tooling
tags: [package.json, exports, peer-dependencies, npm, reanimated, gesture-handler]

# Dependency graph
requires:
  - phase: 14-01
    provides: Core package metadata exports
provides:
  - ./package.json exports in CLI and MCP server for tooling compatibility
  - Animation library peer dependencies in registry
  - Optional peer dependency metadata for tree-shakeable installation
  - sideEffects: false in all packages for bundler optimization
affects: [15-publishing, registry-consumers, cli-users]

# Tech tracking
tech-stack:
  added: []
  patterns: [package.json exports, optional peer dependencies, sideEffects metadata]

key-files:
  created: []
  modified:
    - packages/cli/package.json
    - packages/mcp-server/package.json
    - packages/registry/package.json

key-decisions:
  - "Marked animation and form libraries as optional peer dependencies - users install only what they need"
  - "Added sideEffects: false to all packages for better tree-shaking"
  - "Used >=3.0.0 for reanimated and >=2.0.0 for gesture-handler peer deps"

patterns-established:
  - "Pattern 1: All packages export ./package.json for tooling metadata access"
  - "Pattern 2: Registry uses peerDependenciesMeta for optional animation/form libraries"

# Metrics
duration: 1min 19sec
completed: 2026-01-26
---

# Phase 14 Plan 02: Package Exports and Peer Dependencies Summary

**Added ./package.json exports to CLI/MCP packages and declared animation peer dependencies in registry with optional metadata for tree-shakeable installs**

## Performance

- **Duration:** 1 min 19 sec
- **Started:** 2026-01-26T21:32:53Z
- **Completed:** 2026-01-26T21:34:12Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- CLI and MCP server now export ./package.json for tooling metadata access
- Registry declares react-native-reanimated and react-native-gesture-handler as peer dependencies
- Animation and form libraries marked as optional - users install only what they need
- All packages have sideEffects: false for better bundler tree-shaking

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ./package.json exports to CLI and MCP server** - `44fccad` (feat)
2. **Task 2: Add peer dependencies and ./package.json to registry** - `47709c4` (feat)

## Files Created/Modified
- `packages/cli/package.json` - Added exports field with ./package.json export and sideEffects: false
- `packages/mcp-server/package.json` - Added exports field with ./package.json export and sideEffects: false
- `packages/registry/package.json` - Added animation peer deps, peerDependenciesMeta for optional libraries, ./package.json export, and sideEffects: false

## Decisions Made

1. **Marked animation and form libraries as optional peer dependencies**
   - Rationale: Users who only install static components (Badge, Label, Separator) don't need reanimated/gesture-handler. Users who only install non-form components don't need react-hook-form/zod.
   - Better UX: Install only what you use
   - CLI can detect which dependencies are needed per component

2. **Used >=3.0.0 for reanimated and >=2.0.0 for gesture-handler**
   - Rationale: These are the stable versions compatible with React Native 0.73+
   - Allows users to stay current with patch releases

3. **Added sideEffects: false to all packages**
   - Rationale: Enables better tree-shaking in bundlers
   - None of these packages have side effects at import time

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all changes were straightforward package.json additions.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Package exports properly configured for npm publishing
- Peer dependencies correctly declared for user installations
- Ready for Phase 15: Publishing preparation

**No blockers or concerns.**

---
*Phase: 14-critical-package-fixes*
*Completed: 2026-01-26*
