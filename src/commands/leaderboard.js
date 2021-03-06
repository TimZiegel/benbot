import { isEmpty } from 'lodash';
import { Command } from '../lib/command';
import { currency, currencies, defaultCurrency } from '../lib/currency';
import { humanize } from '../lib/utils';

export class LeaderboardCommand extends Command {
  command = 'leaderboard';
  aliases = ['leaderboards'];
  help = 'The !leaderboard command shows the gold top gold hoarders on the server. You can also use !leaderboard pokemon to show the top Pokémon trainers!';
  example = '!leaderboard';
  cutoff = 10;
  defaultType = defaultCurrency.type;
  
  constructor() {
    super();
  }

  async run(message) {    
    try {
      const intendedCurrency = currencies.find(({ type }) => new RegExp(`${type}\\s*$`, 'i').test(message.content));
      const currencyType = intendedCurrency ? intendedCurrency.type : this.defaultType;
      
      const { color, name: currencyName } = currencies.find(({ type }) => type === currencyType);
      const users = await currency.leaderboard(currencyType);
      if (isEmpty(users)) return this.post(`Whoops! No one has collected anything yet. Check back later.`, message);

      const fields = users
        .slice(0, this.cutoff)
        .map(user => {
          const currency = humanize(user[currencyType] || 0);
          let emoji = '';
          
          if (user.rank === 1) emoji = ':first_place:';
          else if (user.rank === 2) emoji = ':second_place:';
          else if (user.rank === 3) emoji = ':third_place:';
          
          const name = `#${user.rank}: **${user.name}** ${emoji}`.trim();
          const value = `${currency} ${currencyName}`;
          return { name, value };
        });
        
      const embedOptions = {
        color,
        fields
      };
      
      await this.postEmbed(embedOptions, message);
    } catch (e) {
      this.post(`Whoops! Something went wrong while checking the leaderboard.`, message);
      console.error(e);
    }
  }
}

export const leaderboardCommand = new LeaderboardCommand();
