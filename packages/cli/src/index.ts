import { Command } from 'commander';
import chalk from 'chalk';
import { handleError } from './utils/errors';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { doctorCommand } from './commands/doctor';
import { diffCommand } from './commands/diff';
import { updateCommand } from './commands/update';
import { createCommand } from './commands/create';
import { pickCommand } from './commands/pick';

const program = new Command();

program
  .name('mcellui')
  .description('Add beautiful UI components to your Expo/React Native project')
  .version('0.1.4');

program.configureOutput({
  writeOut: (str) => process.stdout.write(str),
  writeErr: (str) => process.stderr.write(str),
  outputError: (str, write) => write(chalk.red(str)),
});

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);
program.addCommand(diffCommand);
program.addCommand(updateCommand);
program.addCommand(createCommand);
program.addCommand(pickCommand);

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    handleError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      hint: 'If this persists, run: npx mcellui doctor',
    });
  }
}

main();
