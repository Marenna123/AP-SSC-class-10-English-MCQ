import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import {
  DICTIONARY_ENTRIES,
  DictionaryEntryItem,
  DictionarySkillQuestion,
  checkDictionaryAnswer,
  getDictionaryQuestionExplanation,
} from '../data/dictionarySkillsData';

const STORAGE_KEY = 'ap_ssc_dictionary_skills_progress_v1';

interface StoredAnswer {
  userAnswer: string;
  isCorrect: boolean;
  submittedAt: string;
}

interface DictionarySkillsProgress {
  answers: Record<string, StoredAnswer>;
}

interface DictionarySkillsViewProps {
  onBackToVocabulary?: () => void;
}

export const DictionarySkillsView: React.FC<DictionarySkillsViewProps> = ({
  onBackToVocabulary,
}) => {
  // Current entry index: 0 to 24
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<string>('all');

  // Input state for questions for current entry
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  // Persisted progress state
  const [progress, setProgress] = useState<DictionarySkillsProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load dictionary skills progress:', e);
    }
    return { answers: {} };
  });

  // Save progress to local storage
  const saveProgress = (newAnswers: Record<string, StoredAnswer>) => {
    const updated = { answers: newAnswers };
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save dictionary skills progress:', e);
    }
  };

  // Distinct lesson list for filtering
  const lessonsList = useMemo(() => {
    const set = new Set<string>();
    DICTIONARY_ENTRIES.forEach((e) => set.add(e.lesson));
    return Array.from(set);
  }, []);

  // Filtered entries based on search and lesson filter
  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return DICTIONARY_ENTRIES.filter((e) => {
      const matchesSearch =
        !q ||
        e.word.toLowerCase().includes(q) ||
        e.lesson.toLowerCase().includes(q) ||
        e.partOfSpeech.toLowerCase().includes(q) ||
        e.meanings.some((m) => m.toLowerCase().includes(q));

      const matchesLesson =
        selectedLessonFilter === 'all' || e.lesson === selectedLessonFilter;

      return matchesSearch && matchesLesson;
    });
  }, [searchQuery, selectedLessonFilter]);

  // Current entry to display
  const currentEntry: DictionaryEntryItem =
    filteredEntries[currentIndex] || DICTIONARY_ENTRIES[0];

  // Keep index in bounds when filter changes
  useEffect(() => {
    if (currentIndex >= filteredEntries.length) {
      setCurrentIndex(0);
    }
  }, [filteredEntries.length, currentIndex]);

  // Sync inputs with stored answer if already answered
  useEffect(() => {
    if (currentEntry) {
      const initialInputs: Record<string, string> = {};
      currentEntry.questions.forEach((q) => {
        const stored = progress.answers[q.id];
        if (stored) {
          initialInputs[q.id] = stored.userAnswer;
        } else {
          initialInputs[q.id] = '';
        }
      });
      setInputAnswers(initialInputs);
    }
  }, [currentEntry?.id, progress.answers]);

  // Total completed questions counter
  const completedQuestionsCount = useMemo(() => {
    return Object.keys(progress.answers).length;
  }, [progress.answers]);

  const correctQuestionsCount = useMemo(() => {
    return Object.values(progress.answers).filter((a) => a.isCorrect).length;
  }, [progress.answers]);

  // Handle checking a question
  const handleCheckAnswer = (q: DictionarySkillQuestion) => {
    const userVal = inputAnswers[q.id] || '';
    if (!userVal.trim()) return;

    const isCorrect = checkDictionaryAnswer(userVal, q.answer);
    const updated = {
      ...progress.answers,
      [q.id]: {
        userAnswer: userVal.trim(),
        isCorrect,
        submittedAt: new Date().toISOString(),
      },
    };
    saveProgress(updated);
  };

  // Quick select an answer suggestion
  const handleSelectSuggestion = (q: DictionarySkillQuestion, suggestionText: string) => {
    setInputAnswers((prev) => ({
      ...prev,
      [q.id]: suggestionText,
    }));
    const isCorrect = checkDictionaryAnswer(suggestionText, q.answer);
    const updated = {
      ...progress.answers,
      [q.id]: {
        userAnswer: suggestionText,
        isCorrect,
        submittedAt: new Date().toISOString(),
      },
    };
    saveProgress(updated);
  };

  // Reset answer to retry
  const handleRetryQuestion = (qId: string) => {
    const nextAnswers = { ...progress.answers };
    delete nextAnswers[qId];
    saveProgress(nextAnswers);
    setInputAnswers((prev) => ({
      ...prev,
      [qId]: '',
    }));
  };

  // Reset all dictionary progress
  const handleResetAll = () => {
    if (confirm('Reset all Dictionary Skills practice progress?')) {
      saveProgress({});
      setInputAnswers({});
    }
  };

  // Generate contextual suggestions for questions to make it friendly on mobile
  const getSuggestionsForQuestion = (entry: DictionaryEntryItem, q: DictionarySkillQuestion) => {
    const qLower = q.question.toLowerCase();
    const suggestions: string[] = [];

    if (qLower.includes('part of speech')) {
      return ['Noun', 'Verb', 'Adjective', 'Adverb'];
    }

    if (qLower.includes('mean') || qLower.includes('refer')) {
      entry.meanings.forEach((m) => {
        // Capitalize first letter and add period for display
        const formatted = m.charAt(0).toUpperCase() + m.slice(1) + (m.endsWith('.') ? '' : '.');
        suggestions.push(formatted);
      });
      return suggestions;
    }

    if (qLower.includes('plural')) {
      if (entry.plural && entry.plural !== '—') {
        const pCap = entry.plural.charAt(0).toUpperCase() + entry.plural.slice(1);
        suggestions.push(pCap);
        suggestions.push(pCap + 's');
      }
      return suggestions;
    }

    if (qLower.includes('singular')) {
      suggestions.push(q.answer);
      suggestions.push(entry.word);
      return Array.from(new Set(suggestions));
    }

    if (qLower.includes('base form')) {
      suggestions.push(q.answer);
      suggestions.push(entry.word);
      return Array.from(new Set(suggestions));
    }

    return suggestions;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {onBackToVocabulary && (
              <button
                onClick={onBackToVocabulary}
                className="text-xs font-bold text-indigo-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Lessons
              </button>
            )}
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
              Q.32 Dictionary Skills
            </span>
          </div>
          <button
            onClick={handleResetAll}
            title="Reset progress"
            className="text-[11px] text-indigo-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
          Dictionary Skills (Q.32)
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-lg leading-relaxed">
          Master AP SSC Dictionary Entries: Learn to identify pronunciation, parts of speech, plural/singular forms, base verbs, and contextual definitions from Class 10 prose vocabulary.
        </p>

        {/* Progress Counters Bar */}
        <div className="mt-4 pt-3.5 border-t border-indigo-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-300 text-sm">
              Entry {currentEntry ? (DICTIONARY_ENTRIES.findIndex((e) => e.id === currentEntry.id) + 1) : 1} of 25
            </span>
            <span className="text-indigo-200">•</span>
            <span className="font-semibold text-white">
              Questions completed: <strong className="text-emerald-300">{completedQuestionsCount}</strong> / 50
            </span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-amber-200">
              {correctQuestionsCount} Correct
            </span>
            <span className="text-indigo-300 text-[11px]">
              ({Math.round((completedQuestionsCount / 50) * 100)}% overall)
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-indigo-950/70 h-2 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.round((completedQuestionsCount / 50) * 100)}%` }}
          />
        </div>
      </div>

      {/* Search and Lesson Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Word Search Bar */}
          <div className="relative grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="dictionary-skills-search"
              type="text"
              placeholder="Search word (crest, oppression, peddler, plantation, curiosity, grief...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lesson Filter Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedLessonFilter}
              onChange={(e) => {
                setSelectedLessonFilter(e.target.value);
                setCurrentIndex(0);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Lessons (25 Entries)</option>
              {lessonsList.map((lesson) => (
                <option key={lesson} value={lesson}>
                  {lesson}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Horizontal Jump Carousel (1 to 25) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-1">
            Jump to:
          </span>
          {DICTIONARY_ENTRIES.map((entry, idx) => {
            const isSelected = currentEntry?.id === entry.id;
            const q1Answered = progress.answers[`${entry.id}a`];
            const q2Answered = progress.answers[`${entry.id}b`];
            const bothAnswered = q1Answered && q2Answered;
            const partiallyAnswered = (q1Answered || q2Answered) && !bothAnswered;

            return (
              <button
                key={entry.id}
                onClick={() => {
                  const targetIdx = filteredEntries.findIndex((e) => e.id === entry.id);
                  if (targetIdx !== -1) {
                    setCurrentIndex(targetIdx);
                  } else {
                    // Reset filters to view this entry
                    setSearchQuery('');
                    setSelectedLessonFilter('all');
                    setCurrentIndex(idx);
                  }
                }}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : bothAnswered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    : partiallyAnswered
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>#{entry.id}</span>
                <span className="font-mono text-[10px] opacity-90">{entry.word}</span>
                {bothAnswered && <Check className="w-2.5 h-2.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-700">No dictionary entries found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or lesson filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLessonFilter('all');
            }}
            className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* The Dictionary Entry & Question Card */
        <div className="space-y-4">
          {/* DICTIONARY ENTRY CARD */}
          <div className="bg-white rounded-3xl border-2 border-indigo-200/80 shadow-sm overflow-hidden">
            {/* Entry Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-5 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Entry {DICTIONARY_ENTRIES.findIndex((e) => e.id === currentEntry.id) + 1} of 25
                </span>
                <span className="text-xs text-indigo-200 font-medium">
                  {currentEntry.lesson}
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-300">
                AP SSC English • 2 Marks
              </span>
            </div>

            {/* Entry Content Body */}
            <div className="p-5 sm:p-6 space-y-4 bg-amber-50/20">
              {/* Word Title & Pronunciation */}
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
                  WORD
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-tight">
                    {currentEntry.word}
                  </h1>
                  <span className="text-base sm:text-lg font-mono text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200/70">
                    {currentEntry.pronunciation}
                  </span>
                </div>
              </div>

              {/* Grammar Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                    Part of Speech
                  </div>
                  <div className="text-sm font-extrabold text-indigo-900 capitalize">
                    {currentEntry.partOfSpeech}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                    Plural Form
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {currentEntry.plural}
                  </div>
                </div>
              </div>

              {/* Meaning Section */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span>Meaning</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({currentEntry.meanings.length} {currentEntry.meanings.length === 1 ? 'definition' : 'definitions'})
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {currentEntry.meanings.map((meaning, mIdx) => (
                    <li key={mIdx} className="pl-1">
                      <span className="text-slate-900">{meaning}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Example Usage */}
              {currentEntry.example && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Example
                  </div>
                  <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed font-serif">
                    "{currentEntry.example}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* QUESTIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Practice Questions (1 Mark Each)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Based on Dictionary Entry above
              </span>
            </div>

            {/* Question 1 & Question 2 */}
            {currentEntry.questions.map((q, qIndex) => {
              const storedAttempt = progress.answers[q.id];
              const isChecked = !!storedAttempt;
              const isCorrect = storedAttempt?.isCorrect ?? false;
              const suggestions = getSuggestionsForQuestion(currentEntry, q);
              const explanationText = getDictionaryQuestionExplanation(currentEntry, q);

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs ${
                    isChecked
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-200'
                        : 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Question {qIndex + 1}
                    </span>
                    {isChecked && (
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-3">
                    {q.question}
                  </h4>

                  {/* Input or Selectable Answer */}
                  {!isChecked ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Answer:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your answer here..."
                            value={inputAnswers[q.id] || ''}
                            onChange={(e) =>
                              setInputAnswers((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCheckAnswer(q);
                              }
                            }}
                            className="grow text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleCheckAnswer(q)}
                            disabled={!inputAnswers[q.id]?.trim()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs shrink-0"
                          >
                            Check Answer
                          </button>
                        </div>
                      </div>

                      {/* Selectable Suggestions / Quick Chips */}
                      {suggestions.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Or select from entry:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestions.map((sug, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => handleSelectSuggestion(q, sug)}
                                className="text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-all text-left"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Checked Answer Display */
                    <div className="space-y-2.5 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="font-semibold text-slate-500">Your Answer: </span>
                          <span
                            className={`font-extrabold ${
                              isCorrect ? 'text-emerald-700' : 'text-rose-700 line-through'
                            }`}
                          >
                            {storedAttempt.userAnswer}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="font-semibold text-slate-500">Correct Answer: </span>
                            <span className="font-extrabold text-emerald-700 underline">
                              {q.answer}
                            </span>
                          </div>
                        )}
                        {isCorrect && (
                          <div>
                            <span className="font-semibold text-slate-500">Authoritative Answer: </span>
                            <span className="font-extrabold text-emerald-700">
                              {q.answer}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Explanation */}
                      <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Explanation: </strong>
                        {explanationText}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleRetryQuestion(q.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Entry
            </button>

            <span className="text-xs font-bold text-slate-500">
              Entry {currentIndex + 1} of {filteredEntries.length}
            </span>

            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(filteredEntries.length - 1, prev + 1))
              }
              disabled={currentIndex === filteredEntries.length - 1}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              Next Entry
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
