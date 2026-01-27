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

// --- Registry Configuration ---

/**
 * Remote registry URL (same as CLI)
 */
const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/metacells-development/mcellui/main/packages/registry';
const REGISTRY_URL = process.env.MCELLUI_REGISTRY_URL || process.env.NATIVEUI_REGISTRY_URL || DEFAULT_REGISTRY_URL;

// Cache for registry and component code
let registryCache: Registry | null = null;
const componentCodeCache = new Map<string, string>();

// --- Registry Access ---

function getRegistryPath(): string {
  // When running from npm package, registry is bundled in the package
  // When running locally in monorepo, it's in the sibling directory
  const bundledPath = path.resolve(__dirname, '..', 'registry');
  const monorepoPath = path.resolve(__dirname, '..', '..', 'registry');

  // Check if bundled registry exists (npm install scenario)
  if (fs.existsSync(path.join(bundledPath, 'registry.json'))) {
    return bundledPath;
  }
  // Fallback to monorepo path (local development)
  return monorepoPath;
}

function isLocalMode(): boolean {
  const localPath = getRegistryPath();
  try {
    return fs.existsSync(path.join(localPath, 'registry.json'));
  } catch {
    return false;
  }
}

function loadLocalRegistry(): Registry | null {
  try {
    const registryPath = path.join(getRegistryPath(), 'registry.json');
    const data = fs.readFileSync(registryPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function loadRemoteRegistry(): Promise<Registry | null> {
  try {
    const response = await fetch(`${REGISTRY_URL}/registry.json`);
    if (!response.ok) return null;
    return (await response.json()) as Registry;
  } catch {
    return null;
  }
}

async function loadRegistry(): Promise<Registry | null> {
  // Return cached if available
  if (registryCache) return registryCache;

  // Try local first
  if (isLocalMode()) {
    registryCache = loadLocalRegistry();
    if (registryCache) return registryCache;
  }

  // Fall back to remote
  registryCache = await loadRemoteRegistry();
  return registryCache;
}

function loadLocalComponentCode(item: RegistryItem): string | null {
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

async function loadRemoteComponentCode(item: RegistryItem): Promise<string | null> {
  try {
    const file = item.files[0];
    if (!file) return null;
    const response = await fetch(`${REGISTRY_URL}/${file}`);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function loadComponentCode(item: RegistryItem): Promise<string | null> {
  // Check cache
  if (componentCodeCache.has(item.name)) {
    return componentCodeCache.get(item.name)!;
  }

  let code: string | null = null;

  // Try local first
  if (isLocalMode()) {
    code = loadLocalComponentCode(item);
  }

  // Fall back to remote
  if (!code) {
    code = await loadRemoteComponentCode(item);
  }

  // Cache the result
  if (code) {
    componentCodeCache.set(item.name, code);
  }

  return code;
}

// --- Tools Definition ---

export const tools: Tool[] = [
  {
    name: 'mcellui_list_components',
    description: 'List all available mcellui components grouped by category. Use this when you need to browse or discover components. Returns names, descriptions, and status for each component.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., "Inputs", "Feedback", "Navigation")',
          default: undefined,
        },
        type: {
          type: 'string',
          description: 'Filter by type (e.g., "ui", "block", "screen")',
          default: undefined,
        },
      },
    },
  },
  {
    name: 'mcellui_get_component',
    description: 'Get concise documentation for a component. Use this when you want to understand a component. Returns description, props table, usage example, and installation command.',
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
    name: 'mcellui_get_component_source',
    description: 'Get the full TypeScript source code for a component. Use this when you need to see the complete implementation, modify it, or understand internal logic.',
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
    name: 'mcellui_add_component',
    description: 'Get installation instructions for a component: CLI command, peer dependencies, and required components. Use this when you need to add a component to a project.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name to add (e.g., "button", "dialog", "form")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'mcellui_suggest_component',
    description: 'Get ranked component suggestions based on a natural language description of what you want to build. Use this when the user describes a UI need but doesn\'t name specific components.',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Describe what you want to build (e.g., "a login form with email and password")',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum suggestions to return (default: 5, max: 10)',
          default: 5,
          minimum: 1,
          maximum: 10,
        },
      },
      required: ['description'],
    },
  },
  {
    name: 'mcellui_create_component',
    description: 'Get a starter template and guide for creating a new custom component. Use this when building a component that doesn\'t exist in the registry.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the new component (e.g., "MyButton", "custom-card")',
        },
        template: {
          type: 'string',
          enum: ['basic', 'animated', 'pressable', 'input'],
          description: 'Template type: basic (simple view), animated (with Reanimated), pressable (touchable), input (form field)',
          default: 'basic',
        },
        withForwardRef: {
          type: 'boolean',
          description: 'Include forwardRef pattern for ref forwarding',
          default: false,
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'mcellui_customize_theme',
    description: 'Get guidance on customizing the mcellui theme: colors, radius, fonts, or all aspects. Use this when the user wants to change the visual style of their app.',
    inputSchema: {
      type: 'object',
      properties: {
        aspect: {
          type: 'string',
          enum: ['colors', 'radius', 'fonts', 'all'],
          description: 'Which aspect of the theme to customize',
          default: 'all',
        },
        preset: {
          type: 'string',
          description: 'Theme preset to use as base (e.g., "blue", "violet", "zinc")',
        },
      },
    },
  },
  {
    name: 'mcellui_doctor',
    description: 'Diagnose common mcellui project setup issues: missing config, dependencies, babel plugins. Use this when components don\'t render or the project won\'t start.',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path to the project root (optional, defaults to current directory)',
        },
      },
    },
  },
  {
    name: 'mcellui_search',
    description: 'Search components by name, description, or category keyword. Use this when you know a keyword but not the exact component name. For browsing all components, use mcellui_list_components instead.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "modal", "form", "loading")',
        },
      },
      required: ['query'],
    },
  },
];

