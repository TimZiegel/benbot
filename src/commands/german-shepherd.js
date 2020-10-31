import { SubredditImageCommand } from '../lib/command';

export class GermanShepherdCommand extends SubredditImageCommand {
	command = 'germanshepherd';
	subreddit = 'germanshepherds';
	help = 'The !germanshepherd command displays a random image of a German Shepherd from reddit.';
	example = '!germanshepherd';

	constructor() {
		super();
	}
}

export const germanShepherdCommand = new GermanShepherdCommand();
