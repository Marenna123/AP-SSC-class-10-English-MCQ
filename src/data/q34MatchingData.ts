import rawQ34Data from './Q34_Matching_50.json';

export type Q34Difficulty = 'easy' | 'medium' | 'difficult';
export type Q34Category = 'phrasal_verb' | 'idiomatic_expression' | 'contextual_vocabulary';

export interface Q34PartAItem {
  key: 'i' | 'j' | 'k' | 'l';
  romanNumeral: 'i)' | 'ii)' | 'iii)' | 'iv)';
  item: string;
  expression: string;
}

export interface Q34PartBItem {
  letter: 'a' | 'b' | 'c' | 'd';
  option: string;
  meaning: string;
}

export interface Q34AnswerKey {
  i: string;
  j: string;
  k: string;
  l: string;
}

export interface Q34MatchingQuestion {
  id: string;
  number: number;
  difficulty: Q34Difficulty;
  partA: Q34PartAItem[];
  partB: Q34PartBItem[];
  answerKey: Q34AnswerKey;
}

export interface Q34PreparationItem {
  id: string;
  expression: string;
  meaning: string;
  example: string;
  category: Q34Category;
  unit: string;
}

// 1. Phrasal Verbs (12 items from Q34 dataset - Unit 3 & Unit 4)
export const Q34_PHRASAL_VERBS: Q34PreparationItem[] = [
  {
    id: 'pv-walk-away',
    expression: 'walk away',
    meaning: 'leave or abandon a situation',
    example: 'Instead of arguing with her classmate, Anne chose to walk away quietly.',
    category: 'phrasal_verb',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'pv-hand-in',
    expression: 'hand in',
    meaning: 'submit an assignment or document to an authority',
    example: 'The students had to hand in their English homework to Mr. Keesing on Monday.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
  {
    id: 'pv-take-up',
    expression: 'take up',
    meaning: 'start doing a job, hobby, or activity',
    example: 'Anne Frank decided to take up keeping a personal diary during her school days.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
  {
    id: 'pv-calm-down',
    expression: 'calm down',
    meaning: 'make or remain quiet / peaceful',
    example: 'The teacher waited patiently for the chatty students to calm down before continuing.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
  {
    id: 'pv-give-away',
    expression: 'give away',
    meaning: 'reveal a secret or distribute freely',
    example: 'Her nervous smile threatened to give away the surprise she had planned.',
    category: 'phrasal_verb',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'pv-put-out',
    expression: 'put out',
    meaning: 'extinguish a flame or fire',
    example: 'The firemen acted promptly to put out the sudden kitchen fire.',
    category: 'phrasal_verb',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'pv-check-in',
    expression: 'check in',
    meaning: 'register or confirm arrival',
    example: 'The passengers had to check in at the airport counter before boarding.',
    category: 'phrasal_verb',
    unit: 'Unit 3',
  },
  {
    id: 'pv-fly-high',
    expression: 'fly high',
    meaning: 'be successful / ambitious',
    example: 'After conquering his initial fear of heights, the young seagull began to fly high.',
    category: 'phrasal_verb',
    unit: 'Unit 3',
  },
  {
    id: 'pv-break-down',
    expression: 'break down',
    meaning: 'fail to function / collapse emotionally',
    example: 'The old vintage aircraft did not break down during the storm.',
    category: 'phrasal_verb',
    unit: 'Unit 3',
  },
  {
    id: 'pv-jot-down',
    expression: 'jot down',
    meaning: 'write down quickly',
    example: 'Anne did not want to merely jot down facts in her diary like others did.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
  {
    id: 'pv-plunge-in',
    expression: 'plunge in',
    meaning: 'go straight to the topic / start dealing with something immediately',
    example: 'Since no one would understand a word of her stories, Anne decided to plunge right in with a brief sketch.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
  {
    id: 'pv-look-into',
    expression: 'look into',
    meaning: 'investigate or examine carefully',
    example: 'The headmaster promised to look into the complaints regarding excessive talking.',
    category: 'phrasal_verb',
    unit: 'Unit 4',
  },
];

// 2. Idiomatic Expressions (11 items from Q34 dataset - Unit 3 & Unit 4)
export const Q34_IDIOMATIC_EXPRESSIONS: Q34PreparationItem[] = [
  {
    id: 'id-raining-cats-and-dogs',
    expression: 'raining cats and dogs',
    meaning: 'raining very heavily',
    example: 'It was raining cats and dogs outside, so the children stayed indoors to write.',
    category: 'idiomatic_expression',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'id-caught-my-eye',
    expression: 'caught my eye',
    meaning: "attracted someone's attention",
    example: 'A beautifully bound pocketbook in the shop window immediately caught my eye.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-lose-heart',
    expression: 'lose heart',
    meaning: 'become discouraged or lose hope',
    example: 'Even when his wings felt too weak to support him, the young seagull did not lose heart.',
    category: 'idiomatic_expression',
    unit: 'Unit 3',
  },
  {
    id: 'id-quake-in-boots',
    expression: 'quake in boots',
    meaning: 'shake or tremble with extreme fear/nervousness',
    example: 'The entire class quaked in their boots awaiting the teachers’ declaration of exam results.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-icing-on-the-cake',
    expression: 'icing on the cake',
    meaning: 'an extra good thing added to something already good',
    example: 'Scoring an A+ in mathematics on her report card was the icing on the cake.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-chalk-and-cheese',
    expression: 'chalk and cheese',
    meaning: 'completely different from each other',
    example: 'Though born in the same household, the two siblings were like chalk and cheese in temperament.',
    category: 'idiomatic_expression',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'id-all-fair-love-war',
    expression: "all's fair in love and war",
    meaning: 'all behavior is acceptable in extreme situations',
    example: 'In a battle of wits with the strict teacher, she humorously argued that all’s fair in love and war.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-bakers-dozen',
    expression: "a baker's dozen",
    meaning: 'a group of thirteen (thirteen items)',
    example: 'The kind shopkeeper added one extra roll to make it a baker’s dozen.',
    category: 'idiomatic_expression',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'id-call-the-shots',
    expression: 'call the shots',
    meaning: 'take charge and make key decisions',
    example: 'In Mr. Keesing’s classroom, it was undoubtedly the teacher who called the shots.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-for-ages',
    expression: 'for ages',
    meaning: 'for a very long period of time',
    example: 'Anne admitted that she had not felt true intimacy with a friend for ages.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
  {
    id: 'id-break-the-ice',
    expression: 'break the ice',
    meaning: 'relieve tension and start a conversation',
    example: 'Her humorous essay on chatterboxes helped break the ice with her strict tutor.',
    category: 'idiomatic_expression',
    unit: 'Unit 4',
  },
];

// 3. Contextual Vocabulary (5 items from Q34 dataset - Unit 3 & Unit 4)
export const Q34_CONTEXTUAL_VOCABULARY: Q34PreparationItem[] = [
  {
    id: 'cv-vague',
    expression: 'Vague',
    meaning: 'not clearly expressed, perceived, or defined',
    example: 'The young writer refused to leave her observations vague or incomplete.',
    category: 'contextual_vocabulary',
    unit: 'Unit 4',
  },
  {
    id: 'cv-emancipation',
    expression: 'Emancipation',
    meaning: 'liberation / freeing from social or legal restrictions',
    example: 'The courageous freedom movement led the oppressed people toward emancipation.',
    category: 'contextual_vocabulary',
    unit: 'Unit 3',
  },
  {
    id: 'cv-malice',
    expression: 'Malice',
    meaning: 'the desire to harm or annoy others; ill will',
    example: 'Her playful jokes contained boundless wit, but absolutely no malice.',
    category: 'contextual_vocabulary',
    unit: 'Unit 4',
  },
  {
    id: 'cv-bill-of-mortality',
    expression: 'Bill of mortality',
    meaning: 'an official weekly list or record of deaths',
    example: 'The city town hall maintained a regular bill of mortality during the outbreak.',
    category: 'contextual_vocabulary',
    unit: 'Unit 3 & 4',
  },
  {
    id: 'cv-indignant',
    expression: 'Indignant',
    meaning: 'feeling or showing anger at unfair treatment',
    example: 'The student looked indignant when accused of talking without reason.',
    category: 'contextual_vocabulary',
    unit: 'Unit 4',
  },
];

// All 28 Preparation Items from Q.34 dataset
export const Q34_ALL_PREPARATION_ITEMS: Q34PreparationItem[] = [
  ...Q34_PHRASAL_VERBS,
  ...Q34_IDIOMATIC_EXPRESSIONS,
  ...Q34_CONTEXTUAL_VOCABULARY,
];

// Helper to map roman numerals
const romanNumeralMap: Record<number, 'i)' | 'ii)' | 'iii)' | 'iv)'> = {
  0: 'i)',
  1: 'ii)',
  2: 'iii)',
  3: 'iv)',
};

const mapRawQuestion = (rawQ: any, difficulty: Q34Difficulty, index: number): Q34MatchingQuestion => {
  const partA: Q34PartAItem[] = rawQ.partA.map((aItem: any, idx: number) => {
    const rawKey = aItem.item.split(')')[0].trim().toLowerCase() as 'i' | 'j' | 'k' | 'l';
    return {
      key: rawKey,
      romanNumeral: romanNumeralMap[idx] || 'i)',
      item: aItem.item,
      expression: aItem.expression,
    };
  });

  const partB: Q34PartBItem[] = rawQ.partB.map((bItem: any) => {
    const letter = bItem.option.replace(')', '').trim().toLowerCase() as 'a' | 'b' | 'c' | 'd';
    return {
      letter,
      option: bItem.option,
      meaning: bItem.meaning,
    };
  });

  return {
    id: `q34_${difficulty}_${rawQ.number || index + 1}`,
    number: rawQ.number || index + 1,
    difficulty,
    partA,
    partB,
    answerKey: rawQ.answerKey,
  };
};

export const Q34_EASY_QUESTIONS: Q34MatchingQuestion[] = rawQ34Data.easy.map((q, idx) =>
  mapRawQuestion(q, 'easy', idx)
);

export const Q34_MEDIUM_QUESTIONS: Q34MatchingQuestion[] = rawQ34Data.medium.map((q, idx) =>
  mapRawQuestion(q, 'medium', idx)
);

export const Q34_DIFFICULT_QUESTIONS: Q34MatchingQuestion[] = rawQ34Data.difficult.map((q, idx) =>
  mapRawQuestion(q, 'difficult', idx)
);

export const Q34_ALL_PRACTICE_QUESTIONS: Q34MatchingQuestion[] = [
  ...Q34_EASY_QUESTIONS,
  ...Q34_MEDIUM_QUESTIONS,
  ...Q34_DIFFICULT_QUESTIONS,
];

export const Q34_QUESTIONS_BY_LEVEL: Record<Q34Difficulty, Q34MatchingQuestion[]> = {
  easy: Q34_EASY_QUESTIONS,
  medium: Q34_MEDIUM_QUESTIONS,
  difficult: Q34_DIFFICULT_QUESTIONS,
};

export const Q34_METADATA = {
  questionNumber: 34,
  section: 'Vocabulary',
  title: 'Matching',
  syllabusReference: 'Unit 3 & Unit 4 only',
  blueprintInstruction: 'Match the four words / expressions in Part A with their correct contextual meanings in Part B.',
  marks: '4 × ½ = 2 Marks',
  totalQuestions: 50,
  easyCount: 20,
  mediumCount: 20,
  difficultCount: 10,
  phrasalVerbsCount: 12,
  idiomaticExpressionsCount: 11,
  contextualVocabularyCount: 5,
  totalPreparationCount: 28,
};
