import fs from 'fs';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { RandomSpawnCommand } from '../lib/command';
import { getRandom } from '../lib/utils';
import { pokemonTypeColors } from '../lib/colors';
import { pokemon } from '../lib/pokemon';
import { currency } from '../lib/currency';

export class PokemonCommand extends RandomSpawnCommand {
  command = 'catch';
  aliases = ['pokeball'];
  help = 'The !catch command attempts to catch a Pokémon, but only if a wild Pokémon has appeared. Wild Pokémon spawn at random intervals and are removed when they are caught. When a wild Pokémon appears, a picture and message will be posted in a random channel. Be quick! Catching a Pokémon will earn you gold, which you can bet with or trade with other people.';
  example = '!catch';

  spawnChance = 0.04; // Each post has a 1 in 25 chance to start the spawn timer
  spawnDelay = 3600000; // When a spawn is triggered, delay it for a random time between 0ms and 1 hour

  pokemon = [];
  pokemonExpiry = 604800000; // Refresh pokemon every week
  pokemonTimestamp = 0;
  pokemonApi = "https://pokeapi.co/api/v2";
  pokemonImageApi = "https://play.pokemonshowdown.com/sprites/xyani/";
  pokemonSpawnImage = 'assets/pokemon.png';
  pokemonSpawnText = 'A wild Pokémon appeared! Use the `!catch` command to catch it!';
  pokemonMasterGold = 500;
  
  constructor() {
    super();
  }
  
  async claim(message) {
    await this.setSpawnMessage(null);
    await this.getPokemon();
    
    const uncaughtPokemon = await this.getUncaughtPokemon(message.author);
    const caughtEmAll = isEmpty(uncaughtPokemon);
    const eligiblePokemon = caughtEmAll ? this.pokemon : uncaughtPokemon;

    const randomPokemon = getRandom(eligiblePokemon);
    const spawnedPokemon = await this.getPokemonInfo(randomPokemon);
    const pokemonImage = await this.getPokemonImage(spawnedPokemon);
    const pokemonName = this.getPokemonName(spawnedPokemon);
    const pokemonTypeColor = this.getPokemonTypeColor(spawnedPokemon);
    
    const embedOptions = {
      author: {
        name: `${message.member.displayName} caught:`,
        icon_url: message.author.avatarURL
      },
      title: `**${pokemonName}**`,
      color: pokemonTypeColor,
      footer: {}
    };

    if (pokemonImage) embedOptions.file = pokemonImage;
    
    return pokemon.catch(message.author, spawnedPokemon.name)
      .then(({ amount }) => {
        const goldValue = caughtEmAll ? this.pokemonMasterGold : (spawnedPokemon.base_experience || 100);
        embedOptions.footer.text = `${goldValue} gold was awarded for this catch.`;
        embedOptions.description = `${message.member.displayName} has caught ${amount} of ${this.pokemon.length} Pokémon.`;
        return currency.give(message.author, goldValue, 'gold');
      })
      .then(() => this.postEmbed(embedOptions, message));
  }
  
  async spawn(message) {
    return this.postFile(this.pokemonSpawnImage, this.pokemonSpawnText, message);
  }
  
  async unavailable(message) {
    const unavailableText = getRandom(this.unavailableTexts);
    const text = `${unavailableText} _(Confused? Use the command _\`!help catch\`_ to learn more!)_`;
    return this.post(text, message);
  }
  
  async getPokemon() {
    const now = Date.now();
    const pokemonAge = now - this.pokemonTimestamp;
    const url = `${this.pokemonApi}/pokemon?limit=5000`
    if (!isEmpty(this.pokemon) && pokemonAge < this.pokemonExpiry) return this.pokemon;
    else return axios
      .get(url)
      .then(({ data }) => this.setPokemon(data))
      .catch(e => console.warn(`Failed to get list of all pokemon. ${e}`));
  }
  
  setPokemon(data) {
    const { results } = data;
    const nonSpecialPokemon = results.filter(pokemon => !pokemon.url.match(/\d{5,}\/?$/));
    this.pokemon = nonSpecialPokemon;
    this.pokemonTimestamp = Date.now();
    return this.pokemon;
  }
  
  async getPokemonInfo(pokemon) {
    const { url, name } = pokemon;
    return axios
      .get(url)
      .then(({ data }) => data)
      .catch(e => console.warn(`Failed to get pokemon info for Pokemon "${name}" from URL "${url}". ${e}`));
  }
  
  getPokemonName(pokemon) {
    const { name } = pokemon;
    return name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  getPokemonTypeColor(pokemon) {
    if (isEmpty(pokemon.types)) return pokemonTypeColors.normal;
    const firstType = pokemon.types.reduce((acc, curr) => curr.slot < acc.slot ? curr : acc);
    const typeName = firstType.type.name;
    return pokemonTypeColors[typeName] || pokemonTypeColors.normal;
  }
  
  async getPokemonImage(pokemon) {
    const { name } = pokemon;
    const localGif = `assets/pokemon/${name}.gif`;
    const localPng = `assets/pokemon/${name}.png`;
    
    try {
      if (fs.existsSync(localGif)) return localGif;
      const { data } = await axios({ url: `${this.pokemonImageApi}${name}.gif`, responseType: 'stream' });
      const success = await this.savePokemonImage(localGif, data);
      if (success) return localGif;
    } catch(e) {
      console.log(`Failed to get GIF for Pokemon "${name}". ${e}`);
    }
    
    try {
      if (fs.existsSync(localPng)) return localPng;
      const { sprites } = await this.getPokemonInfo(pokemon);
      const { data } = await axios({ url: sprites.front_default, responseType: 'stream' });
      const success = this.savePokemonImage(localPng, data);
      if (success) return localPng;
    } catch(e) {
      console.log(`Failed to get PNG for Pokemon "${name}". ${e}`);
    }
      
    return '';
  }

  async savePokemonImage(localImagePath, dataStream) {
    try {
      await new Promise((resolve, reject) => {
        dataStream.pipe(fs.createWriteStream(localImagePath))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      });
    } catch(e) {
      return false;
    }

    return true;
  }

  async getCaughtPokemon(user) {
    return pokemon.getPokemonNames(user);
  }

  async getUncaughtPokemon(user) {
    const caughtPokemon = await this.getCaughtPokemon(user);
    return this.pokemon.filter(pokemon => {
      const name = this.getPokemonName(pokemon);
      return !caughtPokemon.includes(name);
    });
  }
  
  unavailableTexts = [
    "Whoops! There are no Pokémon available.",
    "What do I look like, a charity?",
    "Chill. There aren't any Pokémon yet.",
    "Gotta wait for Pokémon to appear, dawg.",
    "You caught a... Oh wait. There aren't any Pokémon. Sorry.",
    "Sorry, eh. Ain't got no Pokémon for ya.",
    "Patience... Patience...",
    "You caught a shiny Arceus! Err... Wait, that's not right. There aren't any Pokémon.",
    "Sorry, we're all out of Pokémon.",
    "Sorry, I'm fresh out of Pokémon. Check back later.",
    "I don't really feel like giving you a Pokémon right now. Maybe later.",
    "IMPUDENT MORTAL! THERE ARE NO POKÉMON!",
    "You get nothing! You lose! Good day sir!",
    "I'm not really feeling the whole \"Pokémon\" thing right now. Come back later"
  ];
}

export const pokemonCommand = new PokemonCommand();