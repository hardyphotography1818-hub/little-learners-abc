import React, { useState } from 'react';
import {
  COLORS_DATA,
  SHAPES_DATA,
  COLOR_MIX_RECIPES,
  ColorItem,
  ShapeItem,
} from '../data/colorsShapesData';
import { playSoundEffect, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  Trophy,
  Palette,
  Shapes,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Plus,
  Equal,
} from 'lucide-react';

interface ColorsShapesViewProps {
  language: 'en' | 'hi';
  soundEnabled: boolean;
}

export const ColorsShapesView: React.FC<ColorsShapesViewProps> = ({
  language,
  soundEnabled,
}) => {
  const [subTab, setSubTab] = useState<'colors' | 'shapes' | 'mixer' | 'quiz'>('colors');

  // Selected Color & Shape
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);

  // Color Mixer State
  const [mixColor1, setMixColor1] = useState<ColorItem>(COLORS_DATA[0]); // Red
  const [mixColor2, setMixColor2] = useState<ColorItem>(COLORS_DATA[2]); // Yellow
  const [mixResult, setMixResult] = useState<string | null>('orange');

  // Quiz State
  const [quizMode, setQuizMode] = useState<'color' | 'shape'>('color');
  const [quizTargetColor, setQuizTargetColor] = useState<ColorItem | null>(null);
  const [quizTargetShape, setQuizTargetShape] = useState<ShapeItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<any[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Sound & Speech Helpers
  const handleSpeakColor = (c: ColorItem) => {
    if (!soundEnabled) return;
    playSoundEffect('pop');
    if (language === 'hi') {
      speakText(`${c.hindiName}! ${c.name}! ${c.factHi}`, { lang: 'hi', pitch: 1.1 });
    } else {
      speakText(`${c.name}! ${c.factEn}`, { lang: 'en', pitch: 1.15 });
    }
  };

  const handleSpeakShape = (s: ShapeItem) => {
    if (!soundEnabled) return;
    playSoundEffect('pop');
    if (language === 'hi') {
      speakText(`${s.hindiName}! ${s.name}! ${s.factHi}`, { lang: 'hi', pitch: 1.1 });
    } else {
      speakText(`${s.name}! ${s.factEn}`, { lang: 'en', pitch: 1.15 });
    }
  };

  const handleSpeakExample = (word: string, hindiWord: string) => {
    if (!soundEnabled) return;
    playSoundEffect('soft-click');
    if (language === 'hi') {
      speakText(hindiWord, { lang: 'hi' });
    } else {
      speakText(word, { lang: 'en' });
    }
  };

  // Color Mixing calculation
  const handleMixColors = (c1: ColorItem, c2: ColorItem) => {
    const match = COLOR_MIX_RECIPES.find(
      (r) =>
        (r.color1 === c1.id && r.color2 === c2.id) ||
        (r.color1 === c2.id && r.color2 === c1.id)
    );

    if (match) {
      setMixResult(match.resultId);
      if (soundEnabled) {
        playSoundEffect('success');
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: [match.resultHex, c1.hex, c2.hex],
        });
        const phrase =
          language === 'hi'
            ? `जादू! ${c1.hindiName} और ${c2.hindiName} मिलाकर बना ${match.resultHindi}!`
            : `Magic! ${c1.name} and ${c2.name} make ${match.resultName}!`;
        speakText(phrase, { lang: language, pitch: 1.2 });
      }
    } else {
      setMixResult(null);
      if (soundEnabled) {
        playSoundEffect('soft-click');
        const phrase =
          language === 'hi'
            ? `${c1.hindiName} और ${c2.hindiName} को मिलाकर एक नया अनोखा रंग बनता है!`
            : `Mixing ${c1.name} and ${c2.name} creates a wonderful blended shade!`;
        speakText(phrase, { lang: language });
      }
    }
  };

  // Start new Quiz Round
  const startNewQuiz = (type: 'color' | 'shape' = quizMode) => {
    setQuizMode(type);
    setQuizFeedback(null);

    if (type === 'color') {
      const target = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
      setQuizTargetColor(target);
      setQuizTargetShape(null);

      // Pick 3 distractors
      const distractors = COLORS_DATA.filter((c) => c.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allOpts = [...distractors, target].sort(() => 0.5 - Math.random());
      setQuizOptions(allOpts);

      if (soundEnabled) {
        const prompt =
          language === 'hi'
            ? `ढूंढिए: ${target.hindiName} रंग कहाँ है?`
            : `Can you find the ${target.name} color?`;
        speakText(prompt, { lang: language });
      }
    } else {
      const target = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
      setQuizTargetShape(target);
      setQuizTargetColor(null);

      const distractors = SHAPES_DATA.filter((s) => s.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allOpts = [...distractors, target].sort(() => 0.5 - Math.random());
      setQuizOptions(allOpts);

      if (soundEnabled) {
        const prompt =
          language === 'hi'
            ? `ढूंढिए: ${target.hindiName} कहाँ है?`
            : `Can you find the ${target.name} shape?`;
        speakText(prompt, { lang: language });
      }
    }
  };

  const handleQuizAnswer = (option: any) => {
    if (quizMode === 'color' && quizTargetColor) {
      if (option.id === quizTargetColor.id) {
        setQuizScore((prev) => prev + 1);
        setQuizFeedback(language === 'hi' ? 'शाबाश! बिल्कुल सही! ⭐' : 'Awesome! That is correct! ⭐');
        if (soundEnabled) {
          playSoundEffect('success');
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
          speakText(
            language === 'hi'
              ? `शाबाश! यह ${quizTargetColor.hindiName} रंग है!`
              : `Great job! That is ${quizTargetColor.name}!`,
            { lang: language, pitch: 1.2 }
          );
        }
        setTimeout(() => startNewQuiz('color'), 2000);
      } else {
        setQuizFeedback(
          language === 'hi'
            ? `अरे नहीं, यह ${option.hindiName} है। दोबारा ढूंढिए!`
            : `Oops, that was ${option.name}. Try again!`
        );
        if (soundEnabled) {
          playSoundEffect('wrong');
          speakText(
            language === 'hi'
              ? `नहीं, यह ${option.hindiName} है। ${quizTargetColor.hindiName} रंग ढूंढिए!`
              : `That is ${option.name}. Look for ${quizTargetColor.name}!`,
            { lang: language }
          );
        }
      }
    } else if (quizMode === 'shape' && quizTargetShape) {
      if (option.id === quizTargetShape.id) {
        setQuizScore((prev) => prev + 1);
        setQuizFeedback(language === 'hi' ? 'वाह! बिल्कुल सही पहचाना! ⭐' : 'Hooray! Correct shape! ⭐');
        if (soundEnabled) {
          playSoundEffect('success');
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
          speakText(
            language === 'hi'
              ? `वाह! यह ${quizTargetShape.hindiName} है!`
              : `Super! That is the ${quizTargetShape.name}!`,
            { lang: language, pitch: 1.2 }
          );
        }
        setTimeout(() => startNewQuiz('shape'), 2000);
      } else {
        setQuizFeedback(
          language === 'hi'
            ? `अरे नहीं, यह ${option.hindiName} है। दोबारा प्रयास कीजिए!`
            : `That is ${option.name}. Try again!`
        );
        if (soundEnabled) {
          playSoundEffect('wrong');
          speakText(
            language === 'hi'
              ? `नहीं, यह ${option.hindiName} है। ${quizTargetShape.hindiName} को ढूंढिए!`
              : `Not quite, that is ${option.name}. Find the ${quizTargetShape.name}!`,
            { lang: language }
          );
        }
      }
    }
  };

  // Render SVG friendly shape
  const renderShapeIcon = (shapeId: string, color: string, size = 80) => {
    switch (shapeId) {
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <circle cx="50" cy="50" r="42" fill={color} stroke="#1e293b" strokeWidth="3" />
            {/* Cute eyes & smile */}
            <circle cx="38" cy="45" r="4" fill="#ffffff" />
            <circle cx="39" cy="45" r="2.5" fill="#0f172a" />
            <circle cx="62" cy="45" r="4" fill="#ffffff" />
            <circle cx="63" cy="45" r="2.5" fill="#0f172a" />
            <path d="M 40 58 Q 50 68 60 58" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <rect x="14" y="14" width="72" height="72" rx="10" fill={color} stroke="#1e293b" strokeWidth="3" />
            <circle cx="38" cy="45" r="4" fill="#ffffff" />
            <circle cx="39" cy="45" r="2.5" fill="#0f172a" />
            <circle cx="62" cy="45" r="4" fill="#ffffff" />
            <circle cx="63" cy="45" r="2.5" fill="#0f172a" />
            <path d="M 40 58 Q 50 68 60 58" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <polygon points="50,14 88,82 12,82" fill={color} stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="43" cy="54" r="3.5" fill="#ffffff" />
            <circle cx="44" cy="54" r="2" fill="#0f172a" />
            <circle cx="57" cy="54" r="3.5" fill="#ffffff" />
            <circle cx="58" cy="54" r="2" fill="#0f172a" />
            <path d="M 44 64 Q 50 71 56 64" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'rectangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <rect x="10" y="24" width="80" height="52" rx="8" fill={color} stroke="#1e293b" strokeWidth="3" />
            <circle cx="40" cy="45" r="4" fill="#ffffff" />
            <circle cx="41" cy="45" r="2.5" fill="#0f172a" />
            <circle cx="60" cy="45" r="4" fill="#ffffff" />
            <circle cx="61" cy="45" r="2.5" fill="#0f172a" />
            <path d="M 42 56 Q 50 64 58 56" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <polygon
              points="50,10 61,35 88,38 67,56 73,83 50,69 27,83 33,56 12,38 39,35"
              fill={color}
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="43" cy="46" r="3.5" fill="#ffffff" />
            <circle cx="44" cy="46" r="2" fill="#0f172a" />
            <circle cx="57" cy="46" r="3.5" fill="#ffffff" />
            <circle cx="58" cy="46" r="2" fill="#0f172a" />
            <path d="M 45 54 Q 50 59 55 54" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <path
              d="M 50,82 C 15,60 10,25 32,18 C 42,15 48,24 50,28 C 52,24 58,15 68,18 C 90,25 85,60 50,82 Z"
              fill={color}
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="38" r="3.5" fill="#ffffff" />
            <circle cx="41" cy="38" r="2" fill="#0f172a" />
            <circle cx="60" cy="38" r="3.5" fill="#ffffff" />
            <circle cx="61" cy="38" r="2" fill="#0f172a" />
            <path d="M 44 48 Q 50 54 56 48" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <polygon points="50,12 86,50 50,88 14,50" fill={color} stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="42" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="43" cy="45" r="2" fill="#0f172a" />
            <circle cx="58" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="59" cy="45" r="2" fill="#0f172a" />
            <path d="M 43 54 Q 50 61 57 54" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'oval':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <ellipse cx="50" cy="50" rx="42" ry="32" fill={color} stroke="#1e293b" strokeWidth="3" />
            <circle cx="40" cy="45" r="4" fill="#ffffff" />
            <circle cx="41" cy="45" r="2.5" fill="#0f172a" />
            <circle cx="60" cy="45" r="4" fill="#ffffff" />
            <circle cx="61" cy="45" r="2.5" fill="#0f172a" />
            <path d="M 42 56 Q 50 64 58 56" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <polygon points="50,12 85,30 85,70 50,88 15,70 15,30" fill={color} stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="42" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="43" cy="45" r="2" fill="#0f172a" />
            <circle cx="58" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="59" cy="45" r="2" fill="#0f172a" />
            <path d="M 43 56 Q 50 63 57 56" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'pentagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <polygon points="50,12 88,40 73,86 27,86 12,40" fill={color} stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="42" cy="47" r="3.5" fill="#ffffff" />
            <circle cx="43" cy="47" r="2" fill="#0f172a" />
            <circle cx="58" cy="47" r="3.5" fill="#ffffff" />
            <circle cx="59" cy="47" r="2" fill="#0f172a" />
            <path d="M 43 58 Q 50 65 57 58" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'crescent':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            <path
              d="M 68,14 C 40,24 30,55 45,84 C 18,72 15,35 48,12 C 55,7 62,10 68,14 Z"
              fill={color}
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="44" r="3" fill="#ffffff" />
            <circle cx="41" cy="44" r="1.8" fill="#0f172a" />
            <path d="M 38 52 Q 44 58 48 52" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'hi' ? 'रंग और आकार' : 'Colors & Shapes World'}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            {language === 'hi' ? 'रंग और आकृतियाँ सीखें 🎨📐' : 'Learn Colors & Shapes 🎨📐'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">
            {language === 'hi'
              ? 'खूबसूरत रंगों और मजेदार आकारों को देखें, बोलकर सीखें, रंग मिलाएं और गेम खेलें!'
              : 'Tap to hear vibrant colors, discover cute shapes, mix magic paints, and challenge yourself in fun quizzes!'}
          </p>
        </div>

        {/* Action Controls for Subtabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setSubTab('colors')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'colors'
                ? 'bg-white text-rose-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{language === 'hi' ? 'रंग सीखें' : 'Colors'}</span>
          </button>

          <button
            onClick={() => setSubTab('shapes')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'shapes'
                ? 'bg-white text-indigo-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>{language === 'hi' ? 'आकार सीखें' : 'Shapes'}</span>
          </button>

          <button
            onClick={() => setSubTab('mixer')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'mixer'
                ? 'bg-white text-amber-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{language === 'hi' ? 'रंग मिलाओ 🧪' : 'Magic Mixer 🧪'}</span>
          </button>

          <button
            onClick={() => {
              setSubTab('quiz');
              startNewQuiz('color');
            }}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'quiz'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{language === 'hi' ? 'पहचानो खेल ⭐' : 'Quiz Game ⭐'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: COLORS (रंग सीखें) - Large 3-4 blocks per row */}
      {/* ========================================================= */}
      {subTab === 'colors' && (
        <div className="space-y-6">
          {/* Main Selected Color Featured Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Color Splash Blob */}
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-md border-4 border-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: selectedColor.hex }}
                onClick={() => handleSpeakColor(selectedColor)}
              >
                <Sparkles className="w-10 h-10 text-white drop-shadow-md animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {language === 'hi' ? 'चुना हुआ रंग' : 'Selected Color'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {selectedColor.hex}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-1 justify-center sm:justify-start">
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
                    {language === 'hi' ? selectedColor.hindiName : selectedColor.name}
                  </h2>
                  <span className="text-base sm:text-lg font-bold text-slate-500">
                    ({language === 'hi' ? selectedColor.name : selectedColor.hindiName})
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm max-w-md mt-1 font-medium">
                  {language === 'hi' ? selectedColor.factHi : selectedColor.factEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeakColor(selectedColor)}
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-display font-bold text-sm rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Volume2 className="w-5 h-5" />
              <span>{language === 'hi' ? 'रंग की आवाज़ सुनें' : 'Listen to Color'}</span>
            </button>
          </div>

          {/* Real-world Examples for this Color */}
          <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>{language === 'hi' ? `इस रंग की चीज़ें (${selectedColor.hindiName})` : `Things that are ${selectedColor.name}:`}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedColor.examples.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeakExample(item.word, item.hindiWord)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-sm transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <span className="text-3xl group-hover:scale-115 transition-transform">{item.emoji}</span>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900 leading-tight">
                      {language === 'hi' ? item.hindiWord : item.word}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {language === 'hi' ? item.word : item.hindiWord}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of All Colors: Large 3-4 blocks per row */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {language === 'hi' ? 'सभी रंग (टैप करें)' : 'All Colors (Tap to explore)'}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {COLORS_DATA.length} {language === 'hi' ? 'रंग' : 'Colors'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {COLORS_DATA.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <div
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      handleSpeakColor(color);
                    }}
                    className={`p-5 sm:p-6 rounded-3xl border-2 sm:border-3 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none min-h-[160px] sm:min-h-[190px] relative overflow-hidden ${
                      isSelected
                        ? 'border-slate-900 shadow-xl scale-103 ring-4 ring-rose-200 bg-white'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-md hover:scale-101 bg-white'
                    }`}
                  >
                    {/* Big Colorful Swatch Pill */}
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-inner border-2 border-black/10 flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color.hex }}
                    >
                      <Sparkles className="w-6 h-6 text-white/80" />
                    </div>

                    {/* Name block */}
                    <div className="my-2.5 w-full">
                      <div className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                        {language === 'hi' ? color.hindiName : color.name}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                        {language === 'hi' ? color.name : color.hindiName}
                      </div>
                    </div>

                    {/* Quick audio button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color);
                        handleSpeakColor(color);
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-rose-500" />
                      <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SHAPES (आकार सीखें) - Large 3-4 blocks per row */}
      {/* ========================================================= */}
      {subTab === 'shapes' && (
        <div className="space-y-6">
          {/* Main Selected Shape Featured Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Shape Graphic Preview */}
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center shadow-inner cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleSpeakShape(selectedShape)}
              >
                {renderShapeIcon(selectedShape.id, selectedShape.color, 90)}
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {language === 'hi' ? 'चुना हुआ आकार' : 'Selected Shape'}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {language === 'hi'
                      ? `${selectedShape.sides} भुजाएँ • ${selectedShape.corners} कोने`
                      : `${selectedShape.sides} Sides • ${selectedShape.corners} Corners`}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-1 justify-center sm:justify-start">
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
                    {language === 'hi' ? selectedShape.hindiName : selectedShape.name}
                  </h2>
                  <span className="text-base sm:text-lg font-bold text-slate-500">
                    ({language === 'hi' ? selectedShape.name : selectedShape.hindiName})
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm max-w-md mt-1 font-medium">
                  {language === 'hi' ? selectedShape.factHi : selectedShape.factEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeakShape(selectedShape)}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-display font-bold text-sm rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Volume2 className="w-5 h-5" />
              <span>{language === 'hi' ? 'आकार की आवाज़ सुनें' : 'Listen to Shape'}</span>
            </button>
          </div>

          {/* Real-world Examples for this Shape */}
          <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>{language === 'hi' ? `इस आकार की चीज़ें (${selectedShape.hindiName})` : `Things shaped like a ${selectedShape.name}:`}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedShape.examples.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeakExample(item.word, item.hindiWord)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <span className="text-3xl group-hover:scale-115 transition-transform">{item.emoji}</span>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900 leading-tight">
                      {language === 'hi' ? item.hindiWord : item.word}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {language === 'hi' ? item.word : item.hindiWord}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of All Shapes: Large 3-4 blocks per row */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {language === 'hi' ? 'सभी आकृतियाँ (टैप करें)' : 'All Shapes (Tap to explore)'}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {SHAPES_DATA.length} {language === 'hi' ? 'आकार' : 'Shapes'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {SHAPES_DATA.map((shape) => {
                const isSelected = selectedShape.id === shape.id;
                return (
                  <div
                    key={shape.id}
                    onClick={() => {
                      setSelectedShape(shape);
                      handleSpeakShape(shape);
                    }}
                    className={`p-5 sm:p-6 rounded-3xl border-2 sm:border-3 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none min-h-[170px] sm:min-h-[200px] bg-white ${
                      isSelected
                        ? 'border-indigo-600 shadow-xl scale-103 ring-4 ring-indigo-200'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md hover:scale-101'
                    }`}
                  >
                    {/* SVG Graphic with smiling face */}
                    <div className="my-1 transition-transform hover:scale-110">
                      {renderShapeIcon(shape.id, shape.color, 75)}
                    </div>

                    {/* Shape name & stats */}
                    <div className="my-2 w-full">
                      <div className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">
                        {language === 'hi' ? shape.hindiName : shape.name}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1">
                        {language === 'hi'
                          ? `${shape.sides} भुजा • ${shape.corners} कोना`
                          : `${shape.sides} Sides • ${shape.corners} Corners`}
                      </div>
                    </div>

                    {/* Audio button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShape(shape);
                        handleSpeakShape(shape);
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-500" />
                      <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MAGIC COLOR MIXER (जादुई रंग प्रयोगशाला) */}
      {/* ========================================================= */}
      {subTab === 'mixer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'जादुई रंग प्रयोगशाला' : 'Magic Color Lab'}</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              {language === 'hi' ? 'दो रंगों को मिलाकर नया रंग बनाइए!' : 'Mix Any 2 Colors Together!'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto mt-1 font-medium">
              {language === 'hi'
                ? 'नीचे दिए गए रंगों में से कोई 2 रंग चुनें और देखें क्या कमाल होता है!'
                : 'Select Color 1 and Color 2 below to see what magical new color they create!'}
            </p>

            {/* Mixing Experiment Showcase */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-8">
              {/* Color 1 */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-md border-4 border-white flex items-center justify-center transition-transform hover:scale-105"
                  style={{ backgroundColor: mixColor1.hex }}
                >
                  <span className="text-white font-black text-2xl drop-shadow-sm">1</span>
                </div>
                <span className="font-display font-bold text-sm sm:text-base text-slate-800">
                  {language === 'hi' ? mixColor1.hindiName : mixColor1.name}
                </span>
              </div>

              {/* Plus icon */}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Plus className="w-6 h-6" />
              </div>

              {/* Color 2 */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-md border-4 border-white flex items-center justify-center transition-transform hover:scale-105"
                  style={{ backgroundColor: mixColor2.hex }}
                >
                  <span className="text-white font-black text-2xl drop-shadow-sm">2</span>
                </div>
                <span className="font-display font-bold text-sm sm:text-base text-slate-800">
                  {language === 'hi' ? mixColor2.hindiName : mixColor2.name}
                </span>
              </div>

              {/* Equal icon */}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Equal className="w-6 h-6" />
              </div>

              {/* Result Bubble */}
              {mixResult ? (
                (() => {
                  const resColor = COLORS_DATA.find((c) => c.id === mixResult);
                  return (
                    <div className="flex flex-col items-center gap-2 animate-in zoom-in">
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-xl border-4 border-amber-300 flex items-center justify-center ring-4 ring-amber-100"
                        style={{ backgroundColor: resColor?.hex || '#f97316' }}
                      >
                        <Sparkles className="w-10 h-10 text-white animate-spin" />
                      </div>
                      <span className="font-display font-black text-lg sm:text-xl text-amber-900">
                        {language === 'hi' ? resColor?.hindiName : resColor?.name}! 🎉
                      </span>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <FlaskConical className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {language === 'hi' ? 'मिश्रण' : 'Blended Shade'}
                  </span>
                </div>
              )}
            </div>

            {/* Mix Action Button */}
            <button
              onClick={() => handleMixColors(mixColor1, mixColor2)}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-display font-black text-base rounded-2xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{language === 'hi' ? 'जादुई रंग मिलाओ!' : 'Mix Magic Colors!'}</span>
            </button>
          </div>

          {/* Palette Picker for Mix */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
            <h3 className="font-display font-bold text-base text-slate-800 mb-3">
              {language === 'hi' ? 'रंग चुनें:' : 'Select colors to mix:'}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {COLORS_DATA.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    // Alternate selection
                    setMixColor1(mixColor2);
                    setMixColor2(c);
                    handleMixColors(mixColor2, c);
                  }}
                  className={`p-3 bg-white rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    mixColor1.id === c.id || mixColor2.id === c.id
                      ? 'border-amber-500 ring-2 ring-amber-200 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-bold text-xs text-slate-800">
                    {language === 'hi' ? c.hindiName : c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SHAPES & COLORS QUIZ (पहचानो खेल) */}
      {/* ========================================================= */}
      {subTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Header & Score Bar */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-xs">
                ⭐
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  {language === 'hi' ? 'रंग और आकार पहचानो गेम' : 'Colors & Shapes Quiz Challenge'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'सही उत्तर चुनकर स्टार्स जीतिए!' : 'Tap the correct card to win stars!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode switch */}
              <button
                onClick={() => startNewQuiz('color')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  quizMode === 'color' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {language === 'hi' ? 'रंग पहचानो' : 'Color Mode'}
              </button>
              <button
                onClick={() => startNewQuiz('shape')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  quizMode === 'shape' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {language === 'hi' ? 'आकार पहचानो' : 'Shape Mode'}
              </button>

              <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl font-display font-black text-amber-900 text-sm">
                Score: {quizScore} ⭐
              </div>
            </div>
          </div>

          {/* Active Question Prompt */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 text-center animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              {language === 'hi' ? 'प्रश्न (Question)' : 'Find The Match!'}
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-950">
              {quizMode === 'color' && quizTargetColor
                ? language === 'hi'
                  ? `ढूंढिए: "${quizTargetColor.hindiName}" (${quizTargetColor.name}) रंग कहाँ है?`
                  : `Can you find the "${quizTargetColor.name}" color?`
                : quizMode === 'shape' && quizTargetShape
                ? language === 'hi'
                  ? `ढूंढिए: "${quizTargetShape.hindiName}" (${quizTargetShape.name}) कहाँ है?`
                  : `Can you find the "${quizTargetShape.name}" shape?`
                : ''}
            </h2>

            {quizFeedback && (
              <div className="mt-3 text-sm sm:text-base font-bold text-amber-900 animate-in zoom-in">
                {quizFeedback}
              </div>
            )}

            <button
              onClick={() => {
                if (quizMode === 'color' && quizTargetColor) {
                  speakText(
                    language === 'hi' ? quizTargetColor.hindiName : quizTargetColor.name,
                    { lang: language }
                  );
                } else if (quizMode === 'shape' && quizTargetShape) {
                  speakText(
                    language === 'hi' ? quizTargetShape.hindiName : quizTargetShape.name,
                    { lang: language }
                  );
                }
              }}
              className="mt-4 px-4 py-2 bg-white text-amber-900 rounded-xl font-bold text-xs shadow-xs hover:bg-amber-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'दोबारा सुनें' : 'Listen Again'}</span>
            </button>
          </div>

          {/* Options Grid: Large 3-4 blocks per row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {quizOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleQuizAnswer(opt)}
                className="bg-white p-6 rounded-3xl border-3 border-slate-200 hover:border-amber-400 hover:shadow-lg active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none min-h-[160px] group"
              >
                {quizMode === 'color' ? (
                  <>
                    <div
                      className="w-20 h-20 rounded-2xl shadow-md border-2 border-black/10 group-hover:scale-110 transition-transform mb-3"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <div className="font-display font-black text-lg text-slate-800">
                      {language === 'hi' ? opt.hindiName : opt.name}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3 group-hover:scale-110 transition-transform">
                      {renderShapeIcon(opt.id, opt.color, 75)}
                    </div>
                    <div className="font-display font-black text-lg text-slate-800">
                      {language === 'hi' ? opt.hindiName : opt.name}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
