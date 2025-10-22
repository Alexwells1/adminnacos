// src/hooks/usePaymentsData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { paymentService } from "@/services/admin.service";
import type { Payment } from "@/types/admin.types";
import { usePaymentsCache } from "./usePaymentsCache";
import { useAuth } from "@/contexts/useAuth";

// Move useDebounce hook here - MUST BE AT TOP LEVEL
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Client-side filtering function for levels - MUST BE AT TOP LEVEL
const filterPaymentsByLevel = (
  payments: Payment[],
  levelFilter: string
): Payment[] => {
  if (levelFilter === "all") return payments;

  // Special handling for "200" - include both regular 200 and 200 D.E
  if (levelFilter === "200") {
    return payments.filter(
      (payment) => payment.level === "200" || payment.level === "200 D.E"
    );
  }

  // For specific levels like "200 D.E", "100", "300", "400" - exact match
  return payments.filter((payment) => payment.level === levelFilter);
};

// Client-side search function
const searchPayments = (payments: Payment[], query: string): Payment[] => {
  if (!query.trim()) return payments;

  const searchTerm = query.toLowerCase().trim();

  return payments.filter((payment) => {
    // Search in multiple fields
    return (
      payment.matricNumber?.toLowerCase().includes(searchTerm) ||
      payment.reference?.toLowerCase().includes(searchTerm) ||
      payment.fullName?.toLowerCase().includes(searchTerm) ||
      payment.email?.toLowerCase().includes(searchTerm) ||
      payment.department?.toLowerCase().includes(searchTerm) ||
      payment.level?.toLowerCase().includes(searchTerm) ||
      payment.type?.toLowerCase().includes(searchTerm) ||
      payment.amount?.toString().includes(searchTerm)
    );
  });
};

