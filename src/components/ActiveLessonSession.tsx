import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Award, ArrowRight, BookOpen } from 'lucide-react';
import { Category, CorrectOption, Difficulty, Question } from '../types';
import { QuestionCard } from './QuestionCard';

interface ActiveLessonSessionProps {
  title: string;
  category: Category;
  questions: Question[];
  isBookmarked: (qId: string) => boolean;
  onToggleBookmark: (qId: string) => void;
  onRecordAttempt: (qId: string, option: CorrectOption, isCorrect: boolean) => void;
  onBack: () => void;
}

export const ActiveLessonSession: React.FC<ActiveLessonSessionProps> = ({
  title,
  category,
  questions,
  isBookmarked,
  onToggleBookmark,
  onRecordAttempt,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, { option: CorrectOption; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Questions Available</h3>
        <p className="text-xs text-slate-500">
          There are currently no questions loaded for "{title}". You can add questions via the Admin panel.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = (selectedOption: CorrectOption, isCorrect: boolean) => {
    setSessionAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { option: selectedOption, isCorrect },
    }));
    onRecordAttempt(currentQ.id, selectedOption, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Score computation
  let correctCount = 0;
  for (const q of questions) {
    if (sessionAnswers[q.id]?.isCorrect) correctCount++;
  }
  const percentage = Math.round((correctCount / questions.length) * 100);

  if (isFinished) {
    const wrongQuestions = questions.filter((q) => sessionAnswers[q.id] && !sessionAnswers[q.id].isCorrect);

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
            Lesson Practice Complete
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-bold block mb-1">SCORE</span>
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {correctCount} / {questions.length}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-bold block mb-1">ACCURACY</span>
            <span
              className={`text-2xl font-black font-['Outfit',sans-serif] ${
                percentage >= 75 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {percentage}%
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs sm:text-sm text-indigo-900 font-medium">
          {percentage >= 80 ? (
            <span>🌟 Excellent grasp of this topic! Keep reviewing to maintain high accuracy.</span>
          ) : (
            <span>👍 Good effort! Practice incorrect questions to master this unit.</span>
          )}
        </div>

        <div className="space-y-2.5 pt-2">
          {wrongQuestions.length > 0 && (
            <button
              onClick={() => {
                // Restart with wrong questions
                setCurrentIndex(0);
                setSessionAnswers({});
                setIsFinished(false);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry {wrongQuestions.length} Incorrect Questions</span>
            </button>
          )}

          <button
            onClick={() => {
              setCurrentIndex(0);
              setSessionAnswers({});
              setIsFinished(false);
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Whole Set Again</span>
          </button>

          <button
            onClick={onBack}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 max-w-xl mx-auto">
      {/* Session Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="text-center truncate">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
            {category}
          </span>
          <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
            {title}
          </h3>
        </div>

        <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress line */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQ}
        currentIndex={currentIndex + 1}
        totalQuestions={questions.length}
        isBookmarked={isBookmarked(currentQ.id)}
        onToggleBookmark={() => onToggleBookmark(currentQ.id)}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNext}
        isLastQuestion={currentIndex === questions.length - 1}
      />
    </div>
  );
};
