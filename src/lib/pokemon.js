import { db, increment } from './database';
import { users } from './users';
import { currency } from './currency';

export class Pokemon {
  
  table = db.table('pokemon');
  
  constructor() { }

  async catch(user, pokemonName = '') {
    const caught = await this.caught(user, pokemonName);
    const userId = users.getId(user);
    const newData = { [pokemonName]: increment(1) };
    await db.set(userId, this.table, newData, true);
    if (!caught) await currency.give(user, 1, 'pokemon');
    return currency.amount(user, 'pokemon');
  }
  
  async get(user) {
    const userId = users.getId(user);
    return db.get(userId, this.table);
  }
  
  async getAll() {
    return db.getAll(this.table);
  }

  async caught(user, pokemonName = '') {
    const doc = await this.get(user);
    return this.caughtSync(doc, pokemonName);
  }
  
  caughtSync(doc, pokemonName = '') {
    return doc && doc[pokemonName] ? doc[pokemonName] : 0;
  }

  async amount(user) {
    const doc = await users.get(user);
    return this.amountSync(doc);
  }
  
  amountSync(doc) {
    return Object.keys(doc).reduce((acc, curr) => acc + doc[curr], 0);
  }
}

export const pokemon = new Pokemon();