export const usePaymentsData = () => {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const { admin, hasPermission } = useAuth();
  const { clearPaymentsCache } = usePaymentsCache();

  // State declarations - ALL AT TOP LEVEL
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<"fresh" | "stale" | "none">(
    "none"
  );
  const [loadTime, setLoadTime] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Use refs to track previous values and prevent unnecessary re-renders
  const previousFiltersRef = useRef<any>(null);
  const isInitialLoadRef = useRef(true);

  const [filters, setFilters] = useState(() => {
    const defaultFilters = {
      type: "all",
      department: "all",
      level: "all",
      startDate: "",
      endDate: "",
      sort: "newest",
    };

    if (admin?.role === "college_admin") {
      defaultFilters.type = "college";
    } else if (admin?.role === "dept_admin") {
      defaultFilters.type = "departmental";
      if (admin.department) {
        defaultFilters.department = admin.department;
      }
    }

    return defaultFilters;
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Use debounced filters
  const debouncedFilters = useDebounce(filters, 500);
  useDebounce(searchQuery, 300);

  // Apply client-side filters - useCallback at top level
  const applyClientSideFilters = useCallback(
    (
      payments: Payment[],
      currentFilters: any,
      currentSearchQuery: string = ""
    ) => {
      let filtered = [...payments];

      // Apply search first if there's a query
      if (currentSearchQuery.trim()) {
        filtered = searchPayments(filtered, currentSearchQuery);
      }

      // Level filter - client side
      if (currentFilters.level !== "all") {
        filtered = filterPaymentsByLevel(filtered, currentFilters.level);
      }

      // Type filter
      if (currentFilters.type !== "all") {
        filtered = filtered.filter(
          (payment) => payment.type === currentFilters.type
        );
      }

      // Department filter
      if (currentFilters.department !== "all") {
        filtered = filtered.filter(
          (payment) => payment.department === currentFilters.department
        );
      }

      // Date range filter
      if (currentFilters.startDate) {
        const startDate = new Date(currentFilters.startDate);
        filtered = filtered.filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return paymentDate >= startDate;
        });
      }

      if (currentFilters.endDate) {
        const endDate = new Date(currentFilters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return paymentDate <= endDate;
        });
      }

      // Sort
      if (currentFilters.sort === "newest") {
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (currentFilters.sort === "oldest") {
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (currentFilters.sort === "amount") {
        filtered.sort((a, b) => b.amount - a.amount);
      }

      return filtered;
    },
    []
  );

  // Function to fetch ALL payments from API (multiple pages if needed)
  const fetchAllPayments = useCallback(
    async (params: any): Promise<Payment[]> => {
      const allPayments: Payment[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const limit = 100;

      while (hasMorePages) {
        try {
          const response = await paymentService.getPayments({
            ...params,
            page: currentPage.toString(),
            limit: limit.toString(),
          });

          if (response.payments && response.payments.length > 0) {
            allPayments.push(...response.payments);
          }

          // Check if there are more pages
          if (response.pagination) {
            const totalPages = response.pagination.totalPages || 0;
            hasMorePages = currentPage < totalPages;
          } else {
            hasMorePages = Boolean(
              response.payments && response.payments.length === limit
            );
          }

          currentPage++;

          // Safety check to prevent infinite loops
          if (currentPage > 50) {
            break;
          }
        } catch (error) {
          break;
        }
      }

      return allPayments;
    },
    []
  );

  const loadPayments = useCallback(
    async (isSearch = false, targetPage?: number) => {
      const pageToLoad = targetPage || pagination.page;
      const startTime = performance.now();

      if (!isSearch) {
        setLoading(true);
      }

      setProgress(0);
      setCacheStatus("none");

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      try {
        let paymentsData: Payment[] = [];

        // Build base params
        const params: any = {};

        if (filters.type !== "all") params.type = filters.type;
        if (filters.department !== "all")
          params.department = filters.department;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        // Only fetch ALL payments if we don't have them already or filters changed
        if (
          allPayments.length === 0 ||
          JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters)
        ) {
          paymentsData = await fetchAllPayments(params);
          previousFiltersRef.current = { ...filters };
        } else {
          paymentsData = allPayments;
        }

        clearInterval(progressInterval);
        setProgress(100);

        const endTime = performance.now();
        const duration = endTime - startTime;
        setLoadTime(duration);

        // Only update allPayments if we fetched new data
        if (paymentsData !== allPayments) {
          setAllPayments(paymentsData);
        }

        // Apply client-side filters including search
        const clientFiltered = applyClientSideFilters(
          paymentsData,
          filters,
          searchQuery
        );
        setFilteredPayments(clientFiltered);

        // Update pagination based on filtered results
        const totalFiltered = clientFiltered.length;
        const totalPages = Math.ceil(totalFiltered / pagination.limit);

        setPagination({
          total: totalFiltered,
          page: pageToLoad,
          limit: pagination.limit,
          totalPages: totalPages,
        });

        setCacheStatus("fresh");

        setTimeout(() => setProgress(0), 1000);
      } catch (error: any) {
        clearInterval(progressInterval);
        setProgress(0);
        setCacheStatus("none");

        const endTime = performance.now();
        const duration = endTime - startTime;
        setLoadTime(duration);

        if (error.response?.status === 403) {
          toast.error("You don't have permission to view these payments.");
        } else {
          toast.error(
            error?.response?.data?.message ||
              "An error occurred while loading payments"
          );
        }
      } finally {
        setLoading(false);
        setSearchLoading(false);
        setRefreshing(false);
        isInitialLoadRef.current = false;
      }
    },
    [
      filters,
      pagination.page,
      pagination.limit,
      searchQuery,
      allPayments,
      applyClientSideFilters,
      fetchAllPayments,
    ]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchLoading(true);
      setSearchQuery(query);

      // If search is cleared, reload payments
      if (!query.trim()) {
        setSearchQuery("");
        setSearchLoading(false);
        return;
      }

      // For search, we don't need to reload from API if we already have data
      if (allPayments.length > 0) {
        const clientFiltered = applyClientSideFilters(
          allPayments,
          filters,
          query
        );
        setFilteredPayments(clientFiltered);

        const totalFiltered = clientFiltered.length;
        const totalPages = Math.ceil(totalFiltered / pagination.limit);

        setPagination((prev) => ({
          ...prev,
          total: totalFiltered,
          totalPages: totalPages,
          page: 1,
        }));

        setSearchLoading(false);
      } else {
        await loadPayments(true);
      }
    },
    [
      allPayments,
      filters,
      applyClientSideFilters,
      pagination.limit,
      loadPayments,
    ]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (allPayments.length > 0) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      } else {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [allPayments.length]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    clearPaymentsCache();
    setSearchQuery("");
    previousFiltersRef.current = null;
    loadPayments();
    toast.info("Payments cache cleared and refreshing...");
  }, [clearPaymentsCache, loadPayments]);

  const handlePaymentCreated = useCallback(() => {
    clearPaymentsCache();
    setSearchQuery("");
    previousFiltersRef.current = null;
    loadPayments();
    toast.success("Payment created successfully. Cache cleared.");
  }, [clearPaymentsCache, loadPayments]);

  // Get paginated payments for display
  const getPaginatedPayments = useCallback(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginated = filteredPayments.slice(startIndex, endIndex);

    return paginated;
  }, [filteredPayments, pagination.page, pagination.limit]);

  // Apply client-side filters whenever filters or search query change
  useEffect(() => {
    if (allPayments.length > 0) {
      const clientFiltered = applyClientSideFilters(
        allPayments,
        filters,
        searchQuery
      );
      setFilteredPayments(clientFiltered);

      // Update pagination based on filtered results
      const totalPages = Math.ceil(clientFiltered.length / pagination.limit);

      setPagination((prev) => ({
        ...prev,
        total: clientFiltered.length,
        totalPages: totalPages,
        page: 1,
      }));
    }
  }, [
    filters,
    searchQuery,
    allPayments,
    applyClientSideFilters,
    pagination.limit,
  ]);

  // Main useEffect for loading payments
  useEffect(() => {
    const shouldLoad =
      isInitialLoadRef.current ||
      JSON.stringify(previousFiltersRef.current) !==
        JSON.stringify(debouncedFilters);

    if (shouldLoad) {
      loadPayments();
    }
  }, [debouncedFilters, loadPayments]);

  return {
    payments: getPaginatedPayments(),
    allPayments,
    filteredPayments,
    loading,
    refreshing,
    searchLoading,
    cacheStatus,
    loadTime,
    progress,
    filters,
    setFilters,
    pagination,
    searchQuery,
    admin,
    hasPermission: hasPermission || false,
    handleSearch,
    handlePageChange,
    handleRefresh,
    handlePaymentCreated,
  };
};
