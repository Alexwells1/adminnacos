import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { AccountBalanceCard } from "@/components/Dashboard/AccountBalanceCard";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";

interface OverviewTabProps {
  stats: DashboardStats;
  getDepartmentAccountKey: () => keyof FinancialStats["accounts"];
  getDepartmentDisplayName: () => string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  getDepartmentAccountKey,
  getDepartmentDisplayName,
}) => {
  const accountKey = getDepartmentAccountKey();
  const departmentAccount = stats.financialStats?.accounts[accountKey];

  const getDepartmentLevelBreakdown = () => {
    if (!stats?.levelWiseDept) return [];
    return stats.levelWiseDept.map((item) => ({
      _id: String(item._id),
      revenue: item.revenue,
      count: item.count,
    }));
  };

  const departmentLevelBreakdown = getDepartmentLevelBreakdown();

  return (
    <>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Department Revenue"
          value={`₦${stats?.totalDeptRevenue?.toLocaleString()}`}
          subtitle="Total departmental payments"
          color="green"
        />
        <StatsCard
          title="Total Payments"
          value={stats?.totalDeptPayments?.toLocaleString() ?? "0"}
          subtitle="Department transactions"
          color="blue"
        />
        <StatsCard
          title="Available Balance"
          value={`₦${
            departmentAccount?.availableBalance.toLocaleString() || 0
          }`}
          subtitle="Department fund"
          color="purple"
        />
        <StatsCard
          title="Student Count"
          value={stats?.totalDeptPayments?.toLocaleString() ?? "0"}
          subtitle="Students in department"
          color="orange"
        />
      </div>

      {/* Department Account Overview */}
      {departmentAccount && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AccountBalanceCard
            accountName={`${getDepartmentDisplayName()} Fund`}
            totalRevenue={departmentAccount.totalRevenue}
            expenses={departmentAccount.expenses}
            availableBalance={departmentAccount.availableBalance}
            color="blue"
          />
        </div>
      )}

      {/* Quick Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {departmentLevelBreakdown.length > 0 ? (
          <BreakdownTable
            title="Department Payments by Level"
            data={departmentLevelBreakdown}
            type="level"
          />
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Department Payments by Level</h3>
            <div className="text-center py-8 text-muted-foreground">
              No level breakdown data available
            </div>
          </div>
        )}
      </div>
    </>
  );
};
