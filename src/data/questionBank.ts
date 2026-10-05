import { CorrectOption, Question } from '../types';
import { AUTHORITATIVE_QUESTIONS } from './authoritativeLoader';
import { Q33_PRACTICE_QUESTIONS } from './q33PhrasalVerbsData';
import { Q34_ALL_PRACTICE_QUESTIONS } from './q34MatchingData';

/**
 * Converts Question No. 33 (Phrasal Verbs & Idiomatic Expressions)
 * practice questions into standard typed Question objects.
 */
export function convertQ33QuestionsToStandard(): Question[] {
  return Q33_PRACTICE_QUESTIONS.map((q) => {
    const optA = q.options.find((o) => o.value === 'A')?.label || '';
    const optB = q.options.find((o) => o.value === 'B')?.label || '';
    const optC = q.options.find((o) => o.value === 'C')?.label || '';
    const optD = q.options.find((o) => o.value === 'D')?.label || '';

    return {
      id: q.id,
      question_text: q.question,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: q.correctAnswer,
      explanation: q.feedback?.onCorrect || q.explanation,
      category: 'vocabulary',
      subcategory: 'Phrasal Verbs and Idiomatic Expressions',
      lesson_id: 'phrasal-verbs-idioms',
      difficulty: q.difficulty,
      question_number: q.number,
      created_at: '2026-09-30T00:00:00.000Z',
    };
  });
}

/**
 * Converts Question No. 34 (Matching Unit 3 & Unit 4)
 * practice questions into standard typed Question objects.
 */
export function convertQ34QuestionsToStandard(): Question[] {
  return Q34_ALL_PRACTICE_QUESTIONS.map((q) => {
    const prompt = `Match the four items in Part A with their correct meanings in Part B (Unit 3 & Unit 4):\nPART A:\ni) ${q.partA[0]?.expression}\nii) ${q.partA[1]?.expression}\niii) ${q.partA[2]?.expression}\niv) ${q.partA[3]?.expression}\n\nPART B:\na) ${q.partB[0]?.meaning}\nb) ${q.partB[1]?.meaning}\nc) ${q.partB[2]?.meaning}\nd) ${q.partB[3]?.meaning}`;

    const correctMatch = `i-${q.answerKey.i}, ii-${q.answerKey.j}, iii-${q.answerKey.k}, iv-${q.answerKey.l}`;

    return {
      id: q.id,
      question_text: prompt,
      option_a: correctMatch,
      option_b: `i-${q.answerKey.j}, ii-${q.answerKey.i}, iii-${q.answerKey.l}, iv-${q.answerKey.k}`,
      option_c: `i-${q.answerKey.k}, ii-${q.answerKey.l}, iii-${q.answerKey.i}, iv-${q.answerKey.j}`,
      option_d: `i-${q.answerKey.l}, ii-${q.answerKey.k}, iii-${q.answerKey.j}, iv-${q.answerKey.i}`,
      correct_option: 'A' as CorrectOption,
      explanation: `Correct Matching: i) ${q.partA[0]?.expression} → ${q.answerKey.i}; ii) ${q.partA[1]?.expression} → ${q.answerKey.j}; iii) ${q.partA[2]?.expression} → ${q.answerKey.k}; iv) ${q.partA[3]?.expression} → ${q.answerKey.l}`,
      category: 'vocabulary',
      subcategory: 'Matching',
      lesson_id: 'matching',
      difficulty: q.difficulty === 'easy' ? 'simple' : q.difficulty === 'medium' ? 'medium' : 'difficult',
      question_number: q.number,
      created_at: '2026-09-30T00:00:00.000Z',
    };
  });
}

// Provider registry allowing any current or future curriculum question sets to register
type QuestionProvider = () => Question[];

const QUESTION_PROVIDERS: QuestionProvider[] = [
  () => AUTHORITATIVE_QUESTIONS,
  () => convertQ33QuestionsToStandard(),
  () => convertQ34QuestionsToStandard(),
];

/**
 * Register an additional question source dynamically.
 * Future question sets (e.g. Q35, Q36, new unit tests) can register here.
 */
export function registerQuestionSource(provider: QuestionProvider): void {
  QUESTION_PROVIDERS.push(provider);
}

/**
 * Dynamically aggregates all active built-in questions from all curriculum and supplementary sources.
 * Strictly deduplicates by question ID so no question is ever counted twice.
 */
export function getAllBuiltInQuestions(): Question[] {
  const map = new Map<string, Question>();

  for (const provider of QUESTION_PROVIDERS) {
    try {
      const questions = provider();
      if (Array.isArray(questions)) {
        questions.forEach((q) => {
          if (q && q.id) {
            map.set(q.id, q);
          }
        });
      }
    } catch (err) {
      console.warn('Error aggregating questions from provider:', err);
    }
  }

  return Array.from(map.values());
}

/**
 * Returns the exact dynamic count of all unique active questions across all built-in sources.
 */
export function getDynamicBuiltInQuestionsCount(): number {
  return getAllBuiltInQuestions().length;
}

/**
 * Dynamic Authoritative Question Bank for AP SSC Class 10 English.
 * Automatically recalculates when questions are added to any underlying source.
 */
export const ALL_INITIAL_QUESTIONS: Question[] = getAllBuiltInQuestions();
export const INITIAL_QUESTIONS: Question[] = ALL_INITIAL_QUESTIONS;
export const ADDITIONAL_QUESTIONS: Question[] = [];

