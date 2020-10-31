import { SubredditImageCommand } from '../lib/command';

export class AwwCommand extends SubredditImageCommand {
	command = 'aww';
	subreddit = 'aww+rarepuppers+kitty+corgi+awwgifs+aww_gifs+eyebleach';
	help = 'The !aww command displays a random image of something cute & cuddly from reddit.';
	example = '!aww';

	constructor() {
		super();
	}
}

export const awwCommand = new AwwCommand();
