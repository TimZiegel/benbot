import env from './lib/env';
import { bot } from './lib/bot';
import { isTestBot, checkRandomSpawns } from './lib/utils';
import { commands } from './lib/commands';
import { RandomSpawnCommand } from './lib/command';
import { goodbyeCommand } from './commands/goodbye';
import { messageReactionCommand } from './commands/message-reaction';

const { DISCORD_TOKEN, TEST_DISCORD_TOKEN } = env;

const onMessage = message => {
  if (message.author.bot) return;
  const command = commands.find(cmd => cmd && cmd.check(message));
  if (command) command.run(message);
  if (!command || !(command instanceof RandomSpawnCommand)) checkRandomSpawns(message, commands);
};

bot.on('message', message => onMessage(message));
bot.on('guildMemberRemove', member => goodbyeCommand.run(member));
bot.on('messageReactionAdd', ({ message }) => messageReactionCommand.run(message));
bot.login(isTestBot() ? TEST_DISCORD_TOKEN : DISCORD_TOKEN);
