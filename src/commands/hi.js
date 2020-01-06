import { RandomDataCommand } from "../lib/command";

export class HiCommand extends RandomDataCommand {
  command = "hi";
  aliases = ["hello"];
  help = "Says hello!";
  example = "!hi";

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
    "Hi ${name}!",
    "Good to see you, ${name}.",
    "G'day, ${name}!",
    "Howdy ${name}!",
    "Hey ${name}!",
    "Hello ${name}!",
    "Welcome, ${name}!",
    "Greetings, ${name}.",
    "Salutations, ${name}.",
    "Greetings, ${name}. I have been expecting you.",
    "Interest ya'n a pint, ${name}?",
    "Lord Admiral's favor, ${name}!",
    "Lok'tar ogar, ${name}.",
    "King's honor, ${name}.",
    "Well met, ${name}.",
    "Light be with you, ${name}."
  ];

  getData(message) {
    const { mentions } = message;
    if (mentions.members && mentions.members.size) {
      return this.data.filter(data => data.match(/\$\{name\}/i));
    }
  }
  
  constructor() {
    super();
  }
}

export const hiCommand = new HiCommand();
