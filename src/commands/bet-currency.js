import madlibs from 'mad-libber';
import { Command } from '../lib/command';
import { currency, currencies } from '../lib/currency';
import { getRandom, getRandomNumberBetween, humanize } from '../lib/utils';
import { colors } from '../lib/colors';

export class BetCurrencyCommand extends Command {
  command = 'bet';
  aliases = ['roll'];
  help = 'Bet some gold and roll the die! Rolling 50+ yields 1.5x gold. Rolling 75+ yields 2x gold. Rolling 90+ yields 4x. Rolling 100 yields 10x.';
  example = '!bet 10';
  
  data = {
    unlucky: [
      "Ooh, that's unfortunate. You rolled ${roll}.",
      "You rolled ${roll}. Ouch.",
      "That's a hard ${roll}, dawg. I'll be taking that ${type}.",
      "Thanks for the ${type}. You rolled ${roll}.",
      "You rolled ${roll}. Damn.",
      "Yesss! I mean, ooh. Sorry. You rolled ${roll}.",
      "You rolled 142! Oh no, wait. You rolled ${roll}. Unfortunate.",
      "You rolled ${roll}. I think I'll buy a mount with that ${amount} ${type}.",
      "HAHAHAHAHA! I mean, sorry. You rolled ${roll}.",
      "${roll}. Sorry.",
      "You won a new car!!! Just kidding. You rolled ${roll}.",
      "You rolled ${roll}. So sad. You should ~~give me more ${type}~~ try again.",
      "${roll}. Lol. :upside_down:"
    ],
    even: [
      "Golly gee! You rolled ${roll}.",
      "You rolled ${roll}. Great job!",
      "You rolled ${roll}! Wooo!",
      "${roll}. Nice.",
      "You rolled ${roll}. Enjoy the ${type}.",
      "You roll ${roll}. Not bad!",
      "${roll}! Decent!",
      "${roll}! Nice!"
    ],
    lucky: [
      "Wow! ${roll}!",
      "You rolled ${roll}. Heck yeah!",
      "It's ${roll}. Nice.",
      "${roll}! Not bad at all.",
      "You rolled ${roll}. Enjoy the ${type}!",
      "Dang, you rolled ${roll}. I was looking forward to keeping that ${amount} ${type}.",
      "That's a solid ${roll}. Nice job.",
      "You rolled ${roll}. Nicely done!"
    ],
    crazy: [
      "You rolled ${roll}. Enjoy all your ${type}.",
      "Oooh, ${roll}! Hell yeah!",
      "${roll}! Nice!",
      "That'a a big ${roll}, dawg! Damn!",
      "Ayy, you rolled ${roll}.",
      "Daaaaaamn, ${roll}!",
      "${roll}! Lucky!"
    ],
    insane: [
      "WHAT? You rolled ${roll}!!!",
      "Oh shit! ${roll}!!!",
      "Holy shit! You rolled ${roll}!",
      "Fuck. You rolled ${roll}. Just take the ${type}.",
      "Welp. You rolled ${roll}. There goes all my ${type}.",
      "Daaaaaaaaaamn son! ${roll}!",
      "Ayyyyyyyy! ${roll}!!!! Congrats!!!!",
      "Well that's... unexpected. You rolled ${roll}."
    ]
  };
  
  async run(message) {
    // TODO: infer type from message
    const { type, color } = currencies[0];
    const amountString = message.content.match(/\s\d+\b/i);
    if (!amountString) return this.post(`Whoops! You must specify an amount to bet.`, message);
    const amount = parseInt(amountString[0], 10);
    if (!amount) return this.post(`Whoops! You can't bet that much.`, message);
    const currentAmount = await currency.amount(message.author, type);
    if (amount > currentAmount) return this.post(`Whoops! You can't bet ${humanize(amount)} ${type}. You've only got ${humanize(currentAmount)}.`, message);
    
    const result = this.roll(amount, type);
    const amountLeft = currentAmount - amount + result.winnings;
    
    const embedOptions = {
      color: result.won ? color : colors.red,
      title: result.title,
      footer: {
        text: `${result.message} You have ${amountLeft} ${type} left.`
      }
    };
    
    const promise = result.won ? currency.give(message.author, result.winnings - amount) : currency.take(message.author, amount);
    return promise
      .then(() => this.postEmbed(embedOptions, message))
      .catch(e => this.post(`Whoops! Something went wrong with your bet. Sorry, eh.`, message));
  }
  
  roll(amount, type) {
    const roll = getRandomNumberBetween(1, 100);
    let multiplier = 0;
    let winnings = 0;
    let title = '';
    let message = '';
    
    const replacements = { amount: [amount + ''], roll: [roll + ''], type: [type + ''] };
    
    if (roll === 100) {
      multiplier = 10;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.insane), replacements);
    } else if (roll >= 90) {
      multiplier = 4;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.crazy), replacements);
    } else if (roll >= 75) {
      multiplier = 2;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.lucky), replacements);
    } else if (roll >= 50) {
      multiplier = 1.5;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.even), replacements);
    } else {
      multiplier = 0;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.unlucky), replacements);
    }
    
    const won = winnings > 0;
    if (won) message = `You earned ${multiplier}x your bet and won ${humanize(winnings)} ${type}.`;
    else message = `You lost ${humanize(amount)} ${type}.`;
    
    return {
      won,
      roll,
      multiplier,
      winnings,
      title,
      message
    };
  }
}

export const betCurrencyCommand = new BetCurrencyCommand();