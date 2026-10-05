import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
  FileText,
  Mic,
  BarChart2,
  Calendar,
  Award,
  PenTool,
  CheckCircle2,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  Sparkles,
  Info,
  ArrowRight,
  Table,
} from 'lucide-react';
import {
  CREATIVE_EXPRESSIONS_HIERARCHY,
  ALL_RAW_CREATIVE_QUESTIONS,
  CreativeQuestionNode,
  CreativeBranchItem,
  CreativePracticeQuestion,
  CreativeQuestionId,
  CreativeBranchId,
} from '../data/creativeExpressionsData';

interface CreativeExpressionsViewProps {
  onBackToCurriculum?: () => void;
  initialQuestionId?: CreativeQuestionId | null;
  initialBranchId?: CreativeBranchId | null;
}

export const CreativeExpressionsView: React.FC<CreativeExpressionsViewProps> = ({
  onBackToCurriculum,
  initialQuestionId = null,
  initialBranchId = null,
}) => {
  // Navigation state:
  // selectedQuestionId: null (shows root Q35, Q36, Q37) or 'Q35' | 'Q36' | 'Q37'
  // selectedBranchId: null (shows branches for question) or '35-a' | '35-b' | etc.
  const [selectedQuestionId, setSelectedQuestionId] = useState<CreativeQuestionId | null>(
    initialQuestionId
  );
  const [selectedBranchId, setSelectedBranchId] = useState<CreativeBranchId | null>(
    initialBranchId
  );
  const [viewTab, setViewTab] = useState<'questions' | 'rubric'>('questions');

  // Track expanded example answers (question ID map)
  const [expandedExampleAnswers, setExpandedExampleAnswers] = useState<Record<string, boolean>>({});

  // Student's typed responses per question
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  // Load student's saved answers from localStorage on mount
  useEffect(() => {
    try {
      const initialAnswers: Record<string, string> = {};
      ALL_RAW_CREATIVE_QUESTIONS.forEach((q) => {
        const stored = localStorage.getItem(`ap_ssc_ce_answer_${q.id}`);
        if (stored) {
          initialAnswers[q.id] = stored;
        }
      });
      setUserAnswers(initialAnswers);
    } catch (e) {
      // localStorage fallback
    }
  }, []);

  // Currently active question object
  const currentQuestionNode: CreativeQuestionNode | undefined =
    CREATIVE_EXPRESSIONS_HIERARCHY.find((q) => q.questionNumber === selectedQuestionId);

  // Currently active branch object
  const currentBranch: CreativeBranchItem | undefined = currentQuestionNode?.branches.find(
    (b) => b.id === selectedBranchId
  );

  // Helper icons for discourse types
  const getBranchIcon = (code: string) => {
    switch (code) {
      case '35 A':
        return <MessageSquare className="w-5 h-5 text-indigo-600" />;
      case '35 B':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case '36 A':
        return <FileText className="w-5 h-5 text-emerald-600" />;
      case '36 B':
        return <Mic className="w-5 h-5 text-amber-600" />;
      case '37 A':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      case '37 B':
        return <BarChart2 className="w-5 h-5 text-teal-600" />;
      default:
        return <PenTool className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getQuestionAccent = (qNumber: CreativeQuestionId) => {
    switch (qNumber) {
      case 'Q35':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          hoverBorder: 'hover:border-indigo-400',
          text: 'text-indigo-800',
          badgeBg: 'bg-indigo-100 text-indigo-800',
          iconBg: 'bg-indigo-600 text-white',
        };
      case 'Q36':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          hoverBorder: 'hover:border-emerald-400',
          text: 'text-emerald-800',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          iconBg: 'bg-emerald-600 text-white',
        };
      case 'Q37':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          hoverBorder: 'hover:border-purple-400',
          text: 'text-purple-800',
          badgeBg: 'bg-purple-100 text-purple-800',
          iconBg: 'bg-purple-600 text-white',
        };
    }
  };

  // Toggle example answer visibility for a question
  const toggleExampleAnswer = (questionId: string) => {
    setExpandedExampleAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Handle student answer change
  const handleAnswerChange = (questionId: string, text: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
    // Clear saved status if user is currently editing
    if (savedStatus[questionId]) {
      setSavedStatus((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  // Handle student answer save/submit
  const handleSaveAnswer = (questionId: string) => {
    const textToSave = userAnswers[questionId] || '';
    try {
      localStorage.setItem(`ap_ssc_ce_answer_${questionId}`, textToSave);
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
    } catch (e) {
      // fallback
    }
  };

  // Handle student answer clear
  const handleClearAnswer = (questionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: '',
    }));
    try {
      localStorage.removeItem(`ap_ssc_ce_answer_${questionId}`);
    } catch (e) {
      // fallback
    }
    setSavedStatus((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  // Count words helper
  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  // =========================================================================
  // VIEW 3: PRACTICE QUESTIONS VIEW (When a category like 35 A is open)
  // =========================================================================
  if (currentQuestionNode && currentBranch) {
    const sisterBranches = currentQuestionNode.branches;

    return (
      <div className="space-y-4 pb-20">
        {/* Navigation Breadcrumb Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto py-0.5">
            <button
              onClick={() => {
                setSelectedBranchId(null);
                setSelectedQuestionId(null);
              }}
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 shrink-0"
            >
              Creative Expressions
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={() => setSelectedBranchId(null)}
              className="text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
            >
              {currentQuestionNode.title}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-extrabold shrink-0 truncate max-w-[180px] sm:max-w-none">
              {currentBranch.fullTitle}
            </span>
          </div>

          <button
            onClick={() => setSelectedBranchId(null)}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {currentQuestionNode.rawNumberTitle}</span>
          </button>
        </div>

        {/* Branch Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white backdrop-blur-xs">
              {currentBranch.branchCode}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              {currentBranch.marks} MARKS
            </span>
            <span className="text-xs text-indigo-200">
              {currentBranch.questions.length} Practice Questions
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight mb-2">
            {currentBranch.fullTitle}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl">
            {currentBranch.description}
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-200 flex-wrap gap-2">
            <span>Discourse: <strong>{currentBranch.name}</strong></span>
            <span className="text-amber-300 font-semibold">AP SSC Board Exam Pattern (10 Marks)</span>
          </div>
        </div>

        {/* Sister Branch Quick-Toggle Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {currentQuestionNode.rawNumberTitle} Options (Internal Choice)
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Attempt 1 in Board Exam
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {sisterBranches.map((b) => {
              const isSelected = b.id === currentBranch.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {getBranchIcon(b.branchCode)}
                  <span className="truncate">{b.fullTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Toggle: Practice Questions vs. Format & Rubric */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs grid grid-cols-2 gap-1">
          <button
            onClick={() => setViewTab('questions')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              viewTab === 'questions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Questions ({currentBranch.questions.length})</span>
          </button>
          <button
            onClick={() => setViewTab('rubric')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              viewTab === 'rubric'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Format Guidelines &amp; Rubric</span>
          </button>
        </div>

        {/* Tab 1: Practice Questions List */}
        {viewTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
                {currentBranch.fullTitle} — Questions &amp; Writing Practice
              </h3>
              <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                10 Marks
              </span>
            </div>

            {currentBranch.questions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-1">
                  Ready for Questions
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Practice questions for {currentBranch.fullTitle} will be listed here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentBranch.questions.map((q: CreativePracticeQuestion, index: number) => {
                  const isExampleOpen = !!expandedExampleAnswers[q.id];
                  const userText = userAnswers[q.id] || '';
                  const wordCount = getWordCount(userText);
                  const charCount = userText.length;
                  const isSaved = !!savedStatus[q.id];

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all space-y-4"
                    >
                      {/* Question Top Header */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-600 text-white">
                            Question {index + 1}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                            {q.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            {q.type}
                          </span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          10 MARKS
                        </span>
                      </div>

                      {/* Question Task / Prompt Card */}
                      <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/40 p-4 rounded-xl border border-indigo-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wider">
                          <PenTool className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Question Task / Prompt:</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                          {q.prompt}
                        </p>
                      </div>

                      {/* Hints (if provided in the JSON) */}
                      {q.hints && q.hints.length > 0 && (
                        <div className="space-y-1.5 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Hints &amp; Key Points:</span>
                          </span>
                          <ul className="space-y-1 text-xs text-slate-700 pt-1">
                            {q.hints.map((hint, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                                <span className="leading-relaxed font-medium">{hint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Data Labels (for Information Transfer e.g. 37B-001) */}
                      {q.data_labels && q.data_labels.length > 0 && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <span className="font-extrabold text-slate-900 block text-xs text-indigo-700">
                            📊 Graph Categories / Items:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {q.data_labels.map((label, lIdx) => (
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

                      {/* Numerical Table (for Information Transfer e.g. 37B-003, 37B-004, 37B-005) */}
                      {q.table && q.table.length > 0 && (
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 overflow-hidden space-y-2">
                          <span className="font-extrabold text-slate-900 block text-xs text-indigo-700 flex items-center gap-1.5">
                            <Table className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Data Table from Source Material:</span>
                          </span>
                          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="bg-indigo-100/70 border-b border-indigo-200 text-indigo-900 font-black">
                                  {q.table[0].map((headerCell, cIdx) => (
                                    <th key={cIdx} className="p-2.5 font-black">
                                      {headerCell}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {q.table.slice(1).map((row, rIdx) => (
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

                      {/* Writing Practice Area */}
                      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Write Your Answer:</span>
                          </label>
                          <span className="text-[11px] font-medium text-slate-500">
                            {wordCount} words • {charCount} chars
                          </span>
                        </div>
                        <textarea
                          id={`student-answer-${q.id}`}
                          value={userText}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Type your own answer here... (You can compare your work with the Model Answer below after writing)"
                          rows={6}
                          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white leading-relaxed resize-y font-sans"
                        />
                        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              id={`save-answer-${q.id}`}
                              onClick={() => handleSaveAnswer(q.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-98"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save / Submit Answer</span>
                            </button>
                            {userText.trim().length > 0 && (
                              <button
                                id={`clear-answer-${q.id}`}
                                onClick={() => handleClearAnswer(q.id)}
                                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Clear</span>
                              </button>
                            )}
                          </div>
                          {isSaved && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 animate-in fade-in duration-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Answer Saved!</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* View / Hide Example Answer Button */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <button
                          id={`toggle-example-btn-${q.id}`}
                          onClick={() => toggleExampleAnswer(q.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-98"
                        >
                          {isExampleOpen ? (
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
                        {userText.trim().length > 0 && isExampleOpen && (
                          <span className="text-[11px] font-semibold text-slate-500">
                            Compare your answer above with the model answer below
                          </span>
                        )}
                      </div>

                      {/* Model Answer / Example Answer (Initially Hidden) */}
                      {isExampleOpen && (
                        <div className="bg-amber-50/70 rounded-2xl border border-amber-300/80 p-4 space-y-2.5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                                Example Answer (Model Answer)
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              Model Response for Self-Assessment
                            </span>
                          </div>

                          <div className="bg-white/95 p-4 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
                            {q.example_answer}
                          </div>

                          <p className="text-[10px] text-amber-800/80 italic">
                            * Clearly labeled as a teacher-prepared model answer for reference and self-assessment, not an official textbook answer.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Format & Rubric */}
        {viewTab === 'rubric' && (
          <div className="space-y-3">
            {/* Format Guidelines Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
                    Format &amp; Layout Requirements
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mandatory structure for maximum marks in AP SSC Board Exams
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {currentBranch.formatGuidelines.map((g, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evaluation Indicators Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
                    Official Mark Allocation &amp; Rubric ({currentBranch.marks} MARKS)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    AP Board marks breakdown for {currentBranch.fullTitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentBranch.evaluationIndicators.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900"
                  >
                    <span className="font-bold block mb-0.5">• Criterion {idx + 1}</span>
                    <span className="text-xs text-emerald-800 leading-relaxed">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: QUESTION VIEW (e.g. QUESTION 35 showing 35 A and 35 B)
  // =========================================================================
  if (currentQuestionNode) {
    return (
      <div className="space-y-4 pb-20">
        {/* Navigation Breadcrumb Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              Creative Expressions
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">
              {currentQuestionNode.title}
            </span>
          </div>

          <button
            onClick={() => setSelectedQuestionId(null)}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Questions</span>
          </button>
        </div>

        {/* Question Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white backdrop-blur-xs">
              {currentQuestionNode.rawNumberTitle}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              10 MARKS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight mb-1">
            {currentQuestionNode.title}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed mb-3">
            {currentQuestionNode.description}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-indigo-100 text-xs font-semibold backdrop-blur-xs">
            <Info className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{currentQuestionNode.choiceNote}</span>
          </div>
        </div>

        {/* Sub-header instruction */}
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
            Select Category (A / B Branch)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Both are 10 Marks
          </span>
        </div>

        {/* The Two Branches Grid: 35 A & 35 B (or 36 A & 36 B, or 37 A & 37 B) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentQuestionNode.branches.map((branch) => {
            return (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getBranchIcon(branch.branchCode)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                        10 MARKS
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {branch.questions.length} Questions
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block mb-0.5">
                    {branch.branchCode}
                  </span>
                  <h4 className="font-black text-slate-900 text-base sm:text-lg mb-2 group-hover:text-indigo-600 transition-colors font-['Outfit',sans-serif]">
                    {branch.fullTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {branch.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Practice Material:</span>
                      <strong className="text-indigo-600 font-bold">
                        {branch.questions.length} Questions Available
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Model Answers:</span>
                      <strong className="text-emerald-700 font-bold">
                        Included for all questions
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    id={`open-branch-${branch.id}`}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      setViewTab('questions');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-indigo-700 active:scale-98"
                  >
                    <span>Open {branch.fullTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ROOT CREATIVE EXPRESSIONS SCREEN (Shows Question 35, 36, 37)
  // =========================================================================
  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white backdrop-blur-xs">
            AP SSC Class 10 English
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
            ALL 10 MARKS
          </span>
          <span className="text-xs text-indigo-200">
            Section C • Questions 35, 36 &amp; 37
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight mb-1">
          CREATIVE EXPRESSIONS
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl mb-4">
          Master the discourses for the AP SSC Board Exam. Organized strictly into <strong>QUESTION 35</strong>, <strong>QUESTION 36</strong>, and <strong>QUESTION 37</strong> (all 10 Marks each). Total of <strong>{ALL_RAW_CREATIVE_QUESTIONS.length} practice questions</strong> with model answers.
        </p>

        {/* Blueprint Overview Chips: Question 35, 36, 37 */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold uppercase tracking-wider">
              Question 35
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              10 MARKS
            </span>
            <span className="text-[10px] text-indigo-200 block mt-0.5">
              35 A / 35 B
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold uppercase tracking-wider">
              Question 36
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              10 MARKS
            </span>
            <span className="text-[10px] text-indigo-200 block mt-0.5">
              36 A / 36 B
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold uppercase tracking-wider">
              Question 37
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              10 MARKS
            </span>
            <span className="text-[10px] text-indigo-200 block mt-0.5">
              37 A / 37 B
            </span>
          </div>
        </div>
      </div>

      {/* Main Hierarchy List: Question 35, Question 36, Question 37 */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
            Creative Expression Questions (Tap to view branches)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            3 Questions • All 10 Marks
          </span>
        </div>

        {CREATIVE_EXPRESSIONS_HIERARCHY.map((qNode) => {
          const accent = getQuestionAccent(qNode.questionNumber);
          const totalQuestionsInNode = qNode.branches.reduce(
            (sum, b) => sum + b.questions.length,
            0
          );

          return (
            <div
              key={qNode.questionNumber}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${accent.iconBg} flex items-center justify-center font-black text-sm font-['Outfit',sans-serif] shadow-xs shrink-0`}
                  >
                    {qNode.questionNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-base sm:text-lg font-['Outfit',sans-serif]">
                        {qNode.title}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        10 MARKS
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {totalQuestionsInNode} Questions
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {qNode.choiceNote}
                    </p>
                  </div>
                </div>

                <button
                  id={`open-question-btn-${qNode.questionNumber}`}
                  onClick={() => setSelectedQuestionId(qNode.questionNumber)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <span>Open {qNode.rawNumberTitle}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                {qNode.description}
              </p>

              {/* Direct A / B Branch Shortcuts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Clickable Branches:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {qNode.branches.map((branch) => (
                    <button
                      key={branch.id}
                      id={`branch-btn-${branch.id}`}
                      onClick={() => {
                        setSelectedQuestionId(qNode.questionNumber);
                        setSelectedBranchId(branch.id);
                        setViewTab('questions');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group active:scale-99"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                          {getBranchIcon(branch.branchCode)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-extrabold text-indigo-700 block">
                            {branch.branchCode}
                          </span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate block">
                            {branch.fullTitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {branch.questions.length} Qs
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Syllabus Classification Footer Card */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 border border-slate-200 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900 block mb-0.5">
            AP SSC Board Exam Discourse Practice Material:
          </strong>
          All {ALL_RAW_CREATIVE_QUESTIONS.length} practice questions from the official Mission March material are loaded with prompts, hints, interactive student writing areas, and teacher-prepared model answers for self-assessment.
        </div>
      </div>
    </div>
  );
};
