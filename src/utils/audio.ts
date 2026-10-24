// Web Audio API Synthesizer & Speech Synthesis Utility

let audioCtx: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSoundEffect(type: 'pop' | 'success' | 'star' | 'chime' | 'soft-click' | 'cheer' | 'wrong') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'pop' || type === 'soft-click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'pop' ? 440 : 600, now);
      osc.frequency.exponentialRampToValueAtTime(type === 'pop' ? 880 : 300, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'chime') {
      // Gentle marimba chord
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.45);
      });
    } else if (type === 'star') {
      // Twinkle glissando
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } else if (type === 'success' || type === 'cheer') {
      // Fanfare notes: C5, E5, G5, C6
      const fanfare = [523.25, 659.25, 783.99, 1046.50];
      fanfare.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + (i === 3 ? 0.6 : 0.25));

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + (i === 3 ? 0.65 : 0.3));
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (err) {
    console.warn('Audio effect error:', err);
  }
}

// Find the cleanest, sweetest, most kid-friendly female voice
function getBestFemaleVoice(lang: 'en' | 'hi'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'hi') {
    // Clear Hindi Female voice candidates (Swara, Kalpana, Google Hindi, Lekha)
    const hindiVoices = voices.filter(v => v.lang.startsWith('hi') || v.lang.includes('Hindi'));
    const preferredHindi =
      hindiVoices.find(v => v.name.toLowerCase().includes('swara')) ||
      hindiVoices.find(v => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural')) ||
      hindiVoices.find(v => v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('lekha')) ||
      hindiVoices[0];

    if (preferredHindi) return preferredHindi;
    return voices.find(v => v.lang.startsWith('hi')) || null;
  }

  // English Kid-Friendly Female Voice Hierarchy
  // 1. Natural female neural voices (Jenny, Aria, Sonia)
  // 2. Samantha (macOS/iOS cheerful, bright female teacher)
  // 3. Google US English (female) or Google UK English Female
  // 4. Karen, Victoria, Zira, Tessa
  const femaleKeywords = [
    'natural',
    'jenny',
    'aria',
    'samantha',
    'google us english',
    'google uk english female',
    'karen',
    'victoria',
    'tessa',
    'zira',
    'moira',
    'fiona',
    'allison',
    'ava',
    'susan',
    'female',
  ];

  const enVoices = voices.filter(v => v.lang.startsWith('en'));

  for (const keyword of femaleKeywords) {
    const match = enVoices.find(v => v.name.toLowerCase().includes(keyword));
    if (match) return match;
  }

  // Fallback to any English voice
  return enVoices[0] || voices[0] || null;
}

// Spoken Voice with Web Speech Synthesis (Clear, warm, kid-friendly female tone)
export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    lang?: 'en' | 'hi';
    onEnd?: () => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Kid-Friendly Vocal Settings:
  // - Slightly higher pitch (1.18) gives a warm, enthusiastic, sweet teacher/storyteller tone
  // - Slightly slower rate (0.88) provides crystal-clear vowel and consonant enunciation
  utterance.pitch = options?.pitch ?? 1.18;
  utterance.rate = options?.rate ?? 0.88;
  utterance.volume = 1.0;

  const targetLang = options?.lang === 'hi' ? 'hi' : 'en';
  utterance.lang = targetLang === 'hi' ? 'hi-IN' : 'en-US';

  const femaleVoice = getBestFemaleVoice(targetLang);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  if (options?.onEnd) {
    utterance.onend = () => {
      options.onEnd?.();
    };
    utterance.onerror = () => {
      options.onEnd?.();
    };
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
