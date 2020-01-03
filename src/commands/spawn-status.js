import dayjs from "dayjs";
import { Command, RandomSpawnCommand } from "../lib/command";
import { commands } from "../lib/commands";
import env from "../lib/env";

const { COMMAND_PREFIX } = env;

export class SpawnStatusCommand extends Command {
  secret = true;
  command = "spawnstatus";
  help = "Shh. This is a secret command.";

  constructor() {
    super();
  }

  run(message) {
    const commandIntentRegex = new RegExp(
      `^\\${COMMAND_PREFIX}${this.command}`,
      "i"
    );
    const commandIntent = message.content.replace(commandIntentRegex, '').trim();
    const commandRegex = new RegExp(`^${commandIntent}$`, "i");
    const command = commands
      .filter(command => command instanceof RandomSpawnCommand)
      .find(({ command }) => command.match(commandRegex));
      
    if (!command) return;

    const timestamp = dayjs(command.spawnTimestamp);
    const time = timestamp.format("h:mma ddd MMM D, YYYY");
    const isFuture = dayjs().isBefore(timestamp);
    const when = isFuture ? "Next" : "Last";

    const embedOptions = {
      title: `Status: ${command.spawnStatus}`,
      footer: {
        text: `${when}: ${time}`
      }
    };

    this.postEmbed(embedOptions, message);
  }
}

export const spawnStatusCommand = new SpawnStatusCommand();
