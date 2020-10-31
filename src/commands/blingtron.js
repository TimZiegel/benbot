import { RandomDataCommand } from '../lib/command';

export class BlingtronCommand extends RandomDataCommand {
	command = 'blingtron';
	help = `The !blingtron command shows a dumb picture of blingtron. Don't ask why.`;
	example = '!blingtron';

	data = [
		"https://i.imgur.com/mvYPZti.png"
	];

	constructor() {
		super();
	}
}

export const blingtronCommand = new BlingtronCommand();
