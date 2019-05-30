import { SubredditImageCommand } from '../lib/command';

export class FoodCommand extends SubredditImageCommand {
	command = 'food';
	subreddit = 'foodporn+food';
	help = 'Displays a random image of some delicious food.';
	example = '!food';

	constructor() {
		super();
	}
}

export const foodCommand = new FoodCommand();
