export type VisionBoardCategory = 
  | 'Career' 
  | 'Health' 
  | 'Relationships' 
  | 'Mindset' 
  | 'Lifestyle' 
  | 'Finances' 
  | 'Creativity' 
  | 'Spirituality';

export interface VisionBoardItem {
  id: string;
  user_id: string;
  category: VisionBoardCategory;
  image_url: string | null;
  affirmation: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
