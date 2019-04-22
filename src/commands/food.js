import { SubredditImageCommand } from '../lib/command';

export class FoodCommand extends SubredditImageCommand {
	command = 'food';
	subreddit = 'foodporn+food';

	constructor() {
		super();
	}
}
