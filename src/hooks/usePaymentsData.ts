// src/hooks/usePaymentsData.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { paymentService } from "@/services/admin.service";
import type {
  Payment,
  PaymentDepartment,
  PaymentTypeEnum,
} from "@/types/admin.types";
import { usePaymentsCache } from "./usePaymentsCache";
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
  const { clearPaymentsCache } = usePaymentsCache();
  const [isExporting, setIsExporting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<"fresh" | "stale" | "none">(
    "none"
  );
  const [currentPagePayments, setCurrentPagePayments] = useState<Payment[]>([]);

  const [allPaymentsCache, setAllPaymentsCache] = useState<Payment[]>([]);
  const [isPrefetching, setIsPrefetching] = useState(false);

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

const prefetchAllPayments = useCallback(
  async (total: number) => {
    try {
      setIsPrefetching(true);

      const PREFETCH_LIMIT = 400;
      const totalPages = Math.ceil(total / PREFETCH_LIMIT);

      console.log(`Prefetch started: total=${total}, pages=${totalPages}`);

      for (let page = 1; page <= totalPages; page++) {
        let type: PaymentTypeEnum | undefined;
        if (filters.type !== "all") type = filters.type as PaymentTypeEnum;

        let department: PaymentDepartment | undefined;
        if (filters.department !== "all")
          department = filters.department as PaymentDepartment;

        console.log(`Prefetch page ${page}...`);

        const res = await paymentService.getPayments({
          page,
          limit: PREFETCH_LIMIT,
          ...(type && { type }),
          ...(department && { department }),
          ...(filters.level && { level: filters.level }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
        });

        console.log(
          `Page ${page} loaded, payments: ${res.payments?.length ?? 0}`
        );

        // Incrementally update cache
        setAllPaymentsCache((prev) => [...prev, ...(res.payments ?? [])]);
      }
    } catch (e) {
      console.error("Prefetch failed:", e);
    } finally {
      setIsPrefetching(false);
    }
  },
  [filters]
);


  // =========================
  // LOAD PAYMENTS
  // =========================
  const loadPayments = useCallback(
    async (isSearch = false, pageOverride?: number, search?: string) => {
      const pageToLoad = pageOverride || pagination.page;

      const dataSource = allPaymentsCache.length > 0 ? allPaymentsCache : null;

      // If cached AND not searching, just use cache
      if (dataSource && !search) {
        console.log(
          `Loading page ${pageToLoad} from cache, total cached: ${dataSource.length}`
        );
        setCurrentPagePayments(
          dataSource.slice(
            (pageToLoad - 1) * pagination.limit,
            pageToLoad * pagination.limit
          )
        );
        setCacheStatus("fresh");
        return;
      }

      // Otherwise fallback to fetching
      if (!isSearch) setLoading(true);
      if (isSearch) setSearchLoading(true);
      setCacheStatus("none");
      setProgress(10);

      const startTime = Date.now();
      const params: any = {
        page: pageToLoad.toString(),
        limit: pagination.limit.toString(),
      };
      if (filters.type !== "all") params.type = filters.type;
      if (filters.department !== "all") params.department = filters.department;
      if (filters.level !== "all") params.level = filters.level;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (search) params.search = search;

      try {
        const response = await paymentService.getPayments(params);
        setProgress(60);

        const { payments: paymentsData = [], pagination: serverPagination } =
          response;

        setCurrentPagePayments(paymentsData);

        setPagination((prev) => ({
          page: serverPagination?.page ?? prev.page,
          limit: serverPagination?.limit ?? prev.limit,
          total: serverPagination?.total ?? 0,
          totalPages: serverPagination?.totalPages ?? 1,
        }));

        const isSearching = Boolean(search && search.trim());

        if (
          pageToLoad === 1 &&
          !isSearching &&
          serverPagination?.total &&
          allPaymentsCache.length === 0
        ) {
          console.log("Starting prefetch...");
          prefetchAllPayments(serverPagination.total);
        }

        setProgress(90);
        setCacheStatus("fresh");
        setLoadTime(Date.now() - startTime);
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
    [
      filters,
      pagination.limit,
      pagination.page,
      allPaymentsCache,
      prefetchAllPayments,
    ]
  );

  // =========================
  // HANDLE SEARCH
  // =========================
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // =========================
  // HANDLE REFRESH
  // =========================
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery("");
    clearPaymentsCache();
    setAllPaymentsCache([]);

    setPagination((prev) => ({ ...prev, page: 1 }));
    await loadPayments(false, 1);
    setRefreshing(false);
    toast.info("Payments cache cleared and refreshed.");
  }, [clearPaymentsCache, loadPayments]);

  // =========================
  // HANDLE PAGE CHANGE
  // =========================
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
    },
    [setPagination]
  );

  // =========================
  // HANDLE PAYMENT CREATED
  // =========================
  const handlePaymentCreated = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery("");
    clearPaymentsCache();
    setAllPaymentsCache([]);

    setPagination((prev) => ({ ...prev, page: 1 }));
    await loadPayments(false, 1);
    setRefreshing(false);
    toast.success("Payment created successfully. Cache cleared.");
  }, [clearPaymentsCache, loadPayments]);

  const exportCSV = async () => {
    const params: any = {};

    try {
      setIsExporting(true);

      // Build query params from filters
      if (filters.type !== "all") params.type = filters.type;
      if (filters.department !== "all") params.department = filters.department;
      if (filters.level !== "all") params.level = filters.level;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      // Call backend
      const fileBlob = await paymentService.exportPaymentsCSV(params);
      let name = filters.type;
      if (filters.type == "college") name = "NACOS";

      // Download file
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_${filters.department}_payments.csv`;
      a.click();

      // Cleanup
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
  };

  const dataSource =
    allPaymentsCache.length > 0 ? allPaymentsCache : currentPagePayments;

  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;

  const paginatedPayments = dataSource.slice(start, end);

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    loadPayments(
      Boolean(debouncedSearchQuery),
      pagination.page,
      debouncedSearchQuery
    );
  }, [debouncedSearchQuery, debouncedFilters, pagination.page, loadPayments]);

  useEffect(() => {
    setAllPaymentsCache([]);
    setPagination((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, [debouncedFilters, debouncedSearchQuery]);

  return {
    payments: paginatedPayments,
    loading,
    isPrefetching,
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
    hasPermission,
    admin,
    exportCSV,
    isExporting,
  };
};
