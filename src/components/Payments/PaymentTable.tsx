// src/components/Payments/PaymentTable.tsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { paymentService } from "../../services/admin.service";
import type { Payment } from "../../types/admin.types";
import { PaymentDetailsModal } from "./PaymentDetailsModal";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  onPaymentUpdate: () => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading,
  onPaymentUpdate,
}) => {
  const { hasPermission, isRole } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] =
    useState<Payment | null>(null);

  const handleViewDetails = (payment: Payment) => {
    setSelectedPaymentForDetails(payment);
    setShowDetailsModal(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleUpdatePayment = async (updates: any) => {
    if (!selectedPayment) return;

    setActionLoading("update");
    try {
      await paymentService.updatePayment(selectedPayment._id, updates);
      setShowEditModal(false);
      setSelectedPayment(null);
      onPaymentUpdate();
    } catch (error) {
      console.error("Failed to update payment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPayment) return;

    setActionLoading("delete");
    try {
      await paymentService.deletePayment(selectedPayment._id);
      setShowDeleteModal(false);
      setSelectedPayment(null);
      onPaymentUpdate();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const downloadReceipt = async (payment: Payment) => {
    setActionLoading(`receipt-${payment._id}`);
    try {
      window.open(`/api/payment/${payment.reference}/receipt`, "_blank");
    } catch (error) {
      console.error("Failed to download receipt:", error);
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
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Info
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {payment.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.matricNumber}
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.department}
                  </div>
                  <div className="text-sm text-gray-500">
                    Level {payment.level}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.type === "college"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {payment.type}
                    </span>
                    {payment.isExecutive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Executive
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₦{payment.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[120px]">
                    {payment.reference}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => downloadReceipt(payment)}
                      disabled={actionLoading === `receipt-${payment._id}`}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 transition-colors text-xs sm:text-sm"
                    >
                      {actionLoading === `receipt-${payment._id}`
                        ? "..."
                        : "Receipt"}
                    </button>

                    {hasPermission("canExportData") && (
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-green-600 hover:text-green-900 transition-colors text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                    )}

                    {isRole("super_admin") && (
                      <button
                        onClick={() => handleDelete(payment)}
                        className="text-red-600 hover:text-red-900 transition-colors text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    )}

                    <button
                      onClick={() => handleViewDetails(payment)}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="space-y-3">
              {/* Student Info */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {payment.matricNumber}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Department:</span>
                  <div className="font-medium">{payment.department}</div>
                </div>
                <div>
                  <span className="text-gray-500">Level:</span>
                  <div className="font-medium">{payment.level}</div>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <div className="font-medium">
                    ₦{payment.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <div className="font-medium">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    payment.type === "college"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {payment.type}
                </span>
                {payment.isExecutive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Executive
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => downloadReceipt(payment)}
                  disabled={actionLoading === `receipt-${payment._id}`}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === `receipt-${payment._id}`
                    ? "..."
                    : "Receipt"}
                </button>

                <button
                  onClick={() => handleViewDetails(payment)}
                  className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  View
                </button>

                {hasPermission("canExportData") && (
                  <button
                    onClick={() => handleEdit(payment)}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Edit
                  </button>
                )}

                {isRole("super_admin") && (
                  <button
                    onClick={() => handleDelete(payment)}
                    className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-base sm:text-lg">
            No payments found
          </div>
          <div className="text-gray-500 mt-1 sm:mt-2 text-sm">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPayment && (
        <EditPaymentModal
          payment={selectedPayment}
          onSave={handleUpdatePayment}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPayment(null);
          }}
          loading={actionLoading === "update"}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPayment && (
        <DeletePaymentModal
          payment={selectedPayment}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPayment(null);
          }}
          loading={actionLoading === "delete"}
        />
      )}

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPaymentForDetails && (
        <PaymentDetailsModal
          payment={selectedPaymentForDetails}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPaymentForDetails(null);
          }}
          onPaymentUpdate={onPaymentUpdate}
        />
      )}
    </div>
  );
};

// Edit Payment Modal Component
const EditPaymentModal: React.FC<{
  payment: Payment;
  onSave: (updates: any) => void;
  onClose: () => void;
  loading: boolean;
}> = ({ payment, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    fullName: payment.fullName,
    matricNumber: payment.matricNumber,
    department: payment.department,
    level: payment.level,
    amount: payment.amount,
    email: payment.email || "",
    phoneNumber: payment.phoneNumber || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-medium text-gray-900">Edit Payment</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matric Number
            </label>
            <input
              type="text"
              value={formData.matricNumber}
              onChange={(e) =>
                setFormData({ ...formData, matricNumber: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors order-1 sm:order-2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Payment Modal Component
const DeletePaymentModal: React.FC<{
  payment: Payment;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}> = ({ payment, onConfirm, onClose, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Delete Payment</h3>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-gray-700 text-sm sm:text-base">
            Are you sure you want to delete the payment for{" "}
            <strong>{payment.fullName}</strong> ({payment.matricNumber})?
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">
            This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors order-1 sm:order-2"
            >
              {loading ? "Deleting..." : "Delete Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
