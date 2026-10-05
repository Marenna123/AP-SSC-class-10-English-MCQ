import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Sparkles,
  Trophy,
  RotateCcw,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Award,
  ListChecks,
  Filter,
  PenTool,
  Save,
  Trash2,
  Edit3,
  Table,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Category, CorrectOption, Difficulty, Question, TestResult } from '../types';
import { QuestionCard } from './QuestionCard';
import { CreativeExpressionsView } from './CreativeExpressionsView';
import { MissionMarchPracticeView } from './MissionMarchPracticeView';
import {
  ALL_RAW_CREATIVE_QUESTIONS,
  CreativePracticeQuestion,
} from '../data/creativeExpressionsData';
import {
  ALL_RAW_MISSION_MARCH_QUESTIONS,
  RawMissionMarchQuestion,
} from '../data/missionMarchData';

interface PracticeTestViewProps {
  allQuestions: Question[];
  onSaveTestResult: (result: Omit<TestResult, 'id' | 'user_id' | 'completed_at'>) => void;
  isBookmarked: (qId: string) => boolean;
  onToggleBookmark: (qId: string) => void;
  onRecordAttempt: (qId: string, option: CorrectOption, isCorrect: boolean) => void;
  onBackToHome: () => void;
}

// Unified question type used for Practice Sessions
export interface PracticeSessionQuestion extends Omit<Partial<Question>, 'category'> {
  id: string;
  question_text: string;
  category: Category | 'creative-expressions' | 'mission-march';
  subcategory: string;
  difficulty: Difficulty;
  isCreative?: boolean;
  hints?: string[];
  example_answer?: string;
  data_labels?: string[];
  table?: (string | number)[][];
  marks?: number;
}

