import { RandomDataCommand } from '../lib/command';

export class ChristmasCommand extends RandomDataCommand {
	secret = true;
	command = 'christmas';

	data = [
		"https://i.imgur.com/Qy1hQjM.png"
	];

	constructor() {
		super();
	}
}

export const christmasCommand = new ChristmasCommand();
