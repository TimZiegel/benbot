import { SubredditImageCommand } from '../lib/command';

export class AwwCommand extends SubredditImageCommand {
	command = 'aww';
	subreddit = 'aww+rarepuppers+kitty+corgi+awwgifs+aww_gifs+eyebleach';

	constructor() {
		super();
	}
}

export const awwCommand = new AwwCommand();
