import { SubredditImageCommand } from '../lib/command';

export class HuskyCommand extends SubredditImageCommand {
	command = 'husky';
	subreddit = 'husky+siberianhusky';
	help = 'The !husky command displays a random image of a husky from reddit.';
	example = '!husky';

	constructor() {
		super();
	}
}

export const huskyCommand = new HuskyCommand();
