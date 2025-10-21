import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(
    null
  );
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { CACHE_KEYS, isCacheValid, getFromCache, saveToCache, clearCache } =
    useDashboardCache();

  const loadDashboardData = async (forceRefresh = false) => {
    if (!forceRefresh) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      if (!forceRefresh && isCacheValid(CACHE_KEYS.DASHBOARD_STATS)) {
        const cachedStats = getFromCache<DashboardStats>(
          CACHE_KEYS.DASHBOARD_STATS
        );
        const cachedFinancial = getFromCache<FinancialStats>(
          CACHE_KEYS.FINANCIAL_STATS
        );
        const cachedPayments = getFromCache<Payment[]>(
          CACHE_KEYS.RECENT_PAYMENTS
        );
        const cachedLastUpdated = getFromCache<string>(CACHE_KEYS.LAST_UPDATED);

        if (cachedStats && cachedFinancial && cachedPayments) {
          setStats(cachedStats);
          setFinancialStats(cachedFinancial);
          setRecentPayments(cachedPayments);
          setLastUpdated(cachedLastUpdated || new Date().toLocaleTimeString());

          if (!forceRefresh) {
            setLoading(false);
            setIsRefreshing(false);
            setTimeout(() => loadDashboardData(true), 1000);
            return;
          }
        }
      }

      const [dashboardData, financialData, recentPaymentsData] =
        await Promise.all([
          dashboardService.getSuperAdminStats(),
          dashboardService.getFinancialStats(),
          paymentService.getPayments({
            page: 1,
            limit: 10,
            sort: "newest",
          }),
        ]);

      setStats(dashboardData);
      setFinancialStats(financialData);
      setRecentPayments(recentPaymentsData.payments || []);

      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);

      saveToCache(CACHE_KEYS.DASHBOARD_STATS, dashboardData);
      saveToCache(CACHE_KEYS.FINANCIAL_STATS, financialData);
      saveToCache(
        CACHE_KEYS.RECENT_PAYMENTS,
        recentPaymentsData.payments || []
      );
      saveToCache(CACHE_KEYS.LAST_UPDATED, currentTime);

      if (forceRefresh) {
        toast.success("Dashboard updated successfully");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      const errorMessage = "Failed to load dashboard data. Please try again.";
      if (forceRefresh) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const recalculateStats = async () => {
    try {
      setIsRefreshing(true);
      await financialService.recalculateFinancialStats();
      clearCache();
      await loadDashboardData(true);
      toast.success("Statistics recalculated successfully");
    } catch (error) {
      console.error("Failed to recalculate stats:", error);
      toast.error("Failed to recalculate statistics");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && !isRefreshing) {
        if (!isCacheValid(CACHE_KEYS.DASHBOARD_STATS)) {
          loadDashboardData(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loading, isRefreshing]);

  return {
    stats,
    financialStats,
    recentPayments,
    loading,
    lastUpdated,
    isRefreshing,
    loadDashboardData,
    recalculateStats,
    isCacheValid: () => isCacheValid(CACHE_KEYS.DASHBOARD_STATS),
  };
};
