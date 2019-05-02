import { Command } from '../lib/command';
import { currency } from '../lib/currency';

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
      const { amount, rank } = await currency.rank(message.author, this.type);
      const formattedAmount = amount.toLocaleString('en-US');
      const data = {
        author: {
          name: message.member.displayName,
          icon_url: message.author.avatarURL
        },
        title: `${formattedAmount} ${this.type}`,
        description: `Rank: ${rank}`,
        color: 0xFFD700
      };
      return this.postEmbed(data, message);
    } catch (e) {
      this.post(`Whoops! Something went wrong while checking your bank account.`, message);
      console.error(e);
    }
  }
}

export const checkGoldCommand = new CheckGoldCommand();
