import fs from 'fs';
import axios from 'axios';
import { RandomSpawnCommand } from '../lib/command';
import { getRandom } from '../lib/utils';
import { pokemonTypeColors } from '../lib/colors';
import { pokemon } from '../lib/pokemon';

export class PokemonCommand extends RandomSpawnCommand {
  command = 'catch';
  aliases = ['pokeball'];
  help = 'Catches a pokemon, if one has appeared. Try and catch \'em all!';
  example = '!catch';

  spawnChance = 0.05; // Each post has a 1 in 20 chance to start the spawn timer
  spawnDelay = 3600000; // When a spawn is triggered, delay it for a random time between 0ms and 1 hour
  spawnExpiry = 3600000; // If a spawn is triggered and no one has claimed it within 1 hour, it can be deleted

  pokemon = [];
  pokemonExpiry = 604800000; // Refresh pokemon every week
  pokemonTimestamp = 0;
  pokemonApi = "https://pokeapi.co/api/v2";
  pokemonImageApi = "https://play.pokemonshowdown.com/sprites/xyani/";
  spawnedPokemon = null;
  
  constructor() {
    super();
  }
  
  async claim(message) {
    await this.deleteSpawnMessage();
    const pokemonName = this.getPokemonName(this.spawnedPokemon);
    const pokemonImage = await this.getPokemonImage(this.spawnedPokemon);
    const pokemonTypeColor = this.getPokemonTypeColor(this.spawnedPokemon);
    
    const embedOptions = {
      author: {
        name: `${message.member.displayName} caught:`,
        icon_url: message.author.avatarURL
      },
      title: `**${pokemonName}**`,
      color: pokemonTypeColor,
      file: pokemonImage,
      footer: {}
    };
    
    return pokemon.catch(message.author, this.spawnedPokemon.name)
      .then(({ caught, gold, amount }) => {
        embedOptions.footer.text = `${message.member.displayName} has caught ${amount} of ${this.pokemon.length} unique Pokémon.`;
        const times = caught === 1 ? 'time' : 'times';
        if (caught) embedOptions.description = `${message.member.displayName} has caught this pokemon ${caught} ${times} before, and was awarded ${gold} gold instead.`;
      })
      .then(() => this.postEmbed(embedOptions, message));
  }
  
  async spawn(message) {
    const pokemon = await this.getPokemon();
    const randomPokemon = getRandom(pokemon);
    this.spawnedPokemon = await this.getPokemonInfo(randomPokemon);
    const pokemonName = this.getPokemonName(this.spawnedPokemon);
    const pokemonImage = await this.getPokemonImage(this.spawnedPokemon);
    const messageText = `A wild ${pokemonName} appeared! Use the \`!catch\` command to catch it!`
    return this.postFile(pokemonImage, messageText, message);
  }
  
  async unavailable(message) {
    const unavailableText = getRandom(this.unavailableTexts);
    return this.post(unavailableText, message);
  }
  
  async getPokemon() {
    const now = Date.now();
    const pokemonAge = now - this.pokemonTimestamp;
    const url = `${this.pokemonApi}/pokemon?limit=5000`
    if (this.pokemon.length && pokemonAge < this.pokemonExpiry) return this.pokemon;
    else return axios
      .get(url)
      .then(({ data }) => this.setPokemon(data));
  }
  
  setPokemon(data) {
    const { results } = data;
    const nonSpecialPokemon = results.filter(pokemon => !pokemon.url.match(/\d{5,}\/?$/));
    this.pokemon = nonSpecialPokemon;
    this.pokemonTimestamp = Date.now();
    return this.pokemon;
  }
  
  async getPokemonInfo(pokemon) {
    const { url } = pokemon;
    return axios.get(url).then(({ data }) => data);
  }
  
  getPokemonName(pokemon) {
    const { name } = pokemon;
    return name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  getPokemonTypeColor(pokemon) {
    const firstType = pokemon.types.reduce((acc, curr) => curr.slot < acc.slot ? curr : acc);
    const typeName = firstType.type.name;
    return pokemonTypeColors[typeName] || pokemonTypeColors.normal;
  }
  
  async getPokemonImage(pokemon) {
    const { name } = pokemon;
    const imagePath = `${name}.gif`;
    const url = `${this.pokemonImageApi}${imagePath}`;
    const localImagePath = `assets/pokemon/${imagePath}`;
    const fileExists = fs.existsSync(localImagePath);
    
    if (!fileExists) {
      await axios({ url, responseType: 'stream' })
        .then(response => (
          new Promise((resolve, reject) => {
            response.data
              .pipe(fs.createWriteStream(localImagePath))
              .on('finish', () => resolve())
              .on('error', e => reject(e));
          }))
        );
    }

    return localImagePath;
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