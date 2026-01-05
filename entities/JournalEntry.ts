export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: string | null;
  mood_color: string | null;
  daily_recap: string | null;
  gratitude: string | null;
  goals_desires: string | null;
  learnings: string | null;
  checklist_items: ChecklistItem[];
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}
