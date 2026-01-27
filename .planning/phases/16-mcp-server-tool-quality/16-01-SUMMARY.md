---
phase: 16-mcp-server-tool-quality
plan: 01
subsystem: tooling-mcp
tags: [mcp-server, tool-descriptions, schema-design, ai-agent-ux]
requires:
  - 15-cli-audit
provides:
  - improved-tool-descriptions
  - rich-parameter-schemas
  - maxResults-parameter
affects:
  - 16-02-mcp-resource-quality
decisions:
  - id: MCP-01
    decision: "Tool descriptions follow '{Action} {what}. Use this when {scenario}.' pattern"
    rationale: "AI agents select tools based on descriptions alone - clear usage hints prevent wrong tool selection"
    impact: "All 9 tool descriptions now guide agents on when to use each tool"
  - id: MCP-04
    decision: "Optional parameters have explicit defaults in schemas"
    rationale: "Agents can confidently omit optional params, reducing clarifying questions"
    impact: "category, type, template, withForwardRef, aspect have defaults; maxResults added to suggest_component"
tech-stack:
  added: []
  patterns:
    - "Inline examples in parameter descriptions (e.g., 'button', 'card')"
    - "maxResults parameter with bounds (1-10, default 5)"
key-files:
  created: []
  modified:
    - packages/mcp-server/src/tools/index.ts
duration: "4 minutes"
completed: 2026-01-27
---

# Phase 16 Plan 01: MCP Tool Description & Schema Quality

> Improved all 9 MCP tool descriptions with "Use this when..." guidance, inline parameter examples, and explicit schema defaults

## Objective

Improve MCP tool definitions for better AI agent consumption. Agents pick the right tool based on descriptions alone - vague descriptions cause wrong tool selection or clarifying questions.

## What Was Done

### Tool Description Improvements

Updated all 9 tool descriptions to follow the pattern: `"{Action} {what}: {details}. Use this when {scenario}."`

**Before:**
```typescript
description: 'List all available mcellui components with filtering options'
```

**After:**
```typescript
description: 'List all available mcellui components grouped by category. Use this when you need to browse or discover components. Returns names, descriptions, and status for each component.'
```

### Specific Tool Updates

1. **mcellui_list_components**
   - Added "Use this when you need to browse or discover components"
   - Clarified return value: "names, descriptions, and status"
   - Added defaults to optional params (category, type)

2. **mcellui_get_component**
   - Changed "Use this first" to "Use this when you want to understand a component"
   - Explicitly listed return values: "description, props table, usage example, installation command"

3. **mcellui_get_component_source**
   - Clarified "Get the full TypeScript source code"
   - Added specific use cases: "see implementation, modify it, or understand internal logic"

4. **mcellui_add_component**
   - Detailed what it returns: "CLI command, peer dependencies, required components"
   - Added "Use this when you need to add a component to a project"

5. **mcellui_suggest_component**
   - Emphasized "ranked suggestions based on natural language description"
   - Added "Use this when the user describes a UI need but doesn't name specific components"
   - **NEW:** Added `maxResults` parameter (type: number, default: 5, min: 1, max: 10)
   - Updated handler to respect maxResults limit

6. **mcellui_create_component**
   - Changed to "Get a starter template and guide"
   - Added "Use this when building a component that doesn't exist in the registry"
   - Added defaults: template='basic', withForwardRef=false

7. **mcellui_customize_theme**
   - Clarified "colors, radius, fonts, or all aspects"
   - Added "Use this when the user wants to change the visual style"
   - Added default: aspect='all'

8. **mcellui_doctor**
   - Listed specific issues: "missing config, dependencies, babel plugins"
   - Added "Use this when components don't render or the project won't start"

9. **mcellui_search**
   - Differentiated from list: "Use this when you know a keyword but not exact component name"
   - Added cross-reference: "For browsing all components, use mcellui_list_components instead"

### Parameter Schema Improvements

**Inline Examples:** All parameters now include example values in descriptions
```typescript
description: 'Component name (e.g., "button", "card", "input")'
description: 'Filter by category (e.g., "Inputs", "Feedback", "Navigation")'
description: 'Search query (e.g., "modal", "form", "loading")'
```

**Explicit Defaults:** All optional parameters have explicit `default` values
```typescript
category: { default: undefined }
type: { default: undefined }
template: { default: 'basic' }
withForwardRef: { default: false }
aspect: { default: 'all' }
maxResults: { default: 5, minimum: 1, maximum: 10 }
```

## Verification

### All Checks Passed

```bash
# 9 tools have "Use this when"
grep -c "Use this when" src/tools/index.ts
# Result: 9 ✓

# maxResults parameter exists
grep "maxResults" src/tools/index.ts
# Found in schema and handler ✓

# Defaults present for optional params
grep "default:" src/tools/index.ts
# Found 7 defaults ✓

# TypeScript compiles (pre-existing errors in resources/index.ts unrelated)
npx tsc --noEmit
# tools/index.ts clean ✓
```

## Implementation Details

### maxResults Implementation

Added to `mcellui_suggest_component` tool:
```typescript
// Schema
maxResults: {
  type: 'number',
  description: 'Maximum suggestions to return (default: 5, max: 10)',
  default: 5,
  minimum: 1,
  maximum: 10,
}

// Handler
const maxResults = Math.min(Math.max((args?.maxResults as number) || 5, 1), 10);
const topSuggestions = suggestions.slice(0, maxResults);
```

This allows agents to request more suggestions when needed, but bounds the response size for performance.

## Commit

```
2dcd97a refactor(16-01): improve MCP tool descriptions and schemas
```

**Changes:**
- 9 tool descriptions updated with "Use this when..." pattern
- 7 optional parameters given explicit defaults
- 1 new parameter: maxResults (with bounds)
- Parameter descriptions enhanced with inline examples

## Next Phase Readiness

### Blockers
None.

### Handoff to 16-02
Phase 16-02 (MCP Resource Quality) can now apply the same patterns:
- Rich descriptions with "Use this when..." hints
- Inline examples in metadata
- Clear differentiation between similar resources

### Technical Debt
None. All tool definitions now follow consistent patterns.

## Decisions Made

| ID | Decision | Impact |
|----|----------|--------|
| MCP-01 | Tool descriptions follow "{Action} {what}. Use this when {scenario}." pattern | Agents select correct tool more reliably |
| MCP-04 | Optional parameters have explicit defaults | Agents can omit params confidently |

## Lessons Learned

### What Worked Well
- **Inline examples** make parameter descriptions immediately actionable
- **maxResults parameter** gives agents control without breaking existing behavior (backward compatible default)
- **"Use this when"** guidance prevents tool confusion (e.g., search vs list)

### Patterns to Reuse
1. **Description format:** `"{Action} {what}: {details}. Use this when {scenario}."`
2. **Parameter examples:** Always include `(e.g., "value1", "value2")`
3. **Cross-references:** Mention related tools when relevant
4. **Explicit defaults:** Even for `undefined`, state it explicitly

### For Future Phases
Apply same patterns to:
- MCP resources (16-02)
- CLI help text (if needed)
- Component prop descriptions (long-term)

---

*Generated: 2026-01-27*
*Plan: 16-01-PLAN.md*
*Commits: 2dcd97a*
