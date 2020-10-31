import axios from "axios";
import { Command } from "../lib/command";

export class JokeCommand extends Command {
  command = "joke";
  help = `The !joke command tells a hilarious* joke from icanhazdadjoke.com! *Note: hilarity not guaranteed.`;
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
