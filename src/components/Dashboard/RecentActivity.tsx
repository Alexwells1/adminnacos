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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex justify-center items-center h-24 sm:h-32">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">
          Recent Payments
        </h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {payments.slice(0, 8).map((payment) => (
          <div
            key={payment._id}
            className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                    payment.type === "college" ? "bg-blue-500" : "bg-green-500"
                  }`}
                ></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {payment.fullName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {payment.matricNumber} • {payment.department}
                  </div>
                </div>
              </div>
              <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
                <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  ₦{payment.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
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
          <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
            <div className="text-gray-400 text-base sm:text-lg">
              No recent payments
            </div>
            <div className="text-gray-500 mt-1 sm:mt-2 text-sm">
              Payments will appear here as they are processed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
