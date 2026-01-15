import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Registry Access ---

function getRegistryPath(): string {
  return path.resolve(__dirname, '..', '..', 'registry');
}

function getCorePath(): string {
  return path.resolve(__dirname, '..', '..', 'core', 'src');
}

// --- Resources Definition ---

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
    description: 'Color, spacing, typography, and other design tokens',
    mimeType: 'application/json',
  },
  {
    uri: 'nativeui://docs/getting-started',
    name: 'Getting Started Guide',
    description: 'How to set up nativeui in your project',
    mimeType: 'text/markdown',
  },
];

// --- Resource Handlers ---

export async function handleResourceRead(
  uri: string
): Promise<{ contents: Array<{ uri: string; text?: string; mimeType?: string }> }> {
  switch (uri) {
    case 'nativeui://registry': {
      try {
        const registryPath = path.join(getRegistryPath(), 'registry.json');
        const data = fs.readFileSync(registryPath, 'utf-8');
        return {
          contents: [{ uri, text: data, mimeType: 'application/json' }],
        };
      } catch {
        return {
          contents: [{ uri, text: '{"error": "Could not load registry"}' }],
        };
      }
    }

    case 'nativeui://tokens': {
      try {
        const tokens = loadTokens();
        return {
          contents: [
            { uri, text: JSON.stringify(tokens, null, 2), mimeType: 'application/json' },
          ],
        };
      } catch {
        return {
          contents: [{ uri, text: '{"error": "Could not load tokens"}' }],
        };
      }
    }

    case 'nativeui://docs/getting-started':
      return {
        contents: [
          { uri, text: GETTING_STARTED_MD, mimeType: 'text/markdown' },
        ],
      };

    default:
      return {
        contents: [{ uri, text: `Resource not found: ${uri}` }],
      };
  }
}

// --- Token Loading ---

function loadTokens(): Record<string, unknown> {
  const tokensPath = path.join(getCorePath(), 'tokens');
  const tokens: Record<string, unknown> = {};

  const files = ['colors', 'spacing', 'typography', 'radius', 'shadows'];

  for (const file of files) {
    try {
      const filePath = path.join(tokensPath, `${file}.ts`);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract exported object (simple parsing)
      const match = content.match(/export const \w+ = ({[\s\S]*?});/);
      if (match) {
        // Very basic parsing - just include the raw structure description
        tokens[file] = `See ${file}.ts for full token definitions`;
      }
    } catch {
      // Skip if file doesn't exist
    }
  }

  return tokens;
}

// --- Documentation ---

const GETTING_STARTED_MD = `# Getting Started with nativeui

A copy-paste component library for Expo/React Native.

## Quick Start

### 1. Initialize

\`\`\`bash
npx nativeui init
\`\`\`

This creates:
- \`nativeui.config.ts\` - Configuration file
- \`components/ui/\` - Component directory
- \`lib/utils/cn.ts\` - Style merge utility

### 2. Add Components

\`\`\`bash
npx nativeui add button
npx nativeui add card input badge
\`\`\`

### 3. Use Components

\`\`\`tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyScreen() {
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

## Available Commands

- \`npx nativeui init\` - Initialize project
- \`npx nativeui add <component>\` - Add component(s)
- \`npx nativeui list\` - List available components

## Platform Support

- iOS 15+ (optimized for iOS 17-18)
- Android 10+ (optimized for Android 13-14)
- Expo SDK 50+
- React Native 0.73+
`;
