import React, { useState, useMemo } from 'react';
import { ALPHABET_DATA } from './data/alphabetData';
import { AlphabetItem } from './types/alphabet';
import { Header } from './components/Header';
import { LetterCard } from './components/LetterCard';
import { LetterDetailModal } from './components/LetterDetailModal';
import { TracingCanvas } from './components/TracingCanvas';
import { SpellingGame } from './components/SpellingGame';
import { PhonicsQuiz } from './components/PhonicsQuiz';
import { SingAlongPlayer } from './components/SingAlongPlayer';
import { InstallPromptModal } from './components/InstallPromptModal';
import { CountingView } from './components/CountingView';
import { ColorsView } from './components/ColorsView';
import { ShapesView } from './components/ShapesView';
import { ChildProfileModal } from './components/ChildProfileModal';
import { ChildProfile, ChildClassStandard, STANDARDS_INFO } from './types/profile';
import { Search, Volume2, Sparkles, Music, Download, Hash, Palette, Shapes } from 'lucide-react';
import { playSoundEffect, speakText } from './utils/audio';
import { AppTab } from './components/Header';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('explore');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedLetterForDetail, setSelectedLetterForDetail] = useState<AlphabetItem | null>(null);
  const [selectedLetterForTracing, setSelectedLetterForTracing] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [showSingAlong, setShowSingAlong] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Child Profile & Onboarding State
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kid_learner_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [showProfileModal, setShowProfileModal] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kid_learner_profile');
      return !saved; // If first time launch, open immediately!
    } catch (e) {
      return true;
    }
  });

  // Search & Filters for Explore view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vowels' | 'consonants' | 'animals' | 'food'>('all');

  const vowels = ['A', 'E', 'I', 'O', 'U'];

  const filteredAlphabet = useMemo(() => {
    return ALPHABET_DATA.filter((item) => {
      // Filter by type
      if (selectedFilter === 'vowels' && !vowels.includes(item.letter)) return false;
      if (selectedFilter === 'consonants' && vowels.includes(item.letter)) return false;
      if (selectedFilter === 'animals') {
        const isAnimal =
          item.word1.category.toLowerCase().includes('animal') ||
          item.word1.category.toLowerCase().includes('bird') ||
          item.word1.category.toLowerCase().includes('insect') ||
          item.word1.category.toLowerCase().includes('pet') ||
          item.word1.category.toLowerCase().includes('amphibian') ||
          item.word2.category.toLowerCase().includes('animal') ||
          item.word2.category.toLowerCase().includes('bird') ||
          item.word2.category.toLowerCase().includes('insect') ||
          item.word2.category.toLowerCase().includes('pet') ||
          item.word2.category.toLowerCase().includes('amphibian');
        if (!isAnimal) return false;
      }
      if (selectedFilter === 'food') {
        const isFood =
          item.word1.category.toLowerCase().includes('fruit') ||
          item.word1.category.toLowerCase().includes('treat') ||
          item.word1.category.toLowerCase().includes('drink') ||
          item.word2.category.toLowerCase().includes('fruit') ||
          item.word2.category.toLowerCase().includes('treat') ||
          item.word2.category.toLowerCase().includes('drink');
        if (!isFood) return false;
      }

      // Search query supports both English and Hindi text
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.letter.toLowerCase() === q ||
        item.word1.word.toLowerCase().includes(q) ||
        item.word2.word.toLowerCase().includes(q) ||
        item.word1.hindiWord.toLowerCase().includes(q) ||
        item.word2.hindiWord.toLowerCase().includes(q) ||
        item.word1.category.toLowerCase().includes(q) ||
        item.word2.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedFilter]);

  const handleOpenTracing = (item: AlphabetItem) => {
    setSelectedLetterForTracing(item);
    setCurrentTab('tracing');
  };

  const handlePrevDetail = () => {
    if (!selectedLetterForDetail) return;
    const currentIdx = ALPHABET_DATA.findIndex(a => a.letter === selectedLetterForDetail.letter);
    const prevIdx = (currentIdx - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    setSelectedLetterForDetail(ALPHABET_DATA[prevIdx]);
    if (soundEnabled) playSoundEffect('pop');
  };

  const handleNextDetail = () => {
    if (!selectedLetterForDetail) return;
    const currentIdx = ALPHABET_DATA.findIndex(a => a.letter === selectedLetterForDetail.letter);
    const nextIdx = (currentIdx + 1) % ALPHABET_DATA.length;
    setSelectedLetterForDetail(ALPHABET_DATA[nextIdx]);
    if (soundEnabled) playSoundEffect('pop');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
    if (soundEnabled) {
      playSoundEffect('pop');
      if (nextLang === 'hi') {
        speakText('भाषा हिंदी चुनी गई है।', { lang: 'hi' });
      } else {
        speakText('Language switched to English.', { lang: 'en' });
      }
    }
  };

  const handleSaveProfile = (profile: ChildProfile) => {
    setChildProfile(profile);
    try {
      localStorage.setItem('kid_learner_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    setShowProfileModal(false);
  };

  const handleAddStars = (count: number) => {
    setChildProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, stars: (prev.stars || 0) + count };
      try {
        localStorage.setItem('kid_learner_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleCompleteLevel = (level: number) => {
    setChildProfile((prev) => {
      if (!prev) return prev;
      const completed = prev.completedLevels || [];
      if (!completed.includes(level)) {
        const updated = {
          ...prev,
          completedLevels: [...completed, level],
          stars: (prev.stars || 0) + 5,
        };
        try {
          localStorage.setItem('kid_learner_profile', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={toggleLanguage}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          if (next) playSoundEffect('pop');
        }}
        onStartSingAlong={() => setShowSingAlong(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        childProfile={childProfile}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 sm:p-10 text-white shadow-md overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                {/* Child Personalized Greeting if registered */}
                {childProfile && (
                  <div
                    onClick={() => setShowProfileModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-xs font-black text-white mb-3 shadow-xs cursor-pointer border border-white/25 transition-all"
                    title={language === 'hi' ? 'प्रोफ़ाइल या क्लास बदलें' : 'Change Profile or Class'}
                  >
                    <span className="text-lg">{childProfile.avatar}</span>
                    <span>
                      {language === 'hi'
                        ? `नमस्ते ${childProfile.name}! (${STANDARDS_INFO[childProfile.standard].titleHi})`
                        : `Welcome ${childProfile.name}! (${STANDARDS_INFO[childProfile.standard].titleEn})`}
                    </span>
                    <span>·</span>
                    <span className="text-amber-200">{childProfile.stars} ⭐</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-white mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi'
                      ? 'हर अक्षर के 2 शब्द (अंग्रेजी व हिंदी में)'
                      : 'Learn Every Letter With Two Words!'}
                  </span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-tight mb-3">
                  {language === 'hi'
                    ? 'A से Z वर्णमाला और १ से १०० गिनती'
                    : 'A to Z Phonics & 1-100 Counting'}
                </h1>
                <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed max-w-xl mb-6">
                  {language === 'hi'
                    ? 'किसी भी कार्ड पर क्लिक करके अंग्रेजी और हिंदी में आवाज़ सुनें, 1 से 100 तक गिनती सीखें, और लिखना सीखें!'
                    : 'Click any letter card to hear the sound in English and Hindi, learn 1 to 100 counting, practice letter tracing, or sing along!'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCurrentTab('counting')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Hash className="w-4 h-4" />
                    <span>{language === 'hi' ? '1 से 100 गिनती सीखें' : '1 to 100 Counting'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('colors')}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-display font-bold text-sm rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Palette className="w-4 h-4" />
                    <span>{language === 'hi' ? 'रंग सीखें 🎨' : 'Learn Colors 🎨'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('shapes')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Shapes className="w-4 h-4" />
                    <span>{language === 'hi' ? 'आकार सीखें 📐' : 'Learn Shapes 📐'}</span>
                  </button>

                  <button
                    onClick={() => setShowSingAlong(true)}
                    className="px-5 py-2.5 bg-white text-rose-600 hover:bg-rose-50 font-display font-bold text-sm rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Music className="w-4 h-4 text-rose-500" />
                    <span>{language === 'hi' ? 'A-Z कविता सुनें' : 'Play Sing-Along Song'}</span>
                  </button>

                  <button
                    onClick={() => setShowInstallModal(true)}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-display font-bold text-sm rounded-xl border border-white/30 backdrop-blur-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'hi' ? 'ऐप डाउनलोड करें' : 'Download / Install App'}</span>
                  </button>
                </div>
              </div>

              {/* Decorative floating letter badges */}
              <div
                aria-hidden="true"
                className="absolute right-4 bottom-2 sm:right-12 sm:bottom-4 flex items-center gap-2 opacity-30 select-none text-8xl sm:text-9xl font-display font-black"
              >
                🍎 🐱 🦁
              </div>
            </div>

            {/* Quick Letter Jump Strip (A to Z) */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                <span>{language === 'hi' ? 'अक्षर चुनें (A से Z)' : 'Quick Jump To Letter'}</span>
                <span>{language === 'hi' ? '26 अक्षर · 52 शब्द · हिंदी अर्थ' : '26 Letters · 52 Pre-K Sight Words'}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {ALPHABET_DATA.map((item) => (
                  <button
                    key={item.letter}
                    onClick={() => {
                      setSelectedLetterForDetail(item);
                      if (soundEnabled) {
                        playSoundEffect('soft-click');
                        const text = language === 'hi'
                          ? `${item.letter}! ${item.letter} फॉर ${item.word1.word}, यानी ${item.word1.hindiWord}!`
                          : `${item.letter}! ${item.letter} for ${item.word1.word}!`;
                        speakText(text, { lang: language === 'hi' ? 'hi' : 'en' });
                      }
                    }}
                    className="w-8 h-9 sm:w-9 sm:h-10 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-display font-bold text-sm sm:text-base border border-slate-200 hover:border-rose-300 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                  >
                    {item.letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: language === 'hi' ? 'सभी 26 अक्षर' : 'All Letters' },
                  { id: 'vowels', label: language === 'hi' ? 'स्वर (A, E, I, O, U)' : 'Vowels' },
                  { id: 'consonants', label: language === 'hi' ? 'व्यंजन' : 'Consonants' },
                  { id: 'animals', label: language === 'hi' ? 'जानवर व पक्षी' : 'Animals' },
                  { id: 'food', label: language === 'hi' ? 'फल व भोजन' : 'Food & Fruits' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFilter(f.id as typeof selectedFilter);
                      if (soundEnabled) playSoundEffect('soft-click');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedFilter === f.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'अक्षर या शब्द खोजें (जैसे सेब, Cat)...' : 'Search letter or word (e.g. Apple)...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400 shadow-xs"
                />
              </div>
            </div>

            {/* Letter Cards Grid */}
            {filteredAlphabet.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredAlphabet.map((item) => (
                  <LetterCard
                    key={item.letter}
                    item={item}
                    soundEnabled={soundEnabled}
                    language={language}
                    onOpenTracing={handleOpenTracing}
                    onInspect={setSelectedLetterForDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                  {language === 'hi' ? `"${searchQuery}" से कोई शब्द नहीं मिला` : `No letters matched "${searchQuery}"`}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {language === 'hi' ? 'कोई अन्य शब्द या अक्षर खोज कर देखें।' : 'Try searching for another letter or clear the filter.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === 'hi' ? 'सभी अक्षर दिखाएं' : 'Reset Filters'}
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'counting' && (
          <CountingView
            language={language}
            soundEnabled={soundEnabled}
          />
        )}

        {(currentTab === 'colors' || currentTab === 'colors-shapes') && (
          <ColorsView
            language={language}
            soundEnabled={soundEnabled}
          />
        )}

        {currentTab === 'shapes' && (
          <ShapesView
            language={language}
            soundEnabled={soundEnabled}
          />
        )}

        {currentTab === 'tracing' && (
          <TracingCanvas
            alphabet={ALPHABET_DATA}
            selectedItem={selectedLetterForTracing}
            onSelectLetter={setSelectedLetterForTracing}
            soundEnabled={soundEnabled}
            language={language}
          />
        )}

        {currentTab === 'spelling' && (
          <SpellingGame
            alphabet={ALPHABET_DATA}
            soundEnabled={soundEnabled}
          />
        )}

        {currentTab === 'quiz' && (
          <PhonicsQuiz
            alphabet={ALPHABET_DATA}
            soundEnabled={soundEnabled}
            language={language}
            childProfile={childProfile}
            onAddStars={handleAddStars}
            onCompleteLevel={handleCompleteLevel}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}
      </main>

      {/* Deep Letter Inspection Modal */}
      <LetterDetailModal
        item={selectedLetterForDetail}
        language={language}
        onClose={() => setSelectedLetterForDetail(null)}
        onPrev={handlePrevDetail}
        onNext={handleNextDetail}
        onOpenTracing={(item) => {
          setSelectedLetterForDetail(null);
          handleOpenTracing(item);
        }}
        soundEnabled={soundEnabled}
      />

      {/* Sing-Along Modal */}
      {showSingAlong && (
        <SingAlongPlayer
          alphabet={ALPHABET_DATA}
          language={language}
          onClose={() => setShowSingAlong(false)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Download & Install Modal */}
      <InstallPromptModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Child Learner Profile & Onboarding Modal */}
      <ChildProfileModal
        isOpen={showProfileModal}
        isFirstTime={!childProfile}
        currentProfile={childProfile}
        onSaveProfile={handleSaveProfile}
        onClose={() => setShowProfileModal(false)}
        language={language}
        soundEnabled={soundEnabled}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">LittleLearners ABC</span>
            <span>·</span>
            <span>{language === 'hi' ? '26 अक्षर · 1-100 गिनती · रंग और आकार' : 'Pre-K & Kindergarten Phonics · 1-100 Counting · Colors & Shapes'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'A-Z अक्षर' : 'Explore A-Z'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('counting');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'गिनती 1-100' : 'Counting 1-100'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('colors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'रंग सीखें 🎨' : 'Colors 🎨'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('shapes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'आकार सीखें 📐' : 'Shapes 📐'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('tracing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'लिखना सीखें' : 'Tracing Pad'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('spelling');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'स्पेलिंग खेल' : 'Spelling Bee'}
            </button>
            <button
              onClick={() => {
                setCurrentTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'क्विज़' : 'Phonics Quiz'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
