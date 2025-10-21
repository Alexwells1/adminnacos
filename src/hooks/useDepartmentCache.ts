import { useCallback } from "react";

const CACHE_KEYS = {
  DASHBOARD_STATS: (department: string) => `dept_admin_${department}_stats`,
  FINANCIAL_STATS: (department: string) =>
    `dept_admin_${department}_financial_stats`,
  RECENT_PAYMENTS: (department: string) =>
    `dept_admin_${department}_recent_payments`,
  LAST_UPDATED: (department: string) => `dept_admin_${department}_last_updated`,
};

const CACHE_EXPIRY = 5 * 60 * 1000;

export const useDepartmentCache = () => {
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
        if (key && key.startsWith("dept_admin_")) {
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

  const clearDepartmentCache = useCallback((department: string) => {
    try {
      Object.values(CACHE_KEYS).forEach((keyFn) => {
        const key = keyFn(department);
        localStorage.removeItem(key);
      });
      console.log("🧹 Department cache cleared for:", department);
    } catch (error) {
      console.warn("Failed to clear department cache:", error);
    }
  }, []);

  const optimizeDataForCaching = useCallback((data: any): any => {
    if (!data) return data;

    if (data.totalPayments !== undefined) {
      return {
        totalPayments: data.totalPayments,
        totalRevenue: data.totalRevenue,
        totalDeptPayments: data.totalDeptPayments,
        totalDeptRevenue: data.totalDeptRevenue,
        levelWiseDept: data.levelWiseDept,
        recentDeptPayments: data.recentDeptPayments
          ? data.recentDeptPayments.map((payment: any) => ({
              id: payment.id,
              amount: payment.amount,
              status: payment.status,
              fullName: payment.fullName,
              matricNumber: payment.matricNumber,
              department: payment.department,
              level: payment.level,
              paidAt: payment.paidAt,
            }))
          : [],
        departmentStudents: data.departmentStudents
          ? data.departmentStudents.map((student: any) => ({
              id: student.id,
              amount: student.amount,
              status: student.status,
              fullName: student.fullName,
              matricNumber: student.matricNumber,
              email: student.email,
              department: student.department,
              level: student.level,
              paidAt: student.paidAt,
            }))
          : [],
        department: data.department,
        financialStats: data.financialStats
          ? {
              totalCollegeRevenue: data.financialStats.totalCollegeRevenue,
              totalDepartmentalRevenue:
                data.financialStats.totalDepartmentalRevenue,
              accounts: Object.keys(data.financialStats.accounts || {}).reduce(
                (acc: any, key) => {
                  const account = data.financialStats.accounts[key];
                  if (account) {
                    acc[key] = {
                      totalRevenue: account.totalRevenue,
                      expenses: account.expenses,
                      availableBalance: account.availableBalance,
                    };
                  }
                  return acc;
                },
                {}
              ),
            }
          : undefined,
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
        paidAt: payment.paidAt,
      }));
    }

    return data;
  }, []);

  return {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearDepartmentCache,
    optimizeDataForCaching,
  };
};
