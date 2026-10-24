export type ChildClassStandard = 'nursery' | 'lkg' | 'ukg' | 'class1' | 'class2';

export interface ChildProfile {
  name: string;
  age: number;
  standard: ChildClassStandard;
  avatar: string; // emoji or avatar key
  stars: number;
  completedLevels: number[];
  createdAt: string;
}

export interface StandardInfo {
  id: ChildClassStandard;
  titleEn: string;
  titleHi: string;
  ageRange: string;
  badgeColor: string;
  recommendedQuizLevel: number; // 1, 2, 3, or 4
  defaultCountingRange: '1-10' | '1-20' | '1-30' | '1-50' | '1-100';
  summaryEn: string;
  summaryHi: string;
}

export const STANDARDS_INFO: Record<ChildClassStandard, StandardInfo> = {
  nursery: {
    id: 'nursery',
    titleEn: 'Preschool (Toddlers)',
    titleHi: 'नर्सरी / प्लेग्रुप',
    ageRange: '2 - 3 Years',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    recommendedQuizLevel: 1,
    defaultCountingRange: '1-10',
    summaryEn: 'Simple letter recognition, big illustrations, 1-10 counting, primary colors',
    summaryHi: 'अक्षर पहचान, बड़े चित्र, १ से १० तक गिनती, प्राथमिक रंग',
  },
  lkg: {
    id: 'lkg',
    titleEn: 'Pre-K (Pre-Kindergarten)',
    titleHi: 'एल.के.जी. (LKG)',
    ageRange: '3 - 4 Years',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    recommendedQuizLevel: 1,
    defaultCountingRange: '1-20',
    summaryEn: 'A-Z phonics sounds, 1-20 counting, vibrant colors, and basic shapes',
    summaryHi: 'A-Z ध्वनियाँ, १ से २० गिनती, सभी रंग और बुनियादी आकार',
  },
  ukg: {
    id: 'ukg',
    titleEn: 'Kindergarten',
    titleHi: 'यू.के.जी. (UKG)',
    ageRange: '4 - 5 Years',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recommendedQuizLevel: 2,
    defaultCountingRange: '1-50',
    summaryEn: '3-letter sight words (CAT, DOG), 1-50 counting, shape geometry, spelling',
    summaryHi: '३-अक्षर शब्द, १ से ५० गिनती, आकृतियों के कोने व भुजाएँ, वर्तनी',
  },
  class1: {
    id: 'class1',
    titleEn: '1st Grade',
    titleHi: 'कक्षा १ (Class 1)',
    ageRange: '5 - 6 Years',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    recommendedQuizLevel: 3,
    defaultCountingRange: '1-100',
    summaryEn: 'Full 1-100 numbers, vocabulary spelling, shape geometry, fun quizzes',
    summaryHi: 'पूरी १ से १०० तक गिनती, शब्दावली वर्तनी, ज्यामिति और क्विज़',
  },
  class2: {
    id: 'class2',
    titleEn: '2nd Grade',
    titleHi: 'कक्षा २ (Class 2)',
    ageRange: '6 - 8 Years',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    recommendedQuizLevel: 4,
    defaultCountingRange: '1-100',
    summaryEn: 'Spelling Bee master, number sequences, color mixing lab, full quiz levels',
    summaryHi: 'स्पेलिंग बी मास्टर, संख्या क्रम, रंग विज्ञान और एडवांस्ड क्विज़',
  },
};

export const AVATAR_OPTIONS = [
  { id: 'lion', emoji: '🦁', nameEn: 'Lion', nameHi: 'शेर' },
  { id: 'panda', emoji: '🐼', nameEn: 'Panda', nameHi: 'पांडा' },
  { id: 'elephant', emoji: '🐘', nameEn: 'Elephant', nameHi: 'हाथी' },
  { id: 'bunny', emoji: '🐰', nameEn: 'Bunny', nameHi: 'खरगोश' },
  { id: 'kitty', emoji: '🐱', nameEn: 'Kitty', nameHi: 'बिल्ली' },
  { id: 'tiger', emoji: '🐯', nameEn: 'Tiger', nameHi: 'बाघ' },
  { id: 'astronaut', emoji: '🚀', nameEn: 'Rocket Kid', nameHi: 'रॉकेट' },
  { id: 'unicorn', emoji: '🦄', nameEn: 'Unicorn', nameHi: 'यूनिकॉर्न' },
];
