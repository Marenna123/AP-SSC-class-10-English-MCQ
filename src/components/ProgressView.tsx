import React, { useState } from 'react';
import { BarChart3, CheckCircle2, XCircle, Award, RotateCcw, Bookmark, BookOpen, Music, PenTool, SpellCheck, Play, ArrowRight, Trash2 } from 'lucide-react';
import { OverallStats, getIncorrectQuestions } from '../lib/storage';
import { Category, Question, TestResult } from '../types';

interface ProgressViewProps {
  stats: OverallStats;
  allQuestions: Question[];
  testResults: TestResult[];
  bookmarkedQuestions: Question[];
  onStartRetryQuestions: (questions: Question[]) => void;
  onPracticeBookmarked: (questions: Question[]) => void;
  onRemoveBookmark: (questionId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  allQuestions,
  testResults,
  bookmarkedQuestions,
  onStartRetryQuestions,
  onPracticeBookmarked,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'retry' | 'bookmarks' | 'tests'>('analytics');
  const [retryCategoryFilter, setRetryCategoryFilter] = useState<Category | 'all'>('all');

  const incorrectList = getIncorrectQuestions(
    undefined,
    retryCategoryFilter === 'all' ? undefined : retryCategoryFilter
  );

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs grid grid-cols-4 gap-1">
        {[
          { id: 'analytics', label: 'Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'retry', label: `Retry (${stats.incorrectQuestionsCount})`, icon: <RotateCcw className="w-3.5 h-3.5" /> },
          { id: 'bookmarks', label: `Saved (${stats.bookmarkedCount})`, icon: <Bookmark className="w-3.5 h-3.5" /> },
          { id: 'tests', label: `Tests (${stats.testsCompleted})`, icon: <Award className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`progress-subtab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Analytics & Overview (Section 8) */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Main Big Stats Banner (Section 8 requirement: Accuracy 82%, Questions 125/500) */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl text-white p-5 sm:p-6 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 block">
                  Overall Accuracy
                </span>
                <div className="text-3xl sm:text-4xl font-black font-['Outfit',sans-serif]">
                  Accuracy: {stats.accuracy}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 block">
                  Questions Attempted
                </span>
                <div className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] text-emerald-400">
                  {stats.questionsAttempted} / {stats.totalQuestionsInBank}
                </div>
              </div>
            </div>

            {/* Visual Meter */}
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-200">
              Target for AP SSC Board A1 Grade: 85%+ accuracy across all sections.
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Correct
              </span>
              <span className="text-xl font-black text-emerald-600 font-['Outfit',sans-serif]">
                {stats.correctAnswers}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Incorrect
              </span>
              <span className="text-xl font-black text-rose-600 font-['Outfit',sans-serif]">
                {stats.incorrectAnswers}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Prose Done
              </span>
              <span className="text-xl font-black text-indigo-600 font-['Outfit',sans-serif]">
                {stats.lessonsCompleted} / 8
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Poems Done
              </span>
              <span className="text-xl font-black text-violet-600 font-['Outfit',sans-serif]">
                {stats.poemsCompleted} / 8
              </span>
            </div>
          </div>

          {/* Topic-wise Progress (Section 8 requirement) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              Topic-Wise Syllabus Progress
            </h3>

            {/* Prose */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Prose Lessons (8 Chapters)
                </span>
                <span>{stats.lessonsCompleted} Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.lessonsCompleted / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Poetry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-violet-600" />
                  Poems (8 Confirmed Poems)
                </span>
                <span>{stats.poemsCompleted} Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-violet-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.poemsCompleted / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Grammar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                  Grammar (9 Topics)
                </span>
                <span>{stats.grammarTopicsCompleted} Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.grammarTopicsCompleted / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* Vocabulary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <SpellCheck className="w-3.5 h-3.5 text-amber-600" />
                  Vocabulary (8 Modules)
                </span>
                <span>{stats.vocabularyTopicsCompleted} Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${(stats.vocabularyTopicsCompleted / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Retry Incorrect Questions (Section 9) */}
      {activeTab === 'retry' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-900">
            <h3 className="font-extrabold text-sm sm:text-base font-['Outfit',sans-serif] flex items-center gap-1.5 mb-1">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Retry Incorrect Questions
            </h3>
            <p className="text-xs text-rose-700 leading-relaxed">
              Whenever you answer a previously missed question correctly in this retry mode, your progress and accuracy score will automatically update!
            </p>
          </div>

          {/* Filter by Category / Topic (Section 9 requirement) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${incorrectList.length})` },
              { id: 'prose', label: 'Prose' },
              { id: 'poem', label: 'Poems' },
              { id: 'grammar', label: 'Grammar' },
              { id: 'vocabulary', label: 'Vocabulary' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setRetryCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  retryCategoryFilter === cat.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {incorrectList.length > 0 ? (
            <div className="space-y-3">
              <button
                id="retry-all-btn"
                onClick={() => onStartRetryQuestions(incorrectList)}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Practice These {incorrectList.length} Missed Questions</span>
              </button>

              <div className="space-y-2">
                {incorrectList.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-rose-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-rose-600">
                        {q.category} • {q.subcategory}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {idx + 1}. {q.question_text}
                      </p>
                    </div>
                    <button
                      onClick={() => onStartRetryQuestions([q])}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold shrink-0 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-extrabold text-slate-900 text-base mb-1">
                No Incorrect Questions!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Great job! You haven't made any mistakes yet or you have successfully mastered all retry questions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Bookmarked Questions (Section 10) */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900">
            <h3 className="font-extrabold text-sm sm:text-base font-['Outfit',sans-serif] flex items-center gap-1.5 mb-1">
              <Bookmark className="w-4 h-4 text-amber-600 fill-amber-600" />
              Bookmarked Questions ({bookmarkedQuestions.length})
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Questions marked with a star during study sessions appear here for rapid revision before your AP SSC exams.
            </p>
          </div>

          {bookmarkedQuestions.length > 0 ? (
            <div className="space-y-3">
              <button
                id="practice-bookmarks-btn"
                onClick={() => onPracticeBookmarked(bookmarkedQuestions)}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Practice All {bookmarkedQuestions.length} Bookmarks</span>
              </button>

              <div className="space-y-2">
                {bookmarkedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-amber-700">
                        {q.category} • {q.subcategory}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {idx + 1}. {q.question_text}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onPracticeBookmarked([q])}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                      >
                        Solve
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(q.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-extrabold text-slate-900 text-base mb-1">
                No Bookmarked Questions Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                While practicing questions, tap the "☆ Bookmark" button on tricky questions to save them for revision.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Past Test History Log */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit',sans-serif] px-1">
            Completed Practice Tests ({testResults.length})
          </h3>

          {testResults.length > 0 ? (
            <div className="space-y-2">
              {testResults.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                      {t.test_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(t.completed_at).toLocaleDateString()} at{' '}
                      {new Date(t.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-lg font-black font-['Outfit',sans-serif] block ${
                        t.percentage >= 75
                          ? 'text-emerald-600'
                          : t.percentage >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {t.percentage}%
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {t.correct_answers} / {t.total_questions} Correct
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-extrabold text-slate-900 text-base mb-1">
                No Practice Tests Taken Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Head to the Practice section to take 10, 25, or 50 question mock tests with automated board scorecards.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
