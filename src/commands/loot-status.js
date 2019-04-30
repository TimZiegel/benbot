import { Command } from '../lib/command';
import { lootCommand } from './loot';

export class LootStatusCommand extends Command {
	command = 'lootstatus';
  secret = true;

	constructor() {
		super();
	}

	run(message) {
    const embedOptions = {
      title: 'Status:',
      description: lootCommand.lootStatus
    };
		this.postEmbed(embedOptions, message);
	}
}

export const lootStatusCommand = new LootStatusCommand();
