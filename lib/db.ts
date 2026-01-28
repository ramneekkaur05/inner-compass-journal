import { supabase } from './supabaseClient';
import { appCache } from './cache';
import type { JournalEntry } from '@/entities/JournalEntry';
import type { VisionBoardItem } from '@/entities/VisionBoardItem';
import type { IdentityStatement } from '@/entities/IdentityStatement';
import type { FutureLetter } from '@/entities/FutureLetter';
import type { GuidedReflection } from '@/entities/GuidedReflection';
import type { UserProfile } from '@/entities/UserProfile';

// ============================================
// JOURNAL ENTRIES
// ============================================

export async function getJournalEntry(userId: string, date: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('entry_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching journal entry:', error);
    return null;
  }

  return data;
}

export async function createJournalEntry(userId: string, date: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      entry_date: date,
      checklist_items: [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating journal entry:', error);
    return null;
  }

  // Invalidate cache
  appCache.invalidateByPrefix('journal_entries_');
  return data;
}

export async function updateJournalEntry(
  entryId: string,
  updates: Partial<JournalEntry>
): Promise<boolean> {
  const { error } = await supabase
    .from('journal_entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', entryId);

  if (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }

  // Invalidate cache
  appCache.invalidateByPrefix('journal_entries_');
  return true;
}

export async function getAllJournalEntries(userId: string): Promise<JournalEntry[]> {
  // Check cache first
  const cacheKey = `journal_entries_${userId}`;
  const cached = appCache.get<JournalEntry[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }

  const result = data || [];
  // Cache for 5 minutes
  appCache.set(cacheKey, result, 5 * 60 * 1000);
  return result;
}

// ============================================
// VISION BOARD
// ============================================

