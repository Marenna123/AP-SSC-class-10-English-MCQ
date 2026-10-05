import { Category, CorrectOption, Difficulty, Question } from '../types';
import rawData from './official_ap_ssc_bank.json';

export interface RawAuthoritativeQuestion {
  question_number?: number;
  id?: number;
  question: string;
  paragraph?: string;
  underlined_word?: string;
  word_box?: string[];
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
  difficulty: string;
  story?: string;
  target_word?: string;
}

export interface RawPoemOrLesson {
  id?: string;
  title: string;
  author?: string;
  authors?: string[];
  stories?: string[];
  question_count?: number;
  total_questions?: number;
  questions: RawAuthoritativeQuestion[];
}

export interface RawAuthoritativeBank {
  app?: string;
  academic_year?: string;
  source_policy?: string;
  status?: string;
  poems?: RawPoemOrLesson[];
  prose?: RawPoemOrLesson[];
  grammar?: RawPoemOrLesson[];
  vocabulary?: RawPoemOrLesson[];
}

/**
 * Normalizes title into standard URL/slug identifier
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Parses and validates an authoritative JSON object into typed Questions
 * without modifying questions, options, answers, or explanations.
 */
export function parseAuthoritativeJSON(bank: RawAuthoritativeBank | any): Question[] {
  const parsedQuestions: Question[] = [];

  const processList = (items: RawPoemOrLesson[] | undefined, defaultCategory: Category) => {
    if (!Array.isArray(items)) return;

    for (const item of items) {
      const subcategory = item.title;
      const lessonId = item.id || (
        item.title.toLowerCase().includes('nelson mandela')
          ? 'nelson-mandela'
          : item.title.toLowerCase().includes('flying')
          ? 'two-stories-about-flying'
          : item.title.toLowerCase().includes('anne frank')
          ? 'from-the-diary-of-anne-frank'
          : item.title.toLowerCase().includes('glimpses of india')
          ? 'glimpses-of-india'
          : item.title.toLowerCase().includes('amanda')
          ? 'amanda'
          : item.title.toLowerCase().includes('madam rides the bus')
          ? 'madam-rides-the-bus'
          : item.title.toLowerCase().includes('sermon at benares')
          ? 'the-sermon-at-benares'
          : item.title.toLowerCase().includes('relative clause')
          ? 'relative-clauses'
          : item.title.toLowerCase().includes('passive')
          ? 'passive-voice'
          : item.title.toLowerCase().includes('reported speech')
          ? 'reported-speech'
          : item.title.toLowerCase().includes('preposition')
          ? 'prepositions'
          : item.title.toLowerCase().includes('editing')
          ? 'editing-a-passage'
          : item.title.toLowerCase().includes('article')
          ? 'articles'
          : item.title.toLowerCase().includes('used to') || item.title.toLowerCase().includes('would')
          ? 'used-to-would'
          : item.title.toLowerCase().includes('noun modifier')
          ? 'noun-modifier'
          : item.title.toLowerCase().includes('advice')
          ? 'giving-advice'
          : item.title.toLowerCase().includes('synonym')
          ? 'synonyms'
          : item.title.toLowerCase().includes('antonym')
          ? 'antonyms'
          : item.title.toLowerCase().includes('verb') || item.title.toLowerCase().includes('right form')
          ? 'right-forms-of-verbs'
          : item.title.toLowerCase().includes('prefix') || item.title.toLowerCase().includes('suffix')
          ? 'prefixes-suffixes'
          : item.title.toLowerCase().includes('spelling')
          ? 'spelling-corrections'
          : slugifyTitle(item.title)
      );

      if (Array.isArray(item.questions)) {
        for (const q of item.questions) {
          const qNum = q.question_number ?? q.id;
          const diff = (q.difficulty?.toLowerCase() || 'medium') as Difficulty;
          const correct = (q.correct_answer?.trim().toUpperCase() || 'A') as CorrectOption;

          parsedQuestions.push({
            id: `q-${lessonId}-${qNum}`,
            question_text: q.question,
            option_a: q.options.A,
            option_b: q.options.B,
            option_c: q.options.C,
            option_d: q.options.D,
            correct_option: correct,
            explanation: q.explanation,
            category: defaultCategory,
            subcategory,
            lesson_id: lessonId,
            difficulty: diff,
            question_number: qNum,
            story: q.story,
            paragraph: q.paragraph,
            underlined_word: q.underlined_word,
            word_box: q.word_box,
            target_word: q.target_word,
            created_at: new Date().toISOString(),
          });
        }
      }
    }
  };

  // Process each curriculum category
  processList(bank.poems, 'poem');
  processList(bank.prose, 'prose');
  processList(bank.grammar, 'grammar');
  processList(bank.vocabulary, 'vocabulary');

  // Handle single lesson object if passed directly
  if (bank.title && Array.isArray(bank.questions)) {
    const defaultCat: Category = bank.category || 'prose';
    processList([bank as RawPoemOrLesson], defaultCat);
  }

  return parsedQuestions;
}

// Authoritative Questions loaded from the attached JSON file
export const AUTHORITATIVE_QUESTIONS: Question[] = parseAuthoritativeJSON(rawData);
