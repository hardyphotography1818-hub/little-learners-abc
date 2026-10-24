import React, { useState, useEffect, useRef } from 'react';
import { COUNTING_1_TO_100, CountingNumber } from '../data/countingData';
import { Volume2, Play, Pause, Trophy, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect, speakText, stopSpeech } from '../utils/audio';

interface CountingViewProps {
  language: 'en' | 'hi';
  soundEnabled: boolean;
}

const RANGES = [
  { id: '1-10', label: '1 - 10', min: 1, max: 10 },
  { id: '11-20', label: '11 - 20', min: 11, max: 20 },
  { id: '21-30', label: '21 - 30', min: 21, max: 30 },
  { id: '31-40', label: '31 - 40', min: 31, max: 40 },
  { id: '41-50', label: '41 - 50', min: 41, max: 50 },
  { id: '51-60', label: '51 - 60', min: 51, max: 60 },
  { id: '61-70', label: '61 - 70', min: 61, max: 70 },
  { id: '71-80', label: '71 - 80', min: 71, max: 80 },
  { id: '81-90', label: '81 - 90', min: 81, max: 90 },
  { id: '91-100', label: '91 - 100', min: 91, max: 100 },
  { id: 'all', label: 'All 1 - 100', min: 1, max: 100 },
];

