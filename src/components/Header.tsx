import React from 'react';
import { Volume2, VolumeX, Sparkles, Music, Download, Languages, Hash, User } from 'lucide-react';
import { ChildProfile, STANDARDS_INFO } from '../types/profile';

export type AppTab = 'explore' | 'counting' | 'colors' | 'shapes' | 'tracing' | 'spelling' | 'quiz' | 'colors-shapes';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartSingAlong: () => void;
  onOpenInstall: () => void;
  childProfile: ChildProfile | null;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  onStartSingAlong,
  onOpenInstall,
  childProfile,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('explore')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                Aa
              </div>
              <div>
                <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight whitespace-nowrap block leading-tight">
                  LittleLearners <span className="text-rose-600">ABC</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {language === 'hi' ? 'प्री-स्कूल वर्णमाला, गिनती, रंग और आकार' : 'Pre-K Phonics, Counting, Colors & Shapes'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => onSelectTab('explore')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'explore'
                  ? 'bg-rose-50 text-rose-700 shadow-xs ring-1 ring-rose-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'A-Z अक्षर' : 'A-Z Letters'}
            </button>

            <button
              onClick={() => onSelectTab('counting')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'counting'
                  ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'गिनती 1-100' : 'Counting 1-100'}
            </button>

            <button
              onClick={() => onSelectTab('colors')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'colors'
                  ? 'bg-rose-50 text-rose-700 shadow-xs ring-1 ring-rose-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'रंग सीखें 🎨' : 'Colors 🎨'}
            </button>

            <button
              onClick={() => onSelectTab('shapes')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'shapes'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'आकार सीखें 📐' : 'Shapes 📐'}
            </button>

            <button
              onClick={() => onSelectTab('tracing')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'tracing'
                  ? 'bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'लिखना सीखें' : 'Tracing Pad'}
            </button>

            <button
              onClick={() => onSelectTab('spelling')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'spelling'
                  ? 'bg-amber-50 text-amber-700 shadow-xs ring-1 ring-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'स्पेलिंग खेल' : 'Spelling Bee'}
            </button>

            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'quiz'
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'क्विज़' : 'Quiz'}
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Segmented Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => {
                  if (language !== 'en') onToggleLanguage();
                }}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                onClick={() => {
                  if (language !== 'hi') onToggleLanguage();
                }}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="हिंदी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Child Learner Profile Pill */}
            {childProfile ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-all cursor-pointer shadow-xs group"
                title={language === 'hi' ? 'विद्यार्थी प्रोफ़ाइल व क्लास' : 'Learner Profile & Class'}
              >
                <span className="text-xl group-hover:scale-115 transition-transform">{childProfile.avatar}</span>
                <div className="text-left hidden sm:block leading-none">
                  <span className="font-display font-black text-xs text-slate-800 block truncate max-w-[85px]">
                    {childProfile.name}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase">
                    {STANDARDS_INFO[childProfile.standard]?.titleEn.split(' ')[0] || childProfile.standard}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
              </button>
            )}

            <button
              onClick={onOpenInstall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Download APK & Install App"
            >
              <Download className="w-4 h-4 text-rose-600" />
              <span>{language === 'hi' ? 'APK / इंस्टॉल' : 'APK / Install'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            <button
              onClick={onStartSingAlong}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-600 hover:to-pink-600 shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Music className="w-4 h-4" />
              <span>{language === 'hi' ? 'A-Z कविता' : 'Sing Along'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
