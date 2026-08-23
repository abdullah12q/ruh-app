import { BookOpen, Scroll, Star } from "lucide-react";

export const HADITH_COLLECTIONS = {
  NINE_BOOKS: "the9Books",
  FORTIES: "forties",
  OTHER: "otherBooks",
};

export const HADITH_BOOKS = [
  // The 9 Books
  {
    id: 1,
    slug: "bukhari",
    filename: "bukhari.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "صحيح البخاري",
    englishTitle: "Sahih al-Bukhari",
    author: "Imam Muhammad ibn Ismail al-Bukhari",
    length: 7277,
  },
  {
    id: 2,
    slug: "muslim",
    filename: "muslim.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "صحيح مسلم",
    englishTitle: "Sahih Muslim",
    author: "Imam Muslim ibn al-Hajjaj",
    length: 7563,
  },
  {
    id: 3,
    slug: "tirmidhi",
    filename: "tirmidhi.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "جامع الترمذي",
    englishTitle: "Jami at-Tirmidhi",
    author: "Imam Muhammad ibn Isa at-Tirmidhi",
    length: 3956,
  },
  {
    id: 4,
    slug: "abudawud",
    filename: "abudawud.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "سنن أبي داود",
    englishTitle: "Sunan Abi Dawud",
    author: "Imam Abu Dawud Sulayman ibn al-Ash'ath",
    length: 5274,
  },
  {
    id: 5,
    slug: "nasai",
    filename: "nasai.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "سنن النسائي",
    englishTitle: "Sunan an-Nasa'i",
    author: "Imam Ahmad ibn Shu'ayb an-Nasa'i",
    length: 5761,
  },
  {
    id: 6,
    slug: "ibnmajah",
    filename: "ibnmajah.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "سنن ابن ماجة",
    englishTitle: "Sunan Ibn Majah",
    author: "Imam Muhammad ibn Yazid Ibn Majah",
    length: 4341,
  },
  {
    id: 7,
    slug: "malik",
    filename: "malik.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "موطأ مالك",
    englishTitle: "Muwatta Malik",
    author: "Imam Malik ibn Anas",
    length: 1857,
  },
  {
    id: 8,
    slug: "ahmed",
    filename: "ahmed.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "مسند أحمد",
    englishTitle: "Musnad Ahmad",
    author: "Imam Ahmad ibn Hanbal",
    length: 4305,
  },
  {
    id: 9,
    slug: "darimi",
    filename: "darimi.json",
    collection: HADITH_COLLECTIONS.NINE_BOOKS,
    collectionLabel: "The 9 Books",
    color: "teal",
    arabicTitle: "سنن الدارمي",
    englishTitle: "Sunan ad-Darimi",
    author: "Imam Abdullah ibn Abd ar-Rahman ad-Darimi",
    length: 3564,
  },

  // Forties
  {
    id: 10,
    slug: "nawawi40",
    filename: "nawawi40.json",
    collection: HADITH_COLLECTIONS.FORTIES,
    collectionLabel: "Forties",
    color: "amber",
    arabicTitle: "الأربعون النووية",
    englishTitle: "The Forty Hadith of Imam Nawawi",
    author: "Imam Yahya ibn Sharaf al-Nawawi",
    length: 42,
  },
  {
    id: 11,
    slug: "qudsi40",
    filename: "qudsi40.json",
    collection: HADITH_COLLECTIONS.FORTIES,
    collectionLabel: "Forties",
    color: "amber",
    arabicTitle: "الأربعون القدسية",
    englishTitle: "Forty Hadith Qudsi",
    author: "Various",
    length: 40,
  },
  {
    id: 12,
    slug: "shahwaliullah40",
    filename: "shahwaliullah40.json",
    collection: HADITH_COLLECTIONS.FORTIES,
    collectionLabel: "Forties",
    color: "amber",
    arabicTitle: "أربعون حديثاً",
    englishTitle: "Forty Hadith of Shah Waliullah",
    author: "Shah Waliullah al-Dehlawi",
    length: 40,
  },

  // Other Books
  {
    id: 13,
    slug: "riyad_assalihin",
    filename: "riyad_assalihin.json",
    collection: HADITH_COLLECTIONS.OTHER,
    collectionLabel: "Other Books",
    color: "indigo",
    arabicTitle: "رياض الصالحين",
    englishTitle: "Riyad as-Salihin",
    author: "Imam Yahya ibn Sharaf al-Nawawi",
    length: 1896,
  },
  {
    id: 14,
    slug: "aladab_almufrad",
    filename: "aladab_almufrad.json",
    collection: HADITH_COLLECTIONS.OTHER,
    collectionLabel: "Other Books",
    color: "indigo",
    arabicTitle: "الأدب المفرد",
    englishTitle: "Al-Adab Al-Mufrad",
    author: "Imam Muhammad ibn Ismail al-Bukhari",
    length: 1322,
  },
  {
    id: 15,
    slug: "bulugh_almaram",
    filename: "bulugh_almaram.json",
    collection: HADITH_COLLECTIONS.OTHER,
    collectionLabel: "Other Books",
    color: "indigo",
    arabicTitle: "بلوغ المرام",
    englishTitle: "Bulugh al-Maram",
    author: "Imam Ibn Hajar al-Asqalani",
    length: 1596,
  },
  {
    id: 16,
    slug: "mishkat_almasabih",
    filename: "mishkat_almasabih.json",
    collection: HADITH_COLLECTIONS.OTHER,
    collectionLabel: "Other Books",
    color: "indigo",
    arabicTitle: "مشكاة المصابيح",
    englishTitle: "Mishkat al-Masabih",
    author: "Imam Muhammad ibn Abdullah al-Khatib al-Tibrizi",
    length: 6294,
  },
  {
    id: 17,
    slug: "shamail_muhammadiyah",
    filename: "shamail_muhammadiyah.json",
    collection: HADITH_COLLECTIONS.OTHER,
    collectionLabel: "Other Books",
    color: "indigo",
    arabicTitle: "الشمائل المحمدية",
    englishTitle: "Shamail Muhammadiyah",
    author: "Imam Muhammad ibn Isa at-Tirmidhi",
    length: 415,
  },
];

