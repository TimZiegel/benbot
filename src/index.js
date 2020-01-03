import env from './lib/env';
import { bot } from './lib/bot';
import { isTestBot } from './lib/utils';
import { commands } from './lib/commands';
import { RandomSpawnCommand } from './lib/command';
import { goodbyeCommand } from './commands/goodbye';
import { messageReactionCommand } from './commands/message-reaction';
import { lootCommand, LootCommand } from './commands/loot';

const { DISCORD_TOKEN, TEST_DISCORD_TOKEN } = env;

const onMessage = message => {
  if (message.author.bot) return;
  const command = commands.find(cmd => cmd && cmd.check(message));
  if (command) command.run(message);
  if (!command || !(command instanceof LootCommand)) lootCommand.checkForLoot(message);
  if (!command || !(command instanceof RandomSpawnCommand)) {
    commands
      .filter(command => command instanceof RandomSpawnCommand)
      .forEach(command => command.onMessage(message));
  }
};

bot.on('message', message => onMessage(message));
bot.on('guildMemberRemove', member => goodbyeCommand.run(member));
bot.on('messageReactionAdd', ({ message }) => messageReactionCommand.run(message));
bot.login(isTestBot() ? TEST_DISCORD_TOKEN : DISCORD_TOKEN);
