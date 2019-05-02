import { db, FieldValue } from './database';
import { NotEnoughCurrencyError } from './errors';

export const currencies = [{
  name: 'gold',
  color: 0xFFD435
}];

class Currency {

  constructor() {}

  async give(user, amount = 0, type = 'gold') {
    const ref = this.getUserRef(user);
    const data = {
      [type]: FieldValue.increment(amount),
      timestamp: FieldValue.serverTimestamp()
    };
    return ref.set(data, { merge: true });
  }

  async take(user, amount = 0, type = 'gold') {
    const ref = this.getUserRef(user);
    const currentAmount = await this.amount(user);
    const hasEnoughCurrency = currentAmount >= amount;

    if (hasEnoughCurrency) {
      const data = {
        [type]: FieldValue.increment(-amount),
        timestamp: FieldValue.serverTimestamp()
      };
      return ref.set(data, { merge: true });
    } else {
      throw new NotEnoughCurrencyError(currentAmount, amount, type);
    }
  }

  async set(user, amount = 0, type = 'gold') {
    const ref = this.getUserRef(user);
    const data = {
      [type]: amount,
      timestamp: FieldValue.serverTimestamp()
    };
    return ref.set(data, { merge: true });
  }

  async amount(user, type = 'gold') {
    const ref = this.getUserRef(user);
    const doc = await ref.get();
    if (!doc.exists) return 0;
    const data = doc.data();
    return data && data[type] ? data[type] : 0;
  }

  async rank(user, type = 'gold') {
    const amount = await this.amount(user, type);
    const ref = db.collection('users');
    const richerUsers = await ref.where(type, '>', amount).get();
    const rank = richerUsers.empty ? 1 : richerUsers.size + 1;
    return { amount, rank };
  }
  
  async leaderboard(type = 'gold') {
    const ref = db.collection('users');
    const users = await ref.orderBy(type).get();
    const leaderboard = users.empty ? [] : users.docs.map(doc => ({
      name: doc.id,
      ...doc.data()
    }));
    
    leaderboard.forEach(user => {
      currencies.forEach(currency => {
        user[currency.name] = user[currency.name] || 0;
      });
    });
    
    const amounts = leaderboard.map(user => user[type]);
    return leaderboard.map(user => ({
      rank: amounts.indexOf(user[type]) + 1,
      ...user
    }));
  }

  getUserRef(user) {
    const { username, discriminator } = user;
    return db.collection('users').doc(`${username}#${discriminator}`);
  }
}

export const currency = new Currency();
