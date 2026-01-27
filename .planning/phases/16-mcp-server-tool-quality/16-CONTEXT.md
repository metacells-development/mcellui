# Phase 16: MCP Server Tool Quality - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Audit and optimize 9 MCP tools and 7 resources for AI agent consumption. Improve descriptions, response format, error messages, schemas, and resource discoverability. No new tools or resources are added — this phase improves what exists.

</domain>

<decisions>
## Implementation Decisions

### Tool descriptions & examples
- Concise descriptions: one-liner + "Use this when..." hint (shorter is better for agent context)
- One parameter example per tool inline in the description
- Claude's Discretion: whether to add workflow hints (e.g. "use list first, then get") — add only where sequence matters

### Tool overlap (search vs list)
- Claude's Discretion: decide whether to keep both `mcellui_search` and `mcellui_list_components` as separate tools, merge them, or differentiate their descriptions more clearly — based on what makes agents most effective

### Response format & structure
- Return structured JSON + markdown for all tool responses (agents get both parseable data and readable context)
- `mcellui_get_component`: summary by default, full detail via a flag parameter (e.g. `detail: true`)
- Claude's Discretion: list/search response metadata (counts, category summaries) — include what helps agent decision-making
- Claude's Discretion: suggestion ranking format for `mcellui_suggest_component`

### Resource organization
- Keep current 5 doc guides — no additions or removals
- Add metadata to resource listings: lastUpdated, sizeHint, description — so agents can decide whether to fetch
- Claude's Discretion: URI hierarchy depth (flat vs component-level resources) and registry resource weight (full vs light index)

### Claude's Discretion
- Error messages & recovery steps (not discussed — Claude applies CLI audit patterns from Phase 15)
- Schema flattening approach
- Exact JSON response structure per tool
- Resource URI hierarchy decisions

</decisions>

<specifics>
## Specific Ideas

- "Shorter is better for context" — tool descriptions should minimize token usage in agent context windows
- Summary-by-default pattern for component docs mirrors how agents actually work: scan first, drill down when needed

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 16-mcp-server-tool-quality*
*Context gathered: 2026-01-27*
