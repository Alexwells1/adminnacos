// src/components/Dashboard/RecentActivity.tsx
import React from "react";
import type { Payment } from "../../types/admin.types";

interface RecentActivityProps {
  payments: Payment[];
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  payments,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {payments.slice(0, 8).map((payment) => (
          <div key={payment._id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    payment.type === "college" ? "bg-blue-500" : "bg-green-500"
                  }`}
                ></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {payment.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.matricNumber} • {payment.department}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ₦{payment.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {payment.isExecutive && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Executive
                </span>
              </div>
            )}
          </div>
        ))}

        {payments.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 text-lg">No recent payments</div>
            <div className="text-gray-500 mt-2">
              Payments will appear here as they are processed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
