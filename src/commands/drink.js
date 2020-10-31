import { SubredditImageCommand } from '../lib/command';

export class DrinkCommand extends SubredditImageCommand {
	command = 'drink';
	subreddit = 'beerporn+cocktails';
	help = 'The !drink command displays a random image of an alcoholic beverage from reddit.';
	example = '!drink';

	constructor() {
		super();
	}
}

export const drinkCommand = new DrinkCommand();
