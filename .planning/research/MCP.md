# MCP Server Best Practices

**Domain:** Model Context Protocol Server Implementation
**Researched:** 2026-01-26
**Confidence:** HIGH (based on official MCP specification 2025-11-25 and community best practices 2026)

## Executive Summary

The Model Context Protocol (MCP) is an open protocol for connecting AI assistants to external data sources and tools via JSON-RPC 2.0. Best practices emphasize **workflow-first design** over API mirroring, **token efficiency** in responses, **flat schema design** for LLM comprehension, and **single-responsibility principles** for tools.

Key insight: **The AI agent is the consumer, not the human.** Design tool names, descriptions, and responses for LLM comprehension, not human aesthetics.

## Tool Design Best Practices

### 1. Workflow-First Naming

**Principle:** Design tools around user intent, not API endpoints.

| Anti-Pattern | Better Pattern | Why |
|--------------|----------------|-----|
| `get_user()` + `upload_file()` | `upload_file_for_user(path, owner)` | Completes workflow in one call |
| `list_items()` + `filter_items()` | `search_items(query, filters)` | Single tool handles search intent |
| `create_x()` + `update_x()` | Separate (different intents) | Create vs update are distinct workflows |

**Example from mcellui MCP:**
- ✅ `mcellui_get_component` - Get concise docs (for understanding)
- ✅ `mcellui_get_component_source` - Get full source (for implementation)
- ✅ `mcellui_suggest_component` - AI-powered suggestions (for discovery)

These serve **different user intents** despite all accessing component data.

### 2. Tool Names as Prompts

Tool names are training data for the LLM. Make them descriptive and semantic.

**Naming conventions:**
```typescript
// Good: Action + Object + Context
mcellui_list_components
mcellui_get_component
mcellui_add_component
mcellui_suggest_component

// Avoid: Abbreviated or technical
mc_lst_cmp  // Too cryptic
list         // Too generic
component    // Missing action verb
```

### 3. Description Clarity

Tool descriptions guide the LLM on **when** to use the tool.

**Pattern:**
```typescript
{
  name: 'mcellui_get_component',
  description: 'Get concise documentation for a component: description, props, examples, and installation. Use this first to understand a component.',
  //           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //           What it returns                             When to use it
}
```

**Anti-pattern:**
```typescript
{
  name: 'get_component',
  description: 'Gets a component',  // ❌ Unclear what it returns, when to use
}
```

### 4. Schema Design for LLMs

**Principle:** Flat schemas reduce token count and cognitive load.

```typescript
// ❌ Nested (harder for LLM to construct)
{
  filters: {
    category: {
      value: string,
      operator: 'eq' | 'contains'
    }
  }
}

// ✅ Flat (easier for LLM)
{
  category?: string,
  type?: string
}
```

**Field descriptions are instructions to the LLM:**
```typescript
{
  name: {
    type: 'string',
    description: 'Component name (e.g., "button", "card", "input")',
    //           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //           Examples help LLM format correctly
  }
}
```

### 5. Enum Values for Constraints

When parameters have fixed options, use enums with clear descriptions.

```typescript
{
  template: {
    type: 'string',
    enum: ['basic', 'animated', 'pressable', 'input'],
    description: 'Template type: basic (simple view), animated (with Reanimated), pressable (touchable), input (form field)',
    //           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //           Explain what each enum value means
  }
}
```

### 6. Tool Budget Management

**Principle:** Too many tools overwhelm the agent. Consolidate related operations.

From Block's playbook:
- ❌ `get_team_members()`, `get_team_projects()`, `get_team_settings()` (3 tools)
- ✅ `get_team_info(aspect: 'members' | 'projects' | 'settings')` (1 tool)

**mcellui approach:**
- 8 tools total (focused, distinct workflows)
- Each serves a clear user intent
- No redundancy or overlap

### 7. Permission Boundaries

**Principle:** Single risk level per tool. Don't mix read and write operations.

```typescript
// ✅ Read-only (safe)
mcellui_list_components
mcellui_get_component

// ❌ Mixed (confusing permissions)
mcellui_manage_component({
  action: 'read' | 'update' | 'delete'  // Don't do this
})
```

## Response Formatting Best Practices

### 1. Prefer Markdown Over JSON

**Why:** Token efficiency and LLM comprehension.

```typescript
// ❌ Verbose JSON (high token count)
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      component: { name: 'button', props: [...] }
    }, null, 2)
  }]
};

// ✅ Structured Markdown (lower token count)
return {
  content: [{
    type: 'text',
    text: `# Button

**Category:** Inputs · **Status:** stable

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onPress | () => void | ✓ | Handler function |
`
  }]
};
```

