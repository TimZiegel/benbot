import 'dotenv/config';
import { bot } from './lib/bot';
import { commands } from './lib/commands';
import { goodbyeCommand } from './commands/goodbye';
import { messageReactionCommand } from './commands/message-reaction';
import { lootCommand } from './commands/loot';

const { DISCORD_TOKEN } = process.env;

const onMessage = message => {
	if (message.author.bot) return;
  const command = commands.find(cmd => cmd.check(message));
  if (command) command.run(message);
  else lootCommand.checkLootMessage(message);
};

bot.on('message', message => onMessage(message));
bot.on('guildMemberRemove', member => goodbyeCommand.run(member));
bot.on('messageReactionAdd', ({ message }) => messageReactionCommand.run(message));
bot.login(DISCORD_TOKEN);
