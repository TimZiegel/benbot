import 'dotenv/config';
import { bot } from './lib/bot';
import { commands } from './lib/commands';
import { GoodbyeCommand } from './commands/goodbye';
import { MessageReactionCommand } from './commands/message-reaction';

const { DISCORD_TOKEN } = process.env;
const goodbyeCommand = new GoodbyeCommand();
const messageReactionCommand = new MessageReactionCommand();

const onMessage = message => {
	if (message.author.bot) return;
	const command = commands.find(cmd => cmd.check(message));
	if (command) command.run(message);
};

bot.on('message', message => onMessage(message));
bot.on('guildMemberRemove', member => goodbyeCommand.run(member));
bot.on('messageReactionAdd', ({ message }) => messageReactionCommand.run(message));
bot.login(DISCORD_TOKEN);
