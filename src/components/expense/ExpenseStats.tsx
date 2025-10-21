import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCardSkeleton } from "../executives/SummaryCardSkeleton";


interface ExpenseStatsProps {
  stats: {
    totalCount: number;
    totalAmount: number;
    collegeExpenses: any[];
    departmentalExpenses: any[];
    maintenanceExpenses: any[];
  };
  loading: boolean;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCount}</div>
          <p className="text-xs text-muted-foreground">
            ₦{stats.totalAmount.toLocaleString()} total
          </p>
        </CardContent>
      </Card>

      {stats.collegeExpenses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              College Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.collegeExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ₦
              {stats.collegeExpenses
                .reduce((sum, e) => sum + e.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}

      {stats.departmentalExpenses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departmental Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.departmentalExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ₦
              {stats.departmentalExpenses
                .reduce((sum, e) => sum + e.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}

      {stats.maintenanceExpenses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maintenance Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.maintenanceExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ₦
              {stats.maintenanceExpenses
                .reduce((sum, e) => sum + e.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
