import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Search,
  ArrowRight,
  Volume2,
  Layers,
  Zap,
  HelpCircle,
  Sparkles,
  Link2,
  Check
} from 'lucide-react';
import {
  Q34_METADATA,
  Q34_PHRASAL_VERBS,
  Q34_IDIOMATIC_EXPRESSIONS,
  Q34_CONTEXTUAL_VOCABULARY,
  Q34_ALL_PREPARATION_ITEMS,
  Q34_ALL_PRACTICE_QUESTIONS,
  Q34_QUESTIONS_BY_LEVEL,
  Q34MatchingQuestion,
  Q34Difficulty,
  Q34Category,
  Q34PreparationItem
} from '../data/q34MatchingData';

export const Q34_STORAGE_KEY = 'ap_ssc_q34_matching_progress_v1';

type MainSection = 'preparation' | 'practice';
type PrepSubSection = 'all' | 'phrasal_verbs' | 'idiomatic_expressions' | 'contextual_vocabulary';

interface StoredMatchAttempt {
  questionId: string;
  userMatches: Record<string, string>; // e.g. { i: 'd', j: 'c', k: 'b', l: 'a' }
  isAllCorrect: boolean;
  correctCount: number;
  marks: number;
  answeredAt: string;
}

interface MatchingViewProps {
  onBackToVocabulary?: () => void;
  initialDifficulty?: 'all' | 'easy' | 'medium' | 'difficult';
}