export const PracticeTestView: React.FC<PracticeTestViewProps> = ({
  allQuestions,
  onSaveTestResult,
  isBookmarked,
  onToggleBookmark,
  onRecordAttempt,
  onBackToHome,
}) => {
  // Config state
  const [testCount, setTestCount] = useState<10 | 25 | 50>(10);
  const [categoryFilter, setCategoryFilter] = useState<
    'mixed' | 'prose' | 'poem' | 'grammar' | 'vocabulary' | 'creative-expressions' | 'mission-march'
  >('mixed');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'mixed'>('mixed');

  // Creative expressions practice mode: 'hierarchy' (exact Q35-37 structure) or 'test' (test simulator)
  const [creativePracticeMode, setCreativePracticeMode] = useState<'hierarchy' | 'test'>('hierarchy');

  // Mission March practice mode: 'hierarchy' (exact Q18-33 structure) or 'test' (test simulator)
  const [missionMarchPracticeMode, setMissionMarchPracticeMode] = useState<'hierarchy' | 'test'>('hierarchy');

  // Test session state
  const [activeQuestions, setActiveQuestions] = useState<PracticeSessionQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState<
    Record<string, { option?: CorrectOption; isCorrect?: boolean; writtenAnswer?: string }>
  >({});
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Active question student answer editing
  const [currentAnswerDraft, setCurrentAnswerDraft] = useState('');
  const [savedDraftStatus, setSavedDraftStatus] = useState(false);
  const [showExampleInTest, setShowExampleInTest] = useState(false);

  // Load any previously saved answer when active question changes
  useEffect(() => {
    if (isTestActive && activeQuestions.length > 0) {
      const q = activeQuestions[currentIndex];
      if (q && q.isCreative) {
        setShowExampleInTest(false);
        setSavedDraftStatus(false);
        const stored =
          answersMap[q.id]?.writtenAnswer ||
          localStorage.getItem(`ap_ssc_ce_answer_${q.id}`) ||
          '';
        setCurrentAnswerDraft(stored);
      }
    }
  }, [currentIndex, isTestActive, activeQuestions]);

  // Dynamic question counts
  const creativeQuestionsCount = ALL_RAW_CREATIVE_QUESTIONS.length; // 42 dynamically loaded
  const missionMarchQuestionsCount = ALL_RAW_MISSION_MARCH_QUESTIONS.length; // 118 dynamically loaded (Q.18 to Q.33)
  const poemsCount = allQuestions.filter((q) => q.category === 'poem').length;
  const proseCount = allQuestions.filter((q) => q.category === 'prose').length;
  const grammarCount = allQuestions.filter((q) => q.category === 'grammar').length;
  const vocabCount = allQuestions.filter((q) => q.category === 'vocabulary').length;
  const totalAllSubjectsCount = allQuestions.length + creativeQuestionsCount + missionMarchQuestionsCount;

  // Convert Creative Expressions question into unified format
  const mapCreativeToSessionQuestion = (
    cq: CreativePracticeQuestion
  ): PracticeSessionQuestion => {
    return {
      id: cq.id,
      question_text: cq.prompt,
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      explanation: cq.example_answer,
      category: 'creative-expressions',
      subcategory: `${cq.question_no} ${cq.part} — ${cq.type.toUpperCase()}`,
      lesson_id: `ce-${cq.question_no}-${cq.part.toLowerCase()}`,
      difficulty: 'medium',
      question_number: cq.question_no,
      hints: cq.hints,
      example_answer: cq.example_answer,
      data_labels: cq.data_labels,
      table: cq.table,
      isCreative: true,
      marks: 10,
    };
  };

  // Convert Mission March question into unified format
  const mapMissionMarchToSessionQuestion = (
    mq: RawMissionMarchQuestion
  ): PracticeSessionQuestion => {
    return {
      id: mq.id,
      question_text: mq.question,
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      explanation: mq.explanation || mq.answer,
      category: 'mission-march',
      subcategory: `Q.${mq.q_no} — ${mq.type}`,
      lesson_id: `mm-q${mq.q_no}`,
      difficulty: 'medium',
      question_number: mq.q_no,
      example_answer: mq.answer,
      isCreative: true,
      marks: 1,
    };
  };

  // Start test
  const handleStartTest = () => {
    let pool: PracticeSessionQuestion[] = [];

    if (categoryFilter === 'creative-expressions') {
      // Use exclusively Creative Expressions questions
      pool = ALL_RAW_CREATIVE_QUESTIONS.map(mapCreativeToSessionQuestion);
    } else if (categoryFilter === 'mission-march') {
      // Use exclusively Mission March (Q.18 to Q.33) questions
      pool = ALL_RAW_MISSION_MARCH_QUESTIONS.map(mapMissionMarchToSessionQuestion);
    } else if (categoryFilter === 'mixed') {
      // All Subjects: include standard curriculum questions, creative expressions, and mission march
      const standardPool: PracticeSessionQuestion[] = allQuestions.map((q) => ({
        ...q,
        isCreative: false,
      }));
      const creativePool: PracticeSessionQuestion[] = ALL_RAW_CREATIVE_QUESTIONS.map(
        mapCreativeToSessionQuestion
      );
      const missionMarchPool: PracticeSessionQuestion[] = ALL_RAW_MISSION_MARCH_QUESTIONS.map(
        mapMissionMarchToSessionQuestion
      );
      pool = [...standardPool, ...creativePool, ...missionMarchPool];
    } else {
      // Specific subject: Prose, Poems, Grammar, or Vocabulary
      pool = allQuestions
        .filter((q) => q.category === categoryFilter)
        .map((q) => ({
          ...q,
          isCreative: false,
        }));
    }

    if (
      difficultyFilter !== 'mixed' &&
      categoryFilter !== 'creative-expressions' &&
      categoryFilter !== 'mission-march'
    ) {
      pool = pool.filter((q) => q.difficulty === difficultyFilter);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(testCount, shuffled.length));

    if (chosen.length === 0) {
      alert('No questions match this filter combination. Please select broader options.');
      return;
    }

    setActiveQuestions(chosen);
    setCurrentIndex(0);
    setAnswersMap({});
    setIsTestActive(true);
    setIsTestFinished(false);
    setIsReviewing(false);
    setShowExampleInTest(false);
  };

  // Submit standard MCQ answer
  const handleSubmitAnswer = (selectedOption: CorrectOption, isCorrect: boolean) => {
    const q = activeQuestions[currentIndex];
    setAnswersMap((prev) => ({
      ...prev,
      [q.id]: { option: selectedOption, isCorrect },
    }));
    onRecordAttempt(q.id, selectedOption, isCorrect);
  };

  // Save student written answer in Creative Expressions test
  const handleSaveCreativeAnswer = (questionId: string) => {
    try {
      localStorage.setItem(`ap_ssc_ce_answer_${questionId}`, currentAnswerDraft);
      setAnswersMap((prev) => ({
        ...prev,
        [questionId]: {
          writtenAnswer: currentAnswerDraft,
          isCorrect: currentAnswerDraft.trim().length > 0,
        },
      }));
      setSavedDraftStatus(true);
      setTimeout(() => setSavedDraftStatus(false), 3000);
    } catch (e) {
      // fallback
    }
  };

  // Clear student written answer in Creative Expressions test
  const handleClearCreativeAnswer = (questionId: string) => {
    setCurrentAnswerDraft('');
    try {
      localStorage.removeItem(`ap_ssc_ce_answer_${questionId}`);
      setAnswersMap((prev) => ({
        ...prev,
        [questionId]: {
          writtenAnswer: '',
          isCorrect: false,
        },
      }));
    } catch (e) {
      // fallback
    }
    setSavedDraftStatus(false);
  };

  const handleNextQuestion = () => {
    // If current question is creative and student wrote something, automatically save draft to state
    const currentQ = activeQuestions[currentIndex];
    if (currentQ?.isCreative && currentAnswerDraft.trim().length > 0) {
      setAnswersMap((prev) => ({
        ...prev,
        [currentQ.id]: {
          writtenAnswer: currentAnswerDraft,
          isCorrect: true,
        },
      }));
      try {
        localStorage.setItem(`ap_ssc_ce_answer_${currentQ.id}`, currentAnswerDraft);
      } catch (e) {
        // fallback
      }
    }

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let correctCount = 0;
    for (const q of activeQuestions) {
      if (q.isCreative) {
        if (answersMap[q.id]?.writtenAnswer?.trim()) {
          correctCount++;
        }
      } else {
        if (answersMap[q.id]?.isCorrect) {
          correctCount++;
        }
      }
    }

    const wrongCount = activeQuestions.length - correctCount;
    const percentage = Math.round((correctCount / activeQuestions.length) * 100);

    onSaveTestResult({
      test_type: `${categoryFilter}_${testCount}q`,
      total_questions: activeQuestions.length,
      correct_answers: correctCount,
      wrong_answers: wrongCount,
      percentage,
    });

    setIsTestActive(false);
    setIsTestFinished(true);
  };

  // Compute test score
  let correctCount = 0;
  for (const q of activeQuestions) {
    if (q.isCreative) {
      if (answersMap[q.id]?.writtenAnswer?.trim()) correctCount++;
    } else {
      if (answersMap[q.id]?.isCorrect) correctCount++;
    }
  }
  const wrongCount = activeQuestions.length - correctCount;
  const percentage =
    activeQuestions.length > 0
      ? Math.round((correctCount / activeQuestions.length) * 100)
      : 0;

  // Active Test Question Runner
  if (isTestActive && activeQuestions.length > 0) {
    const currentQuestion = activeQuestions[currentIndex];
    const isCreative = !!currentQuestion.isCreative;
    const wordCount = currentAnswerDraft
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return (
      <div className="space-y-4 pb-24 max-w-xl mx-auto">
        {/* Top Test Progress Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block">
              {currentQuestion?.category === 'mission-march'
                ? 'Mission March Practice Session'
                : isCreative
                ? 'Creative Expressions Practice Session'
                : 'AP SSC Board Exam Simulator'}
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              Question {currentIndex + 1} of {activeQuestions.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to end the practice session early?')) {
                  finishTest();
                }
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
            >
              Finish Early
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Display: Writing Practice Card for Creative Expressions, or QuestionCard for MCQs */}
        {isCreative ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Top Badge Info */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-600 text-white">
                  Question {currentIndex + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {currentQuestion.subcategory}
                </span>
              </div>
              {currentQuestion.marks === 10 && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  10 MARKS
                </span>
              )}
            </div>

            {/* Prompt / Task */}
            <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/40 p-4 rounded-xl border border-indigo-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wider">
                <PenTool className="w-3.5 h-3.5 text-indigo-700" />
                <span>Writing Task / Prompt:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Hints if available */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <div className="space-y-1.5 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hints &amp; Key Points:</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-700 pt-1">
                  {currentQuestion.hints.map((hint, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                      <span className="leading-relaxed font-medium">{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Data Labels if available (Information Transfer) */}
            {currentQuestion.data_labels && currentQuestion.data_labels.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block text-xs text-indigo-700">
                  📊 Graph Categories / Items:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentQuestion.data_labels.map((label, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-indigo-200 text-indigo-800 shadow-2xs"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Note: Exact numerical values are to be read directly from the printed graph in the original examination material.
                </p>
              </div>
            )}

            {/* Numerical Table if available (Information Transfer) */}
            {currentQuestion.table && currentQuestion.table.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 overflow-hidden space-y-2">
                <span className="font-extrabold text-slate-900 block text-xs text-indigo-700 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Data Table from Source Material:</span>
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-indigo-100/70 border-b border-indigo-200 text-indigo-900 font-black">
                        {currentQuestion.table[0].map((headerCell, cIdx) => (
                          <th key={cIdx} className="p-2.5 font-black">
                            {headerCell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentQuestion.table.slice(1).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-indigo-50/40">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-2.5 font-medium ${
                                cIdx === 0
                                  ? 'font-bold text-slate-900'
                                  : 'text-slate-700'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Student Write Your Answer Area */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Write Your Answer:</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {wordCount} words • {currentAnswerDraft.length} chars
                </span>
              </div>
              <textarea
                value={currentAnswerDraft}
                onChange={(e) => {
                  setCurrentAnswerDraft(e.target.value);
                  setSavedDraftStatus(false);
                }}
                placeholder="Type your practice response here... (You can compare your work with the Model Answer below)"
                rows={6}
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white leading-relaxed resize-y font-sans"
              />
              <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveCreativeAnswer(currentQuestion.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-98"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save / Submit Answer</span>
                  </button>
                  {currentAnswerDraft.trim().length > 0 && (
                    <button
                      onClick={() => handleClearCreativeAnswer(currentQuestion.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
                {savedDraftStatus && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answer Saved!</span>
                  </span>
                )}
              </div>
            </div>

            {/* View / Hide Example Answer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => setShowExampleInTest(!showExampleInTest)}
                className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-98"
              >
                {showExampleInTest ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Example Answer</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Example Answer</span>
                  </>
                )}
              </button>
              {currentAnswerDraft.trim().length > 0 && showExampleInTest && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Compare your answer above with the model answer below
                </span>
              )}
            </div>

            {/* Model Answer from JSON (Initially hidden) */}
            {showExampleInTest && (
              <div className="bg-amber-50/70 rounded-2xl border border-amber-300/80 p-4 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Example Answer (Model Answer)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Teacher-Prepared Model Response
                  </span>
                </div>
                <div className="bg-white/95 p-4 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
                  {currentQuestion.example_answer}
                </div>
                <p className="text-[10px] text-amber-800/80 italic">
                  * Clearly labeled as a teacher-prepared model answer for reference and self-assessment, not an official textbook answer.
                </p>
              </div>
            )}

            {/* Navigation Next / Finish button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={handleNextQuestion}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <span>
                  {currentIndex === activeQuestions.length - 1
                    ? 'Finish Session'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <QuestionCard
            question={currentQuestion as Question}
            currentIndex={currentIndex + 1}
            totalQuestions={activeQuestions.length}
            isBookmarked={isBookmarked(currentQuestion.id)}
            onToggleBookmark={() => onToggleBookmark(currentQuestion.id)}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentIndex === activeQuestions.length - 1}
          />
        )}
      </div>
    );
  }

  // Test Finished: Result Screen
  if (isTestFinished) {
    const hasCreative = activeQuestions.some((q) => q.isCreative);

    return (
      <div className="max-w-xl mx-auto space-y-5 pb-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] mb-1">
            PRACTICE SESSION COMPLETED
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            AP SSC Class 10 English • {categoryFilter.toUpperCase().replace('-', ' ')}
          </p>

          {/* Primary Score Tiles */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Completed
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
                {correctCount} / {activeQuestions.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Completion Rate
              </span>
              <span
                className={`text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] ${
                  percentage >= 75
                    ? 'text-emerald-600'
                    : percentage >= 50
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {percentage}%
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">Attempted: {correctCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center gap-2">
              <span className="font-bold text-sm">
                Remaining: {wrongCount}
              </span>
            </div>
          </div>

          {/* Performance Remark */}
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs sm:text-sm font-medium leading-relaxed mb-6">
            {hasCreative ? (
              <span>
                ✍️ <strong>Great Writing Practice!</strong> Review the teacher-prepared model answers below to compare your structure, discourse markers, and vocabulary against the rubric.
              </span>
            ) : percentage >= 80 ? (
              <span>🌟 <strong>Outstanding!</strong> You are well prepared for an A1 Grade in your AP SSC board examination.</span>
            ) : percentage >= 60 ? (
              <span>👍 <strong>Good work!</strong> Practice the incorrect questions to push your accuracy above 85%.</span>
            ) : (
              <span>📖 <strong>Keep practicing!</strong> Review the textbook explanations and re-attempt this topic.</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              id="test-review-answers-btn"
              onClick={() => setIsReviewing(!isReviewing)}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>{isReviewing ? 'Hide Review' : 'Review Answers & Model Responses'}</span>
            </button>

            <button
              id="test-retry-btn"
              onClick={handleStartTest}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <button
              id="test-back-home-btn"
              onClick={onBackToHome}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Review Answers List */}
        {isReviewing && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif] px-1">
              Answer Review ({activeQuestions.length} Questions)
            </h3>
            {activeQuestions.map((q, idx) => {
              if (q.isCreative) {
                const written =
                  answersMap[q.id]?.writtenAnswer ||
                  localStorage.getItem(`ap_ssc_ce_answer_${q.id}`) ||
                  '';
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-indigo-200 bg-white space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-indigo-700">
                        Q{idx + 1}. {q.subcategory}
                      </span>
                      {q.marks === 10 && (
                        <span className="font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          10 MARKS
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900">{q.question_text}</p>
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">
                          Your Written Response:
                        </span>
                        <div className="text-slate-800 whitespace-pre-line font-sans leading-relaxed">
                          {written.trim() ? written : <em className="text-slate-400">No answer written during this session.</em>}
                        </div>
                      </div>
                      <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                        <span className="font-black text-amber-900 block mb-1 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Example Answer (Model Answer):</span>
                        </span>
                        <div className="text-slate-800 whitespace-pre-line font-sans leading-relaxed">
                          {q.example_answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const attempt = answersMap[q.id];
              const isRight = attempt?.isCorrect;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border bg-white ${
                    isRight ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-500">
                      Q{idx + 1}. {q.subcategory}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        isRight
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isRight ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-2">{q.question_text}</p>
                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      Your Choice:{' '}
                      <strong className={isRight ? 'text-emerald-700' : 'text-rose-700'}>
                        {attempt?.option || 'Skipped'}
                      </strong>
                    </div>
                    <div>
                      Correct Choice:{' '}
                      <strong className="text-emerald-700">
                        {q.correct_option}){' '}
                        {q[`option_${q.correct_option?.toLowerCase()}` as keyof Question]}
                      </strong>
                    </div>
                    <div className="pt-1 text-slate-500">
                      <span className="font-semibold text-slate-700">Explanation:</span>{' '}
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Setup / Configuration Launcher Screen
  return (
    <div className="max-w-xl mx-auto space-y-5 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-indigo-800 text-white rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
            Practice Session
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight mb-1">
          Practice Test Arena
        </h2>
        <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
          Configure realistic tests across all AP SSC English syllabus subjects including Prose, Poems, Grammar, Vocabulary, and Creative Expressions (Q.35–37).
        </p>
      </div>

      {/* 1. Test Length Selector (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif] mb-3 flex items-center gap-1.5">
          <ListChecks className="w-4 h-4 text-indigo-600" />
          Choose Test Length
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            id="test-len-10"
            onClick={() => setTestCount(10)}
            className={`p-3 rounded-xl border text-left transition-all ${
              testCount === 10
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Fast</div>
            <div className="text-sm sm:text-base font-extrabold">Quick Test</div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5">10 questions</div>
          </button>

          <button
            id="test-len-25"
            onClick={() => setTestCount(25)}
            className={`p-3 rounded-xl border text-left transition-all ${
              testCount === 25
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Standard</div>
            <div className="text-sm sm:text-base font-extrabold">Practice Test</div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5">25 questions</div>
          </button>

          <button
            id="test-len-50"
            onClick={() => setTestCount(50)}
            className={`p-3 rounded-xl border text-left transition-all ${
              testCount === 50
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Board Mock</div>
            <div className="text-sm sm:text-base font-extrabold">Full Test</div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5">50 questions</div>
          </button>
        </div>
      </div>

      {/* 2. Category Scope Filter (All Subject Cards: All Subjects, Poems, Prose, Grammar, Vocabulary, Creative Expressions, Mission March Practice) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif] mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-indigo-600" />
            Syllabus Subject Focus
          </span>
          <span className="text-xs text-slate-400 font-normal">
            7 Focus Areas Available
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            {
              id: 'mixed',
              label: 'All Subjects',
              sublabel: 'Full Curriculum',
              count: totalAllSubjectsCount,
              icon: <Layers className="w-3.5 h-3.5" />,
            },
            {
              id: 'poem',
              label: 'Poems',
              sublabel: 'Poetry Units',
              count: poemsCount,
              icon: <BookOpen className="w-3.5 h-3.5" />,
            },
            {
              id: 'prose',
              label: 'Prose Lessons',
              sublabel: 'Reading Units',
              count: proseCount,
              icon: <BookOpen className="w-3.5 h-3.5" />,
            },
            {
              id: 'grammar',
              label: 'Grammar',
              sublabel: 'Topics 15–23',
              count: grammarCount,
              icon: <FileCheck className="w-3.5 h-3.5" />,
            },
            {
              id: 'vocabulary',
              label: 'Vocabulary',
              sublabel: 'Topics 24–34',
              count: vocabCount,
              icon: <Award className="w-3.5 h-3.5" />,
            },
            {
              id: 'creative-expressions',
              label: 'Creative Expressions',
              sublabel: 'Questions 35–37',
              count: creativeQuestionsCount,
              icon: <PenTool className="w-3.5 h-3.5" />,
            },
            {
              id: 'mission-march',
              label: 'Mission March Practice',
              sublabel: 'Questions 18–33',
              count: missionMarchQuestionsCount,
              icon: <Sparkles className="w-3.5 h-3.5" />,
            },
          ].map((cat) => {
            const isSelected = categoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                id={`test-cat-${cat.id}`}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {cat.sublabel}
                  </span>
                  <div className={`${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {cat.icon}
                  </div>
                </div>

                <span className="font-extrabold text-sm sm:text-base leading-snug">
                  {cat.label}
                </span>

                <span
                  className={`text-[11px] font-medium mt-1 ${
                    isSelected ? 'text-indigo-200' : 'text-indigo-600'
                  }`}
                >
                  {cat.count} {cat.count === 1 ? 'question' : 'questions'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* When Mission March Practice is selected: Provide direct access to both Hierarchy Navigation & Test Simulator */}
      {categoryFilter === 'mission-march' ? (
        <div className="space-y-4">
          {/* Mode Switcher for Mission March */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs grid grid-cols-2 gap-1">
            <button
              id="mm-mode-hierarchy-btn"
              onClick={() => setMissionMarchPracticeMode('hierarchy')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                missionMarchPracticeMode === 'hierarchy'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Category Hierarchy (Q.18–33)</span>
            </button>

            <button
              id="mm-mode-test-btn"
              onClick={() => setMissionMarchPracticeMode('test')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                missionMarchPracticeMode === 'test'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Revision Test Simulator</span>
            </button>
          </div>

          {missionMarchPracticeMode === 'hierarchy' ? (
            /* EXACT MISSION MARCH HIERARCHY PRACTICE SECTION */
            <div className="space-y-3">
              <MissionMarchPracticeView onBackToSession={() => setCategoryFilter('mixed')} />
            </div>
          ) : (
            /* MISSION MARCH TEST SIMULATOR START SCREEN */
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Revision Practice Test
                </span>
                <h4 className="text-base font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  Mission March Simulator ({testCount} Questions)
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Practice board revision questions across Q.18 to Q.33, enter your answers, and check against official solutions.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Questions</span>
                  <strong className="text-slate-900 font-bold">{Math.min(testCount, missionMarchQuestionsCount)}</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Scope</span>
                  <strong className="text-indigo-700 font-bold">Q.18 to Q.33</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Bank</span>
                  <strong className="text-teal-700 font-bold">{missionMarchQuestionsCount} Qs</strong>
                </div>
              </div>

              <button
                id="start-mission-march-test-btn"
                onClick={handleStartTest}
                className="w-full py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-base shadow-md shadow-teal-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Begin {Math.min(testCount, missionMarchQuestionsCount)} Mission March Practice Tasks</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : categoryFilter === 'creative-expressions' ? (
        <div className="space-y-4">
          {/* Mode Switcher for Creative Expressions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs grid grid-cols-2 gap-1">
            <button
              id="ce-mode-hierarchy-btn"
              onClick={() => setCreativePracticeMode('hierarchy')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                creativePracticeMode === 'hierarchy'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Discourse Hierarchy (Q.35–37)</span>
            </button>

            <button
              id="ce-mode-test-btn"
              onClick={() => setCreativePracticeMode('test')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                creativePracticeMode === 'test'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Writing Test Simulator</span>
            </button>
          </div>

          {creativePracticeMode === 'hierarchy' ? (
            /* EXACT HIERARCHY PRACTICE SECTION */
            <div className="space-y-3">
              <CreativeExpressionsView onBackToCurriculum={() => setCategoryFilter('mixed')} />
            </div>
          ) : (
            /* WRITING TEST SIMULATOR START SCREEN */
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Writing Practice Test
                </span>
                <h4 className="text-base font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  Creative Expressions Simulator ({testCount} Questions)
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Practice writing complete answers in dedicated text areas with word counters, save your responses, and compare with teacher-prepared Model Answers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Questions</span>
                  <strong className="text-slate-900 font-bold">{Math.min(testCount, creativeQuestionsCount)}</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Each Question</span>
                  <strong className="text-amber-700 font-bold">10 Marks</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Model Answers</span>
                  <strong className="text-emerald-700 font-bold">Included</strong>
                </div>
              </div>

              <button
                id="start-creative-test-btn"
                onClick={handleStartTest}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Begin {Math.min(testCount, creativeQuestionsCount)} Writing Practice Tasks</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* STANDARD SUBJECTS SETTINGS: Difficulty setting & Begin button */
        <>
          {/* 3. Difficulty Filter (Section 12) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif] mb-3">
              Difficulty Setting
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'mixed', label: '🔵 Mixed' },
                { id: 'simple', label: '🟢 Simple' },
                { id: 'medium', label: '🟡 Medium' },
                { id: 'difficult', label: '🔴 Difficult' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  id={`test-diff-${diff.id}`}
                  onClick={() => setDifficultyFilter(diff.id as any)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    difficultyFilter === diff.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            id="start-practice-test-btn"
            onClick={handleStartTest}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>Begin {testCount} Questions Test</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};
