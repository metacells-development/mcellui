import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot } from '../utils/project';
import { fetchComponent, getRegistry, RegistryItem } from '../utils/registry';

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

      console.log();
      console.log(chalk.bold('Adding components:'));
      components.forEach((c) => console.log(chalk.dim(`  - ${c}`)));
      console.log();

      const allDependencies: string[] = [];
      const allDevDependencies: string[] = [];

      for (const componentName of components) {
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
            const transformedContent = transformImports(file.content, config);
            await fs.writeFile(targetPath, transformedContent);
          }

          spinner.succeed(`Added ${componentName}`);

          // Collect dependencies
          if (component.dependencies?.length) {
            allDependencies.push(...component.dependencies);
          }
          if (component.devDependencies?.length) {
            allDevDependencies.push(...component.devDependencies);
          }

          // Handle registry dependencies (other components)
          if (component.registryDependencies?.length) {
            console.log(
              chalk.dim(`     Requires: ${component.registryDependencies.join(', ')}`)
            );
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

/**
 * Transform import paths in component code based on project config
 */
function transformImports(
  code: string,
  config: { componentsPath: string; utilsPath: string; aliases?: { utils?: string } }
): string {
  let transformed = code;

  // Transform @/lib/utils to configured utils alias or relative path
  const utilsAlias = config.aliases?.utils || '@/lib/utils';

  // If using default alias, keep as is
  if (utilsAlias === '@/lib/utils') {
    return transformed;
  }

  // Otherwise transform the import
  transformed = transformed.replace(
    /from ['"]@\/lib\/utils['"]/g,
    `from '${utilsAlias}'`
  );

  return transformed;
}
