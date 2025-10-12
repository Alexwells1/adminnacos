// src/pages/AdminManagementPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import { adminManagementService } from "../../services/admin.service";
import type { Admin } from "../../types/admin.types";
import { AdminTable } from "./AdminTable";
import { RegisterAdminForm } from "./RegisterAdminForm";

export const AdminManagementPage: React.FC = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    byRole: {} as Record<string, number>,
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminManagementService.getAllAdmins();
      setAdmins(data);

      // Calculate stats
      const roleCounts: Record<string, number> = {};
      let activeCount = 0;

      data.forEach((admin) => {
        roleCounts[admin.role] = (roleCounts[admin.role] || 0) + 1;
        if (admin.isActive) activeCount++;
      });

      setStats({
        total: data.length,
        active: activeCount,
        byRole: roleCounts,
      });
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only super admins can access this page
  if (currentAdmin?.role !== "super_admin") {
    return (
      <div className="flex items-center justify-center min-h-64 sm:min-h-72 p-4">
        <div className="text-center max-w-md">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Access Denied
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            Only super administrators can access admin management.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          Admin Management
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Manage administrator accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Admins */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  👥
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Total Admins
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  ✅
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Active Admins
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        {/* Role Breakdown */}
        {Object.entries(stats.byRole).map(([role, count]) => (
          <div
            key={role}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-semibold">
                    🎯
                  </span>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate capitalize">
                  {role.replace("_", " ")}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                  {count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Admin Form */}
      <RegisterAdminForm onAdminRegistered={loadAdmins} />

      {/* Admin Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Administrator Accounts ({admins.length})
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage all administrator accounts, roles, and permissions
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <AdminTable
            admins={admins}
            loading={loading}
            onAdminUpdate={loadAdmins}
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-2 sm:mb-3">
          Admin Roles & Permissions
        </h3>
        <div className="text-xs sm:text-sm text-blue-700 space-y-2 sm:space-y-3">
          <div className="flex items-start">
            <span className="font-semibold min-w-20 sm:min-w-24">
              Super Admin:
            </span>
            <span className="flex-1 ml-2">
              Full system access, can manage all admins
            </span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold min-w-20 sm:min-w-24">
              College Admin:
            </span>
            <span className="flex-1 ml-2">
              Manages college-wide payments and view college analytics
            </span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold min-w-20 sm:min-w-24">
              Department Admin:
            </span>
            <span className="flex-1 ml-2">
              Manages departmental payments for their assigned department
            </span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold min-w-20 sm:min-w-24">
              General Admin:
            </span>
            <span className="flex-1 ml-2">
              Basic access to view payments and exports (customizable
              permissions)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
