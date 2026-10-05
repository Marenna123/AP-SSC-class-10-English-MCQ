import rawMissionMarchData from './mission_march_q18_q33_level1_level2.json';

export interface RawMissionMarchQuestion {
  id: string;
  q_no: number;
  level: string; // Internal source field only - NEVER displayed in UI
  type: string;
  question: string;
  answer: string;
  explanation?: string;
  answer_status?: string;
}

export interface MissionMarchCategoryMeta {
  q_no: number;
  code: string; // e.g. "Q.18"
  title: string; // e.g. "Relative Clauses"
  displayTitle: string; // e.g. "Q.18 — Relative Clauses"
  description: string;
  badgeColor: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
  };
}

export interface MissionMarchCategoryWithQuestions extends MissionMarchCategoryMeta {
  questions: RawMissionMarchQuestion[];
}

export const MISSION_MARCH_CATEGORIES_META: MissionMarchCategoryMeta[] = [
  {
    q_no: 18,
    code: 'Q.18',
    title: 'Relative Clauses',
    displayTitle: 'Q.18 — Relative Clauses',
    description: 'Combine sentences using relative pronouns (who, which, that, whose, whom).',
    badgeColor: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-600',
    },
  },
  {
    q_no: 19,
    code: 'Q.19',
    title: 'Active to Passive Voice',
    displayTitle: 'Q.19 — Active to Passive Voice',
    description: 'Transform active voice sentences into grammatically accurate passive voice structures.',
    badgeColor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconBg: 'bg-blue-600',
    },
  },
  {
    q_no: 20,
    code: 'Q.20',
    title: 'Reported Speech',
    displayTitle: 'Q.20 — Reported Speech',
    description: 'Convert direct dialogue into indirect reported speech with correct tense and pronoun shifts.',
    badgeColor: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      iconBg: 'bg-cyan-600',
    },
  },
  {
    q_no: 21,
    code: 'Q.21',
    title: 'Prepositions',
    displayTitle: 'Q.21 — Prepositions',
    description: 'Fill in blanks with appropriate prepositions of place, time, movement, and agency.',
    badgeColor: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      iconBg: 'bg-teal-600',
    },
  },
  {
    q_no: 22,
    code: 'Q.22',
    title: 'Editing',
    displayTitle: 'Q.22 — Editing',
    description: 'Identify and correct syntactic, morphological, and grammatical errors in marked passages.',
    badgeColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      iconBg: 'bg-emerald-600',
    },
  },
  {
    q_no: 23,
    code: 'Q.23',
    title: 'Articles',
    displayTitle: 'Q.23 — Articles',
    description: 'Choose correct definite and indefinite articles (a, an, the) or omission of articles.',
    badgeColor: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconBg: 'bg-green-600',
    },
  },
  {
    q_no: 24,
    code: 'Q.24',
    title: 'Repeated Action in the Past',
    displayTitle: 'Q.24 — Repeated Action in the Past',
    description: 'Express habitual and repeated past actions using modal constructions (would / used to).',
    badgeColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      iconBg: 'bg-amber-600',
    },
  },
  {
    q_no: 25,
    code: 'Q.25',
    title: 'Noun Modifiers',
    displayTitle: 'Q.25 — Noun Modifiers',
    description: 'Synthesize compound structures and noun phrases using noun-as-modifier patterns.',
    badgeColor: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      iconBg: 'bg-orange-600',
    },
  },
  {
    q_no: 26,
    code: 'Q.26',
    title: 'Advice / Suggestions',
    displayTitle: 'Q.26 — Advice / Suggestions',
    description: 'Frame polite advice, counseling, or recommendations using appropriate modal verbs.',
    badgeColor: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      iconBg: 'bg-rose-600',
    },
  },
  {
    q_no: 27,
    code: 'Q.27',
    title: 'Synonyms',
    displayTitle: 'Q.27 — Synonyms',
    description: 'Replace underlined passage words with exact contextual synonyms from word boxes.',
    badgeColor: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-800',
      iconBg: 'bg-pink-600',
    },
  },
  {
    q_no: 28,
    code: 'Q.28',
    title: 'Antonyms',
    displayTitle: 'Q.28 — Antonyms',
    description: 'Provide appropriate antonyms / opposite meanings for underlined words in passage context.',
    badgeColor: {
      bg: 'bg-fuchsia-50',
      border: 'border-fuchsia-200',
      text: 'text-fuchsia-800',
      iconBg: 'bg-fuchsia-600',
    },
  },
  {
    q_no: 29,
    code: 'Q.29',
    title: 'Right Form of Words',
    displayTitle: 'Q.29 — Right Form of Words',
    description: 'Select the correct grammatical form (noun, verb, adjective, adverb) from given word brackets.',
    badgeColor: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      iconBg: 'bg-purple-600',
    },
  },
  {
    q_no: 30,
    code: 'Q.30',
    title: 'Prefixes / Suffixes / Inflections',
    displayTitle: 'Q.30 — Prefixes / Suffixes / Inflections',
    description: 'Form accurate derivatives using prefixes (un-, in-, dis-) and suffixes (-tion, -ment, -ness).',
    badgeColor: {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-800',
      iconBg: 'bg-violet-600',
    },
  },
  {
    q_no: 31,
    code: 'Q.31',
    title: 'Wrong Spelling',
    displayTitle: 'Q.31 — Wrong Spelling',
    description: 'Identify the misspelled word from each four-word set and write its correct spelling.',
    badgeColor: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconBg: 'bg-red-600',
    },
  },
  {
    q_no: 32,
    code: 'Q.32',
    title: 'Dictionary Skills',
    displayTitle: 'Q.32 — Dictionary Skills',
    description: 'Interpret authentic dictionary entries for word class, pronunciation, usage, and senses.',
    badgeColor: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-800',
      iconBg: 'bg-slate-700',
    },
  },
  {
    q_no: 33,
    code: 'Q.33',
    title: 'Phrasal Verbs & Idiomatic Expressions',
    displayTitle: 'Q.33 — Phrasal Verbs & Idiomatic Expressions',
    description: 'Construct meaningful original sentences incorporating given phrasal verbs and idioms.',
    badgeColor: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-600',
    },
  },
];

// Raw questions from the provided JSON file
export const ALL_RAW_MISSION_MARCH_QUESTIONS: RawMissionMarchQuestion[] =
  ((rawMissionMarchData as any).questions || []) as RawMissionMarchQuestion[];

// Group questions by question number (Q.18 to Q.33 ONLY)
export const MISSION_MARCH_CATEGORIES: MissionMarchCategoryWithQuestions[] =
  MISSION_MARCH_CATEGORIES_META.map((meta) => {
    const questions = ALL_RAW_MISSION_MARCH_QUESTIONS.filter(
      (q) => q.q_no === meta.q_no
    );
    return {
      ...meta,
      questions,
    };
  });

// Map of category by q_no for fast lookup
export const MISSION_MARCH_BY_QNO: Record<number, MissionMarchCategoryWithQuestions> =
  MISSION_MARCH_CATEGORIES.reduce((acc, cat) => {
    acc[cat.q_no] = cat;
    return acc;
  }, {} as Record<number, MissionMarchCategoryWithQuestions>);
