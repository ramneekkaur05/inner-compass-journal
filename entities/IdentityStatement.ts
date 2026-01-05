export interface IdentityStatement {
  id: string;
  user_id: string;
  section: 'who_i_am_becoming' | 'core_values' | 'empowering_beliefs' | 'identity_habits';
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
