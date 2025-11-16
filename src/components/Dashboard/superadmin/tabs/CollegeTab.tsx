// components/dashboard/CollegeTab.tsx
import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, PieChart } from "lucide-react";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";

interface CollegeTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

export const CollegeTab: React.FC<CollegeTabProps> = ({
  stats,
  financialStats,
}) => {
  const collegeAccount = financialStats.accounts.college_general || {
    availableBalance: 0,
    totalRevenue: 0,
    expenses: 0,
  };

  // Extract breakdown for college levels
  const collegeLevelBreakdown =
    stats?.detailedDepartmentBreakdown
      ?.filter((item) => item._id?.type === "college")
      ?.map((item) => ({
        _id: item._id?.level ?? "Unknown",
        revenue: item.revenue ?? 0,
        count: item.count ?? 0,
      })) || [];

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">College Analysis</h2>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <StatsCard
          title="Account Balance"
          value={`₦${collegeAccount.availableBalance.toLocaleString()}`}
          subtitle="Available funds"
          color="green"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`₦${collegeAccount.totalRevenue.toLocaleString()}`}
          subtitle="All payments"
          color="blue"
          icon={<PieChart className="w-5 h-5" />}
        />
        <StatsCard
          title="Expenses"
          value={`₦${collegeAccount.expenses.toLocaleString()}`}
          subtitle="Total spent"
          color="orange"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* College Level Breakdown Table */}
      {collegeLevelBreakdown.length > 0 ? (
        <BreakdownTable
          title="College Payments by Level"
          data={collegeLevelBreakdown}
          type="level"
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No level breakdown data available
        </div>
      )}

      {/* Custom Average Table (Optional) */}
      {collegeLevelBreakdown.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Level Averages</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Level</th>
                  <th className="text-right p-3 font-medium">Payments</th>
                  <th className="text-right p-3 font-medium">Revenue (₦)</th>
                  <th className="text-right p-3 font-medium">
                    Average per Payment (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {collegeLevelBreakdown.map((item, idx) => {
                  const count = item.count || 0;
                  const revenue = item.revenue || 0;
                  const average = count > 0 ? Math.round(revenue / count) : 0;

                  return (
                    <tr
                      key={idx}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{item._id}</td>
                      <td className="p-3 text-right">
                        {count.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        ₦{revenue.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        ₦{average.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </>
  );
};
