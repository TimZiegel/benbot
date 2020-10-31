import { Command } from '../lib/command';
import { getBotUser } from '../lib/bot';
import { canPostInChannel } from '../lib/utils';

export class MessageReactionCommand extends Command {
	secret = true;
	help = 'This command reacts to a message. Benbot wants to be part of the fun, too!';
	
	constructor() {
		super();
	}

	async run(message) {
    const botUser = await getBotUser();
    if (canPostInChannel(message.channel, botUser) && message.reactions.array().length === 3) {
			message
				.react('🤖')
				.catch(e => console.error(`Message reaction error: ${e}`));
		}
	}
}

export const messageReactionCommand = new MessageReactionCommand();
