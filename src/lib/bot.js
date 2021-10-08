import { Client, RichEmbed } from 'discord.js';

export const bot = new Client();

const botUser = new Promise(resolve => bot.on('ready', () => resolve(bot.user)));

export const getBotUser = () => botUser;

export const postMessage = async (message, channel, editMessage) => {
  if (!message || !channel) throw new Error('Could not post message: missing parameters.');
  if (editMessage) return editMessage.edit(message);
  return channel.send(message);
};

export const postFile = async (attachment, message, channel, editMessage) => {
  if (!attachment || !message || !channel) throw new Error('Could not post file: missing parameters.');
  const name = attachment.slice(attachment.lastIndexOf('/'));
  const options = { file: { attachment, name }};
  if (editMessage) return editMessage.edit(message, options);
  return channel.send(message, options);
};

export const postEmbed = async (options, channel, editMessage) => {
  if (!options || !channel) throw new Error('Could not post embed: missing parameters.');
  const embed = new RichEmbed(options);
  if (editMessage) return editMessage.edit(embed);
  return channel.send(embed);
};

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}.`);
});

bot.on('disconnect', (error, code) => {
  console.log(`Disconnected with error ${code}.`);
});
