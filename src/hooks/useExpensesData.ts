import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { financialService } from "@/services/admin.service";
import type {
  Expense,
  CreateExpenseData,
  ExpenseFilters,
} from "@/types/expense.types";
import { useExpensesCache } from "./useExpensesCache";
import { useAuth } from "@/contexts/useAuth";

export const useExpensesData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // GLOBAL TOTALS FROM BACKEND
  const [totals, setTotals] = useState({
    totalAmount: 0,
    collegeCount: 0,
    departmentalCount: 0,
    maintenanceCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [cacheAvailable, setCacheAvailable] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const { admin, isRole } = useAuth();
  const {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearExpensesCache,
    optimizeDataForCaching,
  } = useExpensesCache();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const canCreate = isRole([
    "super_admin",
    "director_finance",
    "college_admin",
    "dept_admin",
  ]);

  const canManage = canCreate;

  const canViewAll = isRole(["super_admin", "director_finance"]);

  // --------------------------------
  // LOAD EXPENSES + GLOBAL STATS
  // --------------------------------

  const loadExpenses = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);

        // ✅ Destructure all relevant fields at the start
        const {
          page: currentPage = 1,
          limit: currentLimit = 10,
          department,
        } = filters;

        const filtersKey = JSON.stringify({
          page: currentPage,
          limit: currentLimit,
          role: admin?.role,
          dept: admin?.department,
        });

        const cacheKey = CACHE_KEYS.EXPENSES(
          currentPage,
          currentLimit,
          filtersKey
        );

        if (!forceRefresh && cacheAvailable && isCacheValid(cacheKey)) {
          const cached = getFromCache<{
            expenses: Expense[];
            pagination: any;
            totals: any;
          }>(cacheKey);

          if (cached) {
            setExpenses(cached.expenses);
            setPagination(cached.pagination);
            setTotals(cached.totals);
            setLoading(false);
            return;
          }
        }

        // 🔹 Pass the department directly from destructured filters
        const response = await financialService.getExpenses(
          currentPage,
          currentLimit,
          searchTerm,
          department
        );

        setExpenses(response.expenses || []);
        setTotals(response.totals || totals);

        const paginationData = {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        };

        setPagination(paginationData);

        if (cacheAvailable) {
          const optimized = optimizeDataForCaching(response.expenses || []);
          const saved = saveToCache(cacheKey, {
            expenses: optimized,
            pagination: paginationData,
            totals: response.totals,
          });

          if (!saved) setCacheAvailable(false);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load expenses";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [filters, admin?.role, admin?.department, cacheAvailable, searchTerm]
  );

  // --------------------------------
  // CREATE EXPENSE
  // --------------------------------
  const handleCreateExpense = async (data: CreateExpenseData) => {
    try {
      setCreating(true);
      await financialService.createExpense(data);
      clearExpensesCache();
      await loadExpenses(true);
      toast.success("Expense created successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create expenses";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------
  // DELETE EXPENSE
  // --------------------------------
  const handleDeleteExpense = async (id: string) => {
    try {
      setDeleting(id);
      await financialService.deleteExpense(id);
      clearExpensesCache();
      await loadExpenses(true);
      toast.success("Expense deleted successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete expenses";
      toast.error(message);
    } finally {
      setDeleting(null);
    }
  };

  // --------------------------------
  // UPDATE EXPENSE
  // --------------------------------
  const handleUpdateExpense = async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      amount?: number;
    }
  ) => {
    try {
      setEditing(id);
      await financialService.updateExpense(id, updates);
      clearExpensesCache();
      await loadExpenses(true);
      toast.success("Expense updated successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update expense";
      toast.error(message);
    } finally {
      setEditing(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value, page: 1 };
      console.log("🚀 [handleFilterChange] updated:", updated);
      return updated;
    });
  };

  useEffect(() => {
    loadExpenses(true); // force refresh whenever filters change
  }, [filters]);

  const handleRefresh = () => {
    setSearchTerm("");
    clearExpensesCache();
    setCacheAvailable(true);
    loadExpenses(true);
    toast.info("Cache cleared & refreshed");
  };

  // --------------------------------
  // SEARCH (LOCAL)
  // --------------------------------
  const searchFilteredExpenses = expenses;

  useEffect(() => {
    // Reset to page 1 whenever the search term changes
    setFilters((prev) => ({ ...prev, page: 1 }));

    const handler = setTimeout(() => {
      loadExpenses(true); // force refresh
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --------------------------------
  // PAGE TOTALS (LOCAL ONLY)
  // --------------------------------
  const pageStats = useMemo(() => {
    const amount = searchFilteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      pageAmount: amount,
      pageCount: searchFilteredExpenses.length,
    };
  }, [searchFilteredExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses: searchFilteredExpenses,
    loading,
    creating,
    deleting,
    filters,
    searchTerm,
    setSearchTerm,
    pagination,
    totals, // GLOBAL totals (backend)
    pageStats,
    cacheAvailable,
    canCreate,
    canManage,
    canViewAll,
    admin,
    handleCreateExpense,
    handleDeleteExpense,
    handlePageChange,
    handleFilterChange,
    handleRefresh,
    loadExpenses,
    handleUpdateExpense,
    editing
  };
};
