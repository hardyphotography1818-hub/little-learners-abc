import React, { useState } from 'react';
import {
  COLORS_DATA,
  COLOR_MIX_RECIPES,
  ColorItem,
} from '../data/colorsShapesData';
import { playSoundEffect, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  Trophy,
  Palette,
  FlaskConical,
  RotateCcw,
  Plus,
  Equal,
  CheckCircle2,
  Smile,
} from 'lucide-react';

interface ColorsViewProps {
  language: 'en' | 'hi';
  soundEnabled: boolean;
}

export const ColorsView: React.FC<ColorsViewProps> = ({
  language,
  soundEnabled,
}) => {
  const [subTab, setSubTab] = useState<'explore' | 'mixer' | 'quiz'>('explore');

  // Selected Color
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);

  // Color Mixer State
  const [mixColor1, setMixColor1] = useState<ColorItem>(COLORS_DATA[0]); // Red
  const [mixColor2, setMixColor2] = useState<ColorItem>(COLORS_DATA[2]); // Yellow
  const [mixResult, setMixResult] = useState<string | null>('orange');

  // Quiz State
  const [quizTargetColor, setQuizTargetColor] = useState<ColorItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<ColorItem[]>([]);
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
          particleCount: 50,
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
  const startNewQuiz = () => {
    setQuizFeedback(null);
    const target = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    setQuizTargetColor(target);

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
  };

  const handleQuizAnswer = (option: ColorItem) => {
    if (!quizTargetColor) return;

    if (option.id === quizTargetColor.id) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback(language === 'hi' ? 'शाबाश! बिल्कुल सही उत्तर! ⭐' : 'Awesome! That is correct! ⭐');
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
      setTimeout(() => startNewQuiz(), 2000);
    } else {
      setQuizFeedback(
        language === 'hi'
          ? `अरे नहीं, यह ${option.hindiName} है। दोबारा प्रयास कीजिए!`
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in pb-16">
      {/* Hero Banner for Colors */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Palette className="w-4 h-4 text-amber-200" />
            <span>{language === 'hi' ? 'रंगों की दुनिया' : 'Colors World'}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            {language === 'hi' ? 'रंग सीखें (Colors for Kids) 🎨' : 'Learn Colors with Fun 🎨'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">
            {language === 'hi'
              ? 'लाल, नीला, पीला, हरा और बहुत से रंग! आवाज़ सुनें, रंग मिलाना सीखें और मजेदार क्विज़ खेलें।'
              : 'Tap vibrant color cards to hear clear spoken pronunciation in Hindi & English, mix magic paints, and play quiz games!'}
          </p>
        </div>

        {/* Sub-tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setSubTab('explore')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'explore'
                ? 'bg-white text-rose-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{language === 'hi' ? 'सभी रंग' : 'All Colors'}</span>
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
            <span>{language === 'hi' ? 'रंग मिलाओ 🧪' : 'Color Mixer 🧪'}</span>
          </button>

          <button
            onClick={() => {
              setSubTab('quiz');
              startNewQuiz();
            }}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'quiz'
                ? 'bg-amber-300 text-slate-900 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{language === 'hi' ? 'रंग क्विज़ ⭐' : 'Color Quiz ⭐'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: EXPLORE ALL COLORS */}
      {/* ========================================================= */}
      {subTab === 'explore' && (
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
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
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
      {/* SUB-TAB 2: MAGIC COLOR MIXER */}
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
      {/* SUB-TAB 3: COLOR QUIZ */}
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
                  {language === 'hi' ? 'रंग पहचानो क्विज़' : 'Color Quiz Challenge'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'सही रंग चुनकर स्टार्स जीतिए!' : 'Tap the correct color card to win stars!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-display font-black text-sm flex items-center gap-1.5">
                <span>⭐ {quizScore}</span>
                <span className="text-xs font-semibold text-amber-700">
                  {language === 'hi' ? 'अंक' : 'Points'}
                </span>
              </div>

              <button
                onClick={startNewQuiz}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title={language === 'hi' ? 'नया प्रश्न' : 'Next Question'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          {quizTargetColor && (
            <div className="bg-gradient-to-b from-rose-50 to-white rounded-3xl p-8 border-2 border-rose-200 text-center space-y-6 shadow-sm">
              <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                {language === 'hi' ? 'ढूंढिए' : 'Find This Color'}
              </span>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900">
                "{language === 'hi' ? quizTargetColor.hindiName : quizTargetColor.name}"
              </h2>

              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {language === 'hi'
                  ? `नीचे दिए गए 4 विकल्पों में से ${quizTargetColor.hindiName} रंग पर टैप करें:`
                  : `Tap on the card below that is ${quizTargetColor.name}:`}
              </p>

              {/* Feedback Alert */}
              {quizFeedback && (
                <div className="py-2.5 px-6 rounded-2xl bg-white border border-rose-200 shadow-xs inline-block font-display font-bold text-sm text-slate-800 animate-in zoom-in">
                  {quizFeedback}
                </div>
              )}

              {/* Quiz 4 Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                {quizOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleQuizAnswer(opt)}
                    className="p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all flex flex-col items-center gap-3 cursor-pointer group active:scale-95"
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-md border-2 border-black/10 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <span className="font-display font-bold text-base text-slate-800">
                      {language === 'hi' ? opt.hindiName : opt.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
