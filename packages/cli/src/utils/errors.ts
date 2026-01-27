import chalk from 'chalk';

export interface CLIError {
  message: string;
  hint?: string;
  code?: string;
  exitCode?: number;
}

/**
 * Handle CLI error by writing to stderr and exiting
 */
export function handleError(error: CLIError): never {
  process.stderr.write('\n');
  process.stderr.write(chalk.red(`Error: ${error.message}\n`));

  if (error.hint) {
    process.stderr.write('\n');
    process.stderr.write(chalk.dim(error.hint + '\n'));
  }

  process.stderr.write('\n');
  process.exit(error.exitCode ?? 1);
}

/**
 * Common error factory methods
 */
export const errors = {
  /**
   * Error when no valid project is found
   */
  noProject(): never {
    return handleError({
      message: 'Could not find a valid Expo/React Native project',
      hint: 'Run this command from a project directory containing package.json',
      code: 'NO_PROJECT',
      exitCode: 1,
    });
  },

  /**
   * Error when project is not initialized with mcellui
   */
  notInitialized(): never {
    return handleError({
      message: 'Project not initialized',
      hint: 'Run: npx mcellui init',
      code: 'NOT_INITIALIZED',
      exitCode: 1,
    });
  },

  /**
   * Error when component registry fetch fails
   */
  registryFetch(cause?: string): never {
    return handleError({
      message: 'Failed to fetch component registry',
      hint: cause ? `${cause}\n\nCheck your internet connection and try again` : 'Check your internet connection and try again',
      code: 'REGISTRY_FETCH_FAILED',
      exitCode: 1,
    });
  },

  /**
   * Error when component is not found in registry
   */
  componentNotFound(name: string): never {
    return handleError({
      message: `Component "${name}" not found in registry`,
      hint: 'Run: npx mcellui list',
      code: 'COMPONENT_NOT_FOUND',
      exitCode: 1,
    });
  },

  /**
   * Error when configuration is invalid
   */
  configInvalid(detail?: string): never {
    return handleError({
      message: 'Invalid configuration',
      hint: detail || 'Check mcellui.config.ts',
      code: 'CONFIG_INVALID',
      exitCode: 1,
    });
  },
};
