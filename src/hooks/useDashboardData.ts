import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  dashboardService,
  financialService,
  paymentService,
} from "@/services/admin.service";
import type {
  DashboardStats,
  FinancialStats,
  Payment,
} from "@/types/admin.types";
import { useDashboardCache } from "./useDashboardCache";

export const useDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(
    null
  );
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { CACHE_KEYS, isCacheValid, getFromCache, saveToCache, clearCache } =
    useDashboardCache();

  const initialLoadTriggered = useRef(false);

  const loadDashboardData = useCallback(
    async (forceRefresh = false) => {
      if ((loading && !forceRefresh) || (isRefreshing && forceRefresh)) return;

      if (!forceRefresh) setLoading(true);
      else setIsRefreshing(true);

      try {
        const canUseCache = isCacheValid(CACHE_KEYS.DASHBOARD_STATS);

        // ✅ Load from cache if valid
        if (!forceRefresh && canUseCache) {
          const cachedStats = getFromCache<DashboardStats>(
            CACHE_KEYS.DASHBOARD_STATS
          );
          const cachedFinancial = getFromCache<FinancialStats>(
            CACHE_KEYS.FINANCIAL_STATS
          );
          const cachedPayments = getFromCache<Payment[]>(
            CACHE_KEYS.RECENT_PAYMENTS
          );
          const cachedLastUpdated = getFromCache<string>(
            CACHE_KEYS.LAST_UPDATED
          );

          if (cachedStats && cachedFinancial) {
            setStats(cachedStats);
            setFinancialStats(cachedFinancial);
            setRecentPayments(cachedPayments || []);
            setLastUpdated(cachedLastUpdated || "");
            console.log("✅ Dashboard loaded from cache");
            return;
          }
        }

        // 🧠 Fetch fresh data
        console.log("🌐 Fetching fresh dashboard data...");
        const [statsData, financeData, paymentsResponse] = await Promise.all([
          dashboardService.getSuperAdminStats(),
          dashboardService.getFinancialStats(),
          paymentService.getPayments({
            page: 1,
            limit: 10,
            sort: "newest",
          }),
        ]);

        const paymentsArray =
          paymentsResponse?.payments || paymentsResponse?.data || [];

        // ✅ Update states
        setStats(statsData);
        setFinancialStats(financeData);
        setRecentPayments(paymentsArray);

        const now = new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastUpdated(now);

        // 💾 Cache data
        saveToCache(CACHE_KEYS.DASHBOARD_STATS, statsData);
        saveToCache(CACHE_KEYS.FINANCIAL_STATS, financeData);
        saveToCache(CACHE_KEYS.RECENT_PAYMENTS, paymentsArray);
        saveToCache(CACHE_KEYS.LAST_UPDATED, now);

        if (forceRefresh) toast.success("Dashboard updated successfully");
        console.log("✅ Dashboard data fetched successfully");
      } catch (err) {
        console.error("❌ Error loading dashboard data:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [loading, isRefreshing, isCacheValid, getFromCache, saveToCache, CACHE_KEYS]
  );

  // 🧩 Initial load
  useEffect(() => {
    if (!initialLoadTriggered.current) {
      initialLoadTriggered.current = true;
      loadDashboardData();
    }
  }, [loadDashboardData]);

  const recalculateStats = useCallback(async () => {
    try {
      setIsRefreshing(true);
      console.log("🔄 Recalculating financial stats...");
      await financialService.recalculateFinancialStats();
      clearCache();
      await loadDashboardData(true);
    } catch (error) {
      console.error("❌ Recalculation failed:", error);
      toast.error("Recalculation failed");
    } finally {
      setIsRefreshing(false);
    }
  }, [clearCache, loadDashboardData]);

  const isDashboardCacheValid = () => isCacheValid(CACHE_KEYS.DASHBOARD_STATS);

  return {
    stats,
    financialStats,
    recentPayments,
    loading,
    lastUpdated,
    isRefreshing,
    loadDashboardData,
    recalculateStats,
    isDashboardCacheValid,
  };
};
                                              