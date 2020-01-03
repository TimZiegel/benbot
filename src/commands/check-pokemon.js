import { Command } from '../lib/command';
import { currency, currencies } from '../lib/currency';
import { humanize } from '../lib/utils';

export class CheckPokemonCommand extends Command {
  command = 'pokemon';
  help = 'Displays how many Pokémon you have.';
  example = '!pokemon';
  type = 'pokemon';

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
      this.post(`Whoops! Something went wrong while checking your Pokédex.`, message);
      console.error(e);
    }
  }
}

export const checkPokemonCommand = new CheckPokemonCommand();
