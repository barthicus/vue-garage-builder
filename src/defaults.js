const garage = {
  roof: {
    type: 'dwuspadowy',
    isTiling: false
  },
  width: 3,
  length: 5,
  gates: {
    num: 1
  },
  sheet: {
    mode: 'uniform'
  },
  wallsPerforation: 'horizontal'
}

const gate = {
  twoSided: {
    entryHeight: 200,
    position: 'środek',
    width: 295,
    perforation: 'vertical',
    type: 'dwuskrzydłowa'
  },
  upAndOver: {
    entryHeight: 190,
    position: 'środek',
    width: 295,
    perforation: 'vertical',
    type: 'uchylna'
  }
}

const sheets = {
  wooden: [
    {
      name: 'złoty dąb',
      value: 'złoty dąb',
      texture: {
        vertical: 'img/zloty_dab_pion_texture.jpg',
        horizontal: 'img/zloty_dab_poziom_texture.jpg'
      },
      // texture: 'img/zloty_dab_poziom_texture.jpg',
      thumb: 'img/zloty_dab_thumb.jpg',
      type: 'wooden'
    },
    {
      name: 'orzech',
      value: 'orzech',
      texture: {
        vertical: 'img/orzech_pion_texture.jpg',
        horizontal: 'img/orzech_poziom_texture.jpg'
      },
      thumb: 'img/orzech_thumb.jpg',
      type: 'wooden'
    }
  ],
  galvanized: [
    {
      name: 'ocynkowana I gat',
      value: 'ocynkowana I gat',
      hex: '#e0e0e0',
      type: 'galvanized'
    },
    {
      name: 'ocynkowana II gat',
      value: 'ocynkowana II gat',
      hex: '#e0e0e0',
      type: 'galvanized'
    }
  ],
  acrylic: [
    {
      name: 'akrylowa 8017 ciemny brąz',
      value: 'RAL 8017',
      hex: '#2e1c1c',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 8004 rudy',
      value: 'RAL 8004',
      hex: '#85382b',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 3011 czerwony',
      value: 'RAL 3011',
      hex: '#781417',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 3005 wiśnia',
      value: 'RAL 3005',
      hex: '#4f121a',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 9010 czysty biały',
      value: 'RAL 9010',
      hex: '#faffff',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 9002 brudny biały',
      value: 'RAL 9002',
      hex: '#f0ede6',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 7035 siwy',
      value: 'RAL 7035',
      hex: '#d4d9db',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 7016 grafitowy (ciemny szary)',
      value: 'RAL 7016',
      hex: '#262e38',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 9006 stalowy',
      value: 'RAL 9006',
      hex: '#a6abb5',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 5010 niebieski',
      value: 'RAL 5010',
      hex: '#002b70',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 6005 ciemna zieleń',
      value: 'RAL 6005',
      hex: '#0a381f',
      type: 'acrylic'
    },
    {
      name: 'akrylowa 1002 piasek',
      value: 'RAL 1002',
      hex: '#d6b075',
      type: 'acrylic'
    }
  ]
}

const roofAngles = {
  '2': 20.8,
  '2.5': 18.16,
  '3': 15.53,
  '3.5': 17.2,
  '4': 14.7,
  '4.5': 14,
  '5': 12,
  '5.5': 10.5,
  '6': 9.2,
  '6.5': 9.4,
  '7': 9.73,
  '7.5': 8.4,
  '8': 7.5,
  '8.5': 6.3,
  '9': 5.3,
  '9.5': 4.5,
  '10': 3.5,
  '10.5': 2.5,
  '11': 2,
  '11.5': 1,
  '12': 0.5,
  '12.5': -0.5,
  '13': -1,
  '13.5': -1.7,
  '14': -2.3,
  '14.5': -3,
  '15': -3.5,
  '15.5': -4.1,
  '16': -4.7
}

const heights = {
  'dwuspadowy': {
    'dwuskrzydłowa': {
      '2.00': {
        '2': { h1: 2.48, h2: 2.10 },
        '2.5': { h1: 2.51, h2: 2.10 },
        '3': { h1: 2.51, h2: 2.10 },
        '3.5': { h1: 2.65, h2: 2.10 },
        '4': { h1: 2.65, h2: 2.10 },
        '4.5': { h1: 2.7, h2: 2.10 },
        '5': { h1: 2.7, h2: 2.10 },
        '5.5': { h1: 2.7, h2: 2.10 },
        '6': { h1: 2.7, h2: 2.10 },
        '6.5': { h1: 2.8, h2: 2.10 },
        '7': { h1: 2.9, h2: 2.10 },
        '7.5': { h1: 2.9, h2: 2.10 },
        '8': { h1: 2.9, h2: 2.10 },
        '8.5': { h1: 2.9, h2: 2.10 },
        '9': { h1: 2.9, h2: 2.10 },
        '9.5': { h1: 2.9, h2: 2.10 },
        '10': { h1: 2.9, h2: 2.10 },
        '10.5': { h1: 2.9, h2: 2.10 },
        '1': { h1: 2.9, h2: 2.10 },
        '11.5': { h1: 2.9, h2: 2.10 },
        '12': { h1: 2.9, h2: 2.10 },
        '12.5': { h1: 2.9, h2: 2.10 },
        '13': { h1: 2.9, h2: 2.10 },
        '13.5': { h1: 2.9, h2: 2.10 },
        '14': { h1: 2.9, h2: 2.10 },
        '14.5': { h1: 2.9, h2: 2.10 },
        '15': { h1: 2.9, h2: 2.10 },
        '15.5': { h1: 2.9, h2: 2.10 },
        '16': { h1: 2.9, h2: 2.10 }
      }
    }
  }
}

export { garage, gate, sheets, roofAngles, heights }