// --- Comprehensive Keyword Map ---

const componentKeywords: Record<string, string[]> = {
  // Inputs
  button: ['button', 'click', 'tap', 'press', 'action', 'submit', 'cta', 'trigger'],
  input: ['input', 'text', 'field', 'form', 'email', 'password', 'type', 'textfield', 'textbox'],
  textarea: ['textarea', 'multiline', 'comment', 'message', 'description', 'notes', 'long text'],
  checkbox: ['checkbox', 'check', 'toggle', 'select', 'tick', 'agree', 'terms'],
  switch: ['switch', 'toggle', 'on/off', 'enable', 'disable', 'setting'],
  'radio-group': ['radio', 'choice', 'option', 'select one', 'single choice'],
  select: ['select', 'dropdown', 'picker', 'choose', 'menu', 'options'],
  slider: ['slider', 'range', 'volume', 'brightness', 'progress', 'value'],
  stepper: ['stepper', 'counter', 'increment', 'decrement', 'quantity', 'number'],
  form: ['form', 'validation', 'submit', 'react-hook-form', 'zod'],

  // Data Display
  card: ['card', 'container', 'box', 'panel', 'wrapper', 'tile', 'content'],
  badge: ['badge', 'tag', 'label', 'status', 'indicator', 'count', 'notification'],
  avatar: ['avatar', 'profile', 'user', 'photo', 'image', 'picture', 'initials'],
  'avatar-stack': ['avatar stack', 'multiple users', 'group', 'team'],
  label: ['label', 'text', 'caption', 'title'],
  separator: ['separator', 'divider', 'line', 'hr'],
  skeleton: ['skeleton', 'loading', 'placeholder', 'shimmer'],
  spinner: ['spinner', 'loading', 'activity', 'progress', 'wait'],
  progress: ['progress', 'bar', 'loading', 'percentage', 'completion'],
  list: ['list', 'items', 'rows', 'collection'],
  chip: ['chip', 'tag', 'filter', 'selection'],

  // Feedback & Overlays
  dialog: ['dialog', 'modal', 'popup', 'alert', 'confirm', 'overlay'],
  sheet: ['sheet', 'bottom sheet', 'drawer', 'panel', 'modal'],
  'alert-dialog': ['alert', 'confirm', 'warning', 'error', 'dialog', 'confirmation'],
  'action-sheet': ['action sheet', 'actions', 'options', 'menu'],
  toast: ['toast', 'notification', 'snackbar', 'message', 'alert', 'feedback'],
  tooltip: ['tooltip', 'hint', 'help', 'info', 'hover'],

  // Navigation
  tabs: ['tabs', 'navigation', 'sections', 'pages', 'switch'],
  accordion: ['accordion', 'collapse', 'expand', 'faq', 'sections'],
  'segmented-control': ['segmented', 'control', 'toggle', 'switch', 'tabs'],

  // Mobile Patterns
  'pull-to-refresh': ['pull', 'refresh', 'reload', 'update', 'swipe down'],
  'swipeable-row': ['swipe', 'delete', 'archive', 'actions', 'gesture'],
  carousel: ['carousel', 'slider', 'gallery', 'swipe', 'images'],
  stories: ['stories', 'instagram', 'snapchat', 'circles'],

  // Extended
  'search-input': ['search', 'find', 'query', 'filter'],
  'datetime-picker': ['date', 'time', 'picker', 'calendar', 'schedule'],
  rating: ['rating', 'stars', 'review', 'score'],
  fab: ['fab', 'floating', 'action button', 'plus'],
  'icon-button': ['icon button', 'icon', 'action'],
  image: ['image', 'picture', 'photo', 'media'],
  'image-gallery': ['gallery', 'images', 'photos', 'grid'],

  // Blocks
  'login-block': ['login', 'sign in', 'authentication', 'auth'],
  'signup-block': ['signup', 'register', 'sign up', 'create account'],
  'profile-block': ['profile', 'user info', 'account'],
  'settings-list-block': ['settings', 'preferences', 'options', 'config'],
  'empty-state-block': ['empty', 'no data', 'no results', 'placeholder'],
  'error-state-block': ['error', 'failed', 'something wrong', 'retry'],

  // Screens
  'login-screen': ['login screen', 'login page', 'sign in screen'],
  'signup-screen': ['signup screen', 'registration', 'sign up page'],
  'profile-screen': ['profile screen', 'user profile', 'account page'],
  'settings-screen': ['settings screen', 'preferences page'],
  'chat-screen': ['chat', 'messaging', 'conversation'],
  'notifications-screen': ['notifications', 'alerts', 'inbox'],
  'feed-screen': ['feed', 'timeline', 'posts', 'social'],
  'search-screen': ['search screen', 'search page', 'find'],
  'onboarding-screen': ['onboarding', 'intro', 'welcome', 'tutorial'],
};

