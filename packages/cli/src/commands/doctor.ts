import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import {
  getProjectRoot,
  detectProjectType,
  readPackageJson,
  detectPackageManager,
  ProjectType,
} from '../utils/project';
import { handleError, errors } from '../utils/errors';

type CheckStatus = 'pass' | 'warn' | 'fail';

interface CheckResult {
  name: string;
  status: CheckStatus;
  message: string;
  fix?: string;
}

interface DoctorReport {
  projectRoot: string;
  projectType: ProjectType;
  packageManager: string;
  checks: CheckResult[];
  passed: number;
  warnings: number;
  failed: number;
}

const REQUIRED_PEER_DEPS = [
  { name: 'react-native-reanimated', minVersion: '3.0.0' },
  { name: 'react-native-gesture-handler', minVersion: '2.0.0' },
  { name: 'react-native-safe-area-context', minVersion: '4.0.0' },
];

const RECOMMENDED_DEPS = [
  { name: '@metacells/mcellui-core', reason: 'Theme system and utilities' },
];

/**
 * Parse a semver version string into comparable parts
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
  // Remove leading ^ ~ >= etc and handle workspace: protocol
  const cleaned = version.replace(/^[\^~>=<]+/, '').replace(/^workspace:\*?/, '');
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Check if version meets minimum requirement
 */
function meetsMinVersion(current: string, minimum: string): boolean {
  const currentParsed = parseVersion(current);
  const minimumParsed = parseVersion(minimum);

  if (!currentParsed || !minimumParsed) return true; // Can't compare, assume OK

  if (currentParsed.major > minimumParsed.major) return true;
  if (currentParsed.major < minimumParsed.major) return false;
  if (currentParsed.minor > minimumParsed.minor) return true;
  if (currentParsed.minor < minimumParsed.minor) return false;
  return currentParsed.patch >= minimumParsed.patch;
}

/**
 * Check project structure and dependencies
 */
async function checkProjectStructure(projectRoot: string): Promise<CheckResult> {
  const packageJson = await readPackageJson(projectRoot);

  if (!packageJson) {
    return {
      name: 'Project Structure',
      status: 'fail',
      message: 'No package.json found',
      fix: 'Run this command in a valid Node.js project',
    };
  }

  return {
    name: 'Project Structure',
    status: 'pass',
    message: 'Valid package.json found',
  };
}

/**
 * Check if project is Expo or React Native
 */
async function checkProjectType(projectRoot: string): Promise<CheckResult> {
  const projectType = await detectProjectType(projectRoot);

  if (projectType === 'unknown') {
    return {
      name: 'Project Type',
      status: 'fail',
      message: 'Not an Expo or React Native project',
      fix: 'mcellui requires Expo or React Native',
    };
  }

  return {
    name: 'Project Type',
    status: 'pass',
    message: projectType === 'expo' ? 'Expo project detected' : 'React Native project detected',
  };
}

/**
 * Check if mcellui is initialized
 */
async function checkInitialized(projectRoot: string): Promise<CheckResult> {
  // Check for config file existence (new name first, then legacy)
  const configFiles = [
    'mcellui.config.ts',
    'mcellui.config.js',
    'mcellui.config.json',
    'nativeui.config.ts',  // Legacy
    'nativeui.config.js',  // Legacy
    'nativeui.config.json', // Legacy
  ];

  let foundConfig: string | null = null;
  let isLegacy = false;
  for (const file of configFiles) {
    if (await fs.pathExists(path.join(projectRoot, file))) {
      foundConfig = file;
      isLegacy = file.startsWith('nativeui.');
      break;
    }
  }

  if (!foundConfig) {
    return {
      name: 'mcellui Config',
      status: 'fail',
      message: 'mcellui.config.ts not found',
      fix: 'Run: npx mcellui init',
    };
  }

  if (isLegacy) {
    return {
      name: 'mcellui Config',
      status: 'warn',
      message: `Found legacy config: ${foundConfig}`,
      fix: 'Consider renaming to mcellui.config.ts',
    };
  }

  // Read the config file and do basic validation
  try {
    const configPath = path.join(projectRoot, foundConfig);
    const content = await fs.readFile(configPath, 'utf-8');

    // Basic checks for TypeScript/JavaScript config
    if (foundConfig.endsWith('.ts') || foundConfig.endsWith('.js')) {
      const hasDefineConfig = content.includes('defineConfig');
      const hasExport = content.includes('export default');

      if (!hasExport) {
        return {
          name: 'mcellui Config',
          status: 'warn',
          message: 'Config file missing default export',
          fix: 'Add: export default defineConfig({ ... })',
        };
      }

      if (!hasDefineConfig) {
        return {
          name: 'mcellui Config',
          status: 'warn',
          message: 'Config not using defineConfig helper',
          fix: 'Wrap config with: defineConfig({ ... })',
        };
      }
    }

    // For JSON, try to parse it
    if (foundConfig.endsWith('.json')) {
      try {
        JSON.parse(content);
      } catch {
        return {
          name: 'mcellui Config',
          status: 'fail',
          message: 'Invalid JSON in config file',
          fix: 'Check JSON syntax in mcellui.config.json',
        };
      }
    }

    return {
      name: 'mcellui Config',
      status: 'pass',
      message: `Found ${foundConfig}`,
    };
  } catch (error) {
    return {
      name: 'mcellui Config',
      status: 'fail',
      message: 'Could not read config file',
      fix: error instanceof Error ? error.message : 'Check file permissions',
    };
  }
}

