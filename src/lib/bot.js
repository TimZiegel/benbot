import { Client, RichEmbed } from 'discord.js';

export const bot = new Client();

export const postMessage = (message, channel) => {
  if (message && channel) return channel.send(message);
  else return Promise.reject();
};

export const postFile = (attachment, message, channel) => {
  if (attachment && message && channel) {
    const name = attachment.slice(attachment.lastIndexOf('/'));
    const options = { file: { attachment, name } };
    return channel.send(message, options);
  } else return Promise.reject();
};

export const postEmbed = (options, channel) => {
  if (options && channel) {
    const embed = new RichEmbed(options);
    return channel.send(embed);
  } else return Promise.reject();
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}.`);
});

bot.on('disconnect', (error, code) => {
  console.log(`Disconnected with error ${code}.`);
});
