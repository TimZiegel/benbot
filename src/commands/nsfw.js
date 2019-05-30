import { RandomDataCommand } from '../lib/command';

export class NsfwCommand extends RandomDataCommand {
	secret = true;
	command = 'nsfw';
	aliases = ['boobs', 'butts', 'butt', 'rule34'];
	help = 'You sick fuck.';
	example = '!nsfw';

	data = [
		"I think you meant to summon Nadekobot. I know, we look so similar.",
		"Yeah, no.",
		"I'm sorry Dave. I'm afraid I can't do that.",
		"Wrong bot, dawg. Here's a picture of a kitten instead: http://i.imgur.com/YE0tJ8a.jpg",
		"Baka! Pervert~!",
		"Jesus is watching, you know.",
		"What would your mom say if she knew about this?",
		"Sorry, this image is too good to share. I'm keeping it for myself.",
		"*This post has been blocked by the FBI.*",
		"Sorry, I can't do that. I might get cooties."
	];

	constructor() {
		super();
	}
}

export const nsfwCommand = new NsfwCommand();