### 2. Token Budget Awareness

Implement size limits with actionable errors:

```typescript
// Block's pattern: 400KB limit
if (responseSize > 400_000) {
  return {
    content: [{
      type: 'text',
      text: `Error: Response too large (${responseSize} bytes).

**Options:**
1. Use mcellui_search to narrow results
2. Query specific category with mcellui_list_components
3. Get individual component with mcellui_get_component`
    }]
  };
}
```

**mcellui implementation:**
- Separate `get_component` (concise docs) from `get_component_source` (full code)
- Prevents overwhelming context with unnecessary source code

### 3. Structured Output Hierarchy

```markdown
# Component Name

[One-line description]

**Metadata:** Category · Status · Dependencies

## Installation
[CLI command]

## Example
[Code block]

## Props
[Table format for scannability]

## Exports
[Import statement example]
```

**Why this works:**
- Headers allow LLM to skip sections
- Tables are scannable
- Code blocks are clearly delimited
- Metadata upfront for quick assessment

### 4. Error Messages for Agent Recovery

```typescript
// ❌ Vague error
"Component not found"

// ✅ Actionable error
`Component "${name}" not found.

**Available components:** ${components.map(c => c.name).join(', ')}

**Did you mean?** ${getSuggestions(name).join(', ')}`
```

### 5. Contextual Guidance

Help the agent understand next steps:

```typescript
// After suggesting components
output += `

---

**Add all suggested components:**

\`\`\`bash
npx @metacells/mcellui-cli add ${componentNames}
\`\`\`
`;
```

## Resource Organization Best Practices

### 1. URI Pattern Design

**Principle:** URIs should be self-documenting and hierarchical.

```typescript
// ✅ Clear hierarchy
'mcellui://registry'
'mcellui://tokens'
'mcellui://docs/getting-started'
'mcellui://docs/component-patterns'

// ❌ Flat, unclear
'mcellui://1'
'mcellui://data'
'mcellui://gettingstarted'
```

### 2. Custom Scheme Conventions

Use domain-specific schemes:
- `mcellui://` for component library resources
- `docs://` for documentation
- `config://` for configuration
- `db://` for database access

### 3. Resource vs Tool Decision

| Use Resource | Use Tool |
|--------------|----------|
| Static/cacheable data | Dynamic/computed results |
| Full registry dump | Filtered/searched results |
| Documentation | Code generation |
| Schema definitions | Validation operations |

**mcellui pattern:**
- Resource: `mcellui://registry` (full JSON, cacheable)
- Tool: `mcellui_search` (dynamic filtering)

### 4. MIME Types for Clarity

```typescript
{
  uri: 'mcellui://registry',
  mimeType: 'application/json',  // Client knows how to parse
}

{
  uri: 'mcellui://docs/getting-started',
  mimeType: 'text/markdown',  // Client can render as markdown
}
```

### 5. Resource Templates for Parametrization

For dynamic content with URI patterns:

```typescript
// Standard parameter (one segment)
'components://{name}'  // components://button

// Wildcard parameter (multiple segments)
'docs://{category*}/{page}'  // docs://core/theme/customization
```

## Error Handling Best Practices

### 1. Two-Category Error System

MCP supports protocol-level and tool-specific errors:

```typescript
// Protocol error (JSON-RPC 2.0)
{
  code: -32602,  // Invalid params
  message: "Invalid parameter type",
  data: { expected: 'string', got: 'number' }
}

// Tool-specific error (return in content)
return {
  content: [{
    type: 'text',
    text: `Error: Could not load component registry.

**Tried:** ${REGISTRY_URL}/registry.json

**Possible causes:**
1. Network connectivity issue
2. Registry not published
3. Invalid registry URL in env

**Fix:** Check MCELLUI_REGISTRY_URL environment variable`
  }]
};
```

### 2. Standard Error Codes

Follow JSON-RPC 2.0 specification:
- `-32700`: Parse error
- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

### 3. Graceful Degradation

```typescript
// mcellui pattern: Try local, fallback to remote
async function loadRegistry() {
  if (isLocalMode()) {
    const local = loadLocalRegistry();
    if (local) return local;
  }

  return await loadRemoteRegistry();
}
```

### 4. Informative Validation Errors

```typescript
// Schema validation
{
  name: {
    type: 'string',
    description: 'Component name (e.g., "button", "card")'
  }
}

// If missing, MCP automatically generates:
// "Missing required parameter: name"
```

## Implementation Best Practices

### 1. Server Architecture

```typescript
// Single responsibility
const server = new Server(
  {
    name: 'mcellui-mcp',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},      // Provide dynamic operations
      resources: {},  // Provide static data
    },
  }
);
```