/**
 * Check if configured paths exist
 */
async function checkPaths(projectRoot: string): Promise<CheckResult> {
  // Default paths used by mcellui
  const defaultComponentsPath = './components/ui';
  const defaultUtilsPath = './lib/utils';

  // Try to read componentsPath from config file
  let componentsPathValue = defaultComponentsPath;
  let utilsPathValue = defaultUtilsPath;

  // Check common config file locations (new name first, then legacy)
  const configFiles = [
    'mcellui.config.ts',
    'mcellui.config.js',
    'mcellui.config.json',
    'nativeui.config.ts',
    'nativeui.config.js',
    'nativeui.config.json',
  ];
  for (const file of configFiles) {
    const configPath = path.join(projectRoot, file);
    if (await fs.pathExists(configPath)) {
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        // Simple regex extraction for componentsPath
        const componentsMatch = content.match(/componentsPath:\s*['"]([^'"]+)['"]/);
        const utilsMatch = content.match(/utilsPath:\s*['"]([^'"]+)['"]/);
        if (componentsMatch) componentsPathValue = componentsMatch[1];
        if (utilsMatch) utilsPathValue = utilsMatch[1];
      } catch {
        // Ignore read errors
      }
      break;
    }
  }

  const componentsPath = path.join(projectRoot, componentsPathValue);
  const utilsPath = path.join(projectRoot, utilsPathValue);

  const componentsExist = await fs.pathExists(componentsPath);
  const utilsExist = await fs.pathExists(utilsPath);

  if (!componentsExist && !utilsExist) {
    return {
      name: 'Component Paths',
      status: 'warn',
      message: 'Component and utils directories not created yet',
      fix: `Add a component: npx mcellui add button`,
    };
  }

  if (!componentsExist) {
    return {
      name: 'Component Paths',
      status: 'warn',
      message: `Components directory not found: ${componentsPathValue}`,
      fix: 'Add a component to create it: npx mcellui add button',
    };
  }

  return {
    name: 'Component Paths',
    status: 'pass',
    message: `Components: ${componentsPathValue}`,
  };
}

/**
 * Check required peer dependencies
 */
async function checkPeerDependencies(projectRoot: string): Promise<CheckResult[]> {
  const packageJson = await readPackageJson(projectRoot);
  const results: CheckResult[] = [];

  if (!packageJson) return results;

  const deps = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };

  for (const { name, minVersion } of REQUIRED_PEER_DEPS) {
    const version = deps[name];

    if (!version) {
      results.push({
        name: `Dependency: ${name}`,
        status: 'fail',
        message: 'Not installed',
        fix: `Run: npx expo install ${name}`,
      });
      continue;
    }

    if (!meetsMinVersion(version, minVersion)) {
      results.push({
        name: `Dependency: ${name}`,
        status: 'warn',
        message: `Version ${version} may be outdated (recommended: >=${minVersion})`,
        fix: `Run: npx expo install ${name}`,
      });
      continue;
    }

    results.push({
      name: `Dependency: ${name}`,
      status: 'pass',
      message: `Installed (${version})`,
    });
  }

  return results;
}

/**
 * Check recommended dependencies
 */
