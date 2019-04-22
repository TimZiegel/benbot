import { getRandom } from '../lib/utils';
import { RandomDataCommand } from '../lib/command';
import { postMessage } from '../lib/bot';

export class GoodbyeCommand extends RandomDataCommand {
	data = [
		":( Bye ${name}...",
    "*sniff* Bye ${name}...",
    "*waves goodbye*",
    "Farewell ${name}!",
    "Was it something I said...?",
    "Good journey, ${name}.",
    "Godspeed, ${name}.",
    "Why, ${name}?! Whyyyy?!",
    "Aw man... I'm gonna cry...",
    "Guys... Don't be alarmed, but I think ${name} was just kidnapped by the mole people.",
    "*Those we love don't go away. They walk beside us every day... Unseen, unheard, but always near. Still loved, still missed, and very dear.*",
    "I miss ${name} already...",
    "*inconsolable sobbing*",
    "Awh... ${name}...",
    "Well, it was nice knowing you ${name}...",
    "Wtf, ${name} owed me five bucks!",
    "Press :regional_indicator_f: to pay respects",
    "Cheers, ${name}.",
    ":broken_heart:",
    "Walk with the earthmother, ${name}.",
    "May your days be long, and your hardships few.",
    "Light be with you, ${name}.",
    "Safe travels, ${name}.",
    "Go with honor, friend.",
    "That's a big oof, dawg."
	];

  constructor() {
    super();
  }

	run(member) {
	  const channel = member.guild.channels.first();
	  const random = getRandom(this.data);
		const replacements = {
	    name: member.displayName,
	    NAME: member.displayName.toUpperCase()
	  };
	  const text = this.formatText(random, replacements)
		this.post(text, { channel });
	}
}
