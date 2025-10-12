// src/components/AdminManagement/RegisterAdminForm.tsx
import React, { useState } from "react";
import { adminAuthService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";


interface RegisterAdminFormProps {
  onAdminRegistered: () => void;
}

export const RegisterAdminForm: React.FC<RegisterAdminFormProps> = ({
  onAdminRegistered,
}) => {
  const { admin: currentAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "general_admin" as
      | "super_admin"
      | "college_admin"
      | "dept_admin"
      | "general_admin",
    department: "",
    permissions: {
      canViewPayments: true,
      canExportData: true,
      canManageAdmins: false,
      canViewAnalytics: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.role === "dept_admin" && !formData.department) {
      setError("Department is required for department admins");
      setLoading(false);
      return;
    }

    if (formData.role !== "dept_admin" && formData.department) {
      setError("Department can only be set for department admins");
      setLoading(false);
      return;
    }

    try {
      await adminAuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department || undefined,
        permissions: formData.permissions,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "general_admin",
        department: "",
        permissions: {
          canViewPayments: true,
          canExportData: true,
          canManageAdmins: false,
          canViewAnalytics: true,
        },
      });

      setShowForm(false);
      onAdminRegistered();
    } catch (error: any) {
      console.error("Failed to register admin:", error);
      setError(error.response?.data?.message || "Failed to register admin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "general_admin",
      department: "",
      permissions: {
        canViewPayments: true,
        canExportData: true,
        canManageAdmins: false,
        canViewAnalytics: true,
      },
    });
    setError("");
  };

  const handleRoleChange = (role: string) => {
    const newRole = role as typeof formData.role;
    setFormData({
      ...formData,
      role: newRole,
      department: newRole === "dept_admin" ? formData.department : "",
      permissions: {
        ...formData.permissions,
        canManageAdmins: newRole === "super_admin",
      },
    });
  };

  // Only super admins can register new admins
  if (currentAdmin?.role !== "super_admin") {
    return null;
  }

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <span className="mr-2">+</span>
          Register New Admin
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Register New Admin
          </h3>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Password
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role and Department */}
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
                    onChange={(e) => handleRoleChange(e.target.value)}
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
                    disabled={formData.role !== "dept_admin"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.role === "dept_admin"
                      ? "Required for department admins"
                      : "Department can only be set for department admins"}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions */}
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
                      setFormData({
                        ...formData,
                        permissions: {
                          ...formData.permissions,
                          canViewPayments: e.target.checked,
                        },
                      })
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
                      setFormData({
                        ...formData,
                        permissions: {
                          ...formData.permissions,
                          canExportData: e.target.checked,
                        },
                      })
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
                      setFormData({
                        ...formData,
                        permissions: {
                          ...formData.permissions,
                          canManageAdmins: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={formData.role !== "super_admin"}
                  />
                  <label
                    htmlFor="canManageAdmins"
                    className={`ml-2 block text-sm ${
                      formData.role !== "super_admin"
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    Manage Admins
                    {formData.role !== "super_admin" && " (Super Admin only)"}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canViewAnalytics"
                    checked={formData.permissions.canViewAnalytics}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        permissions: {
                          ...formData.permissions,
                          canViewAnalytics: e.target.checked,
                        },
                      })
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
