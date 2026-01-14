import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot } from '../utils/project';
import { fetchComponent, getRegistry } from '../utils/registry';

export const addCommand = new Command()
  .name('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (components: string[], options) => {
    const spinner = ora();

    try {
      const cwd = path.resolve(options.cwd);
      const projectRoot = await getProjectRoot(cwd);

      if (!projectRoot) {
        console.log(chalk.red('Could not find a valid project.'));
        console.log(chalk.dim('Run `npx nativeui init` first.'));
        process.exit(1);
      }

      const config = await getConfig(projectRoot);

      if (!config) {
        console.log(chalk.red('Project not initialized.'));
        console.log(chalk.dim('Run `npx nativeui init` first.'));
        process.exit(1);
      }

      // If no components specified, show picker
      if (!components.length) {
        const registry = await getRegistry();
        const { selected } = await prompts({
          type: 'multiselect',
          name: 'selected',
          message: 'Which components would you like to add?',
          choices: registry.map((item) => ({
            title: item.name,
            value: item.name,
            description: item.description,
          })),
        });

        if (!selected?.length) {
          console.log(chalk.dim('No components selected.'));
          return;
        }

        components = selected;
      }

      console.log();
      console.log(chalk.bold('Adding components:'));
      components.forEach((c) => console.log(chalk.dim(`  - ${c}`)));
      console.log();

      for (const componentName of components) {
        spinner.start(`Fetching ${componentName}...`);

        try {
          const component = await fetchComponent(componentName);

          if (!component) {
            spinner.fail(`Component "${componentName}" not found`);
            continue;
          }

          const targetDir = path.join(projectRoot, config.componentsPath);
          const targetPath = path.join(targetDir, `${componentName}.tsx`);

          // Check if exists
          if ((await fs.pathExists(targetPath)) && !options.overwrite) {
            spinner.warn(`${componentName} already exists (use --overwrite)`);
            continue;
          }

          await fs.ensureDir(targetDir);
          await fs.writeFile(targetPath, component.code);

          spinner.succeed(`Added ${componentName}`);

          // Show dependencies if any
          if (component.dependencies?.length) {
            console.log(
              chalk.dim(`     Dependencies: ${component.dependencies.join(', ')}`)
            );
          }
        } catch (error) {
          spinner.fail(`Failed to add ${componentName}`);
          console.error(chalk.dim(String(error)));
        }
      }

      console.log();
      console.log(chalk.green('Done!'));
    } catch (error) {
      spinner.fail('Failed');
      console.error(error);
      process.exit(1);
    }
  });
