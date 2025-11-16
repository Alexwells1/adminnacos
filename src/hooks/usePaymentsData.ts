// src/hooks/usePaymentsData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { paymentService } from "@/services/admin.service";
import type { Payment } from "@/types/admin.types";
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

// Level filter
const filterPaymentsByLevel = (payments: Payment[], levelFilter: string) => {
  if (levelFilter === "all") return payments;
  if (levelFilter === "200") {
    return payments.filter((p) => p.level === "200" || p.level === "200 D.E");
  }
  return payments.filter((p) => p.level === levelFilter);
};

// Client-side search fallback
const searchPayments = (payments: Payment[], query: string) => {
  if (!query.trim()) return payments;
  const term = query.toLowerCase().trim();
  return payments.filter(
    (p) =>
      p.matricNumber?.toLowerCase().includes(term) ||
      p.reference?.toLowerCase().includes(term) ||
      p.fullName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.department?.toLowerCase().includes(term) ||
      p.level?.toLowerCase().includes(term) ||
      p.type?.toLowerCase().includes(term) ||
      p.amount?.toString().includes(term)
  );
};

export const usePaymentsData = () => {
  const { admin, hasPermission } = useAuth();
  const { clearPaymentsCache } = usePaymentsCache();
  const [isExporting, setIsExporting] = useState(false);

  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
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

  const previousFiltersRef = useRef<any>(null);
  const isInitialLoadRef = useRef(true);

  // =========================
  // Apply client-side filters
  // =========================
  const applyClientSideFilters = useCallback(
    (
      payments: Payment[],
      currentFilters: any,
      currentSearchQuery: string = ""
    ) => {
      let filtered = [...payments];
      if (currentSearchQuery.trim())
        filtered = searchPayments(filtered, currentSearchQuery);
      if (currentFilters.level !== "all")
        filtered = filterPaymentsByLevel(filtered, currentFilters.level);
      if (currentFilters.type !== "all")
        filtered = filtered.filter((p) => p.type === currentFilters.type);
      if (currentFilters.department !== "all")
        filtered = filtered.filter(
          (p) => p.department === currentFilters.department
        );
      if (currentFilters.startDate) {
        const start = new Date(currentFilters.startDate);
        filtered = filtered.filter((p) => new Date(p.createdAt) >= start);
      }
      if (currentFilters.endDate) {
        const end = new Date(currentFilters.endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter((p) => new Date(p.createdAt) <= end);
      }
      if (currentFilters.sort === "newest")
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      else if (currentFilters.sort === "oldest")
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      else if (currentFilters.sort === "amount")
        filtered.sort((a, b) => b.amount - a.amount);
      return filtered;
    },
    []
  );

  // =========================
  // LOAD PAYMENTS
  // =========================
  const loadPayments = useCallback(
    async (isSearch = false, pageOverride?: number, search?: string) => {
      const pageToLoad = pageOverride || pagination.page;
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
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (search) params.search = search;

      try {
        const response = await paymentService.getPayments(params);
        setProgress(60);

        const { payments: paymentsData = [], pagination: serverPagination } =
          response;

        // Store all payments if not searching
        if (!search) setAllPayments(paymentsData);

        // Apply client-side filters if needed
        const filtered = applyClientSideFilters(
          paymentsData,
          filters,
          search || ""
        );

        setFilteredPayments(filtered);

        // ✅ Always prefer backend pagination
        setPagination((prev) => ({
          page: serverPagination?.page || prev.page,
          limit: serverPagination?.limit || prev.limit,
          total: serverPagination?.total || filtered.length,
          totalPages: Math.max(serverPagination?.totalPages || 1, 1),
        }));

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
        isInitialLoadRef.current = false;
        setTimeout(() => setProgress(0), 500);
      }
    },
    [filters, pagination.limit, pagination.page, applyClientSideFilters]
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
    previousFiltersRef.current = null;
    clearPaymentsCache();
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
    previousFiltersRef.current = null;
    clearPaymentsCache();
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

  return {
    payments: filteredPayments,
    allPayments,
    filteredPayments,
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
    hasPermission,
    admin,
    exportCSV,
    isExporting,
  };
};
