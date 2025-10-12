// src/components/Executives/AddExecutiveForm.tsx
import React, { useState } from "react";
import { executiveService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";

interface AddExecutiveFormProps {
  onExecutiveAdded: () => void;
}

export const AddExecutiveForm: React.FC<AddExecutiveFormProps> = ({
  onExecutiveAdded,
}) => {
  const { hasPermission, isRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    scope: "college", // default scope
  });
  const [error, setError] = useState("");

  const canManageExecutives =
    isRole("super_admin") || hasPermission("canManageAdmins");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.matricNumber || !formData.scope) {
      setError("Matric number and scope are required");
      setLoading(false);
      return;
    }

    try {
      await executiveService.addExecutive(formData);
      setFormData({ fullName: "", matricNumber: "", scope: "college" });
      setShowForm(false);
      onExecutiveAdded();
    } catch (error: any) {
      console.error("Failed to add executive:", error);
      setError(error.response?.data?.message || "Failed to add executive");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ fullName: "", matricNumber: "", scope: "college" });
    setError("");
  };

  if (!canManageExecutives) {
    return null; // Don't show add form if no permission
  }

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="mr-2">+</span>
          Add Executive
        </button>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Executive
          </h3>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Full Name */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Optional"
                />
              </div>

              {/* Matric Number */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matric Number *
                </label>
                <input
                  type="text"
                  value={formData.matricNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      matricNumber: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., 20/ABC/123"
                  required
                />
              </div>

              {/* Scope */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope *
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) =>
                    setFormData({ ...formData, scope: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="college">College Wide</option>
                  <option value="departmental">Departmental</option>
                  <option value="faculty">Faculty</option>
                  <option value="student_union">Student Union</option>
                </select>
              </div>
            </div>

            {/* Scope Description */}
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <strong className="block mb-2">Scope determines:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>College Wide:</strong> Executive privileges across
                    all college payments
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Departmental:</strong> Executive privileges only for
                    department payments
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Faculty:</strong> Executive privileges for
                    faculty-level payments
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Student Union:</strong> Executive privileges for
                    student union activities
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors order-1 sm:order-2"
              >
                {loading ? (
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
                    Adding...
                  </span>
                ) : (
                  "Add Executive"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
