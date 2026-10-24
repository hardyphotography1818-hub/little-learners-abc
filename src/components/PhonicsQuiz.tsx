import React, { useState, useEffect, useMemo } from 'react';
import { AlphabetItem } from '../types/alphabet';
import { ChildProfile, STANDARDS_INFO } from '../types/profile';
import { QUIZ_LEVELS, QuizLevel, QuizQuestion } from '../data/quizLevelsData';
import {
  Volume2,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Award,
  Layers,
  ChevronRight,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect, speakText } from '../utils/audio';

interface PhonicsQuizProps {
  alphabet: AlphabetItem[];
  soundEnabled: boolean;
  language: 'en' | 'hi';
  childProfile: ChildProfile | null;
  onAddStars?: (count: number) => void;
  onCompleteLevel?: (level: number) => void;
  onOpenProfile?: () => void;
}

export const PhonicsQuiz: React.FC<PhonicsQuizProps> = ({
  alphabet,
  soundEnabled,
  language,
  childProfile,
  onAddStars,
  onCompleteLevel,
  onOpenProfile,
}) => {
  // Determine starting level based on child's class/standard
  const initialLevelNum = useMemo(() => {
    if (!childProfile) return 1;
    const std = childProfile.standard;
    return STANDARDS_INFO[std]?.recommendedQuizLevel || 1;
  }, [childProfile]);

  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(initialLevelNum);

  // Sync with child's profile if standard changes
  useEffect(() => {
    if (childProfile) {
      const rec = STANDARDS_INFO[childProfile.standard]?.recommendedQuizLevel || 1;
      setCurrentLevelNumber(rec);
    }
  }, [childProfile?.standard]);

  const currentLevel = useMemo(() => {
    return (
      QUIZ_LEVELS.find((l) => l.levelNumber === currentLevelNumber) ||
      QUIZ_LEVELS[0]
    );
  }, [currentLevelNumber]);

  // Track asked question IDs in this level session to prevent duplicates
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Level progress
  const [levelScore, setLevelScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);

  const QUESTIONS_PER_LEVEL = 5;

  // Pick next question without repeating
  const loadNextQuestion = (level: QuizLevel, alreadyUsed: string[]) => {
    setSelectedOptionId(null);
    setIsAnswered(false);

    // Filter out already used questions in this level
    let availableQuestions = level.questions.filter(
      (q) => !alreadyUsed.includes(q.id)
    );

    // If all questions exhausted, reset used pool
    if (availableQuestions.length === 0) {
      availableQuestions = level.questions;
      alreadyUsed = [];
      setUsedQuestionIds([]);
    }

    // Pick random question from available pool
    const pickedQuestion =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    setCurrentQuestion(pickedQuestion);
    setUsedQuestionIds([...alreadyUsed, pickedQuestion.id]);

    if (soundEnabled) {
      const prompt =
        language === 'hi' ? pickedQuestion.speakHi : pickedQuestion.speakEn;
      speakText(prompt, { lang: language, pitch: 1.15 });
    }
  };

  // Change level
  const handleSelectLevel = (lvlNum: number) => {
    setCurrentLevelNumber(lvlNum);
    setUsedQuestionIds([]);
    setLevelScore(0);
    setIsLevelCompleted(false);

    const targetLvl =
      QUIZ_LEVELS.find((l) => l.levelNumber === lvlNum) || QUIZ_LEVELS[0];
    loadNextQuestion(targetLvl, []);

    if (soundEnabled) {
      playSoundEffect('pop');
    }
  };

  useEffect(() => {
    loadNextQuestion(currentLevel, []);
  }, [currentLevelNumber]);

  const handleSelectOption = (option: {
    id: string;
    textEn: string;
    textHi?: string;
    emoji?: string;
    colorHex?: string;
    isCorrect: boolean;
  }) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);
    setTotalAnswered((prev) => prev + 1);

    if (option.isCorrect) {
      const nextScore = levelScore + 1;
      setLevelScore(nextScore);
      setStreak((prev) => prev + 1);

      if (onAddStars) onAddStars(1);

      if (soundEnabled) {
        playSoundEffect('success');
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
        });

        const childName = childProfile?.name ? `${childProfile.name}, ` : '';
        const phrase =
          language === 'hi'
            ? `शाबाश ${childName}! ${currentQuestion.explanationHi}`
            : `Great job ${childName}! ${currentQuestion.explanationEn}`;

        speakText(phrase, { lang: language, pitch: 1.2 });
      }

      // Check if level goal reached (5 correct answers)
      if (nextScore >= QUESTIONS_PER_LEVEL) {
        setIsLevelCompleted(true);
        if (onCompleteLevel) onCompleteLevel(currentLevelNumber);

        setTimeout(() => {
          if (soundEnabled) {
            playSoundEffect('cheer');
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.5 },
            });
            const cheerPhrase =
              language === 'hi'
                ? `वाह ${childProfile?.name || ''}! आपने ${currentLevel.titleHi} पूरा कर लिया!`
                : `Hooray ${childProfile?.name || ''}! You completed ${currentLevel.titleEn}!`;
            speakText(cheerPhrase, { lang: language, pitch: 1.25 });
          }
        }, 1200);
      }
    } else {
      setStreak(0);
      if (soundEnabled) {
        playSoundEffect('wrong');
        const phrase =
          language === 'hi'
            ? `अरे नहीं! दोबारा ध्यान से देखिए। ${currentQuestion.explanationHi}`
            : `Nice try! Keep going! ${currentQuestion.explanationEn}`;
        speakText(phrase, { lang: language, pitch: 1.1 });
      }
    }
  };

  const handleHearQuestion = () => {
    if (!currentQuestion || !soundEnabled) return;
    playSoundEffect('soft-click');
    const prompt =
      language === 'hi' ? currentQuestion.speakHi : currentQuestion.speakEn;
    speakText(prompt, { lang: language });
  };

  const handleAdvanceToNextQuestion = () => {
    loadNextQuestion(currentLevel, usedQuestionIds);
  };

  const handleAdvanceToNextLevel = () => {
    const nextLvl = currentLevelNumber < 4 ? currentLevelNumber + 1 : 1;
    handleSelectLevel(nextLvl);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in pb-16">
      {/* Top Child Greeting & Standard Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div
            onClick={onOpenProfile}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 cursor-pointer hover:scale-105 transition-transform"
            title="Click to view/change profile"
          >
            {childProfile?.avatar || '🦁'}
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                {childProfile?.name ? (
                  <span>
                    {language === 'hi' ? `विद्यार्थी: ${childProfile.name}` : `Learner: ${childProfile.name}`}
                  </span>
                ) : (
                  <span>{language === 'hi' ? 'क्विज़ चैलेंज' : 'Quiz Challenge'}</span>
                )}
              </span>
              {childProfile?.standard && (
                <span className="text-xs font-bold text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
                  {language === 'hi'
                    ? STANDARDS_INFO[childProfile.standard].titleHi
                    : STANDARDS_INFO[childProfile.standard].titleEn}
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1">
              {language === 'hi' ? 'लेवल-वाइज क्विज़ प्रतियोगिता 🏆' : 'Leveled Phonics & Knowledge Quiz 🏆'}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-xl font-medium">
              {language === 'hi'
                ? 'कोई भी प्रश्न बार-बार नहीं आएगा! हर लेवल में ५ सही उत्तर देकर अगला स्तर खोलें!'
                : 'Questions won’t repeat! Score 5 stars in each level to advance to the next grade!'}
            </p>
          </div>
        </div>

        {/* Action button to change standard */}
        <button
          onClick={onOpenProfile}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Smile className="w-4 h-4" />
          <span>{language === 'hi' ? 'क्लास बदलें' : 'Change Class'}</span>
        </button>
      </div>

      {/* Level Selector Tabs */}
      <div className="bg-white rounded-2xl p-2.5 border-2 border-slate-200 shadow-xs">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>{language === 'hi' ? 'क्विज़ स्तर (Quiz Levels):' : 'Select Quiz Level:'}</span>
          <span className="text-[11px] font-semibold text-emerald-600">
            {childProfile?.standard &&
              (language === 'hi'
                ? `आपकी क्लास के लिए अनुशंसित: Level ${STANDARDS_INFO[childProfile.standard].recommendedQuizLevel}`
                : `Recommended: Level ${STANDARDS_INFO[childProfile.standard].recommendedQuizLevel}`)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUIZ_LEVELS.map((lvl) => {
            const isSelected = currentLevelNumber === lvl.levelNumber;
            const isRecommended =
              childProfile &&
              STANDARDS_INFO[childProfile.standard]?.recommendedQuizLevel ===
                lvl.levelNumber;

            return (
              <button
                key={lvl.levelNumber}
                onClick={() => handleSelectLevel(lvl.levelNumber)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200 scale-102'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2 right-2 text-[10px] font-black bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full shadow-xs">
                    ★ Best
                  </span>
                )}
                <div className="text-xl mb-1">{lvl.badge}</div>
                <div className="font-display font-black text-xs sm:text-sm text-slate-900">
                  {language === 'hi' ? lvl.titleHi : lvl.titleEn}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  {lvl.targetStandard}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Progress Bar & Scoreboard */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
            {currentLevel.badge}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'लेवल प्रगति' : 'Level Goal Progress'}
            </div>
            <div className="font-display font-black text-lg text-slate-900">
              {levelScore} / {QUESTIONS_PER_LEVEL}{' '}
              {language === 'hi' ? 'स्टार्स (लक्ष्य)' : 'Stars Goal'}
            </div>
          </div>
        </div>

        {/* Visual Progress Stars */}
        <div className="flex items-center gap-2">
          {Array.from({ length: QUESTIONS_PER_LEVEL }).map((_, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                i < levelScore
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                  : 'bg-slate-100 text-slate-300 border border-slate-200'
              }`}
            >
              ★
            </div>
          ))}
        </div>

        {/* Solved stats */}
        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === 'hi' ? 'लगातार सही' : 'Streak'}
          </div>
          <div className="font-display font-black text-emerald-600 text-base">
            {streak} {language === 'hi' ? 'एक साथ ⭐' : 'in a row ⭐'}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LEVEL COMPLETED BANNER MODAL */}
      {/* ========================================================= */}
      {isLevelCompleted ? (
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-xl animate-in zoom-in space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-white text-amber-600 font-black text-4xl flex items-center justify-center mx-auto shadow-md">
            🏆
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
            {language === 'hi'
              ? `शानदार ${childProfile?.name || ''}! आपने ${currentLevel.titleHi} जीत लिया!`
              : `Awesome ${childProfile?.name || ''}! You Mastered ${currentLevel.titleEn}!`}
          </h2>

          <p className="text-white/95 text-sm sm:text-base max-w-lg mx-auto font-medium">
            {language === 'hi'
              ? 'आपने सभी ५ प्रश्न बिल्कुल सही हल किए! आपका सितारा बैज अनलॉक हो गया है।'
              : 'You successfully answered 5 questions correctly without any repeats! Badge unlocked!'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setLevelScore(0);
                setIsLevelCompleted(false);
                setUsedQuestionIds([]);
                loadNextQuestion(currentLevel, []);
              }}
              className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'hi' ? 'यह लेवल फिर से खेलें' : 'Replay This Level'}</span>
            </button>

            {currentLevelNumber < 4 && (
              <button
                onClick={handleAdvanceToNextLevel}
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-display font-black text-base shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>{language === 'hi' ? 'अगला लेवल शुरू करें! 🚀' : 'Start Next Level! 🚀'}</span>
                <ArrowRight className="w-5 h-5 text-rose-500" />
              </button>
            )}
          </div>
        </div>
      ) : currentQuestion ? (
        /* ========================================================= */
        /* ACTIVE QUESTION CARD */
        /* ========================================================= */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm text-center flex flex-col items-center">
          {/* Visual Clue Badge or Big Emoji */}
          {currentQuestion.visualEmoji ? (
            <div className="text-6xl sm:text-7xl select-none mb-3 drop-shadow-sm animate-bounce">
              {currentQuestion.visualEmoji}
            </div>
          ) : currentQuestion.visualBadge ? (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-display font-black text-4xl flex items-center justify-center shadow-md mb-3">
              {currentQuestion.visualBadge}
            </div>
          ) : null}

          {/* Question Prompt with Speaker */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handleHearQuestion}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Hear question"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900">
              {language === 'hi'
                ? currentQuestion.promptHi
                : currentQuestion.promptEn}
            </h2>
          </div>

          {/* Options Grid: Large, Kid-Friendly Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let buttonStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

              if (isAnswered) {
                if (option.isCorrect) {
                  buttonStyle =
                    'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md ring-4 ring-emerald-200';
                } else if (isSelected && !option.isCorrect) {
                  buttonStyle =
                    'bg-rose-50 border-rose-400 text-rose-800 ring-4 ring-rose-200';
                } else {
                  buttonStyle =
                    'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`py-5 px-4 rounded-3xl border-3 font-display font-black transition-all flex flex-col items-center justify-center gap-2 min-h-[140px] cursor-pointer active:scale-95 ${buttonStyle}`}
                >
                  {option.emoji && (
                    <span className="text-4xl sm:text-5xl select-none mb-1">
                      {option.emoji}
                    </span>
                  )}
                  {option.colorHex && (
                    <div
                      className="w-12 h-12 rounded-2xl shadow-inner border border-black/10 mb-1"
                      style={{ backgroundColor: option.colorHex }}
                    />
                  )}
                  <span className="text-base sm:text-lg">
                    {language === 'hi' && option.textHi
                      ? option.textHi
                      : option.textEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="mt-6 w-full animate-in fade-in flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 text-left">
                {selectedOptionId &&
                currentQuestion.options.find((o) => o.id === selectedOptionId)
                  ?.isCorrect ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="font-display font-bold text-sm text-slate-900">
                    {language === 'hi'
                      ? currentQuestion.explanationHi
                      : currentQuestion.explanationEn}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'hi'
                      ? `प्रश्न ${usedQuestionIds.length} / ${currentLevel.questions.length} (कोई दोहराव नहीं)`
                      : `Question ${usedQuestionIds.length} of ${currentLevel.questions.length} (no repeats)`}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdvanceToNextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-display font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
