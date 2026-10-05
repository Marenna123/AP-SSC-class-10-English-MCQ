export type Difficulty = 'simple' | 'medium' | 'difficult';

export type Category = 'prose' | 'poem' | 'grammar' | 'vocabulary';

export type CorrectOption = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: CorrectOption;
  explanation: string;
  category: Category;
  subcategory: string; // e.g., lesson name or grammar topic
  lesson_id: string;   // normalized key (e.g., 'letter-to-god', 'passive-voice')
  difficulty: Difficulty;
  question_number?: number;
  story?: string;
  paragraph?: string;
  underlined_word?: string;
  word_box?: string[];
  target_word?: string;
  created_at?: string;
}

export interface LessonItem {
  id: string;
  title: string;
  author?: string;
  category: 'prose' | 'poem';
  unit: number;
  description: string;
  simpleTarget: number;
  mediumTarget: number;
  difficultTarget: number;
  totalTarget: number;
}

export interface TopicItem {
  id: string;
  title: string;
  category: 'grammar' | 'vocabulary';
  description: string;
  questionNumber?: string;
  simpleTarget?: number;
  mediumTarget?: number;
  difficultTarget?: number;
  totalTarget?: number;
}

export interface Attempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_option: CorrectOption;
  is_correct: boolean;
  attempted_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_type: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  percentage: number;
  completed_at: string;
  time_taken_seconds?: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string; // e.g., 'AP SSC Class 10 (2026-27)'
  school?: string;
  last_lesson_attempted?: string;
  updated_at: string;
}

export type ActiveNavTab = 'home' | 'learn' | 'practice' | 'progress' | 'profile';

export type LearnSection =
  | 'prose'
  | 'poem'
  | 'grammar'
  | 'vocabulary'
  | 'creative-expressions';

export interface TestConfig {
  title: string;
  type: string;
  questionCount: number;
  categoryFilter?: Category;
  subcategoryFilter?: string;
  difficultyFilter?: Difficulty | 'mixed';
}
