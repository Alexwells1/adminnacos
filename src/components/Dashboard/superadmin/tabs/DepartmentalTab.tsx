import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { AccountBalanceCard } from "@/components/Dashboard/AccountBalanceCard";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type {
  DashboardStats,
  FinancialStats,
  FinancialAccounts,
} from "@/types/admin.types";

interface DepartmentalTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

// Breakdown data type
interface BreakdownData {
  _id: string;
  revenue: number;
  count: number;
  levels: {
    level: string;
    revenue: number;
    count: number;
  }[];
}

export const DepartmentalTab: React.FC<DepartmentalTabProps> = ({
  stats,
  financialStats,
}) => {
  const { accounts } = financialStats;

  // Define departments with allowed colors
  const departments: {
    key: keyof FinancialAccounts;
    name: string;
    color: "blue" | "green" | "purple" | "orange" | "teal";
  }[] = [
    { key: "dept_comssa", name: "COMSSA", color: "blue" },
    { key: "dept_icitsa", name: "ICITSA", color: "green" },
    { key: "dept_cydasa", name: "CYDASA", color: "purple" },
    { key: "dept_senifsa", name: "SENIFSA", color: "orange" },
  ];

  // Totals calculations
  const totalDeptGrossRevenue = departments.reduce(
    (sum, dept) => sum + (accounts[dept.key]?.grossRevenue || 0),
    0
  );

  const totalDeptNetRevenue = departments.reduce(
    (sum, dept) => sum + (accounts[dept.key]?.totalRevenue || 0),
    0
  );

  const totalDeptExpenses = departments.reduce(
    (sum, dept) => sum + (accounts[dept.key]?.expenses || 0),
    0
  );

  const totalDeptMaintenance = departments.reduce(
    (sum, dept) => sum + (accounts[dept.key]?.maintenanceCollected || 0),
    0
  );

  const totalDeptPayments = departments.reduce(
    (sum, dept) => sum + (accounts[dept.key]?.paymentCount || 0),
    0
  );

  // Map detailed breakdown by department
  const departmentalBreakdown: Record<string, BreakdownData> | undefined =
    stats.detailedDepartmentBreakdown
      ?.filter((item) => item._id.type === "departmental")
      .reduce((map: Record<string, BreakdownData>, item) => {
        const dept = item._id.department;
        if (!map[dept]) {
          map[dept] = { _id: dept, revenue: 0, count: 0, levels: [] };
        }
        map[dept].revenue += item.revenue;
        map[dept].count += item.count;
        map[dept].levels.push({
          level: item._id.level,
          revenue: item.revenue,
          count: item.count,
        });
        return map;
      }, {} as Record<string, BreakdownData>);

  const departmentalBreakdownArray: BreakdownData[] = departmentalBreakdown
    ? Object.values(departmentalBreakdown)
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Department Analysis</h2>

      {/* Total Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatsCard
          title="Gross Revenue"
          value={`₦${totalDeptGrossRevenue.toLocaleString()}`}
          subtitle="Before maintenance"
          color="blue"
        />
        <StatsCard
          title="Net Revenue"
          value={`₦${totalDeptNetRevenue.toLocaleString()}`}
          subtitle="After maintenance"
          color="green"
        />
        <StatsCard
          title="Total Payments"
          value={totalDeptPayments.toLocaleString()}
          subtitle="Successful transactions"
          color="purple"
        />
        <StatsCard
          title="Total Expenses"
          value={`₦${totalDeptExpenses.toLocaleString()}`}
          subtitle="All departments combined"
          color="orange"
        />
        <StatsCard
          title="Maintenance Collected"
          value={`₦${totalDeptMaintenance.toLocaleString()}`}
          subtitle="From departmental payments"
          color="teal"
        />
      </div>

      {/* Department-level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {departments.map((dept) => {
          const data = accounts[dept.key];
          return (
            <AccountBalanceCard
              key={dept.key}
              accountName={dept.name}
              grossRevenue={data.grossRevenue}
              totalRevenue={data.totalRevenue}
              expenses={data.expenses}
              availableBalance={data.availableBalance}
              maintenanceCollected={data.maintenanceCollected}
              paymentCount={data.paymentCount}
              color={dept.color}
            />
          );
        })}
      </div>

      {/* Detailed Breakdown Table */}
      {departmentalBreakdownArray.length > 0 && (
        <BreakdownTable
          title="Department Revenue Details"
          data={departmentalBreakdownArray}
          type="department"
        />
      )}
    </div>
  );
};
