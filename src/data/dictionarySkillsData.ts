import dictionaryDataRaw from './AP_SSC_10th_English_Dictionary_Skills_50_Questions.json';

export interface DictionarySkillQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface DictionaryEntryItem {
  id: number;
  lesson: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  plural: string;
  meanings: string[];
  example: string;
  questions: DictionarySkillQuestion[];
}

export interface DictionarySkillsData {
  title: string;
  class: string;
  board: string;
  subject: string;
  blueprintQuestion: string;
  marksPerEntry: number;
  totalEntries: number;
  totalQuestions: number;
  syllabusReference: string;
  note: string;
  entries: DictionaryEntryItem[];
}

export const DICTIONARY_SKILLS_DATA: DictionarySkillsData = dictionaryDataRaw as DictionarySkillsData;
export const DICTIONARY_ENTRIES: DictionaryEntryItem[] = DICTIONARY_SKILLS_DATA.entries;

/**
 * Normalizes text for forgiving answer comparison.
 * Ignores capitalization, trailing periods, quotes, and leading articles.
 */
export function checkDictionaryAnswer(userAnswer: string, expectedAnswer: string): boolean {
  if (!userAnswer || !expectedAnswer) return false;

  const clean = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/^[“"']+|[”"'.?!]+$/g, '')
      .replace(/\s+/g, ' ');

  const u = clean(userAnswer);
  const e = clean(expectedAnswer);

  if (u === e) return true;

  const stripArticles = (s: string) => s.replace(/^(a|an|the)\s+/i, '').trim();
  if (stripArticles(u) === stripArticles(e)) return true;

  // For answers like "Noun" vs "It is a noun"
  if (u.includes(e) && u.length <= e.length + 15) return true;
  // For long definitions, allow minor variations if key phrase is matched
  if (e.length > 20 && (u.includes(e) || e.includes(u))) {
    if (u.length >= e.length * 0.65) return true;
  }

  return false;
}

/**
 * Generates an educational explanation pointing directly to the relevant part of the dictionary entry.
 */
export function getDictionaryQuestionExplanation(
  entry: DictionaryEntryItem,
  q: DictionarySkillQuestion
): string {
  const qText = q.question.toLowerCase();
  if (qText.includes('part of speech')) {
    return `In this dictionary entry, the part of speech tag is given as "${entry.partOfSpeech}".`;
  }
  if (qText.includes('plural')) {
    return `In this dictionary entry, the plural form is listed as "${entry.plural}".`;
  }
  if (qText.includes('singular')) {
    return `The dictionary entry specifies this word as the plural form of "${q.answer}".`;
  }
  if (qText.includes('base form')) {
    return `The base (infinitive/root) form of the verb "${entry.word}" is "${q.answer}".`;
  }
  if (qText.includes('mean') || qText.includes('refer')) {
    return `Under the "Meaning" section of the entry for "${entry.word}", it is defined as: "${q.answer}"`;
  }
  return `As listed in the official entry for "${entry.word}": ${q.answer}`;
}
