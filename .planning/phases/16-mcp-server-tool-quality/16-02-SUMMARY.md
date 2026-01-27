---
phase: 16-mcp-server-tool-quality
plan: 02
subsystem: mcp-server
tags: [mcp-protocol, error-handling, agent-recovery, typescript]

# Dependency graph
requires:
  - phase: 16-01
    provides: Improved MCP tool schemas with explicit defaults
provides:
  - isError flag on all MCP tool error responses
  - Agent recovery hints with "Next step:" guidance
  - handleToolCall return type includes optional isError boolean
  - Global error boundary for unexpected failures
affects: [16-03, 16-04, mcp-client-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [error-recovery-hints, structured-error-responses]

key-files:
  created: []
  modified: [packages/mcp-server/src/tools/index.ts]

key-decisions:
  - "All error responses include isError: true flag for agent consumption"
  - "Recovery hints follow 'Next step:' pattern for actionable guidance"
  - "Registry load errors list possible causes (network, URL)"
  - "Component not found errors list available components and suggest alternate tools"

patterns-established:
  - "Error responses: { content: [{ type: 'text', text: 'Error message\n\nNext step: Action' }], isError: true }"
  - "Recovery hints guide agents to alternate tools or retry strategies"

# Metrics
duration: 1min
completed: 2026-01-27
---

# Phase 16 Plan 02: MCP Error Recovery Summary

**All MCP tool errors now include isError: true flags and actionable recovery hints guiding agents to retry, use alternate tools, or report issues**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-27T18:11:36Z
- **Completed:** 2026-01-27T18:13:04Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Added isError: true to 10 error paths (registry fail, 3x component-not-found, 2x code-load-fail, unknown-tool, no-search, no-suggestions, catch-all)
- Implemented "Next step:" recovery hints in 7+ error responses
- Updated handleToolCall return type to include optional isError boolean
- Enhanced registry load failure with possible causes (network, URL unreachable)
- Improved component not found errors with available components list and tool suggestions
- Added global try-catch wrapper for unexpected errors
- Verified maxResults parameter usage in suggest_component (1-10 range)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add isError and recovery hints to all error paths** - `b1b4838` (feat)

## Files Created/Modified
- `packages/mcp-server/src/tools/index.ts` - Added error recovery to all tool handlers with isError flags and structured hints

## Decisions Made
- **Error flag pattern:** All error responses include `isError: true` boolean flag at response root level, parallel to `content` array
- **Recovery hint format:** Errors follow pattern: `"Error description\n\nNext step: Actionable guidance"` for consistent agent consumption
- **Component not found guidance:** Errors suggest `mcellui_list_components` for browsing or `mcellui_search` for keyword searching
- **Code load failure recovery:** Suggest trying alternate tool (get_component vs get_component_source) if one fails
- **Unknown tool response:** List all 9 available tool names when invalid tool requested

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Pre-existing TypeScript errors in parseComponentDocs function** (lines 1085-1133):
- Several "possibly undefined" errors in documentation parsing logic
- These errors existed before this plan and are unrelated to error recovery changes
- Did not fix as they are outside the scope of plan 16-02 (error recovery in tool handlers)
- Documented for future cleanup in a dedicated type safety plan

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for plan 16-03 (MCP resources implementation):**
- All tool error paths now return structured error responses with recovery hints
- Agents can distinguish errors from success responses via isError flag
- Error messages guide agents to productive next actions instead of blind retries

**Requirements satisfied:**
- MCP-02: All error responses include isError flag
- MCP-03: All errors include "Next step:" recovery hints
- suggest_component respects maxResults parameter (already implemented in 16-01, verified here)

**Known issues to address later:**
- parseComponentDocs function has pre-existing TypeScript strict null check errors (not blocking MCP functionality)

---
*Phase: 16-mcp-server-tool-quality*
*Completed: 2026-01-27*
