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
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Receipt Management
      </h3>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">
              Reference: {reference}
            </div>
            {paymentEmail && (
              <div className="text-sm text-gray-600 mt-1">
                Email: {paymentEmail}
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadReceipt}
            className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Download Receipt
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleRegenerateReceipt}
            disabled={loading === "regenerate"}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {loading === "regenerate"
              ? "Regenerating..."
              : "Regenerate Receipt"}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={loading === "resend" || !paymentEmail}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
          >
            {loading === "resend" ? "Sending..." : "Resend Email"}
          </button>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            • <strong>Download Receipt:</strong> Get immediate PDF download
          </p>
          <p>
            • <strong>Regenerate Receipt:</strong> Create new receipt with
            updated data
          </p>
          <p>
            • <strong>Resend Email:</strong> Send receipt to student's email
          </p>
        </div>
      </div>
    </div>
  );
};
