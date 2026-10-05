import { Category, CorrectOption, Difficulty, Question } from '../types';
import { POEMS, PROSE_LESSONS, GRAMMAR_TOPICS, VOCABULARY_TOPICS } from '../data/syllabus';
import authoritativeJsonRaw from '../data/official_ap_ssc_bank.json';

export interface JsonImportResult {
  validQuestions: Question[];
  errors: string[];
  lessonNames: string[];
}

/**
 * Normalizes and validates incoming JSON question data without altering
 * questions, options, correct answers, or explanations.
 * Supports:
 * - { poems: [ { title: "...", questions: [...] } ] }
 * - { prose: [ { title: "...", questions: [...] } ] }
 * - { grammar: [ { title: "...", questions: [...] } ] }
 * - { vocabulary: [ { title: "...", questions: [...] } ] }
 * - Direct array of question objects [ { question: ..., options: { ... } } ]
 * - Standard wrapped { questions: [...] }
 */
export function normalizeAndValidateJSONQuestions(rawInput: unknown): JsonImportResult {
  const errors: string[] = [];
  const validQuestions: Question[] = [];
  const lessonSet = new Set<string>();

  if (!rawInput) {
    return { validQuestions: [], errors: ['No data provided or JSON is empty.'], lessonNames: [] };
  }

  let parsed: unknown = rawInput;
  if (typeof rawInput === 'string') {
    try {
      parsed = JSON.parse(rawInput);
    } catch (err) {
      return {
        validQuestions: [],
        errors: [`JSON parse error: ${(err as Error).message}`],
        lessonNames: [],
      };
    }
  }

  // Helper to extract questions from a list of sections/lessons
  const unpackSection = (
    sections: unknown[],
    defaultCategory: Category
  ) => {
    sections.forEach((sec, secIdx) => {
      if (typeof sec !== 'object' || sec === null) return;
      const s = sec as Record<string, unknown>;
      const title = (s.title || s.lesson || s.name || s.subcategory || `Section ${secIdx + 1}`).toString().trim();
      const rawQs = s.questions || s.mcqs || s.items;
      if (Array.isArray(rawQs)) {
        rawQs.forEach((item, qIdx) => {
          processQuestionItem(item, qIdx + 1, title, defaultCategory);
        });
      }
    });
  };

  const processQuestionItem = (
    item: unknown,
    rowNum: number,
    inheritedLessonTitle?: string,
    inheritedCategory?: Category
  ) => {
    if (typeof item !== 'object' || item === null) {
      errors.push(`Item ${rowNum}: Not a valid object.`);
      return;
    }

    const q = item as Record<string, unknown>;

    // 1. Question Text - exactly as supplied
    const questionText = (
      q.question_text ||
      q.question ||
      q.text ||
      q.prompt ||
      ''
    ).toString().trim();

    if (!questionText) {
      errors.push(`Item ${rowNum}: Missing question text.`);
      return;
    }

    // 2. Options Extraction - exactly as supplied
    let optA = '';
    let optB = '';
    let optC = '';
    let optD = '';

    if (q.options && typeof q.options === 'object') {
      if (Array.isArray(q.options)) {
        optA = (q.options[0] ?? '').toString().trim();
        optB = (q.options[1] ?? '').toString().trim();
        optC = (q.options[2] ?? '').toString().trim();
        optD = (q.options[3] ?? '').toString().trim();
      } else {
        const optObj = q.options as Record<string, unknown>;
        optA = (optObj.A || optObj.a || optObj['1'] || '').toString().trim();
        optB = (optObj.B || optObj.b || optObj['2'] || '').toString().trim();
        optC = (optObj.C || optObj.c || optObj['3'] || '').toString().trim();
        optD = (optObj.D || optObj.d || optObj['4'] || '').toString().trim();
      }
    } else {
      optA = (q.option_a || q.optionA || q.A || q.a || '').toString().trim();
      optB = (q.option_b || q.optionB || q.B || q.b || '').toString().trim();
      optC = (q.option_c || q.optionC || q.C || q.c || '').toString().trim();
      optD = (q.option_d || q.optionD || q.D || q.d || '').toString().trim();
    }

    if (!optA || !optB || !optC || !optD) {
      errors.push(`Item ${rowNum} ("${questionText.slice(0, 30)}..."): Missing one or more options (A, B, C, D).`);
      return;
    }

    // 3. Correct Option - exactly as supplied
    const rawCorrect = (
      q.correct_answer ||
      q.correct_option ||
      q.correct ||
      q.answer ||
      ''
    ).toString().trim().toUpperCase();

    let correctOpt: CorrectOption | null = null;
    if (['A', 'B', 'C', 'D'].includes(rawCorrect)) {
      correctOpt = rawCorrect as CorrectOption;
    } else if (rawCorrect === '1') correctOpt = 'A';
    else if (rawCorrect === '2') correctOpt = 'B';
    else if (rawCorrect === '3') correctOpt = 'C';
    else if (rawCorrect === '4') correctOpt = 'D';

    if (!correctOpt) {
      errors.push(`Item ${rowNum} ("${questionText.slice(0, 30)}..."): Correct answer must be A, B, C, or D (got "${rawCorrect}").`);
      return;
    }

    // 4. Explanation - exactly as supplied
    const explanation = (q.explanation || q.rationale || q.reason || '').toString().trim();
    if (!explanation) {
      errors.push(`Item ${rowNum} ("${questionText.slice(0, 30)}..."): Missing explanation.`);
      return;
    }

    // 5. Difficulty - exactly as supplied
    const rawDiff = (q.difficulty || 'medium').toString().trim().toLowerCase();
    const difficulty: Difficulty = (['simple', 'medium', 'difficult'].includes(rawDiff)
      ? rawDiff
      : 'medium') as Difficulty;

    // 6. Lesson & Category mapping
    const rawLesson = (
      inheritedLessonTitle ||
      q.lesson_name ||
      q.lesson_title ||
      q.lesson ||
      q.poem ||
      q.subcategory ||
      q.topic ||
      'How to Tell Wild Animals'
    ).toString().trim();

    const inferred = inferCategoryAndLessonId(rawLesson, inheritedCategory || (q.category as string));
    lessonSet.add(inferred.lessonTitle);

    const questionNum = typeof q.question_number === 'number' ? q.question_number : rowNum;
    const cleanId = `q-${inferred.lessonId}-${questionNum}`;

    validQuestions.push({
      id: cleanId,
      question_text: questionText,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: correctOpt,
      explanation,
      difficulty,
      category: inferred.category,
      subcategory: inferred.lessonTitle,
      lesson_id: inferred.lessonId,
      question_number: questionNum,
      story: q.story ? q.story.toString() : undefined,
      created_at: (q.created_at || new Date().toISOString()).toString(),
    });
  };

  // Inspect root object structure
  if (Array.isArray(parsed)) {
    parsed.forEach((item, idx) => processQuestionItem(item, idx + 1));
  } else if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;

    let processedNested = false;
    if (Array.isArray(obj.poems)) {
      unpackSection(obj.poems, 'poem');
      processedNested = true;
    }
    if (Array.isArray(obj.prose)) {
      unpackSection(obj.prose, 'prose');
      processedNested = true;
    }
    if (Array.isArray(obj.grammar)) {
      unpackSection(obj.grammar, 'grammar');
      processedNested = true;
    }
    if (Array.isArray(obj.vocabulary)) {
      unpackSection(obj.vocabulary, 'vocabulary');
      processedNested = true;
    }

    if (!processedNested) {
      if (Array.isArray(obj.questions)) {
        obj.questions.forEach((item, idx) => processQuestionItem(item, idx + 1));
      } else if (Array.isArray(obj.mcqs)) {
        obj.mcqs.forEach((item, idx) => processQuestionItem(item, idx + 1));
      } else if (obj.title && Array.isArray(obj.questions)) {
        unpackSection([obj], (obj.category as Category) || 'prose');
      } else {
        const values = Object.values(obj);
        if (values.length > 0 && typeof values[0] === 'object' && !Array.isArray(values[0])) {
          values.forEach((item, idx) => processQuestionItem(item, idx + 1));
        } else {
          return {
            validQuestions: [],
            errors: ['JSON must contain a list of questions or standard section arrays (poems, prose, etc.).'],
            lessonNames: [],
          };
        }
      }
    }
  }

  return {
    validQuestions,
    errors,
    lessonNames: Array.from(lessonSet),
  };
}

