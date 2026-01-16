import { Command } from 'commander';
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
  .name('nativeui')
  .description('Add beautiful UI components to your Expo/React Native project')
  .version('0.0.1');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);
program.addCommand(diffCommand);
program.addCommand(updateCommand);
program.addCommand(createCommand);
program.addCommand(pickCommand);

program.parse();
