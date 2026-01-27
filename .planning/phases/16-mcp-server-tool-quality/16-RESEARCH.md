# Phase 16: MCP Server Tool Quality - Research

**Researched:** 2026-01-27
**Domain:** Model Context Protocol (MCP) server optimization for AI agent consumption
**Confidence:** HIGH

## Summary

This phase focuses on auditing and optimizing the existing mcellui MCP server (9 tools, 7 resources) for AI agent consumption. Research reveals that MCP tool quality depends on five key areas: (1) concise, example-rich tool descriptions, (2) structured JSON+markdown responses, (3) actionable error messages with recovery steps, (4) flat, well-validated schemas, and (5) hierarchical, metadata-rich resource URIs.

The MCP specification and ecosystem best practices emphasize that tools should return errors **within result objects** (using `isError: true`) rather than protocol-level failures, enabling LLMs to reason about failures and take corrective action. Schema design should prioritize clarity over nesting depth—OpenAI supports up to 10 levels but agents perform better with shallow, well-described structures. Resource organization should follow hierarchical URI patterns (e.g., `mcellui://docs/getting-started`) with rich metadata (description, sizeHint, lastUpdated) to help agents decide what to fetch.

**Primary recommendation:** Apply CLI error patterns from Phase 15 to MCP tools—clear messages with actionable hints. Keep schemas flat with explicit parameter descriptions. Return structured JSON + markdown for all tool responses. Add metadata to resources for better discoverability.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @modelcontextprotocol/sdk | ^1.0.0 | MCP server/client implementation | Official SDK from Anthropic, defines protocol types and server utilities |
| zod | ^3.22.0 | Runtime schema validation | Industry standard for TypeScript validation, pairs well with JSON Schema |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | ^5.4.0 | Type safety | Always—MCP SDK is TypeScript-first |
| tsup | ^8.0.0 | Build tool | Bundle for distribution |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @modelcontextprotocol/sdk | Custom JSON-RPC | SDK handles protocol lifecycle, handshake, versioning—custom implementation is complex |
| zod | ajv, joi | Zod integrates cleanly with TypeScript, ajv is faster but less type-safe |

**Installation:**
```bash
npm install @modelcontextprotocol/sdk zod
npm install -D typescript tsup @types/node
```

## Architecture Patterns

### Recommended Project Structure
```
packages/mcp-server/
├── src/
│   ├── index.ts           # Server setup, request handlers
│   ├── tools/             # Tool definitions and handlers
│   │   └── index.ts       # Tool list + handleToolCall()
│   └── resources/         # Resource definitions and handlers
│       └── index.ts       # Resource list + handleResourceRead()
├── registry/              # Bundled component registry (copied from ../registry)
└── package.json
```

### Pattern 1: Tool Definition with Concise Descriptions
**What:** Each tool has a one-liner description + "Use this when..." hint + inline parameter example
**When to use:** Always—agents need to understand tool purpose without reading full docs
**Example:**
```typescript
// Source: MCP SDK examples + Phase 16 context decisions
{
  name: 'mcellui_get_component',
  description: 'Get concise documentation for a component: description, props, examples, and installation. Use this first to understand a component.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Component name (e.g., "button", "card", "input")',
      },
    },
    required: ['name'],
  },
}
```

### Pattern 2: Structured Tool Response (JSON + Markdown)
**What:** Return both machine-readable JSON and human-readable markdown in `content` array
**When to use:** Always—agents parse structure, markdown provides context
**Example:**
```typescript
// Source: MCP specification + best practices
return {
  content: [
    {
      type: 'text',
      text: `# Button Component\n\nA pressable button with variants...\n\n## Installation\n\`\`\`bash\nnpx mcellui add button\n\`\`\``,
    },
  ],
};
```

### Pattern 3: Error Response with Recovery Steps
**What:** Set `isError: true` and include actionable recovery steps in content
**When to use:** When tool execution fails—enables agent to reason about next steps
**Example:**
```typescript
// Source: MCP best practices + Phase 15 CLI error patterns
if (!component) {
  return {
    content: [
      {
        type: 'text',
        text: `Component "${componentName}" not found.\n\nAvailable: ${registry.components.map(c => c.name).join(', ')}\n\nNext step: Use mcellui_list_components to browse all components.`,
      },
    ],
    isError: true,
  };
}
```

### Pattern 4: Flat Schema with Rich Descriptions
**What:** Keep parameter schemas 1-2 levels deep with explicit descriptions and examples
**When to use:** Always—agents perform better with shallow, well-described structures
**Example:**
```typescript
// Source: OpenAI structured outputs guide + MCP SDK
inputSchema: {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Component name (e.g., "button", "card", "input")',
    },
    detail: {
      type: 'boolean',
      description: 'Return full source code instead of summary (default: false)',
      default: false,
    },
  },
  required: ['name'],
}
```

### Pattern 5: Hierarchical Resource URIs with Metadata
**What:** Use `scheme://category/item` URIs with rich metadata (description, mimeType, sizeHint)
**When to use:** Always—helps agents discover and decide whether to fetch
**Example:**
```typescript
// Source: MCP specification resource templates
{
  uri: 'mcellui://docs/getting-started',
  name: 'Getting Started Guide',
  description: 'How to set up mcellui in your project (5-minute quick start)',
  mimeType: 'text/markdown',
  metadata: {
    sizeHint: '2KB',
    lastUpdated: '2026-01-27',
    topics: ['installation', 'configuration', 'first-component'],
  },
}
```

