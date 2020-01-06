import axios from "axios";
import env from "../lib/env";
import {
  getRandom,
  getRandomNumberBetween,
  isImageUrl,
  isTestBot,
  isTestServer
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

  constructor() {
    super();
  }

  run(message) {
    const url = `https://www.reddit.com/r/${this.subreddit}/${this.type}.json`;
    axios
      .get(url)
      .then(({ data }) => this.postRandomImage(data, message))
      .catch(e => console.error(`Could not get reddit data for ${url}: ${e}`));
  }

  postRandomImage(result, message) {
    const posts = result.data.children
      .map(({ data }) => data)
      .filter(data => data.title && data.url)
      .filter(({ url }) => isImageUrl(url));

    let text = "";
    if (posts.length) {
      const { title, url } = getRandom(posts);
      text = `${title} ${url}`;
    }

    this.post(text, message);
  }
}

export class RandomSpawnCommand extends Command {
  spawnChance = 0.05; // Each post has a 1 in 20 chance to start the spawn timer
  spawnDelay = 3600000; // When a spawn is triggered, delay it for a random time between 0ms and 1 hour
  spawnExpiry = 3600000; // If a spawn is triggered and no one has claimed it within 1 hour, it can be deleted
  spawnMessage = null;
  spawnTimer = null;
  spawnTimestamp = 0;
  
  spawnStatus = "none";
  spawnStatuses = {
    NONE: "none",
    PENDING: "pending",
    ACTIVE: "active",
    CLAIMED: "claimed"
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
      this.setSpawnMessage(null);
    } catch(e) {
      console.warn(e);
      await this.post('Sorry, an error occurred. Your item was lost in the twisting nether.', message);
      this.expire();
    }
  }
  
  onMessage(message) {
    if (!isTestBot() && isTestServer(message.guild)) return;
    const random = Math.random();
    if (this.spawnStatus === this.spawnStatuses.NONE && random < this.spawnChance) this.startTimer(message);
    else this.checkExpiry();
  }

  setSpawnMessage(message = null) {
    clearTimeout(this.spawnTimer);
    this.spawnTimer = null;

    if (message) {
      this.spawnMessage = message;
      this.spawnStatus = this.spawnStatuses.ACTIVE;
    } else {
      this.spawnMessage = null;
      this.spawnStatus = this.spawnStatuses.NONE;
    }
  }
  
  async deleteSpawnMessage() {
    return this.spawnMessage
      .delete()
      .then(() => this.setSpawnMessage(null))
      .catch(() => this.setSpawnMessage(null));
  }
  
  startTimer(message) {
    this.spawnStatus = this.spawnStatuses.PENDING;
    const delay = getRandomNumberBetween(0, this.spawnDelay);
    this.spawnTimestamp = Date.now() + delay;
    this.spawnTimer = setTimeout(() => (
      this.spawn(message)
        .then(spawnMessage => this.setSpawnMessage(spawnMessage))
        .catch(() => this.setSpawnMessage(null))
    ), delay);
  }

  isActive() {
    return this.spawnStatus === this.spawnStatuses.ACTIVE && !!this.spawnMessage;
  }

  checkExpiry() {
    if (!this.isActive()) return;
    const now = Date.now();
    const timestamp = this.spawnMessage.createdTimestamp;
    const spawnAge = now - timestamp;
    if (spawnAge > this.spawnExpiry) this.expire();
  }
  
  expire() {
    return this.deleteSpawnMessage();
  }
}
