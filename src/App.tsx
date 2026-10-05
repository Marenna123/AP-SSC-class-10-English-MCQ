import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { PracticeTestView } from './components/PracticeTestView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { AdminModal } from './components/AdminModal';
import { SearchModal } from './components/SearchModal';
import { ActiveLessonSession } from './components/ActiveLessonSession';
import {
  ActiveNavTab,
  Category,
  CorrectOption,
  Difficulty,
  LearnSection,
  Question,
  StudentProfile,
  TestResult,
} from './types';
import {
  loadQuestionBank,
  addQuestionToBank,
  deleteQuestionFromBank,
  bulkImportQuestions,
  getStudentProfile,
  saveStudentProfile,
  getOverallStats,
  recordQuestionAttempt,
  toggleBookmark,
  isQuestionBookmarked,
  getBookmarkedQuestions,
  getAttemptStatusMap,
  saveTestResult,
  getTestResults,
  resetAllProgress,
} from './lib/storage';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');
  const [learnSection, setLearnSection] = useState<LearnSection>('prose');

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Active Lesson Session State
  const [activeSession, setActiveSession] = useState<{
    isOpen: boolean;
    title: string;
    category: Category;
    questions: Question[];
  }>({
    isOpen: false,
    title: '',
    category: 'prose',
    questions: [],
  });

  // Persistent Data State
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestionBank());
  const [profile, setProfile] = useState<StudentProfile>(() => getStudentProfile());
  const [stats, setStats] = useState(() => getOverallStats());
  const [statusMap, setStatusMap] = useState(() => getAttemptStatusMap());
  const [testResults, setTestResults] = useState<TestResult[]>(() => getTestResults());
  const [bookmarkedList, setBookmarkedList] = useState<Question[]>(() => getBookmarkedQuestions());

  // Refresh stats whenever storage updates
  const refreshStorageData = () => {
    setQuestions(loadQuestionBank());
    setStats(getOverallStats());
    setStatusMap(getAttemptStatusMap());
    setTestResults(getTestResults());
    setBookmarkedList(getBookmarkedQuestions());
    setProfile(getStudentProfile());
  };

  // Sync state on load and on storage update
  useEffect(() => {
    refreshStorageData();
    const handleStorageUpdate = () => refreshStorageData();
    window.addEventListener('ap_ssc_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('ap_ssc_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Handle Question Attempt
  const handleRecordAttempt = (questionId: string, selectedOption: CorrectOption, isCorrect: boolean) => {
    recordQuestionAttempt(questionId, selectedOption, isCorrect);
    refreshStorageData();
  };

  // Handle Bookmark Toggle
  const handleToggleBookmark = (questionId: string) => {
    toggleBookmark(questionId);
    refreshStorageData();
  };

  // Handle Save Test Result
  const handleSaveTestResult = (result: Omit<TestResult, 'id' | 'user_id' | 'completed_at'>) => {
    saveTestResult(result);
    refreshStorageData();
  };

  // Launch Active Lesson Session
  const handleStartLessonPractice = (
    lessonId: string,
    title: string,
    category: Category,
    difficultyFilter?: Difficulty | 'mixed'
  ) => {
    // Save last lesson attempted in profile
    const updatedProf = saveStudentProfile({ last_lesson_attempted: title });
    setProfile(updatedProf);

    let filtered = questions.filter((q) => {
      if (q.category !== category) return false;
      if (q.lesson_id) {
        if (q.lesson_id === lessonId) return true;
        if (lessonId === 'nelson-mandela' && (q.lesson_id === 'nelson-mandela' || q.lesson_id === 'nelson-mandela-long-walk-to-freedom')) return true;
        if (lessonId === 'two-stories-about-flying' && (q.lesson_id === 'two-stories-about-flying' || q.lesson_id.includes('flying'))) return true;
        if (lessonId === 'from-the-diary-of-anne-frank' && (q.lesson_id === 'from-the-diary-of-anne-frank' || q.lesson_id.includes('anne-frank'))) return true;
        if (lessonId === 'glimpses-of-india' && (q.lesson_id === 'glimpses-of-india' || q.lesson_id.includes('glimpses'))) return true;
        if (lessonId === 'amanda' && (q.lesson_id === 'amanda' || q.lesson_id.includes('amanda') || q.subcategory.toLowerCase().includes('amanda'))) return true;
        if (lessonId === 'madam-rides-the-bus' && (q.lesson_id === 'madam-rides-the-bus' || q.lesson_id.includes('madam') || q.subcategory.toLowerCase().includes('madam'))) return true;
        if (lessonId === 'the-sermon-at-benares' && (q.lesson_id === 'the-sermon-at-benares' || q.lesson_id.includes('benares') || q.subcategory.toLowerCase().includes('benares'))) return true;
        if (lessonId === 'relative-clauses' && (q.lesson_id === 'relative-clauses' || q.subcategory.toLowerCase().includes('relative clause'))) return true;
        if (lessonId === 'passive-voice' && (q.lesson_id === 'passive-voice' || q.subcategory.toLowerCase().includes('passive'))) return true;
        if (lessonId === 'reported-speech' && (q.lesson_id === 'reported-speech' || q.subcategory.toLowerCase().includes('reported speech'))) return true;
        if (lessonId === 'prepositions' && (q.lesson_id === 'prepositions' || q.subcategory.toLowerCase().includes('preposition'))) return true;
        if (lessonId === 'editing-a-passage' && (q.lesson_id === 'editing-a-passage' || q.subcategory.toLowerCase().includes('editing'))) return true;
        if (lessonId === 'articles' && (q.lesson_id === 'articles' || q.subcategory.toLowerCase().includes('article'))) return true;
        if (lessonId === 'used-to-would' && (q.lesson_id === 'used-to-would' || q.subcategory.toLowerCase().includes('used to') || q.subcategory.toLowerCase().includes('would'))) return true;
        if (lessonId === 'noun-modifier' && (q.lesson_id === 'noun-modifier' || q.subcategory.toLowerCase().includes('noun modifier'))) return true;
        if (lessonId === 'giving-advice' && (q.lesson_id === 'giving-advice' || q.subcategory.toLowerCase().includes('advice'))) return true;
        if (lessonId === 'right-forms-of-verbs' && (q.lesson_id === 'right-forms-of-verbs' || q.subcategory.toLowerCase().includes('right form') || q.subcategory.toLowerCase().includes('forms of verb') || q.subcategory.toLowerCase().includes('verb'))) return true;
        if (lessonId === 'synonyms' && (q.lesson_id === 'synonyms' || q.subcategory.toLowerCase().includes('synonym'))) return true;
        if (lessonId === 'antonyms' && (q.lesson_id === 'antonyms' || q.subcategory.toLowerCase().includes('antonym'))) return true;
        if (lessonId === 'prefixes-suffixes' && (q.lesson_id === 'prefixes-suffixes' || q.subcategory.toLowerCase().includes('prefix') || q.subcategory.toLowerCase().includes('suffix'))) return true;
        if (lessonId === 'spelling-corrections' && (q.lesson_id === 'spelling-corrections' || q.subcategory.toLowerCase().includes('spelling'))) return true;
        return false;
      }
      return q.subcategory.toLowerCase().trim() === lessonId.replace(/-/g, ' ').toLowerCase().trim();
    });

    if (difficultyFilter && difficultyFilter !== 'mixed') {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
    }

    setActiveSession({
      isOpen: true,
      title: `${title}${difficultyFilter && difficultyFilter !== 'mixed' ? ` (${difficultyFilter.toUpperCase()})` : ''}`,
      category,
      questions: filtered,
    });
  };

  // Start Retry Session
  const handleStartRetrySession = (retryQuestions: Question[]) => {
    setActiveSession({
      isOpen: true,
      title: `Retry Practice (${retryQuestions.length} Questions)`,
      category: retryQuestions[0]?.category || 'prose',
      questions: retryQuestions,
    });
  };

  // Handle Search Result Click
  const handleSelectSearchResult = (q: Question) => {
    setActiveSession({
      isOpen: true,
      title: `Question: ${q.subcategory}`,
      category: q.category,
      questions: [q],
    });
  };

  // Admin Actions
  const handleAddQuestion = (newQ: Question) => {
    const updated = addQuestionToBank(newQ);
    setQuestions(updated);
    refreshStorageData();
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = deleteQuestionFromBank(id);
    setQuestions(updated);
    refreshStorageData();
  };

  const handleBulkImport = (newQs: Question[]) => {
    const updated = bulkImportQuestions(newQs);
    setQuestions(updated);
    refreshStorageData();
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all your progress, attempts, and test scores?')) {
      resetAllProgress();
      refreshStorageData();
      alert('Your progress has been reset.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white antialiased">
      {/* App Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => {
          setActiveSession({ isOpen: false, title: '', category: 'prose', questions: [] });
          setActiveTab('progress');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        bookmarkCount={stats.bookmarkedCount}
      />

      {/* Main Content Area */}
      <main className="grow max-w-xl w-full mx-auto px-3.5 sm:px-4 pt-4">
        {activeSession.isOpen ? (
          <ActiveLessonSession
            title={activeSession.title}
            category={activeSession.category}
            questions={activeSession.questions}
            isBookmarked={isQuestionBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onRecordAttempt={handleRecordAttempt}
            onBack={() =>
              setActiveSession({ isOpen: false, title: '', category: 'prose', questions: [] })
            }
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                profile={profile}
                stats={stats}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenLearnSection={(sec) => {
                  setLearnSection(sec);
                  setActiveTab('learn');
                }}
                onStartLesson={(id, title) => handleStartLessonPractice(id, title, 'prose')}
                onStartRetry={() => setActiveTab('progress')}
                onOpenBookmarks={() => setActiveTab('progress')}
                onStartPracticeTest={() => setActiveTab('practice')}
              />
            )}

            {activeTab === 'learn' && (
              <LearnView
                initialSection={learnSection}
                questions={questions}
                statusMap={statusMap}
                onStartLessonPractice={handleStartLessonPractice}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeTestView
                allQuestions={questions}
                onSaveTestResult={handleSaveTestResult}
                isBookmarked={isQuestionBookmarked}
                onToggleBookmark={handleToggleBookmark}
                onRecordAttempt={handleRecordAttempt}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView
                stats={stats}
                allQuestions={questions}
                testResults={testResults}
                bookmarkedQuestions={bookmarkedList}
                onStartRetryQuestions={handleStartRetrySession}
                onPracticeBookmarked={(qs) =>
                  setActiveSession({
                    isOpen: true,
                    title: `Bookmarked Revision (${qs.length})`,
                    category: qs[0]?.category || 'prose',
                    questions: qs,
                  })
                }
                onRemoveBookmark={handleToggleBookmark}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                profile={profile}
                stats={stats}
                onUpdateProfile={(updates) => {
                  const updated = saveStudentProfile(updates);
                  setProfile(updated);
                }}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveSession({ isOpen: false, title: '', category: 'prose', questions: [] });
          setActiveTab(tab);
        }}
        incorrectBadgeCount={stats.incorrectQuestionsCount}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onBulkImport={handleBulkImport}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        onSelectQuestion={handleSelectSearchResult}
      />
    </div>
  );
}
