import { db } from './database';
import { users } from './users';
import { currency, defaultCurrency } from './currency';
import { postMessage } from './bot';

export class Secrets {
  
  table = db.table('secrets');
  
  get(id) {
    return db.get(id, this.table);
  }
  
  set(id, data = {}) {
    return db.set(id, this.table, data);
  }
  
  async find(id, user, channel) {
    try {
      const secret = await this.get(id)
      if (!secret || secret.found) return false;
      
      const { bounty, message, repeatable } = secret;
      let defaultMessage = `Congratulations, you found a secret!`;
      
      if (bounty) {
        const { type } = defaultCurrency;
        defaultMessage += ` You've been awarded ${bounty} ${type}.`;
        await currency.give(user, bounty);
      }
      
      if (!repeatable) {
        const userId = users.getId(user);
        await this.set(id, { found: true, user: userId });
      }
      
      await postMessage(message || defaultMessage, channel);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  async isFound(id) {
    const secret = await this.get(id);
    return secret && secret.found;
  }
}

export const secrets = new Secrets();