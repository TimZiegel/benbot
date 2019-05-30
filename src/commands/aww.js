import { SubredditImageCommand } from '../lib/command';

export class AwwCommand extends SubredditImageCommand {
	command = 'aww';
	subreddit = 'aww+rarepuppers+kitty+corgi+awwgifs+aww_gifs+eyebleach';
	help = 'Displays a random image of something cute & cuddly.';
	example = '!aww';

	constructor() {
		super();
	}
}

export const awwCommand = new AwwCommand();
