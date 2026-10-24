import React, { useRef, useState, useEffect } from 'react';
import { AlphabetItem } from '../types/alphabet';
import { RotateCcw, Sparkles, Volume2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect, speakText } from '../utils/audio';

interface TracingCanvasProps {
  alphabet: AlphabetItem[];
  selectedItem: AlphabetItem;
  onSelectLetter: (item: AlphabetItem) => void;
  soundEnabled: boolean;
  language?: 'en' | 'hi';
}

const BRUSH_COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Pink', hex: '#ec4899' },
];

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  alphabet,
  selectedItem,
  onSelectLetter,
  soundEnabled,
  language = 'en',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawnPointsRef = useRef<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [caseMode, setCaseMode] = useState<'upper' | 'lower'>('upper');
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushWidth, setBrushWidth] = useState(14);
  const [strokeCount, setStrokeCount] = useState(0);

  // Validation feedback state
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'success' | 'incorrect' | 'too_few';
    score: number;
    message: string;
  }>({
    status: 'idle',
    score: 0,
    message: '',
  });

  const displayLetter = caseMode === 'upper' ? selectedItem.letter : selectedItem.letter.toLowerCase();

  // Draw the dotted letter guide directly on the background canvas
  const drawGuideCanvas = () => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 360, 360);

    // Primary school 3-line ruling: Topline (pink), Midline (dashed sky-blue), Baseline (slate)
    ctx.strokeStyle = '#fecdd3';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, 75);
    ctx.lineTo(344, 75);
    ctx.stroke();

    ctx.strokeStyle = '#93c5fd';
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, 175);
    ctx.lineTo(344, 175);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 275);
    ctx.lineTo(344, 275);
    ctx.stroke();

    // Guide Letter: Sits directly on baseline 275
    const fontSize = caseMode === 'upper' ? 220 : 180;
    const fontBaseline = 275;
    ctx.font = `bold ${fontSize}px 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Soft letter body fill
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(displayLetter, 180, fontBaseline);

    // Dashed guide outline
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(displayLetter, 180, fontBaseline);
    ctx.setLineDash([]);
  };

  // Re-draw guide and clear canvas when letter or case mode changes
  useEffect(() => {
    drawGuideCanvas();
    if (document.fonts) {
      document.fonts.ready.then(() => {
        drawGuideCanvas();
      });
    }
    clearCanvas();
  }, [selectedItem.letter, caseMode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    drawnPointsRef.current = [];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setValidationResult({ status: 'idle', score: 0, message: '' });
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      };
    } else {
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    drawnPointsRef.current.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
    setIsDrawing(true);
    setStrokeCount(prev => prev + 1);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    drawnPointsRef.current.push({ x, y });

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Synchronized High-Fidelity Validation
  const handleValidateTracing = () => {
    const userCanvas = canvasRef.current;
    if (!userCanvas) return;
    const userCtx = userCanvas.getContext('2d', { willReadFrequently: true });
    if (!userCtx) return;

    // 1. Render pure template letter at the EXACT font, size, and baseline as the on-screen guide
    const fontSize = caseMode === 'upper' ? 220 : 180;
    const fontBaseline = 275;

    const offscreen = document.createElement('canvas');
    offscreen.width = 360;
    offscreen.height = 360;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.fillStyle = '#000000';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'alphabetic';
    offCtx.font = `bold ${fontSize}px 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    offCtx.fillText(displayLetter, 180, fontBaseline);

    const templateData = offCtx.getImageData(0, 0, 360, 360).data;
    const userData = userCtx.getImageData(0, 0, 360, 360).data;

    // 2. Divide canvas into 18x18 grid (20px cells) for high-resolution shape analysis
    const GRID_SIZE = 18;
    const CELL_SIZE = 360 / GRID_SIZE; // 20px
    const letterCells = new Set<string>();
    const userCells = new Set<string>();

    let minGx = GRID_SIZE;
    let maxGx = 0;
    let minGy = GRID_SIZE;
    let maxGy = 0;

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const key = `${gx},${gy}`;
        let hitTemplate = 0;
        let hitUser = 0;

        for (let dy = 2; dy < 20; dy += 3) {
          for (let dx = 2; dx < 20; dx += 3) {
            const px = Math.floor(gx * CELL_SIZE + dx);
            const py = Math.floor(gy * CELL_SIZE + dy);
            const idx = (py * 360 + px) * 4;
            if (templateData[idx + 3] > 60) {
              hitTemplate++;
            }
            if (userData[idx + 3] > 40) {
              hitUser++;
            }
          }
        }

        if (hitTemplate >= 3) {
          letterCells.add(key);
          if (gx < minGx) minGx = gx;
          if (gx > maxGx) maxGx = gx;
          if (gy < minGy) minGy = gy;
          if (gy > maxGy) maxGy = gy;
        }

        if (hitUser >= 3) {
          userCells.add(key);
        }
      }
    }

    if (letterCells.size === 0) return;

    // Check minimum strokes: user must have drawn at least a small set of cells
    if (userCells.size < 12) {
      const msg =
        language === 'hi'
          ? `कृपया पहले अक्षर ${displayLetter} के ऊपर पेंसिल चलाइए!`
          : `Please trace over letter ${displayLetter} first!`;
      setValidationResult({ status: 'too_few', score: 0, message: msg });
      if (soundEnabled) {
        playSoundEffect('wrong');
        speakText(msg, { lang: language });
      }
      return;
    }

    // Corridor tolerance: letter cells + adjacent 1-cell corridor (~25px buffer)
    const corridorCells = new Set<string>();
    for (const cell of letterCells) {
      const [cx, cy] = cell.split(',').map(Number);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            corridorCells.add(`${nx},${ny}`);
          }
        }
      }
    }

    let coveredLetterCells = 0;
    let inCorridorCells = 0;
    let strayCells = 0;

    for (const uCell of userCells) {
      if (letterCells.has(uCell)) {
        coveredLetterCells++;
      }
      if (corridorCells.has(uCell)) {
        inCorridorCells++;
      } else {
        strayCells++;
      }
    }

    // Zonal Completeness Analysis (Top, Bottom, Left, Right):
    // For letter 'B', the bottom loop curve and return-to-spine is ~28 cells.
    // If a user traces 'R', they draw a diagonal leg missing the bottom loop curve, scoring < 20% in the bottom half!
    const letterHeight = Math.max(1, maxGy - minGy);
    const letterWidth = Math.max(1, maxGx - minGx);

    let topCount = 0;
    let topVisited = 0;
    let botCount = 0;
    let botVisited = 0;
    let leftCount = 0;
    let leftVisited = 0;
    let rightCount = 0;
    let rightVisited = 0;

    for (const cell of letterCells) {
      const [cx, cy] = cell.split(',').map(Number);
      const isVisited = userCells.has(cell);

      const relY = (cy - minGy) / letterHeight;
      if (relY <= 0.48) {
        topCount++;
        if (isVisited) topVisited++;
      } else {
        botCount++;
        if (isVisited) botVisited++;
      }

      const relX = (cx - minGx) / letterWidth;
      if (relX <= 0.45) {
        leftCount++;
        if (isVisited) leftVisited++;
      } else {
        rightCount++;
        if (isVisited) rightVisited++;
      }
    }

    const isTopOk = topCount < 5 || topVisited / topCount >= 0.28;
    const isBotOk = botCount < 5 || botVisited / botCount >= 0.28;
    const isLeftOk = leftCount < 5 || leftVisited / leftCount >= 0.28;
    const isRightOk = rightCount < 5 || rightVisited / rightCount >= 0.28;
    const areZonesOk = isTopOk && isBotOk && isLeftOk && isRightOk;

    // Overall Metrics
    const coverage = letterCells.size > 0 ? coveredLetterCells / letterCells.size : 0;
    const precision = userCells.size > 0 ? inCorridorCells / userCells.size : 0;
    const strayRatio = userCells.size > 0 ? strayCells / userCells.size : 0;

    // Encouraging Kid-Friendly Accuracy Calibration (~88% - 96% for good child attempts)
    const rawScore = coverage * 0.70 + precision * 0.30 - strayRatio * 0.25;
    const accuracy = Math.max(
      15,
      Math.min(100, Math.round((rawScore / 0.65) * 88))
    );

    // Kid-Friendly Pass Criteria:
    // 1. Must cover at least 52% of the letter cells
    // 2. Both top and bottom halves (and left/right) must be visited with at least 28%
    // 3. Precision >= 52% (majority of strokes stay inside corridor)
    // 4. Stray ratio <= 28% (allows natural child hand wobbles)
    const isCoverageOk = coverage >= 0.52;
    const isPrecisionOk = precision >= 0.52;
    const isNotScribble = strayRatio <= 0.28;

    const isPassed = isCoverageOk && areZonesOk && isPrecisionOk && isNotScribble;

    if (!isPassed) {
      // FAILED - DO NOT ADVANCE!
      let msg = '';
      let speakPhrase = '';

      if (!isCoverageOk || !areZonesOk) {
        msg =
          language === 'hi'
            ? `गलत या अधूरी ट्रेसिंग! (${accuracy}% सही)। अक्षर ${displayLetter} के पूरे आकार को ध्यान से बनाइए!`
            : `Wrong or incomplete tracing! (${accuracy}% accuracy). Trace the entire shape of ${displayLetter}!`;
        speakPhrase =
          language === 'hi'
            ? `गलत ट्रेसिंग! अक्षर ${displayLetter} का पूरा आकार नहीं बना। दोबारा ध्यान से कोशिश कीजिए।`
            : `That was not correct for letter ${displayLetter}. Please trace all lines and curves carefully!`;
      } else {
        msg =
          language === 'hi'
            ? `लाइनों से बाहर चला गया (${accuracy}% सही)। बिंदीदार रेखाओं के ऊपर ध्यान से चलाइए!`
            : `Off the lines (${accuracy}% accuracy). Stay closely on the dotted lines of letter ${displayLetter}!`;
        speakPhrase =
          language === 'hi'
            ? `गलत ट्रेसिंग! बिंदी वाले अक्षर ${displayLetter} के ऊपर ध्यान से लिखिए।`
            : `That was off the lines. Please trace carefully over letter ${displayLetter} and try again!`;
      }

      setValidationResult({ status: 'incorrect', score: accuracy, message: msg });

      if (soundEnabled) {
        playSoundEffect('wrong');
        speakText(speakPhrase, { lang: language, pitch: 1.15 });
      }
      return;
    }

    // PASSED - SUCCESS! ONLY HERE DOES IT ADVANCE!
    const successMsg =
      language === 'hi'
        ? `शानदार! (${accuracy}% सही) ${selectedItem.letter}! ${selectedItem.letter} फॉर ${selectedItem.word1.word}! ${selectedItem.letter} फॉर ${selectedItem.word2.word}!`
        : `Great job! (${accuracy}% accuracy) ${selectedItem.letter}! ${selectedItem.letter} for ${selectedItem.word1.word}! ${selectedItem.letter} for ${selectedItem.word2.word}!`;

    setValidationResult({ status: 'success', score: accuracy, message: successMsg });

    // Confetti celebration
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
    });

    const advanceToNextLetter = () => {
      setTimeout(() => {
        const nextIdx = (currentIdx + 1) % alphabet.length;
        onSelectLetter(alphabet[nextIdx]);
        clearCanvas();
      }, 700);
    };

    if (soundEnabled) {
      playSoundEffect('success');
      const speakPhrase =
        language === 'hi'
          ? `शानदार! ${selectedItem.letter}! ${selectedItem.letter} फॉर ${selectedItem.word1.word}! ${selectedItem.letter} फॉर ${selectedItem.word2.word}!`
          : `Great job! ${selectedItem.letter}! ${selectedItem.letter} for ${selectedItem.word1.word}! ${selectedItem.letter} for ${selectedItem.word2.word}!`;

      speakText(speakPhrase, {
        lang: language,
        pitch: 1.2,
        rate: 0.88,
        onEnd: () => {
          advanceToNextLetter();
        },
      });
    } else {
      setTimeout(advanceToNextLetter, 2200);
    }
  };

  const handleSpeakGuideline = () => {
    if (soundEnabled) {
      playSoundEffect('soft-click');
      const tip = caseMode === 'upper' ? selectedItem.tracingTips.upper : selectedItem.tracingTips.lower;
      speakText(`How to trace ${displayLetter}: ${tip}`, { lang: 'en' });
    }
  };

  const currentIdx = alphabet.findIndex(a => a.letter === selectedItem.letter);

  const handlePrevLetter = () => {
    const prevIdx = (currentIdx - 1 + alphabet.length) % alphabet.length;
    onSelectLetter(alphabet[prevIdx]);
    if (soundEnabled) playSoundEffect('pop');
  };

  const handleNextLetter = () => {
    const nextIdx = (currentIdx + 1) % alphabet.length;
    onSelectLetter(alphabet[nextIdx]);
    if (soundEnabled) playSoundEffect('pop');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Letter Carousel Selector */}
      <div className="flex items-center justify-between gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-xs mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={handlePrevLetter}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {alphabet.map((item) => {
            const isSelected = item.letter === selectedItem.letter;
            return (
              <button
                key={item.letter}
                onClick={() => {
                  onSelectLetter(item);
                  if (soundEnabled) playSoundEffect('soft-click');
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-xs scale-105 ring-2 ring-rose-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.letter}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextLetter}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Canvas Area */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
          {/* Header row: Letter Case toggle & Actions */}
          <div className="w-full flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setCaseMode('upper')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  caseMode === 'upper'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {language === 'hi' ? `बड़ा अक्षर (${selectedItem.letter})` : `Uppercase (${selectedItem.letter})`}
              </button>
              <button
                onClick={() => setCaseMode('lower')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  caseMode === 'lower'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {language === 'hi' ? `छोटा अक्षर (${selectedItem.letter.toLowerCase()})` : `Lowercase (${selectedItem.letter.toLowerCase()})`}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Clear canvas"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'hi' ? 'मिटाएं' : 'Clear'}</span>
              </button>
            </div>
          </div>

          {/* Validation Feedback Banner */}
          {validationResult.status !== 'idle' && (
            <div
              className={`w-full mb-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border transition-all animate-in fade-in ${
                validationResult.status === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
                  : validationResult.status === 'incorrect'
                  ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {validationResult.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="flex-1">{validationResult.message}</span>
            </div>
          )}

          {/* Canvas Wrapper with Synchronized Dotted Letter Guide Background */}
          <div
            className={`relative w-full max-w-[360px] aspect-square rounded-2xl border-4 transition-all bg-white overflow-hidden shadow-inner flex items-center justify-center touch-none ${
              validationResult.status === 'incorrect'
                ? 'border-rose-500 bg-rose-50/20 ring-4 ring-rose-200'
                : validationResult.status === 'success'
                ? 'border-emerald-500 bg-emerald-50/20 ring-4 ring-emerald-200'
                : 'border-dashed border-slate-300'
            }`}
          >
            {/* Synchronized Guide Canvas: Renders Guidelines + Dotted Letter in Perfect Alignment */}
            <canvas
              ref={guideCanvasRef}
              width={360}
              height={360}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
            />

            {/* Interactive Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="relative z-10 w-full h-full cursor-crosshair"
            />
          </div>

          {/* Color & Brush Controls */}
          <div className="w-full mt-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'रंग चुनें' : 'Brush Color'}
              </span>
              <div className="flex items-center gap-2">
                {BRUSH_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setBrushColor(c.hex);
                      if (soundEnabled) playSoundEffect('soft-click');
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                      brushColor === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-slate-400 shadow-xs' : 'hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Brush Width Selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'मोटाई' : 'Pen Thickness'}
              </span>
              <div className="flex items-center gap-2">
                {[8, 14, 22].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushWidth(size)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      brushWidth === size
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {size === 8
                      ? language === 'hi' ? 'पतली' : 'Fine'
                      : size === 14
                      ? language === 'hi' ? 'मध्यम' : 'Medium'
                      : language === 'hi' ? 'मोटी' : 'Thick'}
                  </button>
                ))}
              </div>
            </div>

            {/* Check It Action Button */}
            <button
              onClick={handleValidateTracing}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-display font-bold text-base rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{language === 'hi' ? 'चेक करें कि सही लिखा या नहीं ⭐' : 'Check My Tracing ⭐'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Letter Guide & Pronunciation */}
        <div className="md:col-span-4 space-y-4">
          {/* Guide Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-lg text-slate-900">
                {language === 'hi' ? `कैसे लिखें ${displayLetter}` : `How to Write ${displayLetter}`}
              </span>
              <button
                onClick={handleSpeakGuideline}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Read instructions"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {caseMode === 'upper' ? selectedItem.tracingTips.upper : selectedItem.tracingTips.lower}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              💡 <strong>{language === 'hi' ? 'टिप:' : 'Tip:'}</strong> {language === 'hi' ? 'बिंदी वाली लाइन के ऊपर-ऊपर उंगली या पेंसिल चलाएं।' : 'Trace directly inside the dotted letter lines.'}
            </div>
          </div>

          {/* Phonics Words Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-500 mb-3">
              {language === 'hi' ? `शब्द जो ${selectedItem.letter} से शुरू होते हैं` : `Words Starting With ${selectedItem.letter}`}
            </h4>
            <div className="space-y-3">
              <div
                onClick={() => {
                  if (soundEnabled) {
                    const text = language === 'hi' ? `${selectedItem.letter} फॉर ${selectedItem.word1.word}, यानी ${selectedItem.word1.hindiWord}` : `${selectedItem.letter} is for ${selectedItem.word1.word}!`;
                    speakText(text, { lang: language });
                  }
                }}
                className="flex items-center gap-3 p-3 bg-rose-50/70 hover:bg-rose-50 rounded-2xl border border-rose-200/80 cursor-pointer transition-colors"
              >
                <span className="text-3xl">{selectedItem.word1.emoji}</span>
                <div>
                  <div className="font-display font-bold text-slate-900 text-base">
                    {selectedItem.word1.word} {language === 'hi' ? `(${selectedItem.word1.hindiWord})` : ''}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'hi' ? selectedItem.word1.hindiCategory : selectedItem.word1.category}
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  if (soundEnabled) {
                    const text = language === 'hi' ? `${selectedItem.letter} फॉर ${selectedItem.word2.word}, यानी ${selectedItem.word2.hindiWord}` : `${selectedItem.letter} is for ${selectedItem.word2.word}!`;
                    speakText(text, { lang: language });
                  }
                }}
                className="flex items-center gap-3 p-3 bg-blue-50/70 hover:bg-blue-50 rounded-2xl border border-blue-200/80 cursor-pointer transition-colors"
              >
                <span className="text-3xl">{selectedItem.word2.emoji}</span>
                <div>
                  <div className="font-display font-bold text-slate-900 text-base">
                    {selectedItem.word2.word} {language === 'hi' ? `(${selectedItem.word2.hindiWord})` : ''}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'hi' ? selectedItem.word2.hindiCategory : selectedItem.word2.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
