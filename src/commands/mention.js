import { RandomDataCommand } from '../lib/command';
import { bot } from '../lib/bot';

export class MentionCommand extends RandomDataCommand {
  secret = true;
  
  data = [
    "...You rang?",
    "'Sup?",
    "Hey.",
    "What?",
    "What now?",
    "Yeah? What?",
    "Yeah? Whaddaya want?",
    "At your service.",
    "Hi ${name}.",
    "Hello ${name}!",
    "HEY ${NAME}!!!",
    "WHO DARES AWAKEN ME FROM MY SLUMBER?",
    "INSOLENT MORTAL!",
    "TRIFLING GNOME! YOUR ARROGANCE WILL BE YOUR UNDOING!",
    "TRIFLING ${NAME}! YOUR ARROGANCE WILL BE YOUR UNDOING!"
  ];
  
	constructor() {
		super();
  }
  
  check(message) {
    console.log(bot.user, message.isMentioned(bot.user));
    return message.isMentioned(bot.user);
  }
}
