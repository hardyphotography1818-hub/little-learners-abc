export interface ColorItem {
  id: string;
  name: string;
  hindiName: string;
  hindiPronounce: string;
  hex: string;
  textColor: string;
  borderHex: string;
  examples: {
    word: string;
    hindiWord: string;
    emoji: string;
  }[];
  factEn: string;
  factHi: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  hindiName: string;
  hindiPronounce: string;
  sides: number;
  corners: number;
  color: string;
  examples: {
    word: string;
    hindiWord: string;
    emoji: string;
  }[];
  factEn: string;
  factHi: string;
}

export interface ColorMixRule {
  color1: string;
  color2: string;
  resultId: string;
  resultName: string;
  resultHindi: string;
  resultHex: string;
  formula: string;
}

export const COLORS_DATA: ColorItem[] = [
  {
    id: 'red',
    name: 'Red',
    hindiName: 'लाल',
    hindiPronounce: 'Laal',
    hex: '#ef4444',
    borderHex: '#dc2626',
    textColor: 'text-white',
    examples: [
      { word: 'Apple', hindiWord: 'सेब', emoji: '🍎' },
      { word: 'Strawberry', hindiWord: 'स्ट्रॉबेरी', emoji: '🍓' },
      { word: 'Fire Truck', hindiWord: 'दमकल', emoji: '🚒' },
      { word: 'Rose', hindiWord: 'गुलाब', emoji: '🌹' },
    ],
    factEn: 'Red is vibrant and warm, the color of juicy ripe apples and sweet strawberries!',
    factHi: 'लाल रंग बहुत चमकीला होता है, जैसे मीठे लाल सेब और लाल गुलाब!',
  },
  {
    id: 'blue',
    name: 'Blue',
    hindiName: 'नीला',
    hindiPronounce: 'Neela',
    hex: '#3b82f6',
    borderHex: '#2563eb',
    textColor: 'text-white',
    examples: [
      { word: 'Sky', hindiWord: 'आसमान', emoji: '🌌' },
      { word: 'Ocean', hindiWord: 'समुद्र', emoji: '🌊' },
      { word: 'Blueberry', hindiWord: 'नीलबदरी', emoji: '🫐' },
      { word: 'Whale', hindiWord: 'व्हेल मछली', emoji: '🐋' },
    ],
    factEn: 'Blue is the calming color of the wide open sky and the deep blue ocean!',
    factHi: 'नीला रंग खुले आसमान और गहरे समंदर की लहरों का रंग है!',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hindiName: 'पीला',
    hindiPronounce: 'Peela',
    hex: '#eab308',
    borderHex: '#ca8a04',
    textColor: 'text-slate-900',
    examples: [
      { word: 'Sun', hindiWord: 'सूरज', emoji: '☀️' },
      { word: 'Banana', hindiWord: 'केला', emoji: '🍌' },
      { word: 'Sunflower', hindiWord: 'सूरजमुखी', emoji: '🌻' },
      { word: 'Lemon', hindiWord: 'नींबू', emoji: '🍋' },
    ],
    factEn: 'Yellow is bright and cheerful, just like the warm morning sun and yummy bananas!',
    factHi: 'पीला रंग सुबह की धूप, मीठे केले और खिलखिलाते सूरजमुखी का रंग है!',
  },
  {
    id: 'green',
    name: 'Green',
    hindiName: 'हरा',
    hindiPronounce: 'Hara',
    hex: '#22c55e',
    borderHex: '#16a34a',
    textColor: 'text-white',
    examples: [
      { word: 'Leaf', hindiWord: 'पत्ता', emoji: '🍃' },
      { word: 'Frog', hindiWord: 'मेंढक', emoji: '🐸' },
      { word: 'Tree', hindiWord: 'पेड़', emoji: '🌳' },
      { word: 'Watermelon', hindiWord: 'तरबूज', emoji: '🍉' },
    ],
    factEn: 'Green is nature’s favorite color, seen on grassy hills, tree leaves, and hopping frogs!',
    factHi: 'हरा रंग प्रकृति का रंग है, हरी-भरी घास, पेड़ों और नन्हे मेंढकों का!',
  },
  {
    id: 'orange',
    name: 'Orange',
    hindiName: 'नारंगी',
    hindiPronounce: 'Naarangi',
    hex: '#f97316',
    borderHex: '#ea580c',
    textColor: 'text-white',
    examples: [
      { word: 'Orange Fruit', hindiWord: 'संतरा', emoji: '🍊' },
      { word: 'Carrot', hindiWord: 'गाजर', emoji: '🥕' },
      { word: 'Tiger', hindiWord: 'बाघ', emoji: '🐯' },
      { word: 'Basketball', hindiWord: 'बास्केटबॉल', emoji: '🏀' },
    ],
    factEn: 'Orange is energetic! It is made by mixing red and yellow together.',
    factHi: 'नारंगी रंग लाल और पीला रंग मिलाने से बनता है, जैसे रसीला संतरा और गाजर!',
  },
  {
    id: 'purple',
    name: 'Purple',
    hindiName: 'बैंगनी',
    hindiPronounce: 'Baingani',
    hex: '#a855f7',
    borderHex: '#9333ea',
    textColor: 'text-white',
    examples: [
      { word: 'Grapes', hindiWord: 'अंगूर', emoji: '🍇' },
      { word: 'Eggplant', hindiWord: 'बैंगन', emoji: '🍆' },
      { word: 'Butterfly', hindiWord: 'तितली', emoji: '🦋' },
      { word: 'Crown', hindiWord: 'मुकुट', emoji: '👑' },
    ],
    factEn: 'Purple is royal and magical, made by mixing deep blue and bright red!',
    factHi: 'बैंगनी रंग नीले और लाल रंग के मेल से बनता है, जैसे मीठे रसीले अंगूर!',
  },
  {
    id: 'pink',
    name: 'Pink',
    hindiName: 'गुलाबी',
    hindiPronounce: 'Gulaabi',
    hex: '#ec4899',
    borderHex: '#db2777',
    textColor: 'text-white',
    examples: [
      { word: 'Flamingo', hindiWord: 'राजहंस', emoji: '🦩' },
      { word: 'Lotus', hindiWord: 'कमल का फूल', emoji: '🪷' },
      { word: 'Donut', hindiWord: 'डोनट', emoji: '🍩' },
      { word: 'Heart', hindiWord: 'गुलाबी दिल', emoji: '💖' },
    ],
    factEn: 'Pink is soft and sweet, made by mixing red with white!',
    factHi: 'गुलाबी रंग लाल में सफ़ेद मिलाकर बनता है, जैसे सुंदर कमल का फूल!',
  },
  {
    id: 'brown',
    name: 'Brown',
    hindiName: 'भूरा',
    hindiPronounce: 'Bhoora',
    hex: '#854d0e',
    borderHex: '#713f12',
    textColor: 'text-white',
    examples: [
      { word: 'Bear', hindiWord: 'भालू', emoji: '🐻' },
      { word: 'Chocolate', hindiWord: 'चॉकलेट', emoji: '🍫' },
      { word: 'Coconut', hindiWord: 'नारियल', emoji: '🥥' },
      { word: 'Monkey', hindiWord: 'बंदर', emoji: '🐵' },
    ],
    factEn: 'Brown is earthy, like chocolate bars, wooden trees, and friendly teddy bears!',
    factHi: 'भूरा रंग स्वादिष्ट चॉकलेट, नारियल और प्यारे भालू का रंग है!',
  },
  {
    id: 'black',
    name: 'Black',
    hindiName: 'काला',
    hindiPronounce: 'Kaala',
    hex: '#1e293b',
    borderHex: '#0f172a',
    textColor: 'text-white',
    examples: [
      { word: 'Night Sky', hindiWord: 'रात का आसमान', emoji: '🌑' },
      { word: 'Panda', hindiWord: 'पांडा', emoji: '🐼' },
      { word: 'Penguin', hindiWord: 'पेंगुइन', emoji: '🐧' },
      { word: 'Tyre', hindiWord: 'पहिया', emoji: '🛞' },
    ],
    factEn: 'Black is bold and dark, like the quiet night sky with shining stars!',
    factHi: 'काला रंग रात के अंधेरे आसमान, पेंगुइन और प्यारे पांडा का रंग है!',
  },
  {
    id: 'white',
    name: 'White',
    hindiName: 'सफ़ेद',
    hindiPronounce: 'Safed',
    hex: '#f8fafc',
    borderHex: '#cbd5e1',
    textColor: 'text-slate-800',
    examples: [
      { word: 'Snow', hindiWord: 'बर्फ़', emoji: '❄️' },
      { word: 'Cloud', hindiWord: 'बादल', emoji: '☁️' },
      { word: 'Milk', hindiWord: 'दूध', emoji: '🥛' },
      { word: 'Swan', hindiWord: 'हंस', emoji: '🦢' },
    ],
    factEn: 'White is bright and clean, like pure snowflakes, fluffy clouds, and milk!',
    factHi: 'सफ़ेद रंग ताज़ा दूध, तैरते हंस और ठंडी बर्फ़ का रंग है!',
  },
  {
    id: 'gray',
    name: 'Gray',
    hindiName: 'स्लेटी',
    hindiPronounce: 'Sleti',
    hex: '#64748b',
    borderHex: '#475569',
    textColor: 'text-white',
    examples: [
      { word: 'Elephant', hindiWord: 'हाथी', emoji: '🐘' },
      { word: 'Dolphin', hindiWord: 'डॉल्फ़िन', emoji: '🐬' },
      { word: 'Koala', hindiWord: 'कोआला', emoji: '🐨' },
      { word: 'Moon', hindiWord: 'चाँद', emoji: '🌕' },
    ],
    factEn: 'Gray is made by mixing black and white, seen on big gentle elephants and playful dolphins!',
    factHi: 'स्लेटी रंग काले और सफ़ेद को मिलाने से बनता है, जैसे समझदार विशाल हाथी!',
  },
  {
    id: 'cyan',
    name: 'Cyan (Sky Blue)',
    hindiName: 'आसमानी / फ़िरोज़ी',
    hindiPronounce: 'Aasmaani',
    hex: '#06b6d4',
    borderHex: '#0891b2',
    textColor: 'text-white',
    examples: [
      { word: 'Swimming Pool', hindiWord: 'स्विमिंग पूल', emoji: '🏊' },
      { word: 'Ice Cube', hindiWord: 'बर्फ़ का टुकड़ा', emoji: '🧊' },
      { word: 'Peacock Feather', hindiWord: 'मोर पंख', emoji: '🦚' },
      { word: 'Diamond', hindiWord: 'हीरा', emoji: '💎' },
    ],
    factEn: 'Cyan is cool like fresh spring water and sparkling ice crystals!',
    factHi: 'आसमानी रंग ताज़ा पानी, मोर के पंख और चमकदार हीरे का रंग है!',
  },
];

