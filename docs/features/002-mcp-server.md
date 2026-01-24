# Feature: MCP Server

Ein Model Context Protocol (MCP) Server ermöglicht Claude Code (und anderen AI Tools) native Integration mit der Component Library.

## Warum?

```
Ohne MCP:                          Mit MCP:
┌─────────────────────────┐       ┌─────────────────────────┐
│ User: "Add a button"    │       │ User: "Add a button"    │
│                         │       │                         │
│ Claude: *googelt*       │       │ Claude: *nutzt MCP*     │
│ Claude: *halluziniert*  │       │ → list_components()     │
│ Claude: *falscher Code* │       │ → view_component(button)│
│                         │       │ → add_component(button) │
│ 😤 Frustration          │       │ → validate_code(...)    │
│                         │       │                         │
│                         │       │ ✅ Perfekter Code       │
└─────────────────────────┘       └─────────────────────────┘
```

## Tools

### Registry Tools

```typescript
list_components: {
  description: 'List all available components in the registry',
  parameters: {
    type: { enum: ['ui', 'blocks', 'primitives', 'hooks', 'all'] },
    category: { type: 'string', optional: true },
  },
  // Returns: [{ name, type, description, dependencies }]
}

view_component: {
  description: 'View component details including source code, props, and examples',
  parameters: {
    name: { type: 'string' },
    include_source: { type: 'boolean', default: true },
    include_examples: { type: 'boolean', default: true },
  },
  // Returns: { name, description, props, source, examples, dependencies }
}

search_components: {
  description: 'Search components by name or description',
  parameters: {
    query: { type: 'string' },
    limit: { type: 'number', default: 10 },
  },
}

get_examples: {
  description: 'Get usage examples for a component',
  parameters: {
    component: { type: 'string' },
  },
  // Returns: [{ name, description, code }]
}
```

### Project Tools

```typescript
add_component: {
  description: 'Add a component to the current project',
  parameters: {
    name: { type: 'string' },
    path: { type: 'string', optional: true },
  },
  // Führt `npx mcellui add {name}` aus
  // Returns: { success, files_created, dependencies_installed }
}

init_project: {
  description: 'Initialize nativeui in the current project',
  parameters: {
    styling: { enum: ['nativewind', 'stylesheet', 'hybrid'] },
  },
}

get_project_config: {
  description: 'Get the current nativeui project configuration',
  // Liest mcellui.config.ts
}
```

### Validation Tools

```typescript
validate_code: {
  description: 'Validate component code for correct props, imports, and patterns',
  parameters: {
    code: { type: 'string' },
    component_type: { type: 'string', optional: true },
  },
  // Prüft: Imports, Props, Patterns
  // Returns: { valid, errors, warnings, suggestions }
}

introspect_types: {
  description: 'Get TypeScript types and props for components',
  parameters: {
    components: { type: 'array', items: { type: 'string' } },
  },
  // Returns TypeScript interfaces
}
```

### Theme Tools

```typescript
get_theme: {
  description: 'Get the current theme configuration and design tokens',
  // Returns: { colors, spacing, radius, shadows, typography }
}

update_theme: {
  description: 'Update a theme token value',
  parameters: {
    path: { type: 'string' }, // e.g., "colors.primary"
    value: { type: 'any' },
  },
}
```

## Resources

```typescript
// MCP Resources für direkten Zugriff
'nativeui://components'     // Component Registry
'nativeui://theme'          // Current Theme
'nativeui://docs/{topic}'   // Documentation
```

## Installation

```bash
# Global
npm install -g @nativeui/mcp-server

# In Claude Code (~/.claude/mcp.json)
{
  "mcpServers": {
    "nativeui": {
      "command": "nativeui-mcp",
      "args": ["--project", "/path/to/expo/app"]
    }
  }
}

# Projekt-lokal (.mcp.json)
{
  "mcpServers": {
    "nativeui": {
      "command": "npx",
      "args": ["@nativeui/mcp-server"]
    }
  }
}
```

## Workflow Beispiel

```
User: "Ich brauche einen Login Screen mit Email und Password"

Claude: *ruft list_components({ type: 'blocks' }) auf*
        → Findet "login-01", "login-02", etc.

Claude: *ruft view_component({ name: 'login-01' }) auf*
        → Sieht Source Code und Props

Claude: *ruft add_component({ name: 'login-01' }) auf*
        → Komponente wird installiert

Claude: *ruft validate_code({ code: customization }) auf*
        → Prüft Anpassungen

Claude: "Ich habe login-01 hinzugefügt und angepasst..."
```

## Implementation

```typescript
// packages/mcp-server/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'nativeui',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'list_components':
      return listComponents(request.params.arguments);
    case 'view_component':
      return viewComponent(request.params.arguments);
    // ...
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Tech Stack

- **@modelcontextprotocol/sdk** – MCP SDK
- **TypeScript** – Type Safety
- **Zod** – Schema Validation
