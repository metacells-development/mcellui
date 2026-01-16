import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getProjectRoot, detectProjectType } from '../utils/project';

export const initCommand = new Command()
  .name('init')
  .description('Initialize nativeui in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (options) => {
    const spinner = ora();

    try {
      const cwd = path.resolve(options.cwd);
      const projectRoot = await getProjectRoot(cwd);

      if (!projectRoot) {
        console.log(chalk.red('Could not find a valid Expo/React Native project.'));
        console.log(chalk.dim('Make sure you run this command in a project with package.json'));
        process.exit(1);
      }

      console.log();
      console.log(chalk.bold('Welcome to nativeui!'));
      console.log(chalk.dim('The copy-paste component library for Expo/React Native'));
      console.log();

      const projectType = await detectProjectType(projectRoot);
      console.log(chalk.dim(`Detected: ${projectType}`));

      // Check if already initialized
      const configPath = path.join(projectRoot, 'nativeui.config.ts');
      if (await fs.pathExists(configPath)) {
        console.log(chalk.yellow('Project already initialized.'));
        console.log(chalk.dim(`Config found at: ${configPath}`));
        return;
      }

      let config = {
        componentsPath: './components/ui',
        utilsPath: './lib/utils',
        style: 'default' as const,
      };

      if (!options.yes) {
        const response = await prompts([
          {
            type: 'text',
            name: 'componentsPath',
            message: 'Where should components be installed?',
            initial: config.componentsPath,
          },
          {
            type: 'text',
            name: 'utilsPath',
            message: 'Where should utilities be installed?',
            initial: config.utilsPath,
          },
          {
            type: 'select',
            name: 'style',
            message: 'Which style preset?',
            choices: [
              { title: 'Default', value: 'default' },
              { title: 'iOS', value: 'ios' },
              { title: 'Material', value: 'material' },
            ],
          },
        ]);

        config = { ...config, ...response };
      }

      spinner.start('Creating configuration...');

      // Create config file using defineConfig from @nativeui/core
      const configContent = `/**
 * NativeUI Configuration
 *
 * This file defines your app's design system.
 * All components will automatically use these values.
 */

import { defineConfig } from '@nativeui/core';

export default defineConfig({
  // ============================================
  // Theme Configuration (runtime)
  // ============================================

  // Color theme preset: 'zinc' | 'slate' | 'stone' | 'blue' | 'green' | 'rose' | 'orange' | 'violet'
  theme: 'blue',

  // Border radius preset: 'none' | 'sm' | 'md' | 'lg' | 'full'
  radius: 'md',

  // Default color scheme: 'light' | 'dark' | 'system'
  colorScheme: 'system',

  // Custom color overrides (optional)
  // colors: {
  //   primary: '#6366F1',
  // },

  // Component defaults (optional)
  // components: {
  //   button: { defaultVariant: 'default', defaultSize: 'md' },
  // },

  // ============================================
  // CLI Configuration (used by npx nativeui add)
  // ============================================

  // Path where components will be installed
  componentsPath: '${config.componentsPath}',

  // Path where utilities (cn, etc.) will be installed
  utilsPath: '${config.utilsPath}',

  // Style preset: 'default' | 'ios' | 'material'
  style: '${config.style}',

  // Path aliases for imports
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
  },
});
`;

      await fs.writeFile(configPath, configContent);
      spinner.succeed('Configuration created');

      // Create directories
      spinner.start('Creating directories...');
      const componentsDir = path.join(projectRoot, config.componentsPath);
      const utilsDir = path.join(projectRoot, config.utilsPath);

      await fs.ensureDir(componentsDir);
      await fs.ensureDir(utilsDir);
      spinner.succeed('Directories created');

      // Create utils file
      spinner.start('Installing utilities...');
      const cnContent = `import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;
type StyleInput = Style | Style[] | null | undefined | false;

/**
 * Merge styles utility
 *
 * @example
 * \`\`\`tsx
 * const styles = cn(
 *   baseStyles.container,
 *   isActive && activeStyles,
 *   { padding: 16 }
 * );
 * \`\`\`
 */
export function cn(...inputs: StyleInput[]): Style {
  const styles: Style[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (Array.isArray(input)) {
      const flattened = StyleSheet.flatten(input);
      if (flattened) styles.push(flattened);
    } else {
      styles.push(input);
    }
  }

  return StyleSheet.flatten(styles);
}
`;

      await fs.writeFile(path.join(utilsDir, 'cn.ts'), cnContent);
      await fs.writeFile(
        path.join(utilsDir, 'index.ts'),
        `export { cn } from './cn';\n`
      );
      spinner.succeed('Utilities installed');

      console.log();
      console.log(chalk.green('Success!') + ' nativeui initialized.');
      console.log();
      console.log('Next steps:');
      console.log(chalk.dim('  1.'), 'Add your first component:');
      console.log(chalk.cyan('     npx nativeui add button'));
      console.log();
      console.log(chalk.dim('  2.'), 'Browse available components:');
      console.log(chalk.cyan('     npx nativeui list'));
      console.log();
    } catch (error) {
      spinner.fail('Failed to initialize');
      console.error(error);
      process.exit(1);
    }
  });

// Config type is exported from CLI utils
export type { NativeUIConfig } from '../utils/config.js';
