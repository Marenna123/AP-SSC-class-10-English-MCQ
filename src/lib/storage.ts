import { Attempt, Bookmark, Question, StudentProfile, TestResult, Category, Difficulty, CorrectOption } from '../types';
import { ALL_INITIAL_QUESTIONS, getAllBuiltInQuestions } from '../data/questionBank';
import { getBundledAuthoritativeQuestions, normalizeAndValidateJSONQuestions } from './questionLoader';

const STORAGE_KEYS = {
  QUESTIONS: 'ap_ssc_authoritative_questions_v30',
  ATTEMPTS: 'ap_ssc_attempts_v2',
  BOOKMARKS: 'ap_ssc_bookmarks_v2',
  TEST_RESULTS: 'ap_ssc_test_results_v2',
  PROFILE: 'ap_ssc_profile_v2',
  SUPABASE_CONFIG: 'ap_ssc_supabase_config_v1',
};

const DEFAULT_PROFILE: StudentProfile = {
  id: 'student-default-user',
  name: 'AP SSC Student',
  grade: 'Class 10 (2026–27 Batch)',
  school: 'Zilla Parishad High School / Model School',
  last_lesson_attempted: 'How to Tell Wild Animals',
  updated_at: new Date().toISOString(),
};

// --- Storage Utilities ---
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('ap_ssc_storage_updated', { detail: { key } }));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

// Initialize default authoritative questions if not present or missing new lessons
export function initializeStorage(): void {
  getQuestions();
}

// --- Question Management ---
export function getQuestions(): Question[] {
  // Dynamically aggregate all active questions from all authoritative curriculum sources
  const builtIn = getAllBuiltInQuestions();
  const map = new Map<string, Question>();

  // 1. Add all authoritative built-in questions (official board bank 1273, Q.33 50, Q.34 50, etc.)
  builtIn.forEach((q) => {
    if (q && q.id) {
      map.set(q.id, q);
    }
  });

  // 2. Check legacy storage keys to ensure user-created custom questions are preserved
  const candidateKeys = [
    STORAGE_KEYS.QUESTIONS,
    'ap_ssc_authoritative_questions_v29',
    'ap_ssc_authoritative_questions_v28',
    'ap_ssc_authoritative_questions_v2',
    'ap_ssc_authoritative_questions_v1',
    'ap_ssc_questions_v1',
  ];

  for (const k of candidateKeys) {
    const storedList = getStored<Question[]>(k, []);
    if (Array.isArray(storedList)) {
      storedList.forEach((q) => {
        // If it's a custom question not in built-in bank, preserve it
        if (q && q.id && !map.has(q.id)) {
          map.set(q.id, q);
        }
      });
    }
  }

  const merged = Array.from(map.values());

  // Keep storage cache updated if new questions were added without wiping custom data
  const currentStored = getStored<Question[]>(STORAGE_KEYS.QUESTIONS, []);
  if (!Array.isArray(currentStored) || currentStored.length < merged.length) {
    setStored(STORAGE_KEYS.QUESTIONS, merged);
  }

  return merged;
}

export function saveQuestion(question: Question): boolean {
  const list = getQuestions();
  const index = list.findIndex(q => q.id === question.id);
  if (index >= 0) {
    list[index] = question;
  } else {
    list.unshift(question);
  }
  setStored(STORAGE_KEYS.QUESTIONS, list);
  return true;
}

export function deleteQuestion(questionId: string): boolean {
  const list = getQuestions().filter(q => q.id !== questionId);
  setStored(STORAGE_KEYS.QUESTIONS, list);
  return true;
}

export function resetToDefaultQuestions(): void {
  const builtIn = getAllBuiltInQuestions();
  setStored(STORAGE_KEYS.QUESTIONS, builtIn);
}

// --- Attempts Management ---
export function getAttempts(): Attempt[] {
  return getStored<Attempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function recordAttempt(
  questionId: string,
  selectedOption: CorrectOption,
  isCorrect: boolean,
  lessonTitle?: string
): Attempt {
  const attempts = getAttempts();
  const profile = getProfile();

  const newAttempt: Attempt = {
    id: 'att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    user_id: profile.id,
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    attempted_at: new Date().toISOString(),
  };

  attempts.push(newAttempt);
  setStored(STORAGE_KEYS.ATTEMPTS, attempts);

  // Update profile last lesson attempted
  if (lessonTitle) {
    profile.last_lesson_attempted = lessonTitle;
    profile.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.PROFILE, profile);
  }

  return newAttempt;
}

