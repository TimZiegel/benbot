import { Command } from '../lib/command';
import { currency, currencies } from '../lib/currency';
import { humanize } from '../lib/utils';

export class CheckGoldCommand extends Command {
  command = 'gold';
  help = 'Checks how much gold you have left.';
  example = '!gold';
  type = 'gold';

  constructor() {
    super();
  }

  async run(message) {
    try {
      const { color } = currencies.find(({ type }) => type === this.type);
      const { amount, rank } = await currency.rank(message.author, this.type);
      
      const data = {
        author: {
          name: message.member.displayName,
          icon_url: message.author.avatarURL
        },
        title: `${humanize(amount)} ${this.type}`,
        description: `Rank: ${rank}`,
        color
      };
      
      return this.postEmbed(data, message);
    } catch (e) {
      this.post(`Whoops! Something went wrong while checking your bank account.`, message);
      console.error(e);
    }
  }
}

export const checkGoldCommand = new CheckGoldCommand();