export const CountingView: React.FC<CountingViewProps> = ({
  language,
  soundEnabled,
}) => {
  const [selectedRange, setSelectedRange] = useState('1-10');
  const [selectedNumber, setSelectedNumber] = useState<CountingNumber>(COUNTING_1_TO_100[0]);
  const [isChanting, setIsChanting] = useState(false);
  const [chantIndex, setChantIndex] = useState(0);

  // Mini quiz state
  const [quizTarget, setQuizTarget] = useState<CountingNumber | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const isChantingRef = useRef(isChanting);
  isChantingRef.current = isChanting;

  const currentRangeObj = RANGES.find(r => r.id === selectedRange) || RANGES[0];
  const displayedNumbers = COUNTING_1_TO_100.filter(
    n => n.num >= currentRangeObj.min && n.num <= currentRangeObj.max
  );

  const speakNumber = (n: CountingNumber) => {
    if (!soundEnabled) return;
    playSoundEffect('pop');
    if (language === 'hi') {
      // In Hindi mode: speak only the Hindi word once cleanly
      speakText(`${n.hindiWord}!`, { lang: 'hi' });
    } else {
      // In English mode: speak ONLY the English word once cleanly (e.g. "One", "Two", "Three")
      speakText(`${n.englishWord}!`, { lang: 'en' });
    }
  };

  // Autoplay Counting Chant
  useEffect(() => {
    if (!isChanting) {
      stopSpeech();
      return;
    }

    if (chantIndex >= displayedNumbers.length) {
      setIsChanting(false);
      setChantIndex(0);
      return;
    }

    const currentItem = displayedNumbers[chantIndex];
    setSelectedNumber(currentItem);

    if (soundEnabled) {
      playSoundEffect('soft-click');
      // Speak only the target language word once
      const text = language === 'hi' ? currentItem.hindiWord : currentItem.englishWord;
      speakText(text, {
        lang: language === 'hi' ? 'hi' : 'en',
        rate: 0.88,
        pitch: 1.18,
        onEnd: () => {
          if (!isChantingRef.current) return;
          setTimeout(() => {
            if (!isChantingRef.current) return;
            setChantIndex(prev => prev + 1);
          }, 350);
        },
      });
    }

    return () => {
      stopSpeech();
    };
  }, [isChanting, chantIndex, selectedRange, language]);

  const handleStartChant = () => {
    if (isChanting) {
      setIsChanting(false);
      stopSpeech();
    } else {
      setChantIndex(0);
      setIsChanting(true);
    }
  };

  // Start a number quiz
  const startNewQuiz = () => {
    const random = displayedNumbers[Math.floor(Math.random() * displayedNumbers.length)];
    setQuizTarget(random);
    setQuizFeedback(null);
    if (soundEnabled) {
      if (language === 'hi') {
        speakText(`संख्या पहचानिए: ${random.hindiWord}!`, { lang: 'hi' });
      } else {
        speakText(`Find number: ${random.englishWord}!`, { lang: 'en' });
      }
    }
  };

  const handleQuizPick = (n: CountingNumber) => {
    if (!quizTarget) return;

    if (n.num === quizTarget.num) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback(language === 'hi' ? `सही जवाब! ${n.hindiWord}!` : `Correct! ${n.englishWord}!`);
      if (soundEnabled) {
        playSoundEffect('success');
        if (language === 'hi') {
          speakText(`बहुत बढ़िया! ${n.hindiWord}!`, { lang: 'hi' });
        } else {
          speakText(`Great job! ${n.englishWord}!`, { lang: 'en' });
        }
      }
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        startNewQuiz();
      }, 1500);
    } else {
      setQuizFeedback(language === 'hi' ? `फिर से कोशिश करें! यह ${n.hindiWord} है।` : `Try again! That was ${n.englishWord}.`);
      if (soundEnabled) playSoundEffect('wrong');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header for Counting */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
            <Hash className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'गिनती सीखें १ से १००' : 'Learn Numbers 1 to 100'}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            {language === 'hi' ? 'गिनती (1 से 100)' : 'Counting Numbers (1 to 100)'}
          </h1>
          <p className="text-white/85 text-sm sm:text-base mt-2 max-w-xl">
            {language === 'hi'
              ? 'किसी भी संख्या पर टैप करें और साफ़ आवाज़ में गिनती सुनें!'
              : 'Tap any number to hear the clear female pronunciation! Play number chants or test yourself with quizzes.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleStartChant}
            className={`px-5 py-3 rounded-2xl font-display font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isChanting
                ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                : 'bg-white text-blue-700 hover:bg-blue-50'
            }`}
          >
            {isChanting ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            <span>
              {isChanting
                ? language === 'hi' ? 'गिनती रोकें' : 'Pause Chant'
                : language === 'hi' ? 'गिनती बोलकर सुनाओ 🎵' : 'Play Number Chant 🎵'}
            </span>
          </button>

          <button
            onClick={() => {
              if (quizTarget) {
                setQuizTarget(null);
              } else {
                startNewQuiz();
              }
            }}
            className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-display font-bold text-sm backdrop-blur-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{quizTarget ? (language === 'hi' ? 'क्विज़ बंद करें' : 'Exit Quiz') : (language === 'hi' ? 'संख्या गेम खेलें ⭐' : 'Play Number Quiz')}</span>
          </button>
        </div>
      </div>

      {/* Range Selection Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {RANGES.map(range => (
            <button
              key={range.id}
              onClick={() => {
                setSelectedRange(range.id);
                setIsChanting(false);
                setChantIndex(0);
                if (soundEnabled) playSoundEffect('soft-click');
              }}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                selectedRange === range.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Banner if active */}
      {quizTarget && (
        <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-xs">
              ?
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {language === 'hi' ? 'संख्या पहचानो' : 'Find the Number Challenge'}
              </div>
              <div className="text-lg sm:text-xl font-display font-black text-amber-950">
                {language === 'hi'
                  ? `ढूंढिए: "${quizTarget.hindiWord}"`
                  : `Find: "${quizTarget.englishWord}"`}
              </div>
              {quizFeedback && (
                <div className="text-xs font-bold text-amber-700 mt-1">
                  {quizFeedback}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-base text-amber-900">
              Score: {quizScore} ⭐
            </span>
            <button
              onClick={() => {
                if (soundEnabled) {
                  if (language === 'hi') {
                    speakText(quizTarget.hindiWord, { lang: 'hi' });
                  } else {
                    speakText(quizTarget.englishWord, { lang: 'en' });
                  }
                }
              }}
              className="p-2.5 bg-amber-200 hover:bg-amber-300 rounded-xl text-amber-900 transition-colors cursor-pointer"
              title="Repeat"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Numbers Grid (Large, 3-4 per row for comfortable kid interaction) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayedNumbers.map((n) => {
          const isSelected = selectedNumber.num === n.num;
          return (
            <div
              key={n.num}
              onClick={() => {
                setSelectedNumber(n);
                if (quizTarget) {
                  handleQuizPick(n);
                } else {
                  speakNumber(n);
                }
              }}
              className={`p-5 sm:p-6 rounded-3xl border-2 sm:border-3 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none min-h-[140px] sm:min-h-[170px] ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-500 shadow-lg scale-103 ring-4 ring-blue-100'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:scale-101'
              }`}
            >
              {/* Top row: Arabic number & Devanagari in Hindi mode */}
              <div className="flex items-center justify-between w-full">
                <span className="font-display font-black text-3xl sm:text-4xl text-slate-900">
                  {n.num}
                </span>
                {language === 'hi' ? (
                  <span className="font-bold text-xl text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                    {n.devanagari}
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                    #{n.num}
                  </span>
                )}
              </div>

              {/* Center names in large font */}
              <div className="my-3 w-full">
                <div className="font-display font-black text-lg sm:text-xl text-slate-800">
                  {language === 'hi' ? n.hindiWord : n.englishWord}
                </div>
                {language === 'hi' && (
                  <div className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                    {n.hindiPronounce}
                  </div>
                )}
              </div>

              {/* Audio prompt button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNumber(n);
                  speakNumber(n);
                }}
                className="w-full py-2 bg-slate-50 hover:bg-blue-100/70 text-slate-600 hover:text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title={`Listen: ${language === 'hi' ? n.hindiWord : n.englishWord}`}
              >
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span>{language === 'hi' ? 'बोलें' : 'Listen'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Number Large Preview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-display font-black text-5xl sm:text-6xl flex items-center justify-center shadow-md">
            {selectedNumber.num}
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
                {language === 'hi' ? selectedNumber.hindiWord : selectedNumber.englishWord}
              </h2>
              {language === 'hi' && (
                <span className="text-2xl text-blue-600 font-bold">
                  ({selectedNumber.devanagari})
                </span>
              )}
            </div>
            <div className="text-base text-slate-600 font-semibold mt-1">
              {language === 'hi'
                ? `English: ${selectedNumber.englishWord} · उच्चारण: ${selectedNumber.hindiPronounce}`
                : `Number ${selectedNumber.num}`}
            </div>

            {/* Visual counting dots for small numbers 1 to 10 */}
            {selectedNumber.num <= 10 && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {Array.from({ length: selectedNumber.num }).map((_, i) => (
                  <span key={i} className="text-xl select-none" title={`Item ${i + 1}`}>
                    ⭐
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => speakNumber(selectedNumber)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Volume2 className="w-5 h-5" />
          <span>{language === 'hi' ? 'सुनिए (Audio)' : 'Listen Audio'}</span>
        </button>
      </div>
    </div>
  );
};
