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
  // packages/mcp-server/dist -> packages/registry
  return path.resolve(__dirname, '..', '..', 'registry');
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
    name: 'nativeui_list_components',
    description: 'List all available nativeui components with filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category: Inputs, Layout, Data Display, Feedback, Navigation, Mobile Patterns',
        },
        type: {
          type: 'string',
          description: 'Filter by type: ui, block, screen, primitive, hook',
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
    description: 'Get intelligent component suggestions based on what you want to build',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Describe what you want to build (e.g., "a login form with email and password")',
        },
      },
      required: ['description'],
    },
  },
  {
    name: 'nativeui_create_component',
    description: 'Get a guide and template for creating a new custom component',
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
        },
        withForwardRef: {
          type: 'boolean',
          description: 'Include forwardRef pattern for ref forwarding',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'nativeui_customize_theme',
    description: 'Get guidance on customizing the nativeui theme (colors, radius, fonts)',
    inputSchema: {
      type: 'object',
      properties: {
        aspect: {
          type: 'string',
          enum: ['colors', 'radius', 'fonts', 'all'],
          description: 'Which aspect of the theme to customize',
        },
        preset: {
          type: 'string',
          description: 'Theme preset to use as base: zinc, slate, stone, blue, green, rose, orange, violet',
        },
      },
    },
  },
  {
    name: 'nativeui_doctor',
    description: 'Check nativeui project setup and diagnose common issues',
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
    name: 'nativeui_search',
    description: 'Search components by name, description, or keywords',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
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
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const registry = await loadRegistry();

  if (!registry && !['nativeui_doctor', 'nativeui_create_component', 'nativeui_customize_theme'].includes(name)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Could not load component registry. Tried: ${REGISTRY_URL}/registry.json`,
        },
      ],
    };
  }

  switch (name) {
    case 'nativeui_list_components': {
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
      const component = registry!.components.find((c) => c.name === componentName);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Component "${componentName}" not found.\n\nAvailable: ${registry!.components.map((c) => c.name).join(', ')}`,
            },
          ],
        };
      }

      const code = await loadComponentCode(component);
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
import { ${toPascalCase(component.name)} } from '@/components/ui/${component.name}';

<${toPascalCase(component.name)} />
\`\`\`
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_add_component': {
      const componentName = args?.name as string;
      const component = registry!.components.find((c) => c.name === componentName);

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
      const topSuggestions = suggestions.slice(0, 8);

      if (topSuggestions.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No specific component suggestions for "${description}".\n\nTry being more specific or use \`nativeui_list_components\` to browse all available components.\n\n**Tip:** Mention specific UI elements like "button", "card", "form", "modal", "list", etc.`,
            },
          ],
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
      output += `\n---\n\n**Add all suggested components:**\n\n\`\`\`bash\nnpx nativeui add ${componentNames}\n\`\`\``;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_create_component': {
      const componentName = args?.name as string;
      const template = (args?.template as string) || 'basic';
      const withForwardRef = args?.withForwardRef as boolean || false;

      const pascalName = toPascalCase(componentName);
      const kebabName = toKebabCase(componentName);

      let output = `# Create Custom Component: ${pascalName}

## CLI Command

The easiest way to create a new component:

\`\`\`bash
npx nativeui create ${kebabName} --template ${template}${withForwardRef ? ' --forward-ref' : ''}
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
import { useTheme } from '@nativeui/core';

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

    case 'nativeui_customize_theme': {
      const aspect = (args?.aspect as string) || 'all';
      const preset = args?.preset as string;

      let output = `# Customize nativeui Theme\n\n`;

      if (aspect === 'all' || aspect === 'colors') {
        output += `## Color Customization

### Using Presets

Available presets: \`zinc\`, \`slate\`, \`stone\`, \`blue\`, \`green\`, \`rose\`, \`orange\`, \`violet\`

\`\`\`typescript
// nativeui.config.ts
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
// nativeui.config.ts
import { defineConfig } from '@nativeui/core';

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

    case 'nativeui_doctor': {
      const projectPath = args?.projectPath as string || process.cwd();

      let output = `# nativeui Doctor

Checking project at: \`${projectPath}\`

## Quick Check

Run the CLI doctor command for a full diagnostic:

\`\`\`bash
npx nativeui doctor
\`\`\`

## Common Issues & Fixes

### 1. "Project not initialized"

\`\`\`bash
npx nativeui init
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

- [ ] \`nativeui.config.ts\` exists
- [ ] \`components/ui/\` directory exists
- [ ] \`@nativeui/core\` installed
- [ ] \`react-native-reanimated\` installed
- [ ] \`react-native-gesture-handler\` installed
- [ ] Babel plugin configured
- [ ] TypeScript paths configured

## Need Help?

- Documentation: https://nativeui.dev
- GitHub Issues: https://github.com/your-repo/nativeui/issues
`;

      return { content: [{ type: 'text', text: output }] };
    }

    case 'nativeui_search': {
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
              text: `No components found matching "${query}".\n\nTry a different search term or use \`nativeui_list_components\` to see all.`,
            },
          ],
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
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      };
  }
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
