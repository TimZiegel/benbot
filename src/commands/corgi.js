import { SubredditImageCommand } from '../lib/command';

export class CorgiCommand extends SubredditImageCommand {
	command = 'corgi';
	subreddit = 'corgi';

	constructor() {
		super();
	}
}
