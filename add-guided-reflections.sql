-- Add Guided Reflections feature support for existing deployments

CREATE TABLE IF NOT EXISTS guided_reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT NOT NULL,
  prompt TEXT NOT NULL,
  reflection TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE guided_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own guided reflections" ON guided_reflections;
CREATE POLICY "Users can view own guided reflections"
  ON guided_reflections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own guided reflections" ON guided_reflections;
CREATE POLICY "Users can insert own guided reflections"
  ON guided_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own guided reflections" ON guided_reflections;
CREATE POLICY "Users can update own guided reflections"
  ON guided_reflections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own guided reflections" ON guided_reflections;
CREATE POLICY "Users can delete own guided reflections"
  ON guided_reflections FOR DELETE
  USING (auth.uid() = user_id);