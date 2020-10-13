import axios from "axios";
import { isEmpty } from "lodash";
import env from "../lib/env";
import {
  getRandom,
  getRandomNumberBetween,
  isImageUrl,
  isTestBot,
  isTestServer,
  randomize
} from "./utils";
import { postMessage, postFile, postEmbed } from "./bot";

const { COMMAND_PREFIX } = env;

export class Command {
  command = "";
  aliases = [];

  constructor() {}

  run() {}

  check(message) {
    const commands = [this.command, ...this.aliases];
    const regexes = commands
      .filter(command => !!command)
      .map(
        command => new RegExp("^\\" + COMMAND_PREFIX + command + "\\b", "i")
      );
    return regexes.some(regex => regex.test(message.content));
  }

  post(text, message) {
    const { channel } = message;
    if (text) return postMessage(text, channel);
    else return postMessage("Hrm, I couldn't find anything to post. Sorry, eh 🍁");
  }

  async postFile(file, text, message) {
    const { channel } = message;
    if (!text || !channel) throw new Error('Cannot post file: missing parameters.');
    return postFile(file, text, channel);
  }

  async postEmbed(options, message) {
    const { channel } = message;
    if (!options || !channel) throw new Error('Cannot post embed: missing parameters.')
    if (options) return postEmbed(options, channel);
  }
}

export class RandomDataCommand extends Command {
  data = [];

  constructor() {
    super();
  }

  // Custom replacements: return an object of key/value pairs
  getReplacements(message) {}
  
  // Custom data: return a subset of data, if applicable
  getData(message) {}
  
  run(message) {
    const { mentions } = message;
    const hasMentions = mentions.members && mentions.members.size;
    
    const author = message.member.displayName;
    const name = hasMentions ? mentions.members.first().displayName : author;
    
    const customReplacements = this.getReplacements(message) || {};
    const replacements = { name, author, ...customReplacements };
    Object.entries(replacements).forEach(([key, value]) => replacements[key.toUpperCase()] = value.toUpperCase());
    
    const data = this.getData(message) || this.data;
    const random = getRandom(data);
    const text = this.formatText(random, replacements);
    this.post(text, message);
  }

  formatText(text, replacements = {}) {
    return Object.entries(replacements).reduce((acc, [key, value]) => {
      const regex = new RegExp("\\${" + key + "}", "g");
      return acc.replace(regex, value);
    }, text);
  }
}

export class SubredditImageCommand extends Command {
  subreddit = "";
  type = "top";
  cache = []; // Cached posts from the subreddit
  cacheExpiry = 1800000; // 30 minutes in ms
  cacheTimestamp = 0;
  cacheIndex = 0;

  constructor() {
    super();
  }

  async run(message) {
    const posts = await this.getPosts();
    if (isEmpty(posts)) return this.post("Sorry, I couldn't find any images to post.", message);
    
    this.cacheIndex = (this.cacheIndex + 1) % posts.length;
    const { title, url } = posts[this.cacheIndex];
    return this.post(`${title} ${url}`, message);
  }
  
  async getPosts() {
    if (this.isExpired()) this.cache = [];
    
    if (isEmpty(this.cache)) {
      const url = `https://www.reddit.com/r/${this.subreddit}/${this.type}.json`;
      this.cacheTimestamp = Date.now();
      this.cacheIndex = 0;
      
      try {
        this.cache = await axios
          .get(url)
          .then(({ data }) => data)
          .then(({ data }) => data.children.map(({ data }) => data))
          .then(posts => posts.filter(data => data.title && data.url && isImageUrl(data.url)))
          .then(posts => randomize(posts));
      } catch (e) {
        console.error(`Could not get reddit data for ${url}: ${e}`);
        this.cache = [];
      }
    }
    
    return this.cache;
  }
  
  isExpired() {
    const now = Date.now();
    const timestamp = this.cacheTimestamp;
    const cacheAge = now - timestamp;
    return cacheAge > this.cacheExpiry;
  }
}

export class RandomSpawnCommand extends Command {
  spawnChance = 0.05; // Each post has a 1 in 20 chance to start the spawn timer
  spawnDelay = 3600000; // When a spawn is triggered, delay it for a random time between 0ms and 1 hour
  spawnExpiry = 3600000; // If a spawn is triggered and no one has claimed it within 1 hour, it can be deleted
  spawnRefractory = 5000; // After a spawn has been claimed, wait 10 minutes before attempting to spawn another
  spawnMessage = null;
  spawnTimer = null;
  spawnTimestamp = 0;
  
  spawnStatus = "none";
  spawnStatuses = {
    NONE: "none",
    PENDING: "pending",
    ACTIVE: "active",
    CLAIMED: "claimed",
    REFRACTORY: "refractory",
  };

  constructor() {
    super();
  }

  // Required methods
  
  async spawn(message) {} // Must return a promise that resolves to a spawn message
  async claim(message, spawnMessage) {}
  async unavailable(message) {}
  
  async run(message) {
    if (this.spawnStatus === this.spawnStatuses.CLAIMED) return;
    if (!this.isActive()) return this.unavailable(message);
    this.spawnStatus = this.spawnStatuses.CLAIMED;

    try {
      await this.claim(message, this.spawnMessage);
    } catch(e) {
      console.error(e);
      await this.post('Sorry, an error occurred. Your item was lost in the twisting nether.', message);
    }

    await this.expire();
  }
  
  onMessage(message) {
    if (!isTestBot() && isTestServer(message.guild)) return;
    const random = Math.random();
    if (this.spawnStatus === this.spawnStatuses.NONE && random < this.spawnChance) this.startTimer(message);
    else this.checkExpiry();
    return this.isSpawned();
  }

  async setSpawnMessage(message = null) {
    clearTimeout(this.spawnTimer);
    this.spawnTimer = null;
    if (!message && this.spawnMessage) await this.spawnMessage.delete();
    this.spawnMessage = message;
    return message;
  }
  
  startTimer(message) {
    this.spawnStatus = this.spawnStatuses.PENDING;
    const delay = getRandomNumberBetween(0, this.spawnDelay);
    this.spawnTimestamp = Date.now() + delay;
    this.spawnTimer = setTimeout(() => (
      this.spawn(message)
        .then(spawnMessage => this.setSpawnMessage(spawnMessage))
        .then(() => this.spawnStatus = this.spawnStatuses.ACTIVE)
        .catch(() => this.expire())
    ), delay);
  }

  isActive() {
    return this.spawnStatus === this.spawnStatuses.ACTIVE && !!this.spawnMessage;
  }

  isSpawned() {
    return this.spawnStatus !== this.spawnStatuses.NONE;
  }

  checkExpiry() {
    if (!this.isActive()) return;
    const now = Date.now();
    const timestamp = this.spawnMessage.createdTimestamp;
    const spawnAge = now - timestamp;
    if (spawnAge > this.spawnExpiry) this.expire();
  }

  async expire() {
    await this.setSpawnMessage(null);
    this.spawnStatus = this.spawnStatuses.REFRACTORY;
    setTimeout(() => this.spawnStatus = this.spawnStatuses.NONE, this.spawnRefractory);
  }
}
