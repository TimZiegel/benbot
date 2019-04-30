import { db, FieldValue } from './database';
import { NotEnoughCurrencyError } from './errors';

export const currencies = ['gold'];

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

  getUserRef(user) {
    const { username, discriminator } = user;
    return db.collection('users').doc(`${username}#${discriminator}`);
  }
}

export const currency = new Currency();
