import { Command } from '../lib/command';
import { commands } from '../lib/commands';

const { COMMAND_PREFIX } = process.env;

export class BenbotCommand extends Command {
	preamble = 'Benbot, at your service! Currently, I support these commands: ';
	command = 'benbot';
	aliases = ['help'];

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
