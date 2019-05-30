import { Command } from '../lib/command';

export class MessageReactionCommand extends Command {
	secret = true;
	help = 'Reacts to a message. Benbot just wants to be part of the fun.';
	example = '';
	
	constructor() {
		super();
	}

	run(message) {
		if (message.reactions.array().length === 3) {
			message
				.react('🤖')
				.catch(e => console.error(`Message reaction error: ${e}`));
		}
	}
}

export const messageReactionCommand = new MessageReactionCommand();
