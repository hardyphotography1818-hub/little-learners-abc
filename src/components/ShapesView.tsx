import React, { useState, useRef, useEffect } from 'react';
import {
  SHAPES_DATA,
  ShapeItem,
} from '../data/colorsShapesData';
import { playSoundEffect, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  Trophy,
  Shapes,
  RotateCcw,
  Pencil,
  CheckCircle2,
  Smile,
  Trash2,
} from 'lucide-react';

interface ShapesViewProps {
  language: 'en' | 'hi';
  soundEnabled: boolean;
}

export const ShapesView: React.FC<ShapesViewProps> = ({
  language,
  soundEnabled,
}) => {
  const [subTab, setSubTab] = useState<'explore' | 'tracing' | 'quiz'>('explore');

  // Selected Shape
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);

  // Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [traceStrokeCount, setTraceStrokeCount] = useState(0);

  // Quiz State
  const [quizTargetShape, setQuizTargetShape] = useState<ShapeItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<ShapeItem[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Speak Shape
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

  // Start Shape Quiz
  const startNewQuiz = () => {
    setQuizFeedback(null);
    const target = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    setQuizTargetShape(target);

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
  };

  const handleQuizAnswer = (option: ShapeItem) => {
    if (!quizTargetShape) return;

    if (option.id === quizTargetShape.id) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback(language === 'hi' ? 'शाबाश! बिल्कुल सही पहचाना! ⭐' : 'Awesome! That is correct! ⭐');
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
            ? `नहीं, यह ${option.hindiName} है। ${quizTargetShape.hindiName} को ढूंढिए!`
            : `Not quite, that is ${option.name}. Find the ${quizTargetShape.name}!`,
          { lang: language }
        );
      }
    }
  };

  // Canvas Drawing Handlers for Shape Tracing
  const clearTracingCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTraceStrokeCount(0);
    if (soundEnabled) playSoundEffect('pop');
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedShape.color;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setTraceStrokeCount((prev) => prev + 1);
      if (soundEnabled && traceStrokeCount === 2) {
        playSoundEffect('success');
      }
    }
  };

  // Render SVG friendly shape
  const renderShapeIcon = (shapeId: string, color: string, size = 80, strokeOnly = false) => {
    const fillStyle = strokeOnly ? 'none' : color;
    const strokeDash = strokeOnly ? '6 6' : 'none';
    const strokeWidth = strokeOnly ? '4' : '3';
    const strokeColor = strokeOnly ? '#94a3b8' : '#1e293b';

    switch (shapeId) {
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <circle cx="50" cy="50" r="42" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="38" cy="45" r="4" fill="#ffffff" />
                <circle cx="39" cy="45" r="2.5" fill="#0f172a" />
                <circle cx="62" cy="45" r="4" fill="#ffffff" />
                <circle cx="63" cy="45" r="2.5" fill="#0f172a" />
                <path d="M 40 58 Q 50 68 60 58" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <rect x="14" y="14" width="72" height="72" rx="10" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="38" cy="45" r="4" fill="#ffffff" />
                <circle cx="39" cy="45" r="2.5" fill="#0f172a" />
                <circle cx="62" cy="45" r="4" fill="#ffffff" />
                <circle cx="63" cy="45" r="2.5" fill="#0f172a" />
                <path d="M 40 58 Q 50 68 60 58" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <polygon points="50,14 88,82 12,82" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="43" cy="54" r="3.5" fill="#ffffff" />
                <circle cx="44" cy="54" r="2" fill="#0f172a" />
                <circle cx="57" cy="54" r="3.5" fill="#ffffff" />
                <circle cx="58" cy="54" r="2" fill="#0f172a" />
                <path d="M 44 64 Q 50 71 56 64" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'rectangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <rect x="10" y="24" width="80" height="52" rx="8" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="40" cy="45" r="4" fill="#ffffff" />
                <circle cx="41" cy="45" r="2.5" fill="#0f172a" />
                <circle cx="60" cy="45" r="4" fill="#ffffff" />
                <circle cx="61" cy="45" r="2.5" fill="#0f172a" />
                <path d="M 42 56 Q 50 64 58 56" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <polygon
              points="50,10 61,35 88,38 67,56 73,83 50,69 27,83 33,56 12,38 39,35"
              fill={fillStyle}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeDasharray={strokeDash}
            />
            {!strokeOnly && (
              <>
                <circle cx="43" cy="46" r="3.5" fill="#ffffff" />
                <circle cx="44" cy="46" r="2" fill="#0f172a" />
                <circle cx="57" cy="46" r="3.5" fill="#ffffff" />
                <circle cx="58" cy="46" r="2" fill="#0f172a" />
                <path d="M 45 54 Q 50 59 55 54" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <path
              d="M 50,82 C 15,60 10,25 32,18 C 42,15 48,24 50,28 C 52,24 58,15 68,18 C 90,25 85,60 50,82 Z"
              fill={fillStyle}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeDasharray={strokeDash}
            />
            {!strokeOnly && (
              <>
                <circle cx="40" cy="38" r="3.5" fill="#ffffff" />
                <circle cx="41" cy="38" r="2" fill="#0f172a" />
                <circle cx="60" cy="38" r="3.5" fill="#ffffff" />
                <circle cx="61" cy="38" r="2" fill="#0f172a" />
                <path d="M 44 48 Q 50 54 56 48" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <polygon points="50,12 86,50 50,88 14,50" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="42" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="43" cy="45" r="2" fill="#0f172a" />
                <circle cx="58" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="59" cy="45" r="2" fill="#0f172a" />
                <path d="M 43 54 Q 50 61 57 54" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'oval':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <ellipse cx="50" cy="50" rx="42" ry="32" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="40" cy="45" r="4" fill="#ffffff" />
                <circle cx="41" cy="45" r="2.5" fill="#0f172a" />
                <circle cx="60" cy="45" r="4" fill="#ffffff" />
                <circle cx="61" cy="45" r="2.5" fill="#0f172a" />
                <path d="M 42 56 Q 50 64 58 56" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <polygon points="50,12 85,30 85,70 50,88 15,70 15,30" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="42" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="43" cy="45" r="2" fill="#0f172a" />
                <circle cx="58" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="59" cy="45" r="2" fill="#0f172a" />
                <path d="M 43 56 Q 50 63 57 56" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'pentagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <polygon points="50,12 88,40 73,86 27,86 12,40" fill={fillStyle} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeDasharray={strokeDash} />
            {!strokeOnly && (
              <>
                <circle cx="42" cy="47" r="3.5" fill="#ffffff" />
                <circle cx="43" cy="47" r="2" fill="#0f172a" />
                <circle cx="58" cy="47" r="3.5" fill="#ffffff" />
                <circle cx="59" cy="47" r="2" fill="#0f172a" />
                <path d="M 43 58 Q 50 65 57 58" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </svg>
        );
      case 'crescent':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xs">
            <path
              d="M 68,14 C 40,24 30,55 45,84 C 18,72 15,35 48,12 C 55,7 62,10 68,14 Z"
              fill={fillStyle}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeDasharray={strokeDash}
            />
            {!strokeOnly && (
              <>
                <circle cx="40" cy="44" r="3" fill="#ffffff" />
                <circle cx="41" cy="44" r="1.8" fill="#0f172a" />
                <path d="M 38 52 Q 44 58 48 52" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in pb-16">
      {/* Hero Banner for Shapes */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Shapes className="w-4 h-4 text-teal-200" />
            <span>{language === 'hi' ? 'आकारों की दुनिया' : 'Shapes World'}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            {language === 'hi' ? 'आकार सीखें (Shapes for Kids) 📐' : 'Learn Shapes & Geometry 📐'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">
            {language === 'hi'
              ? 'वृत्त, वर्ग, त्रिकोण, आयत, सितारा और सभी आकृतियाँ! भुजाएँ और कोने गिनें, उंगली से बनाएं और गेम खेलें।'
              : 'Discover 11 fun geometric shapes with side & corner counts, interactive shape tracing canvas, and cheerful quiz games!'}
          </p>
        </div>

        {/* Sub-tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setSubTab('explore')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'explore'
                ? 'bg-white text-indigo-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>{language === 'hi' ? 'सभी आकार' : 'All Shapes'}</span>
          </button>

          <button
            onClick={() => setSubTab('tracing')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'tracing'
                ? 'bg-white text-teal-700 shadow-md scale-103'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>{language === 'hi' ? 'आकार ट्रेसिंग ✏️' : 'Shape Tracing ✏️'}</span>
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
            <span>{language === 'hi' ? 'आकार क्विज़ ⭐' : 'Shape Quiz ⭐'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: EXPLORE ALL SHAPES */}
      {/* ========================================================= */}
      {subTab === 'explore' && (
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
      {/* SUB-TAB 2: SHAPE TRACING & DRAWING PAD */}
      {/* ========================================================= */}
      {subTab === 'tracing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1 border border-teal-200">
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'आकार बनाना सीखें' : 'Trace & Draw Shapes'}</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  {language === 'hi'
                    ? `${selectedShape.hindiName} को उंगली या माउस से ट्रेस करें`
                    : `Trace the ${selectedShape.name} shape`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {language === 'hi'
                    ? 'नीचे दिए गए गाइड आउटलाइन के ऊपर उंगली फेरें!'
                    : 'Draw with your finger or mouse over the dotted outline!'}
                </p>
              </div>

              {/* Clear canvas button */}
              <button
                onClick={clearTracingCanvas}
                className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'साफ़ करें' : 'Clear Canvas'}</span>
              </button>
            </div>

            {/* Shape selection pills for tracing */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
              {SHAPES_DATA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedShape(s);
                    clearTracingCanvas();
                    handleSpeakShape(s);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs shrink-0 flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedShape.id === s.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{language === 'hi' ? s.hindiName : s.name}</span>
                </button>
              ))}
            </div>

            {/* Interactive Tracing Canvas Area */}
            <div className="relative w-full max-w-md mx-auto aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Dotted guideline of the shape */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                {renderShapeIcon(selectedShape.id, selectedShape.color, 260, true)}
              </div>

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full touch-none cursor-crosshair relative z-10"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />

              {/* Encouragement message */}
              {traceStrokeCount > 2 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-emerald-500 text-white font-display font-bold text-xs rounded-full shadow-md animate-in zoom-in">
                  {language === 'hi' ? 'शाबाश! बहुत सुंदर! ⭐' : 'Great job tracing! ⭐'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: SHAPE QUIZ */}
      {/* ========================================================= */}
      {subTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Header & Score Bar */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-xs">
                ⭐
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  {language === 'hi' ? 'आकार पहचानो क्विज़' : 'Shape Quiz Challenge'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'सही आकार चुनकर स्टार्स जीतिए!' : 'Tap the correct shape card to win stars!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-900 font-display font-black text-sm flex items-center gap-1.5">
                <span>⭐ {quizScore}</span>
                <span className="text-xs font-semibold text-indigo-700">
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
          {quizTargetShape && (
            <div className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-8 border-2 border-indigo-200 text-center space-y-6 shadow-sm">
              <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                {language === 'hi' ? 'ढूंढिए' : 'Find This Shape'}
              </span>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900">
                "{language === 'hi' ? quizTargetShape.hindiName : quizTargetShape.name}"
              </h2>

              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {language === 'hi'
                  ? `नीचे दिए गए 4 विकल्पों में से ${quizTargetShape.hindiName} पर टैप करें:`
                  : `Tap on the card below that is a ${quizTargetShape.name}:`}
              </p>

              {/* Feedback Alert */}
              {quizFeedback && (
                <div className="py-2.5 px-6 rounded-2xl bg-white border border-indigo-200 shadow-xs inline-block font-display font-bold text-sm text-slate-800 animate-in zoom-in">
                  {quizFeedback}
                </div>
              )}

              {/* Quiz 4 Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                {quizOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleQuizAnswer(opt)}
                    className="p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center gap-3 cursor-pointer group active:scale-95"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {renderShapeIcon(opt.id, opt.color, 75)}
                    </div>
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
