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
      <div className="flex justify-center items-center min-h-32 sm:min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Executive
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matric Number
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added Date
              </th>
              {canManageExecutives && (
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {executives.map((executive) => (
              <tr
                key={executive._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {executive.fullName || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border">
                    {executive.matricNumber}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                    {executive.scope.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(executive.createdAt).toLocaleDateString()}
                </td>
                {canManageExecutives && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(executive)}
                      className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200"
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

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {executives.map((executive) => (
          <div
            key={executive._id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="space-y-3">
              {/* Executive Info */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {executive.fullName || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border mt-1">
                  {executive.matricNumber}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Scope:</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                      {executive.scope.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Added:</span>
                  <div className="font-medium mt-1">
                    {new Date(executive.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canManageExecutives && (
                <div className="pt-2">
                  <button
                    onClick={() => handleDelete(executive)}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    Remove Executive
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {executives.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-base sm:text-lg">
            No executives found
          </div>
          <div className="text-gray-500 mt-1 sm:mt-2 text-sm">
            Add executives to grant special payment privileges
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedExecutive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Remove Executive
              </h3>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-gray-700 text-sm sm:text-base">
                Are you sure you want to remove{" "}
                <strong>
                  {selectedExecutive.fullName || selectedExecutive.matricNumber}
                </strong>{" "}
                ({selectedExecutive.matricNumber}) from executives?
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">
                This will revoke their executive payment privileges.
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedExecutive(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading === "delete"}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors order-1 sm:order-2"
                >
                  {actionLoading === "delete" ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Removing...
                    </span>
                  ) : (
                    "Remove Executive"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
