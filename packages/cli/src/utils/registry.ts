/**
 * Registry utilities
 *
 * Fetches component data from the registry.
 * In development, reads from local registry.
 * In production, would fetch from CDN/API.
 */

export interface RegistryItem {
  name: string;
  description: string;
  category: string;
  status: 'stable' | 'beta' | 'experimental';
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: string[];
}

export interface ComponentData {
  name: string;
  code: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
}

// Placeholder registry data
// In production, this would be fetched from CDN or generated from registry/
const REGISTRY: RegistryItem[] = [
  {
    name: 'button',
    description: 'A pressable button component with variants',
    category: 'Inputs',
    status: 'beta',
    dependencies: [],
    files: ['button.tsx'],
  },
  {
    name: 'input',
    description: 'Text input with label and error states',
    category: 'Inputs',
    status: 'beta',
    dependencies: [],
    files: ['input.tsx'],
  },
  {
    name: 'card',
    description: 'A container with rounded corners and shadow',
    category: 'Layout',
    status: 'beta',
    dependencies: [],
    files: ['card.tsx'],
  },
  {
    name: 'badge',
    description: 'Small status indicator',
    category: 'Data Display',
    status: 'beta',
    dependencies: [],
    files: ['badge.tsx'],
  },
  {
    name: 'avatar',
    description: 'User profile picture with fallback',
    category: 'Data Display',
    status: 'beta',
    dependencies: [],
    files: ['avatar.tsx'],
  },
  {
    name: 'switch',
    description: 'Toggle switch for boolean settings',
    category: 'Inputs',
    status: 'experimental',
    dependencies: ['react-native-reanimated'],
    files: ['switch.tsx'],
  },
  {
    name: 'checkbox',
    description: 'Selectable checkbox with animation',
    category: 'Inputs',
    status: 'experimental',
    dependencies: ['react-native-reanimated'],
    files: ['checkbox.tsx'],
  },
  {
    name: 'skeleton',
    description: 'Loading placeholder with shimmer animation',
    category: 'Feedback',
    status: 'experimental',
    dependencies: ['react-native-reanimated'],
    files: ['skeleton.tsx'],
  },
];

/**
 * Get all available components in the registry
 */
export async function getRegistry(): Promise<RegistryItem[]> {
  // In production: fetch from CDN
  return REGISTRY;
}

/**
 * Fetch a single component's code and metadata
 */
export async function fetchComponent(name: string): Promise<ComponentData | null> {
  const item = REGISTRY.find((i) => i.name === name);

  if (!item) {
    return null;
  }

  // In production: fetch actual component code from CDN
  // For now, return placeholder code
  const code = generatePlaceholderComponent(name, item.description);

  return {
    name: item.name,
    code,
    dependencies: item.dependencies,
    devDependencies: item.devDependencies,
    registryDependencies: item.registryDependencies,
  };
}

function generatePlaceholderComponent(name: string, description: string): string {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);

  return `/**
 * ${componentName}
 *
 * ${description}
 *
 * @example
 * \`\`\`tsx
 * <${componentName} />
 * \`\`\`
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ${componentName}Props {
  children?: React.ReactNode;
}

export function ${componentName}({ children }: ${componentName}Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children ?? '${componentName}'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
`;
}
