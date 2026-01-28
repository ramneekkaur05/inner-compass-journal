-- Create THOUGHTS table only
-- Safe to run even if other tables exist

-- ============================================
-- THOUGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for thoughts
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at DESC);

-- Row Level Security for thoughts
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can insert own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can update own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can delete own thoughts" ON thoughts;

-- Create policies
CREATE POLICY "Users can view own thoughts"
  ON thoughts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own thoughts"
  ON thoughts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own thoughts"
  ON thoughts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own thoughts"
  ON thoughts FOR DELETE
  USING (auth.uid() = user_id);
