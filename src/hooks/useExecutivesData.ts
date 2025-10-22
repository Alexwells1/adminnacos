import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { executiveService } from "@/services/admin.service";
import type { Executive } from "@/types/admin.types";
import { useExecutivesCache } from "./useExecutivesCache";
import { useAuth } from "@/contexts/useAuth";

export const useExecutivesData = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<"fresh" | "stale" | "none">(
    "none"
  );

  const { admin, hasPermission } = useAuth();
  const { getCachedData, setCacheData, clearCache } = useExecutivesCache();

  const canManageExecutives = useMemo(
    () => admin?.role === "super_admin" || hasPermission("canManageAdmins"),
    [admin?.role, hasPermission]
  );

  const calculateStats = useCallback((data: Executive[]) => {
    const scopeCounts: Record<string, number> = {};
    data.forEach((exec) => {
      scopeCounts[exec.scope] = (scopeCounts[exec.scope] || 0) + 1;
    });

    return {
      total: data.length,
      byScope: scopeCounts,
    };
  }, []);

  const loadExecutives = useCallback(
    async (useCache: boolean = true, isManualRefresh: boolean = false) => {
      const startTime = performance.now();

      try {
        setLoading(true);
        setRefreshing(isManualRefresh);
        setProgress(0);

        // Check cache first
        if (useCache && !isManualRefresh) {
          const cached = getCachedData(admin?.role || "default");
          if (cached) {
            setProgress(50);
            setExecutives(cached.data);
            setCacheStatus("fresh");
            setProgress(100);
            const endTime = performance.now();
            setLoadTime(endTime - startTime);
            setLoading(false);
            return;
          }
        }

        setProgress(20);
        setCacheStatus("none");

        // Fetch fresh data
        const data = await executiveService.listExecutives();

        setProgress(70);
        setExecutives(data);

        // Cache the data
        const cacheSuccess = setCacheData(data, admin?.role || "default");
        if (cacheSuccess) {
          setCacheStatus("fresh");
        }

        setProgress(100);
        const endTime = performance.now();
        setLoadTime(endTime - startTime);

        if (isManualRefresh) {
          toast.success("Executives data refreshed successfully");
        }
      } catch (error: any) {
        toast.error("Failed to load executives data");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setProgress(0);
      }
    },
    [admin?.role, getCachedData, setCacheData]
  );

  const handleManualRefresh = useCallback(() => {
    clearCache(admin?.role || "default");
    loadExecutives(false, true);
  }, [loadExecutives, clearCache, admin?.role]);

  const stats = useMemo(
    () => calculateStats(executives),
    [executives, calculateStats]
  );

  useEffect(() => {
    loadExecutives(true, false);

    // Auto-refresh every 5 minutes
    const intervalId = setInterval(() => {
      loadExecutives(false, false);
    }, 300000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadExecutives]);

  return {
    executives,
    loading,
    progress,
    loadTime,
    refreshing,
    cacheStatus,
    stats,
    canManageExecutives,
    loadExecutives,
    handleManualRefresh,
  };
};
