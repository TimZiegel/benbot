import { db, increment } from './database';
import { users } from './users';
import { currency } from './currency';
import { pokemonCommand } from '../commands/pokemon';

export class Pokemon {

  table = db.table('pokemon');
  duplicateConsolationGold = 100;
  
  constructor() { }

  async catch(user, pokemonName = '') {
    const caught = await this.caught(user, pokemonName);
    const userId = users.getId(user);
    const newData = { [pokemonName]: increment(1) };
    await db.set(userId, this.table, newData, true);
    if (!caught) await currency.give(user, 1, 'pokemon');
    else await currency.give(user, this.duplicateConsolationGold, 'gold');
    const amount = await currency.amount(user, 'pokemon');
    const gold = caught ? this.duplicateConsolationGold : 0;
    return { caught, gold, amount };
  }
  
  async get(user) {
    const userId = users.getId(user);
    let pokemon = await db.get(userId, this.table);
    if (pokemon && pokemon.timestamp) {
      const { timestamp, ...filteredPokemon } = pokemon;
      pokemon = filteredPokemon;
    }
    return pokemon;
  }
  
  async getAll() {
    return db.getAll(this.table);
  }

  async getPokemonNames(user) {
    const pokemon = await this.get(user);
    return Object.keys(pokemon)
      .map(name => pokemonCommand.getPokemonName({ name }));
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
