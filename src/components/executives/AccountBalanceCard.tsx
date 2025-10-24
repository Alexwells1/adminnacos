import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Shield, Wallet } from "lucide-react";
import type { FinancialStats } from "@/types/expense.types";

const ACCOUNT_CONFIG = {
  college_general: {
    name: "College General Fund",
    icon: Building,
    description: "College dues and expenses",
    color: "blue",
  },
  dept_comssa: {
    name: "COMSSA Department",
    icon: Users,
    description: "Computer Science department",
    color: "green",
  },
  dept_icitsa: {
    name: "ICITSA Department",
    icon: Users,
    description: "Information Technology department",
    color: "purple",
  },
  dept_cydasa: {
    name: "CYDASA Department",
    icon: Shield,
    description: "Cyber Security department",
    color: "red",
  },
  dept_senifsa: {
    name: "SENIFSA Department",
    icon: Users,
    description: "Software Engineering department",
    color: "orange",
  },
  maintenance: {
    name: "Maintenance Fund",
    icon: Wallet,
    description: "System maintenance expenses",
    color: "gray",
  },
} as const;

interface AccountBalanceCardProps {
  account: keyof typeof ACCOUNT_CONFIG;
  balance: number;
  stats: FinancialStats;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  account,
  balance,
  stats,
}) => {
 const config = ACCOUNT_CONFIG[account];
 if (!config) {
   console.error(`Invalid account type: ${account}`);
   return null; // or render a fallback UI
 }
 const Icon = config.icon;


  const getAccountData = () => {
    if (account === "maintenance") {
      return {
        revenue: stats.totalMaintenance,
        expenses: stats.maintenanceExpenses,
      };
    } else {
      const accountData =
        stats.accounts[account as keyof typeof stats.accounts];
      return {
        revenue: accountData?.totalRevenue || 0,
        expenses: accountData?.expenses || 0,
      };
    }
  };

  const accountData = getAccountData();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{config.name}</CardTitle>
          </div>
          <Badge variant="secondary">
            {account === "maintenance" ? "Maintenance" : "Account"}
          </Badge>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Available Balance
            </span>
            <span className="text-lg font-bold text-green-600">
              ₦{balance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Revenue</span>
            <span>₦{accountData.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Expenses</span>
            <span className="text-red-600">
              ₦{accountData.expenses.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
