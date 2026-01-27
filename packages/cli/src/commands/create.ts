import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot } from '../utils/project';
import { handleError, errors } from '../utils/errors';

type ComponentTemplate = 'basic' | 'animated' | 'pressable' | 'input';

interface CreateOptions {
  template: ComponentTemplate;
  forwardRef: boolean;
  yes: boolean;
  cwd: string;
}

export const createCommand = new Command()
  .name('create')
  .description('Scaffold a new custom component')
  .argument('<name>', 'Component name (e.g., my-button, ProfileCard)')
  .option('-t, --template <type>', 'Component template: basic, animated, pressable, input', 'basic')
  .option('--forward-ref', 'Include forwardRef pattern')
  .option('-y, --yes', 'Skip confirmation')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (name: string, options: CreateOptions) => {
    const spinner = ora();

    try {
      const cwd = path.resolve(options.cwd);
      const projectRoot = await getProjectRoot(cwd);

      if (!projectRoot) {
        errors.noProject();
      }

      const config = await getConfig(projectRoot);

      if (!config) {
        errors.notInitialized();
      }

      // Normalize component name
      const componentName = toPascalCase(name);
      const fileName = toKebabCase(name) + '.tsx';

      // Check if exists
      const targetDir = path.join(projectRoot, config.componentsPath);
      const targetPath = path.join(targetDir, fileName);

      if (await fs.pathExists(targetPath)) {
        handleError({
          message: `Component already exists: ${fileName}`,
          hint: 'Choose a different name or delete the existing file',
          code: 'COMPONENT_EXISTS',
        });
      }

      // Show preview unless --yes
      if (!options.yes) {
        console.log();
        console.log(chalk.bold('Create new component:'));
        console.log(`  Name: ${chalk.cyan(componentName)}`);
        console.log(`  File: ${chalk.dim(fileName)}`);
        console.log(`  Path: ${chalk.dim(targetPath)}`);
        console.log(`  Template: ${chalk.dim(options.template)}`);
        console.log(`  ForwardRef: ${chalk.dim(options.forwardRef ? 'Yes' : 'No')}`);
        console.log();

        const { confirm } = await prompts({
          type: 'confirm',
          name: 'confirm',
          message: 'Create this component?',
          initial: true,
        });

        // Handle user cancellation (Ctrl+C)
        if (confirm === undefined) {
          process.exit(0);
        }

        if (!confirm) {
          console.log(chalk.dim('Cancelled.'));
          return;
        }
      }

      spinner.start('Creating component...');

      // Generate component code
      const code = generateComponent(componentName, options.template as ComponentTemplate, options.forwardRef);

      // Write file
      await fs.ensureDir(targetDir);
      await fs.writeFile(targetPath, code);

      spinner.succeed(`Created ${fileName}`);

      console.log();
      console.log(chalk.bold('Next steps:'));
      console.log(`  1. Edit your component: ${chalk.cyan(targetPath)}`);
      console.log(`  2. Import it in your app:`);
      console.log(chalk.dim(`     import { ${componentName} } from '${config.aliases?.components || '@/components'}/ui/${toKebabCase(name)}';`));
      console.log();
    } catch (error) {
      spinner.fail('Failed to create component');
      handleError({
        message: 'Failed to create component',
        hint: error instanceof Error ? error.message : 'Check file permissions and try again',
      });
    }
  });

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generate component code based on template
 */
function generateComponent(name: string, template: ComponentTemplate, forwardRef: boolean): string {
  const templates: Record<ComponentTemplate, () => string> = {
    basic: () => generateBasicComponent(name, forwardRef),
    animated: () => generateAnimatedComponent(name, forwardRef),
    pressable: () => generatePressableComponent(name, forwardRef),
    input: () => generateInputComponent(name, forwardRef),
  };

  return templates[template]();
}

/**
 * Basic component template
 */
function generateBasicComponent(name: string, forwardRef: boolean): string {
  if (forwardRef) {
    return `import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

export interface ${name}Props extends ViewProps {
  /**
   * Example prop - replace with your own
   */
  title?: string;
}

/**
 * ${name}
 *
 * A custom component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name} title="Hello World" />
 * \`\`\`
 */
export const ${name} = forwardRef<View, ${name}Props>(
  ({ title, style, ...props }, ref) => {
    const { colors, spacing, radius } = useTheme();

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            padding: spacing[4],
            borderRadius: radius.md,
          },
          style,
        ]}
        {...props}
      >
        {title && (
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
        )}
      </View>
    );
  }
);

${name}.displayName = '${name}';

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
`;
  }

  return `import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

export interface ${name}Props extends ViewProps {
  /**
   * Example prop - replace with your own
   */
  title?: string;
}

/**
 * ${name}
 *
 * A custom component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name} title="Hello World" />
 * \`\`\`
 */
export function ${name}({ title, style, ...props }: ${name}Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          padding: spacing[4],
          borderRadius: radius.md,
        },
        style,
      ]}
      {...props}
    >
      {title && (
        <Text style={[styles.title, { color: colors.foreground }]}>
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
`;
}

/**
 * Animated component template
 */
