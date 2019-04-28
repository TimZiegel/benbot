import { RandomDataCommand } from '../lib/command';

export class FartCommand extends RandomDataCommand {
	secret = true;
	command = 'fart';

	data = [
		"Ummmmm...",
		"That's... Not a command, dude.",
		"...Why?",
		"Do you really want to see that? I mean really.",
		"Gross, dude.",
		"I dunno what you're expecting, but I can't help you.",
		"Well this is a new low...",
		"Gross, ${name}."
	];

	constructor() {
		super();
	}
}

export const fartCommand = new FartCommand();