async function checkRecommendedDependencies(projectRoot: string): Promise<CheckResult[]> {
  const packageJson = await readPackageJson(projectRoot);
  const results: CheckResult[] = [];

  if (!packageJson) return results;

  const deps = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };

  for (const { name, reason } of RECOMMENDED_DEPS) {
    const version = deps[name];

    if (!version) {
      results.push({
        name: `Dependency: ${name}`,
        status: 'warn',
        message: `Not installed - ${reason}`,
        fix: `Run: npm install ${name}`,
      });
    } else {
      results.push({
        name: `Dependency: ${name}`,
        status: 'pass',
        message: `Installed (${version})`,
      });
    }
  }

  return results;
}

/**
 * Check Babel configuration for Reanimated plugin
 */
async function checkBabelConfig(projectRoot: string): Promise<CheckResult> {
  const babelConfigPaths = [
    'babel.config.js',
    'babel.config.cjs',
    'babel.config.mjs',
    '.babelrc',
    '.babelrc.js',
  ];

  let babelConfigPath: string | null = null;
  let babelContent: string | null = null;

  for (const configFile of babelConfigPaths) {
    const fullPath = path.join(projectRoot, configFile);
    if (await fs.pathExists(fullPath)) {
      babelConfigPath = configFile;
      babelContent = await fs.readFile(fullPath, 'utf-8');
      break;
    }
  }

  if (!babelConfigPath || !babelContent) {
    return {
      name: 'Babel Config',
      status: 'warn',
      message: 'No babel.config.js found',
      fix: 'Create babel.config.js with Reanimated plugin',
    };
  }

  // Check for Reanimated plugin
  const hasReanimatedPlugin =
    babelContent.includes('react-native-reanimated/plugin') ||
    babelContent.includes("'react-native-reanimated/plugin'") ||
    babelContent.includes('"react-native-reanimated/plugin"');

  if (!hasReanimatedPlugin) {
    return {
      name: 'Babel Config',
      status: 'fail',
      message: 'Reanimated plugin not configured',
      fix: `Add 'react-native-reanimated/plugin' to plugins in ${babelConfigPath}`,
    };
  }

  return {
    name: 'Babel Config',
    status: 'pass',
    message: 'Reanimated plugin configured',
  };
}

/**
 * Check TypeScript configuration
 */
async function checkTypeScript(projectRoot: string): Promise<CheckResult> {
  const tsconfigPath = path.join(projectRoot, 'tsconfig.json');

  if (!(await fs.pathExists(tsconfigPath))) {
    return {
      name: 'TypeScript',
      status: 'warn',
      message: 'No tsconfig.json found',
      fix: 'TypeScript is recommended but not required',
    };
  }

  try {
    const tsconfig = await fs.readJson(tsconfigPath);
    const hasPathAliases = tsconfig.compilerOptions?.paths;

    if (!hasPathAliases) {
      return {
        name: 'TypeScript',
        status: 'warn',
        message: 'No path aliases configured',
        fix: 'Consider adding @/* path alias for cleaner imports',
      };
    }

    const hasComponentsAlias =
      hasPathAliases['@/components/*'] || hasPathAliases['@/components'];
    const hasUtilsAlias = hasPathAliases['@/lib/*'] || hasPathAliases['@/*'];

    if (!hasComponentsAlias) {
      return {
        name: 'TypeScript',
        status: 'warn',
        message: 'Missing @/components path alias',
        fix: 'Add "@/components/*": ["./components/*"] to tsconfig.json paths',
      };
    }

    return {
      name: 'TypeScript',
      status: 'pass',
      message: 'Configured with path aliases',
    };
  } catch {
    return {
      name: 'TypeScript',
      status: 'warn',
      message: 'Could not parse tsconfig.json',
    };
  }
}

/**
 * Check for Expo Go compatibility issues
 */
async function checkExpoGo(projectRoot: string): Promise<CheckResult | null> {
  const projectType = await detectProjectType(projectRoot);

  if (projectType !== 'expo') return null;

  const packageJson = await readPackageJson(projectRoot);
  if (!packageJson) return null;

  const deps = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };

  // Check for common Expo Go incompatible packages
  const incompatiblePackages = [
    'react-native-mmkv',
    '@shopify/flash-list', // Now compatible, but leaving as example pattern
  ];

  const foundIncompatible = incompatiblePackages.filter((pkg) => deps[pkg]);

  if (foundIncompatible.length > 0) {
    return {
      name: 'Expo Go Compatibility',
      status: 'warn',
      message: `Packages may require dev build: ${foundIncompatible.join(', ')}`,
      fix: 'Run: npx expo prebuild for native features',
    };
  }

  return {
    name: 'Expo Go Compatibility',
    status: 'pass',
    message: 'No known incompatibilities detected',
  };
}

