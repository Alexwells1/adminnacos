import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import type { FinancialStats } from "@/types/admin.types";
import { MaintenanceBreakdownTable } from "./maintenancebraekdown";
import { DollarSign, CreditCard, BarChart, Users } from "lucide-react";

interface MaintenanceTabProps {
  financialStats: FinancialStats;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  financialStats,
}) => {
  const {
    accounts,
    totalMaintenance,
    maintenanceExpenses,
    availableMaintenance,
  } = financialStats;

  // Prepare department accounts
  const departmentAccounts = [
    { name: "COMSSA", data: accounts.dept_comssa },
    { name: "ICITSA", data: accounts.dept_icitsa },
    { name: "CYDASA", data: accounts.dept_cydasa },
    { name: "SENIFSA", data: accounts.dept_senifsa },
  ];

  // Prepare breakdown table data
  const tableData = [
    {
      account: "College General",
      payments: accounts.college_general.paymentCount,
      maintenanceCollected: accounts.college_general.maintenanceCollected,
      expenses: accounts.college_general.expenses,
      available: accounts.college_general.availableBalance,
    },
    ...departmentAccounts.map((dept) => ({
      account: dept.name,
      payments: dept.data.paymentCount,
      maintenanceCollected: dept.data.maintenanceCollected,
      expenses: dept.data.expenses,
      available: dept.data.availableBalance,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Overall Maintenance Metrics */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" /> Total Maintenance
              Collected
            </span>
          }
          value={`₦${totalMaintenance.toLocaleString()}`}
          subtitle="From all payments"
          color="blue"
        />
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" /> Maintenance Used
            </span>
          }
          value={`₦${maintenanceExpenses.toLocaleString()}`}
          subtitle="Total spent"
          color="orange"
        />
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-green-500" /> Available
              Maintenance
            </span>
          }
          value={`₦${availableMaintenance.toLocaleString()}`}
          subtitle="Remaining balance"
          color="green"
        />
      </div>

      {/* Per-Account Maintenance Breakdown */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {/* College General */}
        <StatsCard
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-500" /> College General
            </span>
          }
          value={`₦${accounts.college_general.maintenanceCollected.toLocaleString()}`}
          subtitle={`Payments: ${accounts.college_general.paymentCount.toLocaleString()}, Expenses: ₦${accounts.college_general.expenses.toLocaleString()}`}
          color="purple"
        />

        {/* Departments */}
        {departmentAccounts.map((dept) => (
          <StatsCard
            key={dept.name}
            title={
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> {dept.name}
              </span>
            }
            value={`₦${dept.data.maintenanceCollected.toLocaleString()}`}
            subtitle={`Payments: ${dept.data.paymentCount.toLocaleString()}, Expenses: ₦${dept.data.expenses.toLocaleString()}`}
            color="blue"
          />
        ))}
      </div>

      {/* Detailed Breakdown Table */}
      <div className="mt-6">
        <MaintenanceBreakdownTable
          title="Maintenance Breakdown by Account"
          data={tableData.map((row) => ({
            account: row.account,
            payments: row.payments,
            maintenanceCollected: row.maintenanceCollected,
            expenses: row.expenses,
            available: row.available,
          }))}
        />
      </div>
    </div>
  );
};
