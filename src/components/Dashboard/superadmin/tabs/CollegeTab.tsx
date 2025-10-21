import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";

interface CollegeTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

export const CollegeTab: React.FC<CollegeTabProps> = ({
  stats,
  financialStats,
}) => {
  const getCollegeLevelBreakdown = () => {
    if (!stats?.detailedDepartmentBreakdown) return [];
    return stats.detailedDepartmentBreakdown
      .filter((item) => item._id.type === "college")
      .map((item) => ({
        _id: item._id.level,
        revenue: item.revenue,
        count: item.count,
      }));
  };

  const collegeLevelBreakdown = getCollegeLevelBreakdown();

  return (
    <>
      <h2 className="text-lg font-semibold">College Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatsCard
          title="Account Balance"
          value={`₦${financialStats.accounts.college_general.availableBalance.toLocaleString()}`}
          subtitle="Available funds"
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`₦${financialStats.accounts.college_general.totalRevenue.toLocaleString()}`}
          subtitle="All payments"
          color="blue"
        />
        <StatsCard
          title="Expenses"
          value={`₦${financialStats.accounts.college_general.expenses.toLocaleString()}`}
          subtitle="Total spent"
          color="orange"
        />
      </div>

      {collegeLevelBreakdown.length > 0 && (
        <BreakdownTable
          title="Payments by Level"
          data={collegeLevelBreakdown}
          type="level"
        />
      )}

      {collegeLevelBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Level</th>
                    <th className="text-right p-3 font-medium">Payments</th>
                    <th className="text-right p-3 font-medium">Revenue</th>
                    <th className="text-right p-3 font-medium">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {collegeLevelBreakdown.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{item._id}</td>
                      <td className="p-3 text-right">{item.count}</td>
                      <td className="p-3 text-right">
                        ₦{item.revenue.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        ₦
                        {item.count > 0
                          ? Math.round(
                              item.revenue / item.count
                            ).toLocaleString()
                          : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
