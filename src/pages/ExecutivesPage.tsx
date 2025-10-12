// src/pages/ExecutivesPage.tsx
import React, { useState, useEffect } from "react";
import { executiveService } from "../services/admin.service";
import { AddExecutiveForm } from "../components/executives/AddExecutiveForm";
import { ExecutiveTable } from "../components/executives/ExecutiveTable";
import { useAuth } from "../contexts/useAuth";
import type { Executive } from "../types/admin.types";

export const ExecutivesPage: React.FC = () => {
  const { hasPermission, isRole } = useAuth();
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byScope: {} as Record<string, number>,
  });

  const canManageExecutives =
    isRole("super_admin") || hasPermission("canManageAdmins");

  useEffect(() => {
    loadExecutives();
  }, []);

  const loadExecutives = async () => {
    setLoading(true);
    try {
      const data = await executiveService.listExecutives();
      setExecutives(data);

      // Calculate stats
      const scopeCounts: Record<string, number> = {};
      data.forEach((exec) => {
        scopeCounts[exec.scope] = (scopeCounts[exec.scope] || 0) + 1;
      });

      setStats({
        total: data.length,
        byScope: scopeCounts,
      });
    } catch (error) {
      console.error("Failed to load executives:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          Executive Management
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Manage students with special payment privileges
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Executives Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">
                  👑
                </span>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                Total Executives
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Scope Breakdown Cards */}
        {Object.entries(stats.byScope).map(([scope, count]) => (
          <div
            key={scope}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-semibold">
                    🎯
                  </span>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate capitalize">
                  {scope.replace("_", " ")}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                  {count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Executive Form */}
      <AddExecutiveForm onExecutiveAdded={loadExecutives} />

      {/* Executive Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Executive List ({executives.length})
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {canManageExecutives
              ? "Manage executive students and their privileges"
              : "View executive students with special payment privileges"}
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <ExecutiveTable
            executives={executives}
            loading={loading}
            onExecutiveUpdate={loadExecutives}
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-2 sm:mb-3">
          About Executive Privileges
        </h3>
        <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Executives receive special payment rates and privileges
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Scope determines where executive privileges apply
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Only Super Admins and authorized admins can manage executives
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Executive status is checked during payment processing
          </li>
        </ul>
      </div>
    </div>
  );
};
