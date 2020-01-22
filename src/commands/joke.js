import axios from "axios";
import { Command } from "../lib/command";

export class JokeCommand extends Command {
  command = "joke";
  help = "Tells a hilarious joke!";
  example = "!joke";

  jokeApi = "https://icanhazdadjoke.com/";
  errorMessage = "Whoops, I couldn't think of any jokes. Try again later.";

  constructor() {
    super();
  }

  run(message) {
    const headers = { Accept: "application/json" };
    return axios
      .get(this.jokeApi, { headers })
      .then(({ data }) => data)
      .then(({ joke }) => this.postEmbed({ title: joke }, message))
      .catch(e => this.post(this.errorMessage, message));
  }
}

export const jokeCommand = new JokeCommand();
