import { SubredditImageCommand } from '../lib/command';

export class DrinkCommand extends SubredditImageCommand {
	command = 'drink';
	subreddit = 'beerporn+cocktails';
	help = 'Displays a random image of an alcoholic beverage.';
	example = '!drink';

	constructor() {
		super();
	}
}

export const drinkCommand = new DrinkCommand();
