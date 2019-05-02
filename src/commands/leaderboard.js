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
      const { color } = currencies.find(({ type }) => type === this.type);
      const users = await currency.leaderboard(this.type);
      const fields = users
        .map(user => ({
          [this.type]: (user[this.type] || 0).toLocaleString('en-US'),
          ...user
        }))
        .map(user => ({
          name: `**${user.name}:** ${user[this.type]} ${this.type}`,
          value: `Rank: ${user.rank}`
        }));
        
      const embedOptions = {
        color,
        fields
      };
      
      this.postEmbed(embedOptions, message);
    } catch (e) {
      this.post(`Whoops! Something went wrong while checking the leaderboard.`, message);
      console.error(e);
    }
  }
}

export const leaderboardCommand = new LeaderboardCommand();
