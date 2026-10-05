import React, { useState, useEffect } from 'react';
import { BookOpen, Music, PenTool, SpellCheck, ChevronRight, Play, CheckCircle2, Feather } from 'lucide-react';
import { Category, Difficulty, LearnSection, LessonItem, Question, TopicItem } from '../types';
import { PROSE_LESSONS, POEMS, GRAMMAR_TOPICS, VOCABULARY_TOPICS } from '../data/syllabus';
import { DictionarySkillsView } from './DictionarySkillsView';
import { OneWordSubstitutionsView } from './OneWordSubstitutionsView';
import { PhrasalVerbsView } from './PhrasalVerbsView';
import { MatchingView } from './MatchingView';
import { CreativeExpressionsView } from './CreativeExpressionsView';

interface LearnViewProps {
  initialSection?: LearnSection;
  questions: Question[];
  statusMap: Record<string, { isCorrect: boolean; attemptsCount: number }>;
  onStartLessonPractice: (
    lessonId: string,
    title: string,
    category: Category,
    difficultyFilter?: Difficulty | 'mixed'
  ) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  initialSection = 'prose',
  questions,
  statusMap,
  onStartLessonPractice,
}) => {
  const [activeSection, setActiveSection] = useState<LearnSection>(initialSection);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'mixed'>('mixed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLessonModal, setSelectedLessonModal] = useState<LessonItem | TopicItem | null>(null);
  const [vocabSubsection, setVocabSubsection] = useState<'all' | 'synonyms-antonyms' | 'one-word-substitutions' | 'dictionary-skills' | 'phrasal-verbs-idioms' | 'matching'>('all');
  const [q33Difficulty, setQ33Difficulty] = useState<'all' | 'easy' | 'medium' | 'difficult'>('all');
  const [q34Difficulty, setQ34Difficulty] = useState<'all' | 'easy' | 'medium' | 'difficult'>('all');

  // Synchronize activeSection whenever initialSection changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Tabs
  const tabs: { id: LearnSection; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'prose', label: 'Prose Lessons', icon: <BookOpen className="w-4 h-4" />, count: PROSE_LESSONS.length },
    { id: 'poem', label: 'Poems', icon: <Music className="w-4 h-4" />, count: POEMS.length },
    { id: 'grammar', label: 'Grammar', icon: <PenTool className="w-4 h-4" />, count: GRAMMAR_TOPICS.length },
    { id: 'vocabulary', label: 'Vocabulary', icon: <SpellCheck className="w-4 h-4" />, count: VOCABULARY_TOPICS.length },
    { id: 'creative-expressions', label: 'Creative Expressions', icon: <Feather className="w-4 h-4" />, count: 3 },
  ];

  // Helper to count questions in bank for this item
  const getQuestionStats = (id: string, cat: Category) => {
    if (id === 'dictionary-skills' || id === 'dictionary-entry') {
      let dictAttempted = 0;
      let dictCorrect = 0;
      try {
        const raw = localStorage.getItem('ap_ssc_dictionary_skills_progress_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          const ans = parsed.answers || {};
          dictAttempted = Object.keys(ans).length;
          dictCorrect = Object.values(ans).filter((a: any) => a.isCorrect).length;
        }
      } catch {
        // ignore
      }
      return {
        total: 50,
        simpleCount: 20,
        mediumCount: 20,
        difficultCount: 10,
        attempted: dictAttempted,
        correct: dictCorrect,
        progressPct: Math.round((dictAttempted / 50) * 100),
        questions: [],
      };
    }

    if (id === 'phrasal-verbs-idioms' || id.includes('phrasal') || id.includes('idiom')) {
      const q33Questions = questions.filter((q) => q.lesson_id === 'phrasal-verbs-idioms');
      const total = q33Questions.length > 0 ? q33Questions.length : 50;
      const simpleCount = q33Questions.filter((q) => q.difficulty === 'simple').length || 20;
      const mediumCount = q33Questions.filter((q) => q.difficulty === 'medium').length || 20;
      const difficultCount = q33Questions.filter((q) => q.difficulty === 'difficult').length || 10;

      let q33Attempted = 0;
      let q33Correct = 0;
      try {
        const raw = localStorage.getItem('ap_ssc_q33_progress_v4');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            const vals = Object.values(parsed) as any[];
            q33Attempted = vals.length;
            q33Correct = vals.filter((v: any) => v.isCorrect).length;
          }
        }
      } catch {
        // ignore
      }
      return {
        total,
        simpleCount,
        mediumCount,
        difficultCount,
        attempted: q33Attempted,
        correct: q33Correct,
        progressPct: total > 0 ? Math.round((q33Attempted / total) * 100) : 0,
        questions: q33Questions,
      };
    }

    if (id === 'matching' || id.includes('matching')) {
      const q34Questions = questions.filter((q) => q.lesson_id === 'matching');
      const total = q34Questions.length > 0 ? q34Questions.length : 50;
      const simpleCount = q34Questions.filter((q) => q.difficulty === 'simple').length || 20;
      const mediumCount = q34Questions.filter((q) => q.difficulty === 'medium').length || 20;
      const difficultCount = q34Questions.filter((q) => q.difficulty === 'difficult').length || 10;

      let matchingAttempted = 0;
      let matchingCorrect = 0;
      try {
        const raw = localStorage.getItem('ap_ssc_q34_matching_progress_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            const vals = Object.values(parsed) as any[];
            matchingAttempted = vals.length;
            matchingCorrect = vals.filter((v: any) => v.isAllCorrect).length;
          }
        }
      } catch {
        // ignore
      }
      return {
        total,
        simpleCount,
        mediumCount,
        difficultCount,
        attempted: matchingAttempted,
        correct: matchingCorrect,
        progressPct: total > 0 ? Math.round((matchingAttempted / total) * 100) : 0,
        questions: q34Questions,
      };
    }

    const itemQuestions = questions.filter((q) => {
      if (q.category !== cat) return false;
      if (q.lesson_id) {
        if (q.lesson_id === id) return true;
        if (id === 'nelson-mandela' && (q.lesson_id === 'nelson-mandela' || q.lesson_id === 'nelson-mandela-long-walk-to-freedom')) return true;
        if (id === 'two-stories-about-flying' && (q.lesson_id === 'two-stories-about-flying' || q.lesson_id.includes('flying'))) return true;
        if (id === 'from-the-diary-of-anne-frank' && (q.lesson_id === 'from-the-diary-of-anne-frank' || q.lesson_id.includes('anne-frank'))) return true;
        if (id === 'glimpses-of-india' && (q.lesson_id === 'glimpses-of-india' || q.lesson_id.includes('glimpses'))) return true;
        if (id === 'amanda' && (q.lesson_id === 'amanda' || q.lesson_id.includes('amanda') || q.subcategory.toLowerCase().includes('amanda'))) return true;
        if (id === 'madam-rides-the-bus' && (q.lesson_id === 'madam-rides-the-bus' || q.lesson_id.includes('madam') || q.subcategory.toLowerCase().includes('madam'))) return true;
        if (id === 'the-sermon-at-benares' && (q.lesson_id === 'the-sermon-at-benares' || q.lesson_id.includes('benares') || q.subcategory.toLowerCase().includes('benares'))) return true;
        if (id === 'relative-clauses' && (q.lesson_id === 'relative-clauses' || q.subcategory.toLowerCase().includes('relative clause'))) return true;
        if (id === 'passive-voice' && (q.lesson_id === 'passive-voice' || q.subcategory.toLowerCase().includes('passive'))) return true;
        if (id === 'reported-speech' && (q.lesson_id === 'reported-speech' || q.subcategory.toLowerCase().includes('reported speech'))) return true;
        if (id === 'prepositions' && (q.lesson_id === 'prepositions' || q.subcategory.toLowerCase().includes('preposition'))) return true;
        if (id === 'editing-a-passage' && (q.lesson_id === 'editing-a-passage' || q.subcategory.toLowerCase().includes('editing'))) return true;
        if (id === 'articles' && (q.lesson_id === 'articles' || q.subcategory.toLowerCase().includes('article'))) return true;
        if (id === 'used-to-would' && (q.lesson_id === 'used-to-would' || q.subcategory.toLowerCase().includes('used to') || q.subcategory.toLowerCase().includes('would'))) return true;
        if (id === 'noun-modifier' && (q.lesson_id === 'noun-modifier' || q.subcategory.toLowerCase().includes('noun modifier'))) return true;
        if (id === 'giving-advice' && (q.lesson_id === 'giving-advice' || q.subcategory.toLowerCase().includes('advice'))) return true;
        if (id === 'right-forms-of-verbs' && (q.lesson_id === 'right-forms-of-verbs' || q.subcategory.toLowerCase().includes('right form') || q.subcategory.toLowerCase().includes('forms of verb') || q.subcategory.toLowerCase().includes('verb'))) return true;
        if (id === 'synonyms' && (q.lesson_id === 'synonyms' || q.subcategory.toLowerCase().includes('synonym'))) return true;
        if (id === 'antonyms' && (q.lesson_id === 'antonyms' || q.subcategory.toLowerCase().includes('antonym'))) return true;
        if (id === 'prefixes-suffixes' && (q.lesson_id === 'prefixes-suffixes' || q.subcategory.toLowerCase().includes('prefix') || q.subcategory.toLowerCase().includes('suffix'))) return true;
        if (id === 'spelling-corrections' && (q.lesson_id === 'spelling-corrections' || q.subcategory.toLowerCase().includes('spelling'))) return true;
        return false;
      }
      return q.subcategory.toLowerCase().trim() === id.replace(/-/g, ' ').toLowerCase().trim();
    });

    const simpleCount = itemQuestions.filter((q) => q.difficulty === 'simple').length;
    const mediumCount = itemQuestions.filter((q) => q.difficulty === 'medium').length;
    const difficultCount = itemQuestions.filter((q) => q.difficulty === 'difficult').length;

    let attempted = 0;
    let correct = 0;
    for (const q of itemQuestions) {
      if (statusMap[q.id]) {
        attempted++;
        if (statusMap[q.id].isCorrect) correct++;
      }
    }

    return {
      total: itemQuestions.length,
      simpleCount,
      mediumCount,
      difficultCount,
      attempted,
      correct,
      progressPct: itemQuestions.length > 0 ? Math.round((attempted / itemQuestions.length) * 100) : 0,
      questions: itemQuestions,
    };
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Category Tabs Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                id={`learn-tab-${tab.id}`}
                onClick={() => {
                  setActiveSection(tab.id);
                  setSelectedLessonModal(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Difficulty Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Level:</span>
          <button
            id="filter-diff-all"
            onClick={() => setDifficultyFilter('mixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              difficultyFilter === 'mixed'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🔵 All Levels
          </button>
          <button
            id="filter-diff-simple"
            onClick={() => setDifficultyFilter('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              difficultyFilter === 'simple'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            🟢 Simple
          </button>
          <button
            id="filter-diff-medium"
            onClick={() => setDifficultyFilter('medium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              difficultyFilter === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            🟡 Medium
          </button>
          <button
            id="filter-diff-difficult"
            onClick={() => setDifficultyFilter('difficult')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              difficultyFilter === 'difficult'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            🔴 Difficult
          </button>
        </div>

        {/* Local Search */}
        <div className="relative">
          <input
            id="learn-search-input"
            type="text"
            placeholder="Filter topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 pl-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 1. Prose Lessons List */}
      {activeSection === 'prose' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">
              AP SSC Class 10 Prose (50 MCQs target per chapter)
            </span>
            <span>8 Official Chapters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROSE_LESSONS.filter((l) =>
              l.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((lesson) => {
              const stats = getQuestionStats(lesson.id, 'prose');
              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        Unit {lesson.unit} • Prose
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Target: {lesson.totalTarget} MCQs
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic mb-2">
                      by {lesson.author}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {lesson.description}
                    </p>
                    {lesson.id === 'two-stories-about-flying' && (
                      <div className="mb-3 space-y-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                          <span className="text-indigo-600">Part I:</span>
                          <span>His First Flight</span>
                          <span className="text-[10px] font-medium text-slate-500">— Liam O’Flaherty</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                          <span className="text-indigo-600">Part II:</span>
                          <span>The Black Aeroplane</span>
                          <span className="text-[10px] font-medium text-slate-500">— Frederick Forsyth</span>
                        </div>
                      </div>
                    )}
                    {lesson.id === 'glimpses-of-india' && (
                      <div className="mb-3 space-y-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                          <span className="text-indigo-600">Part I:</span>
                          <span>A Baker from Goa</span>
                          <span className="text-[10px] font-medium text-slate-500">— Lucio Rodrigues</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                          <span className="text-indigo-600">Part II:</span>
                          <span>Coorg</span>
                          <span className="text-[10px] font-medium text-slate-500">— Lokesh Abrol</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                          <span className="text-indigo-600">Part III:</span>
                          <span>Tea from Assam</span>
                          <span className="text-[10px] font-medium text-slate-500">— Arup Kumar Datta</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Difficulty breakdown targets */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                      <span>In Bank: {stats.total} Qs</span>
                      <span>Mastered: {stats.correct}</span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, stats.progressPct)}%` }}
                      />
                    </div>

                    {/* Section 3 Difficulty Tier Selection Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                      <button
                        id={`btn-simple-${lesson.id}`}
                        onClick={() => onStartLessonPractice(lesson.id, lesson.title, 'prose', 'simple')}
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Simple (20)
                      </button>
                      <button
                        id={`btn-medium-${lesson.id}`}
                        onClick={() => onStartLessonPractice(lesson.id, lesson.title, 'prose', 'medium')}
                        className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Medium (20)
                      </button>
                      <button
                        id={`btn-diff-${lesson.id}`}
                        onClick={() => onStartLessonPractice(lesson.id, lesson.title, 'prose', 'difficult')}
                        className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Difficult (10)
                      </button>
                    </div>

                    <button
                      id={`start-prose-${lesson.id}`}
                      onClick={() => onStartLessonPractice(lesson.id, lesson.title, 'prose', difficultyFilter)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Practice All Questions ({stats.total})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Poems List */}
      {activeSection === 'poem' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">
              AP SSC Class 10 Poetry (25 MCQs target per poem)
            </span>
            <span>8 Confirmed Poems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POEMS.filter((p) =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((poem) => {
              const stats = getQuestionStats(poem.id, 'poem');
              return (
                <div
                  key={poem.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                        Poem • Unit {poem.unit}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Target: {poem.totalTarget} MCQs
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {poem.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic mb-2">
                      by {poem.author}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {poem.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {/* Section 4 Poem Difficulty distribution: 10 Simple, 10 Medium, 5 Difficult */}
                    <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                      <button
                        id={`btn-poem-simple-${poem.id}`}
                        onClick={() => onStartLessonPractice(poem.id, poem.title, 'poem', 'simple')}
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Simple (10)
                      </button>
                      <button
                        id={`btn-poem-med-${poem.id}`}
                        onClick={() => onStartLessonPractice(poem.id, poem.title, 'poem', 'medium')}
                        className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Medium (10)
                      </button>
                      <button
                        id={`btn-poem-diff-${poem.id}`}
                        onClick={() => onStartLessonPractice(poem.id, poem.title, 'poem', 'difficult')}
                        className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[11px] font-bold"
                      >
                        Difficult (5)
                      </button>
                    </div>

                    <button
                      id={`start-poem-${poem.id}`}
                      onClick={() => onStartLessonPractice(poem.id, poem.title, 'poem', difficultyFilter)}
                      className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Practice Poem MCQs ({stats.total})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Grammar Topics List */}
      {activeSection === 'grammar' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">
              AP SSC Class 10 Grammar ({GRAMMAR_TOPICS.length} Prescribed Topics)
            </span>
            <span>Relative Clauses, Voice, Speech, etc.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GRAMMAR_TOPICS.filter((g) =>
              g.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((topic, index) => {
              const stats = getQuestionStats(topic.id, 'grammar');
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {topic.questionNumber ? `${topic.questionNumber} • Grammar` : `Topic ${index + 1} • Grammar`}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {stats.total} MCQs
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {stats.total > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                        <button
                          id={`btn-grammar-simple-${topic.id}`}
                          onClick={() => onStartLessonPractice(topic.id, topic.title, 'grammar', 'simple')}
                          className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[11px] font-bold"
                        >
                          Simple ({stats.simpleCount})
                        </button>
                        <button
                          id={`btn-grammar-med-${topic.id}`}
                          onClick={() => onStartLessonPractice(topic.id, topic.title, 'grammar', 'medium')}
                          className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[11px] font-bold"
                        >
                          Medium ({stats.mediumCount})
                        </button>
                        <button
                          id={`btn-grammar-diff-${topic.id}`}
                          onClick={() => onStartLessonPractice(topic.id, topic.title, 'grammar', 'difficult')}
                          className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[11px] font-bold"
                        >
                          Difficult ({stats.difficultCount})
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Completed: <strong className="text-emerald-700">{stats.attempted}</strong> / {stats.total}
                      </div>

                      <button
                        id={`start-grammar-${topic.id}`}
                        onClick={() => onStartLessonPractice(topic.id, topic.title, 'grammar', difficultyFilter)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        Practice Topic
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Vocabulary Topics List */}
      {activeSection === 'vocabulary' && (
        <div className="space-y-4">
          {/* Subsections navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Vocabulary Sections
              </span>
              <span className="text-[11px] font-bold text-amber-800">
                AP SSC Class 10 Pattern
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
              <button
                id="vocab-subtab-lessons"
                onClick={() => setVocabSubsection('all')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Lessons</span>
              </button>
              <button
                id="vocab-subtab-syn-ant"
                onClick={() => setVocabSubsection('synonyms-antonyms')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'synonyms-antonyms'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <SpellCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Syn / Ant</span>
              </button>
              <button
                id="vocab-subtab-one-word"
                onClick={() => setVocabSubsection('one-word-substitutions')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'one-word-substitutions'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 shrink-0" />
                <span>One Word</span>
              </button>
              <button
                id="vocab-subtab-dict-skills"
                onClick={() => setVocabSubsection('dictionary-skills')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'dictionary-skills'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Dictionary</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1 py-0.2 rounded-full">
                  Q.32
                </span>
              </button>
              <button
                id="vocab-subtab-phrasal-verbs"
                onClick={() => setVocabSubsection('phrasal-verbs-idioms')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'phrasal-verbs-idioms'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Phrasal &amp; Idioms</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1 py-0.2 rounded-full">
                  Q.33
                </span>
              </button>
              <button
                id="vocab-subtab-matching"
                onClick={() => setVocabSubsection('matching')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  vocabSubsection === 'matching'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Matching</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1 py-0.2 rounded-full">
                  Q.34
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Subsection Rendering */}
          {vocabSubsection === 'dictionary-skills' ? (
            <DictionarySkillsView onBackToVocabulary={() => setVocabSubsection('all')} />
          ) : vocabSubsection === 'one-word-substitutions' ? (
            <OneWordSubstitutionsView onBackToVocabulary={() => setVocabSubsection('all')} />
          ) : vocabSubsection === 'phrasal-verbs-idioms' ? (
            <PhrasalVerbsView
              onBackToVocabulary={() => setVocabSubsection('all')}
              initialDifficulty={q33Difficulty}
            />
          ) : vocabSubsection === 'matching' ? (
            <MatchingView
              onBackToVocabulary={() => setVocabSubsection('all')}
              initialDifficulty={q34Difficulty}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold">
                  {vocabSubsection === 'synonyms-antonyms'
                    ? 'Synonyms & Antonyms (Q27 & Q28 - 100 Authentic Questions)'
                    : `AP SSC Class 10 Vocabulary (${VOCABULARY_TOPICS.length} Modules)`}
                </span>
                <span>
                  {vocabSubsection === 'synonyms-antonyms'
                    ? 'Prose & Poetry Contextual Exam Vocabulary'
                    : 'Synonyms, Antonyms, Right Forms, Spelling, Dictionary, Phrasal Verbs'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VOCABULARY_TOPICS.filter((v) => {
                  if (vocabSubsection === 'synonyms-antonyms') {
                    return v.id === 'synonyms' || v.id === 'antonyms';
                  }
                  return v.title.toLowerCase().includes(searchQuery.toLowerCase());
                }).map((topic, index) => {
                  const isDictionarySkills =
                    topic.id === 'dictionary-skills' || topic.id === 'dictionary-entry';
                  const isPhrasalVerbs =
                    topic.id === 'phrasal-verbs-idioms' || topic.id.includes('phrasal');
                  const isMatching =
                    topic.id === 'matching' || topic.id === 'matching-words';
                  const stats = getQuestionStats(topic.id, 'vocabulary');

                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                            {topic.questionNumber
                              ? `${topic.questionNumber} • Vocabulary`
                              : `Module ${index + 1} • Vocabulary`}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {isDictionarySkills
                              ? '25 Entries • 50 Qs'
                              : isPhrasalVerbs
                              ? '50 Questions'
                              : isMatching
                              ? '50 Matching Qs'
                              : `${stats.total} MCQs`}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-1">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {topic.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        {isDictionarySkills ? (
                          /* Dedicated Dictionary Skills Card Action */
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                              <span>
                                Completed:{' '}
                                <strong className="text-indigo-700">{stats.attempted}</strong> / 50 questions
                              </span>
                              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                                Q.32 Blueprint
                              </span>
                            </div>
                            <button
                              id="open-dictionary-skills-btn"
                              onClick={() => setVocabSubsection('dictionary-skills')}
                              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Open Dictionary Skills (25 Entries)
                            </button>
                          </div>
                        ) : isPhrasalVerbs ? (
                          /* Dedicated Q.33 Slot Card Action */
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                id="btn-q33-simple"
                                onClick={() => {
                                  setQ33Difficulty('easy');
                                  setVocabSubsection('phrasal-verbs-idioms');
                                }}
                                className="py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Simple (20)
                              </button>
                              <button
                                id="btn-q33-medium"
                                onClick={() => {
                                  setQ33Difficulty('medium');
                                  setVocabSubsection('phrasal-verbs-idioms');
                                }}
                                className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Medium (20)
                              </button>
                              <button
                                id="btn-q33-diff"
                                onClick={() => {
                                  setQ33Difficulty('difficult');
                                  setVocabSubsection('phrasal-verbs-idioms');
                                }}
                                className="py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Difficult (10)
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                              <span>
                                Completed:{' '}
                                <strong className="text-indigo-700">{stats.attempted}</strong> / 50 questions
                              </span>
                              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                                Q.33 Blueprint (2 Marks)
                              </span>
                            </div>

                            <button
                              id="open-phrasal-verbs-btn"
                              onClick={() => {
                                setQ33Difficulty('all');
                                setVocabSubsection('phrasal-verbs-idioms');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Open Question No. 33 (Phrasal Verbs &amp; Idioms)
                            </button>
                          </div>
                        ) : isMatching ? (
                          /* Dedicated Q.34 Matching Card Action */
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                id="btn-q34-easy"
                                onClick={() => {
                                  setQ34Difficulty('easy');
                                  setVocabSubsection('matching');
                                }}
                                className="py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Easy (20)
                              </button>
                              <button
                                id="btn-q34-medium"
                                onClick={() => {
                                  setQ34Difficulty('medium');
                                  setVocabSubsection('matching');
                                }}
                                className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Medium (20)
                              </button>
                              <button
                                id="btn-q34-diff"
                                onClick={() => {
                                  setQ34Difficulty('difficult');
                                  setVocabSubsection('matching');
                                }}
                                className="py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[10px] font-bold"
                              >
                                Difficult (10)
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                              <span>
                                Completed:{' '}
                                <strong className="text-indigo-700">{stats.attempted}</strong> / 50 questions
                              </span>
                              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                                Q.34 Blueprint (2 Marks)
                              </span>
                            </div>

                            <button
                              id="open-matching-btn"
                              onClick={() => {
                                setQ34Difficulty('all');
                                setVocabSubsection('matching');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Open Question No. 34 (Matching)
                            </button>
                          </div>
                        ) : (
                          /* Standard MCQ Practice Card Action */
                          <>
                            {stats.total > 0 && (
                              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                                <button
                                  id={`btn-vocab-simple-${topic.id}`}
                                  onClick={() =>
                                    onStartLessonPractice(
                                      topic.id,
                                      topic.title,
                                      'vocabulary',
                                      'simple'
                                    )
                                  }
                                  className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors text-[11px] font-bold"
                                >
                                  Simple ({stats.simpleCount})
                                </button>
                                <button
                                  id={`btn-vocab-med-${topic.id}`}
                                  onClick={() =>
                                    onStartLessonPractice(
                                      topic.id,
                                      topic.title,
                                      'vocabulary',
                                      'medium'
                                    )
                                  }
                                  className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-center transition-colors text-[11px] font-bold"
                                >
                                  Medium ({stats.mediumCount})
                                </button>
                                <button
                                  id={`btn-vocab-diff-${topic.id}`}
                                  onClick={() =>
                                    onStartLessonPractice(
                                      topic.id,
                                      topic.title,
                                      'vocabulary',
                                      'difficult'
                                    )
                                  }
                                  className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-center transition-colors text-[11px] font-bold"
                                >
                                  Difficult ({stats.difficultCount})
                                </button>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-2">
                              <div className="text-[11px] text-slate-500 font-medium">
                                Completed:{' '}
                                <strong className="text-amber-800">{stats.attempted}</strong> /{' '}
                                {stats.total}
                              </div>

                              <button
                                id={`start-vocab-${topic.id}`}
                                onClick={() =>
                                  onStartLessonPractice(
                                    topic.id,
                                    topic.title,
                                    'vocabulary',
                                    difficultyFilter
                                  )
                                }
                                className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                Practice Topic
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Creative Expressions (Questions 35, 36 & 37) */}
      {activeSection === 'creative-expressions' && (
        <CreativeExpressionsView onBackToCurriculum={() => setActiveSection('prose')} />
      )}
    </div>
  );
};
