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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span>
          Add Executive
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Executive
          </h3>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>

              {/* Matric Number */}
              <div>
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 20/ABC/123"
                  required
                />
              </div>

              {/* Scope */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope *
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) =>
                    setFormData({ ...formData, scope: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <div className="text-sm text-gray-500">
              <strong>Scope determines:</strong>
              <br />• <strong>College Wide:</strong> Executive privileges across
              all college payments
              <br />• <strong>Departmental:</strong> Executive privileges only
              for department payments
              <br />• <strong>Faculty:</strong> Executive privileges for
              faculty-level payments
              <br />• <strong>Student Union:</strong> Executive privileges for
              student union activities
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Executive"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
