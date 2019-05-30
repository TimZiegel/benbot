import dayjs from 'dayjs';
import { Command } from '../lib/command';
import { lootCommand } from './loot';

export class LootStatusCommand extends Command {
  secret = true;
  command = 'lootstatus';
  help = 'Shh. This is a secret command.';

	constructor() {
		super();
	}

	run(message) {
    const timestamp = dayjs(lootCommand.lootTimestamp)
    const time = timestamp.format('h:mma ddd MMM D, YYYY');
    const isFuture = dayjs().isBefore(timestamp);
    const when = isFuture ? 'Next' : 'Last';

    const embedOptions = {
      title: 'Status:',
      description: lootCommand.lootStatus,
      footer: {
        text: `${when}: ${time}`
      }
    };

		this.postEmbed(embedOptions, message);
	}
}

export const lootStatusCommand = new LootStatusCommand();