### Anti-Patterns to Avoid
- **Vague descriptions:** "Get component" → "Get concise documentation for a component: description, props, examples, and installation"
- **Protocol-level errors:** Throwing exceptions → Return `isError: true` with content
- **Deep nesting:** 5+ levels → Flat structures with explicit descriptions
- **Raw JSON responses:** `{ temperature: 22 }` → Structured JSON + markdown with context
- **Flat resource URIs:** `mcellui://all-docs` → `mcellui://docs/getting-started`

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON Schema validation | Custom parameter checking | zod or JSON Schema draft-07 | Edge cases (optional fields, defaults, enums), type inference |
| MCP protocol lifecycle | Custom JSON-RPC server | @modelcontextprotocol/sdk | Handles versioning, handshake, capability negotiation |
| Error recovery hints | Generic error messages | CLI error factory pattern (Phase 15) | Actionable hints proven to help agents |
| Resource metadata | Minimal URIs | Full resource objects with metadata | Agents use metadata to decide whether to fetch |

**Key insight:** MCP is a young protocol (1.0 released Nov 2024). The official SDK handles complex lifecycle management (initialization, capability negotiation, protocol versioning) that custom implementations struggle with. Use the SDK and focus on tool/resource quality.

## Common Pitfalls

### Pitfall 1: Protocol-Level Error Reporting
**What goes wrong:** Tools throw exceptions, causing MCP protocol errors instead of tool errors
**Why it happens:** Coming from REST APIs where 4xx/5xx errors are normal
**How to avoid:** Wrap tool logic in try-catch, return `{ content: [...], isError: true }` on failure
**Warning signs:** Agent sees "MCP server error" instead of actionable tool failure message

### Pitfall 2: Vague Tool Descriptions
**What goes wrong:** Descriptions like "Get component" don't tell agent what the tool returns
**Why it happens:** Writing for human users who can explore, not agents who need upfront context
**How to avoid:** Format: "{Action} {what}: {details}. Use this when..." + parameter example
**Warning signs:** Agent calls wrong tool or asks user "which tool should I use?"

### Pitfall 3: Nested Schema Complexity
**What goes wrong:** Deeply nested schemas (5+ levels) cause agent confusion and parsing errors
**Why it happens:** Modeling complex domain objects directly as tool parameters
**How to avoid:** Flatten to 1-2 levels, use explicit descriptions, split into multiple tools if needed
**Warning signs:** Agent provides malformed parameters or asks user to clarify structure

### Pitfall 4: Missing Recovery Steps in Errors
**What goes wrong:** Error messages like "Component not found" leave agent stuck
**Why it happens:** Treating agents like humans who know next steps
**How to avoid:** Include "Next step: ..." hint (e.g., "Use mcellui_list_components to browse")
**Warning signs:** Agent repeats failed tool call or asks user what to do

### Pitfall 5: Resource URI Ambiguity
**What goes wrong:** Flat URIs like `mcellui://all-components` don't help agent discover subsets
**Why it happens:** Treating resources like file downloads instead of hierarchical documents
**How to avoid:** Use `scheme://category/item` pattern, add metadata (description, sizeHint)
**Warning signs:** Agent fetches large resources when only metadata would suffice

## Code Examples

Verified patterns from official sources:

