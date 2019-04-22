import { RandomDataCommand } from '../lib/command';

export class JustGuildyThingsCommand extends RandomDataCommand {
	command = 'justguildythings';

	data = [
		"https://i.imgur.com/2d5LAOa.jpg",
		"https://i.imgur.com/iLeV9H5.jpg"
	];

	constructor() {
		super();
	}
}
