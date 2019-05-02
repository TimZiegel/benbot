import { Command } from '../lib/command';
import { currency, currencies } from '../lib/currency';

export class LeaderboardCommand extends Command {
  command = 'leaderboard';
  help = 'Shows the top gold collectors on the server.';
  example = '!gold';
  cutoff = 10;
  type = 'gold';
  
  constructor() {
    super();
  }

  async run(message) {
    try {
      const users = await currency.leaderboard(this.type);
      users.forEach(user => user[this.type] = (user[this.type] || 0).toLocaleString('en-US'));
      const currentCurrency = currencies.find(({ name }) => name === this.type);
      const embedOptions = {
        title: '**Leaderboard:**',
        color: currentCurrency.color,
        fields: users
          .map(user => ({
            [this.type]: user[this.type].toLocaleString('en-US'),
            ...user
          }))
          .map(user => ({
            name: `**${user.name}:** ${user[this.type]} ${this.type}`,
            value: `Rank: ${user.rank}`
          }))
      };
      this.postEmbed(embedOptions, message);
      // const leaderboard = users.map(user => ({
      //   name: user.
      //   gold: (user.gold || 0).toLocaleString('en-US'),
      //   rank: users.indexOf(user) + 1
      // }));
      // const data = {
      //   author: {
      //     name: message.member.displayName,
      //     icon_url: message.author.avatarURL
      //   },
      //   title: `${formattedAmount} ${type}`,
      //   description: `Rank: ${rank}`,
      //   color: 0xFFD700
      // };
      // return this.postEmbed(data, message);
    } catch (e) {
      this.post(`Whoops! Something went wrong while checking your bank account.`, message);
      console.error(e);
    }
  }
}

export const leaderboardCommand = new LeaderboardCommand();
