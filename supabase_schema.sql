-- =========================================================================
-- AP SSC Class 10 English (2026–27) - Supabase PostgreSQL Schema & Security
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  student_name TEXT NOT NULL,
  grade TEXT DEFAULT 'AP SSC Class 10 (2026-27)',
  school TEXT,
  last_lesson_attempted TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Lessons Table (Prose)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  unit INTEGER NOT NULL,
  description TEXT,
  simple_target INTEGER DEFAULT 20,
  medium_target INTEGER DEFAULT 20,
  difficult_target INTEGER DEFAULT 10,
  total_target INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Poems Table
CREATE TABLE IF NOT EXISTS poems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  unit INTEGER NOT NULL,
  description TEXT,
  simple_target INTEGER DEFAULT 10,
  medium_target INTEGER DEFAULT 10,
  difficult_target INTEGER DEFAULT 5,
  total_target INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Grammar Topics Table
CREATE TABLE IF NOT EXISTS grammar_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Vocabulary Topics Table
CREATE TABLE IF NOT EXISTS vocabulary_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option VARCHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  category TEXT CHECK (category IN ('prose', 'poem', 'grammar', 'vocabulary')),
  subcategory TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('simple', 'medium', 'difficult')),
  question_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Attempts Table
CREATE TABLE IF NOT EXISTS attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  selected_option VARCHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, question_id)
);

-- 9. Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_type TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================================
-- Row Level Security (RLS) Policies
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Public read access for syllabus & questions
CREATE POLICY "Public can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public can view poems" ON poems FOR SELECT USING (true);
CREATE POLICY "Public can view grammar topics" ON grammar_topics FOR SELECT USING (true);
CREATE POLICY "Public can view vocabulary topics" ON vocabulary_topics FOR SELECT USING (true);
CREATE POLICY "Public can view questions" ON questions FOR SELECT USING (true);

-- User-scoped policies for profile, attempts, bookmarks, and test_results
CREATE POLICY "Users can view and update own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view and manage own attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and manage own test results" ON test_results
  FOR ALL USING (auth.uid() = user_id);

-- Optional trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, student_name, grade)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Student'), 'AP SSC Class 10 (2026-27)');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
