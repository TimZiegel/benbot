export const armorTypes = [
  'plate',
  'mail',
  'leather',
  'cloth'
];

export const armorSlots = [
  'head',
  'chest',
  'shoulder',
  'back',
  'hands',
  'legs',
  'feet'
];

export const armor = [
  // Heads
  {
    name: "Helm",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['head'] 
  }, {
    name: "Greathelm",
    armorTypes: ['plate'],
    armorSlots: ['head']
  }, {
    name: "Visage",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['head']
  }, {
    name: "Hood",
    armorTypes: ['leather', 'cloth'],
    armorSlots: ['head']
  }, {
    name: "Barbute",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['head']
  }, {
    name: "Heaume",
    armorTypes: ['plate'],
    armorSlots: ['head']
  }, {
    name: "Armet",
    armorTypes: ['plate', 'mail', 'leather'],
    armorSlots: ['head']
  }, {
    name: "Coif",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['head']
  }, {
    name: "Mask",
    armorTypes: ['plate', 'mail', 'leather', 'cloth']
  },
  // Chests
  {
    name: "Chest",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['chest']
  },
  {
    name: "Breastplate",
    armorTypes: ['plate'],
    armorSlots: ['chest']
  },
  {
    name: "Jerkin",
    armorTypes: ['mail', 'leather'],
    armorSlots: ['chest']
  },
  {
    name: "Hauberk",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['chest']
  },
  {
    name: "Cuirass",
    armorTypes: ['plate', 'mail', 'leather'],
    armorSlots: ['chest']
  },
  {
    name: "Harness",
    armorTypes: ['plate', 'mail', 'leather'],
    armorSlots: ['chest']
  },
  {
    name: "Robe",
    armorTypes: ['cloth'],
    armorSlots: ['chest'] 
  },
  {
    name: "Vestment",
    armorTypes: ['leather', 'cloth'],
    armorSlots: ['chest']
  },
  {
    name: "Garb",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['chest']
  },
  // Shoulders
  {
    name: "Pauldron",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['shoulder']
  },
  {
    name: "Pauldrons",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['shoulder']
  },
  {
    name: "Spaulders",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['shoulder']
  },
  {
    name: "Shoulders",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['shoulder']
  },
  {
    name: "Mantle",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['shoulder']
  },
  {
    name: "Shoulderguards",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['shoulder']
  },
  // Backs
  {
    name: "Shroud",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['back']
  },
  {
    name: "Cape",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['back']
  },
  {
    name: "Drape",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['back']
  },
  {
    name: "Shawl",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['back']
  },
  {
    name: "Cloak",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['back']
  },
  // Hands
  {
    name: "Gloves",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['hands']
  },
  {
    name: "Gauntlets",
    armorTypes: ['plate', 'mail', 'leather'],
    armorSlots: ['hands']
  },
  {
    name: "Vambracers",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['hands']
  },
  {
    name: "Bracers",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['hands']
  },
  // Legs
  {
    name: "Leggings",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['legs']
  },
  {
    name: "Legguards",
    armorTypes: ['plate', 'mail', 'leather'],
    armorSlots: ['legs']
  },
  {
    name: "Pants",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['legs']
  },
  {
    name: "Robes",
    armorTypes: ['cloth'],
    armorSlots: ['legs']
  },
  {
    name: "Trousers",
    armorTypes: ['mail', 'leather', 'cloth'],
    armorSlots: ['legs']
  },
  {
    name: "Pantaloons",
    armorTypes: ['leather'],
    armorSlots: ['legs']
  },
  // Feet
  {
    name: "Greaves",
    armorTypes: ['plate', 'mail'],
    armorSlots: ['feet']
  },
  {
    name: "Boots",
    armorTypes: ['plate', 'mail', 'leather', 'cloth'],
    armorSlots: ['feet']
  },
  {
    name: "Sabatons",
    armorTypes: ['plate'],
    armorSlots: ['feet']
  },
  {
    name: "Sandals",
    armorTypes: ['leather', 'cloth'],
    armorSlots: ['feet']
  },
  {
    name: "Slippers",
    armorTypes: ['cloth'],
    armorSlots: ['feet']
  },
  {
    name: "Sneakers",
    armorTypes: ['leather'],
    armorSlots: ['feet']
  },
  {
    name: "Greatboots",
    armorTypes: ['plate'],
    armorSlots: ['feet']
  }
];

export const owners = [
  {
    name: "Executioner",
    armorTypes: ['plate']
  },
  {
    name: "Dread Pirate",
    armorTypes: ['leather']
  },
  {
    name: "Beastlord",
    armorTypes: ['mail', 'leather']
  },
  {
    name: "Destroyer",
    armorTypes: ['plate', 'mail', 'leather', 'cloth']
  },
  {
    name: "Destructor",
    armorTypes: ['cloth']
  },
  {
    name: "Incinerator",
    armorTypes: ['cloth']
  },
  {
    name: "Armorer",
    armorTypes: ['plate', 'mail']
  },
  {
    name: "Weaponmaster",
    armorTypes: ['plate', 'leather']
  },
  {
    name: "High King",
    armorTypes: ['plate', 'mail', 'leather', 'cloth']
  },
  {
    name: "Warchief",
    armorTypes: ['plate', 'mail', 'leather']
  },
  {
    name: "Combatant",
    armorTypes: ['plate', 'mail', 'leather', 'cloth']
  },
  {
    name: "Juggernaut",
    armorTypes: ['plate']
  },
  {
    name: "Dreadnaught",
    armorTypes: ['plate']
  },
  {
    name: "Knight",
    armorTypes: ['plate']
  },
  {
    name: "Assassin",
    armorTypes: ['leather']
  },
  {
    name: "Mage",
    armorTypes: ['cloth']
  },
  {
    name: "Roughneck",
    armorTypes: ['mail', 'leather']
  },
  {
    name: "Spymaster",
    armorTypes: ['leather']
  },
  {
    name: "High Tinker",
    armorTypes: ['plate', 'mail', 'cloth']
  },
  {
    name: "Engineer",
    armorTypes: ['plate', 'mail', 'leather', 'cloth']
  },
  {
    name: "Arsonist",
    armorTypes: ['leather', 'cloth']
  },
  "Demolitionist",
  "Blademaster",
  "Dread Stalker",
  "Defender",
  "Praetor",
  "Deathguard",
  "Vindicator",
  "High Priest",
  "Warlord",
  "Gladiator",
  "Battlemaster",
  "Bloodlord",
  "Brood Mother",
  "Berserker",
  "Barbarian",
  "Archdruid",
  "Archmage",
  "Deathlord",
  "Highlord",
  "Grandmaster",
  "Shadowblade",
  "Huntmaster",
  "Battlelord",
  "Netherlord",
  "Guardian",
  "Farseer",
  "Slayer",
  "Demon Slayer",
  "Ranger",
  "Dark Ranger",
  "Battlemage"
];