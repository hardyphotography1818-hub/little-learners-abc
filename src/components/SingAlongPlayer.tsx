import React, { useState, useEffect, useRef } from 'react';
import { AlphabetItem } from '../types/alphabet';
import { Play, Pause, SkipForward, SkipBack, X, Music, Volume2, Sparkles } from 'lucide-react';
import { playSoundEffect, speakText, stopSpeech } from '../utils/audio';

interface SingAlongPlayerProps {
  alphabet: AlphabetItem[];
  onClose: () => void;
  soundEnabled: boolean;
  language?: 'en' | 'hi';
}

export const SingAlongPlayer: React.FC<SingAlongPlayerProps> = ({
  alphabet,
  onClose,
  soundEnabled,
  language = 'en',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWordSubIndex, setCurrentWordSubIndex] = useState<0 | 1>(0); // 0 = word1, 1 = word2
  const [speed, setSpeed] = useState<'normal' | 'slow'>('normal');

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentItem = alphabet[currentIndex];
  const currentWord = currentWordSubIndex === 0 ? currentItem.word1 : currentItem.word2;

  useEffect(() => {
    if (!isPlaying) {
      stopSpeech();
      return;
    }

    // Play chime & speak: e.g. "A is for Apple!" in clean cheerful female voice
    if (soundEnabled) {
      playSoundEffect('chime');
      const textToSpeak =
        language === 'hi'
          ? `${currentItem.letter}! ${currentItem.letter} फॉर ${currentWord.word}, यानी ${currentWord.hindiWord}!`
          : `${currentItem.letter}! ${currentItem.letter} is for ${currentWord.word}!`;

      speakText(textToSpeak, {
        rate: speed === 'slow' ? 0.82 : 0.88,
        pitch: 1.2,
        lang: language,
        onEnd: () => {
          if (!isPlayingRef.current) return;

          // Transition to next word or next letter
          setTimeout(() => {
            if (!isPlayingRef.current) return;
            if (currentWordSubIndex === 0) {
              setCurrentWordSubIndex(1);
            } else {
              setCurrentWordSubIndex(0);
              setCurrentIndex(prev => (prev + 1) % alphabet.length);
            }
          }, 350);
        },
      });
    }

    return () => {
      stopSpeech();
    };
  }, [currentIndex, currentWordSubIndex, isPlaying, speed, language]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    stopSpeech();
    setCurrentWordSubIndex(0);
    setCurrentIndex(prev => (prev + 1) % alphabet.length);
  };

  const handlePrev = () => {
    stopSpeech();
    setCurrentWordSubIndex(0);
    setCurrentIndex(prev => (prev - 1 + alphabet.length) % alphabet.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="font-display font-bold text-slate-900 text-base">
              A to Z Sing-Along & Phonics Rhythm
            </span>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Spotlight Visual Card */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display font-black text-6xl sm:text-7xl text-rose-600 drop-shadow-xs">
              {currentItem.letter}
            </span>
            <span className="font-display font-bold text-4xl sm:text-5xl text-slate-300">
              {currentItem.letter.toLowerCase()}
            </span>
          </div>

          <div className="text-8xl sm:text-9xl my-4 select-none transform hover:scale-110 transition-transform duration-300 drop-shadow-md">
            {currentWord.emoji}
          </div>

          <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 mb-1">
            {currentItem.letter} for {currentWord.word}!
          </div>

          <div className="text-sm font-semibold text-slate-500">
            {currentWord.category} <span className="text-slate-300">·</span> {currentWord.sentence}
          </div>

          {/* Letter progress dots */}
          <div className="w-full flex items-center justify-center gap-1 overflow-x-auto no-scrollbar py-4 mt-4">
            {alphabet.map((item, idx) => (
              <button
                key={item.letter}
                onClick={() => {
                  stopSpeech();
                  setCurrentWordSubIndex(0);
                  setCurrentIndex(idx);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-display font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-rose-500 text-white shadow-xs scale-110'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSpeed(speed === 'normal' ? 'slow' : 'normal')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Speed: {speed === 'normal' ? 'Normal' : 'Slow & Gentle'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Previous letter"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="p-3.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md transition-all active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Next letter"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            {currentIndex + 1} of 26
          </div>
        </div>
      </div>
    </div>
  );
};
