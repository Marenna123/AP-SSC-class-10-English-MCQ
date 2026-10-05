import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Bookmark, Sparkles, HelpCircle, ArrowRight, Languages, Loader2 } from 'lucide-react';
import { CorrectOption, Difficulty, Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSubmitAnswer: (selectedOption: CorrectOption, isCorrect: boolean) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  isBookmarked,
  onToggleBookmark,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState<CorrectOption | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAiExplainer, setShowAiExplainer] = useState(false);
  const [inTelugu, setInTelugu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Reset local state when moving to a new question
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowAiExplainer(false);
    setAiResponse(null);
  }, [question.id]);

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === question.correct_option;
    onSubmitAnswer(selectedOption, isCorrect);
  };

  const handleAskAI = async (teluguRequested: boolean) => {
    setInTelugu(teluguRequested);
    setShowAiExplainer(true);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: question.question_text,
          options: {
            A: question.option_a,
            B: question.option_b,
            C: question.option_c,
            D: question.option_d,
          },
          correct_option: question.correct_option,
          explanation: question.explanation,
          category: question.category,
          subcategory: question.subcategory,
          inTelugu: teluguRequested,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setAiResponse(data.explanation || question.explanation);
    } catch (err) {
      console.warn('AI endpoint fetch failed, falling back to local curriculum explanation', err);
      setAiResponse(
        teluguRequested
          ? `📚 **ఉపాధ్యాయుల వివరణ:**\n${question.explanation}\n\nసరైన సమాధానం **Option ${question.correct_option}**.`
          : `📚 **Teacher's Guide:**\n${question.explanation}\n\nThe correct answer is **Option ${question.correct_option}**.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const difficultyColors: Record<Difficulty, { bg: string; text: string; dot: string; label: string }> = {
    simple: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Simple' },
    medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Medium' },
    difficult: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Difficult' },
  };

  const diff = difficultyColors[question.difficulty] || difficultyColors.medium;
  const isCorrect = isSubmitted && selectedOption === question.correct_option;

  const renderParagraphWithUnderline = (paragraph: string, targetWord?: string) => {
    if (!targetWord) return paragraph;
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = paragraph.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === targetWord.toLowerCase() ? (
        <span key={i} className="underline decoration-indigo-600 decoration-2 font-bold text-indigo-950 bg-indigo-50/90 px-1 py-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const options: { key: CorrectOption; text: string }[] = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
            Question {currentIndex} of {totalQuestions}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${diff.bg} ${diff.text}`}>
            <span className={`w-2 h-2 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          id={`bookmark-btn-${question.id}`}
          onClick={onToggleBookmark}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
            isBookmarked
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          aria-label={isBookmarked ? 'Bookmarked' : 'Bookmark question'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
          {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
        </button>
      </div>

      {/* Subcategory / Lesson Tag & Story Identifier */}
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
          {question.category} • {question.subcategory}
        </span>
        {question.story && (
          <span className="text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
            <span>{question.lesson_id === 'glimpses-of-india' ? '🇮🇳' : '✈️'}</span>
            <span>{question.story}</span>
          </span>
        )}
      </div>

      {/* Context Paragraph if present (e.g. Q27 Vocabulary Synonyms) */}
      {question.paragraph && (
        <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm sm:text-base leading-relaxed">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
            <span>Context Passage</span>
            {question.underlined_word && (
              <span className="text-indigo-600 font-semibold lowercase">
                target: “{question.underlined_word}”
              </span>
            )}
          </div>
          <p className="leading-relaxed">
            {renderParagraphWithUnderline(question.paragraph, question.underlined_word)}
          </p>
        </div>
      )}

      {/* Word Box / Synonym Box if present (e.g. Q27 Vocabulary Synonyms) */}
      {question.word_box && question.word_box.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>📖</span>
              <span>
                Word Box ({question.subcategory?.toLowerCase().includes('antonym') || question.lesson_id === 'antonyms'
                  ? 'Antonyms'
                  : question.subcategory?.toLowerCase().includes('synonym') || question.lesson_id === 'synonyms'
                  ? 'Synonyms'
                  : 'Word Box'})
              </span>
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
              {question.word_box.length} words
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.word_box.map((word, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs sm:text-sm font-semibold text-amber-950 shadow-2xs"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question Text */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3">
        {question.question_text}
      </h2>

      {/* Target Word if present (e.g. Q31 Spelling Corrections) */}
      {question.target_word && (
        <div className="mb-5 p-3.5 bg-indigo-50/70 border border-indigo-200/90 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Word:</span>
            <span className="font-extrabold text-base sm:text-lg text-indigo-900 tracking-wide">
              {question.target_word}
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-md">
            Spelling Check
          </span>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {options.map(({ key, text }) => {
          const isSelected = selectedOption === key;
          let optionStyles = 'border-slate-200 hover:border-indigo-300 bg-slate-50/60 text-slate-800';

          if (isSubmitted) {
            if (key === question.correct_option) {
              // Highlight correct answer in green after submission
              optionStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500';
            } else if (isSelected && !isCorrect) {
              // Highlight wrong user pick in red
              optionStyles = 'border-rose-400 bg-rose-50 text-rose-950 line-through opacity-85';
            } else {
              optionStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
            }
          } else if (isSelected) {
            optionStyles = 'border-indigo-600 bg-indigo-50/90 text-indigo-950 font-semibold ring-2 ring-indigo-500/20';
          }

          return (
            <button
              key={key}
              id={`option-${key}-${question.id}`}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(key)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[52px] ${optionStyles} ${
                !isSubmitted ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                  isSubmitted && key === question.correct_option
                    ? 'bg-emerald-600 text-white'
                    : isSubmitted && isSelected && !isCorrect
                    ? 'bg-rose-600 text-white'
                    : isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {key}
              </div>
              <span className="text-sm sm:text-base leading-relaxed grow pt-0.5">
                {text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submit or Result Section */}
      {!isSubmitted ? (
        <button
          id="submit-answer-btn"
          disabled={!selectedOption}
          onClick={handleSubmit}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] ${
            selectedOption
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Submit Answer
        </button>
      ) : (
        <div className="space-y-4 pt-2">
          {/* Result Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="grow">
              <div className="font-extrabold text-sm sm:text-base mb-1">
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-xs sm:text-sm font-semibold mb-1 text-slate-800">
                  Correct Option:{' '}
                  <span className="font-extrabold underline decoration-emerald-500 text-emerald-800">
                    {question.correct_option}){' '}
                    {question[`option_${question.correct_option.toLowerCase()}` as keyof Question]}
                  </span>
                </div>
              )}
              {isCorrect && (
                <div className="text-xs sm:text-sm font-semibold mb-1 text-emerald-800">
                  Option {question.correct_option}:{' '}
                  <span className="font-bold">
                    {question[`option_${question.correct_option.toLowerCase()}` as keyof Question]}
                  </span>
                </div>
              )}
              <div className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                <span className="font-bold text-slate-900">Explanation: </span>
                {question.explanation}
              </div>
            </div>
          </div>

          {/* Ask AI Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Ask AI Learning Assistant
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="ai-explain-en-btn"
                  onClick={() => handleAskAI(false)}
                  disabled={aiLoading}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  Why is this correct?
                </button>
                <button
                  id="ai-explain-te-btn"
                  onClick={() => handleAskAI(true)}
                  disabled={aiLoading}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 transition-colors flex items-center gap-1"
                >
                  <Languages className="w-3 h-3" />
                  Explain in Telugu (తెలుగు)
                </button>
              </div>
            </div>

            {showAiExplainer && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {aiLoading ? (
                  <div className="flex items-center justify-center py-4 gap-2 text-indigo-600 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Class 10 explanation...</span>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 whitespace-pre-line">
                    {aiResponse}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Question / Finish Button */}
          <button
            id="next-question-btn"
            onClick={onNextQuestion}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <span>{isLastQuestion ? 'Finish Test & See Result' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
