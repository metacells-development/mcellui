import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot } from '../utils/project';
import { fetchComponent, getRegistry, RegistryItem } from '../utils/registry';
import { resolveDependencies, formatCircularError } from '../utils/dependencies';
import { getInstalledFiles, getInstalledNames } from '../utils/installed';
import { transformToInstalled } from '../utils/imports';

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
        console.log(chalk.dim('Run `npx mcellui init` first.'));
        process.exit(1);
      }

      const config = await getConfig(projectRoot);

      if (!config) {
        console.log(chalk.red('Project not initialized.'));
        console.log(chalk.dim('Run `npx mcellui init` first.'));
        process.exit(1);
      }

      // If no components specified, show picker
      if (!components.length) {
        const registry = await getRegistry();

        if (!registry.length) {
          console.log(chalk.red('No components found in registry.'));
          process.exit(1);
        }

        const { selected } = await prompts({
          type: 'multiselect',
          name: 'selected',
          message: 'Which components would you like to add?',
          choices: registry.map((item: RegistryItem) => ({
            title: `${item.name} ${chalk.dim(`(${item.status})`)}`,
            value: item.name,
            description: item.description,
          })),
          hint: '- Space to select, Enter to confirm',
        });

        if (!selected?.length) {
          console.log(chalk.dim('No components selected.'));
          return;
        }

        components = selected;
      }

      // Fetch registry for dependency resolution
      spinner.start('Resolving dependencies...');
      const registry = await getRegistry();

      // Resolve all dependencies
      const { resolved, circular } = resolveDependencies(components, registry);

      if (circular) {
        spinner.fail('Circular dependency detected');
        console.log(chalk.red(`  ${formatCircularError(circular)}`));
        process.exit(1);
      }

      spinner.stop();

      // Get already installed components
      const componentsDir = path.join(projectRoot, config.componentsPath);
      const installedFiles = await getInstalledFiles(componentsDir);
      const installedNames = new Set(getInstalledNames(installedFiles));

      // Filter out already installed (unless --overwrite)
      const toInstall = options.overwrite
        ? resolved
        : resolved.filter(name => !installedNames.has(name));

      if (toInstall.length === 0) {
        console.log(chalk.yellow('All components are already installed.'));
        console.log(chalk.dim('Use --overwrite to reinstall.'));
        return;
      }

      // Show what will be installed
      const requested = new Set(components);
      const dependencies = toInstall.filter(name => !requested.has(name));

      console.log();
      console.log(chalk.bold('Adding components:'));
      for (const name of toInstall) {
        if (requested.has(name)) {
          console.log(chalk.dim(`  - ${name}`));
        } else {
          console.log(chalk.dim(`  - ${name} ${chalk.cyan('(dependency)')}`));
        }
      }
      console.log();

      // Confirm if adding dependencies
      if (dependencies.length > 0 && !options.yes) {
        const { confirm } = await prompts({
          type: 'confirm',
          name: 'confirm',
          message: `Add ${dependencies.length} additional dependencies?`,
          initial: true,
        });

        if (!confirm) {
          console.log(chalk.dim('Cancelled.'));
          return;
        }
      }

      const allDependencies: string[] = [];
      const allDevDependencies: string[] = [];

      for (const componentName of toInstall) {
        spinner.start(`Fetching ${componentName}...`);

        try {
          const component = await fetchComponent(componentName);

          if (!component) {
            spinner.fail(`Component "${componentName}" not found`);
            continue;
          }

          const targetDir = path.join(projectRoot, config.componentsPath);

          // Write each file
          for (const file of component.files) {
            const targetPath = path.join(targetDir, file.name);

            // Check if exists
            if ((await fs.pathExists(targetPath)) && !options.overwrite) {
              spinner.warn(`${file.name} already exists (use --overwrite)`);
              continue;
            }

            await fs.ensureDir(targetDir);

            // Transform import paths based on config
            const transformedContent = transformToInstalled(file.content, config);
            await fs.writeFile(targetPath, transformedContent);
          }

          spinner.succeed(`Added ${componentName}`);

          // Collect npm dependencies
          if (component.dependencies?.length) {
            allDependencies.push(...component.dependencies);
          }
          if (component.devDependencies?.length) {
            allDevDependencies.push(...component.devDependencies);
          }
        } catch (error) {
          spinner.fail(`Failed to add ${componentName}`);
          console.error(chalk.dim(String(error)));
        }
      }

      // Show dependency install commands if needed
      const uniqueDeps = [...new Set(allDependencies)];
      const uniqueDevDeps = [...new Set(allDevDependencies)];

      if (uniqueDeps.length || uniqueDevDeps.length) {
        console.log();
        console.log(chalk.bold('Install dependencies:'));

        if (uniqueDeps.length) {
          console.log(chalk.cyan(`  npx expo install ${uniqueDeps.join(' ')}`));
        }
        if (uniqueDevDeps.length) {
          console.log(chalk.cyan(`  npm install -D ${uniqueDevDeps.join(' ')}`));
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

