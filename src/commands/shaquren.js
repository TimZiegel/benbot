import { RandomDataCommand } from '../lib/command';

export class ShaqurenCommand extends RandomDataCommand {
	secret = true;
	command = 'shaquren';

	data = [
		"https://i.imgur.com/INT9lGc.jpg"
	];

	constructor() {
		super();
	}
}