export async function getVisionBoardItems(userId: string): Promise<VisionBoardItem[]> {
  // Check cache first
  const cacheKey = `vision_board_${userId}`;
  const cached = appCache.get<VisionBoardItem[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('vision_board_items')
    .select('*')
    .eq('user_id', userId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching vision board items:', error);
    return [];
  }

  const result = data || [];
  // Cache for 5 minutes
  appCache.set(cacheKey, result, 5 * 60 * 1000);
  return result;
}

export async function createVisionBoardItem(
  userId: string,
  item: Omit<VisionBoardItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<VisionBoardItem | null> {
  console.log('Inserting into DB:', {
    user_id: userId,
    ...item,
  });

  const { data, error } = await supabase
    .from('vision_board_items')
    .insert({
      user_id: userId,
      ...item,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating vision board item:', error);
    console.error('Error details:', error.message, error.code);
    return null;
  }

  console.log('Database insert successful:', data);
  return data;
}

export async function updateVisionBoardItem(
  itemId: string,
  updates: Partial<VisionBoardItem>
): Promise<boolean> {
  const { error } = await supabase
    .from('vision_board_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  if (error) {
    console.error('Error updating vision board item:', error);
    return false;
  }

  return true;
}

export async function deleteVisionBoardItem(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('vision_board_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting vision board item:', error);
    return false;
  }

  return true;
}

// ============================================
// IDENTITY STATEMENTS
// ============================================

export async function getIdentityStatements(userId: string): Promise<IdentityStatement[]> {
  // Check cache first
  const cacheKey = `identity_statements_${userId}`;
  const cached = appCache.get<IdentityStatement[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('identity_statements')
    .select('*')
    .eq('user_id', userId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching identity statements:', error);
    return [];
  }

  const result = data || [];
  // Cache for 5 minutes
  appCache.set(cacheKey, result, 5 * 60 * 1000);
  return result;
}

export async function createIdentityStatement(
  userId: string,
  statement: Omit<IdentityStatement, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<IdentityStatement | null> {
  const { data, error } = await supabase
    .from('identity_statements')
    .insert({
      user_id: userId,
      ...statement,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating identity statement:', error);
    return null;
  }

  return data;
}

export async function updateIdentityStatement(
  statementId: string,
  updates: Partial<IdentityStatement>
): Promise<boolean> {
  const { error } = await supabase
    .from('identity_statements')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', statementId);

  if (error) {
    console.error('Error updating identity statement:', error);
    return false;
  }

  return true;
}

export async function deleteIdentityStatement(statementId: string): Promise<boolean> {
  const { error } = await supabase
    .from('identity_statements')
    .delete()
    .eq('id', statementId);

  if (error) {
    console.error('Error deleting identity statement:', error);
    return false;
  }

  return true;
}

// ============================================
// FUTURE LETTERS
// ============================================

export async function getFutureLetters(userId: string): Promise<FutureLetter[]> {
  const { data, error } = await supabase
    .from('future_letters')
    .select('*')
    .eq('user_id', userId)
    .order('unlock_date', { ascending: false });

  if (error) {
    console.error('Error fetching future letters:', error);
    return [];
  }

  return data || [];
}

export async function createFutureLetter(
  userId: string,
  letter: Omit<FutureLetter, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<FutureLetter | null> {
  const { data, error } = await supabase
    .from('future_letters')
    .insert({
      user_id: userId,
      ...letter,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating future letter:', error);
    return null;
  }

  return data;
}

export async function updateFutureLetter(
  letterId: string,
  updates: Partial<FutureLetter>
): Promise<boolean> {
  const { error } = await supabase
    .from('future_letters')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', letterId);

  if (error) {
    console.error('Error updating future letter:', error);
    return false;
  }

  return true;
}

export async function deleteFutureLetter(letterId: string): Promise<boolean> {
  const { error } = await supabase
    .from('future_letters')
    .delete()
    .eq('id', letterId);

  if (error) {
    console.error('Error deleting future letter:', error);
    return false;
  }

  return true;
}

// ============================================
// GUIDED REFLECTIONS
// ============================================

export async function getGuidedReflections(userId: string): Promise<GuidedReflection[]> {
  const { data, error } = await supabase
    .from('guided_reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guided reflections:', error);
    return [];
  }

  return data || [];
}

export async function createGuidedReflection(
  userId: string,
  reflection: Omit<GuidedReflection, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<GuidedReflection | null> {
  const { data, error } = await supabase
    .from('guided_reflections')
    .insert({
      user_id: userId,
      ...reflection,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating guided reflection:', error);
    return null;
  }

  return data;
}

export async function updateGuidedReflection(
  reflectionId: string,
  updates: Partial<GuidedReflection>
): Promise<boolean> {
  const { error } = await supabase
    .from('guided_reflections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', reflectionId);

  if (error) {
    console.error('Error updating guided reflection:', error);
    return false;
  }

  return true;
}

// ============================================
// USER PROFILE
// ============================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Set default timezone if not already set
  if (data && !data.timezone) {
    data.timezone = 'Asia/Kolkata';
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }

  return true;
}

// ============================================
// STORAGE - VISION BOARD IMAGES
// ============================================

export async function uploadVisionBoardImage(
  userId: string,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  console.log('Uploading file:', fileName);

  const { error } = await supabase.storage
    .from('vision-board')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data } = supabase.storage
    .from('vision-board')
    .getPublicUrl(fileName);

  console.log('Image uploaded successfully. URL:', data.publicUrl);
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  return data.publicUrl;
}

export async function deleteVisionBoardImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/vision-board/')[1];
    const { error } = await supabase.storage
      .from('vision-board')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// ============================================
// THOUGHTS
// ============================================

export async function getThoughts(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching thoughts:', error);
    return [];
  }

  return data || [];
}

export async function createThought(
  userId: string,
  title: string,
  content: string
): Promise<any | null> {
  console.log('=== createThought DB function called ===');
  console.log('Input:', { userId, title, content });
  
  const { data, error } = await supabase
    .from('thoughts')
    .insert({
      user_id: userId,
      title,
      content,
    })
    .select()
    .single();

  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Error creating thought:', error);
    console.error('Error details:', error.message, error.code, error.details, error.hint);
    return null;
  }

  return data;
}

export async function updateThought(
  thoughtId: string,
  title: string,
  content: string
): Promise<boolean> {
  console.log('=== updateThought DB function ===');
  console.log('Input:', { thoughtId, title, content });
  
  const { data, error } = await supabase
    .from('thoughts')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', thoughtId)
    .select();

  console.log('Update response:', { data, error });

  if (error) {
    console.error('Error updating thought:', error);
    console.error('Error details:', error.message, error.code, error.details);
    return false;
  }

  console.log('Update successful, updated rows:', data);
  return true;
}

export async function deleteThought(thoughtId: string): Promise<boolean> {
  const { error } = await supabase
    .from('thoughts')
    .delete()
    .eq('id', thoughtId);

  if (error) {
    console.error('Error deleting thought:', error);
    return false;
  }

  return true;
}
