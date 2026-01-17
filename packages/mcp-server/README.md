# @nativeui/mcp-server

Model Context Protocol (MCP) server for nativeui - enables AI assistants like Claude Code to help build React Native apps with nativeui components.

## Installation

```bash
npm install -g @nativeui/mcp-server
```

Or use directly in your MCP configuration.

## Configuration

### Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "nativeui": {
      "command": "npx",
      "args": ["@nativeui/mcp-server"]
    }
  }
}
```

### VS Code (Cline/Continue)

```json
{
  "mcpServers": {
    "nativeui": {
      "command": "npx",
      "args": ["@nativeui/mcp-server"]
    }
  }
}
```

## Available Tools

### `nativeui_list_components`

List all available components with optional filtering.

```typescript
{
  category?: string;  // "Inputs", "Layout", "Data Display", etc.
  type?: string;      // "ui", "block", "screen"
}
```

### `nativeui_get_component`

Get the full source code for a component.

```typescript
{
  name: string;  // "button", "card", "input"
}
```

### `nativeui_add_component`

Get CLI instructions to add a component.

```typescript
{
  name: string;  // Component name to add
}
```

### `nativeui_suggest_component`

Get AI-powered component suggestions based on what you want to build.

```typescript
{
  description: string;  // "a login form with email and password"
}
```

### `nativeui_create_component`

Get a guide and template for creating new custom components.

```typescript
{
  name: string;              // Component name
  template?: string;         // "basic", "animated", "pressable", "input"
  withForwardRef?: boolean;
}
```

### `nativeui_customize_theme`

Get guidance on customizing the nativeui theme.

```typescript
{
  aspect?: string;  // "colors", "radius", "fonts", "all"
  preset?: string;  // Theme preset as base
}
```

### `nativeui_doctor`

Check project setup and diagnose common issues.

```typescript
{
  projectPath?: string;  // Path to project root
}
```

### `nativeui_search`

Search components by name, description, or keywords.

```typescript
{
  query: string;  // Search query
}
```

## Available Resources

| URI | Description |
|-----|-------------|
| `nativeui://registry` | Full component registry as JSON |
| `nativeui://tokens` | Design tokens (colors, spacing, etc.) |
| `nativeui://docs/getting-started` | Getting started guide |
| `nativeui://docs/component-patterns` | Component patterns guide |
| `nativeui://docs/theme-customization` | Theme customization guide |
| `nativeui://docs/animation-patterns` | Animation patterns guide |
| `nativeui://docs/accessibility` | Accessibility guide |

## Usage Example

With Claude Code configured, you can ask:

- "What nativeui components are available for forms?"
- "Show me the source code for the Button component"
- "I need to build a login screen, what components should I use?"
- "How do I customize the theme colors?"
- "Create a new animated card component"

## Links

- [Documentation](https://mcellui.dev/docs/mcp)
- [CLI](https://www.npmjs.com/package/@nativeui/cli)
- [GitHub](https://github.com/metacells/nativeui)

## License

MIT
