// src/components/Payments/CreateManualPayment.tsx
import React, { useState } from "react";
import { paymentService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";

interface CreateManualPaymentProps {
  onPaymentCreated: () => void;
  defaultType?: "college" | "departmental";
}

export const CreateManualPayment: React.FC<CreateManualPaymentProps> = ({
  onPaymentCreated,
  defaultType = "college",
}) => {
  const { admin, hasPermission } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    department: admin?.department || "",
    level: "100",
    amount: "",
    type: defaultType,
    email: "",
    phoneNumber: "",
    isExecutive: false,
    scope: "college",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.fullName || !formData.matricNumber || !formData.amount) {
      setError("Full name, matric number, and amount are required");
      setLoading(false);
      return;
    }

    try {
      await paymentService.createManualPayment({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      // Reset form
      setFormData({
        fullName: "",
        matricNumber: "",
        department: admin?.department || "",
        level: "100",
        amount: "",
        type: defaultType,
        email: "",
        phoneNumber: "",
        isExecutive: false,
        scope: "college",
      });

      setShowForm(false);
      onPaymentCreated();
    } catch (error: any) {
      console.error("Failed to create manual payment:", error);
      setError(error.response?.data?.message || "Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      fullName: "",
      matricNumber: "",
      department: admin?.department || "",
      level: "100",
      amount: "",
      type: defaultType,
      email: "",
      phoneNumber: "",
      isExecutive: false,
      scope: "college",
    });
    setError("");
  };

  // Determine allowed payment types based on role
  const allowedTypes = [];
  if (admin?.role === "super_admin" || admin?.role === "college_admin") {
    allowedTypes.push("college");
  }
  if (admin?.role === "super_admin" || admin?.role === "dept_admin") {
    allowedTypes.push("departmental");
  }

  if (!hasPermission("canViewPayments")) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors text-sm sm:text-base"
        >
          <span className="mr-2">+</span>
          Create Manual Payment
        </button>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Create Manual Payment
          </h3>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Matric Number */}
              <div className="sm:col-span-2">
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
                  required
                />
              </div>

              {/* Department */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  {allowedTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Executive Options */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isExecutive"
                  checked={formData.isExecutive}
                  onChange={(e) =>
                    setFormData({ ...formData, isExecutive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isExecutive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  This is an executive payment
                </label>
              </div>

              {formData.isExecutive && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Executive Scope
                  </label>
                  <select
                    value={formData.scope}
                    onChange={(e) =>
                      setFormData({ ...formData, scope: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="college">College Wide</option>
                    <option value="departmental">Departmental</option>
                    <option value="faculty">Faculty</option>
                    <option value="student_union">Student Union</option>
                  </select>
                </div>
              )}
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
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors order-1 sm:order-2"
              >
                {loading ? "Creating..." : "Create Payment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
