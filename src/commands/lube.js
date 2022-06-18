import { RandomDataCommand } from "../lib/command";

export class LubeCommand extends RandomDataCommand {
  secret = true;
  command = "lube";
  help = `Just don't.`;
  example = "!lube";

  data = [
		"Ummmmm...",
		"That's... Not a command, dude.",
		"...Why?",
		"Gross, dude.",
		"I dunno what you're expecting, but I can't help you.",
		"Well this is a new low...",
		"Gross, ${name}.",
    "Okay, I logged in to your Amazon account and ordered 12 gallons of lube. Is there anything else I can help you with today?",
    "Am I a joke to you?"
	];

  constructor() {
    super();
  }
}

export const lubeCommand = new LubeCommand();
