import { Permissions } from 'discord.js';
import { RandomSpawnCommand } from './command';
import env from './env';

const { TEST_SERVER } = env;

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

export const humanize = number => {
	return (number || 0).toLocaleString('en-US');
};

export const canPostInChannel = (channel, user) => {
  const permissions = channel.memberPermissions(user);
  return permissions && permissions.has(Permissions.FLAGS.SEND_MESSAGES);
};

export const checkRandomSpawns = (message, commands) => {
  const randomSpawnCommands = commands.filter(command => command instanceof RandomSpawnCommand);
  const anySpawned = randomSpawnCommands.some(command => command.isSpawned());
  if (!anySpawned) {
    randomSpawnCommands
      .sort(() => .5 - Math.random())
      .some(command => command.onMessage(message));
  }
};