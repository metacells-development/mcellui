import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, getProjectRoot, ResolvedNativeUIConfig } from '../utils/project';
import { fetchComponent, getRegistry, RegistryItem } from '../utils/registry';
import { transformToInstalled, normalizeForComparison } from '../utils/imports';
import { handleError, errors } from '../utils/errors';

interface ComponentDiff {
  name: string;
  localFile: string;
  hasUpdate: boolean;
}

export const updateCommand = new Command()
  .name('update')
  .description('Update installed components to latest registry versions')
  .argument('[components...]', 'Specific components to update (default: all outdated)')
  .option('-y, --yes', 'Skip confirmation prompt')
  .option('--all', 'Update all components (including up-to-date)')
  .option('--dry-run', 'Show what would be updated without making changes')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .action(async (components: string[], options) => {
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

      spinner.start('Checking for updates...');

      // Get installed components with their diff status
      const componentsDir = path.join(projectRoot, config.componentsPath);
      const diffs = await getComponentDiffs(componentsDir, config);

      if (diffs.length === 0) {
        spinner.info('No components installed yet.');
        console.log(chalk.dim('\nAdd components with: npx mcellui add <component>'));
        return;
      }

      spinner.stop();

      // Filter to components that need updates
      let toUpdate: ComponentDiff[];

      if (components.length > 0) {
        // Update specific components
        toUpdate = diffs.filter(d => components.includes(d.name));
        const notFound = components.filter(c => !diffs.some(d => d.name === c));

        if (notFound.length > 0) {
          console.log(chalk.yellow(`Components not found: ${notFound.join(', ')}`));
        }
      } else if (options.all) {
        // Update all components (even if up-to-date)
        toUpdate = diffs;
      } else {
        // Update only outdated components
        toUpdate = diffs.filter(d => d.hasUpdate);
      }

      if (toUpdate.length === 0) {
        console.log(chalk.green('\n✓ All components are up to date!'));
        return;
      }

      // Show what will be updated
      console.log();
      console.log(chalk.bold(`Components to update (${toUpdate.length}):`));
      for (const comp of toUpdate) {
        const status = comp.hasUpdate ? chalk.yellow('●') : chalk.green('●');
        const label = comp.hasUpdate ? chalk.dim('(update available)') : chalk.dim('(re-sync)');
        console.log(`  ${status} ${comp.name} ${label}`);
      }
      console.log();

      // Dry run mode
      if (options.dryRun) {
        console.log(chalk.dim('Dry run mode - no changes made.'));
        return;
      }

      // Confirm unless --yes
      if (!options.yes) {
        const { confirm } = await prompts({
          type: 'confirm',
          name: 'confirm',
          message: `Update ${toUpdate.length} component${toUpdate.length !== 1 ? 's' : ''}?`,
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

      // Perform updates
      console.log();
      const allDependencies: string[] = [];
      const allDevDependencies: string[] = [];
      let successCount = 0;
      let failCount = 0;

      for (const comp of toUpdate) {
        spinner.start(`Updating ${comp.name}...`);

        try {
          const component = await fetchComponent(comp.name);

          if (!component) {
            spinner.fail(`${comp.name}: Not found in registry`);
            failCount++;
            continue;
          }

          const targetDir = path.join(projectRoot, config.componentsPath);

          for (const file of component.files) {
            const targetPath = path.join(targetDir, file.name);
            await fs.ensureDir(targetDir);

            // Transform imports
            const transformedContent = transformToInstalled(file.content, config);
            await fs.writeFile(targetPath, transformedContent);
          }

          spinner.succeed(`Updated ${comp.name}`);
          successCount++;

          // Collect dependencies
          if (component.dependencies?.length) {
            allDependencies.push(...component.dependencies);
          }
          if (component.devDependencies?.length) {
            allDevDependencies.push(...component.devDependencies);
          }
        } catch (error) {
          spinner.fail(`${comp.name}: ${String(error)}`);
          failCount++;
        }
      }

      // Summary
      console.log();
      if (successCount > 0) {
        console.log(chalk.green(`✓ Updated ${successCount} component${successCount !== 1 ? 's' : ''}`));
      }
      if (failCount > 0) {
        console.log(chalk.red(`✗ Failed to update ${failCount} component${failCount !== 1 ? 's' : ''}`));
      }

      // Show dependency install commands if needed
      const uniqueDeps = [...new Set(allDependencies)];
      const uniqueDevDeps = [...new Set(allDevDependencies)];

      if (uniqueDeps.length || uniqueDevDeps.length) {
        console.log();
        console.log(chalk.bold('Install/update dependencies:'));

        if (uniqueDeps.length) {
          console.log(chalk.cyan(`  npx expo install ${uniqueDeps.join(' ')}`));
        }
        if (uniqueDevDeps.length) {
          console.log(chalk.cyan(`  npm install -D ${uniqueDevDeps.join(' ')}`));
        }
      }

      // Exit with error code if any components failed
      if (failCount > 0) {
        process.exit(1);
      }
    } catch (error) {
      spinner.fail('Failed to update');
      handleError({
        message: 'Failed to update components',
        hint: error instanceof Error ? error.message : 'Check your network connection and try again',
      });
    }
  });

/**
 * Get list of installed components with diff status
 */
async function getComponentDiffs(
  componentsDir: string,
  config: ResolvedNativeUIConfig
): Promise<ComponentDiff[]> {
  if (!await fs.pathExists(componentsDir)) {
    return [];
  }

  const registry = await getRegistry();
  const registryMap = new Map<string, RegistryItem>();

  for (const item of registry) {
    for (const file of item.files) {
      const fileName = path.basename(file);
      registryMap.set(fileName, item);
    }
  }

  const files = await fs.readdir(componentsDir);
  const results: ComponentDiff[] = [];

  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) {
      continue;
    }
    if (file === 'index.ts' || file === 'index.tsx') {
      continue;
    }

    const registryItem = registryMap.get(file);
    if (!registryItem) {
      // Skip local-only components
      continue;
    }

    const localFile = path.join(componentsDir, file);
    const hasUpdate = await checkForUpdate(localFile, registryItem, config);

    results.push({
      name: registryItem.name,
      localFile,
      hasUpdate,
    });
  }

  return results;
}

/**
 * Check if a component has updates available
 */
async function checkForUpdate(
  localFile: string,
  registryItem: RegistryItem,
  config: ResolvedNativeUIConfig
): Promise<boolean> {
  try {
    const component = await fetchComponent(registryItem.name);
    if (!component) return false;

    const fileName = path.basename(localFile);
    const registryFile = component.files.find(f => f.name === fileName);
    if (!registryFile) return false;

    const localContent = await fs.readFile(localFile, 'utf-8');

    // Normalize both for comparison (handles whitespace + import paths)
    const normalizedLocal = normalizeForComparison(localContent);
    const normalizedRegistry = normalizeForComparison(registryFile.content);

    return normalizedLocal !== normalizedRegistry;
  } catch {
    return false;
  }
}

