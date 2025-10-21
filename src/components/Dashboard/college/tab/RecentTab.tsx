import React from "react";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats, Payment } from "@/types/admin.types";

interface RecentTabProps {
  recentPayments: Payment[];
  stats: DashboardStats;
}

export const RecentTab: React.FC<RecentTabProps> = ({
  recentPayments,
  stats,
}) => {
  const financialStats = stats.financialStats;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">
        Recent College Activities
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentActivities
          payments={recentPayments}
          title="Recent College Payments"
        />

        {/* College Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>College Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                College Revenue
              </span>
              <span className="text-sm font-medium">
                ₦{stats?.totalRevenue?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                College Payments
              </span>
              <span className="text-sm font-medium">
                {stats?.totalPayments?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                College Balance
              </span>
              <span className="text-sm font-medium text-green-600">
                ₦
                {financialStats?.accounts?.college_general?.availableBalance?.toLocaleString() ||
                  "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                College Expenses
              </span>
              <span className="text-sm font-medium text-orange-600">
                ₦
                {financialStats?.accounts?.college_general?.expenses?.toLocaleString() ||
                  "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                College Students
              </span>
              <span className="text-sm font-medium text-blue-600">
                {stats.recentPayments?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
