import React from "react";
import { StatsCard } from "@/components/Dashboard/StatsCards";
import { AccountBalanceCard } from "@/components/Dashboard/AccountBalanceCard";
import type { FinancialStats } from "@/types/admin.types";

interface FinancialTabProps {
  financialStats: FinancialStats;
}

export const FinancialTab: React.FC<FinancialTabProps> = ({
  financialStats,
}) => {
  const accountColors = ["blue", "green", "purple", "orange", "red"] as const;

  return (
    <>
      <h2 className="text-lg font-semibold">Account Balances</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Object.entries(financialStats.accounts).map(
          ([account, data], index) => (
            <AccountBalanceCard
              key={account}
              accountName={formatAccountName(account)}
              totalRevenue={data.totalRevenue}
              expenses={data.expenses}
              availableBalance={data.availableBalance}
              color={accountColors[index % 5]}
            />
          )
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Net Balance"
          value={`₦${financialStats.netBalance.toLocaleString()}`}
          subtitle="Total available"
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={`₦${financialStats.totalExpenses.toLocaleString()}`}
          subtitle="All accounts"
          color="red"
        />
        <StatsCard
          title="Accounts"
          value={Object.keys(financialStats.accounts).length.toString()}
          subtitle="Active accounts"
          color="blue"
        />
        <StatsCard
          title="Maintenance Ratio"
          value={`${(
            (financialStats.availableMaintenance /
              financialStats.totalMaintenance) *
            100
          ).toFixed(1)}%`}
          subtitle="Available vs Total"
          color="purple"
        />
      </div>
    </>
  );
};

// Helper function to format account names
const formatAccountName = (account: string): string => {
  const nameMap: Record<string, string> = {
    college_general: "College General",
    dept_comssa: "COMSSA",
    dept_icitsa: "ICITSA",
    dept_cydasa: "CYDASA",
    dept_senifsa: "SENIFSA",
  };

  return (
    nameMap[account] ||
    account
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};