### 2. Handler Organization

Separate concerns:

```typescript
// tools/index.ts - Tool definitions and handlers
export const tools: Tool[] = [...];
export async function handleToolCall(name, args) {...}

// resources/index.ts - Resource definitions and handlers
export const resources: Resource[] = [...];
export async function handleResourceRead(uri) {...}

// index.ts - Server setup only
server.setRequestHandler(ListToolsRequestSchema, ...);
server.setRequestHandler(CallToolRequestSchema, ...);
```

### 3. Caching Strategy

```typescript
// Cache expensive operations
let registryCache: Registry | null = null;
const componentCodeCache = new Map<string, string>();

async function loadRegistry() {
  if (registryCache) return registryCache;
  registryCache = await fetchRegistry();
  return registryCache;
}
```

### 4. Local + Remote Strategy

Support both bundled (npm package) and remote (GitHub) registries:

```typescript
function getRegistryPath() {
  const bundledPath = path.resolve(__dirname, '..', 'registry');
  const monorepoPath = path.resolve(__dirname, '..', '..', 'registry');

  if (fs.existsSync(path.join(bundledPath, 'registry.json'))) {
    return bundledPath;
  }
  return monorepoPath;
}
```

### 5. Code Parsing for Documentation

Extract structured data from source code:

```typescript
// Parse JSDoc comments for descriptions
const docblockMatch = code.match(/\/\*\*\s*\n([\s\S]*?)\*\//);

// Extract @example blocks
const exampleMatch = docblock.match(/@example\s*\n\s*```tsx?\s*\n([\s\S]*?)```/);

// Parse TypeScript interfaces for props
const propsInterfaces = code.matchAll(/export\s+interface\s+(\w+Props)\s*{([^}]+)}/g);
```

## Tool Discoverability

### 1. Progressive Disclosure

Organize tools by user journey:

**Discovery:**
- `mcellui_list_components` - Browse what exists
- `mcellui_search` - Find by keyword
- `mcellui_suggest_component` - AI-powered recommendations

**Understanding:**
- `mcellui_get_component` - Read documentation

**Implementation:**
- `mcellui_get_component_source` - Get full code
- `mcellui_add_component` - Installation instructions

**Customization:**
- `mcellui_create_component` - Build custom components
- `mcellui_customize_theme` - Theme customization

**Maintenance:**
- `mcellui_doctor` - Diagnose issues

### 2. Tool Relationships in Descriptions

Cross-reference related tools:

```typescript
{
  name: 'mcellui_get_component',
  description: 'Get concise documentation for a component: description, props, examples, and installation. Use this first to understand a component.',
  //                                                                                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                                                                                  Guides workflow progression
}

{
  name: 'mcellui_get_component_source',
  description: 'Get the full source code for a component. Only use this when you need to see the complete implementation details.',
  //                                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                                       Prevents premature use
}
```

### 3. Example-Driven Schema

Include examples in parameter descriptions:

```typescript
{
  name: {
    type: 'string',
    description: 'Component name (e.g., "button", "card", "input")',
  }
}
```

## Quality Checklist for MCP Server Audit

### Tool Design
- [ ] Tool names follow `namespace_action_object` convention
- [ ] Each tool serves a distinct user intent/workflow
- [ ] No redundant or overlapping tools
- [ ] Tool descriptions explain **what** it returns and **when** to use it
- [ ] Tools have single permission level (not mixed read/write)
- [ ] Total tool count is reasonable (<15 for focused domain)

### Schema Design
- [ ] Schemas are flat (minimal nesting)
- [ ] All parameters have clear descriptions with examples
- [ ] Enums used for fixed option sets with explanations
- [ ] Required vs optional parameters clearly marked
- [ ] Parameter types are simple (string, number, boolean, enum)
- [ ] No overly complex object structures

### Response Formatting
- [ ] Responses use Markdown, not verbose JSON
- [ ] Structured with clear hierarchy (headers, tables, code blocks)
- [ ] Token budget considered (separate verbose operations)
- [ ] Error messages are actionable with suggestions
- [ ] Includes next-step guidance where appropriate
- [ ] Code blocks use proper language tags for syntax highlighting

### Resource Organization
- [ ] URI patterns are hierarchical and self-documenting
- [ ] Custom scheme is domain-appropriate (e.g., `mcellui://`)
- [ ] MIME types specified correctly
- [ ] Resources used for static/cacheable data
- [ ] Tools used for dynamic/computed results
- [ ] Resource templates used for parameterized content

