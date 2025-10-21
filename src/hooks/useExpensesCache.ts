import { useCallback } from "react";

const CACHE_EXPIRY = 5 * 60 * 1000;

export const useExpensesCache = () => {
  const CACHE_KEYS = {
    EXPENSES: (page: number, limit: number, filters: string) =>
      `expenses_${page}_${limit}_${filters}`,
    FINANCIAL_STATS: "expenses_financial_stats",
    LAST_UPDATED: "expenses_last_updated",
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
        if (key && key.startsWith("expenses_")) {
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

  const clearExpensesCache = useCallback(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("expenses_")) {
          localStorage.removeItem(key);
        }
      });
      console.log("🧹 Expenses cache cleared");
    } catch (error) {
      console.warn("Failed to clear expenses cache:", error);
    }
  }, []);

  const optimizeDataForCaching = useCallback((data: any): any => {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((expense: any) => ({
        _id: expense._id,
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        type: expense.type,
        department: expense.department,
        account: expense.account,
        paymentMethod: expense.paymentMethod,
        date: expense.date,
        createdBy: expense.createdBy
          ? {
              name: expense.createdBy.name,
              role: expense.createdBy.role,
            }
          : undefined,
      }));
    }

    if (data.totalCollegeRevenue !== undefined) {
      return {
        totalCollegeRevenue: data.totalCollegeRevenue,
        totalDepartmentalRevenue: data.totalDepartmentalRevenue,
        totalMaintenance: data.totalMaintenance,
        maintenanceExpenses: data.maintenanceExpenses,
        availableMaintenance: data.availableMaintenance,
        totalExpenses: data.totalExpenses,
        netBalance: data.netBalance,
        accounts: Object.keys(data.accounts || {}).reduce((acc: any, key) => {
          const account = data.accounts[key];
          if (account) {
            acc[key] = {
              totalRevenue: account.totalRevenue,
              expenses: account.expenses,
              availableBalance: account.availableBalance,
            };
          }
          return acc;
        }, {}),
      };
    }

    return data;
  }, []);

  return {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearExpensesCache,
    optimizeDataForCaching,
  };
};
