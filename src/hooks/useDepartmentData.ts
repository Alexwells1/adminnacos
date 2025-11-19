import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { dashboardService, paymentService } from "@/services/admin.service";
import type {
  DashboardStats,
  Payment,
  FinancialStats,
} from "@/types/admin.types";
import { AuthContext } from "@/contexts/AuthContext";
import { useDepartmentCache } from "./useDepartmentCache";

export const useDepartmentData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [cacheAvailable, setCacheAvailable] = useState(true);

  const authContext = useContext(AuthContext);
  const user = authContext?.admin;
  const departmentName = user?.department;

  const {
    CACHE_KEYS,
    isCacheValid,
    getFromCache,
    saveToCache,
    clearDepartmentCache,
    optimizeDataForCaching,
  } = useDepartmentCache();

  const getCacheKeys = () => {
    if (!departmentName) return null;
    return {
      stats: CACHE_KEYS.DASHBOARD_STATS(departmentName),
      financial: CACHE_KEYS.FINANCIAL_STATS(departmentName),
      payments: CACHE_KEYS.RECENT_PAYMENTS(departmentName),
      lastUpdated: CACHE_KEYS.LAST_UPDATED(departmentName),
    };
  };

  const getDepartmentAccountKey = (): keyof FinancialStats["accounts"] => {
    if (!user?.department) return "dept_comssa";

    const departmentMap: { [key: string]: keyof FinancialStats["accounts"] } = {
      "Computer Science": "dept_comssa",
      "ICT & Information Technology": "dept_icitsa",
      "Cybersecurity & Data Science": "dept_cydasa",
      "Software Engr & Information Systems": "dept_senifsa",
    };

    return departmentMap[user.department] || "dept_comssa";
  };

  const getDepartmentDisplayName = (): string => {
    const departmentNames: { [key: string]: string } = {
      "Computer Science": "Computer Science (COMSSA)",
      "ICT & Information Technology": "Information Technology (ICITSA)",
      "Cybersecurity & Data Science": "Cyber Security (CYDASA)",
      "Software Engr & Information Systems": "Software Engineering (SENIFSA)",
    };
    return (
      departmentNames[user?.department || "Computer Science"] ||
      user?.department ||
      "Department"
    );
  };

  const calculateDepartmentData = (
    financialData: FinancialStats,
    allPayments: Payment[]
  ): DashboardStats => {
    const accountKey = getDepartmentAccountKey();
    const departmentAccount = financialData.accounts[accountKey];
    const departmentName = user?.department;

    const departmentPayments = allPayments.filter(
      (payment) =>
        payment.department === departmentName && payment.type === "departmental"
    );

    const levelBreakdown = departmentPayments.reduce((acc, payment) => {
      const level = payment.level;
      if (!acc[level]) {
        acc[level] = { count: 0, revenue: 0 };
      }
      acc[level].count += 1;
      acc[level].revenue += payment.amount;
      return acc;
    }, {} as { [key: string]: { count: number; revenue: number } });

    const levelWiseDept = Object.entries(levelBreakdown).map(
      ([level, data]) => ({
        _id: level,
        revenue: data.revenue,
        count: data.count,
      })
    );

    const recentDeptPayments = departmentPayments
      .sort(
        (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      )
      .slice(0, 10);

  return {
    totalPayments: departmentPayments.length,
    totalRevenue: departmentAccount?.totalRevenue || 0,
    totalDeptPayments: departmentPayments.length,
    totalDeptRevenue: departmentAccount?.totalRevenue || 0,
    levelWiseDept,
    recentDeptPayments,
    departmentStudents: departmentPayments,
    department: user?.department,
    financialStats: financialData,
    executivePaymentsSkipped: financialData.executivePaymentsSkipped || 0,
    grossTotalRevenue: financialData.grossTotalRevenue || 0,
  };

  };

  const loadDashboardData = async (forceRefresh = false) => {
    if (!departmentName) {
      toast.error("No department assigned to your account");
      return;
    }

    const cacheKeys = getCacheKeys();
    if (!cacheKeys) return;

    try {
      if (!forceRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      if (!forceRefresh && cacheAvailable && isCacheValid(cacheKeys.stats)) {
        const cachedStats = getFromCache<DashboardStats>(cacheKeys.stats);
        const cachedFinancial = getFromCache<FinancialStats>(
          cacheKeys.financial
        );
        const cachedPayments =
          getFromCache<Payment[]>(cacheKeys.payments) || [];
        const cachedLastUpdated = getFromCache<string>(cacheKeys.lastUpdated);

        if (cachedStats && cachedFinancial && cachedPayments) {
          setStats(cachedStats);
          setRecentPayments(cachedPayments);
          setLastUpdated(cachedLastUpdated || new Date().toLocaleTimeString());

          if (!forceRefresh) {
            setLoading(false);
            setIsRefreshing(false);

            if (!isCacheValid(cacheKeys.stats)) {
              setTimeout(() => loadDashboardData(true), 1000);
            }
            return;
          }
        }
      }

      const [allPaymentsResponse, freshFinancialData] = await Promise.all([
        paymentService.getPayments({
          type: "departmental",
          department: departmentName,
          limit: 1000,
        }),
        dashboardService.getFinancialStats(),
      ]);

      const allPayments = allPaymentsResponse.payments || [];

      const calculatedStats = calculateDepartmentData(
        freshFinancialData,
        allPayments
      );

      const recentPaymentsResponse = await paymentService.getPayments({
        page: 1,
        limit: 10,
        sort: "newest",
        type: "departmental",
        department: departmentName,
      });

      setStats(calculatedStats);
      setRecentPayments(recentPaymentsResponse.payments || []);

      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);

      if (cacheAvailable) {
        const optimizedStats = optimizeDataForCaching(calculatedStats);
        const optimizedFinancial = optimizeDataForCaching(freshFinancialData);
        const optimizedPayments = optimizeDataForCaching(
          recentPaymentsResponse.payments || []
        );

        const savedStats = saveToCache(cacheKeys.stats, optimizedStats);
        const savedFinancial = saveToCache(
          cacheKeys.financial,
          optimizedFinancial
        );
        const savedPayments = saveToCache(
          cacheKeys.payments,
          optimizedPayments
        );
        const savedLastUpdated = saveToCache(
          cacheKeys.lastUpdated,
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
        toast.success("Department data refreshed successfully");
      }
    } catch (error) {
      const errorMessage = "Failed to load department data";
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
    if (departmentName) {
      clearDepartmentCache(departmentName);
    }
    setCacheAvailable(true);
    loadDashboardData(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, [departmentName]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && !isRefreshing && stats) {
        const cacheKeys = getCacheKeys();
        if (cacheKeys && !isCacheValid(cacheKeys.stats)) {
          loadDashboardData(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loading, isRefreshing, stats, departmentName]);

  return {
    stats,
    recentPayments,
    loading,
    isRefreshing,
    lastUpdated,
    cacheAvailable,
    departmentName,
    getDepartmentDisplayName,
    getDepartmentAccountKey,
    isCacheValid: () => {
      const cacheKeys = getCacheKeys();
      return cacheKeys ? isCacheValid(cacheKeys.stats) : false;
    },
    loadDashboardData,
    handleManualRefresh,
  };
};