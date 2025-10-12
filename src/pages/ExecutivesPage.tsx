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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Executive Management
        </h1>
        <p className="text-gray-600">
          Manage students with special payment privileges
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">👑</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Executives
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Scope Breakdown */}
        {Object.entries(stats.byScope).map(([scope, count]) => (
          <div key={scope} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 capitalize">
                  {scope.replace("_", " ")}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Executive Form */}
      <AddExecutiveForm onExecutiveAdded={loadExecutives} />

      {/* Executive Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Executive List ({executives.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {canManageExecutives
              ? "Manage executive students and their privileges"
              : "View executive students with special payment privileges"}
          </p>
        </div>

        <div className="p-6">
          <ExecutiveTable
            executives={executives}
            loading={loading}
            onExecutiveUpdate={loadExecutives}
          />
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          About Executive Privileges
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Executives receive special payment rates and privileges</li>
          <li>• Scope determines where executive privileges apply</li>
          <li>
            • Only Super Admins and authorized admins can manage executives
          </li>
          <li>• Executive status is checked during payment processing</li>
        </ul>
      </div>
    </div>
  );
};
