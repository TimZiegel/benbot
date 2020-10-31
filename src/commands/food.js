import { SubredditImageCommand } from '../lib/command';

export class FoodCommand extends SubredditImageCommand {
	command = 'food';
	subreddit = 'foodporn+food';
	help = 'The !food command displays a random image of some delicious food from reddit.';
	example = '!food';

	constructor() {
		super();
	}
}

export const foodCommand = new FoodCommand();
