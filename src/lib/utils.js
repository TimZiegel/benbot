import { Permissions } from 'discord.js';
import { RandomSpawnCommand } from './command';
import env from './env';

const { TEST_SERVER, COMMAND_PREFIX } = env;

export const getRandom = array => {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
};

export const getRandomNumberBetween = (min = 0, max = 100) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomize = array => array.sort(() => Math.random() - 0.5);

export const isImageUrl = url => {
	return (
		url &&
		url.match(/.(jpg|png|gif|gifv)/) &&
		url.match(/(i.imgur.com|i.redd.it|gfycat.com)/)
	);
};

export const isTestServer = guild => {
  return guild && guild.available && guild.id === TEST_SERVER;
};

export const isTestBot = () => {
	return process.env.NODE_ENV !== 'production';
};

export const isCommand = (message = '', commands = '', aliases = []) => {
  return [command, ...aliases].some(cmd => (
    message.match(new RegExp(`^\\${COMMAND_PREFIX}${command}\\b`, "i"))
  ));
};

export const removeCommand = (message, command = '', aliases = []) => {
  return [command, ...aliases].reduce((acc, curr) => (
    acc.replace(new RegExp(`^\\${COMMAND_PREFIX}${curr}\\s*`, "i"), '')
  ), message);
};

export const humanize = number => {
	return (number || 0).toLocaleString('en-US');
};

export const canPostInChannel = (channel, user) => {
  const permissions = channel.memberPermissions(user);
  return permissions && permissions.has(Permissions.FLAGS.SEND_MESSAGES);
};

export const checkRandomSpawns = (message, commands) => {
  const randomSpawnCommands = commands.filter(command => command instanceof RandomSpawnCommand);
  const shouldCheck = randomSpawnCommands.every(command => !command.isSpawned() && !command.isOnCooldown());

  if (shouldCheck) {
    randomSpawnCommands
      .sort(() => .5 - Math.random())
      .some(command => command.onMessage(message));
  }
};