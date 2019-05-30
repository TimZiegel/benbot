import { RandomDataCommand } from '../lib/command';

export class BlingtronCommand extends RandomDataCommand {
	command = 'blingtron';
	help = 'Shows a dumb picture of blingtron.';
	example = '!blingtron';

	data = [
		"https://i.imgur.com/mvYPZti.png"
	];

	constructor() {
		super();
	}
}

export const blingtronCommand = new BlingtronCommand();
