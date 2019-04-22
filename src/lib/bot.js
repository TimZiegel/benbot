import Discord from 'discord.js';

export const bot = new Discord.Client();

export const postMessage = (message, channel) => {
  if (message && channel) channel.send(message);
};

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}.`);
});

bot.on('disconnect', (error, code) => {
  console.log(`Disconnected with error ${code}.`);
});
