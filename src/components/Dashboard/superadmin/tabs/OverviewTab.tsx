import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { BreakdownTable } from "@/components/Dashboard/BreakdownTable";
import type { DashboardStats, FinancialStats } from "@/types/admin.types";
import {
  TrendingUp,
  CreditCard,
  PieChart,
  DollarSign,
  Users,
  PiggyBank,
  BarChart3,
} from "lucide-react";

interface OverviewTabProps {
  stats: DashboardStats;
  financialStats: FinancialStats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  financialStats,
}) => {
  const { accounts } = financialStats;

  const departmentAccounts = [
    { name: "COMSSA", data: accounts.dept_comssa, icon: Users },
    { name: "ICITSA", data: accounts.dept_icitsa, icon: Users },
    { name: "CYDASA", data: accounts.dept_cydasa, icon: Users },
    { name: "SENIFSA", data: accounts.dept_senifsa, icon: Users },
  ];

  // TOTAL NET revenue for dashboard
  const totalNetRevenue =
    financialStats.totalCollegeRevenue +
    financialStats.totalDepartmentalRevenue;

  // TOTAL GROSS revenue
  const totalGrossRevenue =
    financialStats.grossCollegeRevenue +
    financialStats.grossDepartmentalRevenue;

  const totalExpenses = financialStats.totalExpenses || 0;

  const avgPayment =
    stats.totalPayments > 0
      ? Math.round(totalNetRevenue / stats.totalPayments)
      : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {/* NET revenue */}
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> Net Revenue
            </span>
          }
          value={`₦${totalNetRevenue.toLocaleString()}`}
          subtitle="Revenue after maintenance deductions"
          color="green"
        />

        {/* GROSS revenue */}
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Gross Revenue
            </span>
          }
          value={`₦${totalGrossRevenue.toLocaleString()}`}
          subtitle="Revenue before maintenance deductions"
          color="blue"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-500" /> Total Payments
            </span>
          }
          value={stats.totalPayments?.toLocaleString() || "0"}
          subtitle="Successful transactions"
          color="purple"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" /> Total Expenses
            </span>
          }
          value={`₦${totalExpenses.toLocaleString()}`}
          subtitle="All accounts combined"
          color="orange"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> Avg Payment
            </span>
          }
          value={`₦${avgPayment.toLocaleString()}`}
          subtitle="Average payment amount"
          color="red"
        />
      </div>

      {/* College General Summary */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-green-500" /> College Net
            </span>
          }
          value={`₦${accounts.college_general.totalRevenue.toLocaleString()}`}
          subtitle="Net after maintenance"
          color="green"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> College Gross
            </span>
          }
          value={`₦${accounts.college_general.grossRevenue?.toLocaleString()}`}
          subtitle="Before maintenance deduction"
          color="blue"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" /> College Payments
            </span>
          }
          value={accounts.college_general.paymentCount.toLocaleString()}
          subtitle="Number of payments"
          color="purple"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" /> College
              Expenses
            </span>
          }
          value={`₦${accounts.college_general.expenses.toLocaleString()}`}
          subtitle="Total spent"
          color="orange"
        />

        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-blue-500" /> Maintenance Avail.
            </span>
          }
          value={`₦${financialStats.availableMaintenance.toLocaleString()}`}
          subtitle="Maintenance funds remaining"
          color="blue"
        />
      </div>

      {/* Departments Summary */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {departmentAccounts.map((dept) => (
          <StatsCard
            key={dept.name}
            title={
              <span className="flex items-center gap-2">
                <dept.icon className="w-5 h-5 text-blue-500" /> {dept.name}
              </span>
            }
            value={`₦${dept.data.totalRevenue.toLocaleString()}`}
            subtitle={`Gross: ₦${dept.data.grossRevenue?.toLocaleString()} • Payments: ${dept.data.paymentCount.toLocaleString()} • Expenses: ₦${dept.data.expenses.toLocaleString()} • Available: ₦${dept.data.availableBalance.toLocaleString()}`}
            color="blue"
          />
        ))}
      </div>

      {/* Revenue & Payment Breakdown Tables */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
    </div>
  );
};
