import { useCallback } from "react";

const CACHE_KEYS = {
  DASHBOARD_STATS: "super_admin_dashboard_stats",
  FINANCIAL_STATS: "super_admin_financial_stats",
  RECENT_PAYMENTS: "super_admin_recent_payments",
  LAST_UPDATED: "super_admin_last_updated",
};

const CACHE_EXPIRY = 5 * 60 * 1000;

export const useDashboardCache = () => {
  const isCacheValid = useCallback((cacheKey: string): boolean => {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;

    try {
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp < CACHE_EXPIRY;
    } catch {
      return false;
    }
  }, []);

  const getFromCache = useCallback(<T>(cacheKey: string): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);

      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, []);

  const saveToCache = useCallback((cacheKey: string, data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to save to cache:", error);
    }
  }, []);

  const clearCache = useCallback(() => {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  return {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearCache,
  };
};
