import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('nativeui')
  .description('Add beautiful UI components to your Expo/React Native project')
  .version('0.0.1');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);

program.parse();