export const SHAPES_DATA: ShapeItem[] = [
  {
    id: 'circle',
    name: 'Circle',
    hindiName: 'वृत्त (गोल)',
    hindiPronounce: 'Vritt (Gol)',
    sides: 0,
    corners: 0,
    color: '#ef4444',
    examples: [
      { word: 'Coin', hindiWord: 'सिक्का', emoji: '🪙' },
      { word: 'Clock', hindiWord: 'दीवार घड़ी', emoji: '⏰' },
      { word: 'Pizza', hindiWord: 'पिज़्ज़ा', emoji: '🍕' },
      { word: 'Full Moon', hindiWord: 'पूरा चाँद', emoji: '🌕' },
    ],
    factEn: 'A circle is completely round with 0 straight edges and 0 corners!',
    factHi: 'वृत्त पूरी तरह गोल होता है, इसमें 0 सीधी भुजाएँ और 0 कोने होते हैं!',
  },
  {
    id: 'square',
    name: 'Square',
    hindiName: 'वर्ग (चौकोर)',
    hindiPronounce: 'Varg (Chaukor)',
    sides: 4,
    corners: 4,
    color: '#3b82f6',
    examples: [
      { word: 'Gift Box', hindiWord: 'उपहार का डिब्बा', emoji: '🎁' },
      { word: 'Dice', hindiWord: 'पासा', emoji: '🎲' },
      { word: 'Chess Board', hindiWord: 'शतरंज बोर्ड', emoji: '♟️' },
      { word: 'Window', hindiWord: 'खिड़की', emoji: '🪟' },
    ],
    factEn: 'A square has 4 equal straight sides and 4 square corners!',
    factHi: 'वर्ग की चारों भुजाएं बिल्कुल बराबर होती हैं और इसमें 4 कोने होते हैं!',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    hindiName: 'त्रिभुज (त्रिकोण)',
    hindiPronounce: 'Tribhuj (Trikon)',
    sides: 3,
    corners: 3,
    color: '#eab308',
    examples: [
      { word: 'Pizza Slice', hindiWord: 'पिज़्ज़ा का टुकड़ा', emoji: '🍕' },
      { word: 'Party Hat', hindiWord: 'जन्मदिन टोपी', emoji: '🥳' },
      { word: 'Mountain Peak', hindiWord: 'पहाड़ की चोटी', emoji: '⛰️' },
      { word: 'Watermelon Slice', hindiWord: 'तरबूज की फांक', emoji: '🍉' },
    ],
    factEn: 'A triangle has 3 straight sides and 3 pointy corners!',
    factHi: 'त्रिभुज में 3 भुजाएँ और 3 कोने होते हैं, जैसे पहाड़ की चोटी!',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    hindiName: 'आयत',
    hindiPronounce: 'Aayat',
    sides: 4,
    corners: 4,
    color: '#22c55e',
    examples: [
      { word: 'Door', hindiWord: 'दरवाज़ा', emoji: '🚪' },
      { word: 'Book', hindiWord: 'किताब', emoji: '📖' },
      { word: 'Smartphone', hindiWord: 'मोबाइल फ़ोन', emoji: '📱' },
      { word: 'Television', hindiWord: 'टेलीविज़न', emoji: '📺' },
    ],
    factEn: 'A rectangle has 4 sides and 4 corners: 2 long sides and 2 short sides!',
    factHi: 'आयत में आमने-सामने की दो भुजाएँ बराबर होती हैं और कुल 4 कोने होते हैं!',
  },
  {
    id: 'star',
    name: 'Star',
    hindiName: 'तारा (सितारा)',
    hindiPronounce: 'Taara (Sitaara)',
    sides: 10,
    corners: 5,
    color: '#f59e0b',
    examples: [
      { word: 'Night Star', hindiWord: 'आसमान का सितारा', emoji: '⭐' },
      { word: 'Starfish', hindiWord: 'तारा मछली', emoji: '🌟' },
      { word: 'Magic Wand', hindiWord: 'जादुई छड़ी', emoji: '🪄' },
      { word: 'Gold Badge', hindiWord: 'स्वर्ण पदक', emoji: '🏅' },
    ],
    factEn: 'A star has 5 shiny points that twinkle bright in the night sky!',
    factHi: 'तारे के 5 नुकीले कोने होते हैं जो रात को आसमान में टिमटिमाते हैं!',
  },
  {
    id: 'heart',
    name: 'Heart',
    hindiName: 'दिल (हृदय)',
    hindiPronounce: 'Dil (Hridaya)',
    sides: 0,
    corners: 1,
    color: '#ec4899',
    examples: [
      { word: 'Love Card', hindiWord: 'बधाई कार्ड', emoji: '💌' },
      { word: 'Balloon', hindiWord: 'दिल वाला गुब्बारा', emoji: '🎈' },
      { word: 'Chocolate Box', hindiWord: 'हार्ट चॉकलेट', emoji: '🍫' },
      { word: 'Teddy Hug', hindiWord: 'प्यारा टेडी', emoji: '🧸' },
    ],
    factEn: 'The heart shape represents love, friendship, and warm kindness!',
    factHi: 'दिल का आकार प्यार, दोस्ती और खुशियों का प्रतीक है!',
  },
  {
    id: 'diamond',
    name: 'Diamond (Rhombus)',
    hindiName: 'हीरा (पतंग / समचतुर्भुज)',
    hindiPronounce: 'Heera / Patang',
    sides: 4,
    corners: 4,
    color: '#06b6d4',
    examples: [
      { word: 'Kite', hindiWord: 'उड़ती पतंग', emoji: '🪁' },
      { word: 'Gemstone', hindiWord: 'रत्न / हीरा', emoji: '💎' },
      { word: 'Road Sign', hindiWord: 'सड़क संकेत', emoji: '🚸' },
      { word: 'Playing Card', hindiWord: 'ईंट का पत्ता', emoji: '♦️' },
    ],
    factEn: 'A diamond has 4 slanted equal sides, just like a colorful flying kite!',
    factHi: 'हीरा या पतंग का आकार 4 तिरछी भुजाओं और 4 कोनों से बनता है!',
  },
  {
    id: 'oval',
    name: 'Oval',
    hindiName: 'अंडाकार',
    hindiPronounce: 'Andaakaar',
    sides: 0,
    corners: 0,
    color: '#a855f7',
    examples: [
      { word: 'Egg', hindiWord: 'अंडा', emoji: '🥚' },
      { word: 'Mirror', hindiWord: 'दर्पण / आईना', emoji: '🪞' },
      { word: 'Rugby Ball', hindiWord: 'रग्बी गेंद', emoji: '🏉' },
      { word: 'Avocado', hindiWord: 'एवोकाडो', emoji: '🥑' },
    ],
    factEn: 'An oval is like a stretched circle, smooth and rounded like an egg!',
    factHi: 'अंडाकार एक खिंचे हुए वृत्त की तरह होता है, चिकना और बिना किसी कोने का!',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    hindiName: 'षट्कोण',
    hindiPronounce: 'Shatkon',
    sides: 6,
    corners: 6,
    color: '#10b981',
    examples: [
      { word: 'Beehive Cell', hindiWord: 'मधुमक्खी का छत्ता', emoji: '🐝' },
      { word: 'Nut / Bolt', hindiWord: 'नट-बोल्ट', emoji: '🔩' },
      { word: 'Snowflake', hindiWord: 'बर्फ़ का कण', emoji: '❄️' },
      { word: 'Turtle Shell', hindiWord: 'कछुए की पीठ', emoji: '🐢' },
    ],
    factEn: 'A hexagon has 6 straight sides and 6 corners, like cells in a honeybee hive!',
    factHi: 'षट्कोण में 6 बराबर भुजाएँ और 6 कोने होते हैं, जैसे मधुमक्खी का छत्ता!',
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    hindiName: 'पंचकोण',
    hindiPronounce: 'Panchkon',
    sides: 5,
    corners: 5,
    color: '#6366f1',
    examples: [
      { word: 'Birdhouse Roof', hindiWord: 'चिड़िया का घर', emoji: '🏠' },
      { word: 'Soccer Ball Patch', hindiWord: 'फ़ुटबॉल का पैच', emoji: '⚽' },
      { word: 'Okra Slice', hindiWord: 'भिंडी की फांक', emoji: '🥬' },
      { word: 'School Crossing Sign', hindiWord: 'स्कूल संकेत', emoji: '🚸' },
    ],
    factEn: 'A pentagon has 5 straight sides and 5 corners, like a cozy little house!',
    factHi: 'पंचकोण में 5 सीधी भुजाएँ और 5 कोने होते हैं, जैसे छोटे घर की आकृति!',
  },
  {
    id: 'crescent',
    name: 'Crescent',
    hindiName: 'अर्धचंद्र (चांद)',
    hindiPronounce: 'Ardhachandra (Chaand)',
    sides: 0,
    corners: 2,
    color: '#f43f5e',
    examples: [
      { word: 'Crescent Moon', hindiWord: 'दूज का चाँद', emoji: '🌙' },
      { word: 'Croissant', hindiWord: 'क्रॉसों ब्रेड', emoji: '🥐' },
      { word: 'Smile', hindiWord: 'मुस्कान', emoji: '😊' },
      { word: 'Banana Curve', hindiWord: 'केले का घुमाव', emoji: '🍌' },
    ],
    factEn: 'A crescent curves gracefully like a smiling silver moon in the night sky!',
    factHi: 'अर्धचंद्र रात के आसमान में चमकते हुए प्यारे दूज के चाँद जैसा दिखता है!',
  },
];

