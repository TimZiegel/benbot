import { Command } from '../lib/command';
import { currency, currencies } from '../lib/currency';
import { humanize } from '../lib/utils';

export class LeaderboardCommand extends Command {
  command = 'leaderboard';
  help = 'Shows the top gold hoarders on the server.';
  example = '!leaderboard';
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
        .slice(0, this.cutoff)
        .map(user => {
          const currency = humanize(user[this.type] || 0);
          let emoji = '';
          
          if (user.rank === 1) emoji = ':first_place:';
          else if (user.rank === 2) emoji = ':second_place:';
          else if (user.rank === 3) emoji = ':third_place:';
          
          const name = `#${user.rank}: **${user.name}** ${emoji}`.trim();
          const value = `${currency} ${this.type}`;
          return { name, value };
        });
        
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
