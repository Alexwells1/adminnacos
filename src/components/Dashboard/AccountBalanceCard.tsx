// components/dashboard/AccountBalanceCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AccountBalanceCardProps {
  accountName: string;
  totalRevenue: number;
  expenses: number;
  availableBalance: number;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  accountName,
  totalRevenue,
  expenses,
  availableBalance,
}) => {
  const progress = totalRevenue > 0 ? (expenses / totalRevenue) * 100 : 0;

  const getProgressColor = (progress: number) => {
    if (progress > 80) return "bg-red-500";
    if (progress > 60) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold capitalize">
          {accountName.replace(/_/g, " ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Utilization</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className={getProgressColor(progress)} />
        </div>

        {/* Financial Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Revenue</span>
            <span className="text-xs font-medium">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Expenses</span>
            <span className="text-xs font-medium">
              ₦{expenses.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-xs font-medium">Available</span>
            <Badge
              variant={availableBalance > 0 ? "default" : "destructive"}
              className="text-xs font-medium"
            >
              ₦{availableBalance.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
