import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { getConfig, getProjectRoot, ResolvedNativeUIConfig } from '../utils/project';
import { fetchComponent, getRegistry, RegistryItem } from '../utils/registry';

interface DiffResult {
  name: string;
  status: 'up-to-date' | 'changed' | 'local-only' | 'error';
  localFile?: string;
  registryFile?: string;
  error?: string;
}

export const diffCommand = new Command()
  .name('diff')
  .description('Check for component updates against the registry')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .option('--json', 'Output as JSON')
  .option('-v, --verbose', 'Show detailed diff information')
  .action(async (options) => {
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

      spinner.start('Scanning installed components...');

      // Get installed components
      const componentsDir = path.join(projectRoot, config.componentsPath);
      const installedFiles = await getInstalledComponents(componentsDir);

      if (installedFiles.length === 0) {
        spinner.info('No components installed yet.');
        console.log(chalk.dim('\nAdd components with: npx nativeui add <component>'));
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

      spinner.text = 'Comparing components...';
      const results: DiffResult[] = [];

      for (const localFile of installedFiles) {
        const fileName = path.basename(localFile);
        const registryItem = registryMap.get(fileName);

        if (!registryItem) {
          // Local-only component (not in registry)
          results.push({
            name: fileName.replace(/\.tsx?$/, ''),
            status: 'local-only',
            localFile: localFile,
          });
          continue;
        }

        try {
          // Fetch registry component
          const component = await fetchComponent(registryItem.name);

          if (!component) {
            results.push({
              name: registryItem.name,
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
              status: 'error',
              error: 'File not found in registry',
            });
            continue;
          }

          // Read local file
          const localContent = await fs.readFile(localFile, 'utf-8');

          // Transform registry content same way as add command
          const transformedRegistryContent = transformImports(registryFile.content, config);

          // Compare using content hash
          const localHash = hashContent(localContent);
          const registryHash = hashContent(transformedRegistryContent);

          if (localHash === registryHash) {
            results.push({
              name: registryItem.name,
              status: 'up-to-date',
              localFile: localFile,
            });
          } else {
            results.push({
              name: registryItem.name,
              status: 'changed',
              localFile: localFile,
            });
          }
        } catch (error) {
          results.push({
            name: registryItem.name,
            status: 'error',
            error: String(error),
          });
        }
      }

      spinner.stop();

      // Output results
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
        return;
      }

      printResults(results, options.verbose);
    } catch (error) {
      spinner.fail('Failed to check for updates');
      console.error(error);
      process.exit(1);
    }
  });

/**
 * Get list of installed component files
 */
async function getInstalledComponents(componentsDir: string): Promise<string[]> {
  if (!await fs.pathExists(componentsDir)) {
    return [];
  }

  const files = await fs.readdir(componentsDir);
  const componentFiles: string[] = [];

  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Skip index files
      if (file === 'index.ts' || file === 'index.tsx') {
        continue;
      }
      componentFiles.push(path.join(componentsDir, file));
    }
  }

  return componentFiles;
}

/**
 * Create hash of content for comparison
 */
function hashContent(content: string): string {
  // Normalize whitespace and line endings for comparison
  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/gm, '')  // Remove trailing whitespace
    .trim();

  return crypto.createHash('md5').update(normalized).digest('hex');
}

/**
 * Transform import paths in component code (same as add command)
 */
function transformImports(
  code: string,
  config: ResolvedNativeUIConfig
): string {
  let transformed = code;

  const utilsAlias = config.aliases?.utils || '@/lib/utils';

  if (utilsAlias === '@/lib/utils') {
    return transformed;
  }

  transformed = transformed.replace(
    /from ['"]@\/lib\/utils['"]/g,
    `from '${utilsAlias}'`
  );

  return transformed;
}

/**
 * Print formatted results
 */
function printResults(results: DiffResult[], verbose: boolean): void {
  const upToDate = results.filter(r => r.status === 'up-to-date');
  const changed = results.filter(r => r.status === 'changed');
  const localOnly = results.filter(r => r.status === 'local-only');
  const errors = results.filter(r => r.status === 'error');

  console.log();
  console.log(chalk.bold('Component Diff Report'));
  console.log(chalk.dim('─'.repeat(40)));
  console.log();

  // Summary counts
  const total = results.length;
  console.log(`Found ${chalk.bold(total)} installed component${total !== 1 ? 's' : ''}`);
  console.log();

  // Changed components (updates available)
  if (changed.length > 0) {
    console.log(chalk.yellow(`⚡ ${changed.length} update${changed.length !== 1 ? 's' : ''} available:`));
    for (const item of changed) {
      console.log(`   ${chalk.yellow('●')} ${item.name}`);
    }
    console.log();
    console.log(chalk.dim('   Update with: npx nativeui add <component> --overwrite'));
    console.log();
  }

  // Up to date
  if (upToDate.length > 0) {
    console.log(chalk.green(`✓ ${upToDate.length} up to date:`));
    if (verbose) {
      for (const item of upToDate) {
        console.log(`   ${chalk.green('●')} ${item.name}`);
      }
    } else {
      const names = upToDate.map(r => r.name).join(', ');
      console.log(chalk.dim(`   ${names}`));
    }
    console.log();
  }

  // Local-only components
  if (localOnly.length > 0) {
    console.log(chalk.blue(`◐ ${localOnly.length} local-only (not in registry):`));
    for (const item of localOnly) {
      console.log(`   ${chalk.blue('●')} ${item.name}`);
    }
    console.log();
  }

  // Errors
  if (errors.length > 0) {
    console.log(chalk.red(`✗ ${errors.length} error${errors.length !== 1 ? 's' : ''}:`));
    for (const item of errors) {
      console.log(`   ${chalk.red('●')} ${item.name}: ${chalk.dim(item.error)}`);
    }
    console.log();
  }

  // Final summary
  if (changed.length === 0 && errors.length === 0) {
    console.log(chalk.green('All registry components are up to date!'));
  } else if (changed.length > 0) {
    console.log(
      chalk.yellow(`Run ${chalk.cyan('npx nativeui add ' + changed.map(c => c.name).join(' ') + ' --overwrite')} to update`)
    );
  }
}
