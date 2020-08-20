import { isEmpty } from 'lodash';
import { Command } from '../lib/command';
import { currency, defaultCurrency } from '../lib/currency';
import { humanize } from '../lib/utils';
import { NotEnoughCurrencyError } from '../lib/errors';
import { bot } from '../lib/bot';

export class GiveCurrencyCommand extends Command {
  command = 'give';
  help = 'Gives currency to another user (or users). Mention a user and specify an amount to make it rain.';
  example = '!give @Benadryll 100';

	constructor() {
		super();
	}

	run(message) {
    // TODO: infer type from message
    const { type } = defaultCurrency;
    const mentions = message.mentions.users.array();
    if (isEmpty(mentions)) return this.post(`Whoops! You must mention a user (or users) to give currency to.`, message);
    const trickery = mentions.find(user => user.id === message.author.id);
    if (trickery) return this.post(`What the - you can't give currency to yourself! I'm calling the IRS.`, message);
    const amountString = message.content.match(/\s\d+\b/i);
    if (!amountString) return this.post(`Whoops! You must specify an amount to give.`, message);
    const amount = parseInt(amountString[0], 10);
    if (!amount) return this.post(`Whoops! You can't give them that much.`, message);
    const total = mentions.reduce(acc => acc + amount, 0);

    currency.take(message.author, total)
      .then(() => Promise.all(
        mentions.map(user => currency.give(user, amount, type))
      ))
      .then(() => {
        const users = mentions.map(user => user.username).join(', ');
        this.post(`You gave ${humanize(amount)} ${type} to ${users}. Thanks for your generosity!`, message);
        if (message.isMentioned(bot.user)) this.post(`*(Wowee! What will I do with all this ${type}?)*`, message);
      })
      .catch(e => {
        if (e instanceof NotEnoughCurrencyError) this.post(`Whoops! You don't have that much ${type}. Your ${type}: ${humanize(e.current)}. Amount needed: ${humanize(e.needed)}.`, message);
        else {
          this.post(`Whoops! Something went wrong while exchanging currency.`, message);
          console.error(e);
        }
      });
	}
}

export const giveCurrencyCommand = new GiveCurrencyCommand();
