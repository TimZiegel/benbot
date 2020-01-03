import { db, increment } from './database';
import { NotEnoughCurrencyError } from './errors';
import { users } from './users';
import { colors } from '../lib/colors';

export const currencies = [{
  type: 'gold',
  color: colors.gold
}, {
  type: 'pokemon',
  color: colors.red
}];

export const defaultCurrency = currencies[0];
const defaultType = defaultCurrency.type;

export class Currency {

  constructor() {}

  async give(user, amount = 0, type = defaultType) {
    const data = { [type]: increment(amount) };
    return users.set(user, data);
  }

  async take(user, amount = 0, type = defaultType) {
    const currentAmount = await this.amount(user);
    const hasEnoughCurrency = currentAmount >= amount;
    if (!hasEnoughCurrency) throw new NotEnoughCurrencyError(currentAmount, amount, type);
    
    const data = { [type]: increment(-amount) };
    return users.set(user, data);
  }

  async set(user, amount = 0, type = defaultType) {
    const data = { [type]: amount };
    return users.set(user, data);
  }

  async amount(user, type = defaultType) {
    const doc = await users.get(user);
    return doc && doc[type] ? doc[type] : 0;
  }

  async rank(user, type = defaultType) {
    const amount = await this.amount(user, type);
    const table = db.table('users');
    const query = db.where(table, type, '>', amount);
    const richerUsers = await db.getAll(query);
    const rank = richerUsers.length + 1;
    return { amount, rank };
  }
  
  async leaderboard(type = defaultType) {
    const allUsers = await users.getAll();
    allUsers.sort((a, b) => (b[type] || 0) - (a[type] || 0));
    
    const amounts = allUsers
      .map(user => user[type] || 0)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return allUsers.map(user => {
      const rank = amounts.indexOf(user[type] || 0) + 1;
      return { rank, ...user };
    });
  }
}

export const currency = new Currency();
