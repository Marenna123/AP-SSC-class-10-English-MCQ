import React from 'react';
import { BookOpen, Music, PenTool, SpellCheck, FileCheck, BarChart3, RotateCcw, Bookmark, ArrowRight, Award, Flame, CheckCircle2, ChevronRight, Feather } from 'lucide-react';
import { ActiveNavTab, LearnSection, StudentProfile } from '../types';
import { OverallStats } from '../lib/storage';

interface HomeViewProps {
  profile: StudentProfile;
  stats: OverallStats;
  onNavigateTab: (tab: ActiveNavTab) => void;
  onOpenLearnSection: (section: LearnSection) => void;
  onStartLesson: (lessonId: string, title: string) => void;
  onStartRetry: () => void;
  onOpenBookmarks: () => void;
  onStartPracticeTest: (type: 'quick' | 'practice' | 'full') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  stats,
  onNavigateTab,
  onOpenLearnSection,
  onStartLesson,
  onStartRetry,
  onOpenBookmarks,
  onStartPracticeTest,
}) => {
  const lastLessonTitle = profile.last_lesson_attempted || 'How to Tell Wild Animals';
  const lastLessonId = lastLessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 rounded-3xl text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 pointer-events-none">
          <BookOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs mb-3">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            AP SSC Board Exam 2026–27 Official Syllabus
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif] leading-tight mb-1">
            Hello, {profile.name}!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed mb-4">
            Master prose, poetry, grammar, and vocabulary with instant feedback and board exam MCQs.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="home-quick-test-btn"
              onClick={() => onStartPracticeTest('quick')}
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Quick 10Q Test
            </button>
            <button
              id="home-learn-btn"
              onClick={() => onNavigateTab('learn')}
              className="bg-indigo-600/60 hover:bg-indigo-600/90 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-indigo-400/40 backdrop-blur-xs flex items-center gap-1.5 transition-all"
            >
              Browse Syllabus
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Outfit',sans-serif]">
              Continue Learning
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600">
            Current Lesson
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Last Attempted
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                {lastLessonTitle}
              </h4>
            </div>
            <button
              id="continue-learning-resume-btn"
              onClick={() => onStartLesson(lastLessonId, lastLessonTitle)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
            >
              Resume
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 mt-2">
            <div>
              <span className="text-xs text-slate-500 block">Questions Completed</span>
              <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                {stats.questionsAttempted} / {stats.totalQuestionsInBank}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Accuracy</span>
              <span className="font-extrabold text-emerald-600 text-sm sm:text-base">
                {stats.accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Retry & Bookmarks Shortcuts */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="home-retry-incorrect-btn"
            onClick={onStartRetry}
            className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-900 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-800">
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Incorrect
              </div>
              <span className="text-[11px] text-rose-700/80 font-medium">
                {stats.incorrectQuestionsCount} question{stats.incorrectQuestionsCount === 1 ? '' : 's'} to master
              </span>
            </div>
            {stats.incorrectQuestionsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {stats.incorrectQuestionsCount}
              </span>
            )}
          </button>

          <button
            id="home-bookmarks-card-btn"
            onClick={onOpenBookmarks}
            className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-800">
                <Bookmark className="w-3.5 h-3.5" />
                Bookmarked
              </div>
              <span className="text-[11px] text-amber-700/80 font-medium">
                {stats.bookmarkedCount} saved for revision
              </span>
            </div>
            {stats.bookmarkedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {stats.bookmarkedCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 6 Main Cards */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-slate-900 text-base font-['Outfit',sans-serif]">
            Curriculum Sections
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tap to explore
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* 1. Lessons (Prose) */}
          <button
            id="card-lessons"
            onClick={() => onOpenLearnSection('prose')}
            className="p-4 rounded-2xl bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                1. 📚 Lessons
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                8 Prose Chapters (50 MCQs each)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 2. Poems */}
          <button
            id="card-poems"
            onClick={() => onOpenLearnSection('poem')}
            className="p-4 rounded-2xl bg-white hover:bg-violet-50/40 border border-slate-200 hover:border-violet-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                2. 🎵 Poems
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                8 Confirmed Poems (25 MCQs each)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-violet-600 font-semibold">
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 3. Grammar */}
          <button
            id="card-grammar"
            onClick={() => onOpenLearnSection('grammar')}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                3. ✏️ Grammar
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                9 Essential Topics (Voice, Speech, Clauses)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 4. Vocabulary */}
          <button
            id="card-vocabulary"
            onClick={() => onOpenLearnSection('vocabulary')}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                4. 🔤 Vocabulary
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Synonyms, Antonyms, Q.32 Dictionary Skills
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 5. Creative Expressions */}
          <button
            id="card-creative-expressions"
            onClick={() => onOpenLearnSection('creative-expressions')}
            className="p-4 rounded-2xl bg-white hover:bg-purple-50/40 border border-slate-200 hover:border-purple-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                5. ✍️ Creative Expressions
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Q.35, Q.36 &amp; Q.37 (All 10 Marks)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-semibold">
              <span>Explore Discourses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 6. Practice Test */}
          <button
            id="card-practice-test"
            onClick={() => onNavigateTab('practice')}
            className="p-4 rounded-2xl bg-white hover:bg-teal-50/40 border border-slate-200 hover:border-teal-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                6. 📝 Practice Test
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                10, 25, or 50 Qs with Score Cards
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
              <span>Take Test</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 7. My Progress */}
          <button
            id="card-my-progress"
            onClick={() => onNavigateTab('progress')}
            className="p-4 rounded-2xl bg-white hover:bg-rose-50/40 border border-slate-200 hover:border-rose-300 text-left shadow-2xs transition-all active:scale-98 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                7. 📊 My Progress
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Accuracy, Topic Analytics & History
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-semibold">
              <span>View Stats</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* Board Exam Syllabus Notice Card */}
      <div className="bg-slate-100 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-200 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">AP SSC 2026–27 Compliance:</strong> All content strictly reflects current syllabus guidelines (8 Prose chapters excluding "The Proposal", 8 confirmed poems, 9 grammar units, 8 vocabulary modules, and Creative Expressions Questions 35, 36 &amp; 37).
        </p>
      </div>
    </div>
  );
};
