import { RandomDataCommand } from '../lib/command';

export class ShaqurenCommand extends RandomDataCommand {
	secret = true;
	command = 'shaquren';
	help = 'Displays an image of Shaq, if he were Hak.';
	example = '!shaquren';

	data = [
		"https://i.imgur.com/INT9lGc.jpg"
	];

	constructor() {
		super();
	}
}

export const shaqurenCommand = new ShaqurenCommand();
