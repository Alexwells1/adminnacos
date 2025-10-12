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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {getDashboardTitle()}
        </h1>
        <p className="text-gray-600">Welcome back, {admin?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Payments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Payments
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {getTotalPayments().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">₦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₦{getTotalRevenue().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Average Payment */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Average Payment
              </p>
              <p className="text-2xl font-semibold text-gray-900">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">👑</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Executive Payments
              </p>
              <p className="text-2xl font-semibold text-gray-900">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity payments={recentPayments} loading={loading} />
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => (window.location.href = "/admin/payments")}
                className="w-full text-left px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">
                  View All Payments
                </div>
                <div className="text-sm text-blue-700">
                  Browse and manage payment records
                </div>
              </button>

              <button
                onClick={() =>
                  (window.location.href = "/admin/payments?create=true")
                }
                className="w-full text-left px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="font-medium text-green-900">
                  Create Manual Payment
                </div>
                <div className="text-sm text-green-700">
                  Record a payment manually
                </div>
              </button>

              {isRole("super_admin") && (
                <button
                  onClick={() => (window.location.href = "/admin/management")}
                  className="w-full text-left px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="font-medium text-purple-900">
                    Manage Admins
                  </div>
                  <div className="text-sm text-purple-700">
                    Admin account management
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                System Status
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm text-gray-900">
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
