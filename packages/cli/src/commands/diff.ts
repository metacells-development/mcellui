import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import * as Diff from 'diff';
import { getConfig, getProjectRoot } from '../utils/project';
import { fetchComponent, getRegistry, RegistryItem } from '../utils/registry';
import { getInstalledFiles } from '../utils/installed';
import { normalizeForComparison } from '../utils/imports';
import { handleError, errors } from '../utils/errors';

interface DiffResult {
  name: string;
  fileName: string;
  status: 'identical' | 'modified' | 'local-only' | 'error';
  localFile?: string;
  diff?: string;
  error?: string;
}

export const diffCommand = new Command()
  .name('diff')
  .description('Compare locally installed components against the registry source')
  .argument('[components...]', 'Component names to diff (optional, diffs all if omitted)')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .option('--list', 'Only list components with differences')
  .option('--json', 'Output as JSON')
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

      spinner.start('Scanning installed components...');

      // Get installed components
      const componentsDir = path.join(projectRoot, config.componentsPath);
      const installedFiles = await getInstalledFiles(componentsDir);

      if (installedFiles.length === 0) {
        spinner.info('No components installed yet.');
        console.log(chalk.dim('\nAdd components with: npx mcellui add <component>'));
        return;
      }

      spinner.text = 'Fetching registry...';
      const registry = await getRegistry();
      const registryMap = new Map<string, RegistryItem>();

      for (const item of registry) {
        for (const file of item.files) {
          const fileName = path.basename(file);
          registryMap.set(fileName, item);
        }
      }

      // Filter to specific components if provided
      let filesToCompare = installedFiles;
      if (components.length > 0) {
        const componentFileNames = components.map(c => {
          // Handle both "button" and "button.tsx" formats
          return c.endsWith('.tsx') ? c : `${c}.tsx`;
        });
        filesToCompare = installedFiles.filter(file => {
          const fileName = path.basename(file);
          return componentFileNames.includes(fileName);
        });

        if (filesToCompare.length === 0) {
          spinner.stop();
          handleError({
            message: 'None of the specified components are installed',
            hint: 'Check component names: npx mcellui list --installed',
          });
        }
      }

      spinner.text = 'Comparing components...';
      const results: DiffResult[] = [];

      for (const localFile of filesToCompare) {
        const fileName = path.basename(localFile);
        const componentName = fileName.replace(/\.tsx?$/, '');
        const registryItem = registryMap.get(fileName);

        if (!registryItem) {
          // Local-only component (not in registry)
          results.push({
            name: componentName,
            fileName,
            status: 'local-only',
            localFile,
          });
          continue;
        }

        try {
          // Fetch registry component
          const component = await fetchComponent(registryItem.name);

          if (!component) {
            results.push({
              name: registryItem.name,
              fileName,
              status: 'error',
              error: 'Failed to fetch from registry',
            });
            continue;
          }

          // Find matching file
          const registryFile = component.files.find(f => f.name === fileName);

          if (!registryFile) {
            results.push({
              name: registryItem.name,
              fileName,
              status: 'error',
              error: 'File not found in registry',
            });
            continue;
          }

          // Read local file
          const localContent = await fs.readFile(localFile, 'utf-8');

          // Normalize both contents for comparison (handles whitespace + import paths)
          const normalizedLocal = normalizeForComparison(localContent);
          const normalizedRegistry = normalizeForComparison(registryFile.content);

          if (normalizedLocal === normalizedRegistry) {
            results.push({
              name: registryItem.name,
              fileName,
              status: 'identical',
              localFile,
            });
          } else {
            // Generate unified diff
            const diffOutput = Diff.createPatch(
              fileName,
              normalizedRegistry,
              normalizedLocal,
              'registry',
              'local'
            );

            results.push({
              name: registryItem.name,
              fileName,
              status: 'modified',
              localFile,
              diff: diffOutput,
            });
          }
        } catch (error) {
          results.push({
            name: registryItem.name,
            fileName,
            status: 'error',
            error: String(error),
          });
        }
      }

      spinner.stop();

      // Output results
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
        const hasChanges = results.some(r => r.status === 'modified');
        process.exit(hasChanges ? 1 : 0);
      }

      printResults(results, options.list);

      // Exit code: 0 if all identical, 1 if any differences
      const hasChanges = results.some(r => r.status === 'modified');
      process.exit(hasChanges ? 1 : 0);
    } catch (error) {
      spinner.stop();
      handleError({
        message: 'Failed to diff components',
        hint: error instanceof Error ? error.message : 'Check your network connection',
      });
    }
  });

/**
 * Print formatted results with colored diff output
 */
function printResults(results: DiffResult[], listOnly: boolean): void {
  const identical = results.filter(r => r.status === 'identical');
  const modified = results.filter(r => r.status === 'modified');
  const localOnly = results.filter(r => r.status === 'local-only');
  const errors = results.filter(r => r.status === 'error');

  console.log();
  console.log(chalk.bold('Comparing components...'));
  console.log();

  // Print each result
  for (const result of results) {
    switch (result.status) {
      case 'identical':
        console.log(`${chalk.green('✓')} ${result.fileName}    ${chalk.dim('(identical)')}`);
        break;
      case 'modified':
        console.log(`${chalk.red('✗')} ${result.fileName}      ${chalk.yellow('(modified)')}`);
        if (!listOnly && result.diff) {
          printColoredDiff(result.diff);
        }
        break;
      case 'local-only':
        console.log(`${chalk.yellow('⚠')} ${result.fileName}    ${chalk.dim('(not in registry)')}`);
        break;
      case 'error':
        console.log(`${chalk.red('!')} ${result.fileName}    ${chalk.red(`(error: ${result.error})`)}`);
        break;
    }
  }

  // Summary
  console.log();
  const parts: string[] = [];
  if (identical.length > 0) parts.push(`${identical.length} identical`);
  if (modified.length > 0) parts.push(`${modified.length} modified`);
  if (localOnly.length > 0) parts.push(`${localOnly.length} custom`);
  if (errors.length > 0) parts.push(`${errors.length} errors`);

  console.log(chalk.dim(`Summary: ${parts.join(', ')}`));

  // Hint for updating
  if (modified.length > 0) {
    console.log();
    console.log(chalk.dim('Update modified components with:'));
    console.log(chalk.cyan(`  npx mcellui add ${modified.map(m => m.name).join(' ')} --overwrite`));
  }
}

/**
 * Print colored unified diff output
 */
function printColoredDiff(diffOutput: string): void {
  const lines = diffOutput.split('\n');

  // Skip the header lines (first 4 lines of unified diff format)
  const contentLines = lines.slice(4);

  for (const line of contentLines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      // Added line (local has this, registry doesn't)
      console.log(chalk.green(`    ${line}`));
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      // Removed line (registry has this, local doesn't)
      console.log(chalk.red(`    ${line}`));
    } else if (line.startsWith('@@')) {
      // Hunk header
      console.log(chalk.cyan(`    ${line}`));
    } else if (line.trim()) {
      // Context line
      console.log(chalk.dim(`    ${line}`));
    }
  }
}
