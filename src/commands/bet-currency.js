import madlibs from 'mad-libber';
import parsems from 'parse-ms';
import { Command } from '../lib/command';
import { currency, defaultCurrency } from '../lib/currency';
import { getRandom, getRandomNumberBetween, humanize } from '../lib/utils';
import { colors } from '../lib/colors';
import { users } from '../lib/users';
import { db, timestamp } from '../lib/database';

export class BetCurrencyCommand extends Command {
  command = 'bet';
  aliases = ['roll'];
  help = 'Bet some gold and roll the die! Rolling 50+ yields 1.5x gold. Rolling 80+ yields 2x gold. Rolling 90+ yields 3x. Rolling 100 yields 5x.';
  example = '!bet 10';
  eligibilityPeriod = 86400000; // One day in ms
  betsPerPeriod = 10; // Max bids per period
  
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
    const user = message.author;
    const betsThisPeriod = await this.getBetsThisPeriod(user);
    const betsLeftThisPeriod = Math.max(this.betsPerPeriod - betsThisPeriod.length, 0);
    if (!betsLeftThisPeriod) return this.ineligible(betsThisPeriod, message);
    
    const { type, color } = defaultCurrency;
    const amountString = message.content.match(/\s\d+\b/i);
    if (!amountString) return this.post(`Whoops! You must specify an amount to bet.`, message);
    
    const amount = parseInt(amountString[0], 10);
    if (!amount) return this.post(`Whoops! You can't bet that much.`, message);
    
    const currentAmount = await currency.amount(user, type);
    if (amount > currentAmount) return this.post(`Whoops! You can't bet ${humanize(amount)} ${type}. You've only got ${humanize(currentAmount)}.`, message);
    
    const result = this.roll(amount, type);
    const amountLeft = currentAmount - amount + result.winnings;
    const pluralBets = (betsLeftThisPeriod - 1) === 1 ? 'bet' : 'bets';

    const embedOptions = {
      color: result.won ? color : colors.red,
      title: result.title,
      footer: {
        text: `${result.message} You have ${humanize(amountLeft)} ${type} and ${betsLeftThisPeriod - 1} ${pluralBets} left.`
      }
    };
    
    const promise = result.won ? currency.give(user, result.winnings - amount) : currency.take(user, amount);
    return promise
      .then(() => this.logBet(user, result))
      .then(() => this.postEmbed(embedOptions, message))
      .catch(e => this.post(`Whoops! Something went wrong with your bet. Sorry, eh.`, message));
  }
  
  roll(amount, type) {
    const roll = getRandomNumberBetween(1, 100);
    let multiplier = 0;
    let winnings = 0;
    let title = '';
    let message = '';
    
    const replacements = { amount: [humanize(amount)], roll: [roll + ''], type: [type + ''] };
    
    if (roll === 100) {
      multiplier = 5;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.insane), replacements);
    } else if (roll >= 90) {
      multiplier = 3;
      winnings = Math.floor(amount * multiplier);
      title = madlibs(getRandom(this.data.crazy), replacements);
    } else if (roll >= 80) {
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
      amount,
      won,
      roll,
      multiplier,
      winnings,
      title,
      message
    };
  }
  
  async getBetsThisPeriod(user) {
    const userId = users.getId(user);
    const periodStart = timestamp() - this.eligibilityPeriod;
    
    const query = db.pipe(
      db.table('bets'),
      db.where$('userId', '==', userId),
      db.where$('timestamp', '>', periodStart)
    );
    
    const snapshot = await query.get();
    const bets = snapshot.docs || [];
    
    return bets.map(bet => bet.data())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-this.betsPerPeriod);
  }
  
  async logBet(user, roll) {
    const userId = users.getId(user);
    return db.add('bets', { userId, roll });
  }
  
  async ineligible(betsThisPeriod, message) {
    const now = timestamp();
    const earliestBet = betsThisPeriod[0].timestamp;
    const timeUntilNext = (earliestBet + this.eligibilityPeriod) - now;

    const timeString = this.parseTime(timeUntilNext);
    const hours = Math.ceil(this.eligibilityPeriod / 3600000);
    const pluralTimes = this.betsPerPeriod === 1 ? 'time' : 'times';

    const embedOptions = {
      color: colors.lightGray,
      title: `You've reached your limit! You can only bet ${this.betsPerPeriod} ${pluralTimes} every ${hours} hours.`,
      footer: {
        text: `Your next bet will be available in ${timeString}.`
      }
    };

    return this.postEmbed(embedOptions, message);
  }

  parseTime(time = 0) {
    const absoluteTime = Math.max(time, 1000);
    const parsedTime = parsems(absoluteTime);

    const timeSegments = ['days', 'hours'];
    if (!parsedTime.days) {
      if (parsedTime.hours < 2) timeSegments.push('minutes');
      else if (parsedTime.minutes) parsedTime.hours += 1;
      if (parsedTime.hours < 1) timeSegments.push('seconds');
    }

    return Object.entries(parsedTime)
      .filter(([key]) => timeSegments.includes(key))
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        if (value === 1) key = key.replace(/s$/i, '');
        return `${value} ${key}`;
      })
      .reduce((acc, curr, i, src) => {
        const last = i >= src.length - 1;
        const conjunction = last ? ' and ' : ', ';
        return acc + conjunction + curr;
      });
  }
}

export const betCurrencyCommand = new BetCurrencyCommand();