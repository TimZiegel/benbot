import { RandomDataCommand } from '../lib/command';

export class BlingtronCommand extends RandomDataCommand {
	command = 'blingtron';

	data = [
		"https://i.imgur.com/mvYPZti.png"
	];

	constructor() {
		super();
	}
}