### Error Handling
- [ ] Protocol errors use standard JSON-RPC 2.0 codes
- [ ] Tool errors returned in content with context
- [ ] Validation errors are informative
- [ ] Graceful degradation (local fallback to remote)
- [ ] Network errors handled with retry guidance
- [ ] File size limits enforced with actionable messages

### Implementation Quality
- [ ] Server capabilities declared correctly
- [ ] Handlers separated by concern (tools, resources)
- [ ] Caching implemented for expensive operations
- [ ] Local + remote registry support
- [ ] Code parsing extracts structured documentation
- [ ] Registry loads reliably (bundled + monorepo + remote)

### Discoverability
- [ ] Tools organized by user journey stage
- [ ] Related tools cross-referenced in descriptions
- [ ] Progressive disclosure (overview → detail)
- [ ] Examples provided in schema descriptions
- [ ] Resource list documented in README
- [ ] Clear usage examples in documentation

### AI Consumer Optimization
- [ ] Tool names are semantic and descriptive
- [ ] Descriptions act as prompts to the LLM
- [ ] Responses optimized for LLM parsing (not human aesthetics)
- [ ] Structured formats (tables, headers) for scannability
- [ ] Context-aware guidance for next actions
- [ ] Token efficiency prioritized

## MCP-Specific Patterns from mcellui Implementation

### Pattern 1: Separate Overview vs Detail Tools

```typescript
// Overview (concise, for understanding)
mcellui_get_component → Returns: description, props table, example
                        ~100-300 tokens

// Detail (complete, for implementation)
mcellui_get_component_source → Returns: full TypeScript source
                                ~500-2000 tokens
```

**Why:** Prevents overwhelming context when agent just needs overview.

### Pattern 2: Keyword-Based Suggestion Engine

```typescript
const componentKeywords: Record<string, string[]> = {
  button: ['button', 'click', 'tap', 'press', 'action', 'submit'],
  input: ['input', 'text', 'field', 'form', 'email', 'password'],
  // ...
};

// Scoring algorithm
for (const kw of keywords) {
  if (description.includes(kw.toLowerCase())) {
    score += 10;
  }
}
```

**Why:** Enables natural language queries like "I need a form with email and password" → suggests `input`, `button`, `form`, `login-block`.

### Pattern 3: Bundled Documentation as Resources

```typescript
const GETTING_STARTED_MD = `# Getting Started...`;
const COMPONENT_PATTERNS_MD = `# Component Patterns...`;

// Served as resources
resources: [
  {
    uri: 'mcellui://docs/getting-started',
    mimeType: 'text/markdown',
  }
]
```

**Why:** Static documentation doesn't need to be regenerated per request. LLM can read resources upfront for context.

### Pattern 4: Hierarchical Tool Naming

```
mcellui_list_components     - List/browse
mcellui_search             - Find by query
mcellui_suggest_component  - AI-powered discovery
mcellui_get_component      - Read documentation
mcellui_get_component_source - Read implementation
mcellui_add_component      - Installation guide
mcellui_create_component   - Creation template
mcellui_customize_theme    - Theme guidance
mcellui_doctor            - Diagnostics
```

**Why:** Names form a mental model of capabilities. Agent can infer workflow progression.

### Pattern 5: Grouping in List Responses

```markdown
# Available mcellui Components

## Inputs
- **button** (stable): Press actions with variants
- **input** (stable): Text input with validation

## Layout
- **card** (stable): Container with header/footer
```

**Why:** Categorical organization helps LLM understand domain structure.

## Sources

- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Best Practices: Architecture & Implementation Guide](https://modelcontextprotocol.info/docs/best-practices/)
- [Block's Playbook for Designing MCP Servers](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers)
- [MCP Server Best Practices 2026](https://www.cdata.com/blog/mcp-server-best-practices-2026)
- [The Best MCP Servers for Developers in 2026](https://www.builder.io/blog/best-mcp-servers-2026)
- [Top 5 MCP Server Best Practices | Docker](https://www.docker.com/blog/mcp-server-best-practices/)
- [15 Best Practices for Building MCP Servers in Production](https://thenewstack.io/15-best-practices-for-building-mcp-servers-in-production/)
- [Defining Tool Schemas in MCP](https://apxml.com/courses/getting-started-model-context-protocol/chapter-3-implementing-tools-and-logic/tool-definition-schema)
- [JSON-RPC Protocol in MCP - Complete Guide](https://mcpcat.io/guides/understanding-json-rpc-protocol-mcp/)
- [MCP tool schema: what it is, how it works, and examples](https://www.merge.dev/blog/mcp-tool-schema)
- [Resources & Templates - FastMCP](https://gofastmcp.com/servers/resources)
- [Resources – Model Context Protocol](https://modelcontextprotocol.info/docs/concepts/resources/)
