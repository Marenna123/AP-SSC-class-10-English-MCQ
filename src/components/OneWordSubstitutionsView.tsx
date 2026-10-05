import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, Check, HelpCircle, ChevronLeft } from 'lucide-react';
import { ONE_WORD_SUBSTITUTIONS } from '../data/oneWordSubstitutionsData';

interface OneWordSubstitutionsViewProps {
  onBackToVocabulary?: () => void;
}

export const OneWordSubstitutionsView: React.FC<OneWordSubstitutionsViewProps> = ({
  onBackToVocabulary,
}) => {
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ONE_WORD_SUBSTITUTIONS;
    return ONE_WORD_SUBSTITUTIONS.filter(
      (item) =>
        item.phrase.toLowerCase().includes(q) ||
        item.word.toLowerCase().includes(q) ||
        item.lesson.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          {onBackToVocabulary && (
            <button
              onClick={onBackToVocabulary}
              className="text-xs font-bold text-indigo-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Lessons
            </button>
          )}
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-md">
            Vocabulary Reference
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
          One Word Substitutions
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-lg leading-relaxed">
          High-frequency One Word Substitutions drawn directly from AP SSC Class 10 Prose and Textbook vocabulary.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search one word substitutions or definitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const isRevealed = !!revealedIds[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    {item.lesson}
                  </span>
                  <span>#{item.id}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug mb-3">
                  "{item.phrase}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      One Word:
                    </span>
                    {isRevealed ? (
                      <span className="text-sm font-black text-indigo-700">
                        {item.word}
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                        ••••••••••
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleReveal(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-2xs ${
                      isRevealed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isRevealed ? 'Hide' : 'Reveal Word'}
                  </button>
                </div>
                {isRevealed && (
                  <p className="text-xs text-slate-600 italic mt-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                    <span className="font-bold text-indigo-900 not-italic">Example: </span>
                    {item.example}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
