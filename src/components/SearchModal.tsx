import React, { useState } from 'react';
import { X, Search, Bookmark, ChevronRight, BookOpen, Feather } from 'lucide-react';
import { Question } from '../types';
import { DICTIONARY_ENTRIES } from '../data/dictionarySkillsData';
import { ALL_PREPARATION_EXPRESSIONS, Q33_PRACTICE_QUESTIONS } from '../data/q33PhrasalVerbsData';
import { Q34_ALL_PREPARATION_ITEMS } from '../data/q34MatchingData';
import { CREATIVE_EXPRESSIONS_HIERARCHY } from '../data/creativeExpressionsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSelectQuestion,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? questions.filter(
        (q) =>
          q.question_text.toLowerCase().includes(query.toLowerCase()) ||
          q.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          (q.story && q.story.toLowerCase().includes(query.toLowerCase())) ||
          q.explanation.toLowerCase().includes(query.toLowerCase()) ||
          (q.paragraph && q.paragraph.toLowerCase().includes(query.toLowerCase())) ||
          (q.underlined_word && q.underlined_word.toLowerCase().includes(query.toLowerCase())) ||
          (q.word_box && q.word_box.some(w => w.toLowerCase().includes(query.toLowerCase()))) ||
          q.option_a.toLowerCase().includes(query.toLowerCase()) ||
          q.option_b.toLowerCase().includes(query.toLowerCase()) ||
          q.option_c.toLowerCase().includes(query.toLowerCase()) ||
          q.option_d.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const dictMatches = query.trim()
    ? DICTIONARY_ENTRIES.filter(
        (e) =>
          e.word.toLowerCase().includes(query.toLowerCase()) ||
          e.lesson.toLowerCase().includes(query.toLowerCase()) ||
          e.partOfSpeech.toLowerCase().includes(query.toLowerCase()) ||
          e.meanings.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const q33ExprMatches = query.trim()
    ? ALL_PREPARATION_EXPRESSIONS.filter(
        (e) =>
          e.expression.toLowerCase().includes(query.toLowerCase()) ||
          e.meaning.toLowerCase().includes(query.toLowerCase()) ||
          e.example.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const q33PracticeMatches = query.trim()
    ? Q33_PRACTICE_QUESTIONS.filter(
        (q) =>
          q.question.toLowerCase().includes(query.toLowerCase()) ||
          q.targetExpression.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const q34Matches = query.trim()
    ? Q34_ALL_PREPARATION_ITEMS.filter(
        (item) =>
          item.expression.toLowerCase().includes(query.toLowerCase()) ||
          item.meaning.toLowerCase().includes(query.toLowerCase()) ||
          item.example.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const creativeMatches = query.trim()
    ? CREATIVE_EXPRESSIONS_HIERARCHY.flatMap((node) =>
        node.branches.filter(
          (b) =>
            b.fullTitle.toLowerCase().includes(query.toLowerCase()) ||
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.description.toLowerCase().includes(query.toLowerCase()) ||
            node.title.toLowerCase().includes(query.toLowerCase()) ||
            query.toLowerCase().includes('creative') ||
            query.toLowerCase().includes('discourse') ||
            (query.includes('35') && node.questionNumber === 'Q35') ||
            (query.includes('36') && node.questionNumber === 'Q36') ||
            (query.includes('37') && node.questionNumber === 'Q37')
        )
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden mt-6 sm:mt-12 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, topics, vocabulary words..."
            className="grow text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2.5">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Type keywords to search across all questions and Q.32 dictionary skills.
            </div>
          ) : filtered.length === 0 && dictMatches.length === 0 && q33ExprMatches.length === 0 && q33PracticeMatches.length === 0 && q34Matches.length === 0 && creativeMatches.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching questions or expressions found for "{query}".
            </div>
          ) : (
            <>
              {creativeMatches.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 px-1 flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5" />
                    <span>Creative Expressions Discourses ({creativeMatches.length})</span>
                  </div>
                  {creativeMatches.map((branch) => (
                    <div
                      key={`creative-${branch.id}`}
                      className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-left"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-extrabold text-sm sm:text-base text-slate-950 font-['Outfit',sans-serif]">
                          {branch.fullTitle}
                        </span>
                        <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                          {branch.questionNumber} • {branch.marks} Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {branch.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {q33ExprMatches.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 px-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Q.33 Expressions ({q33ExprMatches.length})</span>
                  </div>
                  {q33ExprMatches.map((item) => (
                    <div
                      key={`q33-expr-${item.category}-${item.no}`}
                      className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-left"
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-extrabold text-sm sm:text-base text-slate-950 font-serif">
                          “{item.expression}”
                        </span>
                        <span className="text-[10px] font-bold bg-amber-200 text-slate-900 px-1.5 py-0.2 rounded">
                          {item.category === 'phrasal_verb' ? 'Phrasal Verb' : 'Idiom'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>Meaning:</strong> {item.meaning}
                      </p>
                      <p className="text-xs text-slate-600 italic mt-0.5">
                        "{item.example}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {q33PracticeMatches.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 px-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Q.33 Practice Questions ({q33PracticeMatches.length})</span>
                  </div>
                  {q33PracticeMatches.map((q) => (
                    <div
                      key={`q33-practice-${q.id}`}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded uppercase">
                          Question #{q.questionNumber} • {q.difficulty}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Answer: {q.targetExpression}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {q34Matches.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 px-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Q.34 Matching Items (Unit 3 &amp; Unit 4) ({q34Matches.length})</span>
                  </div>
                  {q34Matches.map((item) => (
                    <div
                      key={`q34-prep-${item.id}`}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.expression}
                        </span>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded capitalize">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-1">
                        <strong className="text-slate-700">Meaning:</strong> {item.meaning}
                      </p>
                      <p className="text-xs text-slate-500 italic">
                        "{item.example}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {dictMatches.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 px-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Q.32 Dictionary Skills Entries ({dictMatches.length})</span>
                  </div>
                  {dictMatches.map((entry) => (
                    <div
                      key={`dict-${entry.id}`}
                      className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-left"
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-slate-950 font-serif">
                            {entry.word}
                          </span>
                          <span className="text-xs font-mono text-indigo-700 font-bold">
                            {entry.pronunciation}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium capitalize">
                            ({entry.partOfSpeech})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-200 text-slate-900 px-1.5 py-0.2 rounded">
                          {entry.lesson}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2">
                        {entry.meanings.join(' • ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {filtered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(q);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all flex items-start justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 mb-1 flex-wrap">
                      <span className="uppercase">{q.category}</span> • {q.subcategory}
                      {q.story && (
                        <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                          {q.lesson_id === 'glimpses-of-india' ? '🇮🇳 ' : '✈️ '}{q.story}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-900 leading-snug">
                      {q.question_text}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-1" />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
