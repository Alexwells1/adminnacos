import { useCallback } from "react";

const CACHE_EXPIRY = 5 * 60 * 1000;

export const usePaymentsCache = () => {
  const CACHE_KEYS = {
    PAYMENTS_DATA: (cacheKey: string) => `payments_${cacheKey}`,
    SEARCH_RESULTS: (query: string) => `payments_search_${query}`,
    PREFETCH_DATA: (cacheKey: string) => `payments_prefetch_${cacheKey}`,
    LAST_UPDATED: "payments_last_updated",
  };

  const isCacheValid = useCallback((cacheKey: string): boolean => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return false;

      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp < CACHE_EXPIRY;
    } catch {
      return false;
    }
  }, []);

  const getFromCache = useCallback(
    <T>(cacheKey: string): T | null => {
      try {
        if (!isCacheValid(cacheKey)) {
          localStorage.removeItem(cacheKey);
          return null;
        }

        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const { data } = JSON.parse(cached);
        return data;
      } catch {
        return null;
      }
    },
    [isCacheValid]
  );

  const saveToCache = useCallback((cacheKey: string, data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.warn("Failed to save to cache:", error);
      return false;
    }
  }, []);

  const clearPaymentsCache = useCallback(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("payments_")) {
          localStorage.removeItem(key);
        }
      });
      console.log("🧹 Payments cache cleared");
    } catch (error) {
      console.warn("Failed to clear payments cache:", error);
    }
  }, []);

  return {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearPaymentsCache,
  };
};
