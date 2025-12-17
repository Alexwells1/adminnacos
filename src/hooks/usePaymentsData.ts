// src/hooks/usePaymentsData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { paymentService } from "@/services/admin.service";
import type {
  Payment
} from "@/types/admin.types";
import { useAuth } from "@/contexts/useAuth";

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const usePaymentsData = () => {
  const { admin, hasPermission } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<"fresh" | "stale" | "none">(
    "none"
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState(() => {
    const defaultFilters = {
      type: "all",
      department: "all",
      level: "all",
      startDate: "",
      endDate: "",
      sort: "newest",
    };
    if (admin?.role === "college_admin") defaultFilters.type = "college";
    if (admin?.role === "dept_admin") {
      defaultFilters.type = "departmental";
      if (admin.department) defaultFilters.department = admin.department;
    }
    return defaultFilters;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedFilters = useDebounce(filters, 500);

  const [isExporting, setIsExporting] = useState(false);

  /** Cache per page + filters + search */
  const pageCache = useRef<Record<string, Payment[]>>({});

  const makeCacheKey = (page: number) =>
    JSON.stringify({
      page,
      limit: pagination.limit,
      filters: debouncedFilters,
      search: debouncedSearchQuery,
    });

  /** Load payments (server-side pagination) */
  const loadPayments = useCallback(
    async (isSearch = false, pageOverride?: number, search?: string) => {
      const pageToLoad = pageOverride || pagination.page;
      const cacheKey = makeCacheKey(pageToLoad);

      if (pageCache.current[cacheKey]) {
        setPayments(pageCache.current[cacheKey]);
        setCacheStatus("fresh");
        return;
      }

      if (!isSearch) setLoading(true);
      if (isSearch) setSearchLoading(true);
      setCacheStatus("none");
      setProgress(10);

      const startTime = Date.now();

      try {
        const params: any = {
          page: pageToLoad,
          limit: pagination.limit,
        };
        if (filters.type !== "all") params.type = filters.type;
        if (filters.department !== "all")
          params.department = filters.department;
        if (filters.level !== "all") params.level = filters.level;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (search) params.search = search;

        setProgress(30);
        const response = await paymentService.getPayments(params);
        setProgress(60);

        const { payments: paymentsData = [], pagination: serverPagination } =
          response;

        pageCache.current[cacheKey] = paymentsData;
        setPayments(paymentsData);

        setPagination((prev) => ({
          page: serverPagination?.page ?? prev.page,
          limit: serverPagination?.limit ?? prev.limit,
          total: serverPagination?.total ?? 0,
          totalPages: serverPagination?.totalPages ?? 1,
        }));

        setLoadTime(Date.now() - startTime);
        setCacheStatus("fresh");
        setProgress(100);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load payments"
        );
        setProgress(0);
      } finally {
        setLoading(false);
        setSearchLoading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [debouncedFilters, debouncedSearchQuery, pagination.limit, filters]
  );

  /** Handle search input */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /** Refresh payments */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery("");
    pageCache.current = {};
    setPagination((prev) => ({ ...prev, page: 1 }));
    await loadPayments(false, 1);
    setRefreshing(false);
    toast.info("Payments cache cleared and refreshed.");
  }, [loadPayments]);

  /** Handle page change */
  const handlePageChange = useCallback(
    (newPage: number) => setPagination((prev) => ({ ...prev, page: newPage })),
    []
  );

  /** Handle payment created */
  const handlePaymentCreated = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery("");
    pageCache.current = {};
    setPagination((prev) => ({ ...prev, page: 1 }));
    await loadPayments(false, 1);
    setRefreshing(false);
    toast.success("Payment created successfully. Cache cleared.");
  }, [loadPayments]);

  /** Export CSV */
  const exportCSV = useCallback(async () => {
    const params: any = {};
    try {
      setIsExporting(true);

      if (filters.type !== "all") params.type = filters.type;
      if (filters.department !== "all") params.department = filters.department;
      if (filters.level !== "all") params.level = filters.level;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const fileBlob = await paymentService.exportPaymentsCSV(params);

      const name = filters.type === "college" ? "NACOS" : filters.type;
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_${filters.department}_payments.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
    } catch (error: any) {
      console.error("Export CSV Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to export CSV. Try again."
      );
    } finally {
      setIsExporting(false);
    }
  }, [filters, searchQuery]);

  /** Reset cache on filter/search change */
  useEffect(() => {
    pageCache.current = {};
    setPagination((p) => ({ ...p, page: 1 }));
  }, [debouncedFilters, debouncedSearchQuery]);

  /** Load payments on page change */
  useEffect(() => {
    loadPayments(
      Boolean(debouncedSearchQuery),
      pagination.page,
      debouncedSearchQuery
    );
  }, [pagination.page, debouncedSearchQuery, loadPayments]);

  return {
    payments,
    loading,
    searchLoading,
    refreshing,
    loadTime,
    progress,
    cacheStatus,
    pagination,
    filters,
    setFilters,
    searchQuery,
    handleSearch,
    loadPayments,
    handlePageChange,
    handleRefresh,
    handlePaymentCreated,
    exportCSV,
    isExporting,
    hasPermission,
    admin,
  };
};
