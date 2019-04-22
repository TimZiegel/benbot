import { SubredditImageCommand } from '../lib/command';

export class HuskyCommand extends SubredditImageCommand {
	command = 'husky';
	subreddit = 'husky+siberianhusky';

	constructor() {
		super();
	}
}
