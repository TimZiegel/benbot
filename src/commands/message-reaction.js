import { Command } from '../lib/command';

export class MessageReactionCommand extends Command {
	
	constructor() {
		super();
	}

	run(message) {
		if (message.reactions.array().length === 3) {
			message
				.react('🤖')
				.catch(error => console.log(`Message reaction error: ${error}`));
		}
	}
}
