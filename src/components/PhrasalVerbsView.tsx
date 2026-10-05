import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Search,
  ArrowRight,
  Volume2,
  HelpCircle,
  Layers,
  Flame,
  Zap,
  Target,
  ListOrdered
} from 'lucide-react';
import {
  PREPARATION_PHRASAL_VERBS,
  PREPARATION_IDIOMATIC_EXPRESSIONS,
  ALL_PREPARATION_EXPRESSIONS,
  Q33_PRACTICE_QUESTIONS,
  Q33_QUESTIONS_BY_LEVEL,
  Q33_METADATA,
  Q33PracticeQuestion,
  PreparationExpression
} from '../data/q33PhrasalVerbsData';

export const Q33_STORAGE_KEY = 'ap_ssc_q33_progress_v4';

type MainSection = 'home' | 'phrasal_verbs' | 'idiomatic_expressions' | 'practice_questions';
type PracticeLevel = 'simple' | 'medium' | 'difficult' | 'all';

interface QuestionAttempt {
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  answeredAt: string;
}

interface PhrasalVerbsViewProps {
  onBackToVocabulary?: () => void;
  initialDifficulty?: 'all' | 'easy' | 'medium' | 'difficult';
}

export const PhrasalVerbsView: React.FC<PhrasalVerbsViewProps> = ({
  onBackToVocabulary,
  initialDifficulty = 'all',
}) => {
  // Map incoming initialDifficulty
  const mappedLevel: PracticeLevel =
    initialDifficulty === 'easy'
      ? 'simple'
      : initialDifficulty === 'medium'
      ? 'medium'
      : initialDifficulty === 'difficult'
      ? 'difficult'
      : 'simple';

  const [activeSection, setActiveSection] = useState<MainSection>(
    initialDifficulty !== 'all' ? 'practice_questions' : 'home'
  );
  const [activeLevel, setActiveLevel] = useState<PracticeLevel>(mappedLevel);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showCompletedScore, setShowCompletedScore] = useState<boolean>(false);

  // Stored attempts map: questionId -> QuestionAttempt
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>(() => {
    try {
      const saved = localStorage.getItem(Q33_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading Q33 progress:', e);
    }
    return {};
  });

  // Save attempts to localStorage
  const saveAttempt = (questionId: string, selectedOption: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => {
    const updated = {
      ...attempts,
      [questionId]: {
        selectedOption,
        isCorrect,
        answeredAt: new Date().toISOString(),
      },
    };
    setAttempts(updated);
    try {
      localStorage.setItem(Q33_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ap_ssc_storage_updated', { detail: { key: Q33_STORAGE_KEY } }));
    } catch (e) {
      console.error('Error saving Q33 progress:', e);
    }
  };

  const resetAllAttempts = () => {
    if (window.confirm('Reset all Question 33 practice answers and scores?')) {
      setAttempts({});
      try {
        localStorage.removeItem(Q33_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('ap_ssc_storage_updated', { detail: { key: Q33_STORAGE_KEY } }));
      } catch (e) {
        console.error('Error resetting Q33 progress:', e);
      }
      setCurrentQuestionIndex(0);
      setShowCompletedScore(false);
    }
  };

  // Filter questions for the selected practice level
  const currentLevelQuestions = useMemo(() => {
    if (activeLevel === 'all') return Q33_PRACTICE_QUESTIONS;
    return Q33_QUESTIONS_BY_LEVEL[activeLevel] || Q33_QUESTIONS_BY_LEVEL.simple;
  }, [activeLevel]);

  // Ensure current question index is in bounds
  const currentQuestion: Q33PracticeQuestion | undefined =
    currentLevelQuestions[currentQuestionIndex] || currentLevelQuestions[0];

  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;

  // Level statistics
  const levelStats = useMemo(() => {
    const getStats = (questions: Q33PracticeQuestion[]) => {
      const total = questions.length;
      let answered = 0;
      let correct = 0;
      questions.forEach((q) => {
        if (attempts[q.id]) {
          answered++;
          if (attempts[q.id].isCorrect) correct++;
        }
      });
      return { total, answered, correct, percentage: answered > 0 ? Math.round((correct / answered) * 100) : 0 };
    };

    return {
      simple: getStats(Q33_QUESTIONS_BY_LEVEL.simple),
      medium: getStats(Q33_QUESTIONS_BY_LEVEL.medium),
      difficult: getStats(Q33_QUESTIONS_BY_LEVEL.difficult),
      all: getStats(Q33_PRACTICE_QUESTIONS),
    };
  }, [attempts]);

  // Overall counts
  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect = Object.values(attempts).filter((a) => a.isCorrect).length;

  const handleSelectOption = (optionValue: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    if (currentAttempt) return; // Already answered

    const isCorrect = optionValue === currentQuestion.correctAnswer;
    saveAttempt(currentQuestion.id, optionValue, isCorrect);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentLevelQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowCompletedScore(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleLevelChange = (lvl: PracticeLevel) => {
    setActiveLevel(lvl);
    setCurrentQuestionIndex(0);
    setShowCompletedScore(false);
  };

  // Text-to-speech for expressions and sentences
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Blueprint Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {onBackToVocabulary && (
                <button
                  onClick={onBackToVocabulary}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors mr-1"
                  title="Back to Vocabulary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                Question No. 33 • Vocabulary
              </span>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                2 × 1 = 2 Marks Blueprint
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                50 Practice Questions
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Phrasal Verbs &amp; Idiomatic Expressions
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong className="text-slate-800">Board Instruction:</strong> “{Q33_METADATA.blueprint_instruction}”
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 px-4 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Practice Progress</div>
              <div className="text-sm font-black text-indigo-700">
                {totalAttempted} / 50 <span className="text-xs font-semibold text-slate-500">({totalCorrect} Correct)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structural Main Screen Navigation (Matches Handwritten Reference Diagram) */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Branch 1: Phrasal Verbs */}
            <button
              id="q33-btn-phrasal-verbs"
              onClick={() => {
                setActiveSection('phrasal_verbs');
                setSearchFilter('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                activeSection === 'phrasal_verbs'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    activeSection === 'phrasal_verbs'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  Section 1
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeSection === 'phrasal_verbs' ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  28 items
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">
                Phrasal Verbs
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeSection === 'phrasal_verbs' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Expression, meaning &amp; examples
              </div>
            </button>

            {/* Branch 2: Idiomatic Expressions */}
            <button
              id="q33-btn-idiomatic-expressions"
              onClick={() => {
                setActiveSection('idiomatic_expressions');
                setSearchFilter('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                activeSection === 'idiomatic_expressions'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    activeSection === 'idiomatic_expressions'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  Section 2
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeSection === 'idiomatic_expressions' ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  17 items
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">
                Idiomatic Expressions
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeSection === 'idiomatic_expressions' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Expression, meaning &amp; examples
              </div>
            </button>

            {/* Branch 3: Practice Questions */}
            <button
              id="q33-btn-practice-questions"
              onClick={() => {
                setActiveSection('practice_questions');
                setShowCompletedScore(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                activeSection === 'practice_questions'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    activeSection === 'practice_questions'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  Section 3
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeSection === 'practice_questions' ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  3 levels • 50 Qs
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">
                Practice Questions
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeSection === 'practice_questions' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Simple, Medium, Difficult
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          HOME OVERVIEW (Shown when no specific sub-tab is clicked yet)
         ======================================================== */}
      {activeSection === 'home' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Handwritten Flow Diagram Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Question 33 Structure &amp; Study Path
                </h2>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                Interactive Learning Hub
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Use the study material below to master all 28 Phrasal Verbs and 17 Idiomatic Expressions, followed by the 50 Board-standard multiple-choice practice questions with instant evaluation.
            </p>

            {/* Visual 3-Column Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base mb-3 shadow-xs">
                    28
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">
                    Phrasal Verbs
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Complete list of 28 textbook phrasal verbs with lucid definitions and textbook-aligned example sentences.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('phrasal_verbs')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View 28 Phrasal Verbs
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/40 rounded-2xl p-5 border border-purple-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-base mb-3 shadow-xs">
                    17
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">
                    Idiomatic Expressions
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Comprehensive bank of 17 high-frequency idioms from the Class 10 prose units with precise contextual meanings.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('idiomatic_expressions')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View 17 Idiomatic Expressions
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-2xl p-5 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base mb-3 shadow-xs">
                    50
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">
                    Practice Questions
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    3 difficulty tiers: Simple (20), Medium (20), Difficult (10). Immediate check on selection with full explanations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveSection('practice_questions');
                    setActiveLevel('simple');
                    setShowCompletedScore(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Start Practice (Simple)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 1: PHRASAL VERBS (28 items)
         ======================================================== */}
      {activeSection === 'phrasal_verbs' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                    Preparation Material
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    28 Expressions
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Phrasal Verbs
                </h2>
                <p className="text-xs text-slate-600">
                  Carefully read each phrasal verb, its meaning, and how it is used in the model sentence.
                </p>
              </div>

              {/* Search in 28 items */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter 28 phrasal verbs..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PREPARATION_PHRASAL_VERBS.filter(
                (item) =>
                  item.expression.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.meaning.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.example.toLowerCase().includes(searchFilter.toLowerCase())
              ).map((item) => (
                <div
                  key={item.no}
                  className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all hover:shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        #{item.no}
                      </span>
                      <button
                        onClick={() => handleSpeak(`${item.expression}. Meaning: ${item.meaning}. Example: ${item.example}`)}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Pronounce Expression & Sentence"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-900 transition-colors mb-1.5">
                      {item.expression}
                    </h3>

                    <div className="mb-2.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1.5">
                        Meaning:
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {item.meaning}
                      </span>
                    </div>

                    <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-700 italic">
                      <span className="font-bold not-italic text-slate-400 mr-1.5">
                        e.g.
                      </span>
                      “{item.example}”
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100/60 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setActiveSection('practice_questions');
                        setActiveLevel('all');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Practice in MCQs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: IDIOMATIC EXPRESSIONS (17 items)
         ======================================================== */}
      {activeSection === 'idiomatic_expressions' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    Preparation Material
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    17 Expressions
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Idiomatic Expressions
                </h2>
                <p className="text-xs text-slate-600">
                  Idioms carry figurative meanings distinct from their literal words. Review each expression, its definition, and sample sentence.
                </p>
              </div>

              {/* Search in 17 items */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter 17 idiomatic expressions..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {PREPARATION_IDIOMATIC_EXPRESSIONS.filter(
                (item) =>
                  item.expression.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.meaning.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.example.toLowerCase().includes(searchFilter.toLowerCase())
              ).map((item) => (
                <div
                  key={item.no}
                  className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-4 transition-all hover:shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg">
                        #{item.no}
                      </span>
                      <button
                        onClick={() => handleSpeak(`${item.expression}. Meaning: ${item.meaning}. Example: ${item.example}`)}
                        className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Pronounce Idiom & Sentence"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-purple-900 transition-colors mb-1.5">
                      {item.expression}
                    </h3>

                    <div className="mb-2.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1.5">
                        Meaning:
                      </span>
                      <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                        {item.meaning}
                      </span>
                    </div>

                    <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-700 italic">
                      <span className="font-bold not-italic text-slate-400 mr-1.5">
                        e.g.
                      </span>
                      “{item.example}”
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100/60 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setActiveSection('practice_questions');
                        setActiveLevel('all');
                      }}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Practice in MCQs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: PRACTICE QUESTIONS (3 Levels • 50 Questions)
         ======================================================== */}
      {activeSection === 'practice_questions' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Level Switcher (Simple 20, Medium 20, Difficult 10) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Select Practice Level
                </span>
                <div className="text-xs text-slate-600 mt-0.5">
                  50 questions in total: Simple (20), Medium (20), Difficult (10)
                </div>
              </div>

              {totalAttempted > 0 && (
                <button
                  onClick={resetAllAttempts}
                  className="self-start sm:self-auto text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  title="Clear all saved answers and restart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Attempts
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Simple (20) */}
              <button
                id="btn-level-simple"
                onClick={() => handleLevelChange('simple')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  activeLevel === 'simple'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-200'
                    : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-black text-sm">Simple</span>
                </div>
                <span className="text-xs font-semibold opacity-90">
                  20 Questions
                </span>
                <span className="text-[10px] font-bold opacity-80 mt-0.5">
                  Score: {levelStats.simple.correct} / {levelStats.simple.total}
                </span>
              </button>

              {/* Medium (20) */}
              <button
                id="btn-level-medium"
                onClick={() => handleLevelChange('medium')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  activeLevel === 'medium'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs ring-2 ring-amber-200'
                    : 'bg-amber-50/50 hover:bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-black text-sm">Medium</span>
                </div>
                <span className="text-xs font-semibold opacity-90">
                  20 Questions
                </span>
                <span className="text-[10px] font-bold opacity-80 mt-0.5">
                  Score: {levelStats.medium.correct} / {levelStats.medium.total}
                </span>
              </button>

              {/* Difficult (10) */}
              <button
                id="btn-level-difficult"
                onClick={() => handleLevelChange('difficult')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  activeLevel === 'difficult'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                    : 'bg-rose-50/50 hover:bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span className="font-black text-sm">Difficult</span>
                </div>
                <span className="text-xs font-semibold opacity-90">
                  10 Questions
                </span>
                <span className="text-[10px] font-bold opacity-80 mt-0.5">
                  Score: {levelStats.difficult.correct} / {levelStats.difficult.total}
                </span>
              </button>
            </div>
          </div>

          {/* FINAL SCORE VIEW (Shown after completing or via summary button) */}
          {showCompletedScore ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-xs">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Level Summary • {activeLevel.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Practice Completed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  You scored <strong className="text-indigo-700 font-extrabold">{levelStats[activeLevel].correct}</strong> out of <strong className="text-slate-800">{currentLevelQuestions.length}</strong> questions in this section.
                </p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-bold text-emerald-800">Correct Answers</div>
                  <div className="text-2xl font-black text-emerald-700 mt-0.5">
                    {levelStats[activeLevel].correct}
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                  <div className="text-xs font-bold text-rose-800">Incorrect / Missed</div>
                  <div className="text-2xl font-black text-rose-700 mt-0.5">
                    {currentLevelQuestions.length - levelStats[activeLevel].correct}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCompletedScore(false);
                    setCurrentQuestionIndex(0);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Review All Questions
                </button>
                {activeLevel === 'simple' && (
                  <button
                    onClick={() => handleLevelChange('medium')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Medium Level</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {activeLevel === 'medium' && (
                  <button
                    onClick={() => handleLevelChange('difficult')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Difficult Level</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ACTIVE QUESTION CARD */
            currentQuestion && (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                {/* Question Header & Pagination Bar */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                        Q.{currentQuestion.number} of 50
                      </span>
                      <span
                        className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          currentQuestion.difficulty === 'simple'
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentQuestion.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-500">
                      Level: Question {currentQuestionIndex + 1} of {currentLevelQuestions.length}
                    </div>
                  </div>

                  {/* Question Prompt Sentence */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>
                </div>

                {/* Answer Options A, B, C, D */}
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
                    Select the correct option (A, B, C, or D):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = currentAttempt?.selectedOption === opt.value;
                      const isCorrectOpt = opt.value === currentQuestion.correctAnswer;
                      const isAnswered = !!currentAttempt;

                      let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300';
                      let badgeStyle = 'bg-slate-100 text-slate-700';

                      if (isAnswered) {
                        if (isCorrectOpt) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-200';
                          badgeStyle = 'bg-emerald-600 text-white font-black';
                        } else if (isSelected && !isCorrectOpt) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                          badgeStyle = 'bg-rose-600 text-white font-black';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                          badgeStyle = 'bg-slate-200 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={opt.value}
                          id={`q33-opt-${opt.value}`}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(opt.value)}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${btnStyle}`}
                        >
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 transition-colors ${badgeStyle}`}
                          >
                            {opt.value}
                          </span>
                          <span className="font-semibold text-sm leading-snug grow">
                            {opt.label}
                          </span>
                          {isAnswered && isCorrectOpt && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isSelected && !isCorrectOpt && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* IMMEDIATE FEEDBACK SECTION */}
                {currentAttempt && (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border animate-in fade-in slide-in-from-top-2 duration-200 ${
                      currentAttempt.isCorrect
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {currentAttempt.isCorrect ? (
                          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <XCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="grow space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-black text-sm tracking-tight ${
                              currentAttempt.isCorrect ? 'text-emerald-800' : 'text-rose-800'
                            }`}
                          >
                            {currentAttempt.isCorrect ? '✓ Right Answer' : '✗ Wrong Answer'}
                          </span>
                          {!currentAttempt.isCorrect && (
                            <span className="text-xs font-bold text-rose-900 bg-white/70 px-2 py-0.5 rounded-md border border-rose-200">
                              Correct: Option {currentQuestion.correctAnswer} (
                              {currentQuestion.options.find((o) => o.value === currentQuestion.correctAnswer)?.label}
                              )
                            </span>
                          )}
                        </div>

                        {/* Explanation */}
                        <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                          {currentAttempt.isCorrect
                            ? currentQuestion.feedback.onCorrect
                            : currentQuestion.feedback.onWrong}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons: Previous & Next Question */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Quick question pill jump dropdown or count */}
                  <div className="text-xs font-bold text-slate-500 hidden sm:block">
                    {currentQuestionIndex + 1} / {currentLevelQuestions.length}
                  </div>

                  <button
                    id="btn-next-question"
                    onClick={handleNextQuestion}
                    className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>
                      {currentQuestionIndex === currentLevelQuestions.length - 1
                        ? 'Finish & View Score'
                        : 'Next Question'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Numbers Quick Navigation Strip */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 mb-2">
                    Jump to Question:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {currentLevelQuestions.map((q, idx) => {
                      const att = attempts[q.id];
                      const isCurrent = idx === currentQuestionIndex;
                      let pillClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                      if (att) {
                        pillClass = att.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-rose-100 text-rose-800 font-bold';
                      }
                      if (isCurrent) {
                        pillClass += ' ring-2 ring-indigo-500 font-black';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setCurrentQuestionIndex(idx);
                            setShowCompletedScore(false);
                          }}
                          className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${pillClass}`}
                          title={`Question ${q.number} (${q.difficulty})`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
