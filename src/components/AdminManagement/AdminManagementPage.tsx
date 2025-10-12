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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </div>
          <div className="text-gray-600">
            Only super administrators can access admin management.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        <p className="text-gray-600">
          Manage administrator accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        {/* Role Breakdown */}
        {Object.entries(stats.byRole).map(([role, count]) => (
          <div key={role} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 capitalize">
                  {role.replace("_", " ")}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Admin Form */}
      <RegisterAdminForm onAdminRegistered={loadAdmins} />

      {/* Admin Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Administrator Accounts ({admins.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all administrator accounts, roles, and permissions
          </p>
        </div>

        <div className="p-6">
          <AdminTable
            admins={admins}
            loading={loading}
            onAdminUpdate={loadAdmins}
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Admin Roles & Permissions
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div>
            <strong>Super Admin:</strong> Full system access, can manage all
            admins
          </div>
          <div>
            <strong>College Admin:</strong> Manages college-wide payments and
            view college analytics
          </div>
          <div>
            <strong>Department Admin:</strong> Manages departmental payments for
            their assigned department
          </div>
          <div>
            <strong>General Admin:</strong> Basic access to view payments and
            exports (customizable permissions)
          </div>
        </div>
      </div>
    </div>
  );
};
