import { Command } from '../lib/command';
import { currency } from '../lib/currency';

export class CheckGoldCommand extends Command {
  command = 'gold';
  aliases = ['rank'];
  help = 'Checks how much gold you have left.';
  example = '!gold';

  constructor() {
    super();
  }

  run(message) {
    const type = 'gold';

    currency.rank(message.author, type)
      .then(({ amount, rank }) => {
        const formattedAmount = amount.toLocaleString('en-US');
        const data = {
          author: {
            name: message.member.displayName,
            icon_url: message.author.avatarURL
          },
          title: `${formattedAmount} ${type}`,
          description: `Rank: ${rank}`,
          color: 0xFFD700
        };
        return this.postEmbed(data, message);
      })
      .catch(e => {
        this.post(`Whoops! Something went wrong while checking your bank account.`, message);
        console.error(e);
      });
  }
}

export const checkGoldCommand = new CheckGoldCommand();
