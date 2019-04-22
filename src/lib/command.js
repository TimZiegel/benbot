import axios from 'axios';
import { getRandom, isImageUrl } from './utils';
import { bot, postMessage } from './bot';

const { COMMAND_PREFIX } = process.env;

export class Command {
	command = 'benbot';
	aliases = [];

	constructor() {}

	run() {}

	check(message) {
		const { content } = message;
		const commands = [this.command, ...this.aliases];
		const regexes = commands.map(command => (
			new RegExp('^\\' + COMMAND_PREFIX + command + '\\b', 'i')
		));
		return regexes.some(regex => regex.test(content));
	}

	post(text, message) {
		const { channel } = message;
		if (text) postMessage(text, channel);
		else postMessage("Hrm, I couldn't find anything to post. Sorry, eh 🍁");
	}
}

export class RandomDataCommand extends Command {
	data = [];

	constructor() {
		super();
	}

	run(message) {
		const text = getRandom(this.data);
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