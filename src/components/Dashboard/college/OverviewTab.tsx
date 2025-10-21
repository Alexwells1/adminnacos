import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { AccountBalanceCard } from "@/components/Dashboard/AccountBalanceCard";
import type { DashboardStats } from "@/types/admin.types";

interface OverviewTabProps {
  stats: DashboardStats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats }) => {
  const financialStats = stats.financialStats;

  return (
    <>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="College Revenue"
          value={`₦${stats?.totalRevenue?.toLocaleString() || "0"}`}
          subtitle="College-level payments only"
          color="green"
        />
        <StatsCard
          title="College Payments"
          value={stats?.totalPayments?.toLocaleString() ?? "0"}
          subtitle="College transactions"
          color="blue"
        />
        <StatsCard
          title="College Balance"
          value={`₦${
            financialStats?.accounts?.college_general?.availableBalance?.toLocaleString() ||
            "0"
          }`}
          subtitle="College general fund"
          color="purple"
        />
        <StatsCard
          title="College Students"
          value={stats?.totalPayments?.toLocaleString() ?? "0"}
          subtitle="Students paid college fees"
          color="orange"
        />
      </div>

      {/* College Account Balance */}
      {financialStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AccountBalanceCard
            accountName="College General Fund"
            totalRevenue={financialStats.accounts.college_general.totalRevenue}
            expenses={financialStats.accounts.college_general.expenses}
            availableBalance={
              financialStats.accounts.college_general.availableBalance
            }
            color="blue"
          />
        </div>
      )}
    </>
  );
};
