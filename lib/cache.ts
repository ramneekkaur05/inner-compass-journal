// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class Cache {
  private store = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  invalidateByPrefix(prefix: string): void {
    Array.from(this.store.keys()).forEach((key) => {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    });
  }
}

export const appCache = new Cache();