export function getBookById(id) {
  return HADITH_BOOKS.find((b) => b.id === Number(id)) ?? null;
}

export function getBookBySlug(slug) {
  return HADITH_BOOKS.find((b) => b.slug === slug) ?? null;
}

export const BOOKS_BY_COLLECTION = {
  [HADITH_COLLECTIONS.NINE_BOOKS]: HADITH_BOOKS.filter(
    (b) => b.collection === HADITH_COLLECTIONS.NINE_BOOKS,
  ),
  [HADITH_COLLECTIONS.FORTIES]: HADITH_BOOKS.filter(
    (b) => b.collection === HADITH_COLLECTIONS.FORTIES,
  ),
  [HADITH_COLLECTIONS.OTHER]: HADITH_BOOKS.filter(
    (b) => b.collection === HADITH_COLLECTIONS.OTHER,
  ),
};

export const COLOR_MAP = {
  teal: {
    badge: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glow: "group-hover:shadow-teal-500/10",
    accent: "text-teal-400",
    number: "bg-teal-500/10 text-teal-400",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
    accent: "text-amber-400",
    number: "bg-amber-500/10 text-amber-400",
  },
  indigo: {
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    glow: "group-hover:shadow-indigo-500/10",
    accent: "text-indigo-400",
    number: "bg-indigo-500/10 text-indigo-400",
  },
};

export const TABS = [
  {
    id: HADITH_COLLECTIONS.NINE_BOOKS,
    label: "The 9 Books",
    labelAr: "الكتب التسعة",
    icon: BookOpen,
    description: "The primary canonical hadith collections",
  },
  {
    id: HADITH_COLLECTIONS.FORTIES,
    label: "The Forties",
    labelAr: "الأربعينيات",
    icon: Star,
    description: "Curated collections of forty essential hadiths",
  },
  {
    id: HADITH_COLLECTIONS.OTHER,
    label: "Other Books",
    labelAr: "كتب أخرى",
    icon: Scroll,
    description: "Additional classical hadith compilations",
  },
];

// Total counts per collection
export const TOTAL_COUNTS = {
  [HADITH_COLLECTIONS.NINE_BOOKS]: BOOKS_BY_COLLECTION[
    HADITH_COLLECTIONS.NINE_BOOKS
  ].reduce((acc, b) => acc + b.length, 0),
  [HADITH_COLLECTIONS.FORTIES]: BOOKS_BY_COLLECTION[
    HADITH_COLLECTIONS.FORTIES
  ].reduce((acc, b) => acc + b.length, 0),
  [HADITH_COLLECTIONS.OTHER]: BOOKS_BY_COLLECTION[
    HADITH_COLLECTIONS.OTHER
  ].reduce((acc, b) => acc + b.length, 0),
};

export const TOTAL_BOOKS = (
  BOOKS_BY_COLLECTION[HADITH_COLLECTIONS.NINE_BOOKS].length +
  BOOKS_BY_COLLECTION[HADITH_COLLECTIONS.FORTIES].length +
  BOOKS_BY_COLLECTION[HADITH_COLLECTIONS.OTHER].length
).toLocaleString();

export const TOTAL_HADITHS = (
  TOTAL_COUNTS[HADITH_COLLECTIONS.NINE_BOOKS] +
  TOTAL_COUNTS[HADITH_COLLECTIONS.FORTIES] +
  TOTAL_COUNTS[HADITH_COLLECTIONS.OTHER]
).toLocaleString(); // toLocaleString() bt7ot , mben elarkam zy msln 55,543

export function gradeStyle(grade = "") {
  const g = grade.toLowerCase();

  if (g.includes("sahih"))
    return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";

  if (g.includes("hasan"))
    return "bg-teal-500/15 text-teal-400 border border-teal-500/25";

  if (
    g.includes("da") ||
    g.includes("weak") ||
    g.includes("mawdu") ||
    g.includes("munkar")
  )
    return "bg-red-500/15 text-red-400 border border-red-500/25";

  if (g.includes("mawquf") || g.includes("mursal") || g.includes("munqati"))
    return "bg-amber-500/15 text-amber-400 border border-amber-500/25";

  return "bg-surface/60 text-text-secondary border border-(--surface-glass-border)";
}
