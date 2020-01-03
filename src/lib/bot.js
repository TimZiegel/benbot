import { Client, RichEmbed } from 'discord.js';

export const bot = new Client();

export const postMessage = async (message, channel) => {
  if (!message || !channel) throw new Error('Could not post message: missing parameters.');
  return channel.send(message);
};

export const postFile = async (attachment, message, channel) => {
  if (!attachment || !message || !channel) throw new Error('Could not post file: missing parameters.');
  const name = attachment.slice(attachment.lastIndexOf('/'));
  const options = { file: { attachment, name }};
  return channel.send(message, options);
};

export const postEmbed = async (options, channel) => {
  if (!options || !channel) throw new Error('Could not post embed: missing parameters.');
  const embed = new RichEmbed(options);
  return channel.send(embed);
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}.`);
});

bot.on('disconnect', (error, code) => {
  console.log(`Disconnected with error ${code}.`);
});
