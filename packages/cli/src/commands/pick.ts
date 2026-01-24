import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot } from '../utils/project.js';
import { fetchComponent, getRegistry, type RegistryItem } from '../utils/registry.js';
import { transformToInstalled } from '../utils/imports.js';

interface CategoryGroup {
  name: string;
  items: RegistryItem[];
}

function groupByCategory(items: RegistryItem[]): CategoryGroup[] {
  const groups: Record<string, RegistryItem[]> = {};

  for (const item of items) {
    const category = item.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
  }

  const categoryOrder = [
    'primitive',
    'input',
    'data-display',
    'overlay',
    'navigation',
    'mobile',
    'media',
    'layout',
    'form',
    'block',
    'screen',
    'other',
  ];

  return categoryOrder
    .filter((cat) => groups[cat]?.length > 0)
    .map((cat) => ({
      name: formatCategoryName(cat),
      items: groups[cat].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    primitive: '🧱 Primitives',
    input: '📝 Inputs & Forms',
    'data-display': '📊 Data Display',
    overlay: '🎭 Overlays & Feedback',
    navigation: '🧭 Navigation',
    mobile: '📱 Mobile Patterns',
    media: '🖼️  Media',
    layout: '📐 Layout',
    form: '📋 Form System',
    block: '🏗️  Blocks',
    screen: '📺 Screens',
    other: '📦 Other',
  };
  return names[category] || category;
}

function formatComponentChoice(item: RegistryItem, installed: Set<string>): prompts.Choice {
  const isInstalled = installed.has(item.name);
  const status = isInstalled ? chalk.green(' ✓') : '';
  const description = item.description || '';

  return {
    title: `${item.name}${status}`,
    description: description.length > 60 ? description.slice(0, 57) + '...' : description,
    value: item.name,
    disabled: isInstalled,
  };
}

export const pickCommand = new Command()
  .name('pick')
  .description('Interactively browse and select components to add')
  .option('--all', 'Show all components without category selection')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (options) => {
    console.log(chalk.bold('\n🎨 mcellui Component Picker\n'));

    const cwd = path.resolve(options.cwd);
    const projectRoot = await getProjectRoot(cwd);

    if (!projectRoot) {
      console.log(chalk.red('Could not find a valid project.'));
      console.log(chalk.dim('Run `npx mcellui init` first.\n'));
      return;
    }

    const config = await getConfig(projectRoot);

    if (!config) {
      console.log(chalk.yellow('No mcellui.config.ts found. Run `npx mcellui init` first.\n'));
      return;
    }

    const spinner = ora('Loading component registry...').start();
    const registry = await getRegistry();

    if (!registry.length) {
      spinner.fail('Could not load registry');
      return;
    }

    spinner.succeed(`Loaded ${registry.length} components`);

    // Check installed components
    const componentsDir = path.join(projectRoot, config.componentsPath);
    const installed = new Set<string>();

    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir);
      for (const file of files) {
        if (file.endsWith('.tsx')) {
          installed.add(file.replace('.tsx', ''));
        }
      }
    }

    // Group by category
    const categories = groupByCategory(registry);

    let selectedCategory: CategoryGroup | null = null;

    if (!options.all) {
      const categoryChoices = categories.map((cat) => ({
        title: `${cat.name} (${cat.items.length})`,
        value: cat,
      }));

      categoryChoices.unshift({
        title: '📦 All Components',
        value: { name: 'All', items: registry } as CategoryGroup,
      });

      const categoryResponse = await prompts({
        type: 'select',
        name: 'category',
        message: 'Select a category',
        choices: categoryChoices,
      });

      if (!categoryResponse.category) {
        console.log(chalk.yellow('\nCancelled.\n'));
        return;
      }

      selectedCategory = categoryResponse.category;
    } else {
      selectedCategory = { name: 'All', items: registry };
    }

    if (!selectedCategory) return;

    // Select components
    const componentChoices = selectedCategory.items.map((item) =>
      formatComponentChoice(item, installed)
    );

    const availableCount = componentChoices.filter((c) => !c.disabled).length;

    if (availableCount === 0) {
      console.log(chalk.green('\n✓ All components in this category are already installed!\n'));
      return;
    }

    console.log(chalk.dim(`\n${installed.size} already installed, ${availableCount} available\n`));

    const componentResponse = await prompts({
      type: 'multiselect',
      name: 'components',
      message: 'Select components to install (space to select, enter to confirm)',
      choices: componentChoices,
      hint: '- Space to select. Return to submit',
      instructions: false,
    });

    if (!componentResponse.components || componentResponse.components.length === 0) {
      console.log(chalk.yellow('\nNo components selected.\n'));
      return;
    }

    const selectedComponents: string[] = componentResponse.components;

    // Confirm
    console.log(chalk.bold('\nComponents to install:'));
    for (const name of selectedComponents) {
      console.log(chalk.cyan(`  • ${name}`));
    }

    const confirmResponse = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: `Install ${selectedComponents.length} component(s)?`,
      initial: true,
    });

    if (!confirmResponse.proceed) {
      console.log(chalk.yellow('\nCancelled.\n'));
      return;
    }

    // Install
    console.log('');
    let successCount = 0;
    const allDependencies: string[] = [];
    const allDevDependencies: string[] = [];

    for (const name of selectedComponents) {
      const installSpinner = ora(`Installing ${name}...`).start();

      try {
        const component = await fetchComponent(name);
        if (!component) {
          installSpinner.fail(`Component "${name}" not found`);
          continue;
        }

        const targetDir = path.join(projectRoot, config.componentsPath);

        for (const file of component.files) {
          const targetPath = path.join(targetDir, file.name);

          if ((await fs.pathExists(targetPath)) && !options.overwrite) {
            installSpinner.warn(`${name}: ${file.name} already exists (use --overwrite)`);
            continue;
          }

          await fs.ensureDir(targetDir);
          const transformedContent = transformToInstalled(file.content, config);
          await fs.writeFile(targetPath, transformedContent);
        }

        installSpinner.succeed(`Installed ${chalk.green(name)}`);
        successCount++;

        if (component.dependencies?.length) {
          allDependencies.push(...component.dependencies);
        }
        if (component.devDependencies?.length) {
          allDevDependencies.push(...component.devDependencies);
        }

        if (component.registryDependencies?.length) {
          console.log(chalk.dim(`     Requires: ${component.registryDependencies.join(', ')}`));
        }
      } catch (error) {
        installSpinner.fail(`Failed to install ${name}: ${error}`);
      }
    }

    console.log(
      chalk.bold.green(`\n✓ Successfully installed ${successCount}/${selectedComponents.length} components\n`)
    );

    // Show dependency install commands
    const uniqueDeps = [...new Set(allDependencies)];
    const uniqueDevDeps = [...new Set(allDevDependencies)];

    if (uniqueDeps.length || uniqueDevDeps.length) {
      console.log(chalk.bold('Install dependencies:'));
      if (uniqueDeps.length) {
        console.log(chalk.cyan(`  npx expo install ${uniqueDeps.join(' ')}`));
      }
      if (uniqueDevDeps.length) {
        console.log(chalk.cyan(`  npm install -D ${uniqueDevDeps.join(' ')}`));
      }
      console.log('');
    }

    // Show import hint
    if (successCount > 0) {
      console.log(chalk.dim('Import example:'));
      const firstComponent = selectedComponents[0];
      const pascalName = firstComponent
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      const alias = config.aliases?.components || '@/components/ui';
      console.log(chalk.dim(`  import { ${pascalName} } from '${alias}/${firstComponent}';\n`));
    }
  });