/**
 * Match lesson/poem name to AP SSC syllabus unit and category
 */
function inferCategoryAndLessonId(
  lessonName: string,
  explicitCategory?: string
): { category: Category; lessonId: string; lessonTitle: string } {
  const norm = lessonName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Check poems - exact match first
  for (const poem of POEMS) {
    const poemNorm = poem.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm === poemNorm) {
      return { category: 'poem', lessonId: poem.id, lessonTitle: poem.title };
    }
  }
  for (const poem of POEMS) {
    const poemNorm = poem.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes(poemNorm) || poemNorm.includes(norm)) {
      return { category: 'poem', lessonId: poem.id, lessonTitle: poem.title };
    }
  }

  // Check prose - exact match first
  for (const prose of PROSE_LESSONS) {
    const proseNorm = prose.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm === proseNorm) {
      return { category: 'prose', lessonId: prose.id, lessonTitle: prose.title };
    }
  }
  for (const prose of PROSE_LESSONS) {
    const proseNorm = prose.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes(proseNorm) || proseNorm.includes(norm)) {
      return { category: 'prose', lessonId: prose.id, lessonTitle: prose.title };
    }
  }

  // Check grammar - exact match first
  for (const gram of GRAMMAR_TOPICS) {
    const gramNorm = gram.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm === gramNorm) {
      return { category: 'grammar', lessonId: gram.id, lessonTitle: gram.title };
    }
  }
  for (const gram of GRAMMAR_TOPICS) {
    const gramNorm = gram.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes(gramNorm) || gramNorm.includes(norm)) {
      return { category: 'grammar', lessonId: gram.id, lessonTitle: gram.title };
    }
  }

  // Check vocab - exact match first
  for (const voc of VOCABULARY_TOPICS) {
    const vocNorm = voc.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm === vocNorm) {
      return { category: 'vocabulary', lessonId: voc.id, lessonTitle: voc.title };
    }
  }
  for (const voc of VOCABULARY_TOPICS) {
    const vocNorm = voc.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes(vocNorm) || vocNorm.includes(norm)) {
      return { category: 'vocabulary', lessonId: voc.id, lessonTitle: voc.title };
    }
  }

  const cat = (explicitCategory?.toLowerCase() || 'poem') as Category;
  const validCat: Category = ['prose', 'poem', 'grammar', 'vocabulary'].includes(cat) ? cat : 'poem';

  return {
    category: validCat,
    lessonId: lessonName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    lessonTitle: lessonName,
  };
}

/**
 * Get the initial authoritative questions bundle loaded into the app
 */
export function getBundledAuthoritativeQuestions(): Question[] {
  const result = normalizeAndValidateJSONQuestions(authoritativeJsonRaw);
  return result.validQuestions;
}
