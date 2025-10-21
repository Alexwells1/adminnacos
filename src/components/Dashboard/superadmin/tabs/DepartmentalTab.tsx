import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { AccountBalanceCard } from "@/components/Dashboard/AccountBalanceCard";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";

interface DepartmentalTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

export const DepartmentalTab: React.FC<DepartmentalTabProps> = ({
  stats,
  financialStats,
}) => {
  const getDepartmentalBreakdown = () => {
    if (!stats?.detailedDepartmentBreakdown) return [];

    const departmentMap = new Map();

    stats.detailedDepartmentBreakdown
      .filter((item) => item._id.type === "departmental")
      .forEach((item) => {
        const dept = item._id.department;
        if (!departmentMap.has(dept)) {
          departmentMap.set(dept, {
            _id: dept,
            revenue: 0,
            count: 0,
            levels: [],
          });
        }

        const deptData = departmentMap.get(dept);
        deptData.revenue += item.revenue;
        deptData.count += item.count;
        deptData.levels.push({
          level: item._id.level,
          revenue: item.revenue,
          count: item.count,
        });
      });

    return Array.from(departmentMap.values());
  };

  const departmentalBreakdown = getDepartmentalBreakdown();
  const totalDeptExpenses =
    financialStats.accounts.dept_comssa.expenses +
    financialStats.accounts.dept_icitsa.expenses +
    financialStats.accounts.dept_cydasa.expenses +
    financialStats.accounts.dept_senifsa.expenses;

  return (
    <>
      <h2 className="text-lg font-semibold">Department Analysis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Revenue"
          value={`₦${financialStats.totalDepartmentalRevenue.toLocaleString()}`}
          subtitle="All departments"
          color="green"
        />
        <StatsCard
          title="Total Payments"
          value={stats.totalDeptPayments?.toLocaleString() || "0"}
          subtitle="All departments"
          color="blue"
        />
        <StatsCard
          title="Departments"
          value="4"
          subtitle="Active"
          color="purple"
        />
        <StatsCard
          title="Total Expenses"
          value={`₦${totalDeptExpenses.toLocaleString()}`}
          subtitle="All departments"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <AccountBalanceCard
          accountName="COMSSA"
          totalRevenue={financialStats.accounts.dept_comssa.totalRevenue}
          expenses={financialStats.accounts.dept_comssa.expenses}
          availableBalance={
            financialStats.accounts.dept_comssa.availableBalance
          }
          color="blue"
        />
        <AccountBalanceCard
          accountName="ICITSA"
          totalRevenue={financialStats.accounts.dept_icitsa.totalRevenue}
          expenses={financialStats.accounts.dept_icitsa.expenses}
          availableBalance={
            financialStats.accounts.dept_icitsa.availableBalance
          }
          color="green"
        />
        <AccountBalanceCard
          accountName="CYDASA"
          totalRevenue={financialStats.accounts.dept_cydasa.totalRevenue}
          expenses={financialStats.accounts.dept_cydasa.expenses}
          availableBalance={
            financialStats.accounts.dept_cydasa.availableBalance
          }
          color="purple"
        />
        <AccountBalanceCard
          accountName="SENIFSA"
          totalRevenue={financialStats.accounts.dept_senifsa.totalRevenue}
          expenses={financialStats.accounts.dept_senifsa.expenses}
          availableBalance={
            financialStats.accounts.dept_senifsa.availableBalance
          }
          color="orange"
        />
      </div>

      {departmentalBreakdown.length > 0 && (
        <BreakdownTable
          title="Department Revenue"
          data={departmentalBreakdown}
          type="department"
        />
      )}
    </>
  );
};
