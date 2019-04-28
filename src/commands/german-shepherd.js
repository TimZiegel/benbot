import { SubredditImageCommand } from '../lib/command';

export class GermanShepherdCommand extends SubredditImageCommand {
	command = 'germanshepherd';
	subreddit = 'germanshepherds';

	constructor() {
		super();
	}
}

export const germanShepherdCommand = new GermanShepherdCommand();
