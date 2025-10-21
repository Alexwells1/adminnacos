// components/dashboard/ExecutiveBreakdownTable.tsx
import type { ExecutiveVsRegularItem } from "@/types/admin.types";
import React from "react";


interface ExecutiveBreakdownTableProps {
  title: string;
  data: ExecutiveVsRegularItem[];
}

export const ExecutiveBreakdownTable: React.FC<
  ExecutiveBreakdownTableProps
> = ({ title, data }) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const executiveData = data.find((item) => item._id === true);
  const regularData = data.find((item) => item._id === false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payments
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {executiveData && (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-purple-900">
                  Executive
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {executiveData.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ₦{executiveData.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {totalRevenue > 0
                    ? ((executiveData.revenue / totalRevenue) * 100).toFixed(1)
                    : 0}
                  %
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ₦
                  {executiveData.count > 0
                    ? (executiveData.revenue / executiveData.count).toFixed(2)
                    : 0}
                </td>
              </tr>
            )}
            {regularData && (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Regular
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {regularData.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ₦{regularData.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {totalRevenue > 0
                    ? ((regularData.revenue / totalRevenue) * 100).toFixed(1)
                    : 0}
                  %
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ₦
                  {regularData.count > 0
                    ? (regularData.revenue / regularData.count).toFixed(2)
                    : 0}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                {totalCount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                ₦{totalRevenue.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                100%
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                ₦{totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
