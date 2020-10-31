import { SubredditImageCommand } from '../lib/command';

export class CorgiCommand extends SubredditImageCommand {
	command = 'corgi';
	subreddit = 'corgi';
	help = 'The !corgi command displays a random image of a corgi from reddit. Fun fact: this is the best command.';
	example = '!corgi';

	constructor() {
		super();
	}
}

export const corgiCommand = new CorgiCommand();