export const COLOR_MIX_RECIPES: ColorMixRule[] = [
  {
    color1: 'red',
    color2: 'yellow',
    resultId: 'orange',
    resultName: 'Orange',
    resultHindi: 'नारंगी',
    resultHex: '#f97316',
    formula: 'Red + Yellow = Orange',
  },
  {
    color1: 'blue',
    color2: 'yellow',
    resultId: 'green',
    resultName: 'Green',
    resultHindi: 'हरा',
    resultHex: '#22c55e',
    formula: 'Blue + Yellow = Green',
  },
  {
    color1: 'red',
    color2: 'blue',
    resultId: 'purple',
    resultName: 'Purple',
    resultHindi: 'बैंगनी',
    resultHex: '#a855f7',
    formula: 'Red + Blue = Purple',
  },
  {
    color1: 'red',
    color2: 'white',
    resultId: 'pink',
    resultName: 'Pink',
    resultHindi: 'गुलाबी',
    resultHex: '#ec4899',
    formula: 'Red + White = Pink',
  },
  {
    color1: 'black',
    color2: 'white',
    resultId: 'gray',
    resultName: 'Gray',
    resultHindi: 'स्लेटी',
    resultHex: '#64748b',
    formula: 'Black + White = Gray',
  },
  {
    color1: 'blue',
    color2: 'white',
    resultId: 'cyan',
    resultName: 'Cyan (Sky Blue)',
    resultHindi: 'आसमानी',
    resultHex: '#06b6d4',
    formula: 'Blue + White = Sky Blue',
  },
  {
    color1: 'red',
    color2: 'green',
    resultId: 'brown',
    resultName: 'Brown',
    resultHindi: 'भूरा',
    resultHex: '#854d0e',
    formula: 'Red + Green = Brown',
  },
];
