export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  nickname: string | null;
  vision_statement: string | null;
  current_identity_focus: string | null;
  mood_baseline: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}
