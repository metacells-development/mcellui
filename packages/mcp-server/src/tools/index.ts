import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types ---

interface RegistryItem {
  name: string;
  type: string;
  description: string;
  category: string;
  status: 'stable' | 'beta' | 'experimental';
  files: string[];
  dependencies?: string[];
  registryDependencies?: string[];
}

interface Registry {
  name: string;
  version: string;
  components: RegistryItem[];
}

// --- Registry Access ---

function getRegistryPath(): string {
  // packages/mcp-server/dist -> packages/registry
  return path.resolve(__dirname, '..', '..', 'registry');
}

function loadRegistry(): Registry | null {
  try {
    const registryPath = path.join(getRegistryPath(), 'registry.json');
    const data = fs.readFileSync(registryPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function loadComponentCode(item: RegistryItem): string | null {
  try {
    const registryPath = getRegistryPath();
    const file = item.files[0];
    if (!file) return null;
    const filePath = path.join(registryPath, file);
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// --- Tools Definition ---

export const tools: Tool[] = [
  {
    name: 'nativeui_list_components',
    description: 'List all available nativeui components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (optional): Inputs, Layout, Data Display, Feedback',
        },
      },
    },
  },
  {
    name: 'nativeui_get_component',
    description: 'Get the full source code for a specific component',
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
  },
  {
    name: 'nativeui_add_component',
    description: 'Get instructions to add a component to a project',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name to add',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'nativeui_suggest_component',
    description: 'Get component suggestions based on a description of what you want to build',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of what you want to build (e.g., "a form with email and password")',
        },
      },
      required: ['description'],
    },
  },
];

// --- Tool Handlers ---

export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const registry = loadRegistry();

  if (!registry) {
    return {
      content: [
        {
          type: 'text',
          text: 'Error: Could not load component registry.',
        },
      ],
    };
  }

  switch (name) {
    case 'nativeui_list_components': {
      const category = args?.category as string | undefined;
      let components = registry.components;

      if (category) {
        components = components.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Group by category
      const byCategory = new Map<string, RegistryItem[]>();
      for (const c of components) {
        if (!byCategory.has(c.category)) {
          byCategory.set(c.category, []);
        }
        byCategory.get(c.category)!.push(c);
      }

      let output = `# Available nativeui Components\n\n`;
      for (const [cat, items] of byCategory) {
        output += `## ${cat}\n\n`;
        for (const item of items) {
          output += `- **${item.name}** (${item.status}): ${item.description}\n`;
        }
        output += '\n';
      }

      output += `\nTotal: ${components.length} components`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_get_component': {
      const componentName = args?.name as string;
      const component = registry.components.find((c) => c.name === componentName);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.\n\nAvailable: ${registry.components.map((c) => c.name).join(', ')}`,
            },
          ],
        };
      }

      const code = loadComponentCode(component);
      if (!code) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Could not load source code for "${componentName}".`,
            },
          ],
        };
      }

      const output = `# ${component.name}

${component.description}

**Category:** ${component.category}
**Status:** ${component.status}
${component.dependencies?.length ? `**Dependencies:** ${component.dependencies.join(', ')}` : ''}

## Source Code

\`\`\`tsx
${code}
\`\`\`

## Usage

\`\`\`tsx
import { ${capitalize(component.name)} } from '@/components/ui/${component.name}';

<${capitalize(component.name)} />
\`\`\`
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_add_component': {
      const componentName = args?.name as string;
      const component = registry.components.find((c) => c.name === componentName);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.`,
            },
          ],
        };
      }

      let output = `# Add ${component.name}

Run this command:

\`\`\`bash
npx nativeui add ${component.name}
\`\`\`
`;

      if (component.dependencies?.length) {
        output += `
## Required Dependencies

\`\`\`bash
npx expo install ${component.dependencies.join(' ')}
\`\`\`
`;
      }

      if (component.registryDependencies?.length) {
        output += `
## Required Components

This component depends on: ${component.registryDependencies.join(', ')}

\`\`\`bash
npx nativeui add ${component.registryDependencies.join(' ')}
\`\`\`
`;
      }

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_suggest_component': {
      const description = (args?.description as string).toLowerCase();
      const suggestions: RegistryItem[] = [];

      const keywords: Record<string, string[]> = {
        button: ['button', 'click', 'tap', 'press', 'action', 'submit'],
        input: ['input', 'text', 'field', 'form', 'email', 'password', 'type'],
        card: ['card', 'container', 'box', 'panel', 'wrapper'],
        badge: ['badge', 'tag', 'label', 'status', 'indicator', 'count'],
        avatar: ['avatar', 'profile', 'user', 'photo', 'image', 'picture'],
      };

      for (const component of registry.components) {
        const componentKeywords = keywords[component.name] || [component.name];
        if (componentKeywords.some((kw) => description.includes(kw))) {
          suggestions.push(component);
        }
      }

      if (suggestions.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No specific component suggestions for "${description}".\n\nUse \`nativeui_list_components\` to see all available components.`,
            },
          ],
        };
      }

      let output = `# Suggested Components\n\nBased on: "${description}"\n\n`;
      for (const s of suggestions) {
        output += `## ${s.name}\n\n${s.description}\n\n`;
      }

      output += `\nAdd with: \`npx nativeui add ${suggestions.map((s) => s.name).join(' ')}\``;

      return { content: [{ type: 'text', text: output }] };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      };
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
