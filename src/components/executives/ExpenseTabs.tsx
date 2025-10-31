import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { FinancialStats } from "@/types/expense.types";
import { AccountBalanceCard } from "./AccountBalanceCard";
import { AccountBalanceSkeleton } from "./AccountBalanceSkeleton";

// Define the account types
type AccountKey =
  | "dept_comssa"
  | "dept_icitsa"
  | "dept_cydasa"
  | "dept_senifsa"
  | "college_general"
  | "maintenance";

interface ExpenseTabsProps {
  adminRole?: string;
  adminDepartment?: string;
  financialStats: FinancialStats | null;
  loading: boolean;
  cacheAvailable: boolean;
}

const getAvailableAccounts = (
  adminRole: string,
  adminDepartment?: string
): AccountKey[] => {
  let accounts: AccountKey[] = [];

  if (adminRole === "college_admin") {
    accounts = ["college_general"];
  } else if (adminRole === "dept_admin" && adminDepartment) {
    const departmentMap = {
      "Computer Science": "dept_comssa",
      "Software Engr & Information Systems": "dept_senifsa",
      "Cybersecurity & Data Science": "dept_cydasa",
      "ICT & Information Technology": "dept_icitsa",
    } as const;
    const account =
      departmentMap[adminDepartment as keyof typeof departmentMap];
    if (account) accounts = [account];
  } else if (adminRole === "super_admin" || adminRole === "director_finance") {
    accounts = [
      "college_general",
      "dept_comssa",
      "dept_icitsa",
      "dept_cydasa",
      "dept_senifsa",
      "maintenance",
    ];
  }


  return accounts;
};

const getVisibleTabs = (adminRole: string) => {
  const tabs = ["overview"];

  if (
    adminRole === "super_admin" ||
    adminRole === "director_finance" ||
    adminRole === "college_admin"
  ) {
    tabs.push("college");
  }

  if (
    adminRole === "super_admin" ||
    adminRole === "director_finance" ||
    adminRole === "dept_admin"
  ) {
    tabs.push("departmental");
  }

  return tabs;
};

const getAccountBalances = (
  financialStats: FinancialStats | null,
  adminRole: string,
  adminDepartment?: string
): Record<AccountKey, number> => {
  if (!financialStats) {
    return {} as Record<AccountKey, number>;
  }

  const balances: Partial<Record<AccountKey, number>> = {};
  const availableAccounts = getAvailableAccounts(adminRole, adminDepartment);

  availableAccounts.forEach((account) => {
    const balance =
      account === "maintenance"
        ? financialStats.availableMaintenance
        : financialStats.accounts[account]?.availableBalance || 0;

    balances[account] = balance;

  });



  return balances as Record<AccountKey, number>;
};


export const ExpenseTabs: React.FC<ExpenseTabsProps> = ({
  adminRole = "",
  adminDepartment,
  financialStats,
  loading,
}) => {


  const visibleTabs = getVisibleTabs(adminRole);
  const accountBalances = getAccountBalances(
    financialStats,
    adminRole,
    adminDepartment
  );


  if (visibleTabs.length <= 1) return null;


  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        {visibleTabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab === "overview" && "Account Overview"}
            {tab === "college" && "College Accounts"}
            {tab === "departmental" && "Departmental Accounts"}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <AccountBalanceSkeleton />
              <AccountBalanceSkeleton />
              <AccountBalanceSkeleton />
            </>
          ) : financialStats ? (
            <>
              {Object.entries(accountBalances).map(([account, balance]) => (
                <AccountBalanceCard
                  key={account}
                  account={account as AccountKey}
                  balance={balance}
                  stats={financialStats}
                />
              ))}
              {(adminRole === "super_admin" ||
                adminRole === "director_finance") && (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Total Net Balance</CardTitle>
                    <CardDescription>
                      Combined available balance across all accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ₦
                      {[
                        accountBalances.college_general,
                        accountBalances.dept_comssa,
                        accountBalances.dept_cydasa,
                        accountBalances.dept_icitsa,
                        accountBalances.dept_senifsa,
                      ]
                        .map((b) => b || 0)
                        .reduce((sum, b) => sum + b, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      College: ₦
                      {accountBalances.college_general.toLocaleString()} |
                      Departments: ₦
                      {(
                        (accountBalances.dept_comssa || 0) +
                        (accountBalances.dept_cydasa || 0) +
                        (accountBalances.dept_icitsa || 0) +
                        (accountBalances.dept_senifsa || 0)
                      ).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">
                Failed to load financial statistics
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {visibleTabs.includes("college") && (
        <TabsContent value="college">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <>
                <AccountBalanceSkeleton />
                <AccountBalanceSkeleton />
              </>
            ) : financialStats ? (
              <>
                {accountBalances.college_general !== undefined && (
                  <AccountBalanceCard
                    account="college_general"
                    balance={accountBalances.college_general}
                    stats={financialStats}
                  />
                )}
                {accountBalances.maintenance !== undefined && (
                  <AccountBalanceCard
                    account="maintenance"
                    balance={accountBalances.maintenance}
                    stats={financialStats}
                  />
                )}
              </>
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">
                  Failed to load college accounts
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      )}

      {visibleTabs.includes("departmental") && (
        <TabsContent value="departmental">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <>
                <AccountBalanceSkeleton />
                <AccountBalanceSkeleton />
                <AccountBalanceSkeleton />
                <AccountBalanceSkeleton />
              </>
            ) : financialStats ? (
              <>
                {accountBalances.dept_comssa !== undefined && (
                  <AccountBalanceCard
                    account="dept_comssa"
                    balance={accountBalances.dept_comssa}
                    stats={financialStats}
                  />
                )}
                {accountBalances.dept_icitsa !== undefined && (
                  <AccountBalanceCard
                    account="dept_icitsa"
                    balance={accountBalances.dept_icitsa}
                    stats={financialStats}
                  />
                )}
                {accountBalances.dept_cydasa !== undefined && (
                  <AccountBalanceCard
                    account="dept_cydasa"
                    balance={accountBalances.dept_cydasa}
                    stats={financialStats}
                  />
                )}
                {accountBalances.dept_senifsa !== undefined && (
                  <AccountBalanceCard
                    account="dept_senifsa"
                    balance={accountBalances.dept_senifsa}
                    stats={financialStats}
                  />
                )}
              </>
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-muted-foreground">
                  Failed to load departmental accounts
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};