// Get the latest attempt status for each question
export function getQuestionStatusMap(): Record<string, { isCorrect: boolean; attemptsCount: number; lastOption: CorrectOption }> {
  const attempts = getAttempts();
  const map: Record<string, { isCorrect: boolean; attemptsCount: number; lastOption: CorrectOption }> = {};

  for (const att of attempts) {
    if (!map[att.question_id]) {
      map[att.question_id] = { isCorrect: att.is_correct, attemptsCount: 1, lastOption: att.selected_option };
    } else {
      map[att.question_id].isCorrect = att.is_correct; // latest attempt updates correctness
      map[att.question_id].attemptsCount += 1;
      map[att.question_id].lastOption = att.selected_option;
    }
  }

  // Include any Q.33 attempts from ap_ssc_q33_progress_v4 if not already present
  try {
    const q33Raw = localStorage.getItem('ap_ssc_q33_progress_v4');
    if (q33Raw) {
      const q33Attempts = JSON.parse(q33Raw);
      if (q33Attempts && typeof q33Attempts === 'object') {
        Object.keys(q33Attempts).forEach((qId) => {
          if (!map[qId]) {
            const att = q33Attempts[qId];
            map[qId] = {
              isCorrect: !!att.isCorrect,
              attemptsCount: 1,
              lastOption: (att.selectedOption || 'A') as CorrectOption,
            };
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  // Include any Q.34 attempts from ap_ssc_q34_matching_progress_v1 if not already present
  try {
    const q34Raw = localStorage.getItem('ap_ssc_q34_matching_progress_v1');
    if (q34Raw) {
      const q34Attempts = JSON.parse(q34Raw);
      if (q34Attempts && typeof q34Attempts === 'object') {
        Object.keys(q34Attempts).forEach((qId) => {
          if (!map[qId]) {
            const att = q34Attempts[qId];
            map[qId] = {
              isCorrect: !!att.isAllCorrect,
              attemptsCount: 1,
              lastOption: 'A',
            };
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  return map;
}

// --- Bookmarks Management ---
export function getBookmarks(): Bookmark[] {
  return getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
}

export function isQuestionBookmarked(questionId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.question_id === questionId);
}

export function toggleBookmark(questionId: string): boolean {
  const bookmarks = getBookmarks();
  const profile = getProfile();
  const existingIndex = bookmarks.findIndex(b => b.question_id === questionId);

  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return false; // unbookmarked
  } else {
    bookmarks.push({
      id: 'bm-' + Date.now(),
      user_id: profile.id,
      question_id: questionId,
      created_at: new Date().toISOString(),
    });
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return true; // bookmarked
  }
}

// --- Test Results Management ---
export function getTestResults(): TestResult[] {
  return getStored<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
}

export function saveTestResult(result: Omit<TestResult, 'id' | 'user_id' | 'completed_at'>): TestResult {
  const results = getTestResults();
  const profile = getProfile();
  const fullResult: TestResult = {
    ...result,
    id: 'tr-' + Date.now(),
    user_id: profile.id,
    completed_at: new Date().toISOString(),
  };
  results.unshift(fullResult);
  setStored(STORAGE_KEYS.TEST_RESULTS, results);
  return fullResult;
}

// --- Profile Management ---
export function getProfile(): StudentProfile {
  return getStored<StudentProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
}

export function updateProfile(updates: Partial<StudentProfile>): StudentProfile {
  const current = getProfile();
  const updated: StudentProfile = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  setStored(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

// --- Aggregate Progress Computation ---
export interface OverallStats {
  totalQuestionsInBank: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  lessonsCompleted: number;
  poemsCompleted: number;
  grammarTopicsCompleted: number;
  vocabularyTopicsCompleted: number;
  testsCompleted: number;
  bookmarkedCount: number;
  incorrectQuestionsCount: number;
}

export function computeOverallStats(): OverallStats {
  const allQuestions = getQuestions();
  const statusMap = getQuestionStatusMap();
  const bookmarks = getBookmarks();
  const testResults = getTestResults();

  const attemptedIds = Object.keys(statusMap);
  const questionsAttempted = attemptedIds.length;

  let correctAnswers = 0;
  let incorrectAnswers = 0;

  for (const qId of attemptedIds) {
    if (statusMap[qId].isCorrect) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  }

  const accuracy = questionsAttempted > 0 ? Math.round((correctAnswers / questionsAttempted) * 100) : 0;

  // Track completed lessons/topics (e.g. attempted at least 3 questions in that lesson with >= 70% accuracy)
  const categoryTopicMap: Record<string, { total: number; correct: number; category: Category }> = {};
  for (const q of allQuestions) {
    const key = q.lesson_id;
    if (!categoryTopicMap[key]) {
      categoryTopicMap[key] = { total: 0, correct: 0, category: q.category };
    }
    const stat = statusMap[q.id];
    if (stat) {
      categoryTopicMap[key].total++;
      if (stat.isCorrect) categoryTopicMap[key].correct++;
    }
  }

  let lessonsCompleted = 0;
  let poemsCompleted = 0;
  let grammarTopicsCompleted = 0;
  let vocabularyTopicsCompleted = 0;

  for (const key of Object.keys(categoryTopicMap)) {
    const item = categoryTopicMap[key];
    if (item.total >= 3 && item.correct / item.total >= 0.6) {
      if (item.category === 'prose') lessonsCompleted++;
      if (item.category === 'poem') poemsCompleted++;
      if (item.category === 'grammar') grammarTopicsCompleted++;
      if (item.category === 'vocabulary') vocabularyTopicsCompleted++;
    }
  }

  return {
    totalQuestionsInBank: allQuestions.length,
    questionsAttempted,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    lessonsCompleted,
    poemsCompleted,
    grammarTopicsCompleted,
    vocabularyTopicsCompleted,
    testsCompleted: testResults.length,
    bookmarkedCount: bookmarks.length,
    incorrectQuestionsCount: incorrectAnswers,
  };
}

// --- Retry Incorrect Questions Helpers ---
export function getIncorrectQuestions(filterLessonId?: string, filterCategory?: Category): Question[] {
  const allQuestions = getQuestions();
  const statusMap = getQuestionStatusMap();

  return allQuestions.filter(q => {
    const stat = statusMap[q.id];
    if (!stat || stat.isCorrect) return false; // only unmastered incorrect questions
    if (filterLessonId && q.lesson_id !== filterLessonId) return false;
    if (filterCategory && q.category !== filterCategory) return false;
    return true;
  });
}

// --- CSV Import Utility with Strict Validation ---
export interface ImportValidationResult {
  validQuestions: Question[];
  errors: string[];
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseAndValidateCSV(csvText: string): ImportValidationResult {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  const errors: string[] = [];
  const validQuestions: Question[] = [];

  if (lines.length === 0) {
    return { validQuestions: [], errors: ['CSV content is empty.'] };
  }

  // Check header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const startIndex = header.includes('question_text') ? 1 : 0;

  const validDifficulties: Difficulty[] = ['simple', 'medium', 'difficult'];
  const validCategories: Category[] = ['prose', 'poem', 'grammar', 'vocabulary'];
  const validOptions: CorrectOption[] = ['A', 'B', 'C', 'D'];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple robust comma-splitter handling quotes
    const cells = parseCSVLine(line);
    if (cells.length < 9) {
      errors.push(`Row ${i + 1}: Insufficient columns (expected at least 9, got ${cells.length}).`);
      continue;
    }

    const [
      qText,
      optA,
      optB,
      optC,
      optD,
      rawCorrect,
      explanation,
      rawCategory,
      rawSubcategory,
      rawDifficulty,
      rawLessonId,
    ] = cells;

    const correct = (rawCorrect?.trim().toUpperCase() || '') as CorrectOption;
    const category = (rawCategory?.trim().toLowerCase() || '') as Category;
    const difficulty = (rawDifficulty?.trim().toLowerCase() || 'medium') as Difficulty;
    const subcategory = rawSubcategory?.trim() || 'General';
    const lessonId = rawLessonId?.trim() || subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Validation checks
    if (!qText || qText.trim().length < 5) {
      errors.push(`Row ${i + 1}: Question text is missing or too short.`);
      continue;
    }
    if (!optA || !optB || !optC || !optD) {
      errors.push(`Row ${i + 1}: All 4 options (A, B, C, D) must be provided.`);
      continue;
    }
    if (!validOptions.includes(correct)) {
      errors.push(`Row ${i + 1}: Correct option must be A, B, C, or D (got "${rawCorrect}").`);
      continue;
    }
    if (!validCategories.includes(category)) {
      errors.push(`Row ${i + 1}: Category must be prose, poem, grammar, or vocabulary (got "${rawCategory}").`);
      continue;
    }
    if (!validDifficulties.includes(difficulty)) {
      errors.push(`Row ${i + 1}: Difficulty must be simple, medium, or difficult (got "${rawDifficulty}").`);
      continue;
    }
    if (!explanation || explanation.trim().length < 3) {
      errors.push(`Row ${i + 1}: Explanation must be provided.`);
      continue;
    }

    validQuestions.push({
      id: 'q-csv-' + Date.now() + '-' + i,
      question_text: qText.trim(),
      option_a: optA.trim(),
      option_b: optB.trim(),
      option_c: optC.trim(),
      option_d: optD.trim(),
      correct_option: correct,
      explanation: explanation.trim(),
      category,
      subcategory,
      lesson_id: lessonId,
      difficulty,
      question_number: i + 1,
      created_at: new Date().toISOString(),
    });
  }

  return { validQuestions, errors };
}

export function getBookmarkedQuestions(): Question[] {
  const bookmarks = getBookmarks();
  const allQuestions = getQuestions();
  const bookmarkedIds = new Set(bookmarks.map(b => b.question_id));
  return allQuestions.filter(q => bookmarkedIds.has(q.id));
}

export function bulkImportQuestions(newQuestions: Question[]): Question[] {
  const list = getQuestions();
  const map = new Map<string, Question>();
  // 1. Keep existing
  list.forEach((q) => {
    if (q && q.id) map.set(q.id, q);
  });
  // 2. Add or update imported
  newQuestions.forEach((q) => {
    if (q && q.id) map.set(q.id, q);
  });
  const updated = Array.from(map.values());
  setStored(STORAGE_KEYS.QUESTIONS, updated);
  return updated;
}

export function addQuestionToBank(question: Question): Question[] {
  saveQuestion(question);
  return getQuestions();
}

export function deleteQuestionFromBank(questionId: string): Question[] {
  deleteQuestion(questionId);
  return getQuestions();
}

export function resetAllProgress(): void {
  setStored(STORAGE_KEYS.ATTEMPTS, []);
  setStored(STORAGE_KEYS.BOOKMARKS, []);
  setStored(STORAGE_KEYS.TEST_RESULTS, []);
  const prof = getProfile();
  prof.last_lesson_attempted = 'How to Tell Wild Animals';
  setStored(STORAGE_KEYS.PROFILE, prof);
}

/**
 * Imports authoritative questions from JSON, preserving exact text, options, answers, and explanations.
 */
export function importAuthoritativeJSONData(rawJson: unknown): { count: number; errors: string[] } {
  const { validQuestions, errors } = normalizeAndValidateJSONQuestions(rawJson);
  if (validQuestions.length > 0) {
    const current = getQuestions();
    const map = new Map<string, Question>();
    // First keep existing
    current.forEach(q => map.set(q.id, q));
    // Overwrite or append valid imported ones
    validQuestions.forEach(q => map.set(q.id, q));
    const merged = Array.from(map.values());
    setStored(STORAGE_KEYS.QUESTIONS, merged);
  }
  return { count: validQuestions.length, errors };
}

// Aliases for seamless imports
export const loadQuestionBank = getQuestions;
export const getStudentProfile = getProfile;
export const saveStudentProfile = updateProfile;
export const getOverallStats = computeOverallStats;
export const recordQuestionAttempt = recordAttempt;
export const getAttemptStatusMap = getQuestionStatusMap;

