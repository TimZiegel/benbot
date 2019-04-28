import axios from 'axios';
import { getRandom, isImageUrl } from './utils';
import { postMessage, postFile, postEmbed } from './bot';

const { COMMAND_PREFIX } = process.env;

export class Command {
	command = '';
	aliases = [];

	constructor() {}

	run() {}

	check(message) {
		const { content } = message;
		const commands = [this.command, ...this.aliases];
		const regexes = commands
			.filter(command => !!command)
			.map(command => (
				new RegExp('^\\' + COMMAND_PREFIX + command + '\\b', 'i')
			));
		return regexes.some(regex => regex.test(content));
	}

	post(text, message) {
		const { channel } = message;
		if (text) return postMessage(text, channel);
		else return postMessage("Hrm, I couldn't find anything to post. Sorry, eh 🍁");
  }
  
  postFile(file, text, message) {
    const { channel } = message;
    if (text) return postFile(file, text, channel);
    else return Promise.reject();
  }

  postEmbed(options, message) {
    const { channel } = message;
    if (options) return postEmbed(options, channel);
    else return Promise.reject();
  }
}

export class RandomDataCommand extends Command {
	data = [];

	constructor() {
		super();
	}

	run(message) {
		const replacements = {
			name: message.member.displayName,
			NAME: message.member.displayName.toUpperCase()
		};
		const random = getRandom(this.data);
		const text = this.formatText(random, replacements);
		this.post(text, message);
	}

	formatText(text, replacements = {}) {
		return Object.entries(replacements)
			.reduce((acc, [key, value]) => {
				const regex = new RegExp('\\${' + key + '}', 'g');
				return acc.replace(regex, value);
			}, text);
	}
}

export class SubredditImageCommand extends Command {
	subreddit = '';
	type = 'top';

	constructor() {
		super();
	}

	run(message) {
		const url = `https://www.reddit.com/r/${this.subreddit}/${this.type}.json`;
		const posts = axios.get(url)
			.then(({ data }) => this.postRandomImage(data, message))
			.catch(e => console.error(`Could not get reddit data for ${url}: ${e}`));
	}

	postRandomImage(result, message) {
		const posts = result.data.children
			.map(({ data }) => data)
			.filter(data => data.title && data.url)
			.filter(({ url }) => isImageUrl(url));

		let text = '';
		if (posts.length) {
			const { title, url } = getRandom(posts);
			text = `${title} ${url}`;
		}

		this.post(text, message);
	}
}