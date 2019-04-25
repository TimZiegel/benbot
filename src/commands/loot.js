import { Command } from '../lib/command';

export class LootCommand extends Command {
	command = 'loot';

  rarities = [
    { name: 'Legendary', chance: .075, color: 'fix' },
    { name: 'Epic', chance: .2, color: 'diff' },
    { name: 'Rare', chance: .4, color: 'md' },
    { name: 'Uncommon', chance: .65, color: 'CSS' },
    { name: 'Common', chance: 1, color: '' }
  ];
  
  data = {
    
    loot: {
      'Legendary': [
        '${}'
      ]
    },
    
    replacements: {
      weapons: [
        {
          type: 'Generic',
          prefix: [
            'Gore',
            'Maim',
            'Crush',
            'Thunder',
            'Light',
            'Void',
            'Shadow',
            'Fel',
            'Mist',
            'Doom',
            'Dark',
            'Plague',
            'Scourge',
            'Frost',
            'Ice',
            'Ash',
            'Blood',
            'Rot',
            'Flame',
            'Dragon',
            'Death',
            'Titan'
          ],
          suffix: [
            'howl',
            'flayer',
            'slayer',
            'gore',
            'cleaver',
            'smasher',
            'pummeler',
            'crusher',
            'scorn',
            'blood',
            'vein',
            'blossom',
            'bloom',
            'bane',
            'foe',
            'mourne',
            'bringer',
            'rot',
            'flame',
            'heart',
            'core',
            'breaker',
            'whisper',
            'spike',
            'reaper'
          ],
          title: [
            
          ],
          source: [
            
          ]
        },
        {
          type: 'Titan',
          prefix: [
            'Taesch',
            'Grond',
            'Aman',
            'Eon',
            'Aeth',
            'Norg',
            'Aggr',
            'Khaz',
            'Golg',
            'Chaer',
            'Gorr',
            'Khor',
            'Brael',
            'Arg'
          ],
          suffix: [
            'alach',
            'ar\'an',
            'al\'an',
            'annor',
            'eon',
            'immor',
            'anand',
            'aemar',
            'aman',
            'amal',
            'ibal',
            'us',
            'ar',
            'innar'
          ],
          title: [
            
          ],
          source: [
            
          ]
        },
        {
          type: 'Elven',
          prefix: [
            'Aeal\'',
            'Thas\'',
            'Anu\'',
            'Ishnu\'',
            'Tel\'',
            'Shan\'',
            'Shal\'',
            'Kel\'',
            'Ren\'',
            'Quel\'',
            'Shel\'',
            'Quen\''
          ],
          suffix: [
            'doriyah',
            'dorah',
            'thoribas',
            'alah',
            'aranas',
            'danar',
            'thalanar',
            'shalan',
            'falanar',
            'quenaar',
            'ibaan',
            'amaya',
            'quaya'
          ],
          title: [
            
          ],
          source: [
            
          ]
        }
      ]
    }
  };

	constructor() {
		super();
	}

  run() {
    const random = Math.random();
    const rarity = this.rarities.find(({ chance }) => chance < random) || this.rarities[this.rarities.length];
    
  }
  
}