// --- Tool Handlers ---

export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    const registry = await loadRegistry();

    if (!registry && !['mcellui_doctor', 'mcellui_create_component', 'mcellui_customize_theme'].includes(name)) {
      return {
        content: [
          {
            type: 'text',
            text: `Could not load component registry.\n\nPossible causes:\n- Network connection issue\n- Registry URL unreachable: ${REGISTRY_URL}\n\nNext step: Check internet connection and retry. If running locally, ensure the registry directory exists.`,
          },
        ],
        isError: true,
      };
    }

  switch (name) {
    case 'mcellui_list_components': {
      const category = args?.category as string | undefined;
      const type = args?.type as string | undefined;
      let components = registry!.components;

      if (category) {
        components = components.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (type) {
        components = components.filter(
          (c) => c.type.toLowerCase() === type.toLowerCase()
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

      let output = `# Available mcellui Components\n\n`;
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

    case 'mcellui_get_component': {
      const componentName = args?.name as string;
      const component = registry!.components.find((c) => c.name === componentName);

      if (!component) {
        const names = registry!.components.map((c) => c.name).join(', ');
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.\n\nAvailable: ${names}\n\nNext step: Use mcellui_list_components to browse all components, or mcellui_search to find by keyword.`,
            },
          ],
          isError: true,
        };
      }

      const code = await loadComponentCode(component);
      if (!code) {
        return {
          content: [
            {
              type: 'text',
              text: `Could not load documentation for "${componentName}".\n\nNext step: Try mcellui_get_component_source if documentation failed, or vice versa.`,
            },
          ],
          isError: true,
        };
      }

      // Parse and return concise documentation instead of full source code
      const docs = parseComponentDocs(code);
      const output = formatComponentDocs(component, docs);

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_get_component_source': {
      const componentName = args?.name as string;
      const component = registry!.components.find((c) => c.name === componentName);

      if (!component) {
        const names = registry!.components.map((c) => c.name).join(', ');
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.\n\nAvailable: ${names}\n\nNext step: Use mcellui_list_components to browse all components, or mcellui_search to find by keyword.`,
            },
          ],
          isError: true,
        };
      }

      const code = await loadComponentCode(component);
      if (!code) {
        return {
          content: [
            {
              type: 'text',
              text: `Could not load source code for "${componentName}".\n\nNext step: Try mcellui_get_component_source if documentation failed, or vice versa.`,
            },
          ],
          isError: true,
        };
      }

      const output = `# ${toPascalCase(component.name)} - Source Code

\`\`\`tsx
${code}
\`\`\`
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_add_component': {
      const componentName = args?.name as string;
      const component = registry!.components.find((c) => c.name === componentName);

      if (!component) {
        const names = registry!.components.map((c) => c.name).join(', ');
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.\n\nAvailable: ${names}\n\nNext step: Use mcellui_list_components to browse all components, or mcellui_search to find by keyword.`,
            },
          ],
          isError: true,
        };
      }

      let output = `# Add ${component.name}

Run this command:

\`\`\`bash
npx @metacells/mcellui-cli add ${component.name}
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
npx @metacells/mcellui-cli add ${component.registryDependencies.join(' ')}
\`\`\`
`;
      }

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_suggest_component': {
      const description = (args?.description as string).toLowerCase();
      const maxResults = Math.min(Math.max((args?.maxResults as number) || 5, 1), 10);
      const suggestions: Array<{ component: RegistryItem; score: number; matchedKeywords: string[] }> = [];

      for (const component of registry!.components) {
        const keywords = componentKeywords[component.name] || [component.name];
        const matchedKeywords: string[] = [];
        let score = 0;

        // Check keywords
        for (const kw of keywords) {
          if (description.includes(kw.toLowerCase())) {
            matchedKeywords.push(kw);
            score += 10;
          }
        }

        // Check description match
        const descWords = component.description.toLowerCase().split(/\s+/);
        for (const word of descWords) {
          if (word.length > 3 && description.includes(word)) {
            score += 2;
          }
        }

        // Check name match
        if (description.includes(component.name.replace(/-/g, ' '))) {
          score += 15;
        }

        if (score > 0) {
          suggestions.push({ component, score, matchedKeywords });
        }
      }

      // Sort by score
      suggestions.sort((a, b) => b.score - a.score);
      const topSuggestions = suggestions.slice(0, maxResults);

      if (topSuggestions.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No specific component suggestions for "${description}".\n\nTry being more specific or use \`mcellui_list_components\` to browse all available components.\n\n**Tip:** Mention specific UI elements like "button", "card", "form", "modal", "list", etc.`,
            },
          ],
          isError: true,
        };
      }

      let output = `# Suggested Components\n\nBased on: "${description}"\n\n`;

      for (const { component, matchedKeywords } of topSuggestions) {
        output += `## ${component.name}\n\n`;
        output += `${component.description}\n`;
        output += `- **Type:** ${component.type}\n`;
        output += `- **Category:** ${component.category}\n`;
        if (matchedKeywords.length > 0) {
          output += `- **Matched:** ${matchedKeywords.join(', ')}\n`;
        }
        output += '\n';
      }

      const componentNames = topSuggestions.map(s => s.component.name).join(' ');
      output += `\n---\n\n**Add all suggested components:**\n\n\`\`\`bash\nnpx @metacells/mcellui-cli add ${componentNames}\n\`\`\``;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_create_component': {
      const componentName = args?.name as string;
      const template = (args?.template as string) || 'basic';
      const withForwardRef = args?.withForwardRef as boolean || false;

      const pascalName = toPascalCase(componentName);
      const kebabName = toKebabCase(componentName);

      let output = `# Create Custom Component: ${pascalName}

## CLI Command

The easiest way to create a new component:

\`\`\`bash
npx @metacells/mcellui-cli create ${kebabName} --template ${template}${withForwardRef ? ' --forward-ref' : ''}
\`\`\`

This creates \`components/ui/${kebabName}.tsx\` with the ${template} template.

## Available Templates

| Template | Description |
|----------|-------------|
| **basic** | Simple View-based component with useTheme |
| **animated** | Includes Reanimated animations |
| **pressable** | Touchable with press animations |
| **input** | Form input with label, error, and focus states |

## Component Structure

Your component should follow this structure:

\`\`\`tsx
import React${withForwardRef ? ', { forwardRef }' : ''} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

export interface ${pascalName}Props {
  // Define your props here
  title?: string;
}

${withForwardRef ? `export const ${pascalName} = forwardRef<View, ${pascalName}Props>(
  ({ title, ...props }, ref) => {` : `export function ${pascalName}({ title, ...props }: ${pascalName}Props) {`}
    const { colors, spacing, radius } = useTheme();

    return (
      <View
        ${withForwardRef ? 'ref={ref}' : ''}
        style={[
          styles.container,
          { backgroundColor: colors.card, borderRadius: radius.md }
        ]}
        {...props}
      >
        {title && <Text style={{ color: colors.foreground }}>{title}</Text>}
      </View>
    );
${withForwardRef ? `  }
);

${pascalName}.displayName = '${pascalName}';` : '}'}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
\`\`\`

## Best Practices

1. **Use useTheme()** - Access colors, spacing, radius from theme
2. **TypeScript Props** - Define a Props interface
3. **StyleSheet** - Use StyleSheet.create for styles
4. **Spread props** - Allow customization via \`{...props}\`
5. **Accessibility** - Add accessibilityLabel, accessibilityRole
6. **Dark Mode** - Use theme colors, not hardcoded values

## Theme Integration

Available from \`useTheme()\`:

\`\`\`typescript
const {
  colors,      // background, foreground, primary, etc.
  spacing,     // 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
  radius,      // none, sm, md, lg, full
  typography,  // fontSize, lineHeight, fontWeight
  isDark       // boolean for dark mode detection
} = useTheme();
\`\`\`
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_customize_theme': {
      const aspect = (args?.aspect as string) || 'all';
      const preset = args?.preset as string;

      let output = `# Customize mcellui Theme\n\n`;

      if (aspect === 'all' || aspect === 'colors') {
        output += `## Color Customization

### Using Presets

Available presets: \`zinc\`, \`slate\`, \`stone\`, \`blue\`, \`green\`, \`rose\`, \`orange\`, \`violet\`

\`\`\`typescript
// mcellui.config.ts
export default defineConfig({
  theme: '${preset || 'blue'}',
});
\`\`\`

### Custom Colors

Override specific colors:

\`\`\`typescript
export default defineConfig({
  theme: 'zinc',
  colors: {
    primary: '#6366F1',      // Custom primary
    secondary: '#EC4899',    // Custom secondary
  },
  lightColors: {
    background: '#FFFFFF',   // Light mode only
    foreground: '#18181B',
  },
  darkColors: {
    background: '#09090B',   // Dark mode only
    foreground: '#FAFAFA',
  },
});
\`\`\`

### Available Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| \`background\` | White | Near black | App background |
| \`foreground\` | Near black | White | Primary text |
| \`card\` | White | Dark gray | Card backgrounds |
| \`primary\` | Theme color | Theme color | Primary actions |
| \`secondary\` | Muted | Muted | Secondary actions |
| \`muted\` | Light gray | Dark gray | Disabled states |
| \`destructive\` | Red | Red | Delete actions |
| \`border\` | Light gray | Dark gray | Borders |

`;
      }

      if (aspect === 'all' || aspect === 'radius') {
        output += `## Border Radius

### Presets

\`\`\`typescript
export default defineConfig({
  radius: 'md',  // none | sm | md | lg | full
});
\`\`\`

| Preset | Value | Visual |
|--------|-------|--------|
| \`none\` | 0 | Sharp corners |
| \`sm\` | 4px | Subtle rounding |
| \`md\` | 8px | Balanced (default) |
| \`lg\` | 12px | More rounded |
| \`full\` | 9999px | Pill/circle |

`;
      }

      if (aspect === 'all' || aspect === 'fonts') {
        output += `## Typography

### Custom Fonts

\`\`\`typescript
export default defineConfig({
  fonts: {
    sans: 'Inter',           // Body text
    heading: 'Inter-Bold',   // Headings
    mono: 'JetBrainsMono',   // Code
  },
});
\`\`\`

### Font Loading with Expo

\`\`\`typescript
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

function App() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) return <Splash />;

  return <ThemeProvider><App /></ThemeProvider>;
}
\`\`\`

`;
      }

      output += `## Full Config Example

\`\`\`typescript
// mcellui.config.ts
import { defineConfig } from '@metacells/mcellui-core';

export default defineConfig({
  // Theme preset
  theme: '${preset || 'blue'}',

  // Border radius
  radius: 'md',

  // Color scheme
  colorScheme: 'system',  // 'light' | 'dark' | 'system'

  // Custom colors
  colors: {
    primary: '#6366F1',
  },

  // Fonts
  fonts: {
    sans: 'Inter',
    heading: 'Inter-Bold',
  },

  // Haptic feedback
  haptics: true,

  // Animation preset
  animationPreset: 'subtle',  // 'subtle' | 'playful'

  // Component defaults
  components: {
    button: { defaultVariant: 'default', defaultSize: 'md' },
    input: { defaultSize: 'md' },
    card: { defaultVariant: 'default' },
  },

  // CLI paths
  componentsPath: './components/ui',
  utilsPath: './lib/utils',
});
\`\`\`
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_doctor': {
      const projectPath = args?.projectPath as string || process.cwd();

      let output = `# mcellui Doctor

Checking project at: \`${projectPath}\`

## Quick Check

Run the CLI doctor command for a full diagnostic:

\`\`\`bash
npx @metacells/mcellui-cli doctor
\`\`\`

## Common Issues & Fixes

### 1. "Project not initialized"

\`\`\`bash
npx @metacells/mcellui-cli init
\`\`\`

### 2. Missing dependencies

\`\`\`bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-safe-area-context
\`\`\`

### 3. Babel config missing Reanimated plugin

Add to \`babel.config.js\`:

\`\`\`javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],  // Must be last
  };
};
\`\`\`

### 4. Metro config for Reanimated

Clear cache after babel changes:

\`\`\`bash
npx expo start --clear
\`\`\`

### 5. TypeScript path aliases not working

Check \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
\`\`\`

## Checklist

- [ ] \`mcellui.config.ts\` exists
- [ ] \`components/ui/\` directory exists
- [ ] \`@metacells/mcellui-core\` installed
- [ ] \`react-native-reanimated\` installed
- [ ] \`react-native-gesture-handler\` installed
- [ ] Babel plugin configured
- [ ] TypeScript paths configured

## Need Help?

- Documentation: https://mcellui.dev
- GitHub Issues: https://github.com/metacells/mcellui/issues
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'mcellui_search': {
      const query = (args?.query as string).toLowerCase();
      const results: RegistryItem[] = [];

      for (const component of registry!.components) {
        const nameMatch = component.name.toLowerCase().includes(query);
        const descMatch = component.description.toLowerCase().includes(query);
        const categoryMatch = component.category.toLowerCase().includes(query);

        if (nameMatch || descMatch || categoryMatch) {
          results.push(component);
        }
      }

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No components found matching "${query}".\n\nTry a different search term or use \`mcellui_list_components\` to see all.`,
            },
          ],
          isError: true,
        };
      }

      let output = `# Search Results for "${query}"\n\nFound ${results.length} component(s):\n\n`;

      for (const item of results) {
        output += `## ${item.name}\n\n`;
        output += `${item.description}\n`;
        output += `- **Type:** ${item.type}\n`;
        output += `- **Category:** ${item.category}\n`;
        output += `- **Status:** ${item.status}\n\n`;
      }

      return { content: [{ type: 'text', text: output }] };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: "${name}".\n\nAvailable tools: mcellui_list_components, mcellui_get_component, mcellui_get_component_source, mcellui_add_component, mcellui_suggest_component, mcellui_create_component, mcellui_customize_theme, mcellui_doctor, mcellui_search` }],
        isError: true,
      };
  }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nNext step: Report this issue or retry the tool call.`,
      }],
      isError: true,
    };
  }
}

