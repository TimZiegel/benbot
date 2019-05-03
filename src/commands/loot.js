import madlibs from 'mad-libber';
import { Command } from '../lib/command';
import { currency } from '../lib/currency';
import { getRandom, getRandomNumberBetween, isTestServer, isTestBot } from '../lib/utils';

export const lootStatus = {
  NONE: 'none',
  PENDING: 'pending',
  ACTIVE: 'active',
  CLAIMED: 'claimed'
};

export class LootCommand extends Command {
  command = 'loot';

  lootChance = .075; // Each post has a 1 in 13.333 (repeating of course) chance to start the loot timer
  lootDelay = 3600000; // When loot is triggered to spawn, delay it for a random time between 0ms and 1 hour
  lootExpiry = 3600000; // If loot is triggered and no one has claimed it within 1 hour, it can be deleted
  lootImage = 'assets/loot.jpg';
  lootStatus = lootStatus.NONE;
  lootMessage = null;
  lootTimer = null;
  lootTimestamp = 0;
  lootSpawnText = 'A wild chest appears! Use the `!loot` command to claim it!';
  
  constructor() {
		super();
	}

  checkForLoot(message) {
    if (!isTestBot() && isTestServer()) return;
    const random = Math.random();
    if (this.lootStatus === lootStatus.NONE && random < this.lootChance) this.startLootTimer(message);
    else this.checkLootMessageExpiry();
  }

  startLootTimer(message) {
    this.lootStatus = lootStatus.PENDING;
    const delay = getRandomNumberBetween(0, this.lootDelay);
    this.lootTimestamp = Date.now() + delay;
    this.lootTimer = setTimeout(() => this.postLootMessage(message), delay);
  }

  postLootMessage(message) {
    return this.postFile(this.lootImage, this.lootSpawnText, message)
      .then(message => this.setLootMessage(message))
      .catch(e => this.setLootMessage(null));
  }

  setLootMessage(message = null) {
    clearTimeout(this.lootTimer);
    this.lootTimer = null;
    
    if (message) {
      this.lootMessage = message;
      this.lootStatus = lootStatus.ACTIVE;
    } else {
      this.lootMessage = null;
      this.lootStatus = lootStatus.NONE;
    }
  }

  hasLootMessage() {
    return this.lootStatus === lootStatus.ACTIVE && !!this.lootMessage;
  }

  checkLootMessageExpiry() {
    if (!this.hasLootMessage()) return;
    const now = Date.now();
    const timestamp = this.lootMessage.createdTimestamp;
    const lootAge = now - timestamp;
    if (lootAge > this.lootExpiry) {
      this.lootMessage.delete()
        .then(() => this.setLootMessage(null))
        .catch(() => this.setLootMessage(null));
    }
  }

  run(message) {
    if (this.lootStatus === lootStatus.CLAIMED) return;
    if (!this.hasLootMessage()) {
      const lootUnavailableText = getRandom(this.lootUnavailableTexts);
      return this.post(lootUnavailableText, message);
    }
    this.lootStatus = lootStatus.CLAIMED;
    const random = Math.random();
    const rarity = this.rarities.find(({ chance }) => chance > random) || getRandom(this.rarities);
    const data = getRandom(this.data);
    const loot = this.getItemName(data, rarity);
    const goldValue = this.getGoldValue(loot, rarity);
    const goldMessage = this.getGoldValueMessage(goldValue);
    const embedOptions = {
      author: {
        name: `${message.member.displayName} receives ${rarity.name} loot:`,
        icon_url: message.author.avatarURL
      },
      title: `**[${loot}]**`,
      color: rarity.color,
      footer: {
        text: goldMessage
      }
    };

    this.lootMessage.delete()
      .then(() => currency.give(message.author, goldValue, 'gold'))
      .then(() => this.postEmbed(embedOptions, message))
      .then(() => this.setLootMessage(null))
      .catch(e => {
        this.post('Sorry, an error occurred. Your item was lost in the twisting nether.', message);
        this.setLootMessage(null);
        console.error(e);
      });
  }
  