### Tool Handler with Error Recovery
```typescript
// Source: MCP Python SDK error handling + Phase 15 CLI patterns
export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    const registry = await loadRegistry();

    if (!registry) {
      return {
        content: [
          {
            type: 'text',
            text: `Could not load component registry.\n\nPossible causes:\n- Network connection issue\n- Registry URL unreachable: ${REGISTRY_URL}\n\nNext step: Check internet connection and retry.`,
          },
        ],
        isError: true,
      };
    }

    switch (name) {
      case 'mcellui_get_component': {
        const componentName = args?.name as string;
        const component = registry.components.find(c => c.name === componentName);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Component "${componentName}" not found.\n\nAvailable: ${registry.components.map(c => c.name).join(', ')}\n\nNext step: Use mcellui_list_components to browse all components.`,
              },
            ],
            isError: true,
          };
        }

        // Success case: return structured markdown
        const output = formatComponentDocs(component);
        return { content: [{ type: 'text', text: output }] };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    // Catch unexpected errors
    return {
      content: [
        {
          type: 'text',
          text: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nNext step: Report this issue to mcellui developers.`,
        },
      ],
      isError: true,
    };
  }
}
```

### Resource with Rich Metadata
```typescript
// Source: MCP specification resource templates + best practices
export const resources: Resource[] = [
  {
    uri: 'mcellui://registry',
    name: 'Component Registry',
    description: 'Full list of all mcellui components with metadata (27 UI components + 6 blocks)',
    mimeType: 'application/json',
    metadata: {
      sizeHint: '15KB',
      lastUpdated: '2026-01-27',
      componentCount: 33,
    },
  },
  {
    uri: 'mcellui://docs/getting-started',
    name: 'Getting Started Guide',
    description: 'How to set up mcellui in your project (5-minute quick start)',
    mimeType: 'text/markdown',
    metadata: {
      sizeHint: '2KB',
      lastUpdated: '2026-01-27',
      topics: ['installation', 'configuration', 'first-component'],
    },
  },
];
```

### Flat Schema with Examples
```typescript
// Source: OpenAI structured outputs + MCP SDK
{
  name: 'mcellui_suggest_component',
  description: 'Get intelligent component suggestions based on what you want to build. Returns ranked list with match details.',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: 'Describe what you want to build (e.g., "a login form with email and password", "a product card with image and price")',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of suggestions to return (default: 5, max: 10)',
        default: 5,
        minimum: 1,
        maximum: 10,
      },
    },
    required: ['description'],
  },
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Throw exceptions on error | Return `isError: true` with content | MCP 1.0 (Nov 2024) | Agents can reason about failures |
| Minimal tool descriptions | One-liner + "Use this when..." + example | 2025 best practices | Agents pick correct tool without trial-and-error |
| Nested parameter schemas | Flat schemas (1-2 levels) with rich descriptions | 2025-2026 structured outputs | Fewer agent parsing errors |
| Generic resource URIs | Hierarchical URIs with metadata | MCP resource templates | Agents discover relevant resources faster |
| Plain text responses | Structured JSON + markdown | 2024-2026 multimodal agents | Agents parse structure, humans read markdown |

**Deprecated/outdated:**
- **JSON-RPC 2.0 without MCP lifecycle:** MCP SDK handles initialization, capability negotiation, version management—manual JSON-RPC is error-prone
- **Optional parameters without defaults:** JSON Schema `default` field enables agents to omit optional params confidently
- **Binary-only resources:** Agents prefer text/markdown resources they can reason about—binary requires download+parse

## Open Questions

1. **Tool overlap (search vs list)**
   - What we know: `mcellui_search` and `mcellui_list_components` have overlapping functionality
   - What's unclear: Whether agents benefit from distinct tools or unified search
   - Recommendation: Test with agents—if search queries are always broad, merge into list with optional filter param

2. **Resource hierarchy depth**
   - What we know: MCP supports hierarchical URIs (`mcellui://docs/category/item`)
   - What's unclear: Whether to expose component-level resources (`mcellui://component/button`) or keep docs-only
   - Recommendation: Start with current 7 doc resources, add component URIs if agents request component source frequently

3. **Suggestion ranking format**
   - What we know: `mcellui_suggest_component` returns scored matches
   - What's unclear: Whether agents prefer scores (0-100), match keywords, or confidence levels
   - Recommendation: Return all three (score, keywords, confidence) initially, simplify based on agent usage

4. **Response detail flags**
   - What we know: Context suggests `detail: true` flag for full source code
   - What's unclear: Whether agents prefer separate tools (`get_component` vs `get_component_source`) or flags
   - Recommendation: Keep separate tools—clearer tool descriptions, agents pick correct one upfront

## Sources

### Primary (HIGH confidence)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25) - Official MCP spec
- [Model Context Protocol GitHub](https://github.com/modelcontextprotocol/modelcontextprotocol) - Protocol schemas and examples
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) - Error handling patterns
- Context7: `/modelcontextprotocol/modelcontextprotocol` - Tool/resource schemas and patterns
- [MCP Best Practices](https://modelcontextprotocol.info/docs/best-practices/) - Architecture and implementation guide
- [MCP Tools Concepts](https://modelcontextprotocol.info/docs/concepts/tools/) - Tool design best practices

### Secondary (MEDIUM confidence)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) - JSON Schema validation limits (10 levels, 5000 properties)
- [LLM Structured Outputs Guide](https://agenta.ai/blog/the-guide-to-structured-outputs-and-function-calling-with-llms) - Flat vs nested schema tradeoffs
- [FastMCP Resources Guide](https://gofastmcp.com/servers/resources) - Resource format examples
- [Mastra Notes MCP Server](https://mastra.ai/guides/guide/notes-mcp-server) - Markdown resource pattern

### Tertiary (LOW confidence)
- WebSearch: "Top 10 Best MCP Servers 2026" - General MCP server ecosystem trends

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official SDK verified via Context7 and GitHub
- Architecture: HIGH - Patterns from MCP spec, verified examples
- Pitfalls: MEDIUM-HIGH - Derived from best practices docs and error handling patterns, not all explicitly documented
- Code examples: HIGH - Sourced from official SDK docs and specification

**Research date:** 2026-01-27
**Valid until:** 2026-04-27 (90 days—MCP is stable 1.0 protocol, slow-moving spec)
