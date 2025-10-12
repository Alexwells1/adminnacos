// Update src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { dashboardService, paymentService } from "../services/admin.service";
import { StatsCharts } from "../components/Dashboard/StatsCharts";
import { RecentActivity } from "../components/Dashboard/RecentActivity";
import { useAuth } from "../contexts/useAuth";
import type { DashboardStats, Payment } from "../types/admin.types";

export const AdminDashboard: React.FC = () => {
  const { admin, isRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setChartsLoading(true);

      // Load dashboard stats based on role
      let statsData;
      if (isRole("super_admin")) {
        statsData = await dashboardService.getSuperAdminStats();
      } else if (isRole("college_admin")) {
        statsData = await dashboardService.getCollegeAdminStats();
      } else if (isRole("dept_admin")) {
        statsData = await dashboardService.getDepartmentalAdminStats();
      } else {
        statsData = await dashboardService.getCollegeAdminStats();
      }

      setStats(statsData);

      // Load recent payments
      const paymentsResponse = await paymentService.getPayments({
        page: "1",
        limit: "8",
        sort: "newest",
      });
      setRecentPayments(paymentsResponse.payments);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setChartsLoading(false);
    }
  };

  const getDashboardTitle = () => {
    if (isRole("super_admin")) return "Super Admin Dashboard";
    if (isRole("college_admin")) return "College Payments Dashboard";
    if (isRole("dept_admin"))
      return `${admin?.department} Department Dashboard`;
    return "Admin Dashboard";
  };

  const getTotalPayments = () => {
    return (
      stats?.totalPayments ||
      stats?.totalCollegePayments ||
      stats?.totalDeptPayments ||
      0
    );
  };

  const getTotalRevenue = () => {
    return (
      stats?.totalRevenue ||
      stats?.totalCollegeRevenue ||
      stats?.totalDeptRevenue ||
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 sm:min-h-72 lg:min-h-80">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {getDashboardTitle()}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Welcome back, {admin?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
        {/* Total Payments */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  💰
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Total Payments
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {getTotalPayments().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  ₦
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Total Revenue
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                ₦{getTotalRevenue().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Average Payment */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  📊
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Average Payment
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                ₦
                {getTotalPayments() > 0
                  ? Math.round(
                      getTotalRevenue() / getTotalPayments()
                    ).toLocaleString()
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Executive Payments */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  👑
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Executive Payments
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {stats?.executiveVsRegular?.find((d) => d._id === true)
                  ?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {!chartsLoading && stats && <StatsCharts stats={stats} />}

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <RecentActivity payments={recentPayments} loading={loading} />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <button
                onClick={() => (window.location.href = "/admin/payments")}
                className="w-full text-left p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="font-medium text-blue-900 text-sm sm:text-base">
                  View All Payments
                </div>
                <div className="text-xs sm:text-sm text-blue-700 mt-1">
                  Browse and manage payment records
                </div>
              </button>

              <button
                onClick={() =>
                  (window.location.href = "/admin/payments?create=true")
                }
                className="w-full text-left p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="font-medium text-green-900 text-sm sm:text-base">
                  Create Manual Payment
                </div>
                <div className="text-xs sm:text-sm text-green-700 mt-1">
                  Record a payment manually
                </div>
              </button>

              {isRole("super_admin") && (
                <button
                  onClick={() => (window.location.href = "/admin/management")}
                  className="w-full text-left p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="font-medium text-purple-900 text-sm sm:text-base">
                    Manage Admins
                  </div>
                  <div className="text-xs sm:text-sm text-purple-700 mt-1">
                    Admin account management
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                System Status
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">
                  API Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">
                  Database
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">
                  Last Sync
                </span>
                <span className="text-xs sm:text-sm text-gray-900">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
