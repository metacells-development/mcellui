import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getRegistry, RegistryItem } from '../utils/registry';

export const listCommand = new Command()
  .name('list')
  .description('List available components')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options) => {
    const spinner = ora('Fetching components...').start();

    try {
      const registry = await getRegistry();

      spinner.stop();

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

      console.log(chalk.dim('Add a component: npx nativeui add <component>'));
      console.log();
    } catch (error) {
      spinner.fail('Failed to fetch components');
      console.error(error);
      process.exit(1);
    }
  });
