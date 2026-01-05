import { getCurrentUser } from './auth';
import { appCache } from './cache';
import { 
  getAllJournalEntries, 
  getVisionBoardItems, 
  getIdentityStatements,
  getGuidedReflections,
  getFutureLetters
} from './db';

/**
 * Prefetch data for faster page loads
 * Call this when the app initializes to warm up the cache
 */
export async function prefetchPageData(userId: string) {
  try {
    // Prefetch all heavy data in parallel
    await Promise.all([
      getAllJournalEntries(userId),
      getVisionBoardItems(userId),
      getIdentityStatements(userId),
      getGuidedReflections(userId),
      getFutureLetters(userId),
    ]);
  } catch (error) {
    console.warn('Prefetch error (non-critical):', error);
  }
}
