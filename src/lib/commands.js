import { BenbotCommand } from '../commands/benbot';
import { ShaqCommand } from '../commands/shaq';
import { ShaqFuCommand } from '../commands/shaq-fu';
import { ShaqurenCommand } from '../commands/shaquren';
import { FartCommand } from '../commands/fart';
import { AwwCommand } from '../commands/aww';
import { SlothCommand } from '../commands/sloth';
import { CorgiCommand } from '../commands/corgi';
import { HuskyCommand } from '../commands/husky';
import { GermanShepherdCommand } from '../commands/german-shepherd';
import { FoodCommand } from '../commands/food';
import { DrinkCommand } from '../commands/drink';
import { RoarCommand } from '../commands/roar';
import { BlingtronCommand } from '../commands/blingtron';
import { JustGuildyThingsCommand } from '../commands/just-guildy-things';
import { NsfwCommand } from '../commands/nsfw';
import { ChristmasCommand } from '../commands/christmas';

export const commands = [
	new BenbotCommand(),
	new ShaqCommand(),
	new ShaqFuCommand(),
	new ShaqurenCommand(),
	new FartCommand(),
	new AwwCommand(),
	new SlothCommand(),
	new CorgiCommand(),
	new HuskyCommand(),
	new GermanShepherdCommand(),
	new FoodCommand(),
	new DrinkCommand(),
	new RoarCommand(),
	new BlingtronCommand(),
	new JustGuildyThingsCommand(),
	new NsfwCommand(),
	new ChristmasCommand()
];
