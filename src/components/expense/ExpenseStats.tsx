import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCardSkeleton } from "../executives/SummaryCardSkeleton";

interface ExpenseStatsProps {
  stats?: {
    collegeCount?: number;
    collegeAmount?: number;
    departmentalCount?: number;
    departmentalAmount?: number;
    maintenanceAmount?: number;
    totalCount?: number;
    totalAmount?: number;
    collegeExpenses?: any[];
    departmentalExpenses?: any[];
    maintenanceExpenses?: any[];
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

  // Apply 0 defaults so no undefined crash
  const {
    totalCount = 0,
    totalAmount = 0,
    collegeCount = 0,
    collegeAmount = 0,
    departmentalCount = 0,
    departmentalAmount = 0,
    maintenanceAmount = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">
            ₦{totalAmount.toLocaleString()} total
          </p>
        </CardContent>
      </Card>

      {/* College */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            College Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{collegeCount}</div>
          <p className="text-xs text-muted-foreground">
            ₦{collegeAmount.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Departmental */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Departmental Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{departmentalCount}</div>
          <p className="text-xs text-muted-foreground">
            ₦{departmentalAmount.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Maintenance Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{maintenanceAmount.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
