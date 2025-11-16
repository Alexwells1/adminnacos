import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AccountBalanceCardProps {
  accountName: string;
  totalRevenue: number;
  grossRevenue?: number;
  expenses: number;
  availableBalance: number;
  maintenanceCollected?: number;
  paymentCount?: number;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal";
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  accountName,
  totalRevenue,
  grossRevenue = 0,
  expenses,
  availableBalance,
  maintenanceCollected = 0,
  paymentCount = 0,
  color = "blue",
}) => {
  const progress = totalRevenue > 0 ? (expenses / totalRevenue) * 100 : 0;

  const getProgressColor = (progress: number) => {
    if (progress > 80) return "bg-red-500";
    if (progress > 60) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full border">
      <CardHeader className="pb-2">
        <CardTitle
          className={`text-sm font-semibold capitalize text-${color}-600`}
        >
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
          {/* Gross Revenue */}
          {grossRevenue > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Gross Revenue
              </span>
              <span className="text-xs font-medium">
                ₦{grossRevenue.toLocaleString()}
              </span>
            </div>
          )}

          {/* Net Revenue */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Net Revenue</span>
            <span className="text-xs font-medium">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>

          {/* Expenses */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Expenses</span>
            <span className="text-xs font-medium">
              ₦{expenses.toLocaleString()}
            </span>
          </div>

          {/* Maintenance Collected */}
          {maintenanceCollected > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Maintenance</span>
              <span className="text-xs font-medium">
                ₦{maintenanceCollected.toLocaleString()}
              </span>
            </div>
          )}

          {/* Payment Count */}
          {paymentCount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Payments</span>
              <span className="text-xs font-medium">{paymentCount}</span>
            </div>
          )}

          {/* Available Balance */}
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