/**
 * Format and print the doctor report
 */
function printReport(report: DoctorReport): void {
  console.log();
  console.log(chalk.bold('mcellui Doctor'));
  console.log(chalk.dim('Checking your project setup...'));
  console.log();

  // Project info
  console.log(chalk.dim('Project:'), report.projectRoot);
  console.log(chalk.dim('Type:'), report.projectType);
  console.log(chalk.dim('Package Manager:'), report.packageManager);
  console.log();

  // Results
  console.log(chalk.bold('Checks'));
  console.log();

  for (const check of report.checks) {
    const icon =
      check.status === 'pass'
        ? chalk.green('✓')
        : check.status === 'warn'
          ? chalk.yellow('!')
          : chalk.red('✗');

    const statusColor =
      check.status === 'pass'
        ? chalk.green
        : check.status === 'warn'
          ? chalk.yellow
          : chalk.red;

    console.log(`  ${icon} ${chalk.white(check.name)}`);
    console.log(`    ${statusColor(check.message)}`);

    if (check.fix && check.status !== 'pass') {
      console.log(chalk.dim(`    Fix: ${check.fix}`));
    }
  }

  console.log();

  // Summary
  const summaryParts = [];
  if (report.passed > 0) {
    summaryParts.push(chalk.green(`${report.passed} passed`));
  }
  if (report.warnings > 0) {
    summaryParts.push(chalk.yellow(`${report.warnings} warnings`));
  }
  if (report.failed > 0) {
    summaryParts.push(chalk.red(`${report.failed} failed`));
  }

  console.log(chalk.bold('Summary:'), summaryParts.join(', '));
  console.log();

  if (report.failed > 0) {
    console.log(chalk.red('Some checks failed. Please fix the issues above.'));
  } else if (report.warnings > 0) {
    console.log(chalk.yellow('Your project has some warnings but should work.'));
  } else {
    console.log(chalk.green('Your project is properly configured!'));
  }

  console.log();
}

export const doctorCommand = new Command()
  .name('doctor')
  .description('Check project setup and diagnose common issues')
  .option('--cwd <path>', 'Working directory', process.cwd())
  .option('--json', 'Output results as JSON')
  .action(async (options) => {
    try {
      const cwd = path.resolve(options.cwd);
      const projectRoot = await getProjectRoot(cwd);

      if (!projectRoot) {
        errors.noProject();
      }

      const projectType = await detectProjectType(projectRoot);
      const packageManager = await detectPackageManager(projectRoot);

      // Run all checks
      const checks: CheckResult[] = [];

      // Core checks
      checks.push(await checkProjectStructure(projectRoot));
      checks.push(await checkProjectType(projectRoot));
      checks.push(await checkInitialized(projectRoot));
      checks.push(await checkPaths(projectRoot));

      // Dependency checks
      checks.push(...(await checkPeerDependencies(projectRoot)));
      checks.push(...(await checkRecommendedDependencies(projectRoot)));

      // Configuration checks
      checks.push(await checkBabelConfig(projectRoot));
      checks.push(await checkTypeScript(projectRoot));

      // Expo-specific checks
      const expoGoCheck = await checkExpoGo(projectRoot);
      if (expoGoCheck) {
        checks.push(expoGoCheck);
      }

      // Calculate summary
      const passed = checks.filter((c) => c.status === 'pass').length;
      const warnings = checks.filter((c) => c.status === 'warn').length;
      const failed = checks.filter((c) => c.status === 'fail').length;

      const report: DoctorReport = {
        projectRoot,
        projectType,
        packageManager,
        checks,
        passed,
        warnings,
        failed,
      };

      if (options.json) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        printReport(report);
      }

      // Exit with error code if there are failures
      if (failed > 0) {
        process.exit(1);
      }
    } catch (error) {
      handleError({
        message: 'Doctor check failed',
        hint: error instanceof Error ? error.message : 'Run again with --json for details',
      });
    }
  });