  getItemName(data, rarity) {
    let name = '${type}';
    if (rarity.level >= 4) name = '${prefix}${suffix}, ${type} of ${source}';
    else if (rarity.level === 3) name = '${prefix}${suffix}';
    else if (rarity.level === 2) name = '${type} of ${source}';
    name = madlibs(name, data);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getGoldValueMessage(value = 0) {
    if (value > 150) return `Jackpot! This item sold on the auction house for ${value}g.`;
    else if (value > 80) return `Score! A buyer in trade chat bought this item for ${value}g.`;
    else if (value < 10) return `Oops. You accidentally posted this item on the auction house for way below market value. ${value}g is better than nothing, right?`;
    else return `This item was sold to a vendor for ${value}g.`;
  }
  
  getGoldValue(name = '', rarity) {
    const random = Math.random();
    if (random > .9 && rarity.level > 1) return this.formatGoldValue(getRandomNumberBetween(100, 200) + rarity.value);
    else if (random > .85) return this.formatGoldValue(getRandomNumberBetween(50, 100) + rarity.value);
    else if (random < .1 && rarity.level > 1) return this.formatGoldValue(getRandomNumberBetween(1, 5));
    else {
      let value = name.split('').map(char => char.charCodeAt(0)).reduce((acc, curr) => acc + curr);
      value = (value % 25) + 10 + rarity.value;
      return this.formatGoldValue(value);
    };
  }
  
  formatGoldValue(value = 0) {
    return Math.ceil(value);
  }

  lootUnavailableTexts = [
    "Whoops! There is no loot available.",
    "What do I look like, a charity?",
    "Man, I just handed out loot like, a while ago.",
    "Chill. There isn't any loot yet.",
    "Gotta wait for loot to spawn, dawg.",
    "You looted a... Oh wait. There isn't any loot. Sorry.",
    "!doot",
    "Sorry, eh. Ain't got no loot for ya.",
    "Patience... Patience...",
    "You loot 4,315,716,844 gold. Err... Wait, that's not right. There isn't any loot.",
    "Sorry, we're all out of loot. Let me check the back.",
    "Sorry, I'm fresh out of loot. Check back later.",
    "I don't really feel like giving you loot right now. Maybe later.",
    "IMPUDENT MORTAL! THERE IS NO LOOT!",
    "You get nothing! You lose! Good day sir!",
    "Oopsie doopsie! There isn't any lootsie wootsie!",
    "I'm not really feeling the whole \"loot\" thing right now. Come back later",
    "Say loot again. I dare you. I double dare you, motherfucker! Say loot again!"
  ];

  rarities = [
    {
      name: 'legendary',
      level: 5,
      chance: .1,
      value: 60,
      color: 0xFF8000
    },
    {
      name: 'epic',
      level: 4,
      chance: .3,
      value: 30,
      color: 0xA335EE
    },
    {
      name: 'rare',
      level: 3,
      chance: .5,
      value: 20,
      color: 0x0070DD
    },
    {
      name: 'uncommon',
      level: 2,
      chance: .75,
      value: 10,
      color: 0x1EFF00
    },
    {
      name: 'common',
      level: 1,
      chance: 1,
      value: 0,
      color: 0x9D9D9D
    }
  ];

  data = [
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
        'axe',
        'blade',
        'maul',
        'warmaul',
        'sword',
        'greatsword',
        'greatblade',
        'greataxe',
        'warmaul',
        'warsword',
        'hammer',
        'warhammer',
        'spear',
        'club',
        'mace',
        'polearm',
        'halberd'
      ],
      source: [
        'fate',
        'the ravager',
        'the dark lord',
        'the forgotten king',
        'the nameless king',
        'the faceless one',
        'entwined destinies',
        'endless hunger',
        'endless war',
        'eternal struggle',
        'the apocalypse',
        'dark visions',
        'apocryphal fears',
        'the nightmare',
        'unending nightmares',
        'destiny'
      ]
    },
    {
      id: 'Orcish',
      prefix: [
        'Lok\'',
        'Akar\'',
        'Lohn\'',
        'Gol\'',
        'Throm-',
        'Karg',
        'Krag\'',
        'Mag\'',
        'Mok\'',
        'Nok\'',
        'Grom\'',
        'Naz',
        'Osh',
        'Gol\'',
        'Kor\'',
        'Om\'',
        'Zeth\'',
        'Zor',
        'Krom\''
      ],
      suffix: [
        'har',
        'narosh',
        'ganesh',
        'ganosh',
        'gosh',
        'goron',
        'nathal',
        'thaz',
        'krom',
        'kagh',
        'shar',
        'dashar',
        'mkral',
        'ra',
        'rogh',
        'gar',
        'gaz',
        'gor',
        'mok'
      ],
      type: [
        'axe',
        'blade',
        'maul',
        'warmaul',
        'sword',
        'greatsword',
        'greatblade',
        'greataxe',
        'warmaul',
        'warsword',
        'hammer',
        'warhammer',
        'spear',
        'club',
        'mace',
        'polearm',
        'poleaxe',
        'bloodhammer',
        'bloodsword',
        'bloodmace',
        'bloodmaul'
      ],
      source: [
        'the chieftan',
        'chieftans',
        'the warchief',
        'the warchiefs',
        'the elders',
        'the ancestors',
        'dark destinies',
        'entwined fate',
        'shattered worlds',
        'dying worlds',
        'dark bargains',
        'the hunt',
        'warring clans',
        'clan chieftans',
        'the clans',
        'the shattered hand',
        'the frostwolves',
        'the wolves',
        'bloody battles',
        'the great unifier',
        'honor',
        'forsaken honor',
        'eternal glory',
        'eternal combat',
        'dark power',
        'the blood rite',
        'the elements',
        'shamanistic rites',
        'ancestral spirits',
        'tribal unities',
        'unity',
        'fel rituals',
        'strength'
      ]
    },
    {
      id: 'Titan',
      prefix: [
        'Taesch',
        'Grond',
        'Aman\'',
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
        'anor',
        'eon',
        'immor',
        'anand',
        'aemar',
        'aman',
        'amal',
        'ibal',
        'us',
        'ar',
        'az',
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
      prefix: [
        'Aiel\'',
        'Thas\'',
        'Anu\'',
        'Ish\'',
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
        'falan',
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
        'the deep roots',
        'the deep forests'
      ]
    },
    {
      id: "Scourge",
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
        'Rune',
        'Ebon',
        'Shadow',
        'Lich'
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
        'flayer',
        'chain',
        'bound destroyer'
      ],
      type: [
        'sword',
        'greatsword',
        'runesword',
        'dreadblade',
        'runeblade',
        'greatblade',
        'greatmace',
        'corrupted blade',
        'maul',
        'dualswords',
        'morningstar',
        'axe',
        'greataxe',
        'dreadaxe',
        'runeaxe',
        'darkblade',
        'phylactery'
      ],
      source: [
        'the frozen wastes',
        'the blighted lands',
        'the borean tundra',
        'brutality',
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
        'eternal damnation',
        'endless hunger',
        'the forgotten crypt',
        'Naxxramas',
        'the necropolis',
        'the eternal lich',
        'servitude',
        'damnation',
        'Kel\'thuzad'
      ]
    },
    {
      id: 'Divine',
      prefix: [
        'Light',
        'Morning',
        'Dawn',
        'Glory',
        'Flame',
        'Naaru',
        'Prophet',
        'L\'ura',
        'Xe\'ra',
        'A\'dal',
        'Angel',
        'Uther',
        'Tirion',
        'Turalyon',
        'Lothraxion',
        'Yrel',
        'Maraad',
        'Arator',
        'Anduin'
      ],
      suffix: [
        '\'s brilliance',
        '\'s decree',
        '\'s justice',
        '\'s might',
        '\'s hope',
        '\'s protection',
        '\'s zeal',
        '\'s truth',
        '\'s wisdom',
        '\'s vigor',
        '\'s spirit',
        '\'s vigil',
        '\'s devotion',
        '\'s divinity',
        '\'s divine law',
        '\'s wake',
        '\'s inspiration',
        '\'s reverence',
        '\'s wonder',
        '\'s faith',
        '\'s piety'
      ],
      type: [
        'hammer',
        'maul',
        'warhammer',
        'blessed hammer',
        'mace',
        'morningstar',
        'sword',
        'greatsword',
        'blessed sword',
        'blessed blade',
        'blade',
        'gavel',
        'libram'
      ],
      source: [
        'the Genedar',
        'the Xenedar',
        'the light',
        'the crusade',
        'the endless crusade',
        'eternal penance',
        'peace',
        'righteousness',
        'lasting peace',
        'the protector',
        'the silver hand',
        'the ashen verdict',
        'ashes',
        'rebirth',
        'the Naaru',
        'the highlord',
        'the high kings'
      ]
    },
    {
      id: 'Dwarven',
      prefix: [
        'Krum',
        'Gol ',
        'Dun ',
        'Gar ',
        'Gorm',
        'Kazad ',
        'Khâz-',
        'Daz-',
        'Knar-',
        'Lhor-',
        'Uldaz ',
        'Khûum ',
        'Khor ',
        'Dim ',
        'Bael ',
        'Draig ',
        'Khad',
        'Gwyr',
        'Than',
        'Thel ',
        'Thor ',
        'Dru'
      ],
      suffix: [
        'goldar',
        'arâm',
        'arûm',
        'amar',
        'baldar',
        'kadûm',
        'balor',
        'baldur',
        'gar',
        'modan',
        'magnar',
        'din',
        'algaz',
        'barok',
        'morogh',
        'ranos',
        'gen',
        'ganar',
        'goth',
        'gahn',
        'dan'
      ],
      material: [
        'Iron',
        'Stone',
        'Gem',
        'Diamond',
        'Mithril',
        'Boulder',
        'Silver',
        'Gold',
        'Ruby',
        'Shard',
        'Ore',
        'Steel',
        'Magma',
        'Lava',
        'Blood'
      ],
      descriptor: [
        'foe',
        'fell',
        'forger',
        'bender',
        'breaker',
        'crusher',
        'shaper',
        'killer',
        'slayer',
        'defender',
        'kiln',
        'finder',
        'binder'
      ],
      type: [
        'hammer',
        'greathammer',
        'warhammer',
        'battlehammer',
        'bloodhammer',
        'maul',
        'warmaul',
        'bloodmaul',
        'axe',
        'greataxe',
        'spiked axe',
        'battleaxe',
        'forgehammer',
        'sword',
        'greatsword',
        'blade',
        'greatblade'
      ],
      source: [
        'kings',
        'the blacksmiths',
        'the ironshapers',
        'the stonekin',
        'the earthen',
        'earthen heritage',
        'the royal bloodline',
        'the bronzebeards',
        'the wildhammers',
        'Emperor Thaurissan',
        'the firelord',
        'the flamekin',
        'endless battles',
        'warring clans',
        'the three clans',
        'the three crowns',
        'endless fortune',
        'dwarven fortitude',
        'dwarven strength',
        'the trogg wars',
        'the high thane',
        'Modimus Anvilmar',
        'the black anvil',
        'unstoppable magma',
        'the diamond king',
        'endless caverns',
        'the echoing halls'
      ]
    },
    {
      id: 'Troll',
      prefix: [
        'Taz\'',
        'Tek\'',
        'Zek\'',
        'Tal\'',
        'Tal',
        'Zand',
        'Taj',
        'Bwon\'',
        'Zul\'',
        'Sen\'',
        'Zun',
        'Rek',
        'Ty\'',
        'Tor\'',
        'Zeb',
        'Vol\'',
        'Hai\'',
        'Kai\'',
        'Hak'
      ],
      suffix: [
        'hazi',
        'kazi',
        'azi',
        'han',
        'azal',
        'atar',
        'tulak',
        'atul',
        'aman',
        'ai',
        'shi',
        'jin',
        'kaza',
        'kala',
        'zanga',
        'jamba',
        'arek',
        'rokh',
        'kar',
        'watha',
        'tual'
      ],
      type: [
        'spear',
        'axe',
        'sword',
        'knife',
        'blade',
        'ritual knife',
        'dagger',
        'glaive',
        'fang',
        'tusk',
        'javelin',
        'waraxe',
        'warsword',
        'handaxe',
        'warglaive'
      ],
      source: [
        'the echo isles',
        'executions',
        'the troll wars',
        'the shadow hunters',
        'Zandalar',
        'Zul\'jin',
        'the darkspear',
        'the Amani',
        'the Drakkari',
        'Gundrak',
        'Zul\'gurub',
        'the unified tribes',
        'the tribes',
        'the hexpriests',
        'the voodoo priests',
        'the soulflayer',
        'the Loa',
        'Rezan',
        'Bwonsamdi',
        'Zuldazar',
        'the Farraki empire',
        'the Gurubashi',
        'the golden temple',
        'the forest trolls',
        'the jungle trolls',
        'the ice trolls',
        'Vol\'jin'
      ]
    }, {
      id: 'Void',
      prefix: [
        'Shadow ',
        'Abyssal ',
        'Void ',
        'Shath\'yari ',
        'Aqir ',
        'Nraqi ',
        'Nerubian ',
        'Silithid ',
        'Corrupting ',
        'Beholder\'s ',
        'Corruptor\'s ',
        'The black'
      ],
      suffix: [
        'star',
        'compass',
        'whisper',
        'tentacle',
        'needle',
        'spike',
        'embrace',
        'wing',
        'tide',
        'eye',
        'claw',
        'tendril',
        'horror',
        'terror'
      ],
      type: [
        'dagger',
        'paired daggers',
        'knife',
        'ritual knife',
        'blade',
        'sword',
        'divining rod',
        'eldritch artifact',
        'crystalline focus',
        'crystal ball'
      ],
      source: [
        'Ny\'alotha',
        'N\'zoth',
        'Yogg-saron',
        'Y\'shaarj',
        'C\'thun',
        'the depths',
        'the shadow',
        'Ahn\'qiraj',
        'Azjol Nerub',
        'the imprisoned one',
        'the nameless elder',
        'the old one',
        'the faceless ones',
        'manifold eyes',
        'maddening whispers',
        'the maddening gaze',
        'a thousand truths',
        'unspeakable horror',
        'the god of death',
        'the god of the deep',
        'the formless one',
        'eternal servitude',
        'the black empire',
        'the all-seeing eye',
        'the drowned'
      ]
    }, {
      id: 'Tauren',
      prefix: [
        'Anshe\'s ',
        'Earthmother\'s ',
        'Sunwalker\'s ',
        'Ancestral ',
        'Chieftan\'s ',
        'Cairne\'s ',
        'Baine\'s ',
        'Bloodhoof\'s ',
        'Huln\'s ',
        'Hamuul \'s ',
        'Thunder\'s ',
        'Spirit\'s ',
        'Spiritwalker\'s ',
        'Seer\'s ',
        'Sky father\'s '
      ],
      suffix: [
        'protection',
        'admonition',
        'guidance',
        'humility',
        'honor',
        'righteousness',
        'call',
        'refuge',
        'peace',
        'patience',
        'power',
        'strength',
        'compassion',
        'justice',
        'balance',
        'sorrow',
        'providence'
      ],
      type: [
        'club',
        'polearm',
        'poleaxe',
        'runespear',
        'spear',
        'horn',
        'totem',
        'runetotem',
        'hammer',
        'greathammer',
        'axe',
        'greataxe',
        'sword',
        'greatsword'
      ],
      source: [
        'Mulgore',
        'Thunder Bluff',
        'Camp Taurajo',
        'Highmountain',
        'the elements',
        'balance',
        'the chieftans',
        'peace',
        'unity',
        'the clans',
        'the Horde',
        'the Earthen Ring',
        'the Longwalkers',
        'the tribes',
        'the ancient pact',
        'the Stonetalon Mountains',
        'the Shu\'halo',
        'Kalimdor',
        'the ages',
        'ancestral visions',
        'foresight'
      ]
    }, {
      id: "Goblin",
      prefix: [
        'Frag',
        'Dazzle',
        'Noggen',
        'Blast',
        'Rocket',
        'Gear',
        'Flux',
        'Grapple',
        'Jet',
        'Ratchet',
        'Rust',
        'Mecha',
        'Crash',
        'Rumble',
        'Doom',
        'Techno',
        'Grease'
      ],
      suffix: [
        'fuse',
        'spark',
        'flame',
        'fire',
        'hammer',
        'breaker',
        'rail',
        'bolt',
        'cannon',
        'catcher',
        'bomber',
        'sapper',
        'coil',
        'singe',
        'gadget',
        'rocker',
        'wire'
      ],
      type: [
        'gun',
        'autoturret',
        'explosive device',
        'rocketbow',
        'rockethammer',
        'railgun',
        'buzzsaw',
        'rocket',
        'laser gun',
        'doomsday device'
      ],
      source: [
        'Gadgetzan',
        'the Bilgewater Cartel',
        'the Trade Prince',
        'endless tinkering',
        'the undisputed genius',
        'the mad scientist',
        'Kezan',
        'the apocalypse',
        'pernicious candor',
        'the trade fleets',
        'marvellous engineering',
        'spectacle',
        'superior technology',
        'absolute obliteration',
        'complete annihilation',
        'utter destruction',
        'complete chaos',
        'endless explosions',
        'improvised ingenuity',
        'the Undermine'
      ]
    }, {
      id: 'Gnomish',
      prefix: [
        'UX4260-A to UX4260-B mega-',
        'T-280 floating point beast ',
        'RX-23 nano-',
        'RT-63 prototype plasma ',
        'PD-103 error-free angle ',
        'Mark-72 thermal powered electroshock ',
        'Augmentative noncomittal power ',
        'Unstable temporal time ',
        'Semistable autonomic mind ',
        'Remote-controlled servo-routed ',
        'Pneumatic crank-operated enemy ',
        'Gearspun static energy ',
        'Bespoke custom-tooled cartridge ',
        'Semi-wireless sound dampened freon ',
        'Galvanized magnetic coil ',
        'Steam powered auto-',
        'Precision micro-tabulated spring ',
        'Thermally insulated double walled steam ',
        'Visionary futureproof electro-',
        'Deployable tactical emergency ',
        'Tactile coin-operated kitten '
      ],
      suffix: [
        'compiler',
        'defragmentor',
        'decompressor',
        'compressor',
        'conductor',
        'reflector',
        'formatter',
        'reformatter',
        'incrementer',
        'deserializer',
        'serializer',
        'translator',
        'transpiler',
        'transductor',
        'inflector',
        'transmitter',
        'generator',
        'transmutator',
        'transmogrifier',
        'relocator',
        'electrifier',
        'readjuster',
        'dilator',
        'scrambler',
        'dissolver',
        'router',
        'destroyer',
        'melter',
        'pummeler',
        'exploder',
        'combustor'
      ],
      type: [
        'enigmatic device',
        'gun',
        'laser gun',
        'laser bow',
        'doomsday device',
        'bow',
        'sword',
        'hammer',
        'impregnable device',
        'prototype weapon',
        'experimental apparatus',
        'perplexing mechanism'
      ],
      source: [
        'the High Tinker',
        'Gadgetzan',
        'Gnomish ingenuity',
        'Gnomish brilliance',
        'the tinker\'s guild',
        'Gnomeregan',
        'the mechagnomes',
        'Mechagon',
        'King Mechagon',
        'clockwork brilliance',
        'shrewd creativity',
        'expansive intellect',
        'unlimited potential',
        'endless posibilities',
        'the arcforged',
        'express convenience'
      ]
    },
    {
      id: "Mage",
      prefix: [
        "Ebon",
        "Ice",
        "Frost",
        "Hail",
        "Winter",
        "Glacial ",
        "Wild",
        "Heat",
        "Dragon",
        "Pheonix",
        "Blast",
        "Heart",
        "Chrono",
        "Nether",
        "Smouldering "
      ],
      suffix: [
        "lance",
        "flurry",
        "chill",
        "freeze",
        "vein",
        "fire",
        "flame",
        "heart",
        "storm",
        "spike",
        "shimmer",
        "nova",
        "ward",
        "rune",
        "grasp",
        "flash",
        "scorch",
        "strike",
        "fury",
        "blaze",
        "ember"
      ],
      type: [
        "staff",
        "greatstaff",
        "battlestaff",
        "stave",
        "sword",
        "dagger",
        "divining rod",
        "crystalline focus",
        "mace",
        "wand",
        "tome",
        "ancient tome",
        "arcane orb",
        "sunspear",
        "charged core",
        "crystal"
      ],
      source: [
        "the Kirin Tor",
        "Dalaran",
        "the Mages' Guild",
        "Suramar",
        "leyline mastery",
        "Coldarra",
        "the Blue Dragonflight",
        "the Red Dragonflight",
        "the young trust",
        "the guardian",
        "the corrupted guardian",
        "the last guardian",
        "Quel\'thalas",
        "Silvermoon City",
        "the Sunstrider Dynasty",
        "Karazhan",
        "the broken tower",
        "invocation",
        "terrible incantations",
        "infinite power",
        "Aegwynn",
        "Alodi",
        "internal conflict",
        "overflowing power",
        "overwhelming power",
        "absolute desctruction"
      ]
    }
  ];
  
}

export const lootCommand = new LootCommand();