export const MatchingView: React.FC<MatchingViewProps> = ({
  onBackToVocabulary,
  initialDifficulty = 'all',
}) => {
  const mappedLevel: Q34Difficulty =
    initialDifficulty === 'difficult'
      ? 'difficult'
      : initialDifficulty === 'medium'
      ? 'medium'
      : 'easy';

  const [activeMainSection, setActiveMainSection] = useState<MainSection>(
    initialDifficulty !== 'all' ? 'practice' : 'preparation'
  );
  const [activePrepSub, setActivePrepSub] = useState<PrepSubSection>('phrasal_verbs');
  const [activeLevel, setActiveLevel] = useState<Q34Difficulty>(mappedLevel);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFinalScore, setShowFinalScore] = useState<boolean>(false);

  // Student's temporary matching selections for the current question:
  // e.g. { i: 'd', j: 'c', k: '', l: '' }
  const [currentSelections, setCurrentSelections] = useState<Record<string, string>>({
    i: '',
    j: '',
    k: '',
    l: '',
  });

  // Stored attempts: questionId -> StoredMatchAttempt
  const [attempts, setAttempts] = useState<Record<string, StoredMatchAttempt>>(() => {
    try {
      const saved = localStorage.getItem(Q34_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error('Error reading Q34 progress:', e);
    }
    return {};
  });

  // Questions for active practice level
  const currentQuestions = useMemo(() => {
    return Q34_QUESTIONS_BY_LEVEL[activeLevel] || Q34_QUESTIONS_BY_LEVEL.easy;
  }, [activeLevel]);

  const currentQuestion: Q34MatchingQuestion | undefined =
    currentQuestions[currentQuestionIndex] || currentQuestions[0];

  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;

  // Sync currentSelections when currentQuestion changes
  useEffect(() => {
    if (!currentQuestion) return;
    if (attempts[currentQuestion.id]) {
      setCurrentSelections(attempts[currentQuestion.id].userMatches);
    } else {
      setCurrentSelections({ i: '', j: '', k: '', l: '' });
    }
  }, [currentQuestion?.id, attempts]);

  // Handle single match selection
  const handleAssignMatch = (partAKey: string, partBLetter: string) => {
    if (currentAttempt) return; // Already submitted

    setCurrentSelections((prev) => {
      // If another item in Part A already had this Part B letter, clear it or swap it
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (updated[k] === partBLetter && k !== partAKey) {
          updated[k] = '';
        }
      });
      updated[partAKey] = partBLetter;
      return updated;
    });
  };

  // Submit matching answer
  const handleSubmitMatching = () => {
    if (!currentQuestion || currentAttempt) return;

    // Check completeness
    const keys: Array<'i' | 'j' | 'k' | 'l'> = ['i', 'j', 'k', 'l'];
    const unanswered = keys.filter((k) => !currentSelections[k]);
    if (unanswered.length > 0) {
      alert(`Please assign a matching option for all 4 items before submitting.`);
      return;
    }

    // Evaluate
    let correctCount = 0;
    keys.forEach((k) => {
      const correctChoice = currentQuestion.answerKey[k];
      if (currentSelections[k].toLowerCase() === correctChoice.toLowerCase()) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === 4;
    const marks = correctCount * 0.5;

    const newAttempt: StoredMatchAttempt = {
      questionId: currentQuestion.id,
      userMatches: { ...currentSelections },
      isAllCorrect,
      correctCount,
      marks,
      answeredAt: new Date().toISOString(),
    };

    const updated = {
      ...attempts,
      [currentQuestion.id]: newAttempt,
    };
    setAttempts(updated);
    try {
      localStorage.setItem(Q34_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ap_ssc_storage_updated', { detail: { key: Q34_STORAGE_KEY } }));
    } catch (e) {
      console.error('Error saving Q34 progress:', e);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowFinalScore(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleLevelChange = (lvl: Q34Difficulty) => {
    setActiveLevel(lvl);
    setCurrentQuestionIndex(0);
    setShowFinalScore(false);
  };

  const resetAllAttempts = () => {
    if (window.confirm('Reset all Question 34 matching practice answers and scores?')) {
      setAttempts({});
      try {
        localStorage.removeItem(Q34_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('ap_ssc_storage_updated', { detail: { key: Q34_STORAGE_KEY } }));
      } catch (e) {
        console.error('Error clearing Q34 progress:', e);
      }
      setCurrentSelections({ i: '', j: '', k: '', l: '' });
      setCurrentQuestionIndex(0);
      setShowFinalScore(false);
    }
  };

  // Level statistics
  const levelStats = useMemo(() => {
    const calc = (questions: Q34MatchingQuestion[]) => {
      const total = questions.length;
      let answered = 0;
      let allCorrect = 0;
      let totalMarksEarned = 0;
      questions.forEach((q) => {
        const att = attempts[q.id];
        if (att) {
          answered++;
          if (att.isAllCorrect) allCorrect++;
          totalMarksEarned += att.marks;
        }
      });
      const maxMarks = total * 2;
      return {
        total,
        answered,
        allCorrect,
        wrongCount: answered - allCorrect,
        totalMarksEarned,
        maxMarks,
        pct: answered > 0 ? Math.round((allCorrect / answered) * 100) : 0,
      };
    };

    return {
      easy: calc(Q34_QUESTIONS_BY_LEVEL.easy),
      medium: calc(Q34_QUESTIONS_BY_LEVEL.medium),
      difficult: calc(Q34_QUESTIONS_BY_LEVEL.difficult),
      all: calc(Q34_ALL_PRACTICE_QUESTIONS),
    };
  }, [attempts]);

  // Overall counts
  const totalAttempted = Object.keys(attempts).length;
  const totalAllCorrect = Object.values(attempts).filter((a) => a.isAllCorrect).length;

  // Text to speech
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

  // Preparation items filtered
  const filteredPrepItems = useMemo(() => {
    let list: Q34PreparationItem[] = [];
    if (activePrepSub === 'phrasal_verbs') list = Q34_PHRASAL_VERBS;
    else if (activePrepSub === 'idiomatic_expressions') list = Q34_IDIOMATIC_EXPRESSIONS;
    else if (activePrepSub === 'contextual_vocabulary') list = Q34_CONTEXTUAL_VOCABULARY;
    else list = Q34_ALL_PREPARATION_ITEMS;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.expression.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
    );
  }, [activePrepSub, searchQuery]);

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
                Question No. 34 • Vocabulary
              </span>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                4 × ½ = 2 Marks Blueprint
              </span>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Unit 3 &amp; Unit 4 only
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Matching (Part A &amp; Part B)
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong className="text-slate-800">Board Instruction:</strong> “{Q34_METADATA.blueprintInstruction}” (4 matching items × ½ mark = 2 marks).
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 px-4 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Matching Practice</div>
              <div className="text-sm font-black text-indigo-700">
                {totalAttempted} / 50 <span className="text-xs font-semibold text-slate-500">({totalAllCorrect} Perfect)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structural Main Screen Navigation: Preparation vs Practice Questions */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Branch 1: Preparation */}
            <button
              id="q34-btn-preparation"
              onClick={() => {
                setActiveMainSection('preparation');
                setShowFinalScore(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                activeMainSection === 'preparation'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    activeMainSection === 'preparation'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  Branch 1
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeMainSection === 'preparation' ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  28 items • 3 categories
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">
                Preparation Material
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeMainSection === 'preparation' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Phrasal Verbs (12) • Idiomatic Expressions (11) • Contextual Vocabulary (5)
              </div>
            </button>

            {/* Branch 2: Practice Questions */}
            <button
              id="q34-btn-practice"
              onClick={() => {
                setActiveMainSection('practice');
                setShowFinalScore(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                activeMainSection === 'practice'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    activeMainSection === 'practice'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  Branch 2
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeMainSection === 'practice' ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  50 questions • 3 levels
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">
                Practice Questions (Matching)
              </div>
              <div
                className={`text-xs mt-1 ${
                  activeMainSection === 'practice' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Easy (20) • Medium (20) • Difficult (10)
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          BRANCH 1: PREPARATION MATERIAL
         ======================================================== */}
      {activeMainSection === 'preparation' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            {/* Header & Sub-tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    Syllabus: Unit 3 &amp; Unit 4 only
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    28 Total Textbook Items
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Preparation by Category
                </h2>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search preparation items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* 3 Preparation Category Tabs as explicitly specified */}
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-prep-phrasal-verbs"
                onClick={() => setActivePrepSub('phrasal_verbs')}
                className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                  activePrepSub === 'phrasal_verbs'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                }`}
              >
                <div className="text-xs sm:text-sm">1. Phrasal Verbs</div>
                <div className="text-[10px] opacity-80 font-normal">12 Items</div>
              </button>

              <button
                id="btn-prep-idiomatic-expressions"
                onClick={() => setActivePrepSub('idiomatic_expressions')}
                className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                  activePrepSub === 'idiomatic_expressions'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                }`}
              >
                <div className="text-xs sm:text-sm">2. Idiomatic Expressions</div>
                <div className="text-[10px] opacity-80 font-normal">11 Items</div>
              </button>

              <button
                id="btn-prep-contextual-vocabulary"
                onClick={() => setActivePrepSub('contextual_vocabulary')}
                className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                  activePrepSub === 'contextual_vocabulary'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                }`}
              >
                <div className="text-xs sm:text-sm">3. Contextual Vocabulary</div>
                <div className="text-[10px] opacity-80 font-normal">5 Items</div>
              </button>
            </div>

            {/* Preparation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {filteredPrepItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all hover:shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        #{idx + 1} • {item.unit}
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
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block">
                        {item.meaning}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-2.5 border border-slate-100 text-xs text-slate-700 italic">
                      <span className="font-bold not-italic text-slate-400 mr-1.5">
                        e.g.
                      </span>
                      “{item.example}”
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setActiveMainSection('practice');
                        setActiveLevel('easy');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Practice in Matching</span>
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
          BRANCH 2: PRACTICE QUESTIONS (50 Matching Questions)
         ======================================================== */}
      {activeMainSection === 'practice' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Level Switcher (Easy 20, Medium 20, Difficult 10) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Select Matching Practice Level
                </span>
                <div className="text-xs text-slate-600 mt-0.5">
                  50 Matching Questions in total: Easy (20), Medium (20), Difficult (10)
                </div>
              </div>

              {totalAttempted > 0 && (
                <button
                  onClick={resetAllAttempts}
                  className="self-start sm:self-auto text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  title="Clear all saved matching answers and restart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Attempts
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Easy (20) */}
              <button
                id="q34-btn-level-easy"
                onClick={() => handleLevelChange('easy')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  activeLevel === 'easy'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-200'
                    : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-black text-sm">Easy</span>
                </div>
                <span className="text-xs font-semibold opacity-90">
                  20 Questions
                </span>
                <span className="text-[10px] font-bold opacity-80 mt-0.5">
                  Solved: {levelStats.easy.allCorrect} / {levelStats.easy.total}
                </span>
              </button>

              {/* Medium (20) */}
              <button
                id="q34-btn-level-medium"
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
                  Solved: {levelStats.medium.allCorrect} / {levelStats.medium.total}
                </span>
              </button>

              {/* Difficult (10) */}
              <button
                id="q34-btn-level-difficult"
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
                  Solved: {levelStats.difficult.allCorrect} / {levelStats.difficult.total}
                </span>
              </button>
            </div>
          </div>

          {/* FINAL RESULT VIEW */}
          {showFinalScore ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-xs">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Level Summary • {activeLevel.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Matching Practice Completed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  You successfully mastered the matching exercises for Unit 3 &amp; Unit 4.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Qs</div>
                  <div className="text-xl font-black text-slate-800 mt-0.5">
                    {levelStats[activeLevel].total}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">All Correct</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">
                    {levelStats[activeLevel].allCorrect}
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-rose-800 uppercase">Wrong Matches</div>
                  <div className="text-xl font-black text-rose-700 mt-0.5">
                    {levelStats[activeLevel].wrongCount}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-indigo-800 uppercase">Marks / Score</div>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">
                    {levelStats[activeLevel].totalMarksEarned} / {levelStats[activeLevel].maxMarks}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-500">
                    {levelStats[activeLevel].pct}%
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowFinalScore(false);
                    setCurrentQuestionIndex(0);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Review All Questions
                </button>
                {activeLevel === 'easy' && (
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
                {/* Question Header & Level Tracker */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                        Question #{currentQuestion.number}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          currentQuestion.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentQuestion.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                        4 × ½ = 2 Marks
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-500">
                      {currentQuestionIndex + 1} of {currentQuestions.length} Questions
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Match all four expressions in <strong className="text-slate-900">PART A</strong> with the correct meanings in <strong className="text-slate-900">PART B</strong>:
                  </p>
                </div>

                {/* MATCHING INTERFACE: PART A & PART B COLUMNS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* PART A COLUMN (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                        PART A (Expressions)
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Select matching meaning (a, b, c, d)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.partA.map((aItem) => {
                        const assignedLetter = currentSelections[aItem.key];
                        const isAnswered = !!currentAttempt;
                        const correctLetter = currentQuestion.answerKey[aItem.key];
                        const isThisItemCorrect = isAnswered && assignedLetter?.toLowerCase() === correctLetter?.toLowerCase();

                        // Meaning label if assigned
                        const matchedB = currentQuestion.partB.find(
                          (b) => b.letter.toLowerCase() === assignedLetter?.toLowerCase()
                        );

                        let cardBorder = 'border-slate-200 bg-slate-50/70 hover:border-indigo-300';
                        if (isAnswered) {
                          cardBorder = isThisItemCorrect
                            ? 'border-emerald-300 bg-emerald-50/70'
                            : 'border-rose-300 bg-rose-50/70';
                        } else if (assignedLetter) {
                          cardBorder = 'border-indigo-300 bg-indigo-50/30';
                        }

                        return (
                          <div
                            key={aItem.key}
                            className={`p-3.5 rounded-2xl border transition-all ${cardBorder}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              {/* Left: Roman Numeral & Expression */}
                              <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                  {aItem.romanNumeral}
                                </span>
                                <div>
                                  <div className="text-sm sm:text-base font-black text-slate-900">
                                    {aItem.expression}
                                  </div>
                                  {matchedB && (
                                    <div className="text-xs font-medium text-slate-600 line-clamp-1 mt-0.5">
                                      → <span className="font-bold uppercase text-indigo-700">({matchedB.letter})</span> {matchedB.meaning}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Option Selectors [a] [b] [c] [d] */}
                              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                {currentQuestion.partB.map((bItem) => {
                                  const isSelected = assignedLetter?.toLowerCase() === bItem.letter.toLowerCase();
                                  const isActuallyCorrect = bItem.letter.toLowerCase() === correctLetter?.toLowerCase();

                                  let btnClass = 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200';
                                  if (isAnswered) {
                                    if (isActuallyCorrect) {
                                      btnClass = 'bg-emerald-600 text-white border-emerald-600 font-black ring-2 ring-emerald-200';
                                    } else if (isSelected && !isActuallyCorrect) {
                                      btnClass = 'bg-rose-600 text-white border-rose-600 font-black';
                                    } else {
                                      btnClass = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                                    }
                                  } else if (isSelected) {
                                    btnClass = 'bg-indigo-600 text-white border-indigo-600 font-black shadow-xs ring-2 ring-indigo-200';
                                  }

                                  return (
                                    <button
                                      key={bItem.letter}
                                      type="button"
                                      disabled={isAnswered}
                                      onClick={() => handleAssignMatch(aItem.key, bItem.letter)}
                                      className={`w-8 h-8 rounded-xl text-xs uppercase font-extrabold border transition-all flex items-center justify-center ${btnClass}`}
                                      title={`Match ${aItem.romanNumeral} with Option (${bItem.letter})`}
                                    >
                                      {bItem.letter}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PART B COLUMN (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                        PART B (Meanings)
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Options a, b, c, d
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentQuestion.partB.map((bItem) => {
                        // Find which Part A key has selected this B option
                        const pairedAKey = Object.keys(currentSelections).find(
                          (k) => currentSelections[k]?.toLowerCase() === bItem.letter.toLowerCase()
                        );
                        const pairedAItem = pairedAKey
                          ? currentQuestion.partA.find((a) => a.key === pairedAKey)
                          : undefined;

                        return (
                          <div
                            key={bItem.letter}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              pairedAItem
                                ? 'bg-purple-50/50 border-purple-200 shadow-2xs'
                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-purple-900 font-black text-xs uppercase flex items-center justify-center shrink-0 mt-0.5">
                                {bItem.letter})
                              </span>
                              <div className="text-xs font-medium text-slate-800 leading-relaxed grow">
                                {bItem.meaning}
                              </div>
                            </div>
                            {pairedAItem && (
                              <div className="mt-1.5 pt-1.5 border-t border-purple-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">Matched with:</span>
                                <span className="font-extrabold text-purple-900 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                                  {pairedAItem.romanNumeral} {pairedAItem.expression}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit Button (When not yet answered) */}
                    {!currentAttempt && (
                      <div className="pt-2">
                        <button
                          id="btn-submit-matching"
                          onClick={handleSubmitMatching}
                          className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Submit Matching Answer</span>
                        </button>
                        <p className="text-[11px] text-slate-500 text-center mt-1.5">
                          Instant evaluation with full explanations
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* IMMEDIATE FEEDBACK NOTIFICATION */}
                {currentAttempt && (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border animate-in fade-in slide-in-from-top-2 duration-200 ${
                      currentAttempt.isAllCorrect
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {currentAttempt.isAllCorrect ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <XCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="grow space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-black text-base tracking-tight ${
                              currentAttempt.isAllCorrect ? 'text-emerald-900' : 'text-rose-900'
                            }`}
                          >
                            {currentAttempt.isAllCorrect ? '✓ Right Answer' : '✗ Wrong Answer'}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-current">
                            {currentAttempt.correctCount} / 4 Matches Correct • {currentAttempt.marks} Marks Earned
                          </span>
                        </div>

                        {/* Detailed Correct Matching Pairs & Explanations */}
                        <div className="bg-white/90 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Authoritative Answer Key &amp; Meanings:
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {currentQuestion.partA.map((aItem) => {
                              const correctLetter = currentQuestion.answerKey[aItem.key];
                              const bObj = currentQuestion.partB.find(
                                (b) => b.letter.toLowerCase() === correctLetter.toLowerCase()
                              );
                              const isCorrect =
                                currentAttempt.userMatches[aItem.key]?.toLowerCase() ===
                                correctLetter.toLowerCase();

                              return (
                                <div
                                  key={aItem.key}
                                  className={`p-2 rounded-lg border flex items-start gap-2 ${
                                    isCorrect
                                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                                  }`}
                                >
                                  <span className="shrink-0 mt-0.5">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    )}
                                  </span>
                                  <div>
                                    <span className="font-black text-slate-900">
                                      {aItem.romanNumeral} {aItem.expression}:
                                    </span>{' '}
                                    <span className="font-semibold text-slate-700">
                                      Option ({correctLetter}) — {bObj?.meaning}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Navigation Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs font-bold text-slate-500 hidden sm:block">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </div>

                  <button
                    id="q34-btn-next"
                    onClick={handleNextQuestion}
                    className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>
                      {currentQuestionIndex === currentQuestions.length - 1
                        ? 'Finish & View Result'
                        : 'Next Question'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Jump to Question Pills */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 mb-2">
                    Jump to Question:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {currentQuestions.map((q, idx) => {
                      const att = attempts[q.id];
                      const isCurrent = idx === currentQuestionIndex;
                      let pillClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                      if (att) {
                        pillClass = att.isAllCorrect
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
                            setShowFinalScore(false);
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
