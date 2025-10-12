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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                Student Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Full Name:</span>
                  <span className="text-sm font-medium">
                    {payment.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Matric Number:</span>
                  <span className="text-sm font-medium">
                    {payment.matricNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="text-sm font-medium">
                    {payment.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span className="text-sm font-medium">{payment.level}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                Payment Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">
                    ₦{payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
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
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reference:</span>
                  <span className="text-sm font-medium">
                    {payment.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">
                    {new Date(payment.paidAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(payment.email || payment.phoneNumber) && (
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payment.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {payment.email}
                    </div>
                  </div>
                )}
                {payment.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
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
              <h4 className="text-md font-medium text-gray-900">
                Executive Information
              </h4>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Executive Payment
                </span>
                {payment.scope && (
                  <span className="text-sm text-gray-600">
                    Scope: {payment.scope}
                  </span>
                )}
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

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
