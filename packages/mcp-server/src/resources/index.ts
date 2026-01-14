import type { Resource } from '@modelcontextprotocol/sdk/types.js';

export const resources: Resource[] = [
  {
    uri: 'nativeui://registry',
    name: 'Component Registry',
    description: 'Full list of all nativeui components with metadata',
    mimeType: 'application/json',
  },
  {
    uri: 'nativeui://tokens',
    name: 'Design Tokens',
    description: 'Color, spacing, and typography tokens',
    mimeType: 'application/json',
  },
  {
    uri: 'nativeui://docs/getting-started',
    name: 'Getting Started Guide',
    description: 'How to set up nativeui in your project',
    mimeType: 'text/markdown',
  },
];

// Placeholder data
const REGISTRY_DATA = {
  components: [
    { name: 'button', category: 'Inputs', status: 'beta' },
    { name: 'input', category: 'Inputs', status: 'beta' },
    { name: 'card', category: 'Layout', status: 'beta' },
    { name: 'badge', category: 'Data Display', status: 'beta' },
    { name: 'avatar', category: 'Data Display', status: 'beta' },
    { name: 'switch', category: 'Inputs', status: 'experimental' },
    { name: 'checkbox', category: 'Inputs', status: 'experimental' },
    { name: 'skeleton', category: 'Feedback', status: 'experimental' },
  ],
  version: '0.0.1',
};

const TOKENS_DATA = {
  colors: {
    primary: '#3b82f6',
    neutral: { 50: '#fafafa', 900: '#171717' },
    success: '#22c55e',
    error: '#ef4444',
  },
  spacing: { 1: 4, 2: 8, 4: 16, 8: 32 },
  radius: { sm: 4, md: 8, lg: 16 },
};

const GETTING_STARTED_MD = `# Getting Started with nativeui

## Installation

\`\`\`bash
npx nativeui init
\`\`\`

## Adding Components

\`\`\`bash
npx nativeui add button
npx nativeui add card input
\`\`\`

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <Button onPress={() => console.log('pressed')}>
        Click me
      </Button>
    </Card>
  );
}
\`\`\`

## Philosophy

1. **Copy-Paste > npm install** - You own the code
2. **Works or doesn't exist** - Tested on iOS AND Android
3. **DX is everything** - 5 second setup
`;

export async function handleResourceRead(
  uri: string
): Promise<{ contents: Array<{ uri: string; text?: string; mimeType?: string }> }> {
  switch (uri) {
    case 'nativeui://registry':
      return {
        contents: [
          {
            uri,
            text: JSON.stringify(REGISTRY_DATA, null, 2),
            mimeType: 'application/json',
          },
        ],
      };

    case 'nativeui://tokens':
      return {
        contents: [
          {
            uri,
            text: JSON.stringify(TOKENS_DATA, null, 2),
            mimeType: 'application/json',
          },
        ],
      };

    case 'nativeui://docs/getting-started':
      return {
        contents: [
          {
            uri,
            text: GETTING_STARTED_MD,
            mimeType: 'text/markdown',
          },
        ],
      };

    default:
      return {
        contents: [
          {
            uri,
            text: `Resource not found: ${uri}`,
          },
        ],
      };
  }
}
