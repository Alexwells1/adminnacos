import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";

interface OverviewTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  financialStats,
}) => {
  return (
    <>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue?.toLocaleString() || 0}`}
          subtitle="All payments"
          color="green"
        />
        <StatsCard
          title="Total Payments"
          value={stats.totalPayments?.toLocaleString() || "0"}
          subtitle="Successful transactions"
          color="blue"
        />
        <StatsCard
          title="College Revenue"
          value={`₦${(
            financialStats?.totalCollegeRevenue ?? 0
          ).toLocaleString()}`}
          subtitle="College general fund"
          color="purple"
        />
        <StatsCard
          title="Department Revenue"
          value={`₦${(
            financialStats?.totalDepartmentalRevenue ?? 0
          ).toLocaleString()}`}
          subtitle="All departments"
          color="orange"
        />
      </div>

      {/* Maintenance Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatsCard
          title="Total Maintenance"
          value={`₦${(financialStats?.totalMaintenance ?? 0).toLocaleString()}`}
          subtitle="From all payments"
          color="blue"
        />
        <StatsCard
          title="Maintenance Used"
          value={`₦${(
            financialStats?.maintenanceExpenses ?? 0
          ).toLocaleString()}`}
          subtitle="Total spent"
          color="orange"
        />
        <StatsCard
          title="Available Maintenance"
          value={`₦${(
            financialStats?.availableMaintenance ?? 0
          ).toLocaleString()}`}
          subtitle="Remaining balance"
          color="green"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.collegeVsDeptRevenue && (
          <BreakdownTable
            title="Revenue Distribution"
            data={stats.collegeVsDeptRevenue}
            type="type"
          />
        )}
        {stats.executiveVsRegular && (
          <BreakdownTable
            title="Payment Types"
            data={stats.executiveVsRegular}
            type="executive"
          />
        )}
      </div>
    </>
  );
};
