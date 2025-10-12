// src/components/Receipts/ReceiptManagement.tsx
import React, { useState } from "react";
import { receiptService } from "../../services/admin.service";
import { useAuth } from "../../contexts/useAuth";

interface ReceiptManagementProps {
  reference: string;
  paymentEmail?: string;
  onReceiptUpdated: () => void;
}

export const ReceiptManagement: React.FC<ReceiptManagementProps> = ({
  reference,
  paymentEmail,
  onReceiptUpdated,
}) => {
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRegenerateReceipt = async () => {
    if (!hasPermission("canExportData")) {
      setMessage({
        type: "error",
        text: "You do not have permission to regenerate receipts",
      });
      return;
    }

    setLoading("regenerate");
    setMessage(null);

    try {
      await receiptService.regenerateReceipt(reference);
      setMessage({ type: "success", text: "Receipt regenerated successfully" });
      onReceiptUpdated();
    } catch (error: any) {
      console.error("Failed to regenerate receipt:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to regenerate receipt",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleResendEmail = async () => {
    if (!hasPermission("canExportData")) {
      setMessage({
        type: "error",
        text: "You do not have permission to resend receipt emails",
      });
      return;
    }

    if (!paymentEmail) {
      setMessage({
        type: "error",
        text: "No email address associated with this payment",
      });
      return;
    }

    setLoading("resend");
    setMessage(null);

    try {
      await receiptService.resendReceiptEmail(reference);
      setMessage({ type: "success", text: `Receipt sent to ${paymentEmail}` });
    } catch (error: any) {
      console.error("Failed to resend receipt email:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend receipt email",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadReceipt = () => {
    window.open(`/api/payment/${reference}/receipt`, "_blank");
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Receipt Management
      </h3>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Reference Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm sm:text-base">
              Reference: <span className="font-mono">{reference}</span>
            </div>
            {paymentEmail && (
              <div className="text-sm text-gray-600 mt-1 break-all">
                Email: {paymentEmail}
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadReceipt}
            className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
          >
            Download Receipt
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleRegenerateReceipt}
            disabled={loading === "regenerate"}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center"
          >
            {loading === "regenerate" ? (
              <span className="flex items-center">
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
                Regenerating...
              </span>
            ) : (
              "Regenerate Receipt"
            )}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={loading === "resend" || !paymentEmail}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center"
          >
            {loading === "resend" ? (
              <span className="flex items-center">
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
                Sending...
              </span>
            ) : (
              "Resend Email"
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-xs sm:text-sm text-gray-500 space-y-2 bg-gray-50 p-3 rounded-lg">
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Download Receipt:</strong> Get immediate PDF download
            </span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Regenerate Receipt:</strong> Create new receipt with
              updated data
            </span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Resend Email:</strong> Send receipt to student's email
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
