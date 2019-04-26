import { Command } from '../lib/command';
import { getRandomNumberBetween } from '../lib/utils';

export class LootCommand extends Command {
	command = 'loot';

  rarities = [
    { name: 'Legendary', chance: .075, color: 'fix', value: 50 },
    { name: 'Epic', chance: .2, color: 'diff', value: 20 },
    { name: 'Rare', chance: .4, color: 'md', value: 10 },
    { name: 'Uncommon', chance: .65, color: 'CSS', value: 5 },
    { name: 'Common', chance: 1, color: '', value: 0 }
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
          id: 'Generic',
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
          type: [
            
          ],
          source: [
            'fate',
            'ravaging',
            'entwined destinies',
            'endless hunger',
            'endless war',
            'eternal struggle',
            'the apocalypse',
            'dark visions',
            'apocryphal fears',
            'nightmare tendrils',
            'unending nightmares',
            'destiny'
          ]
        },
        {
          id: 'Titan',
          name: [
            '${prefix}${suffix}, ${type} of ${source}'
          ],
          prefix: [
            'Taesch',
            'Grond',
            'Aman\'',
            'Eon',
            'Aeth',
            'Norg',
            'Aggr',
            'Khaz',
            'Golg',
            'Chaer',
            'Gorr',
            'Khor',
            'Brael\'',
            'Uld'
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
            'innar',
            'ir'
          ],
          type: [
            'greatstaff',
            'staff',
            'hammer',
            'greathammer',
            'blade',
            'greatblade',
            'sword',
            'greatsword',
            'bow',
            'greatbow',
            'reflecting prism',
            'scythe',
            'greatscythe',
            'crescent'
          ],
          source: [
            'the waning moon',
            'constellations',
            'constellar constructs',
            'planetary re-origination',
            'the cosmos',
            'the pantheon',
            'titanic wrath',
            'world breaking',
            'world shaping',
            'the world breaker',
            'the world shaper',
            'arcane reconstitution',
            'the world soul',
            'noble souls',
            'the watchers',
            'the twisting nether',
            'infinite possibilities',
            'the colossal order',
            'universal order',
            'the precursors',
            'infinite time',
            'life binding',
            'justice',
            'titanic ruin',
            'stars',
            'infinite possibilities',
            'unending torment'
          ]
        },
        {
          id: 'Elven',
          name: [
            '${prefix}${suffix}, ${type} of ${source}'
          ],
          prefix: [
            'Aiel\'',
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
            'quaya',
            'dan\'el'
          ],
          type: [
            'bow',
            'greatbow',
            'longbow',
            'shortbow',
            'staff',
            'quarterstaff',
            'greatstaff',
            'kukri',
            'dagger',
            'daggers',
            'knife',
            'sword',
            'dualswords',
            'quiver',
            'kunai',
            'crescent',
            'glaive',
            'warglaive'
          ],
          source: [
            'Quel\'danas',
            'Quel\'thalas',
            'the Sin\'dorei',
            'the Kal\'dorei',
            'the Ren\'dorei',
            'eternal night',
            'the archdruid',
            'the waning moon',
            'the full moon',
            'the world tree',
            'the moon',
            'the sunwell',
            'the sun',
            'Suramar',
            'Zin-Azshari',
            'Thalassian kings',
            'eternal ancestry',
            'Elune',
            'Elune\'s chosen',
            'the night warrior',
            'endless glades',
            'the whispering winds',
            'the forest song',
            'the wisps',
            'the ancients',
            'arcane constructs',
            'unending war',
            'endless withering',
            'rustling leaves',
            'the deep roots'
          ]
        },
        {
          id: "Scourge",
          name: [
            '${prefix}${suffix}, ${type} of ${source}'
          ],
          prefix: [
            'Bile',
            'Plague',
            'Rime',
            'Frost',
            'Ice',
            'Rot',
            'Vile',
            'Soul',
            'Blood',
            'Scourge',
            'Flesh',
            'Bone',
            'Death',
            'Gore',
            'Fester',
            'Wrath',
            'Lich',
            'Rune'
          ],
          suffix: [
            'mourne',
            'howl',
            'howler',
            'maw',
            'spike',
            'crush',
            'rot',
            'bringer',
            'reaper',
            'drinker',
            'feaster',
            'caller',
            'splinter',
            'foe',
            'blister',
            'bound destroyer'
          ],
          type: [
            'sword',
            'greatsword',
            'runesword',
            'dreadblade',
            'runeblade',
            'greatmace',
            'corrupted blade',
            'maul',
            'dualswords',
            'morningstar',
            'axe',
            'greataxe',
            'dreadaxe',
            'runeaxe',
            'phylactery'
          ],
          source: [
            'the frozen waste',
            'the blighted lands',
            'the borean tundra',
            'Drakkari brutality',
            'cruelty',
            'undeath',
            'a thousand souls',
            'eternal torment',
            'unending suffering',
            'blighted agony',
            'the blood champion',
            'the fallen crusader',
            'runic corruption',
            'rising death',
            'the ashen wake',
            'ashes',
            'the ebon hold',
            'the dark crusade',
            'the ashen verdict',
            'unholy blight',
            'howling winds',
            'eternal damnation'
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
  
  getGoldValueMessage(value = 0) {
    if (value > 500) return `Jackpot! You sold this item on the auction house for ${value}g.`;
    else if (value > 100) return `Score! You found a buyer for this item in trade chat who paid you ${value}g.`;
    else if (value <= 10) return `Oops. You listed this item on the auction house but forgot a couple zeroes. Your item only sold for ${value}g.`;
    else return `You vendored this item for ${value}g.`;
  }
  
  getGoldValue(name = '', rarityValue = 0) {
    const random = Math.random();
    if (random > .95) return this.formatGoldValue(getRandomNumberBetween(500, 1000) + rarityValue);
    else if (random > .85) return this.formatGoldValue(getRandomNumberBetween(100, 200) + rarityValue);
    else if (random > .05) return this.formatGoldValue(getRandomNumberBetween(1, 5) + rarityValue);
    else {
      let value = name.split('').map(char => char.charCodeAt(0)).reduce((acc, curr) => acc + curr);
      value = (value % 40) + 10 + rarityValue;
      return this.formatGoldValue(value);
    };
  }
  
  formatGoldValue(value = 0) {
    return Math.ceil(value);
  }
  
}
