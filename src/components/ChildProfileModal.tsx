import React, { useState } from 'react';
import {
  ChildProfile,
  ChildClassStandard,
  STANDARDS_INFO,
  AVATAR_OPTIONS,
} from '../types/profile';
import { playSoundEffect, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  X,
  User,
  GraduationCap,
  Calendar,
  Smile,
} from 'lucide-react';

interface ChildProfileModalProps {
  isOpen: boolean;
  isFirstTime?: boolean;
  currentProfile: ChildProfile | null;
  onSaveProfile: (profile: ChildProfile) => void;
  onClose?: () => void;
  language: 'en' | 'hi';
  soundEnabled: boolean;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  isFirstTime = false,
  currentProfile,
  onSaveProfile,
  onClose,
  language,
  soundEnabled,
}) => {
  const [name, setName] = useState(currentProfile?.name || '');
  const [age, setAge] = useState<number>(currentProfile?.age || 4);
  const [standard, setStandard] = useState<ChildClassStandard>(
    currentProfile?.standard || 'lkg'
  );
  const [avatar, setAvatar] = useState(currentProfile?.avatar || '🦁');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      const msg =
        language === 'hi'
          ? 'कृपया बच्चे का नाम दर्ज कीजिए!'
          : 'Please enter child’s name!';
      setErrorMsg(msg);
      if (soundEnabled) {
        playSoundEffect('wrong');
        speakText(msg, { lang: language });
      }
      return;
    }

    const updatedProfile: ChildProfile = {
      name: trimmedName,
      age,
      standard,
      avatar,
      stars: currentProfile?.stars || 0,
      completedLevels: currentProfile?.completedLevels || [],
      createdAt: currentProfile?.createdAt || new Date().toISOString(),
    };

    onSaveProfile(updatedProfile);

    if (soundEnabled) {
      playSoundEffect('success');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      const welcomePhrase =
        language === 'hi'
          ? `नमस्ते ${trimmedName}! आपकी क्लास ${STANDARDS_INFO[standard].titleHi} के अनुसार पढ़ाई और खेल शुरू करते हैं!`
          : `Welcome ${trimmedName}! Your fun learning journey for ${STANDARDS_INFO[standard].titleEn} is ready!`;

      speakText(welcomePhrase, { lang: language, pitch: 1.2 });
    }
  };

  const handleStandardSelect = (std: ChildClassStandard) => {
    setStandard(std);
    if (soundEnabled) {
      playSoundEffect('soft-click');
      const stdName =
        language === 'hi'
          ? STANDARDS_INFO[std].titleHi
          : STANDARDS_INFO[std].titleEn;
      speakText(stdName, { lang: language });
    }
  };

  const ageList = [2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden my-6">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 p-6 text-white text-center relative">
          {!isFirstTime && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-inner mb-2 border border-white/30">
            {avatar}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
            {isFirstTime
              ? language === 'hi'
                ? 'नमस्ते नन्हे दोस्त! 🌟'
                : 'Welcome Little Explorer! 🌟'
              : language === 'hi'
              ? 'विद्यार्थी प्रोफ़ाइल'
              : 'Student Profile'}
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-md mx-auto font-medium">
            {isFirstTime
              ? language === 'hi'
                ? 'अपना नाम, उम्र और क्लास चुनें ताकि हम आपकी पढ़ाई को आपके अनुसार बना सकें!'
                : 'Tell us your name, age & class so we can tailor the quiz and lessons just for you!'
              : language === 'hi'
              ? 'अपनी जानकारी और क्लास कभी भी बदल सकते हैं।'
              : 'Update your child’s learning profile and grade level anytime.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Child's Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-500" />
              <span>{language === 'hi' ? 'बच्चे का नाम (Child’s Name):' : 'Child’s Name:'}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={language === 'hi' ? 'जैसे: आरव, अनन्य, कबीर...' : 'e.g. Aarav, Maya, Leo...'}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base sm:text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all shadow-inner"
                autoFocus={isFirstTime}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl select-none">
                ✨
              </span>
            </div>
          </div>

          {/* Section 2: Choose Mascot Avatar */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'पसंदीदा अवतार चुनें (Choose Mascot):' : 'Choose Mascot Avatar:'}</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = avatar === opt.emoji;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAvatar(opt.emoji);
                      if (soundEnabled) playSoundEffect('pop');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-2xl transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 shadow-md scale-110 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                    title={language === 'hi' ? opt.nameHi : opt.nameEn}
                  >
                    <span>{opt.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Child's Age */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{language === 'hi' ? 'उम्र (Age):' : 'Age:'}</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {ageList.map((a) => {
                const isSelected = age === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAge(a);
                      if (soundEnabled) playSoundEffect('soft-click');
                    }}
                    className={`flex-1 min-w-[42px] py-2.5 rounded-xl border-2 font-display font-black text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {a} {language === 'hi' ? 'वर्ष' : 'yr'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Class / Standard (Most Important!) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'कक्षा / स्तर (Class / Standard):' : 'Class / Standard:'}</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                {language === 'hi' ? 'इसके अनुसार क्विज़ व सबक चलेंगे' : 'Customizes Quiz & Lessons'}
              </span>
            </label>

            <div className="space-y-2.5">
              {(Object.keys(STANDARDS_INFO) as ChildClassStandard[]).map((key) => {
                const info = STANDARDS_INFO[key];
                const isSelected = standard === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleStandardSelect(key)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-200 scale-101'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-sm sm:text-base text-slate-900">
                            {language === 'hi' ? info.titleHi : info.titleEn}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {info.ageRange}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 font-medium">
                          {language === 'hi' ? info.summaryHi : info.summaryEn}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                        Level {info.recommendedQuizLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stars & Achievements Badge (If not first time) */}
          {!isFirstTime && currentProfile && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    {language === 'hi' ? 'कुल अर्जित उपलब्धियां' : 'Achievements'}
                  </div>
                  <div className="font-display font-black text-sm text-amber-950">
                    {currentProfile.stars} ⭐ Stars · {currentProfile.completedLevels.length} 🏆 Levels Mastered
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 hover:opacity-95 active:scale-98 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>
                {isFirstTime
                  ? language === 'hi'
                    ? 'चलो पढ़ाई और खेल शुरू करें! 🚀'
                    : 'Start Learning Adventure! 🚀'
                  : language === 'hi'
                  ? 'प्रोफ़ाइल सुरक्षित करें'
                  : 'Save Profile Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
