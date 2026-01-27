import chalk from 'chalk';

/**
 * Log error message to stderr
 */
export function logError(message: string): void {
  process.stderr.write(chalk.red(message) + '\n');
}

/**
 * Log warning message to stderr
 */
export function logWarning(message: string): void {
  process.stderr.write(chalk.yellow(message) + '\n');
}

/**
 * Log info message to stderr
 */
export function logInfo(message: string): void {
  process.stderr.write(chalk.dim(message) + '\n');
}

/**
 * Log success message to stdout
 */
export function logSuccess(message: string): void {
  process.stdout.write(chalk.green(message) + '\n');
}
