export type ReflectionTheme = 
  | 'Release' 
  | 'Forgiveness' 
  | 'Deep Gratitude' 
  | 'Dreams' 
  | 'Facing Fears' 
  | 'Growth';

export interface GuidedReflection {
  id: string;
  user_id: string;
  theme: ReflectionTheme;
  prompt: string;
  reflection: string;
  created_at: string;
  updated_at: string;
}
