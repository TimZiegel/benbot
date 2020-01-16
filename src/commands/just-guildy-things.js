import { RandomDataCommand } from "../lib/command";

export class JustGuildyThingsCommand extends RandomDataCommand {
  command = "justguildythings";
  aliases = ["guild"];
  help = "Displays a dumb meme about the guild.";
  example = "!justguildythings";

  data = [
    "https://i.imgur.com/2d5LAOa.jpg",
    "https://i.imgur.com/iLeV9H5.jpg",
    "https://i.imgur.com/nzM8vLs.jpg",
    "https://i.imgur.com/YRRQOz8.jpg",
    "https://i.imgur.com/yooHew4.jpg"
  ];

  constructor() {
    super();
  }
}

export const justGuildyThingsCommand = new JustGuildyThingsCommand();
