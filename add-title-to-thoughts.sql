-- Add title column to thoughts table
ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Untitled Thought';

-- Update existing thoughts that don't have a title
UPDATE thoughts SET title = 'Untitled Thought' WHERE title IS NULL OR title = '';
