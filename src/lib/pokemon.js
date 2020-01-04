import { db, timestamp } from './database';
import { users } from './users';
import { currency } from './currency';
import { pokemonCommand } from '../commands/pokemon';

export class Pokemon {

  table = db.table('pokemon');
  
  constructor() { }

  async catch(user, pokemonName = '') {
    const userPokemon = await this.get(user);
    const duplicate = this.caughtSync(userPokemon, pokemonName);
    
    const userId = users.getId(user);
    const newData = { [pokemonName]: timestamp() };
    await db.set(userId, this.table, newData, true);
    
    let amount = this.amountSync(userPokemon);
    if (!duplicate) {
      amount += 1;
      await currency.set(user, amount, 'pokemon');
    }

    return { duplicate, amount };
  }
  
  async get(user) {
    const userId = users.getId(user);
    let pokemon = await db.get(userId, this.table);
    if (pokemon && pokemon.timestamp) {
      const { timestamp, ...filteredPokemon } = pokemon;
      pokemon = filteredPokemon;
    }
    return pokemon || {};
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
    const { timestamp, ...pokemon } = doc;
    return Object.keys(pokemon).length;
  }
}

export const pokemon = new Pokemon();
