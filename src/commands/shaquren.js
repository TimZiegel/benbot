import { RandomDataCommand } from '../lib/command';

export class ShaqurenCommand extends RandomDataCommand {
	secret = true;
	command = 'shaquren';
	help = `The !shaquren command displays an image of Hak, if he were Shaq.`;
	example = '!shaquren';

	data = [
		"https://i.imgur.com/INT9lGc.jpg"
	];

	constructor() {
		super();
	}
}

export const shaqurenCommand = new ShaqurenCommand();
