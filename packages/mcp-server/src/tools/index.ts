import { z } from 'zod';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  {
    name: 'nativeui_list_components',
    description: 'List all available nativeui components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (optional)',
        },
      },
    },
  },
  {
    name: 'nativeui_get_component',
    description: 'Get the source code and documentation for a specific component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name (e.g., "button", "card")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'nativeui_add_component',
    description: 'Add a component to the current project',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name to add',
        },
        path: {
          type: 'string',
          description: 'Target path (optional, uses config default)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'nativeui_validate_component',
    description: 'Validate a component for platform compatibility and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Component source code to validate',
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'nativeui_suggest_component',
    description: 'Get component suggestions based on a description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of what you want to build',
        },
      },
      required: ['description'],
    },
  },
];

// Placeholder registry data
const REGISTRY = [
  { name: 'button', category: 'Inputs', description: 'Pressable button with variants' },
  { name: 'input', category: 'Inputs', description: 'Text input with validation' },
  { name: 'card', category: 'Layout', description: 'Container with shadow' },
  { name: 'badge', category: 'Data Display', description: 'Small status indicator' },
  { name: 'avatar', category: 'Data Display', description: 'Profile picture' },
  { name: 'switch', category: 'Inputs', description: 'Toggle switch' },
  { name: 'checkbox', category: 'Inputs', description: 'Selectable checkbox' },
  { name: 'skeleton', category: 'Feedback', description: 'Loading placeholder' },
];

export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'nativeui_list_components': {
      const category = args?.category as string | undefined;
      let components = REGISTRY;

      if (category) {
        components = components.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      const list = components
        .map((c) => `- ${c.name}: ${c.description} [${c.category}]`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Available components:\n\n${list}`,
          },
        ],
      };
    }

    case 'nativeui_get_component': {
      const componentName = args?.name as string;
      const component = REGISTRY.find((c) => c.name === componentName);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found. Use nativeui_list_components to see available components.`,
            },
          ],
        };
      }

      // In production, would return actual component code
      return {
        content: [
          {
            type: 'text',
            text: `# ${component.name}\n\n${component.description}\n\nCategory: ${component.category}\n\n## Usage\n\n\`\`\`tsx\nimport { ${component.name.charAt(0).toUpperCase() + component.name.slice(1)} } from '@/components/ui/${component.name}';\n\n<${component.name.charAt(0).toUpperCase() + component.name.slice(1)} />\n\`\`\``,
          },
        ],
      };
    }

    case 'nativeui_add_component': {
      const componentName = args?.name as string;
      const component = REGISTRY.find((c) => c.name === componentName);

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

      return {
        content: [
          {
            type: 'text',
            text: `To add ${component.name}, run:\n\nnpx nativeui add ${component.name}\n\nOr use the CLI to add it to your project.`,
          },
        ],
      };
    }

    case 'nativeui_validate_component': {
      const code = args?.code as string;

      // Basic validation checks
      const issues: string[] = [];

      if (!code.includes('accessible')) {
        issues.push('- Consider adding accessibility props (accessible, accessibilityLabel)');
      }

      if (code.includes('any')) {
        issues.push('- Avoid using `any` type, use proper TypeScript types');
      }

      if (!code.includes('StyleSheet')) {
        issues.push('- Consider using StyleSheet.create for better performance');
      }

      if (code.includes('color:') && !code.includes('Platform')) {
        issues.push('- Consider checking platform-specific color support');
      }

      if (issues.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Component looks good! No issues found.',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Validation complete. Suggestions:\n\n${issues.join('\n')}`,
          },
        ],
      };
    }

    case 'nativeui_suggest_component': {
      const description = (args?.description as string).toLowerCase();
      const suggestions: string[] = [];

      if (description.includes('button') || description.includes('click') || description.includes('tap')) {
        suggestions.push('button');
      }
      if (description.includes('input') || description.includes('text') || description.includes('form')) {
        suggestions.push('input');
      }
      if (description.includes('card') || description.includes('container') || description.includes('box')) {
        suggestions.push('card');
      }
      if (description.includes('avatar') || description.includes('profile') || description.includes('user')) {
        suggestions.push('avatar');
      }
      if (description.includes('switch') || description.includes('toggle')) {
        suggestions.push('switch');
      }
      if (description.includes('loading') || description.includes('skeleton')) {
        suggestions.push('skeleton');
      }

      if (suggestions.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No specific component suggestions. Try describing your use case more specifically, or use nativeui_list_components to browse all available components.',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Based on your description, consider these components:\n\n${suggestions.map((s) => `- ${s}`).join('\n')}\n\nUse nativeui_get_component to see details for any of these.`,
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
}
