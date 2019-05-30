import { SubredditImageCommand } from '../lib/command';

export class GermanShepherdCommand extends SubredditImageCommand {
	command = 'germanshepherd';
	subreddit = 'germanshepherds';
	help = 'Displays a random image of a German Shepherd.';
	example = '!germanshepherd';

	constructor() {
		super();
	}
}

export const germanShepherdCommand = new GermanShepherdCommand();
