import React, { useState } from 'react';
import { AlphabetItem } from '../types/alphabet';
import { Volume2, Sparkles, Edit3 } from 'lucide-react';
import { playSoundEffect, speakText } from '../utils/audio';

interface LetterCardProps {
  item: AlphabetItem;
  soundEnabled: boolean;
  language?: 'en' | 'hi';
  onOpenTracing: (item: AlphabetItem) => void;
  onInspect: (item: AlphabetItem) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  item,
  soundEnabled,
  language = 'en',
  onOpenTracing,
  onInspect,
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState<0 | 1>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentWord = activeWordIndex === 0 ? item.word1 : item.word2;

  const handleSpeakLetterAndWord = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (soundEnabled) {
      playSoundEffect('pop');
      setIsSpeaking(true);
      const textToSpeak =
        language === 'hi'
          ? `${item.letter}! ${item.letter} फॉर ${currentWord.word}, यानी ${currentWord.hindiWord}!`
          : `${item.letter}! ${item.letter} for ${currentWord.word}!`;

      speakText(textToSpeak, {
        lang: language === 'hi' ? 'hi' : 'en',
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const handleSpellWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) {
      playSoundEffect('chime');
      const letters = currentWord.word.split('').filter(c => c !== ' ' && c !== '-').join(', ');
      speakText(`${currentWord.word}. Let's spell it: ${letters}. ${currentWord.word}!`, { lang: 'en' });
    }
  };

  return (
    <div
      onClick={() => onInspect(item)}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between p-4 cursor-pointer hover:border-slate-300"
    >
      {/* Top row: Letter & Phonics tag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 group-hover:scale-105 transition-transform inline-block">
            {item.letter}
          </span>
          <span className="font-display font-bold text-xl sm:text-2xl text-slate-400">
            {item.letter.toLowerCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-700">{item.phonicsSound}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="truncate max-w-[85px]">{item.phonicsSpelling}</span>
        </div>
      </div>

      {/* Center Spotlight: Emoji visual & Word Title with Hindi */}
      <div className="flex flex-col items-center justify-center my-1 py-3 bg-slate-50/70 rounded-xl group-hover:bg-slate-50 transition-colors">
        <div className="text-5xl sm:text-6xl mb-1 select-none transform group-hover:scale-110 transition-transform duration-200 drop-shadow-xs">
          {currentWord.emoji}
        </div>
        <div className="text-center">
          <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-tight">
            {currentWord.word}
          </h3>
          {language === 'hi' && (
            <div className="font-bold text-sm text-rose-600 mt-0.5">
              {currentWord.hindiWord}
            </div>
          )}
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {language === 'hi' ? currentWord.hindiCategory : currentWord.category} <span className="text-slate-300">·</span> {currentWord.syllables}
          </p>
        </div>
      </div>

      {/* Dual Word Switcher bar */}
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-xl my-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveWordIndex(0);
            if (soundEnabled) {
              const text = language === 'hi' ? `${item.letter} फॉर ${item.word1.word}, यानी ${item.word1.hindiWord}` : `${item.letter} for ${item.word1.word}!`;
              speakText(text, { lang: language === 'hi' ? 'hi' : 'en' });
            }
          }}
          className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${
            activeWordIndex === 0
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{item.word1.emoji}</span>
          <span className="truncate">
            {item.word1.word} {language === 'hi' ? `(${item.word1.hindiWord})` : ''}
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveWordIndex(1);
            if (soundEnabled) {
              const text = language === 'hi' ? `${item.letter} फॉर ${item.word2.word}, यानी ${item.word2.hindiWord}` : `${item.letter} for ${item.word2.word}!`;
              speakText(text, { lang: language === 'hi' ? 'hi' : 'en' });
            }
          }}
          className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${
            activeWordIndex === 1
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{item.word2.emoji}</span>
          <span className="truncate">
            {item.word2.word} {language === 'hi' ? `(${item.word2.hindiWord})` : ''}
          </span>
        </button>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 mt-1">
        <button
          onClick={handleSpeakLetterAndWord}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isSpeaking ? 'bg-rose-100 text-rose-700' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title={`Say "${item.letter} for ${currentWord.word}"`}
        >
          <Volume2 className="w-4 h-4 text-rose-600" />
          <span>{language === 'hi' ? 'बोलिए' : 'Say'}</span>
        </button>

        <button
          onClick={handleSpellWord}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title={`Spell ${currentWord.word}`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'स्पेलिंग' : 'Spell'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTracing(item);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title={`Trace letter ${item.letter}`}
        >
          <Edit3 className="w-4 h-4 text-blue-500" />
          <span>{language === 'hi' ? 'लिखें' : 'Trace'}</span>
        </button>
      </div>
    </div>
  );
};
