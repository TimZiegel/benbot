import env from '../lib/env';
import { Command } from '../lib/command';
import { commands } from '../lib/commands';

const { COMMAND_PREFIX } = env;

export class BenbotCommand extends Command {
	command = 'benbot';
	aliases = ['help'];
	help = 'Show a list of all commands that Benbot can execute.';
	example = '!benbot';
	preamble = 'Benbot, at your service! Currently, I support these commands: ';

	constructor() {
		super();
	}

	run(message) {
		const names = commands
			.filter(({ secret, command }) => (
				!secret &&
				command &&
				command !== 'benbot'
			))
			.map(({ command }) => `${COMMAND_PREFIX}${command}`)
			.join('\n');
		const text = this.preamble + '```' + names + '```';
    this.post(text, message);
	}
}

export const benbotCommand = new BenbotCommand();
