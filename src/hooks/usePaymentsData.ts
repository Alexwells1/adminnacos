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
  const { saveToCache, clearPaymentsCache } = usePaymentsCache(); // FIX: Remove unused CACHE_KEYS and getFromCache

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

    // This is OK because it's inside useState initializer
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
  // FIX: Remove unused debouncedSearchQuery variable
  useDebounce(searchQuery, 300); // This is used but we don't need to store the result

  // Apply client-side filters - useCallback at top level
  const applyClientSideFilters = useCallback(
    (
      payments: Payment[],
      currentFilters: any,
      currentSearchQuery: string = ""
    ) => {
      console.log(
        "🔍 Applying client-side filters to",
        payments.length,
        "payments"
      );
      console.log("📋 Current filters:", currentFilters);
      console.log("🔎 Search query:", currentSearchQuery);

      let filtered = [...payments];

      // Apply search first if there's a query
      if (currentSearchQuery.trim()) {
        console.log("🔍 Applying search filter:", currentSearchQuery);
        const beforeSearch = filtered.length;
        filtered = searchPayments(filtered, currentSearchQuery);
        console.log(
          "🔍 Search filter result:",
          beforeSearch,
          "->",
          filtered.length,
          "payments"
        );
      }

      // Level filter - client side
      if (currentFilters.level !== "all") {
        console.log("🎚️ Filtering by level:", currentFilters.level);
        const beforeLevel = filtered.length;
        filtered = filterPaymentsByLevel(filtered, currentFilters.level);
        console.log(
          "🎚️ Level filter result:",
          beforeLevel,
          "->",
          filtered.length,
          "payments"
        );
      }

      // Type filter
      if (currentFilters.type !== "all") {
        console.log("💰 Filtering by type:", currentFilters.type);
        const beforeType = filtered.length;
        filtered = filtered.filter(
          (payment) => payment.type === currentFilters.type
        );
        console.log(
          "💰 Type filter result:",
          beforeType,
          "->",
          filtered.length,
          "payments"
        );
      }

      // Department filter
      if (currentFilters.department !== "all") {
        console.log("🏢 Filtering by department:", currentFilters.department);
        const beforeDept = filtered.length;
        filtered = filtered.filter(
          (payment) => payment.department === currentFilters.department
        );
        console.log(
          "🏢 Department filter result:",
          beforeDept,
          "->",
          filtered.length,
          "payments"
        );
      }

      // Date range filter
      if (currentFilters.startDate) {
        console.log("📅 Filtering by start date:", currentFilters.startDate);
        const beforeStartDate = filtered.length;
        const startDate = new Date(currentFilters.startDate);
        filtered = filtered.filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return paymentDate >= startDate;
        });
        console.log(
          "📅 Start date filter result:",
          beforeStartDate,
          "->",
          filtered.length,
          "payments"
        );
      }

      if (currentFilters.endDate) {
        console.log("📅 Filtering by end date:", currentFilters.endDate);
        const beforeEndDate = filtered.length;
        const endDate = new Date(currentFilters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return paymentDate <= endDate;
        });
        console.log(
          "📅 End date filter result:",
          beforeEndDate,
          "->",
          filtered.length,
          "payments"
        );
      }

      // Sort
      if (currentFilters.sort === "newest") {
        console.log("🔄 Sorting by newest");
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (currentFilters.sort === "oldest") {
        console.log("🔄 Sorting by oldest");
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (currentFilters.sort === "amount") {
        console.log("🔄 Sorting by amount");
        filtered.sort((a, b) => b.amount - a.amount);
      }

      console.log("✅ Final filtered result:", filtered.length, "payments");
      return filtered;
    },
    []
  );

  // FIX: Remove unused safeSaveToCache function since it's declared but never used
  /*
  const safeSaveToCache = useCallback(
    (key: string, data: any) => {
      try {
        saveToCache(key, data);
      } catch (error) {
        console.warn("Cache quota exceeded, clearing and retrying...");
        try {
          // Clear some cache and try again
          clearPaymentsCache();
          saveToCache(key, data);
        } catch (retryError) {
          console.error(
            "Failed to save to cache even after clearing:",
            retryError
          );
        }
      }
    },
    [saveToCache, clearPaymentsCache]
  );
  */

  // Function to fetch ALL payments from API (multiple pages if needed)
  const fetchAllPayments = useCallback(
    async (params: any): Promise<Payment[]> => {
      console.log("🌐 Starting to fetch ALL payments");
      const allPayments: Payment[] = [];
      let currentPage = 1;
      let hasMorePages = true; // This is boolean
      const limit = 100; // Fetch 100 per page to get all data efficiently

      while (hasMorePages) {
        try {
          console.log(`📡 Fetching page ${currentPage} with limit ${limit}`);
          const response = await paymentService.getPayments({
            ...params,
            page: currentPage.toString(),
            limit: limit.toString(),
          });

          console.log(`📥 Page ${currentPage} response:`, {
            paymentsCount: response.payments?.length || 0,
            pagination: response.pagination,
          });

          if (response.payments && response.payments.length > 0) {
            allPayments.push(...response.payments);
          }

          // Check if there are more pages
          if (response.pagination) {
            const totalPages = response.pagination.totalPages || 0;
            hasMorePages = currentPage < totalPages;
            console.log(
              `📄 Page ${currentPage}/${totalPages}, hasMore: ${hasMorePages}`
            );
          } else {
            // FIX: Ensure we return only boolean, not boolean | undefined
            hasMorePages = Boolean(
              response.payments && response.payments.length === limit
            );
            console.log(`📄 No pagination info, hasMore: ${hasMorePages}`);
          }

          currentPage++;

          // Safety check to prevent infinite loops
          if (currentPage > 50) {
            console.warn("⚠️ Safety break: too many pages fetched");
            break;
          }
        } catch (error) {
          console.error(`❌ Failed to fetch page ${currentPage}:`, error);
          break;
        }
      }

      console.log("✅ Finished fetching ALL payments:", {
        totalFetched: allPayments.length,
        pagesFetched: currentPage - 1,
      });

      return allPayments;
    },
    []
  );

  const loadPayments = useCallback(
    async (isSearch = false, targetPage?: number) => {
      const pageToLoad = targetPage || pagination.page;
      const startTime = performance.now();

      console.log("🚀 loadPayments called with:", {
        isSearch,
        targetPage,
        pageToLoad,
        filters,
        searchQuery,
      });

      if (!isSearch) {
        setLoading(true);
      }

      console.log("🔄 Fetching fresh data from API");
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

        console.log("📡 API call params:", params);

        // Only fetch ALL payments if we don't have them already or filters changed
        if (
          allPayments.length === 0 ||
          JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters)
        ) {
          console.log(
            "🎯 Fetching ALL payments for complete client-side filtering"
          );
          paymentsData = await fetchAllPayments(params);
          previousFiltersRef.current = { ...filters }; // Update previous filters
        } else {
          console.log("📦 Using existing allPayments data");
          paymentsData = allPayments;
        }

        clearInterval(progressInterval);
        setProgress(100);

        const endTime = performance.now();
        const duration = endTime - startTime;
        setLoadTime(duration);

        console.log("📥 Final payments data:", {
          totalPayments: paymentsData.length,
        });

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
        console.log(
          "🎯 After client-side filtering:",
          clientFiltered.length,
          "payments"
        );
        setFilteredPayments(clientFiltered);

        // Update pagination based on filtered results
        const totalFiltered = clientFiltered.length;
        const totalPages = Math.ceil(totalFiltered / pagination.limit);

        console.log("📊 Pagination update:", {
          total: totalFiltered,
          totalPages: totalPages,
          currentPage: pageToLoad,
          limit: pagination.limit,
        });

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

        console.error("❌ Failed to load payments:", error);

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
      console.log("🔍 handleSearch called with:", query);
      setSearchLoading(true);
      setSearchQuery(query);

      // If search is cleared, reload payments
      if (!query.trim()) {
        console.log("🔍 Clearing search");
        setSearchQuery("");
        // We don't need to reload payments here - the useEffect will handle it
        setSearchLoading(false);
        return;
      }

      // For search, we don't need to reload from API if we already have data
      if (allPayments.length > 0) {
        console.log("🔍 Using existing data for search");
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
          page: 1, // Reset to first page when searching
        }));

        setSearchLoading(false);
      } else {
        // If no data available, trigger full load
        console.log("🔍 No data available, triggering full load with search");
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
      console.log("📄 handlePageChange called with:", newPage);

      // Only update pagination, don't trigger full reload if we have data
      if (allPayments.length > 0) {
        console.log("📄 Using existing data for page change");
        setPagination((prev) => ({ ...prev, page: newPage }));
      } else {
        console.log("📄 No data available, triggering full load");
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [allPayments.length]
  );

  const handleRefresh = useCallback(() => {
    console.log("🔄 handleRefresh called");
    setRefreshing(true);
    clearPaymentsCache();
    setSearchQuery("");
    previousFiltersRef.current = null; // Reset previous filters
    loadPayments();
    toast.info("Payments cache cleared and refreshing...");
  }, [clearPaymentsCache, loadPayments]);

  const handlePaymentCreated = useCallback(() => {
    console.log("💰 handlePaymentCreated called");
    clearPaymentsCache();
    setSearchQuery("");
    previousFiltersRef.current = null; // Reset previous filters
    loadPayments();
    toast.success("Payment created successfully. Cache cleared.");
  }, [clearPaymentsCache, loadPayments]);

  // Get paginated payments for display
  const getPaginatedPayments = useCallback(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginated = filteredPayments.slice(startIndex, endIndex);

    console.log("📄 getPaginatedPayments:", {
      totalFiltered: filteredPayments.length,
      page: pagination.page,
      limit: pagination.limit,
      startIndex,
      endIndex,
      paginatedCount: paginated.length,
    });

    return paginated;
  }, [filteredPayments, pagination.page, pagination.limit]);

  // Apply client-side filters whenever filters or search query change
  useEffect(() => {
    console.log("🎛️ Filters or search changed:", { filters, searchQuery });
    if (allPayments.length > 0) {
      console.log("🔄 Re-applying filters to", allPayments.length, "payments");
      const clientFiltered = applyClientSideFilters(
        allPayments,
        filters,
        searchQuery
      );
      setFilteredPayments(clientFiltered);

      // Update pagination based on filtered results
      const totalPages = Math.ceil(clientFiltered.length / pagination.limit);
      console.log(
        "📊 Filter update - total:",
        clientFiltered.length,
        "pages:",
        totalPages
      );

      setPagination((prev) => ({
        ...prev,
        total: clientFiltered.length,
        totalPages: totalPages,
        page: 1, // Reset to first page when filters or search change
      }));
    }
  }, [
    filters,
    searchQuery,
    allPayments,
    applyClientSideFilters,
    pagination.limit,
  ]);

  // Main useEffect for loading payments - FIXED to prevent infinite loops
  useEffect(() => {
    // Only load payments on initial load or when filters change
    // NOT when only pagination or search changes
    const shouldLoad =
      isInitialLoadRef.current ||
      JSON.stringify(previousFiltersRef.current) !==
        JSON.stringify(debouncedFilters);

    if (shouldLoad) {
      console.log("🔄 Main useEffect triggered - loading payments");
      loadPayments();
    } else {
      console.log(
        "🔄 Main useEffect triggered - skipping load (only search or pagination changed)"
      );
    }
  }, [debouncedFilters, loadPayments]);

  // Log state changes
  useEffect(() => {
    console.log("📊 State update:", {
      allPayments: allPayments.length,
      filteredPayments: filteredPayments.length,
      pagination,
      loading,
      searchQuery,
    });
  }, [
    allPayments.length,
    filteredPayments.length,
    pagination,
    loading,
    searchQuery,
  ]);

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
