export type HighlightCategory =
  | 'Career'
  | 'Relationships'
  | 'Health'
  | 'Travel'
  | 'Learning'
  | 'Finance'
  | 'Personal Growth'
  | 'Milestone'
  | 'Other';

export interface YearHighlight {
  id: string;
  user_id: string;
  year: number;
  title: string;
  description: string;
  event_date: string;
  category: HighlightCategory;
  impact_score: number;
  icon: string;
  created_at: string;
  updated_at: string;
}
