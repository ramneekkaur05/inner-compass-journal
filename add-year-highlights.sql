-- Add Year Highlights feature support for existing deployments

CREATE TABLE IF NOT EXISTS year_highlights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  impact_score INTEGER NOT NULL DEFAULT 3 CHECK (impact_score >= 1 AND impact_score <= 5),
  icon TEXT NOT NULL DEFAULT '✨',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_year_highlights_user_year
  ON year_highlights(user_id, year);

CREATE INDEX IF NOT EXISTS idx_year_highlights_event_date
  ON year_highlights(event_date);

ALTER TABLE year_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own year highlights" ON year_highlights;
CREATE POLICY "Users can view own year highlights"
  ON year_highlights FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own year highlights" ON year_highlights;
CREATE POLICY "Users can insert own year highlights"
  ON year_highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own year highlights" ON year_highlights;
CREATE POLICY "Users can update own year highlights"
  ON year_highlights FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own year highlights" ON year_highlights;
CREATE POLICY "Users can delete own year highlights"
  ON year_highlights FOR DELETE
  USING (auth.uid() = user_id);
