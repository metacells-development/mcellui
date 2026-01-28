# Phase 18: Core Package Exports - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Audit core package theme tokens and utilities for completeness, correct exports, and no orphaned code. Covers CORE-01 (token exports), CORE-02 (utility exports), and CORE-03 (orphan cleanup). No new tokens or utilities — only verifying and fixing what exists.

</domain>

<decisions>
## Implementation Decisions

### Export organization
- Claude's discretion on subpath exports vs single entry point — pick what works best with the existing Phase 14 setup (which already established ESM-only + multiple entry points)
- Claude's discretion on file structure (one file per token category vs grouped) — follow existing codebase patterns
- Claude's discretion on whether utils and tokens share an export path or get separate subpaths — base on current layout

### Orphan handling
- Remove the 3 known orphaned exports (screenTokens, SCREEN_CONSTANTS, SKELETON_CONSTANTS) **after verifying** no component references them
- Verify-then-remove approach: grep/search for usage across all packages before deleting

### Claude's Discretion
- Import path structure (subpath exports vs root barrel)
- Token file organization (per-category vs grouped)
- Utility export location (separate subpath vs mixed with tokens)
- Documentation approach for exports (JSDoc, README, type-level)
- How to handle any additional orphans discovered during audit

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User trusts Claude to make export organization decisions based on the existing codebase patterns established in Phase 14 (ESM-only, multiple entry points, sideEffects: false).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 18-core-package-exports*
*Context gathered: 2026-01-28*
