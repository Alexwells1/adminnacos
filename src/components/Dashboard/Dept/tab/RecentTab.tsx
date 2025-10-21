import React from "react";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  DashboardStats,
  Payment,
  FinancialStats,
} from "@/types/admin.types";

interface RecentTabProps {
  recentPayments: Payment[];
  stats: DashboardStats;
  getDepartmentAccountKey: () => keyof FinancialStats["accounts"];
  getDepartmentDisplayName: () => string;
}

export const RecentTab: React.FC<RecentTabProps> = ({
  recentPayments,
  stats,
  getDepartmentAccountKey,
  getDepartmentDisplayName,
}) => {
  const accountKey = getDepartmentAccountKey();
  const departmentAccount = stats.financialStats?.accounts[accountKey];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Department Activities</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentActivities
          payments={recentPayments}
          title={`Recent ${getDepartmentDisplayName()} Payments`}
        />

        {/* Department Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Department Revenue
              </span>
              <span className="text-sm font-medium">
                ₦{stats?.totalDeptRevenue?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Payments
              </span>
              <span className="text-sm font-medium">
                {stats?.totalDeptPayments?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Available Balance
              </span>
              <span className="text-sm font-medium text-green-600">
                ₦{departmentAccount?.availableBalance.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Department Expenses
              </span>
              <span className="text-sm font-medium text-orange-600">
                ₦{departmentAccount?.expenses.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Student Count
              </span>
              <span className="text-sm font-medium text-blue-600">
                {stats.departmentStudents?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