// --- Component Documentation Parser ---

interface ParsedProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface ParsedDocs {
  description: string;
  example: string;
  props: ParsedProp[];
  exports: string[];
}

/**
 * Parse component documentation from source code.
 * Extracts description, @example, and props interface.
 */
function parseComponentDocs(code: string): ParsedDocs {
  const result: ParsedDocs = {
    description: '',
    example: '',
    props: [],
    exports: [],
  };

  // Extract main docblock description and example
  const docblockMatch = code.match(/\/\*\*\s*\n([\s\S]*?)\*\//);
  if (docblockMatch) {
    const docblock = docblockMatch[1];

    // Extract description (lines before @example)
    const descLines: string[] = [];
    const lines = docblock.split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^\s*\*\s?/, '').trim();
      if (cleaned.startsWith('@example')) break;
      if (cleaned) descLines.push(cleaned);
    }
    result.description = descLines.join(' ').trim();

    // Extract @example code block
    const exampleMatch = docblock.match(/@example\s*\n\s*\*\s*```tsx?\s*\n([\s\S]*?)```/);
    if (exampleMatch) {
      result.example = exampleMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .join('\n')
        .trim();
    }
  }

  // Extract all exported interface/type props
  const propsInterfaces = code.matchAll(/export\s+(?:interface|type)\s+(\w+Props)\s*(?:=\s*)?{([^}]+)}/g);
  for (const match of propsInterfaces) {
    const interfaceName = match[1];
    const propsBody = match[2];

    // Parse individual props with JSDoc comments
    const propPattern = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?([\w]+)(\?)?:\s*([^;]+);/g;
    let propMatch;
    while ((propMatch = propPattern.exec(propsBody)) !== null) {
      const [, docComment, propName, optional, propType] = propMatch;
      result.props.push({
        name: propName,
        type: propType.trim(),
        required: !optional,
        description: docComment?.replace(/\s+/g, ' ').trim() || '',
      });
    }
  }

  // Extract exported function/component names
  const exportMatches = code.matchAll(/export\s+(?:function|const)\s+(\w+)/g);
  for (const match of exportMatches) {
    result.exports.push(match[1]);
  }

  // Extract exported types/interfaces
  const typeExports = code.matchAll(/export\s+(?:type|interface)\s+(\w+)/g);
  for (const match of typeExports) {
    result.exports.push(match[1]);
  }

  return result;
}

