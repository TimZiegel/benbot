import { SubredditImageCommand } from '../lib/command';

export class HuskyCommand extends SubredditImageCommand {
	command = 'husky';
	subreddit = 'husky+siberianhusky';
	help = 'Displays a random image of a husky.';
	example = '!husky';

	constructor() {
		super();
	}
}

export const huskyCommand = new HuskyCommand();
