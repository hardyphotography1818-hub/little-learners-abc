import React, { useState, useEffect } from 'react';
import { AlphabetItem, PhonicsWord } from '../types/alphabet';
import { Sparkles, Volume2, RotateCcw, Lightbulb, Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect, speakText } from '../utils/audio';

interface SpellingGameProps {
  alphabet: AlphabetItem[];
  soundEnabled: boolean;
}

interface GameWord {
  letter: string;
  word: string;
  cleanLetters: string[]; // only A-Z
  emoji: string;
  category: string;
  sentence: string;
}

export const SpellingGame: React.FC<SpellingGameProps> = ({
  alphabet,
  soundEnabled,
}) => {
  // Collect all 52 words
  const allWords: GameWord[] = [];
  alphabet.forEach(item => {
    [item.word1, item.word2].forEach(w => {
      const clean = w.word.toUpperCase().replace(/[^A-Z]/g, '').split('');
      allWords.push({
        letter: item.letter,
        word: w.word,
        cleanLetters: clean,
        emoji: w.emoji,
        category: w.category,
        sentence: w.sentence,
      });
    });
  });

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ id: string; char: string }[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const current = allWords[currentWordIndex % allWords.length];

  // Setup current word
  useEffect(() => {
    setupWord(current);
  }, [currentWordIndex]);

  const setupWord = (gameWord: GameWord) => {
    const letters = [...gameWord.cleanLetters];
    // Add 1 or 2 extra random distractor letters if word is short (< 5 letters)
    if (letters.length <= 4) {
      const alphabetChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const extra1 = alphabetChars[Math.floor(Math.random() * alphabetChars.length)];
      letters.push(extra1);
    }

    // Shuffle
    const shuffled = letters
      .map((char, index) => ({ char, sort: Math.random(), id: `${char}-${index}-${Date.now()}` }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => ({ id: item.id, char: item.char, used: false }));

    setAvailableTiles(shuffled);
    setSelectedLetters([]);
    setIsCompleted(false);

    if (soundEnabled) {
      speakText(`Spell the word: ${gameWord.word}!`);
    }
  };

  const handleTileClick = (tile: { id: string; char: string; used: boolean }) => {
    if (tile.used || isCompleted) return;

    // Speak the letter immediately when tapped!
    if (soundEnabled) {
      playSoundEffect('pop');
      speakText(`${tile.char}!`, { rate: 1.0, pitch: 1.22, lang: 'en' });
    }

    // Mark tile as used
    const updatedTiles = availableTiles.map(t => (t.id === tile.id ? { ...t, used: true } : t));
    setAvailableTiles(updatedTiles);

    // Add to selected letters
    const nextSelected = [...selectedLetters, { id: tile.id, char: tile.char }];
    setSelectedLetters(nextSelected);

    // Check if word is complete
    const currentWordString = nextSelected.map(s => s.char).join('');
    const targetString = current.cleanLetters.join('');

    if (nextSelected.length === current.cleanLetters.length) {
      if (currentWordString === targetString) {
        // Success!
        setIsCompleted(true);
        setScore(prev => prev + 1);
        if (soundEnabled) {
          // Wait briefly for the last tapped letter speech to finish
          setTimeout(() => {
            playSoundEffect('success');
            const spelledOut = current.cleanLetters.join(' - ');
            speakText(`${spelledOut}! That spells ${current.word}! Super job!`, {
              rate: 0.88,
              pitch: 1.18,
              lang: 'en',
            });
          }, 500);
        }
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        // Wrong spelling
        setTimeout(() => {
          if (soundEnabled) {
            playSoundEffect('wrong');
            speakText(`Oops, not quite! Try again!`, { lang: 'en' });
          }
        }, 450);
      }
    }
  };

  const handleRemoveLetter = (indexToRemove: number) => {
    if (isCompleted) return;

    if (soundEnabled) playSoundEffect('soft-click');
    const removed = selectedLetters[indexToRemove];
    const newSelected = selectedLetters.filter((_, idx) => idx !== indexToRemove);
    setSelectedLetters(newSelected);

    // Make tile available again
    setAvailableTiles(prev =>
      prev.map(t => (t.id === removed.id ? { ...t, used: false } : t))
    );
  };

  const handleHint = () => {
    if (isCompleted) return;
    const nextExpectedIndex = selectedLetters.length;
    if (nextExpectedIndex >= current.cleanLetters.length) return;

    const expectedChar = current.cleanLetters[nextExpectedIndex];
    if (soundEnabled) {
      playSoundEffect('soft-click');
      speakText(`The next letter is ${expectedChar}!`);
    }

    // Find first unused tile with expectedChar
    const tileIndex = availableTiles.findIndex(t => !t.used && t.char === expectedChar);
    if (tileIndex !== -1) {
      handleTileClick(availableTiles[tileIndex]);
    }
  };

  const handleNextWord = () => {
    if (soundEnabled) playSoundEffect('pop');
    setCurrentWordIndex(prev => (prev + 1) % allWords.length);
  };

  const handleHearWord = () => {
    if (soundEnabled) {
      playSoundEffect('soft-click');
      speakText(`${current.letter} for ${current.word}!`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top scoreboard strip */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stars Earned
            </div>
            <div className="font-display font-black text-xl text-slate-900">
              {score} ⭐
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Word
          </div>
          <div className="font-display font-bold text-slate-900 text-sm">
            {(currentWordIndex % allWords.length) + 1} of {allWords.length}
          </div>
        </div>
      </div>

      {/* Main Game Stage Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center">
        {/* Big Clue: Emoji */}
        <div
          onClick={handleHearWord}
          className="text-7xl sm:text-8xl select-none mb-3 cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
          title="Click to hear word"
        >
          {current.emoji}
        </div>

        {/* Word Clue Banner */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleHearWord}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Listen"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {current.category} · Starts with Letter {current.letter}
          </span>
        </div>

        {/* Selected Letter Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 my-6 min-h-[64px]">
          {current.cleanLetters.map((_, idx) => {
            const letterObj = selectedLetters[idx];
            return (
              <button
                key={idx}
                onClick={() => letterObj && handleRemoveLetter(idx)}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 font-display font-black text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer ${
                  letterObj
                    ? isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-white text-slate-900 border-rose-400 shadow-xs hover:border-red-400'
                    : 'bg-slate-50 border-dashed border-slate-300 text-transparent'
                }`}
              >
                {letterObj ? letterObj.char : ''}
              </button>
            );
          })}
        </div>

        {/* Error notification if slots full but incorrect */}
        {selectedLetters.length === current.cleanLetters.length && !isCompleted && (
          <div className="text-xs font-bold text-rose-600 mb-4 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            Oops! Not quite right. Tap a letter above to remove it or try Hint!
          </div>
        )}

        {/* Success Banner */}
        {isCompleted && (
          <div className="w-full bg-emerald-50 rounded-2xl p-4 border border-emerald-200 my-4 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-800 text-left">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-display font-bold text-base">You Spelled {current.word}!</div>
                <div className="text-xs text-emerald-700">{current.sentence}</div>
              </div>
            </div>

            <button
              onClick={handleNextWord}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrambled Available Letter Tiles */}
        <div className="w-full mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Tap Letters To Spell
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={tile.used || isCompleted}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-display font-black text-xl sm:text-2xl transition-all cursor-pointer ${
                  tile.used
                    ? 'opacity-20 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed scale-90'
                    : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-rose-400 hover:shadow-md active:scale-95 shadow-xs'
                }`}
              >
                {tile.char}
              </button>
            ))}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between w-full mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={() => setupWord(current)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleHint}
            disabled={isCompleted}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Give Me A Hint</span>
          </button>

          <button
            onClick={handleNextWord}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <span>Skip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
