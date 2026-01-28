-- Intelligent Journal - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  nickname TEXT,
  vision_statement TEXT,
  current_identity_focus TEXT,
  mood_baseline TEXT DEFAULT 'Neutral',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  mood TEXT,
  mood_color TEXT,
  daily_recap TEXT,
  gratitude TEXT,
  goals_desires TEXT,
  learnings TEXT,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Row Level Security for journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VISION BOARD ITEMS TABLE
-- ============================================
CREATE TABLE vision_board_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  affirmation TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for vision_board_items
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vision board items"
  ON vision_board_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vision board items"
  ON vision_board_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision board items"
  ON vision_board_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision board items"
  ON vision_board_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- IDENTITY STATEMENTS TABLE
-- ============================================
CREATE TABLE identity_statements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for identity_statements
ALTER TABLE identity_statements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identity statements"
  ON identity_statements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own identity statements"
  ON identity_statements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identity statements"
  ON identity_statements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own identity statements"
  ON identity_statements FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUTURE LETTERS TABLE
-- ============================================
CREATE TABLE future_letters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  unlock_date DATE NOT NULL,
  is_locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for future_letters
ALTER TABLE future_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own future letters"
  ON future_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own future letters"
  ON future_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own future letters"
  ON future_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own future letters"
  ON future_letters FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GUIDED REFLECTIONS TABLE
-- ============================================
CREATE TABLE guided_reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT NOT NULL,
  prompt TEXT NOT NULL,
  reflection TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for guided_reflections
ALTER TABLE guided_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guided reflections"
  ON guided_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guided reflections"
  ON guided_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guided reflections"
  ON guided_reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guided reflections"
  ON guided_reflections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- THOUGHTS TABLE
-- ============================================
CREATE TABLE thoughts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for thoughts
CREATE INDEX idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX idx_thoughts_created_at ON thoughts(created_at DESC);

-- Row Level Security for thoughts
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- STORAGE BUCKET FOR VISION BOARD IMAGES
-- ============================================
-- Run this in the Supabase dashboard Storage section:
-- 1. Create a bucket called "vision-board"
-- 2. Make it public
-- 3. Add the following policy:

-- Storage Policy for vision-board bucket:
-- Allow authenticated users to upload their own images
-- Path pattern: {user_id}/*
