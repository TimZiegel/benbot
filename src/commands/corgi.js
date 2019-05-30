import { SubredditImageCommand } from '../lib/command';

export class CorgiCommand extends SubredditImageCommand {
	command = 'corgi';
	subreddit = 'corgi';
	help = 'Displays a random image of a corgi. Fun fact: this is the best command.';
	example = '!corgi';

	constructor() {
		super();
	}
}

export const corgiCommand = new CorgiCommand();
