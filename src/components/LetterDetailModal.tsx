import React, { useState } from 'react';
import { AlphabetItem } from '../types/alphabet';
import { X, Volume2, Sparkles, ChevronLeft, ChevronRight, Edit3, Lightbulb } from 'lucide-react';
import { playSoundEffect, speakText } from '../utils/audio';

interface LetterDetailModalProps {
  item: AlphabetItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenTracing: (item: AlphabetItem) => void;
  soundEnabled: boolean;
  language?: 'en' | 'hi';
}

export const LetterDetailModal: React.FC<LetterDetailModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  onOpenTracing,
  soundEnabled,
  language = 'en',
}) => {
  const [selectedWordIdx, setSelectedWordIdx] = useState<0 | 1>(0);

  if (!item) return null;

  const currentWord = selectedWordIdx === 0 ? item.word1 : item.word2;

  const handleSpeakWord = () => {
    if (soundEnabled) {
      playSoundEffect('pop');
      if (language === 'hi') {
        speakText(`${item.letter}! ${item.letter} फॉर ${currentWord.word}, यानी ${currentWord.hindiWord}! ${currentWord.hindiSentence}`, { lang: 'hi' });
      } else {
        speakText(`${item.letter}! ${item.letter} is for ${currentWord.word}! ${currentWord.sentence}`, { lang: 'en' });
      }
    }
  };

  const handleSpellWord = () => {
    if (soundEnabled) {
      playSoundEffect('chime');
      const letters = currentWord.word.toUpperCase().split('').filter(c => c !== ' ' && c !== '-');
      speakText(`${currentWord.word}. Let's spell it: ${letters.join('... ')}. ${currentWord.word}!`, { lang: 'en' });
    }
  };

  const handleSpeakSentence = () => {
    if (soundEnabled) {
      playSoundEffect('soft-click');
      if (language === 'hi') {
        speakText(currentWord.hindiSentence, { lang: 'hi' });
      } else {
        speakText(currentWord.sentence, { lang: 'en' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white font-display font-black text-2xl flex items-center justify-center shadow-xs">
              {item.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-slate-900">
                  {language === 'hi' ? `अक्षर ${item.letter}` : `Letter ${item.letter}`}
                </span>
                <span className="text-slate-400 font-medium">({item.letter.toLowerCase()})</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Sound: <span className="font-bold text-slate-700">{item.phonicsSound}</span> · {item.phonicsSpelling}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Previous letter"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Next letter"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dual Word Switcher Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                setSelectedWordIdx(0);
                if (soundEnabled) {
                  const text = language === 'hi' ? `${item.letter} फॉर ${item.word1.word}, यानी ${item.word1.hindiWord}` : `${item.letter} for ${item.word1.word}!`;
                  speakText(text, { lang: language === 'hi' ? 'hi' : 'en' });
                }
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedWordIdx === 0
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.word1.emoji}</span>
              <span>1. {item.word1.word} ({item.word1.hindiWord})</span>
            </button>

            <button
              onClick={() => {
                setSelectedWordIdx(1);
                if (soundEnabled) {
                  const text = language === 'hi' ? `${item.letter} फॉर ${item.word2.word}, यानी ${item.word2.hindiWord}` : `${item.letter} for ${item.word2.word}!`;
                  speakText(text, { lang: language === 'hi' ? 'hi' : 'en' });
                }
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedWordIdx === 1
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.word2.emoji}</span>
              <span>2. {item.word2.word} ({item.word2.hindiWord})</span>
            </button>
          </div>

          {/* Highlight Card */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-200 text-center flex flex-col items-center">
            <div
              className="text-7xl sm:text-8xl select-none mb-3 drop-shadow-xs transform hover:scale-110 transition-transform cursor-pointer"
              onClick={handleSpeakWord}
            >
              {currentWord.emoji}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {currentWord.word}
              </h2>
              <div className="font-display font-black text-2xl text-rose-600 mt-1">
                {currentWord.hindiWord}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-2">
              <span>{language === 'hi' ? currentWord.hindiCategory : currentWord.category}</span>
              <span aria-hidden="true">·</span>
              <span>Syllables: <strong className="text-slate-700">{currentWord.syllables}</strong></span>
            </div>

            {/* Quick Actions for Word */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button
                onClick={handleSpeakWord}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{language === 'hi' ? `आवाज़ सुनें: ${currentWord.hindiWord}` : `Hear "${item.letter} for ${currentWord.word}"`}</span>
              </button>

              <button
                onClick={handleSpellWord}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'स्पेलिंग बोलें' : 'Spell It Out'}</span>
              </button>

              <button
                onClick={() => onOpenTracing(item)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-bold rounded-xl border border-blue-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>{language === 'hi' ? 'लिखने की प्रैक्टिस' : 'Practice Tracing'}</span>
              </button>
            </div>
          </div>

          {/* Example Sentence Section */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
            <button
              onClick={handleSpeakSentence}
              className="mt-0.5 p-2 bg-white rounded-xl shadow-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
              title="Listen to sentence"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'उदाहरण वाक्य (Sentence)' : 'Example Phonics Sentence'}
              </div>
              <p className="text-slate-900 font-semibold text-base sm:text-lg">
                "{currentWord.hindiSentence}"
              </p>
              <p className="text-slate-600 text-sm italic">
                "{currentWord.sentence}"
              </p>
            </div>
          </div>

          {/* Fun Fact Section */}
          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-white rounded-xl shadow-xs text-amber-600 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                {language === 'hi' ? 'रोचक तथ्य (Did You Know?)' : 'Did You Know?'}
              </div>
              <p className="text-amber-950 font-medium text-sm">
                {currentWord.funFact}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {item.letter}: <strong>{item.word1.word} ({item.word1.hindiWord})</strong> & <strong>{item.word2.word} ({item.word2.hindiWord})</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