/**
 * Format parsed docs as concise markdown documentation.
 */
function formatComponentDocs(
  component: RegistryItem,
  docs: ParsedDocs
): string {
  const pascalName = toPascalCase(component.name);

  let output = `# ${pascalName}\n\n`;
  output += `${docs.description || component.description}\n\n`;

  // Metadata
  output += `**Category:** ${component.category} · **Status:** ${component.status}\n\n`;

  // Installation
  output += `## Installation\n\n`;
  output += `\`\`\`bash\nnpx @metacells/mcellui-cli add ${component.name}\n\`\`\`\n\n`;

  if (component.dependencies?.length) {
    output += `**Peer Dependencies:** ${component.dependencies.join(', ')}\n\n`;
  }

  if (component.registryDependencies?.length) {
    output += `**Required Components:** ${component.registryDependencies.join(', ')}\n\n`;
  }

  // Example
  if (docs.example) {
    output += `## Example\n\n`;
    output += `\`\`\`tsx\n${docs.example}\n\`\`\`\n\n`;
  }

  // Props table
  if (docs.props.length > 0) {
    output += `## Props\n\n`;
    output += `| Prop | Type | Required | Description |\n`;
    output += `|------|------|----------|-------------|\n`;
    for (const prop of docs.props) {
      const typeStr = prop.type.length > 40 ? prop.type.slice(0, 37) + '...' : prop.type;
      output += `| \`${prop.name}\` | \`${typeStr}\` | ${prop.required ? '✓' : ''} | ${prop.description} |\n`;
    }
    output += '\n';
  }

  // Exports
  if (docs.exports.length > 0) {
    output += `## Exports\n\n`;
    output += `\`\`\`tsx\nimport { ${docs.exports.join(', ')} } from '@/components/ui/${component.name}';\n\`\`\`\n`;
  }

  return output;
}

// --- Utility Functions ---

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
