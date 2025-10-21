import { useCallback } from "react";

const CACHE_KEYS = {
  DASHBOARD_STATS: "college_admin_dashboard_stats",
  FINANCIAL_STATS: "college_admin_financial_stats",
  RECENT_PAYMENTS: "college_admin_recent_payments",
  LAST_UPDATED: "college_admin_last_updated",
};

const CACHE_EXPIRY = 5 * 60 * 1000;

export const useCollegeCache = () => {
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

  const saveToCache = useCallback((cacheKey: string, data: any): boolean => {
    try {
      const testData = JSON.stringify({ data, timestamp: Date.now() });
      if (testData.length > 2 * 1024 * 1024) {
        console.warn(
          `⚠️ Cache data too large for ${cacheKey}: ${testData.length} bytes`
        );
        return false;
      }

      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.warn("Failed to save to cache:", error);

      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        clearOldCacheEntries();
        return false;
      }
      return false;
    }
  }, []);

  const clearOldCacheEntries = useCallback(() => {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("college_admin_")) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const { timestamp } = JSON.parse(item);
              if (now - timestamp > 60 * 60 * 1000) {
                keysToRemove.push(key);
              }
            }
          } catch {
            keysToRemove.push(key!);
          }
        }
      }

      keysToRemove.slice(0, 3).forEach((key) => {
        localStorage.removeItem(key);
        console.log(`🧹 Removed old cache: ${key}`);
      });
    } catch (error) {
      console.warn("Failed to clear old cache entries:", error);
    }
  }, []);

  const clearCollegeCache = useCallback(() => {
    try {
      Object.values(CACHE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log("🧹 College admin cache cleared");
    } catch (error) {
      console.warn("Failed to clear college cache:", error);
    }
  }, []);

  const optimizeDataForCaching = useCallback((data: any): any => {
    if (!data) return data;

    if (data.totalPayments !== undefined) {
      return {
        totalPayments: data.totalPayments,
        totalRevenue: data.totalRevenue,
        financialStats: data.financialStats
          ? {
              totalCollegeRevenue: data.financialStats.totalCollegeRevenue,
              accounts: {
                college_general: data.financialStats.accounts?.college_general
                  ? {
                      totalRevenue:
                        data.financialStats.accounts.college_general
                          .totalRevenue,
                      expenses:
                        data.financialStats.accounts.college_general.expenses,
                      availableBalance:
                        data.financialStats.accounts.college_general
                          .availableBalance,
                    }
                  : undefined,
              },
            }
          : undefined,
        recentPayments: data.recentPayments
          ? data.recentPayments.map((payment: any) => ({
              id: payment.id,
              amount: payment.amount,
              status: payment.status,
              fullName: payment.fullName,
              matricNumber: payment.matricNumber,
              department: payment.department,
              level: payment.level,
            }))
          : [],
      };
    }

    if (Array.isArray(data)) {
      return data.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        fullName: payment.fullName,
        matricNumber: payment.matricNumber,
        department: payment.department,
        level: payment.level,
      }));
    }

    return data;
  }, []);

  return {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearCollegeCache,
    optimizeDataForCaching,
  };
};
