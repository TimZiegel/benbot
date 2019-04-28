import { RandomDataCommand } from '../lib/command';

export class ShaqFuCommand extends RandomDataCommand {
	secret = true;
	command = 'shaqfu';

	data = [
		"https://i.imgur.com/LYb3pcB.jpg",
		"https://i.imgur.com/ubRZTHM.jpg",
		"https://i.imgur.com/4kj6v.jpg",
		"https://i.imgur.com/3ftg46c.jpg",
		"https://i.imgur.com/u36mz.jpg",
		"https://i.imgur.com/s1NwAV3.jpg",
		"https://i.imgur.com/fjCTWqP.jpg"
	];

	constructor() {
		super();
	}
}

export const shaqFuCommand = new ShaqFuCommand();
