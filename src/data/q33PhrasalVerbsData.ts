import rawQ33Data from './Q33_Phrasal_Verbs_Idiomatic_Expressions_50.json';

export interface PreparationExpression {
  no: number;
  expression: string;
  meaning: string;
  example: string;
  category: 'phrasal_verb' | 'idiomatic_expression';
}

export interface Q33PracticeOption {
  value: 'A' | 'B' | 'C' | 'D';
  label: string;
}

export interface Q33PracticeFeedback {
  onCorrect: string;
  onWrong: string;
}

export interface Q33PracticeQuestion {
  id: string;
  number: number;
  questionNumber: number;
  difficulty: 'simple' | 'medium' | 'difficult';
  question: string;
  options: Q33PracticeOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  feedback: Q33PracticeFeedback;
  targetExpression: string;
  explanation: string;
  showFeedbackImmediately: boolean;
  allowNextQuestionAfterFeedback: boolean;
}

// 28 Phrasal Verbs from authoritative JSON
export const PREPARATION_PHRASAL_VERBS: PreparationExpression[] = rawQ33Data.preparation.phrasalVerbs.map(item => ({
  no: item.no,
  expression: item.expression,
  meaning: item.meaning,
  example: item.example,
  category: 'phrasal_verb',
}));

// 17 Idiomatic Expressions from authoritative JSON
export const PREPARATION_IDIOMATIC_EXPRESSIONS: PreparationExpression[] = rawQ33Data.preparation.idiomaticExpressions.map(item => ({
  no: item.no,
  expression: item.expression,
  meaning: item.meaning,
  example: item.example,
  category: 'idiomatic_expression',
}));

// All 45 Preparation Expressions
export const ALL_PREPARATION_EXPRESSIONS: PreparationExpression[] = [
  ...PREPARATION_PHRASAL_VERBS,
  ...PREPARATION_IDIOMATIC_EXPRESSIONS,
];

// Map questions and extract targetExpression & explanation
const mapPracticeQuestion = (rawQ: any): Q33PracticeQuestion => {
  const correctOpt = rawQ.options.find((opt: any) => opt.value === rawQ.correctAnswer);
  const targetExpression = correctOpt ? correctOpt.label : '';
  const explanation = rawQ.feedback?.onCorrect?.replace(/^✓\s*Right Answer\s*—\s*/, '') ||
    `${targetExpression} is the correct expression.`;

  return {
    id: rawQ.id,
    number: rawQ.number,
    questionNumber: rawQ.number,
    difficulty: rawQ.difficulty as 'simple' | 'medium' | 'difficult',
    question: rawQ.question,
    options: rawQ.options as Q33PracticeOption[],
    correctAnswer: rawQ.correctAnswer as 'A' | 'B' | 'C' | 'D',
    feedback: rawQ.feedback,
    targetExpression,
    explanation,
    showFeedbackImmediately: rawQ.showFeedbackImmediately ?? true,
    allowNextQuestionAfterFeedback: rawQ.allowNextQuestionAfterFeedback ?? true,
  };
};

export const Q33_SIMPLE_QUESTIONS: Q33PracticeQuestion[] = rawQ33Data.practice.simple.map(mapPracticeQuestion);
export const Q33_MEDIUM_QUESTIONS: Q33PracticeQuestion[] = rawQ33Data.practice.medium.map(mapPracticeQuestion);
export const Q33_DIFFICULT_QUESTIONS: Q33PracticeQuestion[] = rawQ33Data.practice.difficult.map(mapPracticeQuestion);

// All 50 Level-wise practice questions
export const Q33_PRACTICE_QUESTIONS: Q33PracticeQuestion[] = [
  ...Q33_SIMPLE_QUESTIONS,
  ...Q33_MEDIUM_QUESTIONS,
  ...Q33_DIFFICULT_QUESTIONS,
];

export const Q33_QUESTIONS_BY_LEVEL = {
  simple: Q33_SIMPLE_QUESTIONS,
  medium: Q33_MEDIUM_QUESTIONS,
  difficult: Q33_DIFFICULT_QUESTIONS,
};

export const Q33_METADATA = {
  question_number: 33,
  section: 'Vocabulary',
  title: 'Phrasal Verbs & Idiomatic Expressions',
  total_questions: 50,
  simple_count: 20,
  medium_count: 20,
  difficult_count: 10,
  phrasal_verbs_count: 28,
  idiomatic_expressions_count: 17,
  blueprint_instruction: 'Use the following phrasal verbs and idiomatic expressions (Language expressions) in sentences of your own.',
  blueprint_marks: '2 × 1 = 2 Marks',
  source_note: 'AP SSC English Class 10 Board Pattern - Question No. 33 (Supplementary Practice & Preparation)',
};