function generateAnimatedComponent(name: string, forwardRef: boolean): string {
  const refPart = forwardRef
    ? `export const ${name} = forwardRef<Animated.View, ${name}Props>(
  ({ title, style, ...props }, ref) => {`
    : `export function ${name}({ title, style, ...props }: ${name}Props) {`;

  const closePart = forwardRef
    ? `  }
);

${name}.displayName = '${name}';`
    : `}`;

  return `import React${forwardRef ? ', { forwardRef }' : ''} from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

export interface ${name}Props extends ViewProps {
  /**
   * Example prop - replace with your own
   */
  title?: string;
}

/**
 * ${name}
 *
 * An animated component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name} title="Hello World" />
 * \`\`\`
 */
${refPart}
    const { colors, spacing, radius } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View
        ${forwardRef ? 'ref={ref}' : ''}
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            padding: spacing[4],
            borderRadius: radius.md,
          },
          animatedStyle,
          style,
        ]}
        {...props}
      >
        {title && (
          <Animated.Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Animated.Text>
        )}
      </Animated.View>
    );
${closePart}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
`;
}

/**
 * Pressable component template
 */
function generatePressableComponent(name: string, forwardRef: boolean): string {
  if (forwardRef) {
    return `import React, { forwardRef } from 'react';
import { Pressable, Text, StyleSheet, PressableProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ${name}Props extends Omit<PressableProps, 'style'> {
  /**
   * Button label
   */
  label?: string;
  /**
   * Custom style
   */
  style?: PressableProps['style'];
}

/**
 * ${name}
 *
 * A pressable component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name} label="Press me" onPress={() => console.log('Pressed!')} />
 * \`\`\`
 */
export const ${name} = forwardRef<View, ${name}Props>(
  ({ label, style, onPressIn, onPressOut, ...props }, ref) => {
    const { colors, spacing, radius } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: any) => {
      scale.value = withTiming(0.97, { duration: 100 });
      onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
      scale.value = withTiming(1, { duration: 100 });
      onPressOut?.(e);
    };

    return (
      <AnimatedPressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            backgroundColor: colors.primary,
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[4],
            borderRadius: radius.md,
          },
          animatedStyle,
          style,
        ]}
        {...props}
      >
        {label && (
          <Text style={[styles.label, { color: colors.primaryForeground }]}>
            {label}
          </Text>
        )}
      </AnimatedPressable>
    );
  }
);

${name}.displayName = '${name}';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
`;
  }

  return `import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ${name}Props extends Omit<PressableProps, 'style'> {
  /**
   * Button label
   */
  label?: string;
  /**
   * Custom style
   */
  style?: PressableProps['style'];
}

/**
 * ${name}
 *
 * A pressable component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name} label="Press me" onPress={() => console.log('Pressed!')} />
 * \`\`\`
 */
export function ${name}({ label, style, onPressIn, onPressOut, ...props }: ${name}Props) {
  const { colors, spacing, radius } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withTiming(0.97, { duration: 100 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withTiming(1, { duration: 100 });
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          borderRadius: radius.md,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {label && (
        <Text style={[styles.label, { color: colors.primaryForeground }]}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
`;
}

/**
 * Input component template
 */
function generateInputComponent(name: string, forwardRef: boolean): string {
  if (forwardRef) {
    return `import React, { forwardRef, useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

export interface ${name}Props extends TextInputProps {
  /**
   * Input label
   */
  label?: string;
  /**
   * Error message
   */
  error?: string;
}

/**
 * ${name}
 *
 * A custom input component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name}
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 * />
 * \`\`\`
 */
export const ${name} = forwardRef<TextInput, ${name}Props>(
  ({ label, error, style, onFocus, onBlur, ...props }, ref) => {
    const { colors, spacing, radius } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = useSharedValue(colors.border);

    const animatedStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

    const handleFocus = (e: any) => {
      setIsFocused(true);
      borderColor.value = withTiming(colors.primary, { duration: 150 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      borderColor.value = withTiming(
        error ? colors.destructive : colors.border,
        { duration: 150 }
      );
      onBlur?.(e);
    };

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.foreground }]}>
            {label}
          </Text>
        )}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderRadius: radius.md,
              borderWidth: 1,
            },
            animatedStyle,
          ]}
        >
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.foreground,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              },
              style,
            ]}
            placeholderTextColor={colors.mutedForeground}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </Animated.View>
        {error && (
          <Text style={[styles.error, { color: colors.destructive }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

${name}.displayName = '${name}';

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {},
  input: {
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    fontSize: 12,
  },
});
`;
  }

  return `import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';

export interface ${name}Props extends TextInputProps {
  /**
   * Input label
   */
  label?: string;
  /**
   * Error message
   */
  error?: string;
}

/**
 * ${name}
 *
 * A custom input component created with mcellui create.
 *
 * @example
 * \`\`\`tsx
 * <${name}
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 * />
 * \`\`\`
 */
export function ${name}({ label, error, style, onFocus, onBlur, ...props }: ${name}Props) {
  const { colors, spacing, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.border);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.primary, { duration: 150 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? colors.destructive : colors.border,
      { duration: 150 }
    );
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.foreground }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderRadius: radius.md,
            borderWidth: 1,
          },
          animatedStyle,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            },
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {},
  input: {
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    fontSize: 12,
  },
});
`;
}
