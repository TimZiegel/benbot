import { Command } from '../lib/command';

export class MessageReactionCommand extends Command {
	
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
