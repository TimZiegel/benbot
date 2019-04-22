import { getRandom } from '../lib/utils';
import { RandomDataCommand } from '../lib/command';

export class HiCommand extends RandomDataCommand {
  command = 'hi';
  aliases = ['hello'];

	data = [
		"Oh, uhh... Hi.",
    "Hello there.",
    "Greetings and salutations, my good fellow.",
    "Greetings, champion.",
    "Lord Admiral's favor, friend!",
    "My, you're a tall one!",
    "Ishnu-alah, weary champion!",
    "Zug zug.",
    "Lok'tar, friend. What is it you wish?",
    "Well met.",
    "Yeh got my attention.",
    "Interest ya'n a pint?",
    "Welcome, welcome. I foresee a mutually beneficial transaction.",
    "Honored, I'm sure.",
    "Good day to you.",
    "King's honor, friend.",
    "King's honor, ${name}.",
    "Good to see you, ${name}.",
    "Well met, ${name}.",
    "G'day, ${name}!",
    "Light be with you, ${name}.",
    "Hi, ${name}.",
    "Howdy ${name}!",
    "Hey ${name}.",
    "Greetings, ${name}. I have been expecting you."
	];

  constructor() {
    super();
  }

	run(message) {
	  const random = getRandom(this.data);
		const replacements = {
	    name: message.member.displayName,
	    NAME: message.member.displayName.toUpperCase()
	  };
	  const text = this.formatText(random, replacements)
		this.post(text, message);
	}
}
