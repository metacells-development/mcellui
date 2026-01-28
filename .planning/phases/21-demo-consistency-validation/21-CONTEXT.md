# Phase 21: Demo Consistency & Validation - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure the demo app follows the same token and naming standards as the library. Complete audit of apps/demo for hardcoded values, migration to semantic tokens, and manual dark mode verification on iOS. This completes the v1.2 Consistency Sweep.

</domain>

<decisions>
## Implementation Decisions

### Color token coverage
- Complete audit of every file in apps/demo for hardcoded colors
- Report findings before fixing — understand scope first
- Demo uses identical token paths as library (colors.foreground, colors.primary, etc.)
- All colors should use tokens, including decorative/illustration elements — full theme adaptation
- Audit covers all token types: colors, spacing, typography, radius — complete coverage

### Dark mode testing
- Manual visual check on iOS Simulator only
- Run demo app in both light and dark mode, verify each screen
- Fix any contrast issue that looks wrong (low contrast, clashing colors, wrong backgrounds)
- No formal documentation — just fix issues as found

### Scope of changes
- Primary focus is apps/demo
- Simple library issues (packages/) can be fixed inline if encountered
- Complex library issues get noted for future phase
- Demo-specific code (navigation, example screens) has lighter standards — doesn't need to match library exactly
- Demo navigation/chrome just needs to work and not break in dark mode — functional, not polished
- If semantic token gaps are found, add missing tokens/helpers to core package

### Claude's Discretion
- Order of file auditing within demo
- Exact migration patterns for edge cases
- When to classify a library issue as "simple" vs "complex"
- How to handle any ambiguous decorative elements

</decisions>

<specifics>
## Specific Ideas

No specific requirements — apply standard token migration patterns established in Phases 19-20.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 21-demo-consistency-validation*
*Context gathered: 2026-01-28*
