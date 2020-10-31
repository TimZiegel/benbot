import env from '../lib/env';
import { Command } from '../lib/command';
import { commands } from '../lib/commands';
import { removeCommand } from '../lib/utils';

const { COMMAND_PREFIX } = env;

export class HelpCommand extends Command {
  command = 'help';
  help = 'Ha ha, very funny. You can use this command to learn how to use other commands.';
  example = '!help loot';
  aliases = ['benbot'];
	preamble = 'Benbot, at your service! Currently, I support the following commands. You can use !help [command] to find out more about a specific command.';

	constructor() {
		super();
	}

	run(message) {
    const messageContent = removeCommand(message.content, this.command, this.aliases);

    const query = messageContent.replace(new RegExp(`^${COMMAND_PREFIX}`, 'i'), '').toLowerCase();
    if (!query) {
      // Post generic help message with list of commands
      const names = commands
        .filter(({ secret, command }) => !secret && command)
        .map(({ command }) => `${COMMAND_PREFIX}${command}`)
        .join('\n');
      const text = this.preamble + '```' + names + '```';
      return this.post(text, message);
    }

    const subject = commands.find(({ command, aliases }) => [command, ...aliases].includes(query));
    if (subject && subject.command && subject.help) {
      // Post help message for a specific command
      const example = subject.example || `${COMMAND_PREFIX}${subject.command}`;
      const text = `${subject.help}\n\nExample: ${example}`;
      return this.post(text, message);
    }

    this.post(`Sorry, I don't know how to help with that. Are you sure you spelled it correctly?`);
	}
}

export const helpCommand = new HelpCommand();
