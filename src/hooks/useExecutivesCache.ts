import { useCallback } from "react";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = "executives_cache";

interface ExecutivesCache {
  data: any[];
  timestamp: number;
  adminType: string;
}

export const useExecutivesCache = () => {
  const getCacheKey = useCallback((adminRole: string = "default") => {
    return `${CACHE_KEY}_${adminRole}`;
  }, []);

  const getCachedData = useCallback(
    (adminRole: string): ExecutivesCache | null => {
      try {
        const cacheKey = getCacheKey(adminRole);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const cache: ExecutivesCache = JSON.parse(cached);
        const isStale = Date.now() - cache.timestamp > CACHE_DURATION;

        return isStale ? null : cache;
      } catch {
        return null;
      }
    },
    [getCacheKey]
  );

  const setCacheData = useCallback(
    (data: any[], adminRole: string) => {
      try {
        const cacheKey = getCacheKey(adminRole);
        const cache: ExecutivesCache = {
          data,
          timestamp: Date.now(),
          adminType: adminRole,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        return true;
      } catch (error) {
        console.warn("Failed to cache executives data:", error);
        return false;
      }
    },
    [getCacheKey]
  );

  const clearCache = useCallback(
    (adminRole: string) => {
      try {
        const cacheKey = getCacheKey(adminRole);
        localStorage.removeItem(cacheKey);
        return true;
      } catch (error) {
        console.warn("Failed to clear executives cache:", error);
        return false;
      }
    },
    [getCacheKey]
  );

  return {
    getCachedData,
    setCacheData,
    clearCache,
    CACHE_DURATION,
  };
};
