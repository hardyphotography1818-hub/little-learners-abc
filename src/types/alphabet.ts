export interface PhonicsWord {
  word: string;
  hindiWord: string;
  emoji: string;
  category: string;
  hindiCategory: string;
  sentence: string;
  hindiSentence: string;
  funFact: string;
  syllables: string;
}

export interface AlphabetItem {
  id: string;
  letter: string;
  phonicsSound: string;
  phonicsSpelling: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    lightBg: string;
    badge: string;
  };
  word1: PhonicsWord;
  word2: PhonicsWord;
  tracingTips: {
    upper: string;
    lower: string;
  };
}
