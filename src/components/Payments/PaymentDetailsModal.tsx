// src/components/Payments/PaymentDetailsModal.tsx
import React from "react";
import { ReceiptManagement } from "../Receipts/ReceiptManagement";
import type { Payment } from "../../types/admin.types";

interface PaymentDetailsModalProps {
  payment: Payment;
  onClose: () => void;
  onPaymentUpdate: () => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  onPaymentUpdate,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">
            Payment Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Payment Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">
                Student Information
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Full Name:</span>
                  <span className="text-sm font-medium text-right">
                    {payment.fullName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Matric Number:</span>
                  <span className="text-sm font-medium font-mono bg-white px-2 py-1 rounded border">
                    {payment.matricNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="text-sm font-medium text-right">
                    {payment.department}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span className="text-sm font-medium">
                    Level {payment.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">
                Payment Details
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">
                    ₦{payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.type === "college"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {payment.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reference:</span>
                  <span className="text-sm font-medium font-mono bg-white px-2 py-1 rounded border truncate max-w-[120px]">
                    {payment.reference}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium text-right">
                    {new Date(payment.paidAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(payment.email || payment.phoneNumber) && (
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payment.email && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="text-sm text-gray-900 break-all">
                      {payment.email}
                    </div>
                  </div>
                )}
                {payment.phoneNumber && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="text-sm text-gray-900">
                      {payment.phoneNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Executive Information */}
          {payment.isExecutive && (
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-900">
                Executive Information
              </h4>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Executive Payment
                  </span>
                  {payment.scope && (
                    <span className="text-sm text-gray-700">
                      Scope:{" "}
                      <span className="font-medium capitalize">
                        {payment.scope}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Receipt Management */}
          <ReceiptManagement
            reference={payment.reference}
            paymentEmail={payment.email}
            onReceiptUpdated={onPaymentUpdate}
          />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
