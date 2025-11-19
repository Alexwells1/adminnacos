import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardService, paymentService } from "@/services/admin.service";
import type { DashboardStats, Payment } from "@/types/admin.types";
import { useCollegeCache } from "./useCollegeCache";

export const useCollegeData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheAvailable, setCacheAvailable] = useState(true);

  const {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearCollegeCache,
    optimizeDataForCaching,
  } = useCollegeCache();

  const loadDashboardData = async (forceRefresh = false) => {
    if (!forceRefresh) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      if (
        !forceRefresh &&
        cacheAvailable &&
        isCacheValid(CACHE_KEYS.DASHBOARD_STATS)
      ) {
        const cachedStats = getFromCache<DashboardStats>(
          CACHE_KEYS.DASHBOARD_STATS
        );
        const cachedFinancial = getFromCache<any>(CACHE_KEYS.FINANCIAL_STATS);
        const cachedPayments = getFromCache<Payment[]>(
          CACHE_KEYS.RECENT_PAYMENTS
        );
        const cachedLastUpdated = getFromCache<string>(CACHE_KEYS.LAST_UPDATED);

        if (cachedStats && cachedFinancial && cachedPayments) {
          setStats(cachedStats);
          setRecentPayments(cachedPayments);
          setLastUpdated(cachedLastUpdated || new Date().toLocaleTimeString());

          if (!forceRefresh) {
            setLoading(false);
            setIsRefreshing(false);

            if (!isCacheValid(CACHE_KEYS.DASHBOARD_STATS)) {
              setTimeout(() => loadDashboardData(true), 1000);
            }
            return;
          }
        }
      }

      const [freshFinancialData, recentPaymentsResponse] = await Promise.all([
        dashboardService.getFinancialStats(),
        paymentService.getPayments({
          page: 1,
          limit: 10,
          sort: "newest",
          type: "college",
        }),
      ]);

      const allCollegePayments = await paymentService.getPayments({
        type: "college",
        limit: 1000,
      });

     const dashboardStats: DashboardStats = {
       totalPayments: allCollegePayments.payments?.length || 0,
       totalRevenue: freshFinancialData.totalCollegeRevenue || 0,
       financialStats: freshFinancialData,
       recentPayments: recentPaymentsResponse.payments || [],
       grossTotalRevenue: freshFinancialData.grossTotalRevenue || 0,
       executivePaymentsSkipped:freshFinancialData?.executivePaymentsSkipped || 0,
     };


      setStats(dashboardStats);
      setRecentPayments(recentPaymentsResponse.payments || []);

      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);

      if (cacheAvailable) {
        const optimizedStats = optimizeDataForCaching(dashboardStats);
        const optimizedFinancial = optimizeDataForCaching(freshFinancialData);
        const optimizedPayments = optimizeDataForCaching(
          recentPaymentsResponse.payments || []
        );

        const savedStats = saveToCache(
          CACHE_KEYS.DASHBOARD_STATS,
          optimizedStats
        );
        const savedFinancial = saveToCache(
          CACHE_KEYS.FINANCIAL_STATS,
          optimizedFinancial
        );
        const savedPayments = saveToCache(
          CACHE_KEYS.RECENT_PAYMENTS,
          optimizedPayments
        );
        const savedLastUpdated = saveToCache(
          CACHE_KEYS.LAST_UPDATED,
          currentTime
        );

        if (
          !savedStats ||
          !savedFinancial ||
          !savedPayments ||
          !savedLastUpdated
        ) {
          setCacheAvailable(false);
          toast.warning("Caching disabled due to storage limitations");
        }
      }

      if (forceRefresh) {
        toast.success("College data refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      const errorMessage = "Failed to load college data";
      if (forceRefresh) {
        toast.error(errorMessage);
      } else if (!stats) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    clearCollegeCache();
    setCacheAvailable(true);
    loadDashboardData(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && !isRefreshing && stats) {
        if (!isCacheValid(CACHE_KEYS.DASHBOARD_STATS)) {
          loadDashboardData(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loading, isRefreshing, stats]);

  return {
    stats,
    recentPayments,
    loading,
    lastUpdated,
    isRefreshing,
    cacheAvailable,
    isCacheValid: () => isCacheValid(CACHE_KEYS.DASHBOARD_STATS),
    loadDashboardData,
    handleManualRefresh,
  };
};
