import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { getRegistry, RegistryItem } from '../utils/registry';
import { getConfig, getProjectRoot } from '../utils/project';
import { getInstalledFiles, getInstallStatus, getInstalledNames } from '../utils/installed';
import { handleError, errors } from '../utils/errors';

export const listCommand = new Command()
  .name('list')
  .description('List available or installed components')
  .option('-c, --category <category>', 'Filter by category')
  .option('-i, --installed', 'Show installed components and their sync status')
  .option('--json', 'Output as JSON')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (options) => {
    if (options.installed) {
      await listInstalledComponents(options);
    } else {
      await listAvailableComponents(options);
    }
  });

async function listAvailableComponents(options: { category?: string; json?: boolean }) {
  const spinner = ora('Fetching components...').start();

  try {
    const registry = await getRegistry();

    spinner.stop();

    // JSON output mode
    if (options.json) {
      const items = options.category
        ? registry.filter(item => (item.category || 'Other').toLowerCase() === options.category.toLowerCase())
        : registry;
      console.log(JSON.stringify(items, null, 2));
      return;
    }

    console.log();
    console.log(chalk.bold('Available Components'));
    console.log();

    // Group by category
    const categories = new Map<string, RegistryItem[]>();

    for (const item of registry) {
      const category = item.category || 'Other';

      if (options.category && category.toLowerCase() !== options.category.toLowerCase()) {
        continue;
      }

      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(item);
    }

    for (const [category, items] of categories) {
      console.log(chalk.cyan.bold(`${category}`));

      for (const item of items) {
        const status = item.status === 'stable' ? '' : chalk.yellow(` [${item.status}]`);
        console.log(`  ${chalk.white(item.name)}${status}`);
        console.log(chalk.dim(`    ${item.description}`));
      }

      console.log();
    }

    console.log(chalk.dim('Add a component: npx mcellui add <component>'));
    console.log();
  } catch (error) {
    spinner.fail('Failed to fetch components');
    console.error(error);
    process.exit(1);
  }
}

async function listInstalledComponents(options: { cwd?: string; json?: boolean }) {
  const spinner = ora();

  try {
    const cwd = path.resolve(options.cwd || process.cwd());
    const projectRoot = await getProjectRoot(cwd);

    if (!projectRoot) {
      console.log(chalk.red('Could not find a valid project.'));
      console.log(chalk.dim('Run `npx mcellui init` first.'));
      process.exit(1);
    }

    const config = await getConfig(projectRoot);

    if (!config) {
      console.log(chalk.red('Project not initialized.'));
      console.log(chalk.dim('Run `npx mcellui init` first.'));
      process.exit(1);
    }

    spinner.start('Scanning installed components...');

    const componentsDir = path.join(projectRoot, config.componentsPath);
    const installedFiles = await getInstalledFiles(componentsDir);

    if (installedFiles.length === 0) {
      spinner.stop();
      if (options.json) {
        console.log(JSON.stringify([], null, 2));
        return;
      }
      spinner.info('No components installed yet.');
      console.log(chalk.dim('\nAdd components with: npx mcellui add <component>'));
      return;
    }

    spinner.text = 'Fetching registry...';
    const registry = await getRegistry();

    spinner.text = 'Comparing components...';
    const installed = await getInstallStatus(installedFiles, registry, config);

    spinner.stop();

    // JSON output mode
    if (options.json) {
      console.log(JSON.stringify(installed, null, 2));
      return;
    }

    // Group by status
    const identical = installed.filter(c => c.status === 'identical');
    const modified = installed.filter(c => c.status === 'modified');
    const localOnly = installed.filter(c => c.status === 'local-only');

    // Get not installed components
    const installedNames = new Set(installed.map(c => c.name));
    const notInstalled = registry.filter(item => !installedNames.has(item.name));

    console.log();
    console.log(chalk.bold(`Installed Components (${installed.length})`));
    console.log();

    // Print installed by category
    const categories = new Map<string, typeof installed>();

    for (const comp of installed) {
      const registryItem = registry.find(r => r.name === comp.name);
      const category = registryItem?.category || 'Custom';

      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(comp);
    }

    for (const [category, components] of categories) {
      console.log(chalk.cyan.bold(category));

      for (const comp of components) {
        let statusIcon: string;
        let statusText: string;

        switch (comp.status) {
          case 'identical':
            statusIcon = chalk.green('✓');
            statusText = chalk.dim('(up to date)');
            break;
          case 'modified':
            statusIcon = chalk.yellow('⚠');
            statusText = chalk.yellow('(modified locally)');
            break;
          case 'local-only':
            statusIcon = chalk.blue('?');
            statusText = chalk.dim('(custom component)');
            break;
        }

        console.log(`  ${statusIcon} ${chalk.white(comp.name)}  ${statusText}`);
      }

      console.log();
    }

    // Print not installed
    if (notInstalled.length > 0) {
      console.log(chalk.dim('Not Installed'));
      const notInstalledNames = notInstalled.map(c => c.name).slice(0, 10);
      const remaining = notInstalled.length - 10;
      console.log(chalk.dim(`  ${notInstalledNames.join(', ')}${remaining > 0 ? `, ... +${remaining} more` : ''}`));
      console.log();
    }

    // Summary
    console.log(chalk.dim('─'.repeat(50)));
    const parts: string[] = [];
    if (identical.length > 0) parts.push(chalk.green(`${identical.length} up to date`));
    if (modified.length > 0) parts.push(chalk.yellow(`${modified.length} modified`));
    if (localOnly.length > 0) parts.push(chalk.blue(`${localOnly.length} custom`));
    console.log(parts.join('  •  '));

    // Hints
    if (modified.length > 0) {
      console.log();
      console.log(chalk.dim('Sync modified components:'));
      console.log(chalk.cyan(`  npx mcellui diff`));
    }
  } catch (error) {
    spinner.fail('Failed to list installed components');
    console.error(error);
    process.exit(1);
  }
}
