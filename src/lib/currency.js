import { db, FieldValue } from './database';
import { NotEnoughCurrencyError } from './errors';
import { users } from './users';

export const currencies = [{
  type: 'gold',
  color: 0xFFD435
}];

class Currency {

  constructor() {}

  async give(user, amount = 0, type = 'gold') {
    const data = { [type]: FieldValue.increment(amount) };
    return users.set(user, data);
  }

  async take(user, amount = 0, type = 'gold') {
    const currentAmount = await this.amount(user);
    const hasEnoughCurrency = currentAmount >= amount;
    if (!hasEnoughCurrency) throw new NotEnoughCurrencyError(currentAmount, amount, type);
    
    const data = { [type]: FieldValue.increment(-amount) };
    return users.set(user, data);
  }

  async set(user, amount = 0, type = 'gold') {
    const data = { [type]: amount };
    return users.set(user, data);
  }

  async amount(user, type = 'gold') {
    const doc = await users.get(user);
    return doc && doc[type] ? doc[type] : 0;
  }

  async rank(user, type = 'gold') {
    const amount = await this.amount(user, type);
    const richerUsers = await users.collection.where(type, '>', amount).get();
    const rank = richerUsers.empty ? 1 : richerUsers.size + 1;
    return { amount, rank };
  }
  
  async leaderboard(type = 'gold') {
    const { docs } = await users.collection.orderBy(type).get();
    const leaderboard = docs.map(doc => ({ name: doc.id, ...doc.data() }));
    const amounts = leaderboard.map(user => user[type] || 0);
    
    return leaderboard.map(user => {
      const rank = amounts.indexOf(user[type] || 0);
      return { rank, ...user };
    });
  }
}

export const currency = new Currency();
