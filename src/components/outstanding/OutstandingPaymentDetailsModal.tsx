import type { OutstandingPayment } from "@/types/admin.types";
import React from "react";


interface Props {
  payment: OutstandingPayment;
  onClose: () => void;
}

const OutstandingPaymentDetailsModal: React.FC<Props> = ({
  payment,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {payment.fullName}
          </p>
          <p>
            <strong>Matric Number:</strong> {payment.matricNumber}
          </p>
          <p>
            <strong>Email:</strong> {payment.email}
          </p>
          <p>
            <strong>Phone:</strong> {payment.phoneNumber}
          </p>
          <p>
            <strong>Department:</strong> {payment.department}
          </p>
          <p>
            <strong>Missed Session:</strong> {payment.missedSession}
          </p>
          <p>
            <strong>Missed Level:</strong> {payment.missedLevel}
          </p>
          <p>
            <strong>Amount:</strong> ₦{payment.amount.toLocaleString()}
          </p>
          <p>
            <strong>Reference:</strong> {payment.reference}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(payment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutstandingPaymentDetailsModal;
