---
phase: 15-cli-audit
plan: "01"
subsystem: cli
status: complete
requires:
  - 14-02
provides:
  - centralized-error-handling
  - stderr-stdout-separation
  - consistent-error-formatting
affects:
  - 15-03
tags:
  - cli
  - error-handling
  - output-utilities
  - stderr
tech-stack:
  added: []
  patterns:
    - centralized-error-handling
    - error-factory-pattern
    - stderr-stdout-separation
key-files:
  created:
    - packages/cli/src/utils/errors.ts
    - packages/cli/src/utils/output.ts
  modified:
    - packages/cli/src/utils/index.ts
decisions:
  - id: stderr-for-all-errors
    title: All errors must use stderr, not stdout
    rationale: CLI best practice for proper error handling and shell scripting
  - id: actionable-hints
    title: Every error must include actionable hint
    rationale: Improves developer experience by telling users what to do next
  - id: factory-pattern
    title: Common errors use factory methods
    rationale: Ensures consistent formatting and makes it easy to add new error types
metrics:
  duration: 68s
  completed: 2026-01-27
---

# Phase 15 Plan 01: CLI Error Handling Foundation Summary

**One-liner:** Created centralized error handling with stderr output and actionable hints for all CLI errors

## What Was Built

This plan established the error handling infrastructure for the mcellui CLI. Previously, all 8 CLI commands used `console.log(chalk.red(...))` for errors, which incorrectly wrote to stdout instead of stderr. The new utilities enforce proper stderr/stdout separation, consistent formatting, and actionable error messages.

**Key Deliverables:**

1. **Centralized Error Handling** (`errors.ts`):
   - `CLIError` interface with message, hint, code, exitCode
   - `handleError()` function that writes to stderr and exits
   - Error factory methods for 5 common CLI error patterns
   - All errors include actionable hints

2. **Output Utilities** (`output.ts`):
   - `logError()`, `logWarning()`, `logInfo()` - write to stderr
   - `logSuccess()` - writes to stdout (success is data)
   - Consistent chalk formatting across all output

3. **Updated Barrel Export** (`index.ts`):
   - Re-exports error handling and output utilities
   - Makes utilities available to all CLI commands

## Decisions Made

### 1. stderr for All Errors
**Context:** CLI tools should write errors to stderr, not stdout, for proper shell scripting and error handling.

**Decision:** All error output uses `process.stderr.write()`. Success/data output uses `process.stdout.write()`.

**Impact:** Commands can now be safely piped and error handling works correctly in scripts.

### 2. Actionable Hints for Every Error
**Context:** Generic error messages frustrate users who don't know what to do next.

**Decision:** Every error includes a `hint` field with actionable next steps (e.g., "Run: npx mcellui init").

**Impact:** Improved developer experience. Users immediately know how to fix errors.

### 3. Factory Pattern for Common Errors
**Context:** Need consistent error formatting across all commands.

**Decision:** Common error patterns use factory methods (`errors.noProject()`, `errors.notInitialized()`, etc.) instead of ad-hoc error messages.

**Impact:** Consistent error messages and easier to update error formatting in one place.

## Implementation Details

### Error Factory Methods

```typescript
errors.noProject()          // No valid Expo/React Native project found
errors.notInitialized()     // Project not initialized with mcellui
errors.registryFetch()      // Failed to fetch component registry
errors.componentNotFound()  // Component not in registry
errors.configInvalid()      // Invalid configuration
```

Each factory method:
- Returns `never` (calls `process.exit`)
- Writes to stderr
- Includes error code for programmatic handling
- Provides actionable hint

### Output Utilities

```typescript
logError(message)    // Red text to stderr
logWarning(message)  // Yellow text to stderr
logInfo(message)     // Dimmed text to stderr
logSuccess(message)  // Green text to stdout
```

## Files Changed

### Created
- `packages/cli/src/utils/errors.ts` - Error handling core (89 lines)
- `packages/cli/src/utils/output.ts` - Output utilities (30 lines)

### Modified
- `packages/cli/src/utils/index.ts` - Added re-exports

## Testing

**Verification performed:**
1. Module exports correctly via `npx tsx` test
2. Barrel export includes all new utilities
3. No TypeScript compilation errors

**Manual testing needed:**
- Plan 15-03 will refactor all commands to use these utilities
- Real-world testing happens when commands are migrated

## Dependencies

**Requires:**
- Phase 14-02 (package exports fixed)

**Provides:**
- Centralized error handling utilities for Plan 15-03

**Affects:**
- Plan 15-03 will consume these utilities when refactoring all 8 commands

## Deviations from Plan

None - plan executed exactly as written.

## Metrics

- **Tasks completed:** 2/2
- **Files created:** 2
- **Files modified:** 1
- **Commits:** 2 atomic commits
- **Duration:** 68 seconds

## Next Phase Readiness

**Ready for Plan 15-03:** All utilities created and exported. No blockers.

**Future considerations:**
- May need additional error factory methods as we refactor commands
- Consider adding `logDebug()` for verbose mode in future
- Spinner integration may benefit from output utilities

## Commits

1. `0cbf4a1` - feat(15-01): create centralized error handling utility
2. `45ad76e` - feat(15-01): add output utilities and update barrel export
