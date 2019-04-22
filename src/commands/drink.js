import { SubredditImageCommand } from '../lib/command';

export class DrinkCommand extends SubredditImageCommand {
	command = 'drink';
	subreddit = 'beerporn+cocktails';

	constructor() {
		super();
	}
}
