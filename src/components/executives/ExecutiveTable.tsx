// src/components/Executives/ExecutiveTable.tsx
import React, { useState } from "react";

import { executiveService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";
import type { Executive } from "../../types/admin.types";


interface ExecutiveTableProps {
  executives: Executive[];
  loading: boolean;
  onExecutiveUpdate: () => void;
}

export const ExecutiveTable: React.FC<ExecutiveTableProps> = ({
  executives,
  loading,
  onExecutiveUpdate,
}) => {
  const { hasPermission, isRole } = useAuth();
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canManageExecutives =
    isRole("super_admin") || hasPermission("canManageAdmins");

  const handleDelete = (executive: Executive) => {
    setSelectedExecutive(executive);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExecutive) return;

    setActionLoading("delete");
    try {
      await executiveService.removeExecutive(selectedExecutive.matricNumber);
      setShowDeleteModal(false);
      setSelectedExecutive(null);
      onExecutiveUpdate();
    } catch (error: any) {
      console.error("Failed to delete executive:", error);
      alert(error.response?.data?.message || "Failed to delete executive");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Executive
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matric Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added Date
              </th>
              {canManageExecutives && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {executives.map((executive) => (
              <tr key={executive._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {executive.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {executive.matricNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {executive.scope}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(executive.createdAt).toLocaleDateString()}
                </td>
                {canManageExecutives && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(executive)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {executives.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No executives found</div>
          <div className="text-gray-500 mt-2">
            Add executives to grant special payment privileges
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedExecutive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Remove Executive
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to remove{" "}
                <strong>{selectedExecutive.fullName}</strong> (
                {selectedExecutive.matricNumber}) from executives?
              </p>
              <p className="text-gray-600 text-sm mt-2">
                This will revoke their executive payment privileges.
              </p>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedExecutive(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading === "delete"}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === "delete"
                    ? "Removing..."
                    : "Remove Executive"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
