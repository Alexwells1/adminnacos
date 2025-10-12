// src/components/AdminManagement/AdminTable.tsx
import React, { useState } from "react";

import { adminManagementService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";
import type { Admin } from "../../types/admin.types";


interface AdminTableProps {
  admins: Admin[];
  loading: boolean;
  onAdminUpdate: () => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  loading,
  onAdminUpdate,
}) => {
  const { admin: currentAdmin } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleToggleStatus = async (admin: Admin) => {
    setActionLoading(`toggle-${admin._id}`);
    try {
      await adminManagementService.toggleAdminStatus(admin._id);
      onAdminUpdate();
    } catch (error: any) {
      console.error("Failed to toggle admin status:", error);
      alert(error.response?.data?.message || "Failed to update admin status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (updates: any) => {
    if (!selectedAdmin) return;

    setActionLoading("update");
    try {
      await adminManagementService.updateAdmin(selectedAdmin._id, updates);
      setShowEditModal(false);
      setSelectedAdmin(null);
      onAdminUpdate();
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      alert(error.response?.data?.message || "Failed to update admin");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      super_admin: "bg-red-100 text-red-800",
      college_admin: "bg-blue-100 text-blue-800",
      dept_admin: "bg-green-100 text-green-800",
      general_admin: "bg-gray-100 text-gray-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (admin: Admin) => {
    if (!admin.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
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
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {admin.name}
                    </div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        admin.role
                      )}`}
                    >
                      {admin.role.replace("_", " ")}
                    </span>
                  </div>
                  {admin.department && (
                    <div className="text-sm text-gray-500 mt-1">
                      {admin.department}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(admin)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 space-y-1">
                    {admin.permissions.canViewPayments && (
                      <div>• View Payments</div>
                    )}
                    {admin.permissions.canExportData && (
                      <div>• Export Data</div>
                    )}
                    {admin.permissions.canManageAdmins && (
                      <div>• Manage Admins</div>
                    )}
                    {admin.permissions.canViewAnalytics && (
                      <div>• View Analytics</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {/* Edit Button - Only for super admin or self */}
                    {(currentAdmin?._id === admin._id ||
                      currentAdmin?.role === "super_admin") && (
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    )}

                    {/* Toggle Status - Only for super admin and not self */}
                    {currentAdmin?.role === "super_admin" &&
                      currentAdmin._id !== admin._id && (
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          disabled={actionLoading === `toggle-${admin._id}`}
                          className={`${
                            admin.isActive
                              ? "text-orange-600 hover:text-orange-900"
                              : "text-green-600 hover:text-green-900"
                          } disabled:opacity-50`}
                        >
                          {actionLoading === `toggle-${admin._id}`
                            ? "..."
                            : admin.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {admins.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No admins found</div>
          <div className="text-gray-500 mt-2">
            Register new admins to manage the system
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onSave={handleUpdateAdmin}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAdmin(null);
          }}
          loading={actionLoading === "update"}
        />
      )}
    </div>
  );
};

// Edit Admin Modal Component
const EditAdminModal: React.FC<{
  admin: Admin;
  onSave: (updates: any) => void;
  onClose: () => void;
  loading: boolean;
}> = ({ admin, onSave, onClose, loading }) => {
  const { admin: currentAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    role: admin.role,
    department: admin.department || "",
    permissions: { ...admin.permissions },
  });

  const isSuperAdmin = currentAdmin?.role === "super_admin";
  const isEditingSelf = currentAdmin?._id === admin._id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionChange = (
    permission: keyof typeof formData.permissions,
    value: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Admin</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role and Department - Only for super admin editing others */}
          {isSuperAdmin && !isEditingSelf && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Role & Department
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="college_admin">College Admin</option>
                    <option value="dept_admin">Department Admin</option>
                    <option value="general_admin">General Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Only for department admins"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for department admins, leave empty for other roles
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permissions - Only for super admin editing others */}
          {isSuperAdmin && !isEditingSelf && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Permissions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canViewPayments"
                    checked={formData.permissions.canViewPayments}
                    onChange={(e) =>
                      handlePermissionChange(
                        "canViewPayments",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="canViewPayments"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    View Payments
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canExportData"
                    checked={formData.permissions.canExportData}
                    onChange={(e) =>
                      handlePermissionChange("canExportData", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="canExportData"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Export Data
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canManageAdmins"
                    checked={formData.permissions.canManageAdmins}
                    onChange={(e) =>
                      handlePermissionChange(
                        "canManageAdmins",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="canManageAdmins"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Manage Admins
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canViewAnalytics"
                    checked={formData.permissions.canViewAnalytics}
                    onChange={(e) =>
                      handlePermissionChange(
                        "canViewAnalytics",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="canViewAnalytics"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    View Analytics
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
