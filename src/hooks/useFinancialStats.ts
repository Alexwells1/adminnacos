import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { financialService } from "@/services/admin.service";
import type { FinancialStats } from "@/types/expense.types";
import { useExpensesCache } from "./useExpensesCache";

export const useFinancialStats = () => {
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [cacheAvailable, setCacheAvailable] = useState(true);

  const {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    optimizeDataForCaching,
  } = useExpensesCache();

  const loadFinancialStats = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);

        // Check cache first (unless force refresh)
        if (
          !forceRefresh &&
          cacheAvailable &&
          isCacheValid(CACHE_KEYS.FINANCIAL_STATS)
        ) {
          const cachedStats = getFromCache<FinancialStats>(
            CACHE_KEYS.FINANCIAL_STATS
          );
          const cachedLastUpdated = getFromCache<string>(
            CACHE_KEYS.LAST_UPDATED
          );

          if (cachedStats) {
            setFinancialStats(cachedStats);
            setLastUpdated(
              cachedLastUpdated || new Date().toLocaleTimeString()
            );
            setLoading(false);
            return;
          }
        }

        const stats = await financialService.getFinancialStats();
        setFinancialStats(stats);

        const currentTime = new Date().toLocaleTimeString();
        setLastUpdated(currentTime);

        // Try to save to cache with optimized data
        if (cacheAvailable) {
          const optimizedStats = optimizeDataForCaching(stats);
          const savedStats = saveToCache(
            CACHE_KEYS.FINANCIAL_STATS,
            optimizedStats
          );
          const savedLastUpdated = saveToCache(
            CACHE_KEYS.LAST_UPDATED,
            currentTime
          );

          if (!savedStats || !savedLastUpdated) {
            setCacheAvailable(false);
          }
        }
      } catch (error: any) {
        console.error("Failed to load financial stats:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load financial statistics";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [cacheAvailable]
  );

  const handleRefresh = () => {
    loadFinancialStats(true);
  };

  useEffect(() => {
    loadFinancialStats();
  }, [loadFinancialStats]);

  return {
    financialStats,
    loading,
    lastUpdated,
    cacheAvailable,
    handleRefresh,
    loadFinancialStats,
  };
};
