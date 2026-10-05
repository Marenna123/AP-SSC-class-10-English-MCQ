import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  FileCheck,
  HelpCircle,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  MISSION_MARCH_CATEGORIES,
  MISSION_MARCH_BY_QNO,
  RawMissionMarchQuestion,
  MissionMarchCategoryWithQuestions,
} from '../data/missionMarchData';

interface MissionMarchPracticeViewProps {
  onBackToSession?: () => void;
  initialQNo?: number | null;
}

export const MissionMarchPracticeView: React.FC<MissionMarchPracticeViewProps> = ({
  onBackToSession,
  initialQNo = null,
}) => {
  // Navigation state: null = list of all 16 categories; number = viewing specific Q.18-Q.33
  const [selectedQNo, setSelectedQNo] = useState<number | null>(initialQNo);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Track expanded answers: map of question ID to boolean
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  // Student written responses per question
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  // Load saved answers from localStorage on mount
  useEffect(() => {
    try {
      const initialAnswers: Record<string, string> = {};
      MISSION_MARCH_CATEGORIES.forEach((cat) => {
        cat.questions.forEach((q) => {
          const stored = localStorage.getItem(`ap_ssc_mm_answer_${q.id}`);
          if (stored) {
            initialAnswers[q.id] = stored;
          }
        });
      });
      setUserAnswers(initialAnswers);
    } catch {
      // fallback
    }
  }, []);

  const activeCategory: MissionMarchCategoryWithQuestions | undefined =
    selectedQNo ? MISSION_MARCH_BY_QNO[selectedQNo] : undefined;

  const toggleAnswer = (questionId: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleAnswerChange = (questionId: string, text: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
    if (savedStatus[questionId]) {
      setSavedStatus((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  const handleSaveAnswer = (questionId: string) => {
    const textToSave = userAnswers[questionId] || '';
    try {
      localStorage.setItem(`ap_ssc_mm_answer_${questionId}`, textToSave);
      setSavedStatus((prev) => ({
        ...prev,
        [questionId]: true,
      }));
      setTimeout(() => {
        setSavedStatus((prev) => ({
          ...prev,
          [questionId]: false,
        }));
      }, 3000);
    } catch {
      // fallback
    }
  };

  const handleClearAnswer = (questionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: '',
    }));
    try {
      localStorage.removeItem(`ap_ssc_mm_answer_${questionId}`);
    } catch {
      // fallback
    }
    setSavedStatus((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  // Filtered categories when searching
  const filteredCategories = MISSION_MARCH_CATEGORIES.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.displayTitle.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.questions.some((item) => item.question.toLowerCase().includes(q))
    );
  });

  const totalQuestionsCount = MISSION_MARCH_CATEGORIES.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );

  const totalAnsweredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k]?.trim().length > 0
  ).length;

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <FileCheck className="w-5 h-5 text-teal-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Practice Branch
            </span>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-100 border border-teal-400/30">
            {totalQuestionsCount} Questions
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight mb-1">
          MISSION MARCH PRACTICE
        </h2>
        <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
          Comprehensive board revision covering Questions 18 to 33 across grammar, vocabulary, editing, and language skills.
        </p>

        {/* Progress Strip */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-teal-200">
          <span>Questions Practiced:</span>
          <span className="font-bold text-white">
            {totalAnsweredCount} of {totalQuestionsCount}
          </span>
        </div>
      </div>

      {/* Navigation Breadcrumb / Top Bar */}
      {selectedQNo ? (
        /* Inside a Category View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedQNo(null)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>All Question Categories</span>
            </button>

            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              {activeCategory?.displayTitle}
            </span>
          </div>

          {/* Active Category Header Card */}
          {activeCategory && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  {activeCategory.code} Practice
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {activeCategory.questions.length} Practice Items
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                {activeCategory.displayTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeCategory.description}
              </p>
            </div>
          )}

          {/* Question Cards List */}
          <div className="space-y-4">
            {activeCategory?.questions.map((q, idx) => {
              const isExpanded = expandedAnswers[q.id];
              const studentAnswer = userAnswers[q.id] || '';
              const isSaved = savedStatus[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5 transition-all hover:border-slate-300"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {activeCategory.code} • Item {idx + 1} of {activeCategory.questions.length}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {q.type}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                    {q.question}
                  </div>

                  {/* Write Your Answer Section */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Write Your Answer</span>
                      </label>
                      {studentAnswer.trim() && (
                        <button
                          onClick={() => handleClearAnswer(q.id)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>

                    <textarea
                      value={studentAnswer}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your practice answer here..."
                      rows={2}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-sans"
                    />

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => handleSaveAnswer(q.id)}
                        className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Answer</span>
                      </button>

                      {isSaved && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 animate-in fade-in duration-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved to Device</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View / Hide Answer Toggle */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Answer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Answer</span>
                        </>
                      )}
                    </button>

                    {studentAnswer.trim() && isExpanded && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        Compare your answer with the model solution below
                      </span>
                    )}
                  </div>

                  {/* Expanded Answer Box */}
                  {isExpanded && (
                    <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-3.5 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Model Answer / Solution</span>
                        </span>
                        {q.answer_status === 'source-dependent' && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            Source-Dependent
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-200/80 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                        {q.answer}
                      </div>

                      {q.explanation && (
                        <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                          <strong className="text-emerald-800">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setSelectedQNo(null)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Categories</span>
            </button>

            {onBackToSession && (
              <button
                onClick={onBackToSession}
                className="py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Back to Practice Hub</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Root Hierarchy View: 16 Categories (Q.18 to Q.33) */
        <div className="space-y-4">
          {/* Search & Overview Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  Question Categories (Q.18 — Q.33)
                </h3>
                <p className="text-xs text-slate-500">
                  Select any category to practice board-style questions
                </p>
              </div>

              {onBackToSession && (
                <button
                  onClick={onBackToSession}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Back to Hub
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., Relative Clauses, Voice, Prepositions)..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-sans"
              />
            </div>
          </div>

          {/* Exact Hierarchy Structure: 16 Cards */}
          <div className="space-y-2.5">
            {filteredCategories.map((cat) => {
              const count = cat.questions.length;
              const answered = cat.questions.filter(
                (q) => userAnswers[q.id]?.trim().length > 0
              ).length;

              return (
                <button
                  key={cat.q_no}
                  id={`mm-cat-${cat.q_no}`}
                  onClick={() => setSelectedQNo(cat.q_no)}
                  className="w-full text-left bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-4 shadow-xs transition-all flex items-center justify-between gap-3 group active:scale-99 cursor-pointer"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 font-mono">
                        {cat.code}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">
                        {count} {count === 1 ? 'question' : 'questions'}
                      </span>
                      {answered > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-600">
                          {answered}/{count} answered
                        </span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
