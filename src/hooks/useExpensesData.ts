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
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cacheAvailable, setCacheAvailable] = useState(true);

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

  // Permission checks
  const canCreate = isRole([
    "super_admin",
    "director_finance",
    "college_admin",
    "dept_admin",
  ]);

  const canManage = isRole([
    "super_admin",
    "director_finance",
    "college_admin",
    "dept_admin",
  ]);

  const canViewAll = isRole(["super_admin", "director_finance"]);

  // Role-based expense filtering
  // In your useExpensesData hook, update the getFilteredExpenses function:
  const getFilteredExpenses = useCallback(
    (expensesList: Expense[]) => {
      if (canViewAll) {
        return expensesList;
      } else if (isRole("college_admin")) {
        return expensesList.filter(
          (expense) =>
            expense.type === "college" || expense.account === "college_general"
        );
      } else if (isRole("dept_admin") && admin?.department) {
        // Map admin department to expense department code
        const departmentMap = {
          "Computer Science": "COMSSA",
          "ICT & Information Technology": "ICITSA",
          "Cybersecurity & Data Science": "CYDASA",
          "Software Engr & Information Systems": "SENIFSA",
        } as const;

        const userDept =
          departmentMap[admin.department as keyof typeof departmentMap];
        return expensesList.filter(
          (expense) =>
            expense.type === "departmental" && expense.department === userDept
        );
      }
      return [];
    },
    [canViewAll, isRole, admin?.department]
  );

  const loadExpenses = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);

        const currentPage = filters.page || 1;
        const currentLimit = filters.limit || 10;

        const filtersKey = JSON.stringify({
          page: currentPage,
          limit: currentLimit,
          department: filters.department,
          adminRole: admin?.role,
          adminDepartment: admin?.department,
        });
        const cacheKey = CACHE_KEYS.EXPENSES(
          currentPage,
          currentLimit,
          filtersKey
        );

        // Check cache first (unless force refresh)
        if (!forceRefresh && cacheAvailable && isCacheValid(cacheKey)) {
          const cachedData = getFromCache<{
            expenses: Expense[];
            pagination: any;
            filteredExpenses: Expense[];
          }>(cacheKey);

          if (cachedData) {
            setExpenses(cachedData.expenses);
            setPagination(cachedData.pagination);
            setLoading(false);
            return;
          }
        }

        const response = await financialService.getExpenses(
          currentPage,
          currentLimit
        );

        // Apply role-based filtering
        const filteredExpenses = getFilteredExpenses(response.expenses || []);
        setExpenses(filteredExpenses);

        const paginationData = {
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: filteredExpenses.length,
          totalPages: Math.ceil(filteredExpenses.length / currentLimit),
        };
        setPagination(paginationData);

        // Try to save to cache with optimized data
        if (cacheAvailable) {
          const optimizedExpenses = optimizeDataForCaching(
            response.expenses || []
          );
          const cacheData = {
            expenses: optimizedExpenses,
            pagination: paginationData,
            filteredExpenses: optimizeDataForCaching(filteredExpenses),
          };

          const saved = saveToCache(cacheKey, cacheData);
          if (!saved) {
            setCacheAvailable(false);
          }
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to load expenses";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      filters.page,
      filters.limit,
      filters.department,
      getFilteredExpenses,
      admin?.role,
      admin?.department,
      cacheAvailable,
    ]
  );

  const handleCreateExpense = async (data: CreateExpenseData) => {
    try {
      setCreating(true);
      await financialService.createExpense(data);
      clearExpensesCache();
      await loadExpenses(true);
      toast.success("Expense created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create expense";
      toast.error(errorMessage);
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setDeleting(id);
      await financialService.deleteExpense(id);
      clearExpensesCache();
      await loadExpenses(true);
      toast.success("Expense deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete expense";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleRefresh = () => {
    setSearchTerm("");
    clearExpensesCache();
    setCacheAvailable(true);
    loadExpenses(true);
    toast.info("Cache cleared and data refreshed");
  };

  // Apply search filter on top of role-based filtering
  const searchFilteredExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.createdBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [expenses, searchTerm]
  );

  // Calculate totals based on visible expenses
  const stats = useMemo(() => {
    const totalAmount = searchFilteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const collegeExpenses = searchFilteredExpenses.filter(
      (e) => e.type === "college"
    );
    const departmentalExpenses = searchFilteredExpenses.filter(
      (e) => e.type === "departmental"
    );
    const maintenanceExpenses = searchFilteredExpenses.filter(
      (e) => e.paymentMethod === "maintenance_balance"
    );

    return {
      totalAmount,
      collegeExpenses,
      departmentalExpenses,
      maintenanceExpenses,
      totalCount: searchFilteredExpenses.length,
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
    cacheAvailable,
    canCreate,
    canManage,
    canViewAll,
    admin,
    stats,
    handleCreateExpense,
    handleDeleteExpense,
    handlePageChange,
    handleFilterChange,
    handleRefresh,
    loadExpenses,
  };
};
